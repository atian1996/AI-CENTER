import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Trophy, 
  Search, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  Upload, 
  FileText, 
  Award, 
  Eye, 
  Send, 
  X, 
  Building2, 
  Users, 
  Layers, 
  ArrowRight,
  Sparkles,
  Link2,
  FileCheck
} from 'lucide-react';

export interface UserRegisteredCompetition {
  id: string;
  competitionId: string;
  title: string;
  organizer: string;
  organizerBadge?: string;
  typeTag: 'AI数据科学赛' | 'AI安全挑战赛' | 'AIGC生成赛' | 'AI产品应用赛';
  registeredAt: string;
  status: 'registered_unstarted' | 'competing' | 'ended';
  statusLabel: string;
  deadline: string;
  teamType: '个人参赛' | '3人战队';
  teamName?: string;
  workStatus: 'submitted' | 'unsubmitted' | 'awarded';
  workDetail?: {
    workTitle: string;
    submittedAt: string;
    score?: number;
    awardTitle?: string;
    reviewStatus: '评审中' | '已完成评审' | '复赛晋级';
    summary: string;
    repoUrl?: string;
    fileUrl?: string;
  };
}

const initialRegisteredCompetitions: UserRegisteredCompetition[] = [
  {
    id: 'user-comp-01',
    competitionId: 'comp-01',
    title: '2026 AI创新巅峰赛',
    organizer: '中国人工智能学会',
    organizerBadge: '国家一级学会',
    typeTag: 'AI产品应用赛',
    registeredAt: '2026-08-15 14:30',
    status: 'competing',
    statusLabel: '参赛中',
    deadline: '2026-09-20 23:59',
    teamType: '3人战队',
    teamName: '极光智能创新小组',
    workStatus: 'submitted',
    workDetail: {
      workTitle: '基于多Agent协同的医疗影像智能辅助初筛系统',
      submittedAt: '2026-08-22 18:45',
      reviewStatus: '评审中',
      summary: '采用平台提供的多Agent协同框架，构建针对CT/MRI切片多模态特征的自动化质控、标注、报告初稿生成工作流，F1-Score提升14.2%。',
      repoUrl: 'https://github.com/developer/medical-agent-flow',
      fileUrl: 'medical_agent_v1.0_submission.zip'
    }
  },
  {
    id: 'user-comp-02',
    competitionId: 'comp-02',
    title: '2026 数据科学挑战赛',
    organizer: '国家数据科学研究院',
    organizerBadge: '国家重点实验室',
    typeTag: 'AI数据科学赛',
    registeredAt: '2026-08-18 10:15',
    status: 'competing',
    statusLabel: '参赛中',
    deadline: '2026-09-30 18:00',
    teamType: '个人参赛',
    workStatus: 'unsubmitted',
  },
  {
    id: 'user-comp-03',
    competitionId: 'comp-03',
    title: '2026 网络与AI安全攻防挑战赛',
    organizer: '网络空间安全人才培养基地',
    organizerBadge: '网安重点专项',
    typeTag: 'AI安全挑战赛',
    registeredAt: '2026-07-10 09:20',
    status: 'ended',
    statusLabel: '已结束',
    deadline: '2026-08-05 20:00',
    teamType: '个人参赛',
    workStatus: 'awarded',
    workDetail: {
      workTitle: '基于沙箱隔离的防越狱对抗防御护栏 (PromptGuard)',
      submittedAt: '2026-08-04 16:30',
      score: 96.8,
      awardTitle: '🏆 决赛一等奖 (¥30,000)',
      reviewStatus: '已完成评审',
      summary: '设计了双向动态过滤与对抗扰动检测机制，在300余种新型越狱提示词测试集中取得99.4%拦截率，零误杀率。',
      repoUrl: 'https://github.com/qianji-developer/prompt-guard-engine',
      fileUrl: 'promptguard_final_defense.zip'
    }
  },
  {
    id: 'user-comp-04',
    competitionId: 'comp-04',
    title: '2026 产业大模型应用创意赛',
    organizer: '数字经济产业创新联合体',
    organizerBadge: '产业联盟',
    typeTag: 'AIGC生成赛',
    registeredAt: '2026-08-20 16:00',
    status: 'registered_unstarted',
    statusLabel: '报名成功(未开始)',
    deadline: '2026-10-15 20:00',
    teamType: '个人参赛',
    workStatus: 'unsubmitted',
  }
];

