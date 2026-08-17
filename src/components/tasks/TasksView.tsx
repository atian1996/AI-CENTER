import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskItem, TaskDomain, TaskDifficulty, TaskCategoryType } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase,
  Plus,
  Clock,
  Coins,
  Send,
  FileText,
  Search,
  Users,
  Sparkles,
  ArrowUpDown,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Filter,
  Check
} from 'lucide-react';
import { TaskDetailModal } from './TaskDetailModal';

export const TasksView: React.FC = () => {
  const { tasks, setPublishTaskModalOpen, user, takeTask, showToast } = useApp();

  // 搜索与过滤状态
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('全部');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('全部');
  const [selectedCategoryType, setSelectedCategoryType] = useState<string>('全部');
  const [sortBy, setSortBy] = useState<'latest' | 'bounty' | 'deadline' | 'hot'>('latest');

  // 详情弹窗状态
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);

  // 仅在任务大厅展示已通过审核的任务（'进行中'、'已验收'）
  const publicTasks = useMemo(() => {
    return tasks.filter(t => t.status === '进行中' || t.status === '已验收');
  }, [tasks]);

  // 统计数据
  const totalBountySum = useMemo(() => {
    return publicTasks.reduce((acc, t) => acc + (t.totalCashReward || t.cashReward || t.bounty || 0), 0);
  }, [publicTasks]);

  const activeTasksCount = useMemo(() => {
    return publicTasks.filter(t => t.status === '进行中').length;
  }, [publicTasks]);

  // 过滤与排序
  const filteredTasks = useMemo(() => {
    return publicTasks.filter(task => {
      // 搜索匹配
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchDesc = task.description.toLowerCase().includes(q);
        const matchPub = task.publisher.toLowerCase().includes(q);
        const matchDomain = task.domain.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchPub && !matchDomain) return false;
      }

      // 领域匹配
      if (selectedDomain !== '全部' && task.domain !== selectedDomain) {
        return false;
      }

      // 难度匹配
      if (selectedDifficulty !== '全部' && task.difficulty !== selectedDifficulty) {
        return false;
      }

      // 任务类别匹配
      if (selectedCategoryType !== '全部' && task.categoryType !== selectedCategoryType) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'bounty') {
        const bountyA = a.cashReward || a.bounty || 0;
        const bountyB = b.cashReward || b.bounty || 0;
        return bountyB - bountyA;
      }
      if (sortBy === 'deadline') {
        return (a.remainingDays || 14) - (b.remainingDays || 14);
      }
      if (sortBy === 'hot') {
        return (b.acceptedCount || 0) - (a.acceptedCount || 0);
      }
      // latest
      return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime();
    });
  }, [publicTasks, searchQuery, selectedDomain, selectedDifficulty, selectedCategoryType, sortBy]);

  const domains: (string)[] = ['全部', '技术开发', '内容创作', 'AI模型与数据', '工具与自动化', '咨询与培训'];
  const difficulties: (string)[] = ['全部', '简单', '中等', '困难'];
  const categoryTypes: (string)[] = ['全部', '单个任务', '批量任务'];

  return (
    <div className="space-y-7 animate-fade-in pb-12">
      {/* 顶部横幅：任务大厅看板与发布入口 */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-indigo-900/50">
        {/* 背景光晕装饰 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>智能任务协同 · 赏金全额托管 · 官方验收结算</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              AI 任务大厅
            </h1>
            <p className="text-sm text-slate-300 font-medium leading-relaxed">
              汇聚企业与开发者的技术开发、AI数据清洗、Prompt调优及自动化工具开发等全领域需求。资金由平台100%预付托管，多节点并发接单，按质验收结算。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            {/* 核心发布任务大按钮 */}
            <button
              onClick={() => setPublishTaskModalOpen(true)}
              className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-lg shadow-indigo-600/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>发布悬赏任务</span>
            </button>
          </div>
        </div>

        {/* 统计指标 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div>
            <div className="text-xs text-slate-400 font-medium">当前进行中任务</div>
            <div className="text-2xl font-black text-white font-mono mt-1 flex items-baseline gap-1">
              <span>{activeTasksCount}</span>
              <span className="text-xs text-slate-400 font-sans font-bold">个</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">累计托管赏金池</div>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1 flex items-baseline gap-1">
              <span>¥{totalBountySum.toLocaleString()}</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">平均交付周期</div>
            <div className="text-2xl font-black text-cyan-400 font-mono mt-1">
              4.8 <span className="text-xs text-slate-400 font-sans font-bold">天</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">开发者综合验收率</div>
            <div className="text-2xl font-black text-amber-400 font-mono mt-1">
              98.6%
            </div>
          </div>
        </div>
      </div>

      {/* 搜索与多维过滤栏 */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        {/* 搜索输入与排序 */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索任务标题、需求描述、发布机构或技术关键词..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-semibold outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> 排序:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs font-bold outline-none focus:bg-white focus:border-indigo-500"
            >
              <option value="latest">最新发布</option>
              <option value="bounty">赏金最高</option>
              <option value="deadline">即将截止</option>
              <option value="hot">接单热度</option>
            </select>
          </div>
        </div>

        {/* 领域筛选按钮组 */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-xs text-slate-400 font-bold mr-1">所属领域:</span>
          {domains.map(dom => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDomain === dom
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100/70 hover:bg-slate-200/60 text-slate-600'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        {/* 难度与类别标签 */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-bold mr-1">任务难度:</span>
            {difficulties.map(dif => (
              <button
                key={dif}
                onClick={() => setSelectedDifficulty(dif)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  selectedDifficulty === dif
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dif}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-bold mr-1">任务类别:</span>
            {categoryTypes.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryType(cat)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  selectedCategoryType === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 任务卡片网格列表 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
            共找到 <span className="text-indigo-600 font-mono font-bold">{filteredTasks.length}</span> 个符合条件的悬赏任务
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-slate-200">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">未找到匹配的悬赏任务</h3>
            <p className="text-xs text-slate-400 mt-1">您可以尝试清空搜索条件或调整所属领域筛选</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredTasks.map(task => {
              const isPublisher = task.publisher === user.name;
              const hasTaken = (task.takers || []).some(tk => tk.username === user.name || tk.username.includes('你'));

              return (
                <div
                  key={task.id}
                  onClick={() => setDetailTaskId(task.id)}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-indigo-400 hover:shadow-lg transition-all flex flex-col justify-between gap-5 group cursor-pointer"
                >
                  {/* 头部：标签 + 赏金 */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200/50">
                          {task.domain}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                            task.difficulty === '简单'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                              : task.difficulty === '中等'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200/50'
                              : 'bg-purple-50 text-purple-700 border border-purple-200/50'
                          }`}
                        >
                          {task.difficulty}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/50">
                          {task.categoryType} ({task.taskCount || 1}份)
                        </span>
                      </div>

                      {/* 赏金展示 */}
                      <div className="text-right shrink-0">
                        <div className="text-lg font-black font-mono text-indigo-600 leading-tight">
                          ¥{task.cashReward?.toLocaleString() ?? task.bounty?.toLocaleString()}
                        </div>
                        {task.pointsReward > 0 && (
                          <div className="text-[11px] font-bold text-amber-600">
                            +{task.pointsReward} 积分
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 标题与简要说明 */}
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {task.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 mt-1.5">
                        {task.brief || task.description}
                      </p>
                    </div>
                  </div>

                  {/* 底部信息：发布人、进度与操作 */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    {/* 批量任务时展示进度条 */}
                    {task.categoryType === '批量任务' && (
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold mb-1">
                          <span>接单进度: {task.acceptedCount || 0} / {task.taskCount || 1} 份</span>
                          <span className="text-indigo-600">已验收: {task.verifiedCount || 0} 份</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${Math.min(100, ((task.verifiedCount || 0) / (task.taskCount || 1)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs">
                      {/* 发布者信息 */}
                      <div className="flex items-center gap-2">
                        <img
                          src={task.publisherAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'}
                          alt={task.publisher}
                          className="w-6 h-6 rounded-full object-cover border border-slate-200"
                        />
                        <span className="font-bold text-slate-700">{task.publisher}</span>
                        <span className="text-slate-400">· 剩余 {task.remainingDays || 14} 天</span>
                      </div>

                      {/* 按钮 */}
                      <div className="flex items-center gap-2">
                        {hasTaken ? (
                          <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-xs flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> 已接单
                          </span>
                        ) : isPublisher ? (
                          <span className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs">
                            我发布的
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              takeTask(task.id);
                            }}
                            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-extrabold text-xs transition active:scale-95 cursor-pointer flex items-center gap-1"
                          >
                            <span>立即接单</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 任务详情弹窗 */}
      <TaskDetailModal
        taskId={detailTaskId}
        isOpen={!!detailTaskId}
        onClose={() => setDetailTaskId(null)}
      />
    </div>
  );
};
