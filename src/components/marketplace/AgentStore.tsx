import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AgentItem, AgentCategory } from '../../types';
import { 
  Bot, 
  Star, 
  Play, 
  Sparkles, 
  Key, 
  Code2, 
  Send, 
  MessageSquare, 
  Download, 
  Heart, 
  Flag, 
  ArrowRight,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';

export const AgentStore: React.FC = () => {
  const { 
    agents, 
    sandboxAgent, 
    setSandboxAgent, 
    setActiveTab, 
    setWorkspaceSubTab, 
    setCreateAgentModalOpen,
    showToast
  } = useApp();

  const [category, setCategory] = useState<AgentCategory>('all');
  const [sortOption, setSortOption] = useState<'comprehensive' | 'rating' | 'usage' | 'latest' | 'priceAsc'>('comprehensive');
  const [activeDetailTab, setActiveDetailTab] = useState<'intro' | 'sandbox' | 'api' | 'comments'>('intro');

  // Interactive Sandbox state
  const [sandboxPrompt, setSandboxPrompt] = useState('');
  const [sandboxMessages, setSandboxMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: '您好！我是千机 AI 空间 Agent 沙箱在线运行实例。请输入您的指令或提问，我将立即响应！' }
  ]);
  const [sandboxLoading, setSandboxLoading] = useState(false);

  // Category Filter
  const categories: { id: AgentCategory; label: string }[] = [
    { id: 'all', label: '全部分类' },
    { id: 'dialogue', label: '对话助手' },
    { id: 'coding', label: '编程辅助' },
    { id: 'data', label: '数据分析' },
    { id: 'image', label: '图像生成' },
    { id: 'vertical', label: '行业垂直(医疗/金融/法律)' },
  ];

  let filteredAgents = agents.filter(a => {
    if (category === 'all') return true;
    return a.category === category;
  });

  // Sorting
  filteredAgents.sort((a, b) => {
    if (sortOption === 'rating') return b.rating - a.rating;
    if (sortOption === 'usage') return b.usageCount - a.usageCount;
    if (sortOption === 'latest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortOption === 'priceAsc') return a.priceValue - b.priceValue;
    return 0; // comprehensive
  });

  const handleSendMessage = async () => {
    if (!sandboxPrompt.trim() || sandboxLoading) return;

    const userText = sandboxPrompt;
    setSandboxMessages(prev => [...prev, { role: 'user', text: userText }]);
    setSandboxPrompt('');
    setSandboxLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          systemInstruction: sandboxAgent?.techDocs || '你是千机AI空间的专有Agent助手。',
          model: 'gemini-3.6-flash'
        })
      });
      const data = await res.json();
      setSandboxMessages(prev => [...prev, { role: 'assistant', text: data.text || '处理完毕。' }]);
    } catch {
      setSandboxMessages(prev => [...prev, { role: 'assistant', text: '网络响应异常，请稍后再试。' }]);
    } finally {
      setSandboxLoading(false);
    }
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Category Filter & Sorting Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                category === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium shrink-0">
          <span>排序方式:</span>
          <select
            value={sortOption}
            onChange={(e: any) => setSortOption(e.target.value)}
            className="bg-slate-50 text-slate-800 border border-slate-200 rounded-xl px-3 py-1.5 outline-none cursor-pointer font-bold focus:bg-white"
          >
            <option value="comprehensive">综合排序</option>
            <option value="rating">评分最高</option>
            <option value="usage">使用最多</option>
            <option value="latest">最新发布</option>
            <option value="priceAsc">价格从低到高</option>
          </select>
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map(ag => (
          <div
            key={ag.id}
            className="group rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 p-6 shadow-xs hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-100 border border-indigo-200 flex items-center justify-center text-2xl shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    {ag.avatar}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {ag.name}
                    </h3>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                      <span>by {ag.author}</span>
                    </div>
                  </div>
                </div>

                {/* Price tag */}
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 ${
                  ag.priceType === 'free' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {ag.priceType === 'free' ? '免费获取' : `${ag.priceValue} 积分`}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                {ag.description}
              </p>

              {/* Badges / Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {ag.tags.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-slate-500 font-medium">
                <span className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {ag.rating}
                </span>
                <span>{ag.usageCount.toLocaleString()} 次调用</span>
              </div>

              <button
                onClick={() => {
                  setSandboxAgent(ag);
                  setActiveDetailTab('intro');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> 试用 / 详情
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50 via-white to-cyan-50 border border-indigo-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">没找到想要的 Agent？搭建专属 AI 工作流</div>
            <div className="text-xs text-slate-500">支持灵活配置 System Prompt、底层模型底座与第三方 Tool API 接入</div>
          </div>
        </div>
        <button
          onClick={() => {
            setActiveTab('workspace');
            setWorkspaceSubTab('assets');
            setCreateAgentModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span>创建自己的 Agent →</span>
        </button>
      </div>

      {/* Agent Details & Online Sandbox Modal */}
      {sandboxAgent && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-2xl">
                  {sandboxAgent.avatar}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{sandboxAgent.name}</h2>
                  <div className="text-xs text-slate-500">模型底座: {sandboxAgent.baseModel} · 版本: {sandboxAgent.version}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast('已收藏该 Agent 到工作台')}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
                  title="收藏"
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                </button>
                <button
                  onClick={() => setSandboxAgent(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Detail Tabs */}
            <div className="px-6 border-b border-slate-200 flex items-center gap-6 text-xs font-bold bg-white">
              <button
                onClick={() => setActiveDetailTab('intro')}
                className={`py-3 border-b-2 transition ${
                  activeDetailTab === 'intro' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                功能与技术文档
              </button>
              <button
                onClick={() => setActiveDetailTab('sandbox')}
                className={`py-3 border-b-2 transition flex items-center gap-1.5 ${
                  activeDetailTab === 'sandbox' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" /> 在线试用（沙箱）
              </button>
              <button
                onClick={() => setActiveDetailTab('api')}
                className={`py-3 border-b-2 transition flex items-center gap-1.5 ${
                  activeDetailTab === 'api' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" /> API 调用文档
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
              
              {activeDetailTab === 'intro' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-2">Agent 简介</h4>
                    <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                      {sandboxAgent.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-2">技术文档与实现细节</h4>
                    <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                      {sandboxAgent.techDocs}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-slate-500 text-[10px] font-medium">总调用次数</div>
                      <div className="text-sm font-black text-indigo-600 mt-1">{sandboxAgent.usageCount}</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-slate-500 text-[10px] font-medium">评分</div>
                      <div className="text-sm font-black text-amber-600 mt-1">{sandboxAgent.rating} / 5.0</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-slate-500 text-[10px] font-medium">作者</div>
                      <div className="text-sm font-black text-slate-800 mt-1 truncate">{sandboxAgent.author}</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-slate-500 text-[10px] font-medium">获取价格</div>
                      <div className="text-sm font-black text-emerald-600 mt-1">{sandboxAgent.priceType === 'free' ? '免费' : `${sandboxAgent.priceValue}积分`}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Online Sandbox Dialog */}
              {activeDetailTab === 'sandbox' && (
                <div className="flex flex-col h-[380px] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 沙箱环境运行中
                    </span>
                    <span className="font-medium">模型: {sandboxAgent.baseModel}</span>
                  </div>

                  {/* Messages */}
                  <div className="p-4 flex-1 overflow-y-auto space-y-3">
                    {sandboxMessages.map((m, idx) => (
                      <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3.5 rounded-2xl leading-relaxed text-xs ${
                          m.role === 'user' 
                            ? 'bg-indigo-600 text-white rounded-br-none font-medium shadow-xs' 
                            : 'bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-xs'
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                    {sandboxLoading && (
                      <div className="text-indigo-600 font-bold text-[11px] animate-pulse">
                        Agent 思考推理中...
                      </div>
                    )}
                  </div>

                  {/* Input Box */}
                  <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                    <input
                      type="text"
                      value={sandboxPrompt}
                      onChange={(e) => setSandboxPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="发送测试指令给该 Agent..."
                      className="flex-1 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl px-3.5 py-2 outline-none border border-slate-200 focus:bg-white focus:border-indigo-500 text-xs font-medium"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={sandboxLoading}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* API Calling Docs */}
              {activeDetailTab === 'api' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">API Key 授权</div>
                      <div className="text-[11px] text-slate-500">调用 Endpoint 时请在 Header 中携带此 Authorization Key</div>
                    </div>
                    <button
                      onClick={() => showToast('已成功复制 API Key 代码片段')}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-[11px] font-bold"
                    >
                      复制 API Key
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="font-bold text-slate-900">Python 接入示例</div>
                    <pre className="p-4 rounded-xl bg-slate-900 text-indigo-300 font-mono text-[11px] overflow-x-auto border border-slate-800">
{`import requests

url = "https://qianji.ai/api/v1/agent/run"
headers = {
    "Authorization": "Bearer qj_live_your_api_key",
    "Content-Type": "application/json"
}
payload = {
    "agent_id": "${sandboxAgent.id}",
    "prompt": "Hello Agent!"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`}
                    </pre>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
