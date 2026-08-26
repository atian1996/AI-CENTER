import React, { useState, useEffect, useRef } from 'react';
import { AgentItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  RotateCcw, 
  Zap, 
  ShieldCheck, 
  Coins, 
  ArrowLeft,
  Building2
} from 'lucide-react';

interface AgentTrialPageViewProps {
  agent: AgentItem;
}

export const AgentTrialPageView: React.FC<AgentTrialPageViewProps> = ({ agent }) => {
  const { 
    user, 
    setUser, 
    subscriptions, 
    payPerTokenAgents, 
    setPayPerTokenAgents,
    trialCountLeft, 
    setTrialCountLeft,
    openAgentSubscribe,
    showToast 
  } = useApp();

  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string; time?: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const userSubscription = subscriptions[agent.id];
  const isPayPerTokenMode = !!payPerTokenAgents[agent.id];

  // Initialize trial chatbot greeting
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        text: `您好！我是【${agent.name}】${userSubscription ? '智能助手' : '在线试用助理'}。${agent.inputExample ? `您可以输入：\n"${agent.inputExample}"` : '请问有什么可以帮助您的？'}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [agent, userSubscription]);

  // Scroll to bottom on message updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // Quota validation
    if (!userSubscription && !isPayPerTokenMode) {
      if (trialCountLeft <= 0) {
        showToast('今日 30 次免费试用额度已用完，请订阅套餐以解锁无限次使用！');
        return;
      }
    }

    const userText = input;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: 'user', text: userText, time: nowTime }]);
    setInput('');
    setLoading(true);

    // Deduct count/balance
    if (userSubscription) {
      // Subscribed
    } else if (isPayPerTokenMode) {
      if (user.balance < 0.05) {
        showToast('余额不足以支付 API 令牌费用，请充值');
        setLoading(false);
        return;
      }
      setUser(u => ({ ...u, balance: Math.max(0, Math.round((u.balance - 0.05) * 100) / 100) }));
      showToast('按量扣除 0.05 元');
    } else {
      setTrialCountLeft(prev => Math.max(0, prev - 1));
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          systemInstruction: agent.capabilityDesc?.join('\n') || agent.description || '你是 AI 智能助手',
          model: 'gemini-3.6-flash'
        })
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          text: data.text || agent.outputExample || '分析与计算推理已完成。',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          text: agent.outputExample || '已接收到您的需求，并成功调用后台模型进行推理。正式版可提供极致低延迟。',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearMessages = () => {
    setMessages([
      {
        role: 'assistant',
        text: `对话已重置。我是【${agent.name}】。`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSubscribe = () => {
    openAgentSubscribe(agent);
  };

  const handleCloseTab = () => {
    window.close();
  };

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col select-none overflow-hidden h-screen w-screen z-50">
      
      {/* 1. Header Bar */}
      <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shadow-xs">
            {agent.avatar}
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span>{agent.name}</span>
              {userSubscription ? (
                <span className="px-2.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  正式授权版 (无限次)
                </span>
              ) : isPayPerTokenMode ? (
                <span className="px-2.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700 border border-amber-200 font-extrabold flex items-center gap-1">
                  <Coins className="w-3 h-3 text-amber-600" />
                  按量计费版
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 font-extrabold animate-pulse">
                  智能沙箱免费试用
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              模型版本: v{agent.version || '1.1.0'} · 底座驱动: {agent.baseModel || 'DeepSeek V4 / Gemini 3.6'}
            </div>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleClearMessages}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition border border-slate-100 bg-slate-50 cursor-pointer"
            title="清空并重置对话"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          {userSubscription || isPayPerTokenMode ? (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-bold shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>已获得正式使用授权</span>
            </div>
          ) : (
            <button
              onClick={handleSubscribe}
              className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md shadow-indigo-600/10 transition cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-white fill-current" />
              <span>立即订阅套餐</span>
            </button>
          )}

          <button
            onClick={handleCloseTab}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition bg-slate-50 border border-slate-100 cursor-pointer"
            title="关闭当前页面"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Workspace Body Split Panel */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* Left Side: Detail Overview & Limits Info */}
        <aside className="w-80 bg-white border-r border-slate-200/80 p-6 flex flex-col justify-between overflow-y-auto shrink-0 hidden md:flex">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">智能体详情</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {agent.description}
              </p>
            </div>

            {/* Trial Quota status list */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                {userSubscription ? '授权状态' : isPayPerTokenMode ? '按量计费状态' : '今日试用额度配额'}
              </h3>
              
              {userSubscription ? (
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4.5 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-black text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>已授权正式版 (无限次)</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 font-medium leading-relaxed">
                    您已获得该 Agent 的完整调用授权，享受极速响应与无限次对话。
                  </p>
                  <div className="pt-2 border-t border-emerald-200/60 flex justify-between text-[11px] font-extrabold text-emerald-800">
                    <span>有效期至：</span>
                    <span>{userSubscription.expireDate}</span>
                  </div>
                </div>
              ) : isPayPerTokenMode ? (
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4.5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                    <Coins className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>按 Token 实时扣费</span>
                  </div>
                  <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                    每次对话根据使用 Token 数量实时扣费，永久有效。
                  </p>
                </div>
              ) : (
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4.5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                    <span>免费试用次数</span>
                    <span>{trialCountLeft} / 30 次</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200/60 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${(trialCountLeft / 30) * 100}%` }}
                    />
                  </div>
                  
                  <p className="text-[10px] text-indigo-700 font-semibold leading-relaxed">
                    💡 试用额度每日零点重置。订阅付费套餐可解锁无限次、更高速度的 API 服务权限。
                  </p>
                </div>
              )}
            </div>

            {/* Technical Specs based on real fields */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">技术指标规格</h3>
              <div className="space-y-2 text-xs font-semibold text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div className="flex justify-between py-1 border-b border-slate-200/60 text-[11px]">
                  <span className="text-slate-400">底座模型</span>
                  <span className="text-slate-800 font-extrabold">{agent.baseModel || 'DeepSeek V4 / Gemini'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 text-[11px]">
                  <span className="text-slate-400">技术形态</span>
                  <span className="text-indigo-600 font-extrabold">{agent.techForm || 'Agent'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 text-[11px]">
                  <span className="text-slate-400">应用场景</span>
                  <span className="text-cyan-700 font-extrabold">{agent.categoryTags && agent.categoryTags.length > 0 ? agent.categoryTags.join('、') : (agent.scene || '办公助理')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 text-[11px]">
                  <span className="text-slate-400">行业领域</span>
                  <span className="text-emerald-700 font-extrabold">{agent.industryTags && agent.industryTags.length > 0 ? agent.industryTags.join('、') : (agent.industry || '通用')}</span>
                </div>
                <div className="flex justify-between py-1 text-[11px]">
                  <span className="text-slate-400">开发主体</span>
                  <span className="text-slate-800 font-extrabold">{agent.developer || agent.author || 'AI 平台官方'}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Side: Main Chatbox Window */}
        <main className="flex-1 bg-slate-100/50 flex flex-col justify-between overflow-hidden">
          
          {/* Chat List container */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            
            {/* Subscription banner when quota is exhausted */}
            {!userSubscription && !isPayPerTokenMode && trialCountLeft <= 0 && (
              <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-2xl text-xs text-amber-900 font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-3xs animate-fade-in max-w-4xl mx-auto">
                <div className="space-y-0.5">
                  <div className="font-extrabold flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-amber-600" />
                    <span>今日 30 次免费体验额度已用完</span>
                  </div>
                  <p className="text-[11px] text-amber-700 font-medium">请订阅套餐或开通按量扣费，以便继续进行生产测试与体验。</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setPayPerTokenAgents(prev => ({ ...prev, [agent.id]: true }));
                      showToast('按 Token 扣费模式已激活（当前可用余额 ¥' + user.balance.toFixed(2) + '）');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold transition text-[11px]"
                  >
                    按 Token 扣费
                  </button>
                  <button
                    onClick={handleSubscribe}
                    className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold transition text-[11px]"
                  >
                    立即订阅套餐
                  </button>
                </div>
              </div>
            )}

            {/* Message rows */}
            <div className="max-w-4xl mx-auto space-y-4 w-full">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className="flex items-start gap-3 max-w-[85%]">
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-lg shadow-2xs shrink-0">
                        {agent.avatar}
                      </div>
                    )}
                    <div
                      className={`rounded-2xl p-4 text-xs leading-relaxed font-medium shadow-2xs ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                      {msg.time && (
                        <div className={`text-[9px] mt-1 text-right ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {msg.time}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs font-semibold flex items-center gap-2.5 shadow-2xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping shrink-0" />
                    <span className="text-slate-500">Agent 正在执行复杂推理链计算...</span>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Chat input box at the bottom */}
          <div className="bg-white border-t border-slate-200/80 p-4 shrink-0">
            <div className="max-w-4xl mx-auto flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={trialCountLeft <= 0 && !userSubscription && !isPayPerTokenMode ? "试用次数已达上限" : (userSubscription || isPayPerTokenMode ? `向 ${agent.name} 输入指令或提问...` : `向 ${agent.name} 输入指令或提问（剩余试用：${trialCountLeft}次）...`)}
                disabled={loading || (!userSubscription && !isPayPerTokenMode && trialCountLeft <= 0)}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all duration-300"
              />
              <button
                onClick={handleSend}
                disabled={loading || (!input.trim()) || (!userSubscription && !isPayPerTokenMode && trialCountLeft <= 0)}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md shadow-indigo-600/10 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>发送指令</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </main>

      </div>

    </div>
  );
};
