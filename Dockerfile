ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-slim as base

WORKDIR /app

FROM base as build

RUN apt-get update -qq && apt-get install -y build-essential python3 && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM base

ENV NODE_ENV=production

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 3000

CMD ["node", "dist/index.js"]
