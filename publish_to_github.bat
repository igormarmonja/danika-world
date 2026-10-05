@echo off
chcp 65001 >nul
title Публікація гри "Світ Даніки та Бруно" на GitHub Pages
echo ============================================================================
echo   🚀 ПУБЛІКАЦІЯ ГРИ "СВІТ ДАНІКИ ТА БРУНО" НА GITHUB (igormarmonja/danika-world)
echo ============================================================================
echo.
set REPO_URL=https://github.com/igormarmonja/danika-world.git
echo 📦 Відправка файлів у репозиторій: %REPO_URL%
echo.

git branch -M main
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
git add .
git commit -m "Update Danika & Bruno Adventure World" >nul 2>&1
git push -u origin main --force

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================================================
    echo   ✅ УСПІШНО ЗАВАНТАЖЕНО НА GITHUB!
    echo ============================================================================
    echo   🎮 Гра для Даніки:
    echo      https://igormarmonja.github.io/danika-world/
    echo.
    echo   📱 Мобільний Пульт для Мами і Тата:
    echo      https://igormarmonja.github.io/danika-world/parent.html?code=DANIKA-777
    echo ============================================================================
) else (
    echo.
    echo [!] Сталася помилка під час відправки. Якщо з'явилося вікно входу GitHub — підтвердіть вхід і запустіть цей файл ще раз.
)
echo.
pause
