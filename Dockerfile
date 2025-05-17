########### Build Stage ###########
FROM node:22-alpine AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable \
 && corepack prepare pnpm@latest --activate

# Install dependencies (layer-cached)
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copy Prisma schema and set the SQLite URL
COPY prisma ./prisma
ENV DATABASE_URL="file:./prisma/dev.db"
# Generate the Prisma Client and push your schema → creates prisma/dev.db
RUN pnpm prisma generate
RUN pnpm prisma db push

# Copy source and build in standalone mode
COPY . .
RUN pnpm run build

########### Runtime Stage ###########
FROM node:22-alpine AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 -G nodejs nextjs
USER nextjs

# 7. Ensure production env and SQLite URL at runtime
ENV NODE_ENV=production
ENV DATABASE_URL="file:./prisma/dev.db"

# Copy only the standalone build and static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Expose port and launch server
EXPOSE 3000
CMD ["node", "/app/server.js"]
