# 使用Node.js官方镜像作为基础镜像
FROM node:20-alpine AS base

# 设置工作目录
WORKDIR /app

# 安装依赖阶段
FROM base AS deps
# 安装libc6-compat可能会被一些npm包需要
RUN apk add --no-cache libc6-compat

# 复制package.json和package-lock.json
COPY package.json package-lock.json ./

# 安装项目依赖
RUN npm ci

# 构建应用阶段
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 构建应用
RUN npm run build

# 生产环境阶段
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# 创建非root用户以增加安全性
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 设置正确的权限
COPY --from=builder /app/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next

# 自动利用输出跟踪模式，减少最终镜像大小
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 切换到非root用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 设置主机绑定到0.0.0.0以便在容器内访问
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# 启动Next.js
CMD ["node", "server.js"] 