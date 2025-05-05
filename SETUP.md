# 亲属关系计算器设置指南

## 更新后的安装步骤

1. 安装新增的OpenAI依赖:

```bash
npm install
# 或
yarn install
```

2. 创建环境变量文件:

在项目根目录创建一个名为`.env.local`的文件，并添加以下内容:

```
OPENAI_API_KEY=你的OpenAI API密钥
```

请将"你的OpenAI API密钥"替换为你实际的OpenAI API密钥。如果你还没有OpenAI API密钥，可以在[OpenAI平台](https://platform.openai.com/)注册并获取。

3. 启动开发服务器:

```bash
npm run dev
# 或
yarn dev
```

## 功能验证

要验证OpenAI集成是否正常工作:

1. 在应用中尝试输入一些复杂或不常见的关系，例如"爸爸的爸爸的兄弟的女儿的儿子"
2. 如果默认的关系计算方法无法提供结果，系统将自动调用OpenAI API
3. 你应该能看到流式响应，结果将逐步显示在结果文本框中

## 故障排除

如果遇到问题:

1. 确保OpenAI API密钥正确并且有效
2. 检查网络连接
3. 查看浏览器控制台中是否有错误信息
4. 确保已经安装了所有依赖

如有其他问题，请参考[OpenAI API文档](https://platform.openai.com/docs/api-reference)或提交issue。 