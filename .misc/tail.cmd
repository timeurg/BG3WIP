@Echo Off

If "%~1"=="" Echo Syntax error& Exit /B
If "%~2"=="" Set $N=10& Set $F=%~1
If Not "%~2"=="" Set $N=%~1& Set $F=%~2
If Not Exist "%$F%" Echo File not found& Exit /B

For /F %%i In ('Type "%$F%"^|Find /C /V ""') Do Set /A $M=%%i-%$N%
For /F "Tokens=1* Delims=][" %%i In ('Type "%$F%"^|Find /N /V ""') Do If %%i GTR %$M% Echo.%%j