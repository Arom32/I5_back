import json
from django.shortcuts import render
from .models import GameUserScore
from django.db.models.functions import Rank
from django.db.models import Window, F
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from words.models import Word,Definition
from .services import *

def main(request):
    '''
    /game/
    게임 메인 페이지
    '''
    if request.method == 'GET':
        leaderboard = GameUserScore.objects.annotate(
            rank_val=Window(
                expression=Rank(),           
                order_by=F('score').desc()  
            )
        ).order_by('rank_val')[:20]          

        context = {
            'leaderboard': leaderboard
        }
        return render(request, 'game/main.html', context=context)


@require_POST
def start_game(request):
    '''
    게임 시작 요청

    '''
    try: # try 문 추가

        new_game = set_game_start_user(request)       
        return JsonResponse({'game_id': new_game.id})
        
    except Exception as e:
        print(f"!!! 게임 생성 실패: {e} !!!") 
        return JsonResponse({'error': str(e)}, status=500)
    

# 2. 퀴즈 데이터 가져오기 (GET)
def get_quiz(request):
    try:
        quiz_data = gen_game_quiz()
        
        if quiz_data is None:
            return JsonResponse({'error': '데이터 부족'}, status=404)
            
        return JsonResponse(quiz_data)
        
    except Exception as e:
        print(f"Quiz Error: {e}")
        return JsonResponse({'error': '서버 오류'}, status=500)

# 3. 정답 확인 및 점수 업데이트 (POST)
@require_POST
def check_answer(request):
    try:
        data = json.loads(request.body)
        game_id = data.get('game_id')
        word_id = data.get('word_id')
        selected_id = data.get('selected_id')

        # 정답 검증 로직 (동일) ...
        word = get_object_or_404(Word, id=word_id)
        is_correct = word.definitions.filter(id=selected_id).exists()

        # [수정] 유저 식별 로직 변경
        # 로그인 유저면 user 필드로, 아니면 user=None인 상태에서 game_id로만 식별
        if request.user.is_authenticated:
            rank = get_object_or_404(GameUserScore, id=game_id, user=request.user)
        else:
            # Guest는 user가 None이므로 id와 user__isnull=True로 검색
            rank = get_object_or_404(GameUserScore, id=game_id, user__isnull=True)

        if is_correct:
            rank.score = F('score') + 10
            rank.save()
            rank.refresh_from_db()
    
        return JsonResponse({
            'is_correct': is_correct,
            'current_score': rank.score
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

# 4. 결과 페이지
def game_result(request):
    # 가장 최근 게임 기록을 가져와서 보여줌
    game_id = request.GET.get('game_id')
    score = 0
    if game_id:
        try:
            # 방금 끝난 게임의 점수 조회
            record = GameUserScore.objects.get(id=game_id)
            score = record.score
        except GameUserScore.DoesNotExist:
            score = 0
            
    # [추가된 부분] 결과 페이지에도 랭킹 데이터를 같이 보내야 함!
    leaderboard = GameUserScore.objects.order_by('-score')[:10]

    context = {
        'player_name': record.player_name,
        'score': score,
        'leaderboard': leaderboard, 
    }

    
    return render(request, 'game/result.html', context=context)