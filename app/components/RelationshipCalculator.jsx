"use client";

import { useState, useEffect, useRef } from 'react';
import relationship from 'relationship.js';
import ReactMarkdown from 'react-markdown';

export default function RelationshipCalculator() {
  const [mode, setMode] = useState('零语用');  // 区域模式
  const [sex, setSex] = useState(1);  // 性别，1为男，0为女
  const [direction, setDirection] = useState(false);  // 称呼方式
  const [input, setInput] = useState('');  // 输入的称谓
  const [result, setResult] = useState([]);  // 计算结果
  const [loading, setLoading] = useState(false); // 加载状态
  const [streamingResult, setStreamingResult] = useState(''); // 流式传输的结果
  const [isStreaming, setIsStreaming] = useState(false); // 是否正在流式传输

  // 亲属关系按钮
  const relations = ['父', '母', '夫', '妻', '兄', '弟', '姐', '妹', '子', '女'];

  const handleAddRelation = (relation) => {
    const relationMap = {
      '父': '的爸爸',
      '母': '的妈妈',
      '夫': '的丈夫',
      '妻': '的妻子',
      '兄': '的哥哥',
      '弟': '的弟弟',
      '姐': '的姐姐',
      '妹': '的妹妹',
      '子': '的儿子',
      '女': '的女儿'
    };

    // 检查输入框内容是否以"的"开头
    const newInput = prev => {
      const updatedInput = prev + relationMap[relation];
      return updatedInput.startsWith('的') ? updatedInput.slice(1) : updatedInput;
    };

    setInput(newInput);
  };

  const fetchAIResponse = async (query) => {
    setLoading(true);
    setIsStreaming(true);
    setStreamingResult('');
    
    try {
      const response = await fetch('/api/ai-relationship', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query,
          sex: sex,
          direction: direction
        }),
      });
      
      if (!response.ok) {
        throw new Error('网络响应不正常');
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        const text = decoder.decode(value);
        setStreamingResult((prev) => prev + text);
      }
    } catch (error) {
      console.error('获取AI响应时出错:', error);
      setStreamingResult('获取AI响应时出错，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = () => {
    console.log("当前输入:", input); // 调试输出
    try {
      const options = {
        text: input,
        sex: sex,
        reverse: direction,
        mode: mode
      };
      const calculatedResult = relationship(options);
      console.log("计算结果:", calculatedResult); // 调试输出
      
      if (!calculatedResult || 
          (Array.isArray(calculatedResult) && calculatedResult.length === 0) || 
          calculatedResult === '未知关系') {
        // 如果没有结果或结果为空，调用后端API
        setResult(['正在查询更多可能的称呼...']);
        fetchAIResponse(input);
      } else {
        setIsStreaming(false);
        setStreamingResult('');
        setResult(Array.isArray(calculatedResult) ? calculatedResult : [calculatedResult]);
      }
    } catch (error) {
      console.error("计算出错:", error); // 输出错误信息
      setResult(['计算出错，尝试使用AI查询...']);
      fetchAIResponse(input);
    }
  };

  const handleClear = () => {
    setInput('');
    setResult([]);
    setStreamingResult('');
    setIsStreaming(false);
  };

  // 将普通结果数组转换为适合Markdown展示的字符串
  const resultToMarkdown = () => {
    if (isStreaming) {
      return streamingResult;
    } else {
      return result.length > 0 ? result.join('/') : '';
    }
  };

  return (
    <div className="container">
      <div className="space-y-4 w-full">
        <div className="space-y-2">
          <div className="flex gap-4">
            <label>
              区域模式：
              <input
                type="radio"
                checked={mode === '零语用'}
                onChange={() => setMode('零语用')}
              /> 默认
              <input
                type="radio"
                checked={mode === '北方地区'}
                onChange={() => setMode('北方地区')}
              /> 北方地区
              <input
                type="radio"
                checked={mode === '港语用'}
                onChange={() => setMode('港语用')}
              /> 粤语使用
            </label>
          </div>
          
          <div>
            <label>
              我的性别：
              <input
                type="radio"
                checked={sex === 1}
                onChange={() => setSex(1)}
              /> 男
              <input
                type="radio"
                checked={sex === 0}
                onChange={() => setSex(0)}
              /> 女
            </label>
          </div>

          <div>
            <label>
              称呼方式：
              <input
                type="radio"
                checked={!direction}
                onChange={() => setDirection(false)}
              /> 我称呼对方
              <input
                type="radio"
                checked={direction}
                onChange={() => setDirection(true)}
              /> 对方称呼我
            </label>
          </div>
        </div>

        <div className="input-area">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="爸爸的爸爸"
            className="w-full p-4 border rounded bg-white resize-none h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ resize: 'none' }}
          />
        </div>

        <div className="relation-grid">
          {relations.map((relation) => (
            <button
              key={relation}
              onClick={() => handleAddRelation(relation)}
              className="relation-button"
            >
              {relation}
            </button>
          ))}
        </div>

        <div className="button-group">
          <div className="flex-center w-full">
            <button
              onClick={handleClear}
              className="button-red"
              disabled={loading}
            >
              清空
            </button>
            <button
              onClick={handleCalculate}
              className="button-green"
              disabled={loading}
            >
              {loading ? '查询中...' : '计算'}
            </button>
          </div>
        </div>

        <div className="result-area">
          <div className="mb-2 font-bold">
            <span>计算结果：</span>
          </div>
          
          <div className="w-full p-4 border rounded bg-white min-h-[300px] max-h-[500px] overflow-y-auto">
            <ReactMarkdown>
              {resultToMarkdown()}
            </ReactMarkdown>
          </div>
          
          {loading && <div className="mt-2 text-blue-500">AI正在思考...</div>}
        </div>
      </div>
    </div>
  );
} 