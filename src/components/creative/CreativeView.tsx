import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CompetitionItem, CompetitionStatus, CompetitionTypeTag } from '../../types';
import { CompetitionDetailView } from './CompetitionDetailView';
import { 
  Trophy, 
  Search, 
  Calendar, 
  Building2, 
  Layers, 
  ArrowRight, 
  Clock, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Users,
  Award,
  Zap
} from 'lucide-react';

export const CreativeView: React.FC = () => {
  const { 
    competitions, 
    selectedCompetitionId, 
    setSelectedCompetitionId, 
    showToast 
  } = useApp();

  // 筛选状态
  const [statusFilter, setStatusFilter] = useState<CompetitionStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<CompetitionTypeTag | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // 状态选项
  const statusOptions: { value: CompetitionStatus | 'all'; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'unstarted', label: '未开始' },
    { value: 'ongoing', label: '进行中' },
    { value: 'ended', label: '已结束' },
  ];

  // 类型选项
  const typeOptions: { value: CompetitionTypeTag | 'all'; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'AI数据科学赛', label: 'AI数据科学赛' },
    { value: 'AI安全挑战赛', label: 'AI安全挑战赛' },
    { value: 'AIGC生成赛', label: 'AIGC生成赛' },
    { value: 'AI产品应用赛', label: 'AI产品应用赛' },
  ];

  // 过滤后的赛事列表
  const filteredCompetitions = useMemo(() => {
    return competitions.filter(item => {
      // 状态筛选
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      // 类型筛选 (包含任意一个匹配标签)
      if (typeFilter !== 'all' && !item.typeTags.includes(typeFilter as CompetitionTypeTag)) {
        return false;
      }
      // 关键字搜索 (标题、主办方、简介)
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(kw);
        const matchOrg = item.organizer.toLowerCase().includes(kw);
        const matchSummary = item.introduction.summary.toLowerCase().includes(kw);
        if (!matchTitle && !matchOrg && !matchSummary) {
          return false;
        }
      }
      return true;
    });
  }, [competitions, statusFilter, typeFilter, searchKeyword]);

  // 获取当前查看详情的赛事
  const selectedCompetition = useMemo(() => {
    if (!selectedCompetitionId) return null;
    return competitions.find(c => c.id === selectedCompetitionId) || null;
  }, [competitions, selectedCompetitionId]);

  // 如果处于详情模式，直接渲染详情视图
  if (selectedCompetition) {
    return (
      <CompetitionDetailView 
        competition={selectedCompetition} 
        onBack={() => setSelectedCompetitionId(null)} 
      />
    );
  }

  // 状态 Badge 渲染
  const getStatusBadge = (status: CompetitionStatus) => {
    switch (status) {
      case 'ongoing':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500 text-white shadow-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            进行中
          </span>
        );
      case 'unstarted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-500 text-white shadow-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            未开始
          </span>
        );
      case 'ended':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-slate-500 text-white shadow-xs">
            已结束
          </span>
        );
    }
  };

  return (
    <div id="competition-center-container" className="w-full space-y-6 animate-fade-in pb-16 select-none font-sans">
      
      {/* 顶部主标题与说明区 (与AI集市、任务大厅、算力工坊一致) */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 p-8 text-white shadow-xl overflow-hidden border border-indigo-900/50">
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:20px_20px] opacity-25" />
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-black">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>AI 竞技场 · 极客角逐</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>赛事中心</span>
              <span className="text-sm font-mono font-medium text-slate-300">COMPETITION CENTER</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              汇聚全球顶尖 AI 算法赛、网安攻防对抗与 AIGC 创意竞技。海量真实行业数据集与专属 GPU 评测环境，赋能开发者以技会友、角逐丰厚奖池与大厂直通车。
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div className="text-[11px] text-slate-300 font-mono">累计总奖池</div>
              <div className="text-xl font-black text-amber-400 font-mono">¥500,000+</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div className="text-[11px] text-slate-300 font-mono">参赛极客</div>
              <div className="text-xl font-black text-cyan-300 font-mono">3,800+</div>
            </div>
          </div>
        </div>
      </div>

      {/* 筛选与检索栏 */}
      <div id="competition-filter-card" className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
        
        {/* 状态筛选 */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-black text-slate-500 flex items-center gap-1.5 w-16 shrink-0">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span>状 态：</span>
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {statusOptions.map(opt => {
              const isSelected = statusFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  id={`filter-status-${opt.value}`}
                  onClick={() => setStatusFilter(opt.value)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 类型筛选 */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
          <span className="text-xs font-black text-slate-500 flex items-center gap-1.5 w-16 shrink-0">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>赛道分类：</span>
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {typeOptions.map(opt => {
              const isSelected = typeFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  id={`filter-type-${opt.value}`}
                  onClick={() => setTypeFilter(opt.value)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 关键字搜索输入框 */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="competition-search-input"
              type="text"
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              placeholder="搜索赛事名称、主办方或赛题关键字..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none transition"
            />
          </div>

          <div className="text-xs text-slate-400 font-mono">
            共找到 <strong className="text-indigo-600 font-bold">{filteredCompetitions.length}</strong> 场精彩赛事
          </div>
        </div>

      </div>

      {/* 赛事列表展示网格 */}
      {filteredCompetitions.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-base font-black text-slate-800">暂无匹配的赛事</h3>
          <p className="text-xs text-slate-500">试着切换筛选条件或清除搜索关键字以查看全部赛事</p>
          <button
            onClick={() => {
              setStatusFilter('all');
              setTypeFilter('all');
              setSearchKeyword('');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-xs hover:bg-indigo-100 transition cursor-pointer"
          >
            重置筛选
          </button>
        </div>
      ) : (
        <div id="competitions-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCompetitions.map(item => (
            <div
              key={item.id}
              id={`competition-card-${item.id}`}
              className="group relative rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-lg hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                {/* 赛事封面长图：精简高度为 36 (144px) */}
                <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent" />
                  
                  {/* 状态徽标 */}
                  <div className="absolute top-3 left-3 z-10">
                    {getStatusBadge(item.status)}
                  </div>

                  {/* 赛道类型标签集合 */}
                  <div className="absolute top-3 right-3 z-10 flex flex-wrap gap-1 justify-end max-w-[200px]">
                    {item.typeTags.slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-[9px] font-black bg-white/20 text-white backdrop-blur-md border border-white/30"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.typeTags.length > 2 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-white/20 text-white backdrop-blur-md border border-white/30">
                        +{item.typeTags.length - 2}
                      </span>
                    )}
                  </div>

                  {/* 底部主办方信息浮标 */}
                  <div className="absolute bottom-2.5 left-3 right-3 z-10 flex items-center text-white">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                        <Building2 className="w-3 h-3" />
                      </div>
                      <span className="text-[11px] font-bold drop-shadow-sm line-clamp-1 text-slate-200">
                        {item.organizer}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 赛事核心信息区 */}
                <div className="p-4 space-y-2.5">
                  {/* 标题 */}
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-1">
                    {item.title}
                  </h3>

                  {/* 赛事时间 */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                    <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">时间：<strong className="text-slate-700 font-bold">{item.startTime} ~ {item.endTime}</strong></span>
                  </div>

                  {/* 简介 */}
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 font-normal">
                    {item.introduction.summary}
                  </p>
                </div>
              </div>

              {/* 底部进入详情按钮 */}
              <div className="px-4 pb-4 pt-1">
                <button
                  id={`enter-competition-detail-btn-${item.id}`}
                  onClick={() => setSelectedCompetitionId(item.id)}
                  className="w-full py-2 rounded-xl bg-slate-50 group-hover:bg-indigo-600 text-slate-700 group-hover:text-white border border-slate-200 group-hover:border-transparent text-xs font-black shadow-2xs group-hover:shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-200"
                >
                  <span>查看赛事详情与参赛</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
