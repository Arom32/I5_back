from game.models import GameUserScore 
from django.db.models import Max

def get_user_best_rank(target_user):
    """
    특정 유저(User 객체)의 최고 랭크를 반환하는 함수
    """
    best_record = GameUserScore.objects.filter(user=target_user).order_by('-score').first()

    if best_record is None:
        return None 

    best_score = best_record.score 

    count_higher_scores = GameUserScore.objects.filter(score__gt=best_score).count()
    rank = count_higher_scores + 1
    
    return rank

def update_user_profile(form):
    """
    유저 프로필을 업데이트하고, 연동된 게임 기록의 닉네임도 동기화하는 서비스 로직
    """
   
    updated_user = form.save()
    GameUserScore.objects.filter(user=updated_user).update(player_name=updated_user.username)
    
    return updated_user