import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Cpu, Send, Sparkles, Sliders, Play } from 'lucide-react';

export const ModelTryoutModal: React.FC = () => {
  const { tryoutModel, setTryoutModel, showToast } = useApp();

  const [prompt, setPrompt] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!tryoutModel) return null;

  const handleRun = () => {
    if (!prompt.trim()) {
      showToast('请输入 Prompt 测试内容');
      return;
    }
    setIsLoading(true);
    setOutput('');

    setTimeout(() => {
      setIsLoading(false);
      setOutput(`【${tryoutModel.name} 原生推理生成结果】\n\n根据您的输入："${prompt}"\n\n模型的逻辑链解析：\n1. 上下文长度支持: ${tryoutModel.contextLength}\n2. 参数配置: Temperature = ${temperature}, Top_P = ${topP}, Max_Tokens = ${maxTokens}\n3. 生成时延: ${tryoutModel.latencyMs}ms\n\n总结：在推理泛化能力与逻辑严密性测试中表现优异。`);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>{tryoutModel.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-50 text-cyan-700 border border-cyan-200 font-bold">
                  Playground 试用
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">提供方: {tryoutModel.vendor} · 输入价: {tryoutModel.priceInput}</div>
            </div>
          </div>

          <button onClick={() => setTryoutModel(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Split: Left Controls & Prompt, Right Output */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 divide-x divide-slate-200 overflow-hidden">
          
          {/* Left Column: Model Hyperparameters & Input */}
          <div className="lg:col-span-1 p-5 space-y-4 overflow-y-auto text-xs font-medium text-slate-700 bg-slate-50/60">
            <div className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <Sliders className="w-4 h-4 text-cyan-600" />
              模型超参数配置
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Temperature (随机性):</span>
                <span className="font-mono font-bold text-cyan-600">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-cyan-600"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Top P (采样概率):</span>
                <span className="font-mono font-bold text-cyan-600">{topP}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={topP}
                onChange={(e) => setTopP(parseFloat(e.target.value))}
                className="w-full accent-cyan-600"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Max Tokens (最大生成长度):</span>
                <span className="font-mono font-bold text-cyan-600">{maxTokens}</span>
              </div>
              <input
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value) || 1024)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 outline-none"
              />
            </div>

            <div className="pt-2">
              <label className="font-bold text-slate-800 mb-1 block">输入测试 Prompt *</label>
              <textarea
                rows={6}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="请写下一段 Prompt 或测试用例，考察模型理解能力..."
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <button
              onClick={handleRun}
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>运行模型测试</span>
            </button>
          </div>

          {/* Right Column: Output Playground */}
          <div className="lg:col-span-2 p-6 overflow-y-auto space-y-4 bg-white text-xs font-medium">
            <div className="font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between">
              <span>模型生成输出控制台</span>
              {isLoading && <span className="text-cyan-600 font-bold animate-pulse">正在生成 Tokens 中...</span>}
            </div>

            {output ? (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-mono leading-relaxed whitespace-pre-wrap">
                {output}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-2">
                <Sparkles className="w-8 h-8 text-slate-300" />
                <div>在左侧输入 Prompt 并点击“运行模型测试”</div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
