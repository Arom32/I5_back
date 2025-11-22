from django.urls import path
from . import views

app_name = 'game'
urlpatterns = [
    path('', views.main, name='main'),
    path('start/', views.start_game, name='start_game'),         
    path('get-quiz/', views.get_quiz, name='get_quiz'),           
    path('check-answer/', views.check_answer, name='check_answer'), 
    path('play/<int:game_id>/', views.play_game, name='play_game'),
    path('result/', views.game_result, name='game_result'),
]