FROM node:20.2.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm cache clean --force

RUN npm install --force 

COPY . .

RUN npm install

CMD ["npm", "run", "start"]

EXPOSE 3000