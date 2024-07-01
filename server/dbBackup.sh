check_command() {
  if command -v "$1" >/dev/null 2>&1; then
    return 0
  else
    return 1
  fi
}

detect_os() {
  OS="unknown"
  if [ "$(uname)" = "Darwin" ]; then
    OS="macOS"
  elif [ "$(expr substr $(uname -s) 1 5)" = "Linux" ]; then
    OS="Linux"
  elif [ "$(expr substr $(uname -s) 1 5)" = "MINGW" ]; then
    OS="Windows"
  fi
  echo $OS
}

if check_command "mongodump"; then
    mongodump -h 127.0.0.1 -d blog -o ./dbBackup
else
  echo "未安装mongodump，将为您开始安装"
  OS_TYPE=$(detect_os)
  case $OS_TYPE in
    "macOS")
      echo "当前系统是 macOS"
      brew tap mongodb/brew
      brew install mongodb-database-tools
      echo "安装完成，请再次运行脚本"
      ;;
    "Linux")
      echo "当前系统是 Linux"
      ;;
    "Windows")
      echo "当前系统是 Windows"
      ;;
    *)
      echo "无法检测到系统类型"
      ;;
  esac
fi
