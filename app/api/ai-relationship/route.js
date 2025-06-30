import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// 初始化OpenAI客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
});

export async function POST(request) {
  try {
    const { query, sex, direction } = await request.json();
    
    if (!query) {
      return NextResponse.json({ error: '缺少查询参数' }, { status: 400 });
    }

    // 创建请求头，支持流式传输
    const headers = {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    };

    // 创建一个可读流
    const stream = new ReadableStream({
      async start(controller) {
        // 根据性别和称呼方式构建prompt
        const gender = sex === 1 ? '男性' : '女性';
        const directionText = direction ? '对方称呼我' : '我称呼对方';
        
        const prompt = `
我的性别: ${gender}
对方是: ${query}
称呼方向: ${directionText}

请你输出以上关系${directionText}应该如何称呼，输出三个结果以及你对此的吐槽：
`;
        
        try {
          const chatStream = await openai.chat.completions.create({
            model: process.env.MODEL_NAME,
            messages: [
              { role: 'system', content: '你是一个爱吐槽人类的人工智能，你的任务是分析以下亲属关系应该如何称呼。' },
              { role: 'user', content: prompt }
            ],
            stream: true,
            temperature: 0.7,
            // max_tokens: 300,
          });

          for await (const chunk of chatStream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              const encoder = new TextEncoder();
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (error) {
          console.error('OpenAI API调用错误:', error);
          controller.enqueue(new TextEncoder().encode('OpenAI API调用出错，请稍后再试。'));
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, { headers });
  } catch (error) {
    console.error('处理请求时出错:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
} 