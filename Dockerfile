ARG node_version=17-alpine3.12

FROM node:17-alpine3.12 as builder

ARG SERVICE_TYPE

ENV SERVICE_NAME = "authentication"
RUN echo $SERVICE_TYPE

WORKDIR /authentication/
COPY . .

RUN npm install && \
    npm run build

ENTRYPOINT npm start
