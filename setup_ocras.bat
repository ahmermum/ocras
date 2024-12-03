@echo off
setlocal enabledelayedexpansion

:: Create main directories
mkdir src\app\teacher src\app\student src\components src\lib src\data

:: Create empty files
echo.> src\app\layout.tsx
echo.> src\app\page.tsx
echo.> src\app\teacher\page.tsx
echo.> src\app\student\page.tsx

:: Create empty component files
set "components=TeacherSetup StudentAssessment QuestionDisplay CodeEditor FeedbackDisplay NavigationControls"
for %%c in (%components%) do (
    echo.> src\components\%%c.tsx
)

:: Create empty lib files
echo.> src\lib\types.ts
echo.> src\lib\utils.ts

:: Create empty data file
echo.> src\data\questions.json

echo Folder structure and empty files created successfully!