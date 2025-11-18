from django import forms
from django.contrib.auth.models import User


class SignUpForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    password_confirm = forms.CharField(widget=forms.PasswordInput, label='비밀번호 확인')

    class Meta:
        model = User
        fields = ['username', 'email']

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        password_confirm = cleaned_data.get('password_confirm')

        if password != password_confirm:
            raise forms.ValidationError('비밀번호가 일치하지 않습니다.')
        

class UserUpdateForm(forms.ModelForm):
    """
    회원 정보 수정 폼
    """
    class Meta:
        model = User
        # 수정: first_name, last_name 제외
        fields = ['username', 'email'] 
        
    def clean_email(self):
        """
        이메일 중복 검사 (Validation)
        현재 자신의 이메일은 제외하고 중복 여부 확인
        """
        email = self.cleaned_data.get('email')
        if email and User.objects.filter(email=email).exclude(username=self.instance.username).exists():
            raise forms.ValidationError("이미 사용 중인 이메일입니다.")
        return email