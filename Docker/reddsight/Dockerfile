FROM ubuntu:14.04
LABEL maintainer="info@reddcoin.com"
ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /root

RUN apt-get update -y \
  && apt-get install -y git curl software-properties-common wget unzip \
  && apt-get install -y nodejs npm \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN npm config set ca ""
RUN npm install -g n
RUN n 0.10.48

COPY ./setup.sh /root
RUN chmod u+x /root/setup.sh

RUN git clone https://github.com/reddcoin-project/reddsight.git
WORKDIR /root/reddsight

RUN chown -R root:root /root/reddsight

RUN npm install winston@2.3.1
RUN npm install bignum@0.9.0
RUN npm install async@1.5.2
RUN npm install

ENV BITCOIND_HOST 127.0.0.1
ENV BITCOIND_USER rpcusername
ENV BITCOIND_PASS rpcpassword
ENV INSIGHT_NETWORK livenet
ENV NODE_ENV production

EXPOSE 3001/tcp

CMD [ "/root/setup.sh" ]