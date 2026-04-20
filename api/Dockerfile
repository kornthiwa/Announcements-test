FROM node:22-alpine

WORKDIR /app
ENV DATABASE_URL=postgresql://postgres:postgres@localhost:5432/product_db?schema=public

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY src ./src

RUN yarn prisma:generate
RUN yarn build

EXPOSE 3000

CMD ["sh", "-c", "yarn prisma:db:push && node dist/src/main.js"]
