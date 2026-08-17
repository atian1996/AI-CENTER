import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskItem, TaskStatus } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Paperclip,
  Upload,
  Plus,
  ShieldCheck,
  Download,
  Check,
  X,
  Sparkles,
  RefreshCw,
  Eye,
  Send,
  UserCheck,
  Wallet,
  Users,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { TaskDetailModal } from '../tasks/TaskDetailModal';
import { TaskVerificationModal } from '../tasks/TaskVerificationModal';
import { SubmitResultModal } from '../tasks/SubmitResultModal';

export const WorkspaceTasks: React.FC = () => {
  const { tasks, user, setPublishTaskModalOpen, withdrawTask, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'published' | 'undertaken'>('published');
  
  // 子状态过滤
  const [publishedStatusFilter, setPublishedStatusFilter] = useState<string>('全部');
  const [undertakenStatusFilter, setUndertakenStatusFilter] = useState<string>('全部');

  // 弹窗状态
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const [verifyTask, setVerifyTask] = useState<TaskItem | null>(null);
  const [submitTask, setSubmitTask] = useState<TaskItem | null>(null);

  // 我发布的任务列表 (发布者为当前用户)
  const myPublishedTasks = useMemo(() => {
    return tasks.filter(t => t.publisher === user.name);
  }, [tasks, user.name]);

  // 我承接的任务列表 (takers 包含当前用户)
  const myUndertakenTasks = useMemo(() => {
    return tasks.filter(t => (t.takers || []).some(tk => tk.username === user.name || tk.username.includes('你')));
  }, [tasks, user.name]);

  // 过滤后的发布任务
  const filteredPublishedTasks = useMemo(() => {
    if (publishedStatusFilter === '全部') return myPublishedTasks;
    if (publishedStatusFilter === '待验收') {
      return myPublishedTasks.filter(t => (t.submissions || []).some(s => s.status === '待验收'));
    }
    return myPublishedTasks.filter(t => t.status === publishedStatusFilter);
  }, [myPublishedTasks, publishedStatusFilter]);

  // 过滤后的接单任务
  const filteredUndertakenTasks = useMemo(() => {
    if (undertakenStatusFilter === '全部') return myUndertakenTasks;
    return myUndertakenTasks.filter(t => {
      const myTk = (t.takers || []).find(tk => tk.username === user.name || tk.username.includes('你'));
      if (!myTk) return false;
      if (undertakenStatusFilter === '进行中') return myTk.status === '已接单';
      if (undertakenStatusFilter === '待验收') return myTk.status === '已提交';
      if (undertakenStatusFilter === '已验收') return myTk.status === '已验收';
      if (undertakenStatusFilter === '已驳回') return myTk.status === '已驳回';
      return true;
    });
  }, [myUndertakenTasks, undertakenStatusFilter, user.name]);

  const publishedFilters = ['全部', '审核中', '进行中', '待验收', '已验收', '已驳回'];
  const undertakenFilters = ['全部', '进行中', '待验收', '已验收', '已驳回'];

  return (
    <div className="space-y-6">
      {/* 顶部主切换栏与操作 */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('published')}
            className={`px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all ${
              activeTab === 'published'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            我发布的任务 ({myPublishedTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('undertaken')}
            className={`px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all ${
              activeTab === 'undertaken'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            我接单的任务 ({myUndertakenTasks.length})
          </button>
        </div>

        <button
          onClick={() => setPublishTaskModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-extrabold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>发布新任务</span>
        </button>
      </div>

      {/* TAB 1: 我发布的任务 */}
      {activeTab === 'published' && (
        <div className="space-y-4">
          {/* 子状态筛选标签 */}
          <div className="flex flex-wrap items-center gap-2 px-1">
            <span className="text-xs text-slate-400 font-bold mr-1">状态筛选:</span>
            {publishedFilters.map(f => (
              <button
                key={f}
                onClick={() => setPublishedStatusFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  publishedStatusFilter === f
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {filteredPublishedTasks.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border border-slate-200">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">暂无此状态下发布的任务</p>
              <button
                onClick={() => setPublishTaskModalOpen(true)}
                className="mt-4 px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
              >
                立即发布任务
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredPublishedTasks.map(task => {
                const pendingCount = (task.submissions || []).filter(s => s.status === '待验收').length;

                return (
                  <div
                    key={task.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 shadow-2xs space-y-4 transition"
                  >
                    {/* 头部状态与赏金 */}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-50 text-indigo-700">
                            {task.domain}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                            {task.categoryType} ({task.taskCount || 1}份)
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                              task.status === '进行中'
                                ? 'bg-emerald-100 text-emerald-700'
                                : task.status === '审核中'
                                ? 'bg-amber-100 text-amber-700'
                                : task.status === '已验收'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {task.status}
                          </span>
                          {pendingCount > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-500 text-white animate-pulse">
                              {pendingCount} 份待验收
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900">{task.title}</h3>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-black font-mono text-indigo-600">
                          ¥{(task.totalCashReward || (task.cashReward * (task.taskCount || 1))).toLocaleString()}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {task.pointsReward > 0 && `+${task.totalPointsReward || task.pointsReward} 积分 · `}托管锁定
                        </div>
                      </div>
                    </div>

                    {/* 驳回原因提示 (若被驳回) */}
                    {task.status === '已驳回' && task.rejectReason && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                        <span className="font-bold">审核驳回原因：</span>{task.rejectReason}
                      </div>
                    )}

                    {/* 进度与操作工具栏 */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-4 text-slate-500 font-medium">
                        <span>接单进度: {task.acceptedCount || 0} / {task.taskCount || 1}</span>
                        <span>已验收: {task.verifiedCount || 0} 份</span>
                        <span>发布时间: {task.publishTime}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {task.status === '审核中' && (
                          <button
                            onClick={() => withdrawTask(task.id)}
                            className="px-3.5 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold transition"
                          >
                            撤回任务
                          </button>
                        )}

                        {(task.submissions || []).length > 0 && (
                          <button
                            onClick={() => setVerifyTask(task)}
                            className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold shadow-2xs transition flex items-center gap-1"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>验收成果 ({task.submissions?.length})</span>
                          </button>
                        )}

                        <button
                          onClick={() => setDetailTaskId(task.id)}
                          className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold transition"
                        >
                          查看详情
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: 我接单的任务 */}
      {activeTab === 'undertaken' && (
        <div className="space-y-4">
          {/* 子状态筛选标签 */}
          <div className="flex flex-wrap items-center gap-2 px-1">
            <span className="text-xs text-slate-400 font-bold mr-1">接单状态:</span>
            {undertakenFilters.map(f => (
              <button
                key={f}
                onClick={() => setUndertakenStatusFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  undertakenStatusFilter === f
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {filteredUndertakenTasks.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border border-slate-200">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">暂无此状态下的接单记录</p>
              <p className="text-xs text-slate-400 mt-1">前往任务大厅寻找适合您的开发需求立即接单赚钱</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredUndertakenTasks.map(task => {
                const myRecord = (task.takers || []).find(tk => tk.username === user.name || tk.username.includes('你'));
                const myStatus = myRecord?.status || '已接单';
                const hasSubmitted = myStatus === '已提交' || myStatus === '已验收';

                return (
                  <div
                    key={task.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 shadow-2xs space-y-4 transition"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-50 text-indigo-700">
                            {task.domain}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                              myStatus === '已验收'
                                ? 'bg-emerald-100 text-emerald-700'
                                : myStatus === '已提交'
                                ? 'bg-amber-100 text-amber-700'
                                : myStatus === '已驳回'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            我的状态: {myStatus}
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900">{task.title}</h3>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-black font-mono text-emerald-600">
                          +¥{task.cashReward.toLocaleString()}
                        </div>
                        {task.pointsReward > 0 && (
                          <div className="text-[11px] font-bold text-amber-600">
                            +{task.pointsReward} 积分
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 雇主信息与操作 */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3 text-slate-500">
                        <span>雇主: {task.publisher}</span>
                        <span>· 接单时间: {myRecord?.takeTime || '近期'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {!hasSubmitted && (
                          <button
                            onClick={() => setSubmitTask(task)}
                            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-2xs transition flex items-center gap-1"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>提交交付成果</span>
                          </button>
                        )}

                        {myStatus === '已驳回' && (
                          <button
                            onClick={() => setSubmitTask(task)}
                            className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold shadow-2xs transition flex items-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>重新提交</span>
                          </button>
                        )}

                        <button
                          onClick={() => setDetailTaskId(task.id)}
                          className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold transition"
                        >
                          查看详情
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 弹窗挂载 */}
      <TaskDetailModal
        taskId={detailTaskId}
        isOpen={!!detailTaskId}
        onClose={() => setDetailTaskId(null)}
      />

      <TaskVerificationModal
        task={verifyTask}
        isOpen={!!verifyTask}
        onClose={() => setVerifyTask(null)}
      />

      <SubmitResultModal
        task={submitTask}
        isOpen={!!submitTask}
        onClose={() => setSubmitTask(null)}
      />
    </div>
  );
};
