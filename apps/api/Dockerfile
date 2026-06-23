FROM dunglas/frankenphp:php8.5-alpine

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN apk add --no-cache nodejs npm postgresql-client

RUN install-php-extensions pdo_pgsql zip

ARG UID=1000
RUN addgroup -S app && \
    adduser -u ${UID} -S -s /bin/sh -G app app && \
    mkdir -p /data/caddy /config/caddy && \
    chown -R app:app /data/caddy /config/caddy

WORKDIR /app

ENV SERVER_NAME=":8080"

USER app

EXPOSE 8080
