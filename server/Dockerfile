FROM node:18-alpine
WORKDIR /server
COPY package*.json ./
RUN npm i
COPY . .
COPY entry.sh /usr/local/bin/entry.sh
RUN chmod +x /usr/local/bin/entry.sh
RUN apk add --no-cache mysql-client
EXPOSE 4000
ENTRYPOINT ["/usr/local/bin/entry.sh"]
