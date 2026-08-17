FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src
COPY filters ./filters
RUN npm run build && npm prune --omit=dev

FROM node:22-alpine AS runtime

RUN apk add --no-cache dumb-init openssl

WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000

COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/prisma ./prisma

RUN mkdir -p uploads && chown node:node uploads

USER node
EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:3000/api-docs/ || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/src/main.js"]
