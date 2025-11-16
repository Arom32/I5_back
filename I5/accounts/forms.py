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