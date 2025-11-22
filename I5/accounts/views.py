from django.shortcuts import render, redirect
from django.contrib.auth import login, logout 
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.conf import settings
from .forms import SignUpForm, UserUpdateForm
from words.models import Bookmark 
from .services import *


def signup_view(request):
    """
    회원가입 뷰 (POST)
    """
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)  
            user.set_password(form.cleaned_data['password'])
            user.save()
            return redirect('accounts:login')

    else:
        form = SignUpForm()
    
    return render(request, 'accounts/signup.html', {'form': form})

def login_view(request):
    """
    로그인 뷰 (GET, POST)
    """
    if request.user.is_authenticated:
        return redirect(settings.LOGIN_REDIRECT_URL)

    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)  # 세션에 사용자 로그인
            
            next_url = request.GET.get('next', settings.LOGIN_REDIRECT_URL)
            return redirect('main')
    else:
        form = AuthenticationForm()
        
    return render(request, 'accounts/login.html', {'form': form})

@login_required
def logout_view(request):
    """
    로그아웃 
    """
    if request.method == 'POST':
        logout(request) 
        return redirect('main') 
    
    return render(request, 'accounts/logout.html')

@login_required
def profile_update_view(request):
    if request.method == 'POST':  
        form = UserUpdateForm(request.POST, instance=request.user)
        if form.is_valid():
            update_user_profile(form)
            return redirect('accounts:profile')
        else:
            form = UserUpdateForm(instance=request.user)
            
        return render(request, 'accounts/profile.html', {'form': form})

@login_required
def profile_view(request):
    """
    프로필 뷰 (View Profile)
    """
    user = request.user
    bookmark_count = Bookmark.objects.filter(user_id = user.id).count()
    user_rank = get_user_best_rank(user)

    form = UserUpdateForm(instance=user)

    context = {
        'user': user,
        'bookmark_count' : bookmark_count,
        'user_rank' : user_rank,
        'form': form, 
    }
    return render(request, 'accounts/profile.html', context)