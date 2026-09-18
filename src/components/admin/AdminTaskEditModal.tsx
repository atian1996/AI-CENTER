import React, { useState, useEffect } from 'react';
import { TaskItem, TaskDomainType, TaskDifficultyLevel, TaskGlobalStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Edit3,
  Save,
  Calendar,
  Layers,
  FileText,
  CheckSquare,
  Users,
  AlertCircle,
  Bold,
  Italic,
  Link,
  Sparkles,
  Cpu,
  Eye,
  ShieldCheck,
  Check,
  Boxes,
  Database,
  Wrench,
  Server,
  Coins,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface AdminTaskEditModalProps {
  task: TaskItem | null;
  isOpen: boolean;
  onClose: () => void;
  readOnly?: boolean;
}

const DOMAIN_OPTIONS: { value: TaskDomainType; label: string }[] = [
  { value: '技术开发', label: '技术开发 (前端/后端/系统)' },
  { value: 'AI模型与数据', label: 'AI模型与数据 (算法/微调/标注)' },
  { value: '工具与自动化', label: '工具与自动化 (脚本/工作流/插件)' },
  { value: '内容创作', label: '内容创作 (设计/Prompt/文案)' },
  { value: '咨询与培训', label: '咨询与培训 (方案/辅导/架构)' }
];

const DIFFICULTY_OPTIONS: TaskDifficultyLevel[] = ['简单', '中等', '困难'];

const STATUS_OPTIONS: { value: TaskGlobalStatus; label: string; color: string }[] = [
  { value: '进行中', label: '进行中', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
  { value: '审核中', label: '审核中', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  { value: '已驳回', label: '已驳回', color: 'text-red-400 border-red-500/30 bg-red-500/10' },
  { value: '已结束', label: '已结束', color: 'text-slate-400 border-slate-700 bg-slate-800' },
  { value: '已验收', label: '已验收', color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
  { value: '已发布', label: '已发布', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' }
];

const ENV_SPEC_OPTIONS = [
  '2核CPU / 8GB 内存',
  '4核CPU / 16GB 内存',
  '8核CPU / 32GB 内存',
  'NVIDIA T4 / 16GB VRAM',
  'NVIDIA V100 / 32GB VRAM',
  'NVIDIA RTX4090 / 24GB VRAM',
  'NVIDIA A100 / 40GB VRAM'
];

const ENV_IMAGE_OPTIONS = [
  'Ubuntu 22.04 LTS (PyTorch 2.0)',
  'Ubuntu 22.04 LTS (TensorFlow 2.13)',
  'Ubuntu 20.04 LTS (CUDA 11.8)',
  'DeepLearning Base Python 3.10'
];

export const AdminTaskEditModal: React.FC<AdminTaskEditModalProps> = ({
  task,
  isOpen,
  onClose,
  readOnly = false
}) => {
  const { adminUpdateTask, showToast, agents, models, datasets, skills } = useApp();

  // 1. 任务基础信息
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState<TaskDomainType>('技术开发');
  const [difficulty, setDifficulty] = useState<TaskDifficultyLevel>('简单');
  const [description, setDescription] = useState('');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');

  // 2. 悬赏奖励与交付截止周期
  const [cashReward, setCashReward] = useState<number>(2000);
  const [pointsReward, setPointsReward] = useState<number>(200);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');

  // 3. 推荐平台资源（可选）
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
  const [pendingAgentId, setPendingAgentId] = useState<string>('');

  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([]);
  const [pendingModelId, setPendingModelId] = useState<string>('');

  const [selectedDatasetIds, setSelectedDatasetIds] = useState<string[]>([]);
  const [pendingDatasetId, setPendingDatasetId] = useState<string>('');

  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [pendingSkillId, setPendingSkillId] = useState<string>('');

  const [selectedEnvSpec, setSelectedEnvSpec] = useState<string>('NVIDIA RTX4090 / 24GB VRAM');
  const [selectedEnvImage, setSelectedEnvImage] = useState<string>('Ubuntu 22.04 LTS (PyTorch 2.0)');

  // 4. 管理状态与驳回说明
  const [status, setStatus] = useState<TaskGlobalStatus>('进行中');
  const [rejectReason, setRejectReason] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDomain(task.domain || '技术开发');
      setDifficulty(task.difficulty || '简单');
      setDescription(task.description || '');
      setAcceptanceCriteria(task.acceptanceCriteria || '');
      
      setCashReward(task.cashReward ?? task.totalCashReward ?? 0);
      setPointsReward(task.pointsReward ?? task.totalPointsReward ?? 0);
      setStartTime(task.startTime || task.publishTime || '');
      setEndTime(task.endTime || task.deadline || '');

      if (task.recommendedResources) {
        setSelectedAgentIds(task.recommendedResources.agents || []);
        setSelectedModelIds(task.recommendedResources.models || []);
        setSelectedDatasetIds(task.recommendedResources.datasets || []);
        setSelectedSkillIds(task.recommendedResources.skills || []);
        if (task.recommendedResources.environment) {
          setSelectedEnvSpec(task.recommendedResources.environment.spec || 'NVIDIA RTX4090 / 24GB VRAM');
          setSelectedEnvImage(task.recommendedResources.environment.image || 'Ubuntu 22.04 LTS (PyTorch 2.0)');
        }
      } else {
        setSelectedAgentIds([]);
        setSelectedModelIds([]);
        setSelectedDatasetIds([]);
        setSelectedSkillIds([]);
        setSelectedEnvSpec('NVIDIA RTX4090 / 24GB VRAM');
        setSelectedEnvImage('Ubuntu 22.04 LTS (PyTorch 2.0)');
      }

      setStatus(task.status || '进行中');
      setRejectReason(task.rejectReason || '');
      setErrorMsg(null);
    }
  }, [task, isOpen]);

  if (!isOpen || !task) return null;

  // 添加推荐资源处理
  const handleAddAgent = () => {
    if (readOnly || !pendingAgentId) return;
    if (selectedAgentIds.length >= 3) {
      showToast('Agent推荐最多允许选择1-3个');
      return;
    }
    if (selectedAgentIds.includes(pendingAgentId)) {
      showToast('该Agent已在推荐列表中');
      return;
    }
    setSelectedAgentIds([...selectedAgentIds, pendingAgentId]);
    setPendingAgentId('');
  };

  const handleAddModel = () => {
    if (readOnly || !pendingModelId) return;
    if (selectedModelIds.length >= 3) {
      showToast('模型推荐最多允许选择1-3个');
      return;
    }
    if (selectedModelIds.includes(pendingModelId)) {
      showToast('该模型已在推荐列表中');
      return;
    }
    setSelectedModelIds([...selectedModelIds, pendingModelId]);
    setPendingModelId('');
  };

  const handleAddDataset = () => {
    if (readOnly || !pendingDatasetId) return;
    if (selectedDatasetIds.length >= 3) {
      showToast('数据集推荐最多允许选择1-3个');
      return;
    }
    if (selectedDatasetIds.includes(pendingDatasetId)) {
      showToast('该数据集已在推荐列表中');
      return;
    }
    setSelectedDatasetIds([...selectedDatasetIds, pendingDatasetId]);
    setPendingDatasetId('');
  };

  const handleAddSkill = () => {
    if (readOnly || !pendingSkillId) return;
    if (selectedSkillIds.length >= 3) {
      showToast('Skill推荐最多允许选择1-3个');
      return;
    }
    if (selectedSkillIds.includes(pendingSkillId)) {
      showToast('该Skill已在推荐列表中');
      return;
    }
    setSelectedSkillIds([...selectedSkillIds, pendingSkillId]);
    setPendingSkillId('');
  };

  // 快捷格式化
  const insertFormatting = (target: 'desc' | 'criteria', prefix: string, suffix: string = '') => {
    if (readOnly) return;
    if (target === 'desc') {
      setDescription(prev => `${prev}\n${prefix}示范内容${suffix}`);
    } else {
      setAcceptanceCriteria(prev => `${prev}\n${prefix}验收规则${suffix}`);
    }
  };

  // 提交修改
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) {
      onClose();
      return;
    }

    if (!title.trim()) {
      setErrorMsg('任务标题不能为空');
      return;
    }
    if (title.length > 30) {
      setErrorMsg('任务标题最多不能超过30字');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('任务描述内容不能为空');
      return;
    }
    if (!acceptanceCriteria.trim()) {
      setErrorMsg('成果验收标准不能为空');
      return;
    }
    if (cashReward < 0 || pointsReward < 0) {
      setErrorMsg('赏金金额不能小于 0');
      return;
    }
    if (cashReward <= 0 && pointsReward <= 0) {
      setErrorMsg('现金和积分至少有一项必须大于0');
      return;
    }

    const recResources = {
      agents: selectedAgentIds,
      models: selectedModelIds,
      datasets: selectedDatasetIds,
      skills: selectedSkillIds,
      environment: {
        spec: selectedEnvSpec,
        image: selectedEnvImage
      }
    };

    adminUpdateTask(task.id, {
      title: title.trim(),
      domain,
      difficulty,
      description: description.trim(),
      acceptanceCriteria: acceptanceCriteria.trim(),
      cashReward: Number(cashReward),
      pointsReward: Number(pointsReward),
      totalCashReward: Number(cashReward),
      totalPointsReward: Number(pointsReward),
      startTime: startTime.trim() || task.startTime,
      endTime: endTime.trim() || task.endTime,
      deadline: endTime.trim() || task.deadline,
      recommendedResources: recResources,
      status,
      rejectReason: status === '已驳回' ? rejectReason.trim() : undefined
    });

    showToast(`任务【${title.trim()}】已成功保存修改`);
    onClose();
  };

  const takersList = task.takers || [];
  const submissionsList = task.submissions || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl my-6 bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header 顶部标题栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl border ${
              readOnly 
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' 
                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
            }`}>
              {readOnly ? <Eye className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">
                  {readOnly ? '任务需求详情查看' : '编辑任务需求规范'}
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono border border-slate-700">
                  ID: {task.id}
                </span>
                {readOnly && (
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                    只读监控模式
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                发布雇主: <span className="text-slate-200 font-semibold">{task.publisher}</span> · 发布时间: <span className="font-mono text-slate-300">{task.publishTime || '近期'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="关闭窗口"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 表单内容区 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-200">
          
          {errorMsg && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* 第一个区域：1. 任务基础信息 */}
          {/* ============================================================== */}
          <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <h3 className="text-sm font-black text-white">1. 任务基础信息</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">与前台发布完全一致</span>
            </div>

            {/* 1. 任务标题 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">
                  <span className="text-red-400 mr-1">*</span>任务标题
                </label>
                <span className={`text-[11px] font-mono font-bold ${title.length > 30 ? 'text-red-400' : 'text-slate-500'}`}>
                  {title.length} / 30 字
                </span>
              </div>
              <input
                type="text"
                required
                maxLength={30}
                disabled={readOnly}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="请输入清晰明确的任务标题（例如：基于LoRA微调电商客服问答大模型），限制30字以内"
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  readOnly
                    ? 'bg-slate-900 border border-slate-800 text-slate-200 cursor-default'
                    : 'bg-slate-900 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none'
                }`}
              />
            </div>

            {/* 2. 所属领域与难度评级 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 所属领域 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span><span className="text-red-400 mr-1">*</span>所属领域分类</span>
                </label>
                <select
                  disabled={readOnly}
                  value={domain}
                  onChange={(e) => setDomain(e.target.value as TaskDomainType)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    readOnly
                      ? 'bg-slate-900 border border-slate-800 text-slate-200 cursor-default'
                      : 'bg-slate-900 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none cursor-pointer'
                  }`}
                >
                  {DOMAIN_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 难度评级 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  <span className="text-red-400 mr-1">*</span>任务难度评级
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {DIFFICULTY_OPTIONS.map(df => (
                    <button
                      key={df}
                      type="button"
                      disabled={readOnly}
                      onClick={() => setDifficulty(df)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        difficulty === df
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      {df}难度
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. 任务描述 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span><span className="text-red-400 mr-1">*</span>任务描述与背景需求</span>
                </label>
                {!readOnly && (
                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      type="button"
                      onClick={() => insertFormatting('desc', '**', '**')}
                      className="p-1 hover:text-slate-200 hover:bg-slate-800 rounded text-xs transition"
                      title="加粗"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('desc', '*', '*')}
                      className="p-1 hover:text-slate-200 hover:bg-slate-800 rounded text-xs transition"
                      title="斜体"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('desc', '[链接文字](http://...)')}
                      className="p-1 hover:text-slate-200 hover:bg-slate-800 rounded text-xs transition"
                      title="插入链接"
                    >
                      <Link className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <textarea
                required
                rows={5}
                disabled={readOnly}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="请详细说明任务背景、具体功能需求、代码架构及交付物要求..."
                className={`w-full p-3.5 rounded-xl text-xs leading-relaxed transition resize-y ${
                  readOnly
                    ? 'bg-slate-900 border border-slate-800 text-slate-300 cursor-default'
                    : 'bg-slate-900 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none'
                }`}
              />
            </div>

            {/* 4. 成果验收标准 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span><span className="text-red-400 mr-1">*</span>成果验收标准</span>
                </label>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => insertFormatting('criteria', '1. ')}
                    className="p-1 hover:text-slate-200 hover:bg-slate-800 rounded text-xs transition"
                    title="添加有序编号"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <textarea
                required
                rows={4}
                disabled={readOnly}
                value={acceptanceCriteria}
                onChange={(e) => setAcceptanceCriteria(e.target.value)}
                placeholder="请明确列出成果验收的硬性指标、复现步骤或性能参数标准..."
                className={`w-full p-3.5 rounded-xl text-xs leading-relaxed transition resize-y ${
                  readOnly
                    ? 'bg-slate-900 border border-slate-800 text-slate-300 cursor-default'
                    : 'bg-slate-900 border border-slate-700 text-white focus:border-indigo-500 focus:outline-none'
                }`}
              />
            </div>
          </div>

          {/* ============================================================== */}
          {/* 第二个区域：2. 悬赏奖励与交付截止周期 */}
          {/* ============================================================== */}
          <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h3 className="text-sm font-black text-white">2. 悬赏奖励与交付截止周期</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">赏金托管与周期管控</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 现金奖励 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  现金悬赏奖励（元）
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">¥</span>
                  <input
                    type="number"
                    min={0}
                    disabled={readOnly}
                    value={cashReward}
                    onChange={(e) => setCashReward(Math.max(0, parseInt(e.target.value) || 0))}
                    className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl text-xs font-mono font-bold text-emerald-400 transition ${
                      readOnly
                        ? 'bg-slate-900 border border-slate-800 cursor-default'
                        : 'bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:outline-none'
                    }`}
                  />
                </div>
              </div>

              {/* 积分奖励 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>额外积分奖励（个）</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">+</span>
                  <input
                    type="number"
                    min={0}
                    disabled={readOnly}
                    value={pointsReward}
                    onChange={(e) => setPointsReward(Math.max(0, parseInt(e.target.value) || 0))}
                    className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl text-xs font-mono font-bold text-amber-400 transition ${
                      readOnly
                        ? 'bg-slate-900 border border-slate-800 cursor-default'
                        : 'bg-slate-900 border border-slate-700 focus:border-amber-500 focus:outline-none'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* 起止时间 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>任务开始时间 (发布时间)</span>
                </label>
                <input
                  type="text"
                  disabled={readOnly}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="YYYY-MM-DD HH:mm:ss"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono text-slate-300 transition ${
                    readOnly
                      ? 'bg-slate-900 border border-slate-800 cursor-default'
                      : 'bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:outline-none'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span><span className="text-red-400 mr-1">*</span>任务截止交付时间 (到期自动停止接单)</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={readOnly}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="YYYY-MM-DD HH:mm:ss"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-200 transition ${
                    readOnly
                      ? 'bg-slate-900 border border-slate-800 cursor-default'
                      : 'bg-slate-900 border border-slate-700 focus:border-cyan-500 focus:outline-none'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 第三个区域：3. 推荐平台资源（可选） */}
          {/* ============================================================== */}
          <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <h3 className="text-sm font-black text-white">3. 推荐平台资源（可选）</h3>
              </div>
              <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                推荐后接单人可见
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              💡 以下资源将展示给任务接单人，帮助其快速理解任务背景并高效完成。
            </p>

            <div className="space-y-4">
              {/* Agent 推荐 */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Boxes className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Agent推荐</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">上限1-3个</span>
                </div>

                {!readOnly && (
                  <div className="flex items-center gap-2">
                    <select
                      value={pendingAgentId}
                      onChange={(e) => setPendingAgentId(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="">搜索或选择Agent...</option>
                      {agents.map(ag => (
                        <option key={ag.id} value={ag.id} className="bg-slate-900 text-white">
                          {ag.name} ({ag.category || '智能体'})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAddAgent}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
                    >
                      添加
                    </button>
                  </div>
                )}

                {selectedAgentIds.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="text-slate-500 font-bold">已选：</span>
                    {selectedAgentIds.map(id => {
                      const item = agents.find(a => a.id === id);
                      const name = item ? item.name : id;
                      return (
                        <span key={id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                          <span>{name}</span>
                          {!readOnly && (
                            <button
                              type="button"
                              onClick={() => setSelectedAgentIds(selectedAgentIds.filter(i => i !== id))}
                              className="hover:text-red-400 transition cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  readOnly && <div className="text-xs text-slate-500 italic">未配置推荐 Agent</div>
                )}
              </div>

              {/* 模型推荐 */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>模型推荐</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">上限1-3个</span>
                </div>

                {!readOnly && (
                  <div className="flex items-center gap-2">
                    <select
                      value={pendingModelId}
                      onChange={(e) => setPendingModelId(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="">搜索或选择模型...</option>
                      {models.map(m => (
                        <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                          {m.name} ({m.vendor || 'AI底座'})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAddModel}
                      className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
                    >
                      添加
                    </button>
                  </div>
                )}

                {selectedModelIds.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="text-slate-500 font-bold">已选：</span>
                    {selectedModelIds.map(id => {
                      const item = models.find(m => m.id === id);
                      const name = item ? item.name : id;
                      return (
                        <span key={id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-bold">
                          <span>{name}</span>
                          {!readOnly && (
                            <button
                              type="button"
                              onClick={() => setSelectedModelIds(selectedModelIds.filter(i => i !== id))}
                              className="hover:text-red-400 transition cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  readOnly && <div className="text-xs text-slate-500 italic">未配置推荐模型</div>
                )}
              </div>

              {/* 数据集推荐 */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    <span>数据集推荐</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">上限1-3个</span>
                </div>

                {!readOnly && (
                  <div className="flex items-center gap-2">
                    <select
                      value={pendingDatasetId}
                      onChange={(e) => setPendingDatasetId(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="">搜索或选择数据集...</option>
                      {datasets.map(d => (
                        <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                          {d.name} ({d.modalityCategory || '公开数据集'})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAddDataset}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
                    >
                      添加
                    </button>
                  </div>
                )}

                {selectedDatasetIds.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="text-slate-500 font-bold">已选：</span>
                    {selectedDatasetIds.map(id => {
                      const item = datasets.find(d => d.id === id);
                      const name = item ? item.name : id;
                      return (
                        <span key={id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                          <span>{name}</span>
                          {!readOnly && (
                            <button
                              type="button"
                              onClick={() => setSelectedDatasetIds(selectedDatasetIds.filter(i => i !== id))}
                              className="hover:text-red-400 transition cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  readOnly && <div className="text-xs text-slate-500 italic">未配置推荐数据集</div>
                )}
              </div>

              {/* Skill 推荐 */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-amber-400" />
                    <span>Skill推荐</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">上限1-3个</span>
                </div>

                {!readOnly && (
                  <div className="flex items-center gap-2">
                    <select
                      value={pendingSkillId}
                      onChange={(e) => setPendingSkillId(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="">搜索或选择Skill...</option>
                      {skills.map(s => (
                        <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                          {s.name} ({s.category || 'Skill'})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
                    >
                      添加
                    </button>
                  </div>
                )}

                {selectedSkillIds.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="text-slate-500 font-bold">已选：</span>
                    {selectedSkillIds.map(id => {
                      const item = skills.find(s => s.id === id);
                      const name = item ? item.name : id;
                      return (
                        <span key={id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold">
                          <span>{name}</span>
                          {!readOnly && (
                            <button
                              type="button"
                              onClick={() => setSelectedSkillIds(selectedSkillIds.filter(i => i !== id))}
                              className="hover:text-red-400 transition cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  readOnly && <div className="text-xs text-slate-500 italic">未配置推荐 Skill</div>
                )}
              </div>

              {/* 环境推荐（算力工坊） */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-blue-400" />
                    <span>环境推荐（算力工坊）</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">数量限制：1个</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 font-bold">规格选择：</span>
                    <select
                      disabled={readOnly}
                      value={selectedEnvSpec}
                      onChange={(e) => setSelectedEnvSpec(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl font-bold transition ${
                        readOnly
                          ? 'bg-slate-950 border border-slate-800 text-slate-300 cursor-default'
                          : 'bg-slate-950 border border-slate-700 text-white focus:border-indigo-500 cursor-pointer'
                      }`}
                    >
                      {ENV_SPEC_OPTIONS.map(opt => (
                        <option key={opt} value={opt} className="bg-slate-900 text-white">{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 font-bold">推荐镜像：</span>
                    <select
                      disabled={readOnly}
                      value={selectedEnvImage}
                      onChange={(e) => setSelectedEnvImage(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl font-bold transition ${
                        readOnly
                          ? 'bg-slate-950 border border-slate-800 text-slate-300 cursor-default'
                          : 'bg-slate-950 border border-slate-700 text-white focus:border-indigo-500 cursor-pointer'
                      }`}
                    >
                      {ENV_IMAGE_OPTIONS.map(opt => (
                        <option key={opt} value={opt} className="bg-slate-900 text-white">{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ============================================================== */}
          {/* 第四个区域：4. 平台运行状态与接单监控 */}
          {/* ============================================================== */}
          <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="text-sm font-black text-white">4. 平台运行状态与接单监控</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">系统生命周期控制</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 任务运行状态 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  任务运行状态
                </label>
                {readOnly ? (
                  <div className="pt-1">
                    <span className={`inline-block px-3 py-1.5 rounded-xl text-xs font-bold border ${
                      STATUS_OPTIONS.find(s => s.value === status)?.color || 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {status}
                    </span>
                  </div>
                ) : (
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskGlobalStatus)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-bold focus:border-indigo-500 focus:outline-none transition cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st.value} value={st.value} className="bg-slate-900 text-white">
                        {st.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* 驳回原因 (当状态为驳回时显示或编辑) */}
              {(status === '已驳回' || task.rejectReason) && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-red-400">
                    审核驳回原因说明
                  </label>
                  <input
                    type="text"
                    disabled={readOnly}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="请输入驳回原因说明..."
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                      readOnly
                        ? 'bg-red-950/20 border border-red-900/50 text-red-300 cursor-default'
                        : 'bg-slate-900 border border-red-700 text-white focus:border-red-500 focus:outline-none'
                    }`}
                  />
                </div>
              )}
            </div>

            {/* 接单极客概况展示 */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>接单极客团队 (共 {takersList.length} 人，已交付 {submissionsList.length} 份)：</span>
                </span>
              </div>
              {takersList.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {takersList.map((tk, idx) => (
                    <div key={tk.id || idx} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                      <img
                        src={tk.userAvatar}
                        alt={tk.username}
                        className="w-5 h-5 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-slate-200 font-bold">{tk.username}</span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        tk.status === '已验收' ? 'bg-emerald-500/20 text-emerald-400' :
                        tk.status === '已提交' ? 'bg-indigo-500/20 text-indigo-400' :
                        tk.status === '已驳回' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {tk.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic">暂无极客接单</div>
              )}
            </div>

          </div>

          {/* 底部按钮栏 */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 sticky bottom-0 bg-slate-950/90 py-2 -mx-6 px-6 -mb-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
            >
              {readOnly ? '关闭详情' : '取消'}
            </button>
            {!readOnly && (
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-600/25"
              >
                <Save className="w-4 h-4" />
                <span>保存修改</span>
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};
