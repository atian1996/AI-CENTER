import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SkillPluginItem } from '../../types';
import { SkillDetail } from './SkillDetail';
import {
  Download,
  Search,
  LayoutGrid,
  List,
  ChevronDown,
  Check,
  CheckCircle2,
  KeyRound,
  FileText,
  TrendingUp,
  Sparkles,
  Zap,
  BarChart3,
  BookOpen,
  Code2,
  Palette,
  Briefcase,
  Bot,
  RotateCcw
} from 'lucide-react';

export const SkillMarket: React.FC = () => {
  const { skills, showToast } = useApp();

  // Navigation: Selected Skill for Detail View
  const [selectedSkill, setSelectedSkill] = useState<SkillPluginItem | null>(null);

  // Top Sort Tabs: 'all' | 'downloads' | 'latest'
  const [sortTab, setSortTab] = useState<'all' | 'downloads' | 'latest'>('all');

  // Filters State
  const [selectedSource, setSelectedSource] = useState<string>('所有来源');
  const [selectedCategory, setSelectedCategory] = useState<string>('所有场景分类');
  const [apiKeyFilter, setApiKeyFilter] = useState<'all' | 'required' | 'not_required'>('all');
  const [isApiKeyDropdownOpen, setIsApiKeyDropdownOpen] = useState(false);
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Search & View Mode
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter options
  const sources = ['所有来源', 'SkillHub', '官方认证', '开源社区'];
  const categories = [
    '所有场景分类',
    '知识管理',
    '办公效率',
    '内容创作',
    '设计多媒体',
    '数据分析',
    '开发编程',
    '行业专业',
    'AI Agent'
  ];

  // Helper to format download count (e.g. 223000 -> 22.3 万)
  const formatCount = (num?: number) => {
    if (!num) return '0';
    if (num >= 10000) {
      return (num / 10000).toFixed(1).replace(/\.0$/, '') + ' 万';
    }
    return num.toLocaleString();
  };

  // Helper for brand/icon colors
  const getSkillIcon = (sk: SkillPluginItem) => {
    if (sk.name.includes('股票') || sk.id.includes('valuation')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shadow-xs">
          <div className="w-5 h-5 rounded-full border-4 border-amber-600 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          </div>
        </div>
      );
    }
    if (sk.name.includes('ima') || sk.id.includes('ima')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
          <Sparkles className="w-5 h-5" />
        </div>
      );
    }
    if (sk.name.includes('腾讯文档') || sk.id.includes('tencent_docs')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
          <FileText className="w-5 h-5" />
        </div>
      );
    }
    if (sk.name.includes('腾讯云') || sk.id.includes('cloudbase')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold shadow-xs">
          <Code2 className="w-5 h-5" />
        </div>
      );
    }
    if (sk.name.includes('金融') || sk.category === '数据分析') {
      return (
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
          <BarChart3 className="w-5 h-5" />
        </div>
      );
    }
    if (sk.category === '内容创作') {
      return (
        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
          <Sparkles className="w-5 h-5" />
        </div>
      );
    }
    if (sk.category === '设计多媒体') {
      return (
        <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shadow-xs">
          <Palette className="w-5 h-5" />
        </div>
      );
    }
    if (sk.category === '知识管理') {
      return (
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-xs">
          <BookOpen className="w-5 h-5" />
        </div>
      );
    }
    if (sk.category === 'AI Agent') {
      return (
        <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shadow-xs">
          <Bot className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shadow-xs">
        <Zap className="w-5 h-5 text-indigo-600" />
      </div>
    );
  };

  // Filtered skills
  const filteredSkills = skills.filter(item => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchDev = item.developer.toLowerCase().includes(q);
      const matchRepo = item.repoPath?.toLowerCase().includes(q) ?? false;
      const matchTags = item.tags?.some(t => t.toLowerCase().includes(q)) ?? false;
      if (!matchName && !matchDesc && !matchDev && !matchRepo && !matchTags) {
        return false;
      }
    }

    // 2. Source Filter
    if (selectedSource !== '所有来源') {
      if (selectedSource === '官方认证' && !item.isOfficial) return false;
      if (selectedSource === 'SkillHub' && item.source !== 'SkillHub') return false;
      if (selectedSource === '开源社区' && item.source === 'SkillHub') return false;
    }

    // 3. Category Filter
    if (selectedCategory !== '所有场景分类' && item.category !== selectedCategory) {
      return false;
    }

    // 4. API Key Filter
    if (apiKeyFilter === 'required' && !item.needsApiKey) return false;
    if (apiKeyFilter === 'not_required' && item.needsApiKey) return false;

    return true;
  }).sort((a, b) => {
    if (sortTab === 'downloads') {
      return (b.downloadsCount || b.installs) - (a.downloadsCount || a.installs);
    }
    if (sortTab === 'latest') {
      return (b.updatedAt || '').localeCompare(a.updatedAt || '');
    }
    // 'all' default recommendation
    return (b.downloadsCount || b.installs) - (a.downloadsCount || a.installs);
  });

  // Download Handler (Strictly the only action button on list cards)
  const handleDownloadSkill = (e: React.MouseEvent, item: SkillPluginItem) => {
    e.stopPropagation();
    showToast(`已开始下载 Skill 插件【${item.name}】源码包 (${item.packageSize || '2.8 MB'})`);
  };

  // If a skill is selected, render the Detail View
  if (selectedSkill) {
    return (
      <SkillDetail
        skill={selectedSkill}
        onBack={() => setSelectedSkill(null)}
      />
    );
  }

  return (
    <div className="w-full space-y-5 select-none animate-fade-in pb-16">
      
      {/* 1. Header Toolbar (Exact match to skill列表.png) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-slate-200/80">
        
        {/* Left: Tab Switcher (全部 / 下载量 / 最近最新) */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSortTab('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              sortTab === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setSortTab('downloads')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              sortTab === 'downloads'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            下载量
          </button>
          <button
            onClick={() => setSortTab('latest')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              sortTab === 'latest'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            最近最新
          </button>
        </div>

        {/* Right: Dropdowns, Search & View Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Dropdown 1: 所有来源 */}
          <div className="relative">
            <button
              onClick={() => {
                setIsSourceDropdownOpen(!isSourceDropdownOpen);
                setIsCategoryDropdownOpen(false);
                setIsApiKeyDropdownOpen(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 font-medium hover:border-slate-300 flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>{selectedSource}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isSourceDropdownOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1 text-xs">
                {sources.map(src => (
                  <button
                    key={src}
                    onClick={() => {
                      setSelectedSource(src);
                      setIsSourceDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      selectedSource === src ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{src}</span>
                    {selectedSource === src && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown 2: 所有场景分类 */}
          <div className="relative">
            <button
              onClick={() => {
                setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                setIsSourceDropdownOpen(false);
                setIsApiKeyDropdownOpen(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 font-medium hover:border-slate-300 flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>{selectedCategory}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isCategoryDropdownOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1 text-xs max-h-60 overflow-y-auto">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsCategoryDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      selectedCategory === cat ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown 3: 不限 API Key (With interactive radio menu from screenshot) */}
          <div className="relative">
            <button
              onClick={() => {
                setIsApiKeyDropdownOpen(!isApiKeyDropdownOpen);
                setIsSourceDropdownOpen(false);
                setIsCategoryDropdownOpen(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 font-medium hover:border-slate-300 flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>
                {apiKeyFilter === 'all'
                  ? '不限 API Key'
                  : apiKeyFilter === 'required'
                  ? '需要 API Key'
                  : '无需 API Key'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isApiKeyDropdownOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-1.5 text-xs space-y-0.5">
                <button
                  onClick={() => {
                    setApiKeyFilter('all');
                    setIsApiKeyDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 rounded-lg flex items-center gap-2.5 hover:bg-slate-50 text-slate-700 text-left cursor-pointer"
                >
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    apiKeyFilter === 'all' ? 'border-slate-900' : 'border-slate-300'
                  }`}>
                    {apiKeyFilter === 'all' && <div className="w-2 h-2 rounded-full bg-slate-900" />}
                  </div>
                  <span className={apiKeyFilter === 'all' ? 'font-bold text-slate-900' : ''}>不限 API Key</span>
                </button>

                <button
                  onClick={() => {
                    setApiKeyFilter('required');
                    setIsApiKeyDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 rounded-lg flex items-center gap-2.5 hover:bg-slate-50 text-slate-700 text-left cursor-pointer"
                >
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    apiKeyFilter === 'required' ? 'border-slate-900' : 'border-slate-300'
                  }`}>
                    {apiKeyFilter === 'required' && <div className="w-2 h-2 rounded-full bg-slate-900" />}
                  </div>
                  <span className={apiKeyFilter === 'required' ? 'font-bold text-slate-900' : ''}>需要 API Key</span>
                </button>

                <button
                  onClick={() => {
                    setApiKeyFilter('not_required');
                    setIsApiKeyDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 rounded-lg flex items-center gap-2.5 hover:bg-slate-50 text-slate-700 text-left cursor-pointer"
                >
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    apiKeyFilter === 'not_required' ? 'border-slate-900' : 'border-slate-300'
                  }`}>
                    {apiKeyFilter === 'not_required' && <div className="w-2 h-2 rounded-full bg-slate-900" />}
                  </div>
                  <span className={apiKeyFilter === 'not_required' ? 'font-bold text-slate-900' : ''}>无需 API Key</span>
                </button>
              </div>
            )}
          </div>

          {/* Search Button / Bar */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center gap-1">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="搜索 Skill..."
                    className="w-44 pl-8 pr-6 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:bg-white focus:border-slate-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-2 text-[10px] text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1.5 text-xs text-slate-500 hover:text-slate-800"
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-2xs cursor-pointer"
                title="搜索 Skill"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle: Grid & List */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="列表视图"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="网格视图"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* 2. Skill Card Grid (Strict 3 columns on Desktop, matching screenshot) */}
      {filteredSkills.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-slate-200/80 text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-800">未找到符合条件的 Skill 插件</h3>
          <p className="text-[11px] text-slate-400">尝试清空筛选条件或更换搜索关键词</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSource('所有来源');
              setSelectedCategory('所有场景分类');
              setApiKeyFilter('all');
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 mx-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置筛选</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map(sk => (
            <div
              key={sk.id}
              onClick={() => setSelectedSkill(sk)}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer group space-y-3.5"
            >
              {/* Card Header: Icon, Title, Badges, Category */}
              <div className="space-y-2.5">
                <div className="flex items-start gap-3">
                  {/* Brand Icon */}
                  <div className="shrink-0 group-hover:scale-105 transition-transform">
                    {getSkillIcon(sk)}
                  </div>

                  {/* Title and Category/API Key Badges */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {sk.name}
                      </h3>
                      {sk.isOfficial && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="#3b82f6" stroke="#ffffff" />
                      )}
                    </div>

                    {/* Badge Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                        {sk.category}
                      </span>
                      {sk.needsApiKey && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/70 text-[10px] font-medium flex items-center gap-1">
                          <KeyRound className="w-2.5 h-2.5" />
                          需配置 API Key
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description snippet */}
                <p className="text-xs text-slate-500 leading-relaxed font-normal line-clamp-3 min-h-[48px]">
                  {sk.description}
                </p>
              </div>

              {/* Card Footer: Stars, Downloads, Source and ONLY Download Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                
                {/* Meta stats: Likes/Stars, Downloads, Source */}
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1 text-slate-500">
                    <span className="text-slate-400 text-xs">☆</span>
                    {sk.favoritesCount || sk.likesCount || 0}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Download className="w-3 h-3 text-slate-400" />
                    {formatCount(sk.downloadsCount || sk.installs)}
                  </span>
                  <span className="text-slate-400">
                    {sk.source || 'SkillHub'}
                  </span>
                </div>

                {/* ONLY Download Action Button on Card */}
                <button
                  onClick={e => handleDownloadSkill(e, sk)}
                  className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-indigo-600 text-white text-[11px] font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer shrink-0"
                >
                  <Download className="w-3 h-3" />
                  <span>下载</span>
                </button>

              </div>
            </div>
          ))}
        </div>

      ) : (

        /* List Layout */
        <div className="space-y-2.5">
          {filteredSkills.map(sk => (
            <div
              key={sk.id}
              onClick={() => setSelectedSkill(sk)}
              className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-300 shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="shrink-0 group-hover:scale-105 transition-transform">
                  {getSkillIcon(sk)}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                      {sk.name}
                    </h3>
                    {sk.isOfficial && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="#3b82f6" stroke="#ffffff" />
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                      {sk.category}
                    </span>
                    {sk.needsApiKey && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/70 text-[10px] font-medium flex items-center gap-1">
                        <KeyRound className="w-2.5 h-2.5" />
                        需配置 API Key
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {sk.description}
                  </p>
                </div>
              </div>

              {/* List item right side */}
              <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1 text-slate-500">
                    <span className="text-slate-400 text-xs">☆</span>
                    {sk.favoritesCount || sk.likesCount || 0}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Download className="w-3 h-3 text-slate-400" />
                    {formatCount(sk.downloadsCount || sk.installs)}
                  </span>
                  <span className="text-slate-400">{sk.source || 'SkillHub'}</span>
                </div>

                {/* ONLY Download Action Button on Card */}
                <button
                  onClick={e => handleDownloadSkill(e, sk)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>下载</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      )}

    </div>
  );
};
