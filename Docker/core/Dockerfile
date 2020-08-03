FROM ubuntu:18.04
LABEL maintainer="info@reddcoin.com"
ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /root

RUN useradd -r reddcoin \
  && apt-get update -y \
  && apt-get install -y curl gnupg gosu \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ENV REDDCOIN_VERSION=3.10.2
ENV REDDCOIN_DATA=/home/reddcoin/.reddcoin
ENV PATH=/opt/reddcoin-${REDDCOIN_VERSION}/bin:$PATH

RUN mkdir -p ${REDDCOIN_DATA}

ENV RPC_DAEMON 1
ENV RPC_SERVER 1
ENV RPC_USERNAME rpcusername
ENV RPC_PASSWORD rpcpassword
ENV RPC_PORT 45443
ENV RPC_ALLOW_IP 0.0.0.0/0

RUN set -ex \
  && curl -SLO https://download.reddcoin.com/bin/reddcoin-core-${REDDCOIN_VERSION}/SHA256SUMS \
  && curl -SLO https://download.reddcoin.com/bin/reddcoin-core-${REDDCOIN_VERSION}/reddcoin-${REDDCOIN_VERSION}-linux64.tar.gz \
  && grep " reddcoin-${REDDCOIN_VERSION}-linux64.tar.gz\$" SHA256SUMS | sha256sum -c - \
  && tar -xzf *.tar.gz -C /opt \
  && rm *.tar.gz

COPY ./setup.sh /root
RUN chmod u+x /root/setup.sh

VOLUME ["/home/reddcoin/.reddcoin"]

EXPOSE 45443 45444

CMD [ "/root/setup.sh" ]
