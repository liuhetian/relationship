# 亲属关系计算器

这是一个可以计算亲属关系称谓的应用。

## 如何设置

1. 安装依赖:

```bash
npm install
# 或
yarn install
```

2. 创建一个 `.env.local` 文件在项目根目录并添加以下内容:

```
OPENAI_API_KEY=你的OpenAI密钥
```

3. 启动开发服务器:

```bash
npm run dev
# 或
yarn dev
```

## 功能特点

- 支持常见亲属关系计算
- 不同区域模式的称谓计算（默认、北方地区、粤语使用）
- 当默认计算方法无法识别时，会自动调用OpenAI进行智能分析
- 提供流式响应，实时显示AI生成的结果

## 使用说明

1. 选择区域模式、性别和称呼方式
2. 输入关系链或使用按钮添加关系
3. 点击"计算"按钮获取结果
4. 结果将在下方文本框中显示

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
