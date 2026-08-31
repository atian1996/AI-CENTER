import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  AlertCircle,
  Award,
  Check,
  CheckSquare
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

  const submissions = task?.submissions || [];
  const isFinished = task?.status === '已结束' || task?.status === '已验收';

  // 当弹窗打开时，默认选中第一份待验收的成果
  useEffect(() => {
    if (isOpen && submissions.length > 0) {
      const pendingSub = submissions.find(s => s.status === '待验收') || submissions[0];
      setSelectedSubId(pendingSub.id);
    } else {
      setSelectedSubId(null);
    }
    setRejectingSubId(null);
    setRejectReason('');
  }, [isOpen, task?.id]);

  if (!isOpen || !task) return null;

  const handleConfirmVerification = () => {
    if (!selectedSubId) {
      showToast('请先在成果列表中选择一位接单人的交付成果');
      return;
    }
    const chosenSub = submissions.find(s => s.id === selectedSubId);
    if (!chosenSub) return;

    verifyTaskSubmission(task.id, selectedSubId, true);
    showToast(`确认验收成功！已将【${chosenSub.username}】选为唯一获胜成果，赏金全额结算发放，任务正式结束。`);
    onClose();
  };

  const handleOpenReject = (subId: string) => {
    setRejectingSubId(subId);
    setRejectReason('');
  };

  const handleConfirmReject = (subId: string) => {
    if (!rejectReason.trim()) {
      showToast('请填写驳回原因，指导接单开发者修改');
      return;
    }
    verifyTaskSubmission(task.id, subId, false, rejectReason.trim());
    setRejectingSubId(null);
  };

  const chosenSubObj = submissions.find(s => s.id === selectedSubId);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
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
          className="relative w-full max-w-3xl max-h-[88vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-10 my-auto text-slate-800"
        >
          {/* 弹窗头部 */}
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">任务成果验收管理</h3>
                <p className="text-xs text-slate-500">
                  {task.title}（收件箱共 {submissions.length} 份成果）
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 内容区 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* 规则说明 */}
            {!isFinished && (
              <div className="p-3.5 bg-indigo-50/80 border border-indigo-200/80 rounded-xl text-xs text-indigo-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed font-medium">
                  <p className="font-extrabold">验收规则提示：</p>
                  <p>发布者只能选择一位开发者的成果作为验收通过项。选择完毕后，点击底部<span className="font-black text-indigo-700">“确认验收”</span>按钮完成结算，任务将正式结束。</p>
                </div>
              </div>
            )}

            {/* 结束提示 */}
            {isFinished && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>该任务已由发布者验收通过（获胜开发者：<span className="font-extrabold">{task.winner?.username || '已确定开发者'}</span>），全额赏金已结算发放，任务已正式结束。</span>
              </div>
            )}

            {submissions.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-bold">暂无接单人提交交付成果</p>
                <p className="text-xs mt-1">接单开发者上传成果后将在此处统一展示供您验收</p>
              </div>
            ) : (
              submissions.map((sub) => {
                const isSelected = selectedSubId === sub.id;

                return (
                  <div
                    key={sub.id}
                    onClick={() => {
                      if (!isFinished && sub.status !== '已驳回') {
                        setSelectedSubId(sub.id);
                      }
                    }}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                      isFinished
                        ? sub.status === '已通过'
                          ? 'bg-emerald-50/40 border-emerald-300 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 opacity-60'
                        : isSelected
                        ? 'bg-indigo-50/30 border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                        : sub.status === '已驳回'
                        ? 'bg-red-50/20 border-red-200 opacity-70'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* 选中高亮边角标记 */}
                    {!isFinished && isSelected && (
                      <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[11px] font-black px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-xs">
                        <Check className="w-3.5 h-3.5" />
                        <span>已选为通过目标</span>
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {/* 勾选框 */}
                        {!isFinished && (
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                            isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        )}

                        <img
                          src={sub.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                          alt={sub.username}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-900">{sub.username}</span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                sub.status === '已通过'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : sub.status === '已驳回'
                                  ? 'bg-red-100 text-red-700'
                                  : isSelected
                                  ? 'bg-indigo-100 text-indigo-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {sub.status === '已通过' ? '🏆 验收通过 (获胜者)' : sub.status === '已驳回' ? '已驳回修改' : isSelected ? '待点击“确认验收”' : sub.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>提交时间：{sub.submitTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* 赏金说明 */}
                      <div className="text-right">
                        <div className="text-xs text-slate-400">应结算赏金</div>
                        <div className="text-sm font-black font-mono text-indigo-600">
                          ¥{(task.cashReward ?? task.bounty ?? 0).toLocaleString()} {(task.pointsReward || 0) > 0 ? `+ ${task.pointsReward} 积分` : ''}
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
                          {sub.files.map((f: any) => (
                            <div
                              key={f.id || f.name}
                              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer transition"
                              onClick={(e) => {
                                e.stopPropagation();
                                showToast(`已开始下载交付附件：${f.name}`);
                              }}
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

                    {/* 驳回原因 */}
                    {sub.status === '已驳回' && sub.rejectReason && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                        <span className="font-bold">驳回原因：</span>{sub.rejectReason}
                      </div>
                    )}

                    {/* 驳回修改展开抽屉 */}
                    {rejectingSubId === sub.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="mt-3.5 p-3.5 bg-red-50 border border-red-200 rounded-xl space-y-2.5"
                      >
                        <div className="text-xs font-black text-red-800 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <span>填写驳回修改要求 (必填)</span>
                        </div>
                        <textarea
                          rows={2}
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="说明未达标准的原因，指导接单开发者补充完善..."
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

                    {/* 单项驳回操作 */}
                    {!isFinished && sub.status === '待验收' && rejectingSubId !== sub.id && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">
                          {isSelected ? '已选中此项为合格成果' : '点击此卡片可选中作为验收通过项'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenReject(sub.id);
                          }}
                          className="px-3 py-1 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-600 font-bold text-[11px] transition flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>驳回修改</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* 弹窗底部操作区 */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {!isFinished && submissions.length > 0 ? (
              <>
                <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-indigo-600" />
                  <span>
                    {chosenSubObj ? (
                      <>拟验收通过：<span className="font-extrabold text-indigo-600">{chosenSubObj.username}</span> 的成果</>
                    ) : (
                      '请在上方勾选一份交付成果'
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 font-bold text-slate-700 text-xs transition"
                  >
                    暂不验收
                  </button>
                  <button
                    onClick={handleConfirmVerification}
                    disabled={!selectedSubId}
                    className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>确认验收</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full flex items-center justify-between">
                <span className="text-xs text-slate-400">验收完成或无待验收提交项</span>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 text-xs transition"
                >
                  关闭窗口
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
