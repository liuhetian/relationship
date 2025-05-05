# Docker 部署指南

本文档提供使用 Docker 部署此 Next.js 应用的说明。

## 前提条件

- 安装 [Docker](https://docs.docker.com/get-docker/)
- 安装 [Docker Compose](https://docs.docker.com/compose/install/)（可选，用于简化部署）

## 使用 Dockerfile 构建和运行

### 构建镜像

```bash
docker build -t nextjs-app .
```

### 运行容器

```bash
docker run -p 3000:3000 nextjs-app
```

现在，应用程序应该在 http://localhost:3000 上运行。

## 使用 Docker Compose 部署

更简单的方法是使用 Docker Compose：

```bash
docker-compose up -d
```

这将在后台构建并启动应用程序。

要停止应用程序：

```bash
docker-compose down
```

## 环境变量

如果需要使用环境变量，有两种方式：

1. 在 Dockerfile 中设置（仅适用于非敏感信息）
2. 使用环境变量文件，取消注释 docker-compose.yml 中的相关行，并创建 .env.production 文件

## 生产部署注意事项

- 在生产环境中，考虑添加 Nginx 或其他反向代理
- 确保所有敏感信息通过环境变量传递，而不是构建到镜像中
- 考虑使用 Docker Swarm 或 Kubernetes 进行扩展和高可用性 