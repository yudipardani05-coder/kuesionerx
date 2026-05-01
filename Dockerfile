FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --no-audit

FROM deps AS build
COPY . .
RUN npm run build

FROM node:20-alpine AS production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/db ./db
COPY --from=build /app/drizzle.config.ts ./
COPY package.json ./


EXPOSE 3000
CMD ["sh", "-c", "npx drizzle-kit migrate && npm start"]
