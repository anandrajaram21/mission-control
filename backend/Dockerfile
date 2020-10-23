FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install -g pm2

COPY . .

RUN mkdir ./keys

RUN cd keys && ssh-keygen -q -N '' -t rsa -b 4096 -m PEM -f private.pem && openssl rsa -in private.pem -pubout -outform PEM -out public.pem && rm private.pem.pub

EXPOSE 3000

CMD ["pm2-runtime", "index.js"]