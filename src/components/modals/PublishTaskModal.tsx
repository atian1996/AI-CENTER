import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskDomain, TaskDifficulty, TaskCategoryType } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Coins,
  ShieldCheck,
  Calendar,
  Layers,
  FileText,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  Paperclip,
  Trash2,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Code,
  Quote,
  Link,
  RotateCcw,
  RotateCw,
  Wallet,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  Info
} from 'lucide-react';

interface PublishTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishTaskModal: React.FC<PublishTaskModalProps> = ({ isOpen, onClose }) => {
  const { addTask, user, showToast } = useApp();

  // 第一部分：任务信息
  const [title, setTitle] = useState('');
  const [categoryType, setCategoryType] = useState<TaskCategoryType>('单个任务');
  const [taskCount, setTaskCount] = useState<number>(5);
  const [domain, setDomain] = useState<TaskDomain>('技术开发');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('简单');
  
  // 富文本内容
  const [description, setDescription] = useState(
    '### 任务背景\n我们需要基于现有数据集微调一套高性能领域推理模型，解决垂直场景下的准确率瓶颈。\n\n### 具体需求\n1. 数据清洗与格式转换（支持JSONL/Parquet）；\n2. 采用LoRA或全参微调，评估在验证集上的F1-Score；\n3. 编写自动化推理脚本与完整中文注释文档。'
  );
  const [acceptanceCriteria, setAcceptanceCriteria] = useState(
    '1. 交付经过严格验证的模型权重文件或LoRA Adapter；\n2. 交付完整的端到端训练与推理代码包；\n3. 性能测试指标达到 Baseline 的 115% 以上，并附上测试复现报告。'
  );

  // 附件列表
  const [attachments, setAttachments] = useState<{ id: string; name: string; size: string }[]>([
    { id: 'att_1', name: '技术规范与测试基准说明书.pdf', size: '2.4 MB' }
  ]);
  const [newFileUploading, setNewFileUploading] = useState(false);

