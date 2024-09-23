##!/bin/bash
#
## Директория для бэкапов
#BACKUP_DIR="/backup"
## Имя бэкапа с текущей датой
#BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S).sql"
## Полный путь до файла бэкапа
#BACKUP_FILE="${BACKUP_DIR}/${BACKUP_NAME}"
#
## Параметры подключения к БД
#DB_USER="kirilllesniak"
#DB_PASSWORD="admin12345"
#DB_NAME="machine_service"
#DB_HOST="db"
#
## Экспорт пароля для pg_dump
#export PGPASSWORD="${DB_PASSWORD}"
#
## Создать бэкап и записывать ошибки в лог
#pg_dump -U "${DB_USER}" -h "${DB_HOST}" -d "${DB_NAME}" > "${BACKUP_FILE}" 2> /backup/backup_error.log
#
## Проверить, выполнена ли команда pg_dump успешно
#if [ $? -ne 0 ]; then
#  echo "Ошибка при создании бэкапа: $(cat /backup/backup_error.log)" >&2
#fi
#
## Удалить старые бэкапы, если их больше 4
#BACKUP_COUNT=$(ls -1 ${BACKUP_DIR}/*.sql 2>/dev/null | wc -l)
#if [ ${BACKUP_COUNT} -gt 4 ]; then
#  # Удалить самый старый файл
#  OLDEST_FILE=$(ls -1t ${BACKUP_DIR}/*.sql | tail -n 1)
#  rm -f "${OLDEST_FILE}"
#fi
#!/bin/bash
#!/bin/bash
# Директория для бэкапов на вашей машине
BACKUP_DIR="/backup"
# Имя бэкапа с текущей датой
BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S).sql"
# Полный путь до файла бэкапа
BACKUP_FILE="${BACKUP_DIR}/${BACKUP_NAME}"

# Параметры подключения к БД
DB_USER="kirilllesniak"
DB_PASSWORD="admin12345"
DB_NAME="machine_service"
DB_HOST="db" # если БД запущена на вашей машине или используйте `db` если в контейнере

# Экспорт пароля для pg_dump
export PGPASSWORD="${DB_PASSWORD}"

# Создать бэкап и записывать ошибки в лог
pg_dump -U "${DB_USER}" -h "${DB_HOST}" -d "${DB_NAME}" > "${BACKUP_FILE}" 2> ${BACKUP_DIR}/backup_error.log

# Проверить, выполнена ли команда pg_dump успешно
if [ $? -ne 0 ]; then
  echo "Ошибка при создании бэкапа: $(cat ${BACKUP_DIR}/backup_error.log)" >&2
fi

# Удалить старые бэкапы, если их больше 4
BACKUP_COUNT=$(ls -1 ${BACKUP_DIR}/*.sql 2>/dev/null | wc -l)
if [ ${BACKUP_COUNT} -gt 4 ]; then
  # Удалить самый старый файл
  OLDEST_FILE=$(ls -1t ${BACKUP_DIR}/*.sql | tail -n 1)
  rm -f "${OLDEST_FILE}"
fi
