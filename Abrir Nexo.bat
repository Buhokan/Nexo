@echo off
title Nexo — Finanzas Personales
color 0A

echo.
echo  ================================================
echo       NEXO - Finanzas Personales
echo  ================================================
echo.
echo  Iniciando servidor de desarrollo...
echo  La aplicacion se abrira automaticamente.
echo.
echo  Para cerrar Nexo, cierra esta ventana.
echo  ================================================
echo.

:: Ir a la carpeta del proyecto
cd /d "%~dp0"

:: Verificar si node_modules existe
if not exist "node_modules\" (
    echo  [!] Primera ejecucion detectada. Instalando dependencias...
    echo      Esto puede tomar unos minutos.
    echo.
    call npm install
    echo.
)

:: Verificar si hay un puerto disponible y abrir el navegador despues de 4 segundos
start /b "" cmd /c "timeout /t 4 /nobreak >nul && start http://localhost:3000"

:: Iniciar el servidor
call npm run dev

pause
