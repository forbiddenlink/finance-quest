# VS Code Shell Integration
if ($env:TERM_PROGRAM -eq "vscode") { . "C:\Users\purpl\AppData\Local\Programs\Microsoft VS Code\resources\app\out\vs\workbench\contrib\terminal\common\scripts\shellIntegration.ps1" }

# Enhanced PowerShell Profile for VS Code Shell Integration
# Finance Quest Development Environment

# Import required modules
Import-Module PSReadLine -ErrorAction SilentlyContinue

# Enhanced PSReadLine configuration for better command detection
if (Get-Module PSReadLine) {
    # Remove the problematic PredictionSource line and use compatible settings
    
    # Enhanced key bindings for VS Code integration
    Set-PSReadLineKeyHandler -Key Tab -Function MenuComplete
    Set-PSReadLineKeyHandler -Key "Ctrl+d" -Function DeleteChar
    Set-PSReadLineKeyHandler -Key "Ctrl+w" -Function BackwardDeleteWord

    # Better command history with VS Code integration
    Set-PSReadLineOption -HistorySearchCursorMovesToEnd
    Set-PSReadLineKeyHandler -Key UpArrow -Function HistorySearchBackward
    Set-PSReadLineKeyHandler -Key DownArrow -Function HistorySearchForward

    # Enhanced colors for better visibility in VS Code terminal
    Set-PSReadLineOption -Colors @{
        Command            = 'DarkCyan'
        Number             = 'DarkGreen'
        Member             = 'DarkMagenta'
        Operator           = 'DarkYellow'
        Type               = 'DarkBlue'
        Variable           = 'Green'
        Parameter          = 'DarkGray'
        ContinuationPrompt = 'DarkGray'
        Default            = 'White'
    }
}

# VS Code shell integration enhancements
if ($env:TERM_PROGRAM -eq "vscode") {
    # Set window title for better identification
    $Host.UI.RawUI.WindowTitle = "Finance Quest Development - PowerShell"
}

# Development aliases for Finance Quest project
Set-Alias -Name dev -Value "npm run dev"
Set-Alias -Name build -Value "npm run build"
Set-Alias -Name test -Value "npm test"
Set-Alias -Name lint -Value "npm run lint"

# Git shortcuts with enhanced output
function gs { git status }
function ga { git add . }
function gc {
    param([string]$msg)
    if ($msg) {
        git commit -m $msg
    } else {
        git commit
    }
}
function gp { git push }
function gl { git log --oneline -10 }

# Welcome message for VS Code
if ($env:TERM_PROGRAM -eq "vscode") {
    Write-Host ""
    Write-Host " Finance Quest Development Environment Ready!" -ForegroundColor Cyan
    Write-Host " Available commands: dev, build, test, lint" -ForegroundColor Gray
    Write-Host ""
}

# Enable shell integration features
$env:VSCODE_INJECTION = "1"
