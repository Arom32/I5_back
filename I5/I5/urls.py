from django.contrib import admin
from django.urls import path, include



urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('main.urls')), # 접속시 바로 보이는 페이지를 main으로 설정
    path('words/', include('words.urls')),
    path('converter/', include('converter.urls')),
    path('accounts/', include('accounts.urls')),
    path('game/', include('game.urls')),
]
