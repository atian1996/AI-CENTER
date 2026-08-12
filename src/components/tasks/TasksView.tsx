import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskItem, TaskType, TaskStatus } from '../../types';
import { 
  Briefcase, 
  Plus, 
  Clock, 
  Coins, 
  Send, 
  FileText, 
  MessageSquare, 
  UploadCloud, 
  Paperclip, 
  X, 
  ShieldAlert, 
  User, 
  CheckCircle2, 
  History
} from 'lucide-react';

export const TasksView: React.FC = () => {
  const { 
    tasks, 
    publishTaskModalOpen, 
    setPublishTaskModalOpen, 
    addTask, 
    showToast 
  } = useApp();

  const [typeFilter, setTypeFilter] = useState<'all' | TaskType>('all');
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [collaborationSpaceOpen, setCollaborationSpaceOpen] = useState(false);

  // Form states for Publish Task
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<TaskType>('悬赏任务');
  const [newBounty, setNewBounty] = useState('5000');
  const [newBountyUnit, setNewBountyUnit] = useState<'¥' | '积分'>('¥');
  const [newSkills, setNewSkills] = useState('Python, Agent Protocol');
  const [newDeadline, setNewDeadline] = useState('2026-09-01');
  const [newDesc, setNewDesc] = useState('');
  const [newDeliverables, setNewDeliverables] = useState('');

  // Bid form state
  const [bidProposal, setBidProposal] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Collaboration Chat
  const [collabMessages, setCollabMessages] = useState([
    { sender: '北京天元律所 (发布者)', text: '您好，我们已看到您提交的竞标方案，请问交付物中是否包含向量检索性能报告？', time: '10:30' },
    { sender: '极客小千 (承接者)', text: '是的！我们使用 Milvus 混合检索，在 10 万级合同文本下 P99 响应延迟低于 120ms。', time: '10:32' }
  ]);
  const [collabInput, setCollabInput] = useState('');

  const filteredTasks = tasks.filter(t => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    return true;
  });

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('请输入任务标题');
      return;
    }
    addTask({
      title: newTitle,
      type: newType,
      bounty: Number(newBounty) || 1000,
      bountyUnit: newBountyUnit,
      publisher: '极客小千 (你)',
      publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      deadline: newDeadline,
      requiredSkills: newSkills.split(',').map(s => s.trim()),
      description: newDesc || '详细需求待进一步沟通。',
      deliverables: newDeliverables || '代码仓库与说明文档。'
    });
    setPublishTaskModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleBidSubmit = () => {
    if (!bidProposal.trim()) {
      showToast('请输入承接方案描述');
      return;
    }
    showToast(` 竞标方案提交成功！发布者将在 24 小时内联系您。`);
    setBidModalOpen(false);
    setBidProposal('');
  };

  const handleCollabSend = () => {
    if (!collabInput.trim()) return;
    setCollabMessages(prev => [...prev, { sender: '极客小千 (我)', text: collabInput, time: '刚刚' }]);
    setCollabInput('');
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-amber-500" />
            任务大厅 - 需求与供给撮合平台
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            发布大模型微调、Agent开发、算法定制任务，获取极客开发力量与高额赏金
          </p>
        </div>

        <button
          onClick={() => setPublishTaskModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>【发布任务】</span>
        </button>
      </div>

      {/* Task Type Filters */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-2 overflow-x-auto">
        {(['all', '悬赏任务', '招标任务', '竞赛任务'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              typeFilter === t
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {t === 'all' ? '全部类型' : t}
          </button>
        ))}
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map(tsk => (
          <div
            key={tsk.id}
            className="group rounded-2xl bg-white border border-slate-200/80 hover:border-amber-300 p-6 shadow-xs hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                  {tsk.type}
                </span>
                <span className="text-lg font-black text-amber-600 font-mono">
                  {tsk.bountyUnit}{tsk.bounty.toLocaleString()}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-2 mb-2">
                {tsk.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                {tsk.description}
              </p>

              {/* Skills required */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {tsk.requiredSkills.map((sk, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="text-slate-500 text-[11px] font-medium flex items-center gap-2">
                <span>{tsk.bidCount} 人竞标</span>
                <span>· 截止: {tsk.deadline}</span>
              </div>

              <button
                onClick={() => setSelectedTask(tsk)}
                className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-1 transition shadow-xs cursor-pointer"
              >
                查看详情 / 竞标
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {selectedTask.type}
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-1">{selectedTask.title}</h2>
              </div>
              <button onClick={() => setSelectedTask(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 font-medium">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <div className="text-slate-500 text-[11px]">任务赏金</div>
                  <div className="text-xl font-black text-amber-600 font-mono mt-0.5">
                    {selectedTask.bountyUnit}{selectedTask.bounty}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">发布者</div>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedTask.publisher}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">截止时间</div>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedTask.deadline}</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">需求说明</h4>
                <p className="leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">{selectedTask.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">交付物与考核要求</h4>
                <p className="leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">{selectedTask.deliverables}</p>
              </div>

              {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1.5">附件资源</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.attachments.map((att, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-indigo-600 font-bold">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>{att}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => setCollaborationSpaceOpen(true)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-cyan-600" />
                  <span>打开临时协作空间</span>
                </button>

                <button
                  onClick={() => setBidModalOpen(true)}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-xs"
                >
                  我要承接 / 提交竞标
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Publish Task Modal */}
      {publishTaskModalOpen && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-500" />
                发布新任务
              </h3>
              <button onClick={() => setPublishTaskModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublishSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="text-slate-800 font-bold mb-1 block">任务标题 *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="例如：【悬赏】微调 Llama3-8B 医疗诊断 Agent"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-800 font-bold mb-1 block">任务类型</label>
                  <select
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white"
                  >
                    <option value="悬赏任务">悬赏任务</option>
                    <option value="招标任务">招标任务</option>
                    <option value="竞赛任务">竞赛任务</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-800 font-bold mb-1 block">赏金金额</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newBounty}
                      onChange={(e) => setNewBounty(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white"
                    />
                    <select
                      value={newBountyUnit}
                      onChange={(e: any) => setNewBountyUnit(e.target.value)}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none shrink-0 focus:bg-white"
                    >
                      <option value="¥">元 (现金)</option>
                      <option value="积分">积分</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-slate-800 font-bold mb-1 block">需求详细描述</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="详细列出需求背景、模型尺寸、期望指标..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPublishTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-xs"
                >
                  确认提交发布
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Bid Modal */}
      {bidModalOpen && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4 text-xs font-medium">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900">提交承接方案</h3>
              <button onClick={() => setBidModalOpen(false)} className="p-1 rounded-lg text-slate-400 bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-slate-800 font-bold mb-1 block">方案与技术能力阐述 *</label>
              <textarea
                rows={4}
                value={bidProposal}
                onChange={(e) => setBidProposal(e.target.value)}
                placeholder="阐述您的技术选型、预计交付耗时、类似项目经验..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="text-slate-800 font-bold mb-1 block">过往作品 / GitHub / Agent 链接</label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://github.com/your-username/repo"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setBidModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
              >
                取消
              </button>
              <button
                onClick={handleBidSubmit}
                className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-xs"
              >
                确认竞标
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Collaboration Space Modal */}
      {collaborationSpaceOpen && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4 text-xs font-medium">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <MessageSquare className="w-4 h-4 text-cyan-600" />
                任务进行中协作空间 (聊天 / 文件 / 交付提交)
              </div>
              <button onClick={() => setCollaborationSpaceOpen(false)} className="p-1 rounded-lg text-slate-400 bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Box */}
            <div className="h-64 bg-slate-50 border border-slate-200 rounded-2xl p-4 overflow-y-auto space-y-3">
              {collabMessages.map((msg, idx) => (
                <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-xs">
                  <div className="flex justify-between text-[10px] text-indigo-600 font-bold">
                    <span>{msg.sender}</span>
                    <span className="text-slate-400 font-mono">{msg.time}</span>
                  </div>
                  <div className="text-slate-800">{msg.text}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={collabInput}
                onChange={(e) => setCollabInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCollabSend()}
                placeholder="发送协作消息..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:bg-white"
              />
              <button
                onClick={handleCollabSend}
                className="px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-xs"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
