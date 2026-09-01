import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Trophy, 
  Search, 
  Clock, 
  ExternalLink, 
  Building2, 
  Play,
  FileText,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export interface UserRegisteredCompetition {
  id: string;
  competitionId: string;
  title: string;
  organizer: string;
  organizerBadge?: string;
  typeTag: 'AI挑战赛' | '数据科学赛' | 'AIGC生成赛' | 'AI产品创新赛' | 'AI数据科学赛' | 'AI安全挑战赛' | 'AI产品应用赛';
  registeredAt: string;
  status: 'unstarted' | 'ongoing' | 'ended';
  statusLabel: '未开始' | '进行中' | '已结束';
  deadline: string;
  teamType: '个人参赛' | '3人战队';
  teamName?: string;
}

const initialRegisteredCompetitions: UserRegisteredCompetition[] = [
  {
    id: 'user-comp-01',
    competitionId: 'comp-01',
    title: '2026 AI创新巅峰赛',
    organizer: '中国人工智能学会',
    organizerBadge: '国家一级学会',
    typeTag: 'AI产品创新赛',
    registeredAt: '2026-08-15 14:30',
    status: 'ongoing',
    statusLabel: '进行中',
    deadline: '2026-09-20 23:59',
    teamType: '3人战队',
    teamName: '极光智能创新小组'
  },
  {
    id: 'user-comp-02',
    competitionId: 'comp-02',
    title: '2026 数据科学挑战赛',
    organizer: '国家数据科学研究院',
    organizerBadge: '国家重点实验室',
    typeTag: '数据科学赛',
    registeredAt: '2026-08-18 10:15',
    status: 'unstarted',
    statusLabel: '未开始',
    deadline: '2026-09-30 18:00',
    teamType: '个人参赛'
  },
  {
    id: 'user-comp-03',
    competitionId: 'comp-03',
    title: '2026 网络与AI安全攻防挑战赛',
    organizer: '网络空间安全人才培养基地',
    organizerBadge: '网安重点专项',
    typeTag: 'AI挑战赛',
    registeredAt: '2026-07-10 09:20',
    status: 'ended',
    statusLabel: '已结束',
    deadline: '2026-08-05 20:00',
    teamType: '个人参赛'
  },
  {
    id: 'user-comp-04',
    competitionId: 'comp-04',
    title: '2026 产业大模型应用创意赛',
    organizer: '数字经济产业创新联合体',
    organizerBadge: '产业联盟',
    typeTag: 'AIGC生成赛',
    registeredAt: '2026-08-20 16:00',
    status: 'ongoing',
    statusLabel: '进行中',
    deadline: '2026-10-15 20:00',
    teamType: '个人参赛'
  }
];

// 根据比赛类型获取对应的进入比赛跳转链接
export const getCompetitionEnterUrl = (typeTag: string, title?: string): string => {
  const str = `${typeTag || ''} ${title || ''}`.toLowerCase();
  if (str.includes('挑战') || str.includes('安全') || str.includes('ctf') || str.includes('agentctf')) {
    return 'http://10.2.89.1/saas/contest/agentctf/d6a21329d479860493c6f3a6aeee9896';
  }
  if (str.includes('数据科学') || str.includes('时序')) {
    return 'http://10.2.89.1/saas/contest/web/contest/ai/enter/805f06cb51fea51263cf33ea15c2b1f6/rank';
  }
  if (str.includes('aigc') || str.includes('生成') || str.includes('创作') || str.includes('营销')) {
    return 'http://10.2.89.1/competitions-hall/competitions/aia-race-detail/40f258969d2e43858383b6e5a7423e3a';
  }
  if (str.includes('产品') || str.includes('创新') || str.includes('应用') || str.includes('原生')) {
    return 'http://10.2.89.1/competitions-hall/competitions/aia-race-detail/1973c668ec1a4bd2aae36e2a3043890d';
  }
  return 'http://10.2.89.1/competitions-hall/competitions/aia-race-detail/1973c668ec1a4bd2aae36e2a3043890d';
};

export const WorkspaceCompetitions: React.FC = () => {
  const { openCompetitionDetail, showToast } = useApp();
  
  const [competitionsList] = useState<UserRegisteredCompetition[]>(initialRegisteredCompetitions);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'unstarted' | 'ongoing' | 'ended'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtered
  const filteredList = competitionsList.filter((comp) => {
    // Status
    if (statusFilter !== 'all' && comp.status !== statusFilter) return false;

    // Type
    if (typeFilter !== 'all') {
      if (typeFilter === 'AI挑战赛' && !['AI挑战赛', 'AI安全挑战赛'].includes(comp.typeTag)) return false;
      if (typeFilter === '数据科学赛' && !['数据科学赛', 'AI数据科学赛'].includes(comp.typeTag)) return false;
      if (typeFilter === 'AIGC生成赛' && comp.typeTag !== 'AIGC生成赛') return false;
      if (typeFilter === 'AI产品创新赛' && !['AI产品创新赛', 'AI产品应用赛'].includes(comp.typeTag)) return false;
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = comp.title.toLowerCase().includes(q) || comp.organizer.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  // Stats
  const registeredTotal = competitionsList.length;
  const unstartedTotal = competitionsList.filter(c => c.status === 'unstarted').length;
  const ongoingTotal = competitionsList.filter(c => c.status === 'ongoing').length;
  const endedTotal = competitionsList.filter(c => c.status === 'ended').length;

  const handleEnterCompetition = (comp: UserRegisteredCompetition) => {
    const url = getCompetitionEnterUrl(comp.typeTag, comp.title);
    showToast(`正在跳转进入【${comp.title}】比赛系统...`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getStatusBadge = (status: UserRegisteredCompetition['status']) => {
    switch (status) {
      case 'unstarted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-500" />
            未开始
          </span>
        );
      case 'ongoing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            进行中
          </span>
        );
      case 'ended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            已结束
          </span>
        );
    }
  };

  const getTypeTagStyle = (tag: string) => {
    switch (tag) {
      case 'AI数据科学赛':
      case '数据科学赛':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'AI安全挑战赛':
      case 'AI挑战赛':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'AIGC生成赛':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'AI产品应用赛':
      case 'AI产品创新赛':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div id="workspace-competitions-view" className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* 顶部标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Trophy className="w-5 h-5 text-purple-600" />
            我的赛事
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            展示您报名参与的所有官方赛事，便捷查看赛程详情并一键直达竞赛平台
          </p>
        </div>
      </div>

      {/* 1. 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs text-slate-500 font-bold">已报名赛事</div>
            <div className="text-2xl font-black text-indigo-600 font-mono">
              {registeredTotal} <span className="text-xs text-slate-400 font-normal">项</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              国家级与权威学会认证
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs text-slate-500 font-bold">进行中赛事</div>
            <div className="text-2xl font-black text-emerald-600 font-mono">
              {ongoingTotal} <span className="text-xs text-slate-400 font-normal">项</span>
            </div>
            <div className="text-[11px] text-emerald-600/80 font-medium">
              实时角逐中
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs text-slate-500 font-bold">已结束赛事</div>
            <div className="text-2xl font-black text-slate-600 font-mono">
              {endedTotal} <span className="text-xs text-slate-400 font-normal">项</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              已完赛归档
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-200">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. 筛选栏 */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* 状态筛选 */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 font-bold mr-1">比赛状态:</span>
            {[
              { id: 'all', label: '全部' },
              { id: 'unstarted', label: `未开始 (${unstartedTotal})` },
              { id: 'ongoing', label: `进行中 (${ongoingTotal})` },
              { id: 'ended', label: `已结束 (${endedTotal})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 赛事类型 & 搜索 */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold">赛事类型:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                <option value="all">全部赛事类型</option>
                <option value="AI挑战赛">AI挑战赛</option>
                <option value="数据科学赛">数据科学赛</option>
                <option value="AIGC生成赛">AIGC生成赛</option>
                <option value="AI产品创新赛">AI产品创新赛</option>
              </select>
            </div>

            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="按赛事名称/主办方搜索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>
          </div>

        </div>
      </div>

      {/* 3. 赛事列表 */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        {filteredList.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-slate-700">暂无匹配的赛事</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              您可以前往赛事中心浏览并报名当前热门的 AI 官方巅峰赛与技术挑战赛
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">赛事名称 / 主办单位</th>
                  <th className="py-3.5 px-4">赛事类型</th>
                  <th className="py-3.5 px-4">报名时间</th>
                  <th className="py-3.5 px-4">比赛状态</th>
                  <th className="py-3.5 px-4">参赛模式</th>
                  <th className="py-3.5 px-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredList.map((item) => {
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* 赛事名称 */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="font-extrabold text-slate-900 flex items-center gap-2">
                            <span>{item.title}</span>
                            {item.organizerBadge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-100">
                                {item.organizerBadge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            <span>{item.organizer}</span>
                          </div>
                        </div>
                      </td>

                      {/* 赛事类型 */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${getTypeTagStyle(item.typeTag)}`}>
                          {item.typeTag}
                        </span>
                      </td>

                      {/* 报名时间 */}
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {item.registeredAt}
                      </td>

                      {/* 比赛状态 (未开始 / 进行中 / 已结束) */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* 参赛模式 */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-600">
                          <span className="font-bold">{item.teamType}</span>
                          {item.teamName && (
                            <div className="text-[10px] text-slate-400">{item.teamName}</div>
                          )}
                        </div>
                      </td>

                      {/* 操作 (只有 赛事详情 和 进入比赛 两个按钮) */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* 赛事详情 */}
                          <button
                            id={`view-detail-${item.id}`}
                            onClick={() => openCompetitionDetail(item.competitionId)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition cursor-pointer"
                          >
                            赛事详情
                          </button>

                          {/* 进入比赛 */}
                          <button
                            id={`enter-match-${item.id}`}
                            onClick={() => handleEnterCompetition(item)}
                            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs transition shadow-2xs flex items-center gap-1 cursor-pointer"
                          >
                            <span>进入比赛</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

