import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskItem, TaskSubmissionRecord } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Paperclip, 
  Download, 
  Clock, 
  User, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface TaskVerificationModalProps {
  task: TaskItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskVerificationModal: React.FC<TaskVerificationModalProps> = ({ task, isOpen, onClose }) => {
  const { verifyTaskSubmission, showToast } = useApp();

  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingSubId, setRejectingSubId] = useState<string | null>(null);

  if (!isOpen || !task) return null;

  const submissions = task.submissions || [];

  const handleApprove = (subId: string, username: string) => {
    verifyTaskSubmission(task.id, subId, true);
    showToast(`已通过对【${username}】的验收，赏金已结算！`);
  };

  const handleOpenReject = (subId: string) => {
    setRejectingSubId(subId);
    setRejectReason('');
  };

  const handleConfirmReject = (subId: string) => {
    if (!rejectReason.trim()) {
      showToast('请填写驳回原因，指导接单人修改');
      return;
    }
    verifyTaskSubmission(task.id, subId, false, rejectReason.trim());
    setRejectingSubId(null);
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
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-10 my-auto text-slate-800"
        >
          {/* 弹窗头部 */}
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">任务成果验收管理</h3>
                <p className="text-xs text-slate-500">
                  {task.title}（已验收 {task.verifiedCount || 0} / {task.taskCount || 1} 份）
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 提交成果列表 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {submissions.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-bold">暂无接单人提交交付成果</p>
                <p className="text-xs mt-1">接单开发者提交后将在此处展示待验收清单</p>
              </div>
            ) : (
              submissions.map((sub) => (
                <div
                  key={sub.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    sub.status === '待验收'
                      ? 'bg-amber-50/30 border-amber-200/80 shadow-xs'
                      : sub.status === '已通过'
                      ? 'bg-emerald-50/20 border-emerald-200'
                      : 'bg-red-50/20 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={sub.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                        alt={sub.username}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">{sub.username}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              sub.status === '待验收'
                                ? 'bg-amber-100 text-amber-700'
                                : sub.status === '已通过'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>提交时间：{sub.submitTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* 单份赏金展示 */}
                    <div className="text-right">
                      <div className="text-xs text-slate-400">单份结算赏金</div>
                      <div className="text-sm font-black font-mono text-indigo-600">
                        ¥{task.cashReward.toLocaleString()} + {task.pointsReward} 积分
                      </div>
                    </div>
                  </div>

                  {/* 成果说明 */}
                  <div className="mt-3.5 p-3.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
                    <div className="text-slate-400 font-bold mb-1">成果说明 / 交付报告：</div>
                    <p className="whitespace-pre-line">{sub.notes}</p>
                  </div>

                  {/* 交付文件 */}
                  {sub.files && sub.files.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <div className="text-xs font-bold text-slate-600">交付附件：</div>
                      <div className="flex flex-wrap gap-2">
                        {sub.files.map(f => (
                          <div
                            key={f.id}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer transition"
                            onClick={() => showToast(`已开始下载交付附件：${f.name}`)}
                          >
                            <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{f.name}</span>
                            <span className="text-slate-400 font-mono text-[10px]">({f.size})</span>
                            <Download className="w-3.5 h-3.5 text-slate-500 ml-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 驳回原因展示 */}
                  {sub.status === '已驳回' && sub.rejectReason && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                      <span className="font-bold">驳回原因：</span>{sub.rejectReason}
                    </div>
                  )}

                  {/* 驳回输入框抽屉 */}
                  {rejectingSubId === sub.id && (
                    <div className="mt-3.5 p-3.5 bg-red-50 border border-red-200 rounded-xl space-y-2.5">
                      <div className="text-xs font-black text-red-800 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span>填写驳回修改原因 (必填)</span>
                      </div>
                      <textarea
                        rows={2}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="说明未达验收标准的原因，例如缺少单元测试、指标未达到要求等..."
                        className="w-full p-2.5 bg-white border border-red-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-red-200"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setRejectingSubId(null)}
                          className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50"
                        >
                          取消
                        </button>
                        <button
                          onClick={() => handleConfirmReject(sub.id)}
                          className="px-3.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs"
                        >
                          确认驳回
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 操作按钮组 */}
                  {sub.status === '待验收' && rejectingSubId !== sub.id && (
                    <div className="mt-4 pt-3 border-t border-amber-200/40 flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleOpenReject(sub.id)}
                        className="px-4 py-1.5 rounded-xl border border-red-300 bg-white hover:bg-red-50 text-red-600 font-bold text-xs transition flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>驳回修改</span>
                      </button>
                      <button
                        onClick={() => handleApprove(sub.id, sub.username)}
                        className="px-5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>通过验收并结算赏金</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <span>托管赏金将根据每次验收通过即时分批结算给接单开发者</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 text-xs transition"
            >
              关闭
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