export const WorkspaceCompetitions: React.FC = () => {
  const { openCompetitionDetail, showToast } = useApp();
  
  const [competitionsList, setCompetitionsList] = useState<UserRegisteredCompetition[]>(initialRegisteredCompetitions);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'registered_unstarted' | 'competing' | 'ended'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [detailItem, setDetailItem] = useState<UserRegisteredCompetition | null>(null);
  const [submitModalItem, setSubmitModalItem] = useState<UserRegisteredCompetition | null>(null);

  // Submit Form States
  const [submitForm, setSubmitForm] = useState({
    workTitle: '',
    summary: '',
    repoUrl: '',
    fileName: ''
  });

  // Filtered
  const filteredList = competitionsList.filter((comp) => {
    // Status
    if (statusFilter !== 'all' && comp.status !== statusFilter) return false;

    // Type
    if (typeFilter !== 'all' && comp.typeTag !== typeFilter) return false;

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
  const competingTotal = competitionsList.filter(c => c.status === 'competing').length;
  const endedTotal = competitionsList.filter(c => c.status === 'ended').length;

  const handleSubmitWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitModalItem) return;
    if (!submitForm.workTitle.trim() || !submitForm.summary.trim()) {
      showToast('请完整填写作品标题和概述');
      return;
    }

    // Update competition work
    setCompetitionsList(prev => prev.map(item => {
      if (item.id === submitModalItem.id) {
        return {
          ...item,
          workStatus: 'submitted',
          workDetail: {
            workTitle: submitForm.workTitle,
            submittedAt: new Date().toLocaleString(),
            reviewStatus: '评审中',
            summary: submitForm.summary,
            repoUrl: submitForm.repoUrl || 'https://github.com/qianji-developer/my-submission',
            fileUrl: submitForm.fileName || 'submission_package.zip'
          }
        };
      }
      return item;
    }));

    showToast('作品提交成功！评委会将进行线上盲审');
    setSubmitModalItem(null);
    setSubmitForm({ workTitle: '', summary: '', repoUrl: '', fileName: '' });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* 顶部标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Trophy className="w-5 h-5 text-purple-600" />
            我的赛事
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            展示您报名参与的所有官方赛事，便捷查看赛程进度、提交比赛作品与查看获奖成果
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
            <div className="text-xs text-slate-500 font-bold">正在参赛中</div>
            <div className="text-2xl font-black text-purple-600 font-mono">
              {competingTotal} <span className="text-xs text-slate-400 font-normal">项</span>
            </div>
            <div className="text-[11px] text-purple-600/80 font-medium">
              请留意作品提交截止时间
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs text-slate-500 font-bold">已完赛 / 获奖</div>
            <div className="text-2xl font-black text-amber-600 font-mono">
              {endedTotal} <span className="text-xs text-slate-400 font-normal">项</span>
            </div>
            <div className="text-[11px] text-amber-600/80 font-medium">
              累计获得荣誉大奖 1 项
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. 筛选栏 */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* 状态筛选 */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 font-bold mr-1">状态:</span>
            {[
              { id: 'all', label: '全部' },
              { id: 'registered_unstarted', label: '报名成功(未开始)' },
              { id: 'competing', label: `参赛中 (${competingTotal})` },
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
              <span className="text-xs text-slate-400 font-bold">类型:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                <option value="all">全部赛事类型</option>
                <option value="AI数据科学赛">AI数据科学赛</option>
                <option value="AI安全挑战赛">AI安全挑战赛</option>
                <option value="AIGC生成赛">AIGC生成赛</option>
                <option value="AI产品应用赛">AI产品应用赛</option>
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
                  <th className="py-3.5 px-4">我的作品状态</th>
                  <th className="py-3.5 px-4">参赛模式</th>
                  <th className="py-3.5 px-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredList.map((item) => {
                  const isCompeting = item.status === 'competing';
                  const isUnstarted = item.status === 'registered_unstarted';
                  const isEnded = item.status === 'ended';

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
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                          {item.typeTag}
                        </span>
                      </td>

                      {/* 报名时间 */}
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {item.registeredAt}
                      </td>

                      {/* 比赛状态 */}
                      <td className="py-3.5 px-4">
                        {isCompeting && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-purple-50 text-purple-700 border border-purple-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                            参赛中
                          </span>
                        )}
                        {isUnstarted && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            报名成功(未开始)
                          </span>
                        )}
                        {isEnded && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                            已完赛
                          </span>
                        )}
                      </td>

                      {/* 我的作品 */}
                      <td className="py-3.5 px-4">
                        {item.workStatus === 'awarded' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                            <Award className="w-3 h-3 text-amber-600" />
                            {item.workDetail?.awardTitle || '已获奖'}
                          </span>
                        )}
                        {item.workStatus === 'submitted' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <FileCheck className="w-3 h-3 text-emerald-600" />
                            已提交作品 ({item.workDetail?.reviewStatus || '评审中'})
                          </span>
                        )}
                        {item.workStatus === 'unsubmitted' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-400">
                            未提交
                          </span>
                        )}
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

                      {/* 操作 */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* 查看详情 */}
                          <button
                            onClick={() => setDetailItem(item)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                          >
                            详情
                          </button>

                          {/* 参赛中：进入比赛 / 提交作品 */}
                          {isCompeting && (
                            <>
                              <button
                                onClick={() => openCompetitionDetail(item.competitionId)}
                                className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs transition cursor-pointer"
                              >
                                进入比赛
                              </button>

                              <button
                                onClick={() => {
                                  setSubmitModalItem(item);
                                  if (item.workDetail) {
                                    setSubmitForm({
                                      workTitle: item.workDetail.workTitle,
                                      summary: item.workDetail.summary,
                                      repoUrl: item.workDetail.repoUrl || '',
                                      fileName: item.workDetail.fileUrl || ''
                                    });
                                  } else {
                                    setSubmitForm({ workTitle: '', summary: '', repoUrl: '', fileName: '' });
                                  }
                                }}
                                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1"
                              >
                                <Upload className="w-3 h-3" />
                                <span>{item.workStatus === 'submitted' ? '更新作品' : '提交作品'}</span>
                              </button>
                            </>
                          )}

                          {/* 已结束：查看作品 */}
                          {isEnded && item.workDetail && (
                            <button
                              onClick={() => setDetailItem(item)}
                              className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                            >
                              <Award className="w-3 h-3" />
                              <span>查看作品</span>
                            </button>
                          )}

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

      {/* 4. 赛事详情弹窗 */}
      {detailItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {detailItem.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{detailItem.organizer}</span>
                    <span>•</span>
                    <span className="text-purple-600 font-bold">{detailItem.typeTag}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setDetailItem(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. 报名信息 */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                我的报名信息
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold">报名时间</div>
                  <div className="text-xs font-mono font-bold text-slate-800 mt-0.5">
                    {detailItem.registeredAt}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold">参赛状态</div>
                  <div className="text-xs font-bold text-purple-700 mt-0.5">
                    {detailItem.statusLabel}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold">参赛方式</div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">
                    {detailItem.teamType} {detailItem.teamName ? `(${detailItem.teamName})` : ''}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold">截稿截止</div>
                  <div className="text-xs font-mono font-bold text-slate-800 mt-0.5">
                    {detailItem.deadline}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 我的参赛作品 */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                参赛作品与评审进展
              </h4>

              {detailItem.workDetail ? (
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-black text-slate-900">
                      {detailItem.workDetail.workTitle}
                    </div>
                    {detailItem.workDetail.awardTitle && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-white shadow-xs">
                        {detailItem.workDetail.awardTitle}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>提交时间: <strong className="font-mono text-slate-800">{detailItem.workDetail.submittedAt}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <FileCheck className="w-3.5 h-3.5 text-purple-600" />
                      <span>评审状态: <strong className="text-purple-700 font-bold">{detailItem.workDetail.reviewStatus}</strong></span>
                    </div>
                    {detailItem.workDetail.score && (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>专家评分: <strong className="font-mono font-black text-amber-600">{detailItem.workDetail.score} 分</strong></span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 pt-2 border-t border-purple-100">
                    <div className="text-[11px] font-bold text-slate-500">作品简介与技术亮点:</div>
                    <p className="text-slate-700 leading-relaxed">
                      {detailItem.workDetail.summary}
                    </p>
                  </div>

                  {(detailItem.workDetail.repoUrl || detailItem.workDetail.fileUrl) && (
                    <div className="pt-2 border-t border-purple-100 flex flex-wrap gap-3">
                      {detailItem.workDetail.repoUrl && (
                        <a
                          href={detailItem.workDetail.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          <span>源码仓库: {detailItem.workDetail.repoUrl}</span>
                        </a>
                      )}
                      {detailItem.workDetail.fileUrl && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                          <FileText className="w-3.5 h-3.5" />
                          <span>已上传附件: {detailItem.workDetail.fileUrl}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-700">您尚未提交参赛作品</div>
                  <p className="text-[11px] text-slate-400">
                    作品提交截止时间为 {detailItem.deadline}，请抓紧时间完成技术方案与原型部署
                  </p>
                  {detailItem.status === 'competing' && (
                    <button
                      onClick={() => {
                        setDetailItem(null);
                        setSubmitModalItem(detailItem);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition cursor-pointer inline-flex items-center gap-1"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>立即提交作品</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setDetailItem(null);
                  openCompetitionDetail(detailItem.competitionId);
                }}
                className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
              >
                <span>查看官方赛程与赛题说明</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setDetailItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                关闭
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. 提交作品弹窗 */}
      {submitModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-purple-600" />
                  提交比赛作品 · {submitModalItem.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  请上传您参赛的技术成果、方案架构与开源代码/模型链接
                </p>
              </div>
              <button
                onClick={() => setSubmitModalItem(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitWork} className="space-y-4 text-xs">
              
              {/* 作品标题 */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">作品名称 / 方案标题 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="例如：基于多Agent协同的医疗诊断助手"
                  value={submitForm.workTitle}
                  onChange={(e) => setSubmitForm({ ...submitForm, workTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-slate-900 font-medium"
                />
              </div>

              {/* 作品简介与技术架构 */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">作品简介与技术亮点 <span className="text-rose-500">*</span></label>
                <textarea
                  required
                  rows={4}
                  placeholder="简要说明参赛模型架构、微调方法、评测指标提升及实际落地价值..."
                  value={submitForm.summary}
                  onChange={(e) => setSubmitForm({ ...submitForm, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-slate-900 font-medium leading-relaxed"
                />
              </div>

              {/* 源码仓库/体验链接 */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">代码仓库 / Demo 在线体验 URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={submitForm.repoUrl}
                  onChange={(e) => setSubmitForm({ ...submitForm, repoUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-slate-900 font-mono"
                />
              </div>

              {/* 方案附件打包 */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">提交文件包 / 答辩 PPT</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center bg-slate-50 hover:bg-purple-50/50 hover:border-purple-300 transition cursor-pointer">
                  <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <span className="text-[11px] text-slate-600 font-bold block">
                    {submitForm.fileName ? `已选文件: ${submitForm.fileName}` : '点击或拖拽 ZIP/PDF 附件到此处上传'}
                  </span>
                  <span className="text-[10px] text-slate-400">支持 .zip, .tar.gz, .pdf (不超过 500MB)</span>
                  <input
                    type="file"
                    className="hidden"
                    id="comp-work-file"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setSubmitForm({ ...submitForm, fileName: e.target.files[0].name });
                      }
                    }}
                  />
                  <label htmlFor="comp-work-file" className="mt-2 inline-block px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-purple-600 cursor-pointer">
                    选择本地文件
                  </label>
                </div>
              </div>

              {/* 提交按钮 */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSubmitModalItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>确认提交</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
