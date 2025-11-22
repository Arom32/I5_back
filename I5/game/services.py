from .models import GameUserScore
from words.models import Word, Definition
from django.db.models import F
from django.shortcuts import get_object_or_404


import json, random

def set_game_start_user(request):
    '''
    게임 시작 유저 설정
    '''
    data = json.loads(request.body)
    guest_nickname = data.get('nickname', '익명')
    
    print(f"--- 게임 시작 요청: {guest_nickname} ---") # 로그 출력

    if request.user.is_authenticated: # 로그인한 유저
        new_game = GameUserScore.objects.create(
            user=request.user, 
            player_name=request.user.username,
            score=0
        )
    else: # 익명 유저
        if guest_nickname == '' or guest_nickname is None:
            guest_nickname = 'anonymous'+str(random.randint(1000,9999))
        
        new_game = GameUserScore.objects.create(
            user=None, 
            player_name=guest_nickname, 
            score=0
        )

    print(f"--- 게임 생성 성공: ID {new_game.id} ---") # 로그 출력
    return new_game


def gen_game_quiz():
    """
    퀴즈 데이터를 생성하여 딕셔너리 형태로 반환
    word_id: 단어 ID
    quiz_word: 퀴즈로 출제될 단어 텍스트
    options: 선택지 리스트 (각 선택지는 {'id': 뜻ID, 'text': 뜻텍스트} 형태)
    실패 시 None을 반환
    """
    # 빈출 단어 중 랜덤 1개
    target_word = Word.objects.filter(is_frequent=True).order_by('?').first()
    if not target_word:
        return None

    # 정답 (첫 번째 뜻)
    correct_def = target_word.definitions.first() 
    if not correct_def:
        return None

    # 오답 3개
    wrong_defs = list(Definition.objects.exclude(word=target_word).order_by('?')[:3])
    
    # 합치기 & 섞기
    options = wrong_defs + [correct_def]
    random.shuffle(options)

    return {
        'word_id': target_word.id,
        'quiz_word': target_word.text, 
        'options': [{'id': opt.id, 'text': opt.text} for opt in options]
    }

def get_player_game_result(game_id):
    '''
    방금 끝난 게임의 유저와 점수 조회 + 등수 + 갱신된 랭킹 데이터 조회

    '''
    score = 0
    if game_id:
        try:
            # 방금 끝난 게임의 점수 조회
            record = GameUserScore.objects.get(id=game_id)
            score = record.score
        except GameUserScore.DoesNotExist:
            score = 0
            
    leaderboard = GameUserScore.objects.order_by('-score')[:10]
    player_rank = GameUserScore.objects.filter(score__gt=score).count() + 1 if score > 0 else 'N/A'

    return {
        'player_name': record.player_name,
        'score': score,
        'leaderboard': leaderboard, 
        'player_rank' : player_rank
    }

def check_quiz_answer(game_id, word_id, selected_id):
    '''
    game_id: 게임 기록 ID
    word_id: 퀴즈로 출제된 단어 ID
    selected_id: 사용자가 선택한 뜻 ID

    returns {
        'is_correct': bool,
        'current_score': int
    }
    '''
    # 1. 게임 기록 조회 (GameUserScore의 ID는 고유하므로 user/guest 여부 상관없이 ID로 조회 가능)
    game_record = get_object_or_404(GameUserScore, id=game_id)

    # 2. 정답 검증
    word = get_object_or_404(Word, id=word_id)
    # 해당 단어의 뜻 중에 선택된 ID가 존재하는지 확인
    is_correct = word.definitions.filter(id=selected_id).exists()

    # 3. 점수 업데이트 (Atomic Update)
    if is_correct:
        game_record.score = F('score') + 10
        game_record.save()
        game_record.refresh_from_db() # F() 객체 적용 후 실제 값 갱신
    
    return {
        'is_correct': is_correct,
        'current_score': game_record.score
    }