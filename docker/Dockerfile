FROM node:8-alpine

RUN apk add --update --no-cache git \
                                libzmq \
                                zeromq-dev \
                                python \
                                make \
                                g++

WORKDIR /insight

# Copy dashcore-node
RUN git clone --branch master --single-branch --depth 1 https://github.com/dashevo/dashcore-node.git .

# Copy config file
COPY dashcore-node.json .

# Install NPM modules
RUN npm ci

ARG VERSION
ARG MAJOR_VERSION

# Install Insight modules
RUN bin/dashcore-node install @dashevo/insight-api@${MAJOR_VERSION}
RUN bin/dashcore-node install @dashevo/insight-ui@${VERSION}

FROM node:8-alpine

LABEL maintainer="Dash Developers <dev@dash.org>"
LABEL description="Dockerised Insight-Dash"

WORKDIR /insight

# Copy project files
COPY --from=0 /insight/ .

EXPOSE 3001

CMD ["bin/dashcore-node", "start"]
