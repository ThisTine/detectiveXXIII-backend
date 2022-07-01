FROM node:16.15-alpine3.16 AS builder

WORKDIR /detectivexiii

COPY . .

RUN npm install

RUN npm run build

FROM node:16.15-alpine3.16

WORKDIR /detectivexiii

COPY --from=builder /detectivexiii/build/ ./build/

COPY --from=builder /detectivexiii/package*.json ./

COPY --from=builder /detectivexiii/prisma/ ./prisma/

RUN npm ci --only=production

RUN npm run db:gen

EXPOSE 8000

CMD [ "npm", "run", "start" ]