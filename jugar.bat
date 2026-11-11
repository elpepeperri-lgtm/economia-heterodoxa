@echo off
rem Doble clic para abrir el juego. Deja esta ventana abierta mientras juegas.
cd /d "%~dp0"
echo.
echo  Abriendo Economia Heterodoxa...
echo  En el computador: abre la direccion "Local".
echo  En el celular (mismo wifi): abre la direccion "Network".
echo  Para cerrar: cierra esta ventana.
echo.
call npm.cmd run dev
pause
