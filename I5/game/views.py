import json
from django.shortcuts import render,get_object_or_404
from .models import GameUserScore
from django.db.models.functions import Rank
from django.db.models import Window, F
from django.http import JsonResponse


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
        ).order_by('rank_val')[:10]          

        context = {
            'leaderboard': leaderboard
        }
        return render(request, 'game/main.html', context=context)

def start_game(request):
    '''
    게임 시작 요청

    '''
    if(request.method == 'POST'):
        try: # try 문 추가

            new_game = set_game_start_user(request)       
            return JsonResponse({'game_id': new_game.id})
            
        except Exception as e:
            print(f"!!! 게임 생성 실패: {e} !!!") 
            return JsonResponse({'error': str(e)}, status=500)
        

# 2. 퀴즈 데이터 가져오기 (GET)
def get_quiz(request):
    '''
    [return]
    quiz(dict) = {
        'word_id': int,
        'quiz_word': str,
        'options': [
            {'id': int, 'text': str},
            ...
        ]
    }
    '''
    try:
        quiz_data = gen_game_quiz()
        
        if quiz_data is None:
            return JsonResponse({'error': '데이터 부족'}, status=404)
            
        return JsonResponse(quiz_data)
        
    except Exception as e:
        print(f"Quiz Error: {e}")
        return JsonResponse({'error': '서버 오류'}, status=500)

# 3. 정답 확인 및 점수 업데이트 (POST)
def check_answer(request):
    if(request.method == 'POST'):
        try:
            data = json.loads(request.body)
            game_id = data.get('game_id')
            word_id = data.get('word_id')
            selected_id = data.get('selected_id')

            result = check_quiz_answer(game_id, word_id, selected_id)
        
            return JsonResponse(result)

        except Exception as e:
            print(f"Answer Error: {e}")
            return JsonResponse({'error': str(e)}, status=500)

def game_result(request):
    '''
    게임 결과 페이지
    
    '''
    game_id = request.GET.get('game_id')
    context = get_player_game_result(game_id)

    return render(request, 'game/gameResult.html', context=context)

def play_game(request, game_id):
    '''
    게임 진행 페이지
    URL: /game/play/<int:game_id>/
    '''
    
    game = get_object_or_404(GameUserScore, id=game_id)
    
    context = {
        'game_id': game_id,
        'player_name': game.player_name
    }
    return render(request, 'game/play.html', context)