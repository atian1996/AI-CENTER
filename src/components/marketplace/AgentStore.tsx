import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AgentItem, AgentSubscriptionItem } from '../../types';
import { SubscribeModal } from './SubscribeModal';
import { QuotaExhaustedModal } from './QuotaExhaustedModal';
import { AgentDetailViewModal } from './AgentDetailViewModal';
import { motion, AnimatePresence } from 'motion/react';
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
  Flame,
  ChevronDown,
  RotateCcw
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

  // 控制高级筛选面板展示
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

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
    { key: 'all', label: '全部场景' },
    { key: '办公助理', label: '办公助理' },
    { key: '内容创作', label: '内容创作' },
    { key: '数据分析', label: '数据分析' },
    { key: '智能客服', label: '智能客服' },
    { key: '编程开发', label: '编程开发' },
    { key: '营销推广', label: '营销推广' },
    { key: '教育培训', label: '教育培训' },
    { key: '行业垂直', label: '行业垂直' },
  ];

  const industries = [
    { key: 'all', label: '全部行业' },
    { key: '通用', label: '通用领域' },
    { key: '政务', label: '政务政工' },
    { key: '制造', label: '智能制造' },
    { key: '零售', label: '智慧零售' },
    { key: '金融', label: '金融科技' },
    { key: '医疗', label: '医疗健康' },
    { key: '教育', label: '数字教育' },
    { key: '文旅', label: '智慧文旅' },
    { key: '企业', label: '企业管理' },
  ];

  const priceModes = [
    { key: 'all', label: '全部价格' },
    { key: 'free', label: '免费试用' },
    { key: 'token', label: 'Token 计费' },
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

  // 重置所有筛选
  const handleResetFilters = () => {
    setTechFormFilter('all');
    setSceneFilter('all');
    setIndustryFilter('all');
    setPriceModeFilter('all');
    setSearchQuery('');
  };

  const activeFiltersCount = 
    (techFormFilter !== 'all' ? 1 : 0) + 
    (sceneFilter !== 'all' ? 1 : 0) + 
    (industryFilter !== 'all' ? 1 : 0) + 
    (priceModeFilter !== 'all' ? 1 : 0);

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

      {/* 精致的一行检索控制面板 (Control Row) */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs relative z-10">
        
        {/* 左侧搜索框 */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="在海量 AI 智能体中搜索名称、功能、场景或开发者..."
            className="w-full pl-10 pr-16 py-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100/50 shadow-2xs transition-all duration-300"
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

        {/* 筛选、排序与创建操作组合 */}
        <div className="flex flex-wrap items-center justify-between w-full md:w-auto gap-3 shrink-0">
          
          {/* 高级筛选按钮 */}
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 cursor-pointer ${
              isAdvancedOpen || activeFiltersCount > 0
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-2xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>高级过滤</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* 排序下拉框 */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e: any) => setSortOption(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold outline-none cursor-pointer hover:bg-slate-50 appearance-none pr-8 shadow-2xs"
            >
              <option value="comprehensive">综合排序</option>
              <option value="rating">好评优先</option>
              <option value="usage">热度最高</option>
              <option value="latest">最新上架</option>
              <option value="priceAsc">价格低到高</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>

          {/* 核心动作：我的 Agent */}
          <button
            onClick={() => {
              setActiveTab('workspace');
              setWorkspaceSubTab('assets');
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200/60"
          >
            <Bot className="w-3.5 h-3.5 text-slate-500" />
            <span>我的 Agent</span>
          </button>

          {/* 核心动作：创建 Agent */}
          <button
            onClick={() => {
              setActiveTab('workspace');
              setWorkspaceSubTab('assets');
              setCreateAgentModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>发布智能体</span>
          </button>
        </div>
      </div>

      {/* 热门场景快捷分类圆角胶囊推荐 (Scenes Capsules Row) */}
      <div className="flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-none no-scrollbar">
        <span className="text-xs text-slate-400 font-extrabold shrink-0 mr-1.5 flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> 推荐分类:
        </span>
        {scenes.map(s => {
          const isActive = sceneFilter === s.key;
          return (
            <button
              key={s.key}
              onClick={() => setSceneFilter(s.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-transparent shadow-xs shadow-indigo-200'
                  : 'bg-white text-slate-600 border-slate-200/80 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* 高级参数过滤收纳面板 (Advanced Drawer with smooth transition) */}
      <AnimatePresence>
        {isAdvancedOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/60 shadow-2xs space-y-4">
              
              {/* Filter grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                
                {/* 1. 技术形态 */}
                <div className="space-y-2">
                  <div className="font-extrabold text-slate-700 flex items-center justify-between">
                    <span>开发框架 & 技术形态</span>
                    {techFormFilter !== 'all' && (
                      <button onClick={() => setTechFormFilter('all')} className="text-[10px] text-indigo-600 font-bold hover:underline">清除</button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {techForms.map(t => (
                      <button
                        key={t.key}
                        onClick={() => setTechFormFilter(t.key)}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer text-[11px] ${
                          techFormFilter === t.key 
                            ? 'bg-indigo-600 text-white shadow-3xs' 
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. 行业领域 */}
                <div className="space-y-2">
                  <div className="font-extrabold text-slate-700 flex items-center justify-between">
                    <span>垂直业务场景与行业</span>
                    {industryFilter !== 'all' && (
                      <button onClick={() => setIndustryFilter('all')} className="text-[10px] text-indigo-600 font-bold hover:underline">清除</button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {industries.map(i => (
                      <button
                        key={i.key}
                        onClick={() => setIndustryFilter(i.key)}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer text-[11px] ${
                          industryFilter === i.key 
                            ? 'bg-indigo-600 text-white shadow-3xs' 
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {i.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. 计费模式与重置 */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="font-extrabold text-slate-700 flex items-center justify-between">
                      <span>价格与计费模式</span>
                      {priceModeFilter !== 'all' && (
                        <button onClick={() => setPriceModeFilter('all')} className="text-[10px] text-indigo-600 font-bold hover:underline">清除</button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {priceModes.map(pm => (
                        <button
                          key={pm.key}
                          onClick={() => setPriceModeFilter(pm.key)}
                          className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer text-[11px] ${
                            priceModeFilter === pm.key 
                              ? 'bg-indigo-600 text-white shadow-3xs' 
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {pm.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium">已激活 {activeFiltersCount} 项过滤条件</span>
                    <button
                      onClick={handleResetFilters}
                      className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>重置全部筛选</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
