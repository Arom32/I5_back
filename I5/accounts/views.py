from django.shortcuts import render, redirect
from django.contrib.auth import login, logout 
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.conf import settings
from .forms import SignUpForm, UserUpdateForm

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
    return render(request, 'accounts/logout.html')


@login_required
def profile_update_view(request):
    """
    프로필 수정 뷰 (Update Profile)
    """
    if request.method == 'POST':
        # instance=request.user: 현재 로그인된 유저 객체를 수정 대상으로 바인딩 (Model Instance Binding)
        form = UserUpdateForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            # 수정 완료 후 이동할 URL (예: 프로필 페이지 or 메인)
            return redirect('accounts:profile') 
    else:
        # GET: 기존 정보를 폼에 채워서 렌더링 (Pre-population)
        form = UserUpdateForm(instance=request.user)
        
    return render(request, 'accounts/profile_update.html', {'form': form})