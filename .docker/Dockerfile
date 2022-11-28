FROM node:16-alpine

WORKDIR /app

RUN apk update && apk add --no-cache tzdata

ENV TZ=America/Manaus

ADD . .

RUN cp /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone && \
    rm -fv *lock* && \
    npm cache clean --force && \
    yarn install

EXPOSE 3000

CMD ["npm", "start"]
