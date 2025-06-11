FROM node:18-alpine

WORKDIR /server

# 1) copy package files & install deps first (cache)
COPY package*.json ./
RUN npm i

# 2) copy the rest of the source
COPY . .

# 3) copy entrypoint & make sure it's unix-formatted + executable
COPY entry.sh /usr/local/bin/entry.sh
RUN chmod +x /usr/local/bin/entry.sh

# mysql client for mysqladmin ping
RUN apk add --no-cache mysql-client

EXPOSE 4000
ENTRYPOINT ["/usr/local/bin/entry.sh"]
