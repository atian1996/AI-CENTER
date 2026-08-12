import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Send, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Paperclip, 
  Upload, 
  Plus, 
  User, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Download,
  Image as ImageIcon
} from 'lucide-react';
import { TaskCollaborationMessage } from '../../types';
import { mockCollaborationMessages } from '../../data/mockData';

export const WorkspaceTasks: React.FC = () => {
  const { tasks, showToast, openModal } = useApp();

  const [activeTab, setActiveTab] = useState<'published' | 'undertaken'>('published');
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [collabMessages, setCollabMessages] = useState<TaskCollaborationMessage[]>(mockCollaborationMessages);
  const [inputText, setInputText] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Send collab message
  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg: TaskCollaborationMessage = {
      id: `msg_${Date.now()}`,
      senderName: '极客小千 (你)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      isSelf: true,
      content: inputText,
      time: '刚刚'
    };
    setCollabMessages([...collabMessages, newMsg]);
    setInputText('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>我的任务</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-50 text-purple-700">
              协同中心
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            管理您发布与承接的大模型悬赏、招标与开发任务，支持团队实时在线协作与版本交付
          </p>
        </div>

        <button
          onClick={() => openModal('publishTask')}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>发布悬赏任务</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-extrabold">
        <button
          onClick={() => setActiveTab('published')}
          className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'published'
              ? 'border-indigo-600 text-indigo-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>我发布的 ({tasks.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('undertaken')}
          className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'undertaken'
              ? 'border-indigo-600 text-indigo-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>我承接的 (2)</span>
        </button>
      </div>

      {/* Published Tasks */}
      {activeTab === 'published' && (
        <div className="space-y-4">
          {tasks.map((tsk) => (
            <div key={tsk.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-purple-100 text-purple-800">
                    {tsk.type}
                  </span>
                  <h3 className="text-sm font-black text-slate-900">{tsk.title}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-black text-amber-600">
                    {tsk.bountyUnit}{tsk.bounty.toLocaleString()}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                    {tsk.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 font-medium line-clamp-2">
                {tsk.description}
              </p>

              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-4">
                  <span>发布时间: {tsk.publishTime}</span>
                  <span>竞标参与: <strong className="text-indigo-600">{tsk.bidCount}</strong> 人</span>
                  <span>截止时间: {tsk.deadline}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold transition cursor-pointer"
                  >
                    验收交付物
                  </button>
                  <button
                    onClick={() => setShowCollabModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold transition flex items-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>进入协作空间</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Undertaken Tasks */}
      {activeTab === 'undertaken' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-indigo-100 text-indigo-800">
                  【承接】招标任务
                </span>
                <h3 className="text-sm font-black text-slate-900">
                  定制基于 Qwen2.5 的律所合同审查 Agent 与 RAG 向量库
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-base font-black text-amber-600">¥8,000</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  进行中
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              发布方：北京天元律师事务所 • 交付需求：需识别劳动合同中隐藏提示，输出红线标注报告。
            </p>

            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
              <span>状态: 阶段二模型微调中 (已完成 75%)</span>
              <button
                onClick={() => setShowCollabModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold transition flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>进入任务协作空间</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Collaboration Space Modal */}
      {showCollabModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-4 px-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-black flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>任务协作空间：基于 Qwen2.5 的律所合同审查 Agent</span>
                </h3>
                <p className="text-[11px] text-slate-300">甲方：北京天元律师事务所 • 乙方：极客小千 (你)</p>
              </div>
              <button 
                onClick={() => setShowCollabModal(false)}
                className="text-slate-400 hover:text-white font-bold text-xs cursor-pointer"
              >
                关闭
              </button>
            </div>

            {/* Checkpoint Milestones Progress */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 px-6 flex items-center justify-between text-xs font-extrabold">
              {[
                { step: '1', name: '需求确认', done: true },
                { step: '2', name: '开发与检索引擎搭建', done: true },
                { step: '3', name: '测试调优 (进行中)', current: true },
                { step: '4', name: '交付验收', done: false },
              ].map((m, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black ${
                    m.done ? 'bg-emerald-500 text-white' : m.current ? 'bg-indigo-600 text-white ring-2 ring-indigo-200' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {m.step}
                  </span>
                  <span className={m.current ? 'text-indigo-600 font-black' : m.done ? 'text-slate-800' : 'text-slate-400'}>
                    {m.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Main Chat & File Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
              {collabMessages.map((m) => (
                <div key={m.id} className={`flex gap-3 max-w-2xl ${m.isSelf ? 'ml-auto flex-row-reverse' : ''}`}>
                  <img src={m.senderAvatar} alt={m.senderName} className="w-8 h-8 rounded-full object-cover shrink-0" />
                  <div className={`space-y-1 ${m.isSelf ? 'text-right' : ''}`}>
                    <div className="text-[10px] text-slate-400 font-bold flex items-center gap-2">
                      <span>{m.senderName}</span>
                      <span>{m.time}</span>
                    </div>

                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-medium inline-block text-left ${
                      m.isSelf ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-2xs'
                    }`}>
                      {m.content}

                      {m.attachmentName && (
                        <div className="mt-2.5 p-2 bg-indigo-700/50 rounded-xl border border-indigo-400/30 flex items-center gap-2 text-[11px]">
                          <Paperclip className="w-4 h-4 text-indigo-200" />
                          <div className="flex-1 truncate">
                            <div className="font-bold">{m.attachmentName}</div>
                            <div className="text-[9px] text-indigo-200">{m.attachmentSize} • {m.versionTag}</div>
                          </div>
                          <Download className="w-3.5 h-3.5 text-indigo-200 hover:text-white cursor-pointer" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
              <button 
                onClick={() => showToast('上传附件/交付物')}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                title="上传交付物/图表"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="发送沟通消息，或上传新版本交付物..."
                className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-indigo-600 font-medium"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>发送</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Deliverable Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-up">
            <h3 className="text-sm font-black text-slate-900">验收任务交付物</h3>
            <p className="text-xs text-slate-500 font-medium">
              交付文件：<strong className="text-slate-800">律所合同审查 Agent 配置文件 (v1.0.zip)</strong>
            </p>
            <div className="p-3 rounded-2xl bg-slate-50 text-xs text-slate-700 font-medium border border-slate-100">
              包含完整 Qwen2.5 RAG 权重配置文件、民商法数据集索引与 API 测试用例。
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  showToast('已确认验收通过！资金托管已解冻并打入承接者账户。');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition cursor-pointer"
              >
                确认验收通过并打款
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
