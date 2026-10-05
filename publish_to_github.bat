@echo off
chcp 65001 >nul
title Публікація гри "Світ Даніки та Бруно" на GitHub Pages
echo ============================================================================
echo   🚀 ПУБЛІКАЦІЯ ГРИ "СВІТ ДАНІКИ ТА БРУНО" НА GITHUB (igormarmonja/danika-world)
echo ============================================================================
echo.

del /f /q ".git\index.lock" >nul 2>&1

set REPO_URL=https://github.com/igormarmonja/danika-world.git
git branch -M main
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%

echo 🔑 КРОК 1: Перевірка входу в GitHub...
echo (Якщо зараз відкриється браузер або віконце GitHub — натисніть зелену кнопку Authorize / Sign in)
"C:\Program Files\Git\mingw64\bin\git-credential-manager.exe" github login

echo.
echo 📦 КРОК 2: Відправка файлів гри (90 МБ картинок та озвучки) на GitHub...
echo Зачекайте 1-2 хвилини, зараз нижче побіжать відсотки завантаження (Writing objects %%):
echo.
git push -u origin main --force --progress

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================================================
    echo   ✅ УСПІШНО ЗАВАНТАЖЕНО НА GITHUB!
    echo ============================================================================
    echo   Залишився останній клік на сайті GitHub, щоб увімкнути сайт:
    echo   1. Відкрийте: https://github.com/igormarmonja/danika-world/settings/pages
    echo   2. У розділі "Branch" змініть "None" на "main" і натисніть "Save"
    echo.
    echo   Через 1-2 хвилини працюватимуть ваші посилання:
    echo   🎮 Гра для Даніки:
    echo      https://igormarmonja.github.io/danika-world/
    echo.
    echo   📱 Мобільний Пульт для Мами і Тата:
    echo      https://igormarmonja.github.io/danika-world/parent.html?code=DANIKA-777
    echo ============================================================================
    start https://github.com/igormarmonja/danika-world/settings/pages
) else (
    echo.
    echo [!] Сталася помилка під час відправки. Перевірте інтернет або вхід у GitHub.
)
echo.
pause
