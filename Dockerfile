### Buildtime
FROM node:22-alpine AS builder

WORKDIR /mallow

COPY package.json tsconfig.json postcss.config.mjs package-lock.json* next.config.ts tailwind.config.ts .eslintrc.json ./

RUN npm ci

COPY src ./src
COPY public ./public

RUN npm run build

### Runtime
FROM node:22-alpine AS runtime

WORKDIR /mallow

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY --from=builder /mallow/.next ./.next
COPY --from=builder /mallow/public ./public

EXPOSE 3000

CMD ["npm", "start"]
