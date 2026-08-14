import React, { useState } from 'react';
import { AgentItem, AgentSubscriptionItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  Star, 
  Heart, 
  Share2, 
  ArrowLeft, 
  Building2, 
  Zap, 
  Send, 
  Code2, 
  BookOpen, 
  MessageSquare, 
  History, 
  CheckCircle2, 
  Sparkles, 
  Coins, 
  Play, 
  Flame,
  ShieldCheck,
  X
} from 'lucide-react';

interface AgentDetailViewModalProps {
  agent: AgentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenSubscribeModal: (agent: AgentItem) => void;
  onOpenQuotaModal: (agent: AgentItem) => void;
  userSubscription?: AgentSubscriptionItem;
  isPayPerTokenMode?: boolean;
  trialCountLeft: number;
  setTrialCountLeft: React.Dispatch<React.SetStateAction<number>>;
  setPayPerTokenMode: (enabled: boolean) => void;
}

export const AgentDetailViewModal: React.FC<AgentDetailViewModalProps> = ({
  agent,
  isOpen,
  onClose,
  onOpenSubscribeModal,
  onOpenQuotaModal,
  userSubscription,
  isPayPerTokenMode = false,
  trialCountLeft,
  setTrialCountLeft,
  setPayPerTokenMode
}) => {
  const { user, setUser, favorites, toggleFavoriteAgent, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'intro' | 'docs' | 'guide' | 'reviews'>('intro');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string; time?: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // 初始化首次信息
  React.useEffect(() => {
    if (agent) {
      setMessages([
        {
          role: 'assistant',
          text: `您好！我是【${agent.name}】。${agent.inputExample ? `您可以试着问我：\n"${agent.inputExample}"` : '请问有什么可以帮助您的？'}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [agent]);

  if (!isOpen || !agent) return null;

  const isFav = favorites.some(f => f.id === agent.id);

  // 发送体验对话消息
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // 检查额度模式
    if (!userSubscription && !isPayPerTokenMode) {
      if (trialCountLeft <= 0) {
        onOpenQuotaModal(agent);
        return;
      }
    }

    const userText = input;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: 'user', text: userText, time: nowTime }]);
    setInput('');
    setLoading(true);

    // 扣减额度或余额
    if (userSubscription) {
      // 已订阅：优先扣套餐 Token
    } else if (isPayPerTokenMode) {
      // 按Token扣费: 每次扣除 0.05 元
      if (user.balance < 0.05) {
        showToast('账户余额不足以按 Token 计费，已自动为您重置体验');
      } else {
        setUser(u => ({ ...u, balance: Math.max(0, Math.round((u.balance - 0.05) * 100) / 100) }));
        showToast('已实时按 Token 扣除 0.05 元');
      }
    } else {
      // 扣减免费试用次数
      setTrialCountLeft(prev => Math.max(0, prev - 1));
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          systemInstruction: agent.techDocs || agent.description || '你是AI智能助手',
          model: 'gemini-3.6-flash'
        })
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          text: data.text || agent.outputExample || '分析与推理完成。',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          text: agent.outputExample || '已接收到您的需求，并完成深度业务逻辑演练。在生产集成中可通过 API 直接调用。',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in overflow-y-auto cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full my-auto overflow-hidden flex flex-col max-h-[95vh] cursor-default"
      >
        
        {/* Top Header / Bar */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 text-xs font-bold transition cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回 Agent 商店</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavoriteAgent(agent.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                isFav 
                  ? 'bg-rose-50 border-rose-200 text-rose-600' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isFav ? '已收藏' : '收藏'}</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showToast('已复制 Agent 分享链接');
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>分享</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer ml-1"
              title="关闭弹窗"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Agent Profile Main Banner */}
        <div className="p-5 sm:p-6 bg-white border-b border-slate-100 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-3xl shadow-xs shrink-0">
                {agent.avatar}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">{agent.name}</h2>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{agent.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({agent.ratingCount}人评价)</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500 font-medium">
                  {agent.techForm && <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-md text-[10px]">{agent.techForm}</span>}
                  {agent.scene && <span className="bg-cyan-50 text-cyan-700 font-bold px-2 py-0.5 rounded-md text-[10px]">{agent.scene}</span>}
                  {agent.industry && <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md text-[10px]">{agent.industry}</span>}
                  <span className="text-slate-300">•</span>
                  <span>开发者：<strong className="text-slate-800">{agent.developer || agent.author}</strong></span>
                  <span className="text-slate-300">•</span>
                  <span>已服务 <strong className="text-slate-800">{agent.servicedCount ? agent.servicedCount.toLocaleString() : '1,234'}</strong> 家机构</span>
                </div>
              </div>
            </div>

            {/* Price badge */}
            <div className="shrink-0 bg-amber-50/80 border border-amber-200/80 px-4 py-2.5 rounded-2xl text-right">
              <div className="text-[11px] font-bold text-amber-800">计费方式</div>
              <div className="text-sm font-extrabold text-amber-900 flex items-center gap-1 mt-0.5">
                <span>💰 免费试用 · 订阅 ¥49/周起</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Tab Selection Navigation */}
          <div className="flex border-b border-slate-200 text-xs font-bold gap-6">
            <button
              onClick={() => setActiveTab('intro')}
              className={`pb-3 border-b-2 transition cursor-pointer ${
                activeTab === 'intro' ? 'border-indigo-600 text-indigo-600 font-black' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              功能介绍
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`pb-3 border-b-2 transition cursor-pointer ${
                activeTab === 'docs' ? 'border-indigo-600 text-indigo-600 font-black' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              技术文档
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`pb-3 border-b-2 transition cursor-pointer ${
                activeTab === 'guide' ? 'border-indigo-600 text-indigo-600 font-black' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              使用指南
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 border-b-2 transition cursor-pointer ${
                activeTab === 'reviews' ? 'border-indigo-600 text-indigo-600 font-black' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              评价区 ({agent.comments ? agent.comments.length : 2})
            </button>
          </div>

          {/* Tab Content 1: 功能介绍 */}
          {activeTab === 'intro' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>核心能力</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(agent.capabilityDesc || [
                    '智能解答常见问题，支持多轮流畅对话',
                    '支持无缝接入网站、小程序、微信公众号等多种渠道',
                    '可进行专有知识库向量化检索答疑'
                  ]).map((cap, i) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-700 font-medium flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-cyan-600" />
                  <span>适用场景</span>
                </h4>
                <div className="space-y-1.5">
                  {(agent.applicableScenes || [
                    '政务服务：政策法规咨询、办事指南指引',
                    '电商企业：售前售后答疑、物流单号查询',
                    '企业内部：HR 制度查询、IT 运维打卡指引'
                  ]).map((sc, i) => (
                    <div key={i} className="p-2.5 bg-slate-50/70 border border-slate-200/60 rounded-xl text-slate-600 font-medium">
                      • {sc}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 2: 技术文档 */}
          {activeTab === 'docs' && (
            <div className="space-y-3 text-xs bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                <span>API RESTful Specification</span>
                <span className="text-emerald-400">POST /api/v1/agents/{agent.id}/run</span>
              </div>
              <pre className="text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed">
{`// Header: Authorization: Bearer <YOUR_API_KEY>
// Content-Type: application/json
{
  "stream": true,
  "messages": [
    { "role": "user", "content": "${agent.inputExample || '你好，请帮我分析这份业务逻辑。'}" }
  ]
}`}
              </pre>
              <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                响应延迟：均值 &lt; 320ms · 支持 Server-Sent Events (SSE) 流式传输
              </div>
            </div>
          )}

          {/* Tab Content 3: 使用指南 */}
          {activeTab === 'guide' && (
            <div className="space-y-3 text-xs text-slate-700 leading-relaxed bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
              <h4 className="font-extrabold text-indigo-900 text-sm">📖 Agent 使用指南</h4>
              <p>
                {agent.useGuide || '您可以在下方【⚡ 在线体验】框内直接进行对话测验。如需嵌入自己系统，可前往【工作台 - API Key】创建调用凭证。'}
              </p>
            </div>
          )}

          {/* Tab Content 4: 评价区 */}
          {activeTab === 'reviews' && (
            <div className="space-y-3 text-xs">
              {(agent.comments || [
                { id: 'c1', userName: '张经理', userAvatar: '', rating: 5, content: '非常好用，多轮对话回复非常精准，给满分！', date: '2026-08-01' },
                { id: 'c2', userName: '刘工', userAvatar: '', rating: 5, content: '接入速度快，API 响应很高效。', date: '2026-08-05' }
              ]).map(c => (
                <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{c.userName}</span>
                    <span className="text-amber-500 font-bold">★ {c.rating}</span>
                  </div>
                  <p className="text-slate-600">{c.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* ⚡ 在线体验沙箱 Section */}
          <div className="p-5 bg-slate-50/90 rounded-3xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-indigo-600 fill-indigo-100" />
                <span>⚡ 在线体验沙箱</span>
              </h3>
              
              {/* Status Pill */}
              {userSubscription ? (
                <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>👑 已订阅 ({userSubscription.tierName} · 剩余 {userSubscription.tokensLeftVal}万 Token)</span>
                </div>
              ) : isPayPerTokenMode ? (
                <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-extrabold flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" />
                  <span>按 Token 扣费模式（余额: ¥{user.balance.toFixed(2)}）</span>
                </div>
              ) : trialCountLeft > 0 ? (
                <div className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-extrabold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>🔵 试用模式（今日剩余 {trialCountLeft}/30 次）</span>
                </div>
              ) : (
                <div className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-extrabold flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" />
                  <span>🔴 免费额度已用完 (0/30)</span>
                </div>
              )}
            </div>

            {/* Quota warning banner when trial reaches 0 */}
            {!userSubscription && !isPayPerTokenMode && trialCountLeft <= 0 ? (
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-900 font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <span>💡 今日免费试用体验额度已用完（30次/天）。您可选择继续使用方式：</span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setPayPerTokenMode(true);
                      showToast('已开启按 Token 扣费模式！每次对话从账户余额按量扣费');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold transition cursor-pointer text-[11px]"
                  >
                    按 Token 扣费
                  </button>
                  <button
                    onClick={() => onOpenSubscribeModal(agent)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold transition cursor-pointer text-[11px]"
                  >
                    订阅套餐
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-indigo-50/70 border border-indigo-100/80 px-3.5 py-2 rounded-xl text-[11px] text-indigo-900 font-medium">
                💡 试用额度每日零点自动刷新 30 次对话。可在此框中直接测试 Agent 多轮深度对话能力。
              </div>
            )}

            {/* Chat Sandbox Window */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 h-64 overflow-y-auto space-y-3 shadow-inner">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-indigo-600 text-white font-medium rounded-tr-xs'
                        : 'bg-slate-100 text-slate-800 font-medium rounded-tl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>
                    {m.time && (
                      <div className={`text-[9px] mt-1 text-right ${m.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {m.time}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 text-slate-500 rounded-2xl p-3 text-xs flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                    <span>Agent 正在分析思考并深度推理...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="输入提示指令或对 Agent 的提问..."
                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-2xs"
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-sm transition flex items-center gap-1 cursor-pointer shrink-0 disabled:opacity-50"
              >
                <span>发送</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-bold flex items-center gap-2">
            <span>💰 免费试用 · 订阅 ¥49/周起</span>
            {userSubscription ? (
              <span className="text-emerald-600 font-extrabold">(已激活订阅套餐)</span>
            ) : isPayPerTokenMode ? (
              <span className="text-amber-600 font-extrabold">(按 Token 扣费中)</span>
            ) : (
              <span className="text-indigo-600 font-extrabold">(今日剩余 {trialCountLeft} 次)</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              返回 Agent 商店
            </button>
            <button
              onClick={() => onOpenSubscribeModal(agent)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>立即订阅套餐</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
