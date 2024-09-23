FROM postgres:14

# Установка cron
RUN apt-get update && apt-get install -y cron

# Копировать скрипт бэкапа
COPY backup.sh /usr/local/bin/backup.sh
RUN chmod +x /usr/local/bin/backup.sh

# Добавить задачу cron с перенаправлением вывода в лог-файл
#RUN echo "*/1 * * * * root /usr/local/bin/backup.sh >> /var/log/cron.log 2>&1" >> /etc/cron.d/backup-cron
RUN echo "0 0 * * 0 root /usr/local/bin/backup.sh >> /var/log/cron.log 2>&1" >> /etc/cron.d/backup-cron
RUN chmod 0644 /etc/cron.d/backup-cron

# Запуск cron в фоновом режиме
CMD cron -f
