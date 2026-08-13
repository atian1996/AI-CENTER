import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AgentItem, AgentSubscriptionItem } from '../../types';
import { SubscribeModal } from './SubscribeModal';
import { QuotaExhaustedModal } from './QuotaExhaustedModal';
import { AgentDetailViewModal } from './AgentDetailViewModal';
import { 
  Bot, 
  Star, 
  Play, 
  Sparkles, 
  Heart, 
  Plus, 
  Search, 
  Building2, 
  Zap, 
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  SlidersHorizontal,
  Flame
} from 'lucide-react';

export const AgentStore: React.FC = () => {
  const { 
    agents, 
    toggleFavoriteAgent, 
    favorites,
    setActiveTab, 
    setWorkspaceSubTab, 
    setCreateAgentModalOpen,
    showToast,
    openAgentDetail,
    openAgentSubscribe
  } = useApp();

  // 搜索与筛选状态
  const [searchQuery, setSearchQuery] = useState('');
  const [techFormFilter, setTechFormFilter] = useState<string>('all');
  const [sceneFilter, setSceneFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [priceModeFilter, setPriceModeFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<'comprehensive' | 'rating' | 'usage' | 'latest' | 'priceAsc'>('comprehensive');

  // 用户与 Agent 的体验/订阅状态
  const [trialCountLeft, setTrialCountLeft] = useState<number>(25); // 已登录用户每日30次额度，已用5次，剩25次
  const [subscriptions, setSubscriptions] = useState<Record<string, AgentSubscriptionItem>>({});
  const [payPerTokenAgents, setPayPerTokenAgents] = useState<Record<string, boolean>>({});

  // 筛选字典
  const techForms = [
    { key: 'all', label: '全部' },
    { key: 'Chatbot', label: 'Chatbot' },
    { key: 'Agent', label: 'Agent' },
    { key: 'Chatflow', label: 'Chatflow' },
    { key: 'Workflow', label: 'Workflow' },
    { key: '文本生成', label: '文本生成' },
  ];

  const scenes = [
    { key: 'all', label: '全部' },
    { key: '内容创作', label: '内容创作' },
    { key: '数据分析', label: '数据分析' },
    { key: '智能客服', label: '智能客服' },
    { key: '办公助理', label: '办公助理' },
    { key: '编程开发', label: '编程开发' },
    { key: '营销推广', label: '营销推广' },
    { key: '教育培训', label: '教育培训' },
    { key: '行业垂直', label: '行业垂直' },
  ];

  const industries = [
    { key: 'all', label: '全部' },
    { key: '政务', label: '政务' },
    { key: '制造', label: '制造' },
    { key: '零售', label: '零售' },
    { key: '金融', label: '金融' },
    { key: '医疗', label: '医疗' },
    { key: '教育', label: '教育' },
    { key: '文旅', label: '文旅' },
    { key: '企业', label: '企业' },
    { key: '物流', label: '物流' },
    { key: '通用', label: '通用' },
  ];

  const priceModes = [
    { key: 'all', label: '全部' },
    { key: 'free', label: '免费' },
    { key: 'token', label: '按Token计费' },
  ];

  // 数据过滤
  let filteredAgents = agents.filter(a => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = a.name.toLowerCase().includes(q);
      const matchDesc = a.description.toLowerCase().includes(q);
      const matchTags = a.tags.some(t => t.toLowerCase().includes(q));
      const matchDev = (a.developer || a.author).toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchTags && !matchDev) return false;
    }
    if (techFormFilter !== 'all' && a.techForm !== techFormFilter) return false;
    if (sceneFilter !== 'all' && a.scene !== sceneFilter) return false;
    if (industryFilter !== 'all' && a.industry !== industryFilter) return false;
    if (priceModeFilter === 'free' && a.priceType !== 'free') return false;
    if (priceModeFilter === 'token' && a.priceType !== 'token' && a.priceModel !== '按Token计费') return false;
    return true;
  });

  // 排序
  filteredAgents.sort((a, b) => {
    if (sortOption === 'rating') return b.rating - a.rating;
    if (sortOption === 'usage') return b.usageCount - a.usageCount;
    if (sortOption === 'latest') return new Date(b.createdAt || '2026-08-01').getTime() - new Date(a.createdAt || '2026-08-01').getTime();
    if (sortOption === 'priceAsc') return a.priceValue - b.priceValue;
    return 0;
  });

  // 处理“免费试用”/ Agent卡片点击
  const handleFreeTrialClick = (agent: AgentItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    openAgentDetail(agent);
  };

  // 处理“立即订阅”按钮点击
  const handleSubscribeClick = (agent: AgentItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    openAgentSubscribe(agent);
  };

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12">

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
            <span>AI集市</span>
            <span>/</span>
            <span className="text-indigo-600">Agent商店</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bot className="w-6 h-6 text-indigo-600" />
            Agent 商店
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setActiveTab('workspace');
              setWorkspaceSubTab('assets');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
          >
            <Bot className="w-4 h-4 text-slate-600" />
            <span>我的 Agent</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('workspace');
              setWorkspaceSubTab('assets');
              setCreateAgentModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-sm flex items-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>创建 Agent</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 搜索 Agent 名称、功能、场景、开发者..."
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-xs transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
          >
            清空
          </button>
        )}
      </div>

      {/* 5 Filter Selectors */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3.5">
        
        {/* Filter Row 1: 技术形态 */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="w-20 text-slate-400 font-bold shrink-0">技术形态：</span>
          <div className="flex flex-wrap items-center gap-1.5 flex-1">
            {techForms.map(t => (
              <button
                key={t.key}
                onClick={() => setTechFormFilter(t.key)}
                className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer ${
                  techFormFilter === t.key 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Row 2: 应用场景 */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="w-20 text-slate-400 font-bold shrink-0">应用场景：</span>
          <div className="flex flex-wrap items-center gap-1.5 flex-1">
            {scenes.map(s => (
              <button
                key={s.key}
                onClick={() => setSceneFilter(s.key)}
                className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer ${
                  sceneFilter === s.key 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Row 3: 行业领域 */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="w-20 text-slate-400 font-bold shrink-0">行业领域：</span>
          <div className="flex flex-wrap items-center gap-1.5 flex-1">
            {industries.map(i => (
              <button
                key={i.key}
                onClick={() => setIndustryFilter(i.key)}
                className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer ${
                  industryFilter === i.key 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {i.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Row 4: 价格模式 */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-20 text-slate-400 font-bold shrink-0">价格模式：</span>
            <div className="flex items-center gap-1.5">
              {priceModes.map(pm => (
                <button
                  key={pm.key}
                  onClick={() => setPriceModeFilter(pm.key)}
                  className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer ${
                    priceModeFilter === pm.key 
                      ? 'bg-indigo-600 text-white shadow-xs' 
                      : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
                  }`}
                >
                  {pm.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Row 5: 排序方式 */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
            <span>排序：</span>
            <select
              value={sortOption}
              onChange={(e: any) => setSortOption(e.target.value)}
              className="bg-slate-100/90 border border-slate-200 rounded-xl px-3 py-1 text-slate-800 font-bold outline-none cursor-pointer hover:bg-white"
            >
              <option value="comprehensive">综合排序 ▾</option>
              <option value="rating">评分最高</option>
              <option value="usage">使用最多</option>
              <option value="latest">最新发布</option>
              <option value="priceAsc">价格低到高</option>
            </select>
          </div>
        </div>

      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAgents.map(ag => {
          const isFav = favorites.some(f => f.id === ag.id);
          const isSubscribed = !!subscriptions[ag.id];

          return (
            <div
              key={ag.id}
              onClick={(e) => handleFreeTrialClick(ag, e)}
              className="group bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-400 p-5 shadow-xs hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                      {ag.avatar}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 flex items-center gap-1.5">
                        <span>{ag.name}</span>
                        {isSubscribed && (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded-md">
                            已订阅
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{ag.rating.toFixed(1)}</span>
                        <span className="text-slate-400 font-normal">({ag.ratingCount}人评价)</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteAgent(ag.id);
                    }}
                    className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition cursor-pointer"
                    title={isFav ? '已收藏' : '收藏'}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Badges line: 形态 · 场景 · 行业 */}
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {ag.techForm && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {ag.techForm}
                    </span>
                  )}
                  {ag.scene && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-100">
                      {ag.scene}
                    </span>
                  )}
                  {ag.industry && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      {ag.industry}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {ag.description}
                </p>

                {/* Service info & Developer */}
                <div className="text-[11px] text-slate-500 flex items-center justify-between font-medium mb-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>已服务 {ag.servicedCount ? ag.servicedCount.toLocaleString() : '1,234'} 家机构</span>
                  </span>
                  <span className="text-slate-700 font-bold">{ag.developer || ag.author}</span>
                </div>

                {/* Price tag */}
                <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-4">
                  <span>💰</span>
                  <span className="text-amber-800 font-extrabold">
                    免费试用 · ¥49/周起
                  </span>
                </div>
              </div>

              {/* Action Buttons: 仅保留 [ 免费试用 ] 和 [ 立即订阅 ] 两个按钮 */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={(e) => handleFreeTrialClick(ag, e)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-indigo-600" />
                  <span>免费试用</span>
                </button>
                
                <button
                  onClick={(e) => handleSubscribeClick(ag, e)}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>立即订阅</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {filteredAgents.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Bot className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">没有找到符合条件的 Agent</h3>
          <p className="text-xs text-slate-400 mt-1">请尝试更换搜索词或筛选组合。</p>
        </div>
      )}

    </div>
  );
};
