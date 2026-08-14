import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
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
  FileCode,
  Trash2,
  Inbox,
  Sparkles,
  RefreshCw,
  Eye,
  FileUp
} from 'lucide-react';

interface Deliverable {
  id: string;
  name: string;
  size: string;
  uploadTime: string;
  status: '待审核' | '已通过' | '已驳回';
  memo?: string;
}

interface UndertakenTask {
  id: string;
  title: string;
  publisher: string;
  publisherAvatar: string;
  bounty: number;
  bountyUnit: '¥' | '积分';
  description: string;
  status: '进行中' | '等待验收' | '已完成';
  deliverables: Deliverable[];
}

interface Submission {
  id: string;
  taskId: string;
  developerName: string;
  developerAvatar: string;
  developerTitle: string;
  fileName: string;
  fileSize: string;
  submitTime: string;
  status: '待验收' | '已通过验收' | '未通过';
  memo: string;
}

export const WorkspaceTasks: React.FC = () => {
  const { tasks, showToast, openModal } = useApp();

  const [activeTab, setActiveTab] = useState<'published' | 'undertaken'>('published');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>('tsk_101'); // Default open first one

  // --- 我承接的任务 状态与逻辑 ---
  const [undertakenTasks, setUndertakenTasks] = useState<UndertakenTask[]>([
    {
      id: 'under_101',
      title: '政务大模型智能客服工作流设计',
      publisher: '深圳市福田区政务服务中心',
      publisherAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
      bounty: 12000,
      bountyUnit: '¥',
      status: '进行中',
      description: '设计一套面向市民政策咨询的政务 Agent 工作流，支持自动路由、长文本知识库检索、多轮澄清追问，需对接政务知识库 PDF。',
      deliverables: []
    },
    {
      id: 'under_102',
      title: '电商垂直领域多模态商品文案生成工作流搭建',
      publisher: '极客优品电商',
      publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      bounty: 3500,
      bountyUnit: '¥',
      status: '等待验收',
      description: '在 ComfyUI / Dify 中搭建一键式商品卖点文案与海报生成的自动化工作流，需支持多规格尺寸输出。',
      deliverables: [
        {
          id: 'del_102_1',
          name: 'comfyui_ecommerce_workflow_v1.0.json',
          size: '24.5 KB',
          uploadTime: '2026-08-13 14:20',
          status: '待审核',
          memo: '已完成主流电商文案提取与图像生成的链路整合，实测一键生图和配文耗时 1.8 秒。'
        }
      ]
    }
  ]);

  // 上传交付物表单状态 (按任务ID存储)
  const [uploadForm, setUploadForm] = useState<Record<string, { fileName: string; memo: string }>>({});
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadingTaskId, setUploadingTaskId] = useState<string | null>(null);

  const handleFormChange = (taskId: string, field: 'fileName' | 'memo', value: string) => {
    setUploadForm(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId] || { fileName: '', memo: '' },
        [field]: value
      }
    }));
  };

  const handleFillTemplateFile = (taskId: string, fileName: string) => {
    setUploadForm(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId] || { fileName: '', memo: '' },
        fileName,
        memo: `这是针对“${undertakenTasks.find(t => t.id === taskId)?.title}”提交的生产交付版本。包含完整的工作流配置、API 调用接口以及对应的 Prompt 调优用例。`
      }
    }));
  };

  const handleStartUpload = (taskId: string) => {
    const form = uploadForm[taskId] || { fileName: '', memo: '' };
    if (!form.fileName.trim()) {
      showToast('请输入或选择交付文件名称');
      return;
    }

    setUploadingTaskId(taskId);
    setUploadProgress(0);

    // 模拟高保真上传进度
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // 将新交付物追加至该任务的交付物列表
            setUndertakenTasks(prevTasks => prevTasks.map(item => {
              if (item.id === taskId) {
                const newDeliverable: Deliverable = {
                  id: `del_${Date.now()}`,
                  name: form.fileName,
                  size: '18.4 MB',
                  uploadTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
                  status: '待审核',
                  memo: form.memo
                };
                return {
                  ...item,
                  status: '等待验收',
                  deliverables: [newDeliverable, ...item.deliverables]
                };
              }
              return item;
            }));

            // 清理上传状态
            setUploadingTaskId(null);
            setUploadProgress(0);
            setUploadForm(prevForm => ({
              ...prevForm,
              [taskId]: { fileName: '', memo: '' }
            }));

            showToast(`交付物《${form.fileName}》已成功上传！已提交给发布方人工审核验收。`);
          }, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };


  // --- 我发布的任务 交付物列表与验收逻辑 ---
  const [submissionsMap, setSubmissionsMap] = useState<Record<string, Submission[]>>({
    'tsk_101': [
      {
        id: 'sub_101_1',
        taskId: 'tsk_101',
        developerName: '李明',
        developerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        developerTitle: '前百度高级算法工程师',
        fileName: 'qwen_law_agent_v1.0.zip',
        fileSize: '18.5 MB',
        submitTime: '今天 10:24',
        status: '待验收',
        memo: '完成了民商法RAG检索深度优化，Qwen2.5微调后的法律术语识别准确度提升至94.2%，内置10组主流合同测试用例及红线报告。'
      },
      {
        id: 'sub_101_2',
        taskId: 'tsk_101',
        developerName: '陈丽',
        developerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
        developerTitle: '资深 Prompt 架构师',
        fileName: 'law_agent_system_prompts.json',
        fileSize: '8.4 KB',
        submitTime: '昨天 17:35',
        status: '待验收',
        memo: '定制了Qwen-2.5-Instruct系统层级的合同合规审查Prompt链，包含严密的违约责任、争议解决条款防幻觉结构，测试通过率100%。'
      }
    ],
    'tsk_102': [
      {
        id: 'sub_102_1',
        taskId: 'tsk_102',
        developerName: '张强',
        developerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        developerTitle: '清华大学计算机系博士生',
        fileName: 'medical_unet_fusion_weights.onnx',
        fileSize: '124.8 MB',
        submitTime: '2026-08-12 11:15',
        status: '已通过验收',
        memo: '基于3D-UNet与Swin-UNETR模型融合训练的医疗分割网络模型，Dice相似度达到89.4%，已顺利通过平台前置系统自动化评估测试。'
      }
    ],
    'tsk_103': [
      {
        id: 'sub_103_1',
        taskId: 'tsk_103',
        developerName: 'AIGC创意工坊',
        developerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        developerTitle: '资深 AIGC 模型研究员',
        fileName: 'cyberpunk_国风_flux_lora.safetensors',
        fileSize: '172.0 MB',
        submitTime: '昨天 23:45',
        status: '待验收',
        memo: '精选了300张高质量赛博国风概念艺术图进行Flux.1底层微调，触发词【cyber_guofeng】。附带完整的ComfyUI出图流说明文档。'
      }
    ]
  });

  // 多选验收状态
  const [selectedSubmissionIds, setSelectedSubmissionIds] = useState<string[]>([]);

  const handleToggleSelectSubmission = (id: string) => {
    setSelectedSubmissionIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllSubmissionsOfTask = (taskId: string, submissions: Submission[]) => {
    const pendingIds = submissions.filter(s => s.status === '待验收').map(s => s.id);
    const allSelected = pendingIds.every(id => selectedSubmissionIds.includes(id));

    if (allSelected) {
      setSelectedSubmissionIds(prev => prev.filter(id => !pendingIds.includes(id)));
    } else {
      setSelectedSubmissionIds(prev => {
        const filtered = prev.filter(id => !pendingIds.includes(id));
        return [...filtered, ...pendingIds];
      });
    }
  };

  // 批量通过或拒绝验收交付物
  const handleBatchAcceptSubmissions = (taskId: string, approve: boolean) => {
    const subsOfTask = submissionsMap[taskId] || [];
    const selectedPending = subsOfTask.filter(
      s => s.status === '待验收' && selectedSubmissionIds.includes(s.id)
    );

    if (selectedPending.length === 0) {
      showToast('请先勾选需要处理的“待验收”交付物');
      return;
    }

    setSubmissionsMap(prev => {
      const updated = { ...prev };
      updated[taskId] = updated[taskId].map(sub => {
        if (selectedPending.some(p => p.id === sub.id)) {
          return {
            ...sub,
            status: approve ? '已通过验收' : '未通过'
          };
        }
        return sub;
      });
      return updated;
    });

    // 清理已处理的选中状态
    const processedIds = selectedPending.map(p => p.id);
    setSelectedSubmissionIds(prev => prev.filter(id => !processedIds.includes(id)));

    if (approve) {
      showToast(`成功通过了 ${selectedPending.length} 个交付成果的审核验收！赏金已经划拨至开发者的账户。`);
    } else {
      showToast(`已将选中的 ${selectedPending.length} 个交付成果标记为拒绝，并要求开发者重新提交。`);
    }
  };


  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto" id="workspace_tasks_container">
      
      {/* 头部精细化标题与发布按钮 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>我的任务中心</span>
            <span className="text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-md font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              Deliverables Hub
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            无缝管控您发布和承接的 AI 任务交付进度。我承接的任务支持高效递交版本，我发布的任务支持查看清单、多选一键验收结算。
          </p>
        </div>

        <button
          onClick={() => openModal('publishTask')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition shadow-xs flex items-center gap-2 cursor-pointer shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>发布新悬赏任务</span>
        </button>
      </div>

      {/* 高端双排标签页切换 */}
      <div className="flex items-center gap-4 border-b border-slate-100 text-xs font-extrabold">
        <button
          onClick={() => setActiveTab('published')}
          className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition duration-200 cursor-pointer ${
            activeTab === 'published'
              ? 'border-indigo-600 text-indigo-600 font-black'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <span>我发布的任务</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'published' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-50 text-slate-400'}`}>
            {tasks.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('undertaken')}
          className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition duration-200 cursor-pointer ${
            activeTab === 'undertaken'
              ? 'border-indigo-600 text-indigo-600 font-black'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <span>我承接的任务</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'undertaken' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-50 text-slate-400'}`}>
            {undertakenTasks.length}
          </span>
        </button>
      </div>

      {/* TAB 1: 我发布的任务 (查看交付物、多选验收结算) */}
      {activeTab === 'published' && (
        <div className="space-y-6">
          {tasks.map((tsk) => {
            const submissions = submissionsMap[tsk.id] || [];
            const pendingCount = submissions.filter(s => s.status === '待验收').length;
            const isExpanded = expandedTaskId === tsk.id;

            return (
              <div 
                key={tsk.id} 
                className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden transition-all duration-200 hover:border-slate-300/80 hover:shadow-xs"
              >
                {/* 任务头部简要信息 */}
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                  <div className="space-y-1.5">
                    <div className="flex items-center flex-wrap gap-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-100/50">
                        {tsk.type}
                      </span>
                      <h3 className="text-sm font-black text-slate-900 tracking-tight">
                        {tsk.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                      <span>发布时间：{tsk.publishTime}</span>
                      <span>截止时间：{tsk.deadline}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 shrink-0">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold">任务总赏金</p>
                      <p className="text-base font-black text-amber-600 mt-0.5">
                        {tsk.bountyUnit}{tsk.bounty.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedTaskId(isExpanded ? null : tsk.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer border ${
                          isExpanded 
                            ? 'bg-slate-100 border-slate-200 text-slate-700' 
                            : 'bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100/50'
                        }`}
                      >
                        <span>{isExpanded ? '收起交付物' : '验收交付物清单'}</span>
                        {pendingCount > 0 && (
                          <span className="bg-red-500 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                            {pendingCount}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 任务描述区 */}
                <div className="px-6 py-4 border-t border-slate-100 text-xs text-slate-600 font-medium leading-relaxed bg-white">
                  <span className="font-bold text-slate-800">任务说明：</span>{tsk.description}
                </div>

                {/* 交付物管理与多选验收区 */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-slate-100 bg-white"
                    >
                      <div className="p-6 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                          <div>
                            <h4 className="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                              <Inbox className="w-4 h-4 text-slate-500" />
                              <span>开发者交付包清单 ({submissions.length})</span>
                            </h4>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                              下方列出所有开发者上传的阶段或终版文件。您可以勾选一个或多个进行批量验收通过或退回。
                            </p>
                          </div>

                          {/* 顶栏批量选择状态 */}
                          {submissions.filter(s => s.status === '待验收').length > 0 && (
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleSelectAllSubmissionsOfTask(tsk.id, submissions)}
                                className="text-[11px] text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer"
                              >
                                {submissions.filter(s => s.status === '待验收').every(id => selectedSubmissionIds.includes(id.id)) 
                                  ? '取消全选' 
                                  : '全选待验收'}
                              </button>
                            </div>
                          )}
                        </div>

                        {submissions.length === 0 ? (
                          <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                              <FileText className="w-6 h-6" />
                            </div>
                            <p className="text-xs text-slate-400 font-bold">暂无任何开发者提交的交付成果</p>
                            <p className="text-[10px] text-slate-300 max-w-xs">当有竞标成功的开发者上传了代码、文档或成果时，您将在此处收到通知并进行审核。</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {submissions.map((sub) => {
                              const isSelected = selectedSubmissionIds.includes(sub.id);
                              const isPending = sub.status === '待验收';

                              return (
                                <div 
                                  key={sub.id} 
                                  className={`p-4 rounded-xl border transition-all duration-200 flex flex-col lg:flex-row gap-4 items-start ${
                                    isSelected 
                                      ? 'border-indigo-600 bg-indigo-50/20 shadow-2xs' 
                                      : 'border-slate-100 hover:border-slate-200 bg-slate-50/30'
                                  }`}
                                >
                                  {/* 1. 复选框 */}
                                  {isPending ? (
                                    <button
                                      onClick={() => handleToggleSelectSubmission(sub.id)}
                                      className={`mt-1.5 shrink-0 w-4 h-4 rounded border flex items-center justify-center transition cursor-pointer ${
                                        isSelected 
                                          ? 'bg-indigo-600 border-indigo-600 text-white' 
                                          : 'border-slate-300 bg-white hover:border-indigo-400'
                                      }`}
                                    >
                                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                    </button>
                                  ) : (
                                    <div className="mt-1.5 shrink-0 w-4 h-4 rounded bg-slate-100 flex items-center justify-center text-slate-300 border border-slate-200">
                                      <Check className="w-3 h-3" />
                                    </div>
                                  )}

                                  {/* 2. 开发者简要卡片 */}
                                  <div className="flex items-center gap-3 shrink-0 min-w-[200px]">
                                    <img 
                                      src={sub.developerAvatar} 
                                      alt={sub.developerName} 
                                      className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100" 
                                    />
                                    <div>
                                      <p className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                                        <span>{sub.developerName}</span>
                                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-600 font-bold">
                                          Dev
                                        </span>
                                      </p>
                                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{sub.developerTitle}</p>
                                    </div>
                                  </div>

                                  {/* 3. 交付文件及描述说明 */}
                                  <div className="flex-1 space-y-2">
                                    <div className="flex flex-wrap items-center gap-3">
                                      <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                                        <FileCode className="w-4 h-4 text-indigo-500 shrink-0" />
                                        <span className="underline decoration-indigo-200 cursor-pointer hover:text-indigo-600">
                                          {sub.fileName}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium">({sub.fileSize})</span>
                                      </div>
                                      
                                      <span className="text-[10px] text-slate-300">|</span>
                                      <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>提交于 {sub.submitTime}</span>
                                      </span>
                                    </div>

                                    <div className="p-3 rounded-lg bg-white border border-slate-100 text-xs text-slate-600 leading-relaxed font-medium">
                                      <span className="font-bold text-slate-700 block mb-0.5 text-[10px] uppercase tracking-wider">交付版本说明</span>
                                      {sub.memo}
                                    </div>
                                  </div>

                                  {/* 4. 单项状态及下载 */}
                                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4 shrink-0 w-full lg:w-auto">
                                    <div className="flex items-center gap-2">
                                      {sub.status === '待验收' && (
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                                          待验收
                                        </span>
                                      )}
                                      {sub.status === '已通过验收' && (
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                                          <Check className="w-3 h-3 stroke-[2.5]" />
                                          <span>已通过验收</span>
                                        </span>
                                      )}
                                      {sub.status === '未通过' && (
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100 flex items-center gap-1">
                                          <X className="w-3 h-3" />
                                          <span>已驳回</span>
                                        </span>
                                      )}
                                    </div>

                                    <button 
                                      onClick={() => showToast(`正在下载成果文件《${sub.fileName}》...`)}
                                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition cursor-pointer"
                                      title="下载交付物"
                                    >
                                      <Download className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* 下底大盘：批量操作控制栏 */}
                        {submissions.filter(s => s.status === '待验收').length > 0 && (
                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                              <span>已选中</span>
                              <strong className="text-indigo-600 text-sm">
                                {submissions.filter(s => s.status === '待验收' && selectedSubmissionIds.includes(s.id)).length}
                              </strong>
                              <span>项待验收的交付成果</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleBatchAcceptSubmissions(tsk.id, false)}
                                className="px-4 py-2 rounded-lg bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-700 text-xs font-bold transition cursor-pointer"
                              >
                                驳回修改
                              </button>
                              <button
                                onClick={() => handleBatchAcceptSubmissions(tsk.id, true)}
                                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>一键通过验收并打款</span>
                              </button>
                            </div>
                          </div>
                        )}

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: 我承接的任务 (递交交付成果) */}
      {activeTab === 'undertaken' && (
        <div className="space-y-6">
          {undertakenTasks.map((task) => {
            const isUploadingThis = uploadingTaskId === task.id;

            return (
              <div 
                key={task.id} 
                className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden transition-all duration-200 hover:border-slate-300/80 hover:shadow-xs"
              >
                {/* 任务头部摘要 */}
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 border-b border-slate-100">
                  <div className="space-y-1.5">
                    <div className="flex items-center flex-wrap gap-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-100/50">
                        承接中
                      </span>
                      <h3 className="text-sm font-black text-slate-900 tracking-tight">
                        {task.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                      <div className="flex items-center gap-1">
                        <img src={task.publisherAvatar} alt={task.publisher} className="w-4.5 h-4.5 rounded-full object-cover" />
                        <span className="font-bold text-slate-500">{task.publisher}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 shrink-0">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold">托管总赏金</p>
                      <p className="text-base font-black text-amber-600 mt-0.5">
                        {task.bountyUnit}{task.bounty.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      {task.status === '进行中' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                          进行中
                        </span>
                      )}
                      {task.status === '等待验收' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 animate-pulse">
                          等待验收中
                        </span>
                      )}
                      {task.status === '已完成' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          已完成结项
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 任务说明 */}
                <div className="p-6 text-xs text-slate-600 font-medium leading-relaxed border-b border-slate-100">
                  <span className="font-bold text-slate-800">承接详情：</span>{task.description}
                </div>

                {/* 双栏排版：左侧提交历史，右侧极简上传卡 */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 division-x divide-slate-100 bg-white">
                  
                  {/* 左栏：我的交付历史列表 (40%) */}
                  <div className="lg:col-span-5 p-6 space-y-4">
                    <h4 className="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                      <FileText className="w-4.5 h-4.5 text-slate-500" />
                      <span>已提交交付文件 ({task.deliverables.length})</span>
                    </h4>

                    {task.deliverables.length === 0 ? (
                      <div className="h-[230px] border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center p-6 space-y-2 bg-slate-50/20">
                        <Inbox className="w-8 h-8 text-slate-300" />
                        <p className="text-[11px] text-slate-400 font-bold">尚未递交任何交付物</p>
                        <p className="text-[10px] text-slate-300 max-w-[200px]">开发完毕后，请在右侧输入框中填写并模拟递交您的产出文件，开始申请验收打款。</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        {task.deliverables.map((del) => (
                          <div 
                            key={del.id} 
                            className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2 hover:border-slate-200 transition"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-black text-slate-800 truncate">
                                {del.name}
                              </span>
                              
                              {del.status === '待审核' && (
                                <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-100 shrink-0">
                                  待审核
                                </span>
                              )}
                              {del.status === '已通过' && (
                                <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
                                  审核通过
                                </span>
                              )}
                              {del.status === '已驳回' && (
                                <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-100 shrink-0">
                                  已退回
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                              <span>大小：{del.size}</span>
                              <span>递交时间：{del.uploadTime}</span>
                            </div>

                            {del.memo && (
                              <p className="text-[10px] text-slate-500 bg-white p-2 rounded border border-slate-100/50 leading-relaxed italic">
                                “{del.memo}”
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 右栏：极简快速上传框 (60%) */}
                  <div className="lg:col-span-7 p-6 border-l border-slate-100 bg-slate-50/30 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                          <Upload className="w-4.5 h-4.5 text-indigo-500" />
                          <span>在线递交最新成果</span>
                        </h4>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 font-medium">快捷预设:</span>
                          <button
                            onClick={() => handleFillTemplateFile(task.id, 'workflow_configuration_final.json')}
                            className="text-[10px] bg-white border border-slate-200 hover:border-indigo-400 text-slate-600 hover:text-indigo-600 px-2 py-0.5 rounded font-extrabold transition cursor-pointer"
                          >
                            智能流配置
                          </button>
                          <button
                            onClick={() => handleFillTemplateFile(task.id, 'agent_rag_package_v1.0.tar')}
                            className="text-[10px] bg-white border border-slate-200 hover:border-indigo-400 text-slate-600 hover:text-indigo-600 px-2 py-0.5 rounded font-extrabold transition cursor-pointer"
                          >
                            Agent打包
                          </button>
                        </div>
                      </div>

                      {/* 交付成果文件名 */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                          成果文件名称 / 压缩包代码结构
                        </label>
                        <input 
                          type="text"
                          value={uploadForm[task.id]?.fileName || ''}
                          onChange={(e) => handleFormChange(task.id, 'fileName', e.target.value)}
                          placeholder="例如: raw_rag_workflow_v1.0.zip"
                          className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 font-medium transition"
                          disabled={isUploadingThis}
                        />
                      </div>

                      {/* 交付简要说明 */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                          交付版本说明（如更新日志、运行指令等）
                        </label>
                        <textarea 
                          rows={3}
                          value={uploadForm[task.id]?.memo || ''}
                          onChange={(e) => handleFormChange(task.id, 'memo', e.target.value)}
                          placeholder="选填。请在此说明本版本的开发内容及通过验收的关键验证点..."
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 font-medium transition resize-none leading-relaxed"
                          disabled={isUploadingThis}
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      {/* 上传进度条 */}
                      <div className="flex-1 min-w-[200px]">
                        {isUploadingThis ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[10px] font-bold text-indigo-600">
                              <span className="flex items-center gap-1.5">
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                正在压缩构建并上传...
                              </span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-indigo-600 rounded-full" 
                                initial={{ width: '0%' }}
                                animate={{ width: `${uploadProgress}%` }}
                                transition={{ ease: 'linear' }}
                              />
                            </div>
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                            注：提交交付物后，任务状态将变更为“等待验收中”。发布方审查通过后，托管资金将即时结算解锁。
                          </p>
                        )}
                      </div>

                      {/* 上传提交动作 */}
                      <button
                        onClick={() => handleStartUpload(task.id)}
                        disabled={isUploadingThis}
                        className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition shadow-2xs flex items-center gap-2 cursor-pointer shrink-0 ${
                          isUploadingThis
                            ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                      >
                        <FileUp className="w-4 h-4" />
                        <span>开始上传并申请验收</span>
                      </button>

                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
