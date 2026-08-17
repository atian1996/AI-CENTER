import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskItem, TaskTakerRecord, TaskSubmissionRecord } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Clock,
  Coins,
  ShieldCheck,
  Calendar,
  Layers,
  FileText,
  CheckCircle2,
  Users,
  Paperclip,
  Download,
  AlertCircle,
  Sparkles,
  Send,
  UserCheck,
  Check,
  ExternalLink,
  ChevronRight,
  Award,
  Wallet
} from 'lucide-react';
import { SubmitResultModal } from './SubmitResultModal';
import { TaskVerificationModal } from './TaskVerificationModal';

interface TaskDetailModalProps {
  taskId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenVerification?: (task: TaskItem) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ taskId, isOpen, onClose, onOpenVerification }) => {
  const { tasks, user, takeTask, withdrawTask, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'info' | 'bids' | 'submissions'>('info');
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  if (!isOpen || !taskId) return null;

  const task = tasks.find(t => t.id === taskId);
  if (!task) return null;

  const isPublisher = task.publisher === user.name;
  const myTakerRecord = (task.takers || []).find(tk => tk.username === user.name || tk.username.includes('你'));
  const hasTaken = !!myTakerRecord;
  const hasSubmitted = myTakerRecord?.status === '已提交' || myTakerRecord?.status === '已验收';
  const pendingVerifyCount = (task.submissions || []).filter(s => s.status === '待验收').length;

  const handleTake = () => {
    takeTask(task.id);
  };

  const handleWithdraw = () => {
    withdrawTask(task.id);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-10 my-auto text-slate-800"
        >
          {/* 顶部标题栏 */}
          <div className="px-7 py-5 border-b border-slate-100 bg-slate-50/80">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-100 text-indigo-700">
                    {task.domain}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                      task.difficulty === '简单'
                        ? 'bg-emerald-100 text-emerald-700'
                        : task.difficulty === '中等'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {task.difficulty}难度
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800">
                    {task.categoryType} ({task.taskCount || 1}份)
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                      task.status === '进行中'
                        ? 'bg-emerald-500 text-white'
                        : task.status === '审核中'
                        ? 'bg-amber-500 text-white'
                        : task.status === '已验收'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {task.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3个核心标签页切换 */}
            <div className="flex items-center gap-6 mt-5 border-b border-slate-200">
              {[
                { key: 'info', label: '任务说明' },
                { key: 'bids', label: `接单记录 (${(task.takers || []).length})` },
                { key: 'submissions', label: `交付验收 (${(task.submissions || []).length})` }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`pb-3 text-sm font-extrabold transition-all relative ${
                    activeTab === tab.key
                      ? 'text-indigo-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="taskTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 标签页内容区域 */}
          <div className="flex-1 overflow-y-auto p-7 space-y-6">
            {/* TAB 1: 任务说明 */}
            {activeTab === 'info' && (
              <div className="space-y-6">
                {/* 赏金与托管横幅 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-gradient-to-br from-indigo-50/60 to-purple-50/60 border border-indigo-100 rounded-2xl">
                  <div>
                    <div className="text-xs text-slate-500 font-bold mb-1">单份任务赏金</div>
                    <div className="text-xl font-black font-mono text-indigo-700 flex items-center gap-1.5">
                      <span>¥{task.cashReward?.toLocaleString() ?? task.bounty?.toLocaleString()}</span>
                      {task.pointsReward > 0 && (
                        <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full font-sans font-bold">
                          +{task.pointsReward} 积分
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500 font-bold mb-1">总预算 / 托管状态</div>
                    <div className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">平台全额托管锁定</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      总额: ¥{(task.totalCashReward || (task.cashReward * (task.taskCount || 1))).toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500 font-bold mb-1">招募进度</div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <span>已接单 {task.acceptedCount || 0} 人</span>
                      <span>·</span>
                      <span className="text-indigo-600">已验收 {task.verifiedCount || 0}/{task.taskCount || 1} 份</span>
                    </div>
                    {/* 进度条 */}
                    <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all"
                        style={{ width: `${Math.min(100, ((task.verifiedCount || 0) / (task.taskCount || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 发布人信息与周期 */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={task.publisherAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'}
                      alt={task.publisher}
                      className="w-10 h-10 rounded-full object-cover border border-slate-300"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span>{task.publisher}</span>
                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.2 rounded border border-indigo-200">
                          认证雇主
                        </span>
                      </div>
                      <div className="text-slate-400 mt-0.5">发布时间：{task.publishTime}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-slate-600 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>周期：{task.startTime?.split(' ')[0]} 至 {task.endTime?.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-700 font-bold">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>剩余：{task.remainingDays || 14} 天</span>
                    </div>
                  </div>
                </div>

                {/* 驳回原因提示 (若有) */}
                {task.status === '已驳回' && task.rejectReason && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 space-y-1">
                    <div className="font-black flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span>审核驳回原因说明：</span>
                    </div>
                    <p className="pl-5 leading-relaxed">{task.rejectReason}</p>
                  </div>
                )}

                {/* 任务描述 */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span>任务需求与具体背景</span>
                  </h4>
                  <div className="p-5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line shadow-2xs">
                    {task.description}
                  </div>
                </div>

                {/* 验收标准 */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>交付与验收标准</span>
                  </h4>
                  <div className="p-5 bg-emerald-50/30 border border-emerald-200 rounded-2xl text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                    {task.acceptanceCriteria}
                  </div>
                </div>

                {/* 任务附件 */}
                {task.attachments && task.attachments.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>任务附件与参考资料</span>
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {task.attachments.map(att => (
                        <div
                          key={att.name}
                          onClick={() => showToast(`已下载任务附件：${att.name}`)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer transition"
                        >
                          <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{att.name}</span>
                          <span className="text-slate-400 font-mono text-[11px]">({att.size})</span>
                          <Download className="w-3.5 h-3.5 text-slate-400 ml-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: 接单记录 */}
            {activeTab === 'bids' && (
              <div className="space-y-4">
                {(task.takers || []).length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-bold">暂无接单开发者</p>
                    <p className="text-xs mt-1">该任务正在大厅火热招募中，欢迎广大开发者接单！</p>
                  </div>
                ) : (
                  (task.takers || []).map(tk => (
                    <div
                      key={tk.id}
                      className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={tk.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                          alt={tk.username}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-extrabold text-slate-900">{tk.username}</div>
                          <div className="text-slate-400">接单时间：{tk.takeTime}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold ${
                            tk.status === '已验收'
                              ? 'bg-emerald-100 text-emerald-700'
                              : tk.status === '已提交'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {tk.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: 交付验收 */}
            {activeTab === 'submissions' && (
              <div className="space-y-4">
                {(task.submissions || []).length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-bold">暂无交付成果提交</p>
                    <p className="text-xs mt-1">接单开发者上传成果后将在此处统一展示</p>
                  </div>
                ) : (
                  (task.submissions || []).map(sub => (
                    <div
                      key={sub.id}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900">{sub.username}</span>
                          <span className="text-slate-400">于 {sub.submitTime} 提交交付</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold ${
                            sub.status === '已通过'
                              ? 'bg-emerald-100 text-emerald-700'
                              : sub.status === '待验收'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-700 font-medium leading-relaxed whitespace-pre-line">
                        {sub.notes}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* 底部操作工具栏 */}
          <div className="px-7 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              {isPublisher ? (
                <span className="text-indigo-600 font-bold">您是该任务的发布者</span>
              ) : hasTaken ? (
                <span className="text-emerald-600 font-bold">您已成功接单此任务</span>
              ) : (
                <span>欢迎有能力的开发者立即接单！</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs transition"
              >
                关闭
              </button>

              {/* 发布人操作 */}
              {isPublisher && task.status === '审核中' && (
                <button
                  onClick={handleWithdraw}
                  className="px-5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition"
                >
                  撤回任务并退款
                </button>
              )}

              {isPublisher && (task.submissions || []).length > 0 && (
                <button
                  onClick={() => setVerifyModalOpen(true)}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 relative"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>验收成果管理</span>
                  {pendingVerifyCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-ping absolute -top-0.5 -right-0.5" />
                  )}
                </button>
              )}

              {/* 接单人操作 */}
              {!isPublisher && task.status === '进行中' && !hasTaken && (
                <button
                  onClick={handleTake}
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>立即接单</span>
                </button>
              )}

              {!isPublisher && hasTaken && !hasSubmitted && (
                <button
                  onClick={() => setSubmitModalOpen(true)}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>提交交付成果</span>
                </button>
              )}
            </div>
          </div>

          {/* 子弹窗挂载 */}
          <SubmitResultModal
            task={task}
            isOpen={submitModalOpen}
            onClose={() => setSubmitModalOpen(false)}
          />

          <TaskVerificationModal
            task={task}
            isOpen={verifyModalOpen}
            onClose={() => setVerifyModalOpen(false)}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
