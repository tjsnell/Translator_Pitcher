# Dockerfile to run the sample under current Node LTS
#
# docker build . -t node-rdkafka
# docker run --rm -it -e VCAP_SERVICES=${VCAP_SERVICES} node-rdkafka
# OR
# docker run --rm -it node-rdkafka <kafka_brokers_sasl> <api_key> /etc/ssl/certs
#
FROM ubuntu

RUN  apt-get update -qqy \
  && apt-get install -y --no-install-recommends \
     build-essential \
     git \
     node-gyp \
     nodejs-dev \
     libssl1.0-dev \
     liblz4-dev \
     libpthread-stubs0-dev \
     libsasl2-dev \
     libsasl2-modules \
     make \
     python \
     nodejs npm ca-certificates \
  && rm -rf /var/cache/apt/* /var/lib/apt/lists/*

WORKDIR /usr/src/app

ADD . .
#RUN npm install -d
RUN npm uninstall node-rdkafka
RUN npm install node-rdkafka
ENV LD_LIBRARY_PATH=/usr/src/app/node_modules/node-rdkafka/build/deps
#ENTRYPOINT [ "node", "app.js" ]
#CMD [ "" ]
