########### Build Stage ###########
FROM node:22-alpine AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable \
 && corepack prepare pnpm@latest --activate

# Install dependencies (layer-cached)
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

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

# Copy only the standalone build and static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Expose port and launch server
EXPOSE 3000
CMD ["node", "/app/server.js"]
