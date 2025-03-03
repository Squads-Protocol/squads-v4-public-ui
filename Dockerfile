# Use a minimal base image
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare yarn@stable --activate

ENV NODE_ENV=static
ENV NEXT_TELEMETRY_DISABLED=1
ENV SOURCE_DATE_EPOCH=315532800

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --non-interactive --check-files

COPY . .


RUN yarn build

RUN find out -exec touch -d @${SOURCE_DATE_EPOCH} {} + && \
    find out -exec chmod 644 {} +

RUN mkdir -p /squads-public-build/dist && \
    mv out/* /squads-public-build/dist && \
    find /squads-public-build/dist -type f -exec touch -d @${SOURCE_DATE_EPOCH} {} + && \
    find /squads-public-build/dist -type f -exec chmod 644 {} + && \
    cd /squads-public-build/dist && \
    find . -type f -print0 | sort -z | xargs -0 cat | sha256sum | awk '{ print $1 }' > /squads-public-build/hash.txt

RUN chmod -R u+rwX,go+rX /squads-public-build/dist && \
    chmod u+rw,go+r /squads-public-build/hash.txt

RUN mkdir -p /output && cp -r /squads-public-build/* /output/

CMD ["sh", "-c", "cat /output/hash.txt"]