from django.shortcuts import render, redirect
from django.contrib.auth import login, logout 
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.conf import settings
from .forms import SignUpForm

def signup_view(request):
    """
    회원가입 뷰 (GET, POST)
    """
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)  
            user.set_password(form.cleaned_data['password'])
            user.save()
            login(request, user)
            return redirect(settings.LOGIN_REDIRECT_URL) 
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
            return redirect(next_url)
    else:
        form = AuthenticationForm()
        
    return render(request, 'accounts/login.html', {'form': form})

@login_required
def logout_view(request):
    """
    로그아웃 
    """
    logout(request)
    return redirect(settings.LOGOUT_REDIRECT_URL)

