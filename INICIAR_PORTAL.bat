@echo off
title Portal de Arquitectura de Computadoras - Universidad Aztlan
color 0B
cls
echo ======================================================================
echo    UNIVERSIDAD AZTLAN - INGENIERIA EN SISTEMAS COMPUTACIONALES
echo    PORTAL DE ARQUITECTURA DE COMPUTADORAS (CLAVE 636)
echo    PROFESOR TITULAR: ING. LUIS GARIBALDI
echo ======================================================================
echo.

cd /d "%~dp0"

python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Iniciando con servidor Python...
    start python server.py
    goto end
)

echo Abriendo directamente en el navegador...
start index.html

:end
pause
