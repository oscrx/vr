# --- Release with Alpine ----
FROM node:12-alpine AS release
ENV NODE_ENV production
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY fonts ./fonts
COPY images ./images
COPY handlers ./handlers
COPY startup.js ./
USER node

CMD ["node", "startup.js"]
