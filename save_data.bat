@echo off
:: 한글 깨짐 방지 설정
chcp 65001 > nul

echo [데이터 추출 시작] 더미 데이터를 data.json으로 저장합니다...
set PYTHONIOENCODING=utf-8
cd I5
:: 제외 항목: contenttypes, auth.permission, admin.logentry, sessions (충돌 주범)
python manage.py dumpdata --natural-foreign --natural-primary --exclude contenttypes --exclude auth.permission --exclude admin.logentry --exclude sessions --indent 4 > data.json

echo.
echo [성공] data.json 파일이 생성되었습니다.
cd ..
pause