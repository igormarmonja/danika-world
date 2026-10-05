@echo off
chcp 65001 >nul
title Публікація гри "Світ Даніки та Бруно" на GitHub Pages
echo ============================================================================
echo   🚀 ПУБЛІКАЦІЯ ГРИ "СВІТ ДАНІКИ ТА БРУНО" В ІНТЕРНЕТ (GITHUB PAGES)
echo ============================================================================
echo.
echo КРОК 1: Якщо у вас ще немає порожнього репозиторію на GitHub:
echo   1. Відкрийте у браузері: https://github.com/new
echo   2. У полі "Repository name" напишіть: danika-world
echo   3. Оберіть "Public" (Публічний) та натисніть зелену кнопку "Create repository"
echo.
set /p REPO_URL="Вставте посилання на ваш GitHub репозиторій (наприклад https://github.com/ВашеІмя/danika-world.git): "

if "%REPO_URL%"=="" (
    echo [!] Посилання не введено. Спробуйте ще раз!
    pause
    exit /b 1
)

echo.
echo 📦 Підготовка та відправка файлів на GitHub...
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
    echo   Залишився останній клік на сайті GitHub, щоб увімкнути сайт:
    echo   1. Перейдіть у вкладку "Settings" (Налаштування) вашого репозиторію
    echo   2. Зліва натисніть "Pages"
    echo   3. У розділі "Branch" оберіть "main" замість "None" і натисніть "Save"
    echo   4. Через 1-2 хвилини гра працюватиме в інтернеті!
    echo ============================================================================
) else (
    echo.
    echo [!] Сталася помилка під час відправки. Перевірте посилання або авторизацію у вікні GitHub.
)
echo.
pause
