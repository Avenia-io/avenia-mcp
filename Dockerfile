FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./
COPY --from=build /app/dist ./dist
RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force
# HTTP transport (AVENIA_TRANSPORT=http) listens on PORT (default 8080).
# Default transport is stdio; set AVENIA_TRANSPORT=http at runtime for the server.
EXPOSE 8080
ENTRYPOINT ["node", "dist/index.js"]
