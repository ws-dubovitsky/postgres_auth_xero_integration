FROM node:8

# Папка приложения
WORKDIR /app

# Установка зависимостей
COPY package.json ./app
RUN npm install
# Для использования в продакшне
# RUN npm install --production

# Копирование файлов проекта
COPY . /app

# Запуск проекта
CMD ["npm", "start"]


