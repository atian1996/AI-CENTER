import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AgentItem, AppType, DatasetApplication, DatasetItem, SkillPluginItem } from '../../types';
import { mockDatasetApplications } from '../../data/mockData';
import { AppOrchestrationView } from '../orchestration/AppOrchestrationView';
import { DatasetDetail } from '../marketplace/DatasetDetail';
import { SkillDetail } from '../marketplace/SkillDetail';
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
  FolderOpen
} from 'lucide-react';

export const WorkspaceAssets: React.FC = () => {
  const { 
    userAgents, 
    datasets, 
    skills, 
    favorites, 
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

  // Dataset Sub-tab: 我创建的 vs 我挂载/订阅的
  const [datasetScopeTab, setDatasetScopeTab] = useState<'created' | 'mounted'>('created');
  const [activeDatasetDetail, setActiveDatasetDetail] = useState<DatasetItem | null>(null);
  const [activeSkillDetail, setActiveSkillDetail] = useState<SkillPluginItem | null>(null);

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
  const [showApplyModal, setShowApplyModal] = useState(false);

  const handleApprove = (id: string, pass: boolean) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: pass ? '已通过' : '已驳回' } : a));
    showToast(pass ? '已通过数据集使用申请！' : '已驳回该申请');
  };

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

  // Filtered lists for 数据集: 我创建的 vs 我挂载的
  const createdDatasets = datasets.filter(d => d.isCreatedByMe || d.author === 'zj' || d.id === 'ds_powerbi_retail');
  const mountedDatasets = datasets.filter(d => d.isMounted || d.isFavorite || !d.isCreatedByMe);
  const currentDisplayDatasets = datasetScopeTab === 'created' ? createdDatasets : mountedDatasets;

  const currentDisplayAgents = (agentScopeTab === 'created' ? createdAgents : subscribedAgents).filter(ag => {
    // Type filter
    if (selectedTypeFilter !== 'all') {
      const form = ag.appType || ag.techForm || '';
      if (selectedTypeFilter === '工作流' && !form.includes('工作流') && !form.includes('Workflow')) return false;
      if (selectedTypeFilter === 'Chatflow' && !form.includes('Chatflow')) return false;
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
    const form = ag.appType || ag.techForm || '工作流';
    if (form === '工作流' || form === 'Workflow') {
      return (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center ring-2 ring-white text-[9px] shadow-xs">
          <GitFork className="w-2.5 h-2.5" />
        </div>
      );
    }
    if (form === 'Chatflow') {
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
              onClick={() => showToast('上传数据集功能已拉起，选择 CSV/Parquet/JSONL 文件')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>上传数据集</span>
            </button>
          )}

          {activeAssetTab === 'skills' && (
            <button
              onClick={() => showToast('上传 Skill 插件功能已拉起')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>上传 Skill</span>
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
                      { key: 'Chatflow', label: 'Chatflow' },
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
          
          {/* Sub-level Tabs: 我创建的 / 我挂载的 */}
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
                <span>我创建的</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  datasetScopeTab === 'created' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                }`}>
                  {createdDatasets.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDatasetScopeTab('mounted')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  datasetScopeTab === 'mounted'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>我挂载/收藏的</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  datasetScopeTab === 'mounted' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                }`}>
                  {mountedDatasets.length}
                </span>
              </button>
            </div>

            <div className="text-xs text-slate-400 font-medium">
              共管理 <span className="font-bold text-slate-700">{currentDisplayDatasets.length}</span> 个数据集资产
            </div>
          </div>

          {/* Dataset Application Approval Banner */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-900">数据集使用申请待处理</h4>
                <p className="text-[11px] text-amber-800/80 font-medium">有 1 位开发者申请授权使用您的私有企业级数据集</p>
              </div>
            </div>
            <button
              onClick={() => setShowApplyModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-extrabold transition cursor-pointer shadow-2xs"
            >
              查看审批 ({applications.filter(a => a.status === '待审批').length})
            </button>
          </div>

          {/* Dataset Table Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200">
                <tr>
                  <th className="p-4">数据集名称与仓库</th>
                  <th className="p-4">模态 / 任务类型</th>
                  <th className="p-4">数据规模 / 格式</th>
                  <th className="p-4">容器挂载路径</th>
                  <th className="p-4">开源协议</th>
                  <th className="p-4">状态</th>
                  <th className="p-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {currentDisplayDatasets.map((ds) => (
                  <tr 
                    key={ds.id} 
                    onClick={() => setActiveDatasetDetail(ds)}
                    className="hover:bg-blue-50/40 transition cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="font-extrabold text-slate-900 hover:text-blue-600 transition flex items-center gap-2">
                        <span>{ds.name}</span>
                        {ds.isCreatedByMe && (
                          <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                            我创建
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {ds.repoPath || `${ds.author}/${ds.id}`} • 更新于 {ds.updatedAt}
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                        {ds.modalityCategory || '表格'}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {ds.taskType || '表格回归'}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-mono font-bold text-slate-800">
                        {ds.fileSize || ds.scale || '267.5 MB'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {ds.fileFormats || ds.format || 'CSV'} • {ds.filesCount || (ds.files?.length ?? 1)} 个文件
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-700 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200/60 max-w-[210px]">
                        <span className="truncate">{ds.mountPath || `/home/mw/input/${ds.id}`}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(ds.mountPath || `/home/mw/input/${ds.id}`);
                            showToast(`已复制挂载路径: ${ds.mountPath || '/home/mw/input/' + ds.id}`);
                          }}
                          className="text-blue-600 hover:text-blue-700 p-0.5"
                          title="复制路径"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    <td className="p-4 text-slate-500 font-medium">
                      {ds.license || 'CC-BY-4.0'}
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        ds.isMounted
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {ds.isMounted ? '已挂载' : '已就绪'}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDatasetDetail(ds);
                        }}
                        className="text-blue-600 hover:text-blue-700 font-extrabold cursor-pointer"
                      >
                        详情/预览
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const snippet = `import pandas as pd\ndf = pd.read_csv("${ds.mountPath || '/home/mw/input/' + ds.id}/订单表.csv")\nprint(df.head())`;
                          navigator.clipboard.writeText(snippet);
                          showToast('已复制 Python Pandas 读取代码！');
                        }}
                        className="text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
                      >
                        读取代码
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast(`已下载 ${ds.name} 压缩包`);
                        }}
                        className="text-emerald-600 hover:text-emerald-700 font-extrabold cursor-pointer"
                      >
                        下载
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* 3. SubTab: 我的 Skill */}
      {activeAssetTab === 'skills' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((sk) => (
            <div 
              key={sk.id} 
              onClick={() => setActiveSkillDetail(sk)}
              className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition space-y-3 flex flex-col justify-between cursor-pointer group hover:border-purple-300"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center font-bold text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                    已上架
                  </span>
                </div>
                <h3 className="text-xs font-black text-slate-900 group-hover:text-purple-600 transition">{sk.name}</h3>
                <p className="text-[11px] text-slate-500 font-medium line-clamp-2 mt-1">{sk.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="text-[11px] text-slate-400 font-medium">兼容: {sk.compatibleAgents}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">安装量: <strong className="text-purple-600">{sk.installs.toLocaleString()}</strong></span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast(`已开始下载【${sk.name}】源码包`);
                      }}
                      className="text-purple-600 hover:text-purple-700 font-extrabold cursor-pointer"
                    >
                      下载
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSkillDetail(sk);
                      }}
                      className="text-slate-700 hover:text-purple-600 font-extrabold cursor-pointer"
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
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

      {/* Dataset Approval Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>数据集使用申请审批</span>
              </h3>
              <button 
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                关闭
              </button>
            </div>

            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={app.applicantAvatar} alt={app.applicantName} className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-xs font-extrabold text-slate-900">{app.applicantName}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{app.applyTime}</span>
                  </div>

                  <div className="text-xs text-slate-700 font-medium bg-white p-2.5 rounded-xl border border-slate-100">
                    <strong className="text-slate-900">用途说明:</strong> {app.purpose}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-indigo-600 font-bold">{app.datasetName}</span>
                    {app.status === '待审批' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(app.id, true)}
                          className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition cursor-pointer"
                        >
                          批准授权
                        </button>
                        <button
                          onClick={() => handleApprove(app.id, false)}
                          className="px-3 py-1 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold transition cursor-pointer"
                        >
                          驳回
                        </button>
                      </div>
                    ) : (
                      <span className={`text-xs font-bold ${app.status === '已通过' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {app.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
