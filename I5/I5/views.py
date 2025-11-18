# my_project/views.py

from django.shortcuts import render

def main(request):
    # settings.py의 TEMPLATES DIRS에 등록된 경로에서 파일을 찾음
    return render(request, 'mainlogbf.html')