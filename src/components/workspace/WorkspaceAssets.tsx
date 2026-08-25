import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { useApp } from '../../context/AppContext';
import { AgentItem, AppType, DatasetApplication, DatasetItem, SkillPluginItem } from '../../types';
import { mockDatasetApplications } from '../../data/mockData';
import { AppOrchestrationView } from '../orchestration/AppOrchestrationView';
import { DatasetDetail } from '../marketplace/DatasetDetail';
import { SkillDetail } from '../marketplace/SkillDetail';
import { UserDatasetUploadForm } from '../marketplace/UserDatasetUploadForm';
import { UserSkillCreateForm } from '../marketplace/UserSkillCreateForm';
import { 
  Bot, 
  Database, 
  Wrench, 
  Bookmark, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Edit3, 
  Trash2, 
  Key, 
  BarChart2, 
  Download, 
  UserCheck, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  ChevronDown,
  Globe,
  Tag,
  Code2,
  GitFork,
  MessageSquareShare,
  Sparkles,
  FileText,
  UploadCloud,
  FileCode,
  HardDrive,
  Copy,
  Check,
  Layers,
  FolderOpen,
  X,
  FileSpreadsheet
} from 'lucide-react';

// 只读 Skill 详情弹窗组件
const SkillReadOnlyModal: React.FC<{
  skill: SkillPluginItem;
  onClose: () => void;
  onDownload: (sk: SkillPluginItem) => void;
}> = ({ skill, onClose, onDownload }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-bold shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-purple-100 text-purple-700">Skill 详情 (只读)</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                  skill.status === '已上架'
                    ? 'bg-emerald-100 text-emerald-800'
                    : skill.status === '待审核'
                    ? 'bg-amber-100 text-amber-800'
                    : skill.status === '已驳回'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {skill.status || '未上架'}
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 mt-0.5">{skill.name}</h3>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-slate-400 font-bold block mb-1">Slug 唯一标识</span>
              <span className="font-mono font-bold text-slate-800">{skill.repoPath || skill.id}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block mb-1">场景分类</span>
              <span className="font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                {skill.category || '效率工具'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block mb-1">创建时间</span>
              <span className="text-slate-700 font-medium">{skill.updatedAt || '刚刚'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block mb-1">资源包大小</span>
              <span className="font-mono text-slate-700">{skill.packageSize || '1.8 MB'}</span>
            </div>
          </div>

          <div>
            <h4 className="font-black text-slate-900 mb-1.5">插件功能描述</h4>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed">
              {skill.description || '暂无详细描述'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <span className="text-slate-400 text-[11px]">只读展示模式，无法直接编辑修改</span>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition">
              关闭
            </button>
            <button 
              onClick={() => {
                onDownload(skill);
                onClose();
              }} 
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition"
            >
              <Download className="w-4 h-4" />
              <span>下载源码包</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// 只读 Dataset 详情弹窗组件
const DatasetReadOnlyModal: React.FC<{
  dataset: DatasetItem;
  onClose: () => void;
  onDownload?: (ds: DatasetItem) => void;
}> = ({ dataset, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl">
        <DatasetDetail dataset={dataset} onBack={onClose} />
      </div>
    </div>
  );
};

// Skill 修改弹窗 (已驳回状态下编辑并重新提交)
const SkillEditModal: React.FC<{
  skill: SkillPluginItem;
  onClose: () => void;
  onSave: (updates: Partial<SkillPluginItem>) => void;
}> = ({ skill, onClose, onSave }) => {
  const [name, setName] = useState(skill.name);
  const [slug, setSlug] = useState(skill.repoPath ? skill.repoPath.split('/')[1] || skill.id : skill.id);
  const [category, setCategory] = useState(skill.category || '效率工具');
  const [description, setDescription] = useState(skill.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      id: slug.trim(),
      repoPath: `@user/${slug.trim()}`,
      category,
      description: description.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-purple-600" />
            <span>修改 Skill 插件 (重新提交审核)</span>
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {skill.auditReason && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs">
            <div className="font-bold mb-0.5">上次驳回原因:</div>
            <div>{skill.auditReason}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Skill 名称 *</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-bold focus:border-purple-500 outline-hidden" 
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Slug *</label>
            <input 
              type="text" 
              value={slug} 
              onChange={e => setSlug(e.target.value)} 
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono focus:border-purple-500 outline-hidden" 
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">场景分类</label>
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-bold focus:border-purple-500 outline-hidden"
            >
              {['知识管理', '效率工具', '数据分析', '内容创作', '编程开发', '图像影音', '生活娱乐'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">描述</label>
            <textarea 
              rows={3} 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
              取消
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold shadow-xs cursor-pointer">
              保存并再次提交
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 数据集修改弹窗 (已驳回状态下编辑并重新提交)
const DatasetEditModal: React.FC<{
  dataset: DatasetItem;
  onClose: () => void;
  onSave: (updates: Partial<DatasetItem>) => void;
}> = ({ dataset, onClose, onSave }) => {
  const [name, setName] = useState(dataset.name);
  const [brief, setBrief] = useState(dataset.brief || dataset.description?.slice(0, 50) || '');
  const [description, setDescription] = useState(dataset.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      brief: brief.trim(),
      description: description.trim(),
      status: '待审核',
      auditReason: undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-blue-600" />
            <span>修改数据集信息 (重新提交审核)</span>
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {dataset.auditReason && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs">
            <div className="font-bold mb-0.5">上次驳回原因:</div>
            <div>{dataset.auditReason}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">数据集名称 *</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-bold focus:border-blue-500 outline-hidden" 
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">一句话简介</label>
            <input 
              type="text" 
              value={brief} 
              onChange={e => setBrief(e.target.value)} 
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium focus:border-blue-500 outline-hidden" 
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">详细描述</label>
            <textarea 
              rows={4} 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-hidden resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
              取消
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold shadow-xs cursor-pointer">
              保存并再次提交
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const WorkspaceAssets: React.FC = () => {
  const { 
    userAgents, 
    datasets, 
    skills, 
    favorites, 
    datasetDownloads,
    skillDownloads,
    downloadDataset,
    downloadSkill,
    toggleDatasetStatus,
    updateDataset,
    deleteDataset,
    toggleSkillStatus,
    updateSkill,
    deleteSkill,
    setWorkspaceSubTab, 
    showToast, 
    openModal,
    setSelectedMainTab,
    toggleFavoriteAgent,
    openAgentDetail
  } = useApp();

  const [orchestratingAgent, setOrchestratingAgent] = useState<AgentItem | null>(null);
  const [activeAssetTab, setActiveAssetTab] = useState<'agents' | 'datasets' | 'skills' | 'favorites'>('agents');
  
  // Agent Sub-tab: 我创建的 vs 我订阅的
  const [agentScopeTab, setAgentScopeTab] = useState<'created' | 'subscribed'>('created');

  // Dataset Sub-tab: 我上传的 vs 已下载的
  const [datasetScopeTab, setDatasetScopeTab] = useState<'created' | 'downloaded'>('created');
  
  // Skill Sub-tab: 我创建的 vs 已下载的
  const [skillScopeTab, setSkillScopeTab] = useState<'created' | 'downloaded'>('created');

  const [activeDatasetDetail, setActiveDatasetDetail] = useState<DatasetItem | null>(null);
  const [activeSkillDetail, setActiveSkillDetail] = useState<SkillPluginItem | null>(null);

  // Forms and Modals
  const [isUploadingDataset, setIsUploadingDataset] = useState(false);
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);
  const [readOnlyDatasetModal, setReadOnlyDatasetModal] = useState<DatasetItem | null>(null);
  const [readOnlySkillModal, setReadOnlySkillModal] = useState<SkillPluginItem | null>(null);
  const [editingDataset, setEditingDataset] = useState<DatasetItem | null>(null);
  const [editingSkill, setEditingSkill] = useState<SkillPluginItem | null>(null);

  // Filters for Application List
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent_modified');

  // Filter dropdown toggles
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Dataset applications state
  const [applications, setApplications] = useState<DatasetApplication[]>(mockDatasetApplications);

  // If in dataset upload subpage, render UserDatasetUploadForm
  if (isUploadingDataset) {
    return (
      <UserDatasetUploadForm onBack={() => setIsUploadingDataset(false)} />
    );
  }

  // If in skill create subpage, render UserSkillCreateForm
  if (isCreatingSkill) {
    return (
      <UserSkillCreateForm onBack={() => setIsCreatingSkill(false)} />
    );
  }

  // If in orchestration studio, render full screen orchestration view
  if (orchestratingAgent) {
    return (
      <AppOrchestrationView 
        agent={orchestratingAgent} 
        onBack={() => setOrchestratingAgent(null)} 
      />
    );
  }

  // If in dataset detail view, render full screen DatasetDetail
  if (activeDatasetDetail) {
    return (
      <DatasetDetail 
        dataset={activeDatasetDetail} 
        onBack={() => setActiveDatasetDetail(null)} 
      />
    );
  }

  // If in skill detail view, render full screen SkillDetail
  if (activeSkillDetail) {
    return (
      <SkillDetail 
        skill={activeSkillDetail} 
        onBack={() => setActiveSkillDetail(null)} 
      />
    );
  }

  // Filtered lists for 我创建的 vs 我订阅的
  const createdAgents = userAgents.filter(ag => !ag.isPurchased || ag.isDeveloped || ag.id.startsWith('app_') || ag.id.startsWith('ag_custom'));
  const subscribedAgents = userAgents.filter(ag => ag.isPurchased);

  // Filtered lists for 数据集: 我创建的 (我上传的)
  const createdDatasets = datasets.filter(d => d.isCreatedByMe || d.author === 'zj' || d.id === 'ds_powerbi_retail');
  const mountedDatasets = datasets.filter(d => d.isMounted || d.isFavorite || !d.isCreatedByMe);
  const currentDisplayDatasets = datasetScopeTab === 'created' ? createdDatasets : mountedDatasets;

  const currentDisplayAgents = (agentScopeTab === 'created' ? createdAgents : subscribedAgents).filter(ag => {
    // Type filter
    if (selectedTypeFilter !== 'all') {
      const form = ag.appType || ag.techForm || '';
      if (selectedTypeFilter === '工作流' && !form.includes('工作流') && !form.includes('Workflow')) return false;
      if (selectedTypeFilter === '对话流' && !form.includes('对话流')) return false;
      if (selectedTypeFilter === '聊天助手' && !form.includes('聊天助手') && !form.includes('Chatbot')) return false;
      if (selectedTypeFilter === 'Agent' && !form.includes('Agent')) return false;
      if (selectedTypeFilter === '文本生成应用' && !form.includes('文本生成')) return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = ag.name.toLowerCase().includes(q);
      const matchDesc = ag.description?.toLowerCase().includes(q);
      const matchType = (ag.appType || ag.techForm || '').toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchType) return false;
    }
    return true;
  });

  // Render App Type Badge on Card Icon
  const renderAppTypeIconBadge = (ag: AgentItem) => {
    const form = (ag.appType || ag.techForm || '工作流') as string;
    if (form === '工作流' || form === 'Workflow') {
      return (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center ring-2 ring-white text-[9px] shadow-xs">
          <GitFork className="w-2.5 h-2.5" />
        </div>
      );
    }
    if (form === '对话流') {
      return (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center ring-2 ring-white text-[9px] shadow-xs">
          <MessageSquareShare className="w-2.5 h-2.5" />
        </div>
      );
    }
    if (form === '聊天助手' || form === 'Chatbot') {
      return (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center ring-2 ring-white text-[9px] shadow-xs">
          <Bot className="w-2.5 h-2.5" />
        </div>
      );
    }
    if (form === 'Agent') {
      return (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center ring-2 ring-white text-[9px] shadow-xs">
          <Sparkles className="w-2.5 h-2.5" />
        </div>
      );
    }
    return (
      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-2 ring-white text-[9px] shadow-xs">
        <FileText className="w-2.5 h-2.5" />
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      
      {/* Header & Asset Category Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/80">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>我的资产</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700">
              资产库中心
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            统一管理您创建、编排与授权的 AI 工作流应用、智能体、数据集与开发者资源
          </p>
        </div>

        {/* Global Action Button */}
        <div>
          {activeAssetTab === 'agents' && (
            <button
              onClick={() => openModal('createAgent')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>创建 Agent</span>
            </button>
          )}

          {activeAssetTab === 'datasets' && (
            <button
              onClick={() => setIsUploadingDataset(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>上传数据集</span>
            </button>
          )}

          {activeAssetTab === 'skills' && (
            <button
              onClick={() => setIsCreatingSkill(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>创建 Skill</span>
            </button>
          )}
        </div>
      </div>

      {/* SubTabs bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-extrabold">
        {[
          { key: 'agents', label: '我的 Agent', count: userAgents.length, icon: Bot },
          { key: 'datasets', label: '我的数据集', count: datasets.length, icon: Database },
          { key: 'skills', label: '我的 Skill', count: skills.length, icon: Wrench },
          { key: 'favorites', label: '我的收藏', count: favorites.length, icon: Bookmark },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAssetTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveAssetTab(tab.key as any)}
              className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
                isActive 
                  ? 'border-blue-600 text-blue-600 font-black' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 1. SubTab: 我的 Agent (Application List & Orchestration Entrance) */}
      {activeAssetTab === 'agents' && (
        <div className="space-y-6">
          
          {/* Sub-level Tabs: 我创建的 / 我订阅的 */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setAgentScopeTab('created')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  agentScopeTab === 'created'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>我创建的</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  agentScopeTab === 'created' ? 'bg-blue-50 text-blue-600' : 'bg-slate-200/70 text-slate-500'
                }`}>
                  {createdAgents.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAgentScopeTab('subscribed')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  agentScopeTab === 'subscribed'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>我订阅的</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  agentScopeTab === 'subscribed' ? 'bg-blue-50 text-blue-600' : 'bg-slate-200/70 text-slate-500'
                }`}>
                  {subscribedAgents.length}
                </span>
              </button>
            </div>

            {agentScopeTab === 'subscribed' && (
              <button
                onClick={() => setSelectedMainTab('marketplace')}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>前往 Agent 商店订阅更多 →</span>
              </button>
            )}
          </div>

          {/* Top Filter Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
            
            {/* Left Filter Dropdowns & Search */}
            <div className="flex items-center flex-wrap gap-2 text-xs font-medium text-slate-700">
              
              {/* Filter 1: 类型 ∨ */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setShowTypeDropdown(!showTypeDropdown); setShowTagDropdown(false); setShowSortDropdown(false); }}
                  className={`px-3 py-1.5 rounded-xl border bg-white flex items-center gap-1.5 transition cursor-pointer ${
                    selectedTypeFilter !== 'all' ? 'border-blue-500 text-blue-600 bg-blue-50/40 font-bold' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span>{selectedTypeFilter === 'all' ? '类型' : selectedTypeFilter}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showTypeDropdown && (
                  <div className="absolute left-0 top-10 z-40 w-36 bg-white border border-slate-200 rounded-xl shadow-lg py-1 text-xs animate-fade-in">
                    {[
                      { key: 'all', label: '全部类型' },
                      { key: '工作流', label: '工作流' },
                      { key: '对话流', label: '对话流' },
                      { key: '聊天助手', label: '聊天助手' },
                      { key: 'Agent', label: 'Agent' },
                      { key: '文本生成应用', label: '文本生成应用' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => { setSelectedTypeFilter(item.key); setShowTypeDropdown(false); }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 transition cursor-pointer ${
                          selectedTypeFilter === item.key ? 'text-blue-600 font-black bg-blue-50/50' : 'text-slate-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter 2: 标签 ∨ */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setShowTagDropdown(!showTagDropdown); setShowTypeDropdown(false); setShowSortDropdown(false); }}
                  className={`px-3 py-1.5 rounded-xl border bg-white flex items-center gap-1.5 transition cursor-pointer ${
                    selectedTagFilter !== 'all' ? 'border-blue-500 text-blue-600 bg-blue-50/40 font-bold' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span>{selectedTagFilter === 'all' ? '标签' : selectedTagFilter}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showTagDropdown && (
                  <div className="absolute left-0 top-10 z-40 w-32 bg-white border border-slate-200 rounded-xl shadow-lg py-1 text-xs animate-fade-in">
                    {['全部标签', '生产就绪', '内部测试', 'Demo'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => { setSelectedTagFilter(tag === '全部标签' ? 'all' : tag); setShowTagDropdown(false); }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter 3: 排序方式 最近修改 ∨ */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setShowSortDropdown(!showSortDropdown); setShowTypeDropdown(false); setShowTagDropdown(false); }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white flex items-center gap-1.5 transition cursor-pointer text-slate-700"
                >
                  <span>排序方式 <strong className="text-slate-900">{sortBy === 'recent_modified' ? '最近修改' : sortBy === 'recent_created' ? '最近创建' : '名称'}</strong></span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showSortDropdown && (
                  <div className="absolute left-0 top-10 z-40 w-36 bg-white border border-slate-200 rounded-xl shadow-lg py-1 text-xs animate-fade-in">
                    {[
                      { key: 'recent_modified', label: '最近修改' },
                      { key: 'recent_created', label: '最近创建' },
                      { key: 'name', label: '名称 A-Z' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => { setSortBy(item.key); setShowSortDropdown(false); }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Box */}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={agentScopeTab === 'created' ? '搜索我创建的 Agent' : '搜索我订阅的 Agent'}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-blue-500 rounded-xl text-xs text-slate-800 outline-none transition"
                />
              </div>

            </div>

          </div>

          {/* Application Cards Grid */}
          {currentDisplayAgents.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
              <Bot className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">
                {agentScopeTab === 'created' ? '暂未创建任何 Agent' : '暂未订阅任何 Agent'}
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {agentScopeTab === 'created' 
                  ? '点击页面右上方的“创建 Agent”按钮，即可快速创建专属工作流、智能体与助手应用。' 
                  : '前往 Agent 商店浏览丰富多样的场景化智能体，一键订阅即刻体验！'}
              </p>
              {agentScopeTab === 'subscribed' && (
                <button
                  onClick={() => setSelectedMainTab('marketplace')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  探索 Agent 商店
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {currentDisplayAgents.map((ag) => (
                <div
                  key={ag.id}
                  onClick={() => {
                    if (agentScopeTab === 'created') {
                      setOrchestratingAgent(ag);
                    } else {
                      openAgentDetail(ag);
                    }
                  }}
                  className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group min-h-[145px]"
                  title={agentScopeTab === 'created' ? '点击进入应用编排界面' : '点击打开智能体对话'}
                >
                  
                  <div>
                    {/* Top: Icon + App Name & App Type */}
                    <div className="flex items-start gap-3">
                      
                      {/* App Icon with Sub-Badge */}
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg shrink-0 relative ${ag.iconBgColor || 'bg-rose-100 border-rose-200 text-rose-600'}`}>
                        {ag.avatar || '🤖'}
                        {renderAppTypeIconBadge(ag)}
                      </div>

                      {/* App Name & App Type text */}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-blue-600 transition truncate">
                          {ag.name}
                        </h4>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">
                          {ag.appType || ag.techForm || '工作流'}
                        </div>
                      </div>

                    </div>

                    {/* Middle: Description (if any) */}
                    {ag.description && (
                      <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-2">
                        {ag.description}
                      </p>
                    )}
                  </div>

                  {/* Bottom section */}
                  <div className="space-y-2 pt-2 mt-2 border-t border-slate-50">
                    
                    {/* Tag: + 添加标签 / 订阅计费模式 */}
                    <div className="flex items-center justify-between">
                      {agentScopeTab === 'created' ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast(`为【${ag.name}】添加标签`);
                          }}
                          className="text-[10px] text-slate-400 hover:text-slate-700 px-2 py-0.5 border border-dashed border-slate-200 hover:border-slate-300 rounded-md transition flex items-center gap-1 cursor-pointer"
                        >
                          <Tag className="w-2.5 h-2.5 text-slate-400" />
                          <span>添加标签</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">
                          {ag.priceModel || '已订阅授权'}
                        </span>
                      )}

                      {agentScopeTab === 'subscribed' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openAgentDetail(ag);
                          }}
                          className="text-[10px] font-bold px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition"
                        >
                          立即对话
                        </button>
                      )}
                    </div>

                    {/* Footer: Creator · Edited Date + Globe Icon */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                      <span className="truncate">
                        {ag.author || '极客小千'} · {ag.updatedAt ? `编辑于 ${ag.updatedAt}` : '已就绪'}
                      </span>
                      <Globe className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 shrink-0 ml-1" />
                    </div>

                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* 2. SubTab: 我的数据集 */}
      {activeAssetTab === 'datasets' && (
        <div className="space-y-6">
          
          {/* Sub-level Tabs: 我上传的 / 已下载的数据集 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setDatasetScopeTab('created')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  datasetScopeTab === 'created'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>我上传的</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  datasetScopeTab === 'created' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                }`}>
                  {createdDatasets.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDatasetScopeTab('downloaded')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  datasetScopeTab === 'downloaded'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>已下载的数据集</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  datasetScopeTab === 'downloaded' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                }`}>
                  {datasetDownloads.length}
                </span>
              </button>
            </div>

            <div className="text-xs text-slate-400 font-medium">
              共管理 <span className="font-bold text-slate-700">{createdDatasets.length}</span> 个数据集资产
            </div>
          </div>

          {datasetScopeTab === 'downloaded' ? (
            /* 已下载的数据集 Table */
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
              {datasetDownloads.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  暂无数据集下载记录。您可以在数据集广场浏览并一键极速下载数据包。
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200">
                    <tr>
                      <th className="p-4">数据集名称</th>
                      <th className="p-4">模态</th>
                      <th className="p-4">数据集大小</th>
                      <th className="p-4">创建者</th>
                      <th className="p-4">下载时间</th>
                      <th className="p-4 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {datasetDownloads.map(rec => {
                      const targetDs = datasets.find(d => d.id === rec.datasetId);
                      return (
                        <tr key={rec.id} className="hover:bg-blue-50/30 transition">
                          <td className="p-4 font-bold text-slate-900">{rec.datasetName}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                              {rec.modality || '表格数据'}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-bold text-slate-700">{rec.fileSize || '267.5 MB'}</td>
                          <td className="p-4 text-slate-600 font-medium">{rec.uploaderName || '平台提供'}</td>
                          <td className="p-4 text-slate-400 font-mono">{rec.downloadTime || rec.downloadedAt}</td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                if (targetDs) setReadOnlyDatasetModal(targetDs);
                                else showToast(`查看【${rec.datasetName}】详情`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs cursor-pointer transition"
                            >
                              详情
                            </button>
                            <button
                              onClick={() => {
                                if (targetDs) downloadDataset(targetDs);
                                showToast(`已重新下载数据集【${rec.datasetName}】`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-2xs transition"
                            >
                              再次下载
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            /* 我上传的数据集 Table */
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-4">数据集名称</th>
                    <th className="p-4">模态</th>
                    <th className="p-4">数据集大小</th>
                    <th className="p-4">上传时间</th>
                    <th className="p-4">状态</th>
                    <th className="p-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {createdDatasets.map((ds) => {
                    const isPending = ds.status === '待审核';
                    const isRejected = ds.status === '已驳回';
                    const isListed = ds.status === '已上架';
                    const isUnlisted = !isPending && !isRejected && !isListed; // 未上架/已下架

                    return (
                      <tr key={ds.id} className="hover:bg-blue-50/30 transition">
                        <td className="p-4">
                          <div className="font-extrabold text-slate-900">{ds.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5 max-w-xs truncate">
                            {ds.brief || ds.description?.slice(0, 35) || '暂无描述'}
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                            {ds.modalityCategory || '表格数据'}
                          </span>
                        </td>

                        <td className="p-4 font-mono font-bold text-slate-800">
                          {ds.fileSize || ds.scale || '18.4 MB'}
                        </td>

                        <td className="p-4 text-slate-400 font-mono">
                          {ds.updatedAt || '2025-05-20'}
                        </td>

                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            isListed
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : isPending
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : isRejected
                              ? 'bg-red-100 text-red-700 border border-red-300'
                              : 'bg-slate-100 text-slate-700 border border-slate-300'
                          }`}>
                            {isListed ? '已上架' : isPending ? '待审核' : isRejected ? '已驳回' : '未上架'}
                          </span>
                          {isRejected && ds.auditReason && (
                            <div className="text-[10px] text-red-500 mt-0.5 max-w-xs" title={ds.auditReason}>
                              驳回: {ds.auditReason}
                            </div>
                          )}
                        </td>

                        <td className="p-4 text-right space-x-2">
                          {/* 1. 待审核: 支持【详情】 */}
                          {isPending && (
                            <button
                              onClick={() => setReadOnlyDatasetModal(ds)}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold transition cursor-pointer"
                            >
                              详情
                            </button>
                          )}

                          {/* 2. 已驳回: 支持【修改】和【删除】 */}
                          {isRejected && (
                            <>
                              <button
                                onClick={() => setEditingDataset(ds)}
                                className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition cursor-pointer"
                              >
                                修改
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`确定要删除驳回的数据集【${ds.name}】吗？`)) {
                                    deleteDataset(ds.id);
                                    showToast(`数据集【${ds.name}】已成功删除`);
                                  }
                                }}
                                className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer"
                              >
                                删除
                              </button>
                            </>
                          )}

                          {/* 3. 未上架 / 已上架: 支持【详情】和 【上架/下架】 */}
                          {!isPending && !isRejected && (
                            <>
                              <button
                                onClick={() => setReadOnlyDatasetModal(ds)}
                                className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold transition cursor-pointer"
                              >
                                详情
                              </button>

                              {isListed ? (
                                <button
                                  onClick={() => {
                                    toggleDatasetStatus(ds.id, '已下架');
                                    showToast(`数据集【${ds.name}】已下架`);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold transition cursor-pointer"
                                >
                                  下架
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    toggleDatasetStatus(ds.id, '已上架');
                                    showToast(`数据集【${ds.name}】已成功上架`);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs transition cursor-pointer"
                                >
                                  上架
                                </button>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

      {/* 3. SubTab: 我的 Skill */}
      {activeAssetTab === 'skills' && (
        <div className="space-y-6">
          {/* Sub-level Tabs: 我创建的 / 已下载的 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setSkillScopeTab('created')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  skillScopeTab === 'created'
                    ? 'bg-white text-purple-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>我创建的 Skill</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  skillScopeTab === 'created' ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-600'
                }`}>
                  {skills.filter(s => s.isCreatedByMe || s.uploaderType === 'user').length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSkillScopeTab('downloaded')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  skillScopeTab === 'downloaded'
                    ? 'bg-white text-purple-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>已下载的 Skill</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  skillScopeTab === 'downloaded' ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-600'
                }`}>
                  {skillDownloads.length}
                </span>
              </button>
            </div>

            <div className="text-xs text-slate-400 font-medium">
              管理与调试 Agent 扩展插件工具箱
            </div>
          </div>

          {skillScopeTab === 'downloaded' ? (
            /* 已下载的 Skill Table */
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
              {skillDownloads.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  暂无下载记录。您可以在 Skill 插件集市中浏览并极速下载需要的工具插件。
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Skill 名称</th>
                      <th className="p-4">slug</th>
                      <th className="p-4">场景分类</th>
                      <th className="p-4">上传者</th>
                      <th className="p-4">下载时间</th>
                      <th className="p-4 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {skillDownloads.map(rec => {
                      const targetSk = skills.find(s => s.id === rec.skillId);
                      return (
                        <tr key={rec.id} className="hover:bg-purple-50/30 transition">
                          <td className="p-4 font-bold text-slate-900">{rec.skillName}</td>
                          <td className="p-4 font-mono font-bold text-slate-600">
                            {targetSk?.repoPath || rec.skillId}
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold border border-purple-100">
                              {rec.category || targetSk?.category || '效率工具'}
                            </span>
                          </td>
                          <td className="p-4 text-slate-600 font-medium">
                            {rec.uploaderName || rec.developer || targetSk?.developer || '极客社区'}
                          </td>
                          <td className="p-4 text-slate-400 font-mono">
                            {rec.downloadTime || rec.downloadedAt}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                if (targetSk) setReadOnlySkillModal(targetSk);
                                else showToast(`查看【${rec.skillName}】详情`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs cursor-pointer transition"
                            >
                              详情
                            </button>
                            <button
                              onClick={() => {
                                if (targetSk) downloadSkill(targetSk);
                                showToast(`已重新下载 Skill【${rec.skillName}】`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer shadow-2xs transition"
                            >
                              再次下载
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            /* 我创建的 Skill Table */
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-4">skill名称</th>
                    <th className="p-4">slug</th>
                    <th className="p-4">场景分类</th>
                    <th className="p-4">创建时间</th>
                    <th className="p-4">状态</th>
                    <th className="p-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {skills.map((sk) => {
                    const isPending = sk.status === '待审核';
                    const isRejected = sk.status === '已驳回';
                    const isListed = sk.status === '已上架';
                    const isUnlisted = !isPending && !isRejected && !isListed; // 未上架/已下架

                    const slugVal = sk.repoPath ? sk.repoPath.split('/')[1] || sk.id : sk.id;

                    return (
                      <tr key={sk.id} className="hover:bg-purple-50/30 transition">
                        <td className="p-4 font-extrabold text-slate-900">
                          {sk.name}
                        </td>

                        <td className="p-4 font-mono font-bold text-slate-700">
                          {slugVal}
                        </td>

                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-100">
                            {sk.category || '效率工具'}
                          </span>
                        </td>

                        <td className="p-4 text-slate-400 font-mono">
                          {sk.updatedAt || '2025-05-20'}
                        </td>

                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            isListed
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : isPending
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : isRejected
                              ? 'bg-red-100 text-red-700 border border-red-300'
                              : 'bg-slate-100 text-slate-700 border border-slate-300'
                          }`}>
                            {isListed ? '已上架' : isPending ? '待审核' : isRejected ? '已驳回' : '未上架'}
                          </span>
                          {isRejected && sk.auditReason && (
                            <div className="text-[10px] text-red-500 mt-0.5 max-w-xs" title={sk.auditReason}>
                              驳回: {sk.auditReason}
                            </div>
                          )}
                        </td>

                        <td className="p-4 text-right space-x-2">
                          {/* 1. 待审核: 支持【详情】 */}
                          {isPending && (
                            <button
                              onClick={() => setReadOnlySkillModal(sk)}
                              className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition cursor-pointer"
                            >
                              详情
                            </button>
                          )}

                          {/* 2. 已驳回: 支持【修改】和【删除】，修改后再次提交 */}
                          {isRejected && (
                            <>
                              <button
                                onClick={() => setEditingSkill(sk)}
                                className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition cursor-pointer"
                              >
                                修改
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`确定要删除驳回的 Skill 插件【${sk.name}】吗？`)) {
                                    deleteSkill(sk.id);
                                    showToast(`Skill 插件【${sk.name}】已成功删除`);
                                  }
                                }}
                                className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer"
                              >
                                删除
                              </button>
                            </>
                          )}

                          {/* 3. 未上架 / 已上架: 支持【详情】和 【上架/下架】 */}
                          {!isPending && !isRejected && (
                            <>
                              <button
                                onClick={() => setReadOnlySkillModal(sk)}
                                className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition cursor-pointer"
                              >
                                详情
                              </button>

                              {isListed ? (
                                <button
                                  onClick={() => {
                                    toggleSkillStatus(sk.id, '已下架');
                                    showToast(`Skill【${sk.name}】已成功下架`);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold transition cursor-pointer"
                                >
                                  下架
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    toggleSkillStatus(sk.id, '已上架');
                                    showToast(`Skill【${sk.name}】已成功上架`);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-2xs transition cursor-pointer"
                                >
                                  上架
                                </button>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 4. SubTab: 我的收藏 */}
      {activeAssetTab === 'favorites' && (
        <div className="space-y-3">
          {favorites.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs font-medium">
              您还没有收藏任何 Agent，可以在集市中浏览并点击收藏 ⭐️
            </div>
          ) : (
            favorites.map((ag) => (
              <div key={ag.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl font-bold">
                    {ag.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">{ag.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{ag.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedMainTab('marketplace')}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold transition cursor-pointer"
                  >
                    立即体验
                  </button>
                  <button
                    onClick={() => toggleFavoriteAgent(ag.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition cursor-pointer"
                  >
                    取消收藏
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}



      {/* 只读数据集详情弹窗 */}
      {readOnlyDatasetModal && (
        <DatasetReadOnlyModal
          dataset={readOnlyDatasetModal}
          onClose={() => setReadOnlyDatasetModal(null)}
          onDownload={(ds) => downloadDataset(ds)}
        />
      )}

      {/* 只读 Skill 详情弹窗 */}
      {readOnlySkillModal && (
        <SkillReadOnlyModal
          skill={readOnlySkillModal}
          onClose={() => setReadOnlySkillModal(null)}
          onDownload={(sk) => downloadSkill(sk)}
        />
      )}

      {/* 编辑 Skill (驳回状态下编辑并重新提交) */}
      {editingSkill && (
        <SkillEditModal
          skill={editingSkill}
          onClose={() => setEditingSkill(null)}
          onSave={(updates) => {
            updateSkill(editingSkill.id, {
              ...updates,
              status: '待审核',
              auditReason: undefined
            });
            showToast(`Skill 插件【${updates.name || editingSkill.name}】已修改并重新提交`);
            setEditingSkill(null);
          }}
        />
      )}

      {/* 编辑数据集 (驳回状态下编辑并重新提交) */}
      {editingDataset && (
        <DatasetEditModal
          dataset={editingDataset}
          onClose={() => setEditingDataset(null)}
          onSave={(updates) => {
            updateDataset(editingDataset.id, updates);
            showToast(`数据集【${updates.name || editingDataset.name}】已修改并重新提交`);
            setEditingDataset(null);
          }}
        />
      )}

    </div>
  );
};
