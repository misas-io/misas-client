FROM kkarczmarczyk/node-yarn:7.2
MAINTAINER Ricardo Roman <rrmn92@gmail.com>


WORKDIR /usr/src/app
COPY [ "package.json", "yarn.lock", "./" ]

RUN yarn install --no-progress

COPY [ "./", "./" ]
RUN mkdir tests/ coverage/
VOLUME [ "/usr/src/app/tests", "/usr/src/app/coverage" ]

ENTRYPOINT ["npm"]
