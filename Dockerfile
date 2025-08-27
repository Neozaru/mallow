FROM node:22-alpine

WORKDIR /mallow

COPY package.json tsconfig.json next-env.d.ts postcss.config.mjs package-lock.json* pnpm-lock.yaml* yarn.lock* next.config.ts tailwind.config.ts .eslintrc.json ./

RUN npm install

COPY src ./src
COPY public ./public

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
