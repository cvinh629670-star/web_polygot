$ErrorActionPreference = 'Stop'

# Use the normal Node installation, or the portable runtime prepared for this workspace.
$nodeCommand = Get-Command node.exe -ErrorAction SilentlyContinue
if ($nodeCommand) {
    $nodeDirectory = Split-Path -Parent $nodeCommand.Source
} else {
    $portableRoot = Join-Path $env:USERPROFILE '.cache\polyglot-tools'
    $runtime = Get-ChildItem -LiteralPath $portableRoot -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -like 'node-*-win-x64' -and (Test-Path -LiteralPath (Join-Path $_.FullName 'npm.cmd')) } |
        Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if (-not $runtime) {
        throw 'Install Node.js 22.12+ or 24 LTS, then run npm install and npm run build.'
    }
    $nodeDirectory = $runtime.FullName
}

$originalPath = $env:PATH
Push-Location -LiteralPath $PSScriptRoot
try {
    $env:PATH = "$nodeDirectory;$env:PATH"
    & (Join-Path $nodeDirectory 'npm.cmd') run build
    if ($LASTEXITCODE -ne 0) { throw 'PolyGlot build failed.' }
} finally {
    $env:PATH = $originalPath
    Pop-Location
}
