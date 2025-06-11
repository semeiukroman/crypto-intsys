FROM node:20-alpine
WORKDIR /client
COPY package*.json ./
RUN npm i
COPY . .
ENV PORT=5173
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
