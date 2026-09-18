import React, { useState, useEffect } from 'react';
import { TaskItem, TaskDomainType, TaskDifficultyLevel, TaskGlobalStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Edit3,
  Save,
  DollarSign,
  Coins,
  Calendar,
  Layers,
  FileText,
  CheckSquare,
  Users,
  AlertCircle
} from 'lucide-react';

interface AdminTaskEditModalProps {
  task: TaskItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const DOMAIN_OPTIONS: TaskDomainType[] = [
  '技术开发',
  '内容创作',
  'AI模型与数据',
  '工具与自动化',
  '咨询与培训'
];

const DIFFICULTY_OPTIONS: TaskDifficultyLevel[] = ['简单', '中等', '困难'];

const STATUS_OPTIONS: { value: TaskGlobalStatus; label: string; color: string }[] = [
  { value: '进行中', label: '进行中', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
  { value: '已发布', label: '已发布', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
  { value: '已结束', label: '已结束', color: 'text-slate-400 border-slate-700 bg-slate-800' },
  { value: '已验收', label: '已验收', color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
  { value: '审核中', label: '待审核', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  { value: '已驳回', label: '已驳回', color: 'text-red-400 border-red-500/30 bg-red-500/10' }
];

export const AdminTaskEditModal: React.FC<AdminTaskEditModalProps> = ({
  task,
  isOpen,
  onClose
}) => {
  const { adminUpdateTask } = useApp();

  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState<TaskDomainType>('技术开发');
  const [difficulty, setDifficulty] = useState<TaskDifficultyLevel>('中等');
  const [taskType, setTaskType] = useState('接单任务');
  const [status, setStatus] = useState<TaskGlobalStatus>('进行中');
  const [brief, setBrief] = useState('');
  const [cashReward, setCashReward] = useState<number>(0);
  const [pointsReward, setPointsReward] = useState<number>(0);
  const [endTime, setEndTime] = useState('');
  const [maxTakersLimit, setMaxTakersLimit] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDomain(task.domain || '技术开发');
      setDifficulty(task.difficulty || '中等');
      setTaskType(task.taskType || '接单任务');
      setStatus(task.status || '进行中');
      setBrief(task.brief || '');
      setCashReward(task.cashReward ?? task.totalCashReward ?? 0);
      setPointsReward(task.pointsReward ?? task.totalPointsReward ?? 0);
      setEndTime(task.endTime || task.deadline || '');
      setMaxTakersLimit(task.maxTakersLimit ?? 0);
      setDescription(task.description || '');
      setAcceptanceCriteria(task.acceptanceCriteria || '');
      setErrorMsg(null);
    }
  }, [task, isOpen]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('任务标题不能为空');
      return;
    }
    if (cashReward < 0 || pointsReward < 0) {
      setErrorMsg('赏金金额不能小于 0');
      return;
    }

    adminUpdateTask(task.id, {
      title: title.trim(),
      domain,
      difficulty,
      taskType,
      status,
      brief: brief.trim(),
      cashReward: Number(cashReward),
      pointsReward: Number(pointsReward),
      endTime: endTime.trim() || task.endTime,
      deadline: endTime.trim() || task.deadline,
      maxTakersLimit: Number(maxTakersLimit),
      description: description.trim(),
      acceptanceCriteria: acceptanceCriteria.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl my-8 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>编辑任务内容</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono border border-slate-700">
                  ID: {task.id}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                发布雇主: <span className="text-slate-200 font-semibold">{task.publisher}</span> · 发布时间: {task.publishTime}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 任务标题 */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              任务标题 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入明确具体的任务标题（建议30字以内）"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:border-indigo-500 focus:outline-none transition"
              required
            />
          </div>

          {/* 一句话简述 */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              一句话简述 / 副标题
            </label>
            <input
              type="text"
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="简要概括任务核心交付目标与亮点"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:border-indigo-500 focus:outline-none transition"
            />
          </div>

          {/* 3列网格: 领域、难度、类型 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 所属领域 */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>所属领域</span>
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value as TaskDomainType)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 focus:outline-none transition cursor-pointer"
              >
                {DOMAIN_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-slate-900 text-white">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* 难度等级 */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                难度级别
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as TaskDifficultyLevel)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 focus:outline-none transition cursor-pointer"
              >
                {DIFFICULTY_OPTIONS.map((diff) => (
                  <option key={diff} value={diff} className="bg-slate-900 text-white">
                    {diff}难度
                  </option>
                ))}
              </select>
            </div>

            {/* 运行状态 */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                运行状态
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskGlobalStatus)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-indigo-500 focus:outline-none transition cursor-pointer"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st.value} value={st.value} className="bg-slate-900 text-white">
                    {st.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3列网格: 现金奖励、积分奖励、截止时间 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 现金奖励 */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>现金赏金 (元)</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={cashReward}
                onChange={(e) => setCashReward(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-emerald-400 font-bold focus:border-emerald-500 focus:outline-none transition"
              />
            </div>

            {/* 积分奖励 */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>积分赏金 (个)</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={pointsReward}
                onChange={(e) => setPointsReward(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-amber-400 font-bold focus:border-amber-500 focus:outline-none transition"
              />
            </div>

            {/* 截止时间 */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>截止时间</span>
              </label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="2026-09-30 23:59:59"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:border-indigo-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* 任务类型与接单限制 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                任务形式
              </label>
              <div className="flex gap-2">
                {['接单任务', '标准任务', '比稿任务'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTaskType(t)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      taskType === t
                        ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>接单人数上限 (0 表示不限)</span>
              </label>
              <input
                type="number"
                min="0"
                value={maxTakersLimit}
                onChange={(e) => setMaxTakersLimit(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:border-indigo-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* 任务详情描述 */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>任务需求详细描述</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="详细列出任务背景、技术架构、实施要求与具体期望..."
              className="w-full p-3.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white leading-relaxed focus:border-indigo-500 focus:outline-none transition resize-y"
            />
          </div>

          {/* 验收与交付标准 */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>验收与交付标准</span>
            </label>
            <textarea
              rows={3}
              value={acceptanceCriteria}
              onChange={(e) => setAcceptanceCriteria(e.target.value)}
              placeholder="明确可量化的验收指标（如代码规范、测试用例覆盖率、部署包、文档等）..."
              className="w-full p-3.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white leading-relaxed focus:border-emerald-500 focus:outline-none transition resize-y"
            />
          </div>

          {/* 底部按钮栏 */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <Save className="w-4 h-4" />
              <span>保存修改</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
