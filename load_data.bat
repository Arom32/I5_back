@echo off
chcp 65001 > nul

echo [경고] 데이터베이스를 초기화하고 데이터를 로드합니다.
echo 기존 데이터는 모두 삭제됩니다!
cd I5

:: 1. DB 초기화 (모든 데이터 삭제, 테이블은 유지)
:: --no-input: '정말 지우시겠습니까?' 질문 스킵

:: 사용자 입력 받기 (변수명: confirm)
set /p confirm="진행하시려면 'y'를 입력하세요 (그 외 입력 시 취소): "

:: 대소문자 구분 없이(y/Y) 입력값이 y가 아니면 종료
if /i "%confirm%" NEQ "y" (
    echo.
    echo [취소] 작업이 중단되었습니다.
    pause
    exit /b
)

echo.
echo [1/2] 데이터베이스 초기화 중...
python manage.py flush --no-input

echo.
echo [2/2] 데이터 로드 중...
python manage.py loaddata data.json
echo.

echo [성공] DB가 초기화되고 새 데이터로 채워졌습니다.
cd ..
pause