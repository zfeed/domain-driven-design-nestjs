FROM node:18

# Create app directory
WORKDIR /usr/src/app

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