  // 第二部分：任务奖励与周期
  const [cashReward, setCashReward] = useState<number>(1500);
  const [pointsReward, setPointsReward] = useState<number>(100);
  const [startTime, setStartTime] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [endTime, setEndTime] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });

  // 勾选协议
  const [agreeTerms, setAgreeTerms] = useState(true);

  if (!isOpen) return null;

  // 批量数量计算
  const effectiveCount = categoryType === '批量任务' ? Math.max(2, Math.min(9999, Number(taskCount) || 2)) : 1;
  const totalCash = cashReward * effectiveCount;
  const totalPoints = pointsReward * effectiveCount;

  // 余额与积分校验
  const isCashSufficient = (user?.balance ?? 0) >= totalCash;
  const isPointsSufficient = (user?.points ?? 0) >= totalPoints;
  const canAfford = isCashSufficient && isPointsSufficient;

  // 简易富文本工具栏辅助函数
  const applyFormatting = (target: 'desc' | 'criteria', prefix: string, suffix: string = '') => {
    if (target === 'desc') {
      setDescription(prev => `${prev}\n${prefix}示范文本${suffix}`);
    } else {
      setAcceptanceCriteria(prev => `${prev}\n${prefix}验收指标${suffix}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setNewFileUploading(true);
    setTimeout(() => {
      const file = files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setAttachments(prev => [
        ...prev,
        { id: `att_${Date.now()}`, name: file.name, size: `${sizeMB} MB` }
      ]);
      setNewFileUploading(false);
      showToast(`附件【${file.name}】已添加`);
    }, 400);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('请填写任务标题（最多30字）');
      return;
    }
    if (title.length > 30) {
      showToast('任务标题不能超过30个字');
      return;
    }
    if (!description.trim()) {
      showToast('请填写任务描述内容');
      return;
    }
    if (!acceptanceCriteria.trim()) {
      showToast('请填写任务验收标准');
      return;
    }
    if (cashReward <= 0 && pointsReward <= 0) {
      showToast('请输入有效的任务赏金或积分奖励');
      return;
    }
    if (!canAfford) {
      showToast('当前可用余额或积分不足，请先充值或调整赏金');
      return;
    }
    if (!agreeTerms) {
      showToast('请阅读并同意托管交易协议');
      return;
    }

    addTask({
      title: title.trim(),
      brief: description.replace(/<[^>]+>|#/g, '').slice(0, 60),
      categoryType,
      taskCount: effectiveCount,
      domain,
      difficulty,
      description,
      acceptanceCriteria,
      cashReward,
      pointsReward,
      totalCashReward: totalCash,
      totalPointsReward: totalPoints,
      startTime: `${startTime} 00:00:00`,
      endTime: `${endTime} 23:59:59`,
      attachments
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* 背景遮罩 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* 弹窗容器 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden z-10 my-auto text-slate-800"
        >
          {/* 弹窗头部 */}
          <div className="flex items-center justify-between px-7 py-4.5 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-black">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">发布任务</h3>
                <p className="text-xs text-slate-500 font-medium">填写任务需求与验收指标，托管赏金后进入平台审核上架</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 弹窗表单滚动区域 */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-7 space-y-8">
            {/* 第一部分：任务信息 */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <h4 className="text-sm font-black text-slate-900 tracking-wider">第一部分：任务信息</h4>
              </div>

              {/* 任务标题 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black text-slate-800 flex items-center gap-1">
                    <span className="text-red-500">*</span> 任务标题
                  </label>
                  <span className={`text-xs font-mono font-bold ${title.length > 30 ? 'text-red-600' : 'text-slate-400'}`}>
                    {title.length}/30 字
                  </span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={30}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例如：金融垂直场景下的LoRA微调与评测推理优化（限30字）"
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-slate-900 text-sm font-semibold outline-none transition focus:bg-white focus:ring-2 ${
                    title.length > 30 ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
              </div>

              {/* 任务类别 */}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-800 flex items-center gap-1">
                  <span className="text-red-500">*</span> 任务类别
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {(['单个任务', '批量任务'] as TaskCategoryType[]).map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategoryType(cat)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                        categoryType === cat
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          categoryType === cat ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                        }`}>
                          {categoryType === cat && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span>{cat}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-normal">
                        {cat === '单个任务' ? '单人承包交付' : '支持多人并行接单交付'}
                      </span>
                    </button>
                  ))}
                </div>

                {/* 批量任务数量输入框 */}
                {categoryType === '批量任务' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3.5 bg-indigo-50/30 border border-indigo-100 rounded-xl flex items-center justify-between gap-4"
                  >
                    <div className="text-xs font-bold text-slate-700">
                      <span className="text-indigo-600 font-extrabold mr-1">批量招募数量：</span>
                      设定需要并行招募完成的任务份数（2 ~ 9999）
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={2}
                        max={9999}
                        value={taskCount}
                        onChange={(e) => setTaskCount(Math.max(2, Math.min(9999, parseInt(e.target.value) || 2)))}
                        className="w-24 px-3 py-1.5 bg-white border border-indigo-200 rounded-lg text-sm font-bold text-center text-indigo-700 outline-none focus:ring-2 focus:ring-indigo-200"
                      />
                      <span className="text-xs font-bold text-slate-500">份</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* 所属领域与任务难度 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-black text-slate-800 mb-1.5 block">
                    <span className="text-red-500">*</span> 所属领域
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value as TaskDomain)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-bold outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="技术开发">技术开发</option>
                    <option value="内容创作">内容创作</option>
                    <option value="AI模型与数据">AI模型与数据</option>
                    <option value="工具与自动化">工具与自动化</option>
                    <option value="咨询与培训">咨询与培训</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-800 mb-1.5 block">
                    <span className="text-red-500">*</span> 任务难度
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['简单', '中等', '困难'] as TaskDifficulty[]).map((dif) => (
                      <button
                        type="button"
                        key={dif}
                        onClick={() => setDifficulty(dif)}
                        className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                          difficulty === dif
                            ? dif === '简单'
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-extrabold shadow-2xs'
                              : dif === '中等'
                              ? 'bg-blue-50 border-blue-500 text-blue-700 font-extrabold shadow-2xs'
                              : 'bg-purple-50 border-purple-500 text-purple-700 font-extrabold shadow-2xs'
                            : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {dif}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 任务描述 富文本编辑器 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black text-slate-800 flex items-center gap-1">
                    <span className="text-red-500">*</span> 任务描述与需求细则
                  </label>
                  <span className="text-[11px] text-slate-400">支持Markdown排版与快捷工具栏</span>
                </div>

                {/* 富文本工具栏 */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition">
                  <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 text-slate-600 text-xs">
                    <button
                      type="button"
                      onClick={() => applyFormatting('desc', '**', '**')}
                      title="加粗"
                      className="p-1.5 rounded hover:bg-slate-200 transition"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting('desc', '*', '*')}
                      title="斜体"
                      className="p-1.5 rounded hover:bg-slate-200 transition"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting('desc', '<u>', '</u>')}
                      title="下划线"
                      className="p-1.5 rounded hover:bg-slate-200 transition"
                    >
                      <Underline className="w-3.5 h-3.5" />
                    </button>
                    <div className="h-4 w-px bg-slate-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => applyFormatting('desc', '- ')}
                      title="无序列表"
                      className="p-1.5 rounded hover:bg-slate-200 transition"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting('desc', '1. ')}
                      title="有序列表"
                      className="p-1.5 rounded hover:bg-slate-200 transition"
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting('desc', '```python\n# 核心逻辑\n', '\n```')}
                      title="代码块"
                      className="p-1.5 rounded hover:bg-slate-200 transition"
                    >
                      <Code className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting('desc', '> 补充说明：')}
                      title="引用"
                      className="p-1.5 rounded hover:bg-slate-200 transition"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                    <div className="h-4 w-px bg-slate-300 mx-1" />
                    <span className="text-[10px] text-slate-400 font-mono ml-auto">富文本编辑器 (Rich Editor)</span>
                  </div>
                  <textarea
                    rows={6}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="详细描述任务的背景、业务目标、技术栈要求、接口协议或文档期望..."
                    className="w-full p-3.5 text-xs font-medium text-slate-800 leading-relaxed outline-none resize-y"
                  />
                </div>
              </div>

              {/* 验收标准 富文本编辑器 */}
              <div>
                <label className="text-xs font-black text-slate-800 mb-1.5 block">
                  <span className="text-red-500">*</span> 验收标准
                </label>
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition">
                  <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 text-slate-600 text-xs">
                    <button
                      type="button"
                      onClick={() => applyFormatting('criteria', '1. ')}
                      title="条目"
                      className="p-1.5 rounded hover:bg-slate-200 transition"
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting('criteria', '**', '**')}
                      title="重点加粗"
                      className="p-1.5 rounded hover:bg-slate-200 transition"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-slate-400 ml-auto">说明判定验收合格的具体准则</span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    value={acceptanceCriteria}
                    onChange={(e) => setAcceptanceCriteria(e.target.value)}
                    placeholder="1. 交付完整可用源码；2. 在基准测试集上准确率达标；3. 附带完整中文部署说明文档。"
                    className="w-full p-3.5 text-xs font-medium text-slate-800 leading-relaxed outline-none resize-y"
                  />
                </div>
              </div>

              {/* 附件上传 */}
              <div>
                <label className="text-xs font-black text-slate-800 mb-1.5 block">
                  任务附件 (支持图片、文档、压缩包，单文件最大20MB)
                </label>
                <div className="space-y-2.5">
                  {attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="font-bold text-slate-800">{file.name}</span>
                        <span className="text-slate-400 font-mono">({file.size})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(file.id)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <label className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-300 text-xs font-bold text-slate-600 cursor-pointer transition">
                    <UploadCloud className="w-4 h-4 text-indigo-600" />
                    <span>{newFileUploading ? '正在上传中...' : '点击或拖拽上传附件文件'}</span>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={newFileUploading}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* 第二部分：任务奖励与周期 */}
            <div className="space-y-6 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <h4 className="text-sm font-black text-slate-900 tracking-wider">第二部分：任务奖励与周期</h4>
              </div>

              {/* 单份任务单价设置 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-black text-slate-800 mb-1.5 block">
                    <span className="text-red-500">*</span> 单份任务现金赏金 (¥)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">¥</span>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      value={cashReward}
                      onChange={(e) => setCashReward(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-bold font-mono outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-800 mb-1.5 block">
                    单份任务积分奖励 (可设为0)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-amber-500">💎</span>
                    <input
                      type="number"
                      min={0}
                      step={10}
                      value={pointsReward}
                      onChange={(e) => setPointsReward(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-bold font-mono outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              </div>

              {/* 周期范围 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-black text-slate-800 mb-1.5 block">
                    <span className="text-red-500">*</span> 招募开始时间
                  </label>
                  <input
                    type="date"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-bold outline-none focus:bg-white focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-800 mb-1.5 block">
                    <span className="text-red-500">*</span> 最终截止时间
                  </label>
                  <input
                    type="date"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-bold outline-none focus:bg-white focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* 资金预算与账户托管看板 */}
              <div className="p-4.5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl shadow-md space-y-3">
                <div className="flex items-center justify-between text-xs text-indigo-200 border-b border-indigo-800/40 pb-2.5">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Wallet className="w-4 h-4 text-indigo-400" />
                    <span>托管预算汇总 (Escrow Summary)</span>
                  </div>
                  <span className="text-[11px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-400/30">
                    {categoryType} × {effectiveCount} 份
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div>
                    <div className="text-[11px] text-slate-400">总需托管现金</div>
                    <div className="text-base font-black font-mono text-emerald-400">
                      ¥{totalCash.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">总需托管积分</div>
                    <div className="text-base font-black font-mono text-amber-400">
                      {totalPoints.toLocaleString()} 积分
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">当前账户可用余额</div>
                    <div className={`text-sm font-black font-mono ${isCashSufficient ? 'text-slate-200' : 'text-red-400'}`}>
                      ¥{(user?.balance ?? 0).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">当前账户可用积分</div>
                    <div className={`text-sm font-black font-mono ${isPointsSufficient ? 'text-slate-200' : 'text-red-400'}`}>
                      {(user?.points ?? 0).toLocaleString()} 积分
                    </div>
                  </div>
                </div>

                {!canAfford && (
                  <div className="p-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>可用资金或积分不足以支付总托管金额，提交时将无法冻结，请先调整赏金或前往个人中心充值。</span>
                  </div>
                )}
              </div>

              {/* 托管免责协议勾选 */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="publish-task-agreement"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-indigo-600 cursor-pointer"
                />
                <label htmlFor="publish-task-agreement" className="text-xs text-slate-500 font-medium cursor-pointer leading-relaxed">
                  我已阅读并同意《平台委托赏金托管与验收结算规范》。任务发布后赏金将立即进入平台安全托管账户冻结，待验收通过后结算至接单开发者；若审核驳回或撤回任务，托管金额将全额原路退回可用余额。
                </label>
              </div>
            </div>

            {/* 底部提交按钮 */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs transition"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={!canAfford || !agreeTerms}
                className={`px-7 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 ${
                  canAfford && agreeTerms
                    ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-98 cursor-pointer'
                    : 'bg-slate-300 cursor-not-allowed opacity-70'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>提交审核并锁定托管赏金</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
