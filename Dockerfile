# Используем официальный образ OpenJDK для Java 11 (или вашей версии)
FROM openjdk:21-jdk


# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем файл JAR в контейнер
COPY target/Machine_Service-0.0.1-SNAPSHOT.jar app.jar

# Указываем порт, который будет использоваться приложением
EXPOSE 8080

# Определяем команду запуска приложения
ENTRYPOINT ["java", "-jar", "app.jar"]
