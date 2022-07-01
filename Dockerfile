FROM node:alpine AS builder

WORKDIR /detectivexiii

COPY . .

RUN npm ci --only=production\
npm run db:gen\
npm run build

FROM node:alpine

WORKDIR /detectivexiii

COPY --from=builder /detectivexiii/build ./build

COPY --from=builder /detectivexiii/node_modules ./node_modules

COPY --from=builder /detectivexiii/package*.json .

EXPOSE 8000

CMD [ "npm", "run", "start" ]