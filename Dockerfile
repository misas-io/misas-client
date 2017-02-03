FROM kkarczmarczyk/node-yarn:7.2
MAINTAINER Ricardo Roman <rrmn92@gmail.com>


#WORKDIR /usr/src/app
COPY ./ ./

RUN yarn install --no-progress
ENTRYPOINT ["npm"]
