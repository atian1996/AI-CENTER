import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskItem } from '../../types';
import {
  Plus,
  Search,
  Sparkles,
  Briefcase,
  ChevronRight,
  Zap,
  Palette,
  Clock,
  Layers,
  FileText,
  X,
  Filter,
  ArrowUpDown,
  Award,
  Activity
} from 'lucide-react';
import { TaskDetailModal } from './TaskDetailModal';

export const TasksView: React.FC = () => {
  const { tasks, setPublishTaskModalOpen, user } = useApp();

  // 搜索与过滤状态
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaskType, setSelectedTaskType] = useState<string>('全部'); // 全部 / 抢单任务 / 比稿任务
  const [selectedStatus, setSelectedStatus] = useState<string>('全部'); // 全部 / 进行中 / 已结束
  const [selectedDomain, setSelectedDomain] = useState<string>('全部'); // 全部 / 技术开发 / 内容创作 / AI模型与数据 / 工具与自动化 / 咨询与培训
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('全部'); // 全部 / 简单 / 中等 / 困难
  const [sortBy, setSortBy] = useState<'latest' | 'deadline' | 'reward'>('latest'); // 最新发布 / 即将截止 / 奖励最高

  // 详情弹窗状态
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);

  // 判断任务大状态 (进行中 VS 已结束)
  const isTaskFinished = (task: TaskItem) => {
    return (
      task.status === '已结束' ||
      task.status === '已验收' ||
      (task.remainingDays !== undefined && task.remainingDays <= 0) ||
      task.isAccepted === true ||
      !!task.winner ||
      (task.submissions || []).some(s => s.status === '已通过')
    );
  };

  // 任务大厅只展示审核通过并在架展示的任务
  const publicTasks = useMemo(() => {
    return tasks.filter(t => t.status === '进行中' || t.status === '已结束' || t.status === '已验收' || t.status === '已发布');
  }, [tasks]);

  // 大盘统计数据
  const stats = useMemo(() => {
    const total = publicTasks.length;
    const fcfsCount = publicTasks.filter(t => t.taskType === '抢单').length;
    const pitchCount = publicTasks.filter(t => t.taskType === '比稿').length;
    const finishedCount = publicTasks.filter(t => isTaskFinished(t)).length;
    const ongoingCount = total - finishedCount;
    return { total, fcfsCount, pitchCount, ongoingCount, finishedCount };
  }, [publicTasks]);

  // 过滤与排序
  const filteredTasks = useMemo(() => {
    return publicTasks.filter(task => {
      // 搜索匹配 (标题、描述、发布者模糊匹配)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchDesc = (task.brief || task.description || '').toLowerCase().includes(q);
        const matchPublisher = (task.publisher || '').toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchPublisher) return false;
      }

      // 任务状态筛选 (全部 / 进行中 / 已结束)
      const finished = isTaskFinished(task);
      if (selectedStatus === '进行中' && finished) return false;
      if (selectedStatus === '已结束' && !finished) return false;

      // 任务类型筛选 (全部 / 抢单任务 / 比稿任务)
      if (selectedTaskType !== '全部') {
        if (selectedTaskType === '抢单任务' && task.taskType !== '抢单') return false;
        if (selectedTaskType === '比稿任务' && task.taskType !== '比稿') return false;
      }

      // 所属领域筛选
      if (selectedDomain !== '全部' && task.domain !== selectedDomain) {
        return false;
      }

      // 任务难度筛选
      if (selectedDifficulty !== '全部' && task.difficulty !== selectedDifficulty) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'reward') {
        const rewardA = (a.cashReward || 0) + (a.pointsReward || 0);
        const rewardB = (b.cashReward || 0) + (b.pointsReward || 0);
        return rewardB - rewardA;
      }
      if (sortBy === 'deadline') {
        return (a.remainingDays || 14) - (b.remainingDays || 14);
      }
      // 最新发布
      return new Date(b.publishTime || b.startTime || Date.now()).getTime() - new Date(a.publishTime || a.startTime || Date.now()).getTime();
    });
  }, [publicTasks, searchQuery, selectedStatus, selectedTaskType, selectedDomain, selectedDifficulty, sortBy]);

  const statusesList = ['全部', '进行中', '已结束'];
  const taskTypesList = ['全部', '抢单任务', '比稿任务'];
  const domainsList = ['全部', '技术开发', '内容创作', 'AI模型与数据', '工具与自动化', '咨询与培训'];
  const difficultiesList = ['全部', '简单', '中等', '困难'];

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* 1. 统一顶部 Header 结构 (与其他菜单风格完全保持一致) */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-600/20 shrink-0 mt-0.5">
            <Briefcase className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">任务大厅</h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200/80 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>找AI人才 · 接AI需求</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-2xl">
              提供「⚡ 抢单速配」与「🎨 方案比稿」双重任务模式，实时连接开发者与优质产品需求。
            </p>
          </div>
        </div>

        <button
          onClick={() => setPublishTaskModalOpen(true)}
          className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>发布新需求任务</span>
        </button>
      </div>

      {/* 2. 搜索与五维多选择筛选栏 */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
        {/* 一整行搜索框 */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索任务标题、需求描述或发布者"
            className="w-full pl-11 pr-10 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 text-xs font-semibold outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 筛选控件区 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-100">
          {/* 筛选一：任务状态 */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <Activity className="w-3 h-3 text-slate-400" />
              <span>任务状态</span>
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-bold outline-none focus:bg-white focus:border-indigo-500 cursor-pointer"
            >
              {statusesList.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* 筛选二：任务模式 */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <Filter className="w-3 h-3 text-slate-400" />
              <span>任务类型</span>
            </label>
            <select
              value={selectedTaskType}
              onChange={(e) => setSelectedTaskType(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-bold outline-none focus:bg-white focus:border-indigo-500 cursor-pointer"
            >
              {taskTypesList.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* 筛选三：所属领域 */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <Layers className="w-3 h-3 text-slate-400" />
              <span>所属领域</span>
            </label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-bold outline-none focus:bg-white focus:border-indigo-500 cursor-pointer"
            >
              {domainsList.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* 筛选四：任务难度 */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <Award className="w-3 h-3 text-slate-400" />
              <span>难度等级</span>
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-bold outline-none focus:bg-white focus:border-indigo-500 cursor-pointer"
            >
              {difficultiesList.map(df => (
                <option key={df} value={df}>{df}</option>
              ))}
            </select>
          </div>

          {/* 筛选五：排序 */}
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-slate-400" />
              <span>排序规则</span>
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-bold outline-none focus:bg-white focus:border-indigo-500 cursor-pointer"
            >
              <option value="latest">最新发布 (优先)</option>
              <option value="deadline">即将截止 (优先)</option>
              <option value="reward">奖励金额 (由高到低)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. 统计总结黑金信息条 */}
      <div className="bg-slate-900 rounded-2xl px-6 py-3.5 text-white flex flex-wrap items-center justify-between gap-4 text-xs shadow-xs">
        <div className="flex flex-wrap items-center gap-6 font-bold">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">大厅需求总数</span>
            <span className="text-white font-mono font-black text-sm">{stats.total} 项</span>
          </div>
          <div className="h-3 w-px bg-slate-700 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">进行中</span>
            <span className="text-emerald-300 font-mono font-black text-sm">{stats.ongoingCount} 项</span>
          </div>
          <div className="h-3 w-px bg-slate-700 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-slate-400">已结束</span>
            <span className="text-slate-300 font-mono font-black text-sm">{stats.finishedCount} 项</span>
          </div>
        </div>

        {(selectedStatus !== '全部' || selectedTaskType !== '全部' || selectedDomain !== '全部' || selectedDifficulty !== '全部' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedStatus('全部');
              setSelectedTaskType('全部');
              setSelectedDomain('全部');
              setSelectedDifficulty('全部');
              setSearchQuery('');
              setSortBy('latest');
            }}
            className="text-[11px] text-indigo-300 hover:text-white font-bold transition cursor-pointer underline"
          >
            重置全部筛选条件
          </button>
        )}
      </div>

      {/* 4. 高质感 1920*1080 适配 Bento/Grid 卡片布局 */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-slate-200 space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">暂无符合条件的任务需求</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            您可以尝试调整筛选规则或搜索词，亦可发布您的专属定制需求
          </p>
          <button
            onClick={() => setPublishTaskModalOpen(true)}
            className="mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition cursor-pointer"
          >
            发布新任务需求
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.map(task => {
            const isFcfs = task.taskType === '抢单';
            const acceptedNum = (task.takers || []).length || task.acceptedCount || 0;
            const finished = isTaskFinished(task);

            return (
              <div
                key={task.id}
                onClick={() => setDetailTaskId(task.id)}
                className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between gap-4 group cursor-pointer ${
                  finished
                    ? 'border-slate-200 bg-slate-50/50 opacity-80 hover:border-slate-300'
                    : 'border-slate-200/90 hover:border-indigo-500/80 hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                {/* 顶栏：标题 + 类型 Crystal Badge + 状态 Badge */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {task.title}
                    </h3>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isFcfs ? (
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-amber-50 text-amber-800 border border-amber-200/80 shrink-0">
                          ⚡ 抢单
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-indigo-50 text-indigo-800 border border-indigo-200/80 shrink-0">
                          🎨 比稿
                        </span>
                      )}

                      {/* 显式展示【进行中】与【已结束】状态，已删除资金托管标签 */}
                      {finished ? (
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-slate-200 text-slate-600 border border-slate-300/80">
                          已结束
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-emerald-500 text-white shadow-2xs">
                          进行中
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 属性微型胶囊 */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50/70 text-indigo-700 border border-indigo-100">
                      {task.domain}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
                        task.difficulty === '简单'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : task.difficulty === '中等'
                          ? 'bg-blue-50 text-blue-700 border-blue-100'
                          : 'bg-purple-50 text-purple-700 border-purple-100'
                      }`}
                    >
                      {task.difficulty}难度
                    </span>
                    <span className="text-slate-400 text-[11px] ml-auto">
                      {finished ? '到期或已完成验收' : `剩余 ${task.remainingDays || 14} 天`}
                    </span>
                  </div>

                  {/* 需求概览简述 */}
                  <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2 min-h-[36px]">
                    {task.brief || task.description.replace(/<[^>]+>/g, '').substring(0, 80)}
                  </p>
                </div>

                {/* 赏金与结算信息深色小卡 (已删除“资金托管”标签) */}
                <div className="p-3.5 bg-slate-50/90 border border-slate-100 rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] text-slate-400 font-medium">赏金预算</div>
                    <div className="text-lg font-black font-mono text-indigo-600 leading-tight">
                      ¥{(task.cashReward || 0).toLocaleString()}
                      {(task.pointsReward || 0) > 0 && (
                        <span className="text-xs font-bold text-amber-600 ml-1.5 font-sans">
                          +{task.pointsReward}积分
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] text-slate-400 font-medium">截止时间</div>
                    <div className="text-xs font-bold text-slate-700 mt-0.5 font-mono">
                      {task.endTime || task.deadline || '2026-12-31'}
                    </div>
                  </div>
                </div>

                {/* 卡片底栏 */}
                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100/80">
                  <div className="flex items-center gap-2">
                    <img
                      src={task.publisherAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                      alt={task.publisher}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                    <span className="font-bold text-slate-800 truncate max-w-[100px]">{task.publisher}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {acceptedNum} 人接单
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailTaskId(task.id);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-extrabold text-xs transition cursor-pointer flex items-center gap-1 shrink-0 shadow-2xs"
                    >
                      <span>详情</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. 底部发布招募引导 Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-7 text-white border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h4 className="text-base font-black">有专属的 AI / SaaS 开发需求要外包发布？</h4>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
              极速撮合
            </span>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            数十万顶尖极客开发者在线竞标，资金全程托管保护，按质验收保障无风险。
          </p>
        </div>

        <button
          onClick={() => setPublishTaskModalOpen(true)}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-600/30 transition active:scale-95 cursor-pointer shrink-0"
        >
          立即免费发布任务
        </button>
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
