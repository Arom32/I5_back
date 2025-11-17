from .models import GameUserScore
from words.models import Word, Definition

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
    퀴즈 데이터를 생성하여 딕셔너리 형태로 반환합니다.
    실패 시 None을 반환하거나 예외를 발생시킵니다.
    """
    # 1. 빈출 단어 중 랜덤 1개
    target_word = Word.objects.filter(is_frequent=True).order_by('?').first()
    if not target_word:
        return None

    # 2. 정답 (첫 번째 뜻)
    # 역참조 이름이 definition_set 혹은 definitions인지 확인 필요
    correct_def = target_word.definitions.first() 
    if not correct_def:
        return None

    # 3. 오답 3개
    wrong_defs = list(Definition.objects.exclude(word=target_word).order_by('?')[:3])
    
    # 4. 합치기 & 섞기
    options = wrong_defs + [correct_def]
    random.shuffle(options)

    return {
        'word_id': target_word.id,
        'quiz_word': target_word.text, 
        'options': [{'id': opt.id, 'text': opt.text} for opt in options]
    }