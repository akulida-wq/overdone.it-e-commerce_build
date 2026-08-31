#!/bin/bash
# Двойной клик по этому файлу: поднимает лендинг (если не запущен) и открывает браузер.
cd "$(dirname "$0")"

if ! curl -s -o /dev/null --max-time 2 http://localhost:3100/; then
  echo "Запускаю сервер лендинга на порту 3100…"
  if [ ! -d .output ]; then
    echo "Сборки нет — собираю (1–2 минуты)…"
    npm run build
  fi
  PORT=3100 nohup node .output/server/index.mjs > /tmp/overdone-partnership.log 2>&1 &
  sleep 2
fi

open "http://localhost:3100"
