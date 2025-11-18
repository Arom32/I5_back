from django.contrib import admin
from django.urls import path, include
from . import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.main, name='main'), # 접속시 바로 보이는 페이지를 main으로 설정
    path('words/', include('words.urls')),
    path('converter/', include('converter.urls')),
    path('accounts/', include('accounts.urls')),
    path('game/', include('game.urls')),
]
