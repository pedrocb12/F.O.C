# setup-dev.ps1
# Executar no PowerShell como administrador

function Require-Admin {
  $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
  if (-not $isAdmin) {
    Write-Host "Este script precisa ser executado como Administrador. Abra o PowerShell como Administrador e rode novamente." -ForegroundColor Yellow
    exit 1
  }
}

Require-Admin

Write-Host "Iniciando instalação de ferramentas (winget + npm + extensões VS Code)..." -ForegroundColor Cyan

# Pacotes via winget (melhor esforço)
$packages = @(
  'OpenJS.Node.LTS',         # Node.js LTS
  'Git.Git',                 # Git
  'Microsoft.VisualStudioCode',
  'EclipseAdoptium.Temurin.17',
  'Google.AndroidStudio'
)

foreach ($id in $packages) {
  Write-Host "Tentando instalar: $id" -ForegroundColor Cyan
  try {
    winget install --id $id -e --accept-package-agreements --accept-source-agreements -h
  } catch {
    Write-Host "Falha ao instalar $id via winget (continuando). Verifique manualmente." -ForegroundColor Yellow
  }
}

# Instalar pacotes npm globais úteis
Write-Host "Instalando pacotes npm globais (expo-cli, yarn)" -ForegroundColor Cyan
try {
  npm install -g expo-cli --loglevel=error
  npm install -g yarn --loglevel=error
} catch {
  Write-Host "Falha ao instalar pacotes npm globalmente. Verifique permissões do npm." -ForegroundColor Yellow
}

# Instalar extensões do VS Code (necessário que 'code' esteja no PATH)
$extensions = @(
  'expo.vscode-expo',
  'msjsdiag.react-native-tools',
  'dbaeumer.vscode-eslint',
  'esbenp.prettier-vscode'
)

if (Get-Command code -ErrorAction SilentlyContinue) {
  foreach ($ext in $extensions) {
    Write-Host "Instalando extensão VS Code: $ext" -ForegroundColor Cyan
    code --install-extension $ext --force
  }
} else {
  Write-Host "Comando 'code' não encontrado no PATH. Abra o VS Code, pressione Ctrl+Shift+P → 'Shell Command: Install 'code' command in PATH' e rode este script novamente." -ForegroundColor Yellow
}

Write-Host "Instalação concluída (ou tentada)." -ForegroundColor Green
Write-Host "ATENÇÃO: Android Studio necessita configuração manual do AVD e do SDK. Configure o AVD Manager dentro do Android Studio." -ForegroundColor Yellow
Write-Host "Reinicie o terminal/PC após instalar o JDK para atualizar as variáveis de ambiente (JAVA_HOME)." -ForegroundColor Yellow

Write-Host "Para iniciar o projeto web agora: 'npx expo start --web'" -ForegroundColor Cyan
