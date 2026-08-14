import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { FeedPost, CommunityBoard } from '../../types';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Send, 
  Image as ImageIcon, 
  Sparkles, 
  BookOpen,
  HelpCircle,
  Compass,
  TrendingUp,
  Coffee,
  Plus,
  Search,
  Bookmark,
  X,
  Eye,
  Tag as TagIcon,
  ArrowLeft,
  FileText,
  CheckCircle2
} from 'lucide-react';

interface BoardConfig {
  id: 'all' | CommunityBoard;
  label: string;
  position: string;
  desc: string;
  icon: React.ReactNode;
}

export const CommunityView: React.FC = () => {
  const { posts, createPost, likePost, user, showToast } = useApp();

  // Navigation View Mode: 'feed' | 'publish'
  const [viewMode, setViewMode] = useState<'feed' | 'publish'>('feed');

  // State
  const [activeBoard, setActiveBoard] = useState<'all' | CommunityBoard>('all');
  const [activeFilter, setActiveFilter] = useState<'recommend' | 'latest' | 'following'>('recommend');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Post detail/comment state
  const [expandedPostComments, setExpandedPostComments] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [collectedPosts, setCollectedPosts] = useState<Record<string, boolean>>({});

  // Publishing State
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [newPostBoard, setNewPostBoard] = useState<CommunityBoard>('干货分享');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState<string[]>(['DeepSeek', 'Agent']);
  const [tagInput, setTagInput] = useState('');
  const [selectedPresetImage, setSelectedPresetImage] = useState<string | null>(null);

  // 6 Official Boards Configuration
  const boardConfigs: BoardConfig[] = [
    {
      id: 'all',
      label: '全部板块',
      position: '全站动态',
      desc: '浏览全站 AI 开发者最新实践、经验与问答',
      icon: <Sparkles className="w-4 h-4 text-indigo-600" />
    },
    {
      id: '干货分享',
      label: '干货分享',
      position: '实践经验',
      desc: '技术方案、踩坑总结、工具推荐、代码片段、工作流分享',
      icon: <BookOpen className="w-4 h-4 text-emerald-600" />
    },
    {
      id: '求助答疑',
      label: '求助答疑',
      position: '问题互助',
      desc: '环境报错、模型调优、算法理解、工具使用问题',
      icon: <HelpCircle className="w-4 h-4 text-amber-600" />
    },
    {
      id: '前沿观察',
      label: '前沿观察',
      position: '行业动态',
      desc: '新产品发布、论文解读、技术趋势、行业分析',
      icon: <Compass className="w-4 h-4 text-indigo-600" />
    },
    {
      id: '赚钱交流',
      label: '赚钱交流',
      position: '商业化',
      desc: '接单经验、AI变现路径、副业思路、产品商业化讨论',
      icon: <TrendingUp className="w-4 h-4 text-rose-600" />
    },
    {
      id: '同行交流',
      label: '同行交流',
      position: '人脉连接',
      desc: '找合作、找学习搭子、线下meetup、创业组队',
      icon: <Users className="w-4 h-4 text-cyan-600" />
    },
    {
      id: '娱乐灌水',
      label: '娱乐灌水',
      position: '轻松闲聊',
      desc: 'AI趣事、梗图、日常、非技术闲聊',
      icon: <Coffee className="w-4 h-4 text-purple-600" />
    }
  ];

  // Dynamic Post Count per board
  const boardCounts = useMemo(() => {
    const counts: Record<string, number> = { all: posts.length };
    posts.forEach(p => {
      counts[p.board] = (counts[p.board] || 0) + 1;
    });
    return counts;
  }, [posts]);

  // Filter & Search Logic
  const filteredPosts = useMemo(() => {
    let list = [...posts];

    // Filter by board
    if (activeBoard !== 'all') {
      list = list.filter(p => p.board === activeBoard);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        (p.title && p.title.toLowerCase().includes(q)) ||
        p.content.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // Filter by top tabs
    if (activeFilter === 'recommend') {
      // Sort by popular (likes + views)
      list.sort((a, b) => (b.likesCount + (b.viewsCount || 0)) - (a.likesCount + (a.viewsCount || 0)));
    } else if (activeFilter === 'following') {
      // Simulated filter for liked / bookmarked or top contributors
      list = list.filter(p => p.isLiked || p.likesCount > 150);
    }

    return list;
  }, [posts, activeBoard, searchQuery, activeFilter]);

  // Helper for Board Badge Styling
  const getBoardStyle = (board: CommunityBoard) => {
    switch (board) {
      case '干货分享':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case '求助答疑':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case '前沿观察':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
      case '赚钱交流':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case '同行交流':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200/80';
      case '娱乐灌水':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Toggle Bookmark
  const toggleBookmark = (id: string) => {
    setCollectedPosts(prev => {
      const nextState = !prev[id];
      showToast(nextState ? '已成功收藏该条动态' : '已取消收藏');
      return { ...prev, [id]: nextState };
    });
  };

  // Handle Add Comment
  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) {
      showToast('请输入评论内容');
      return;
    }
    showToast('评论发表成功！');
    setCommentInput('');
  };

  // Tag Handlers in Modal / Page
  const handleAddTag = (tag: string) => {
    const clean = tag.replace(/^#/, '').trim();
    if (clean && !newPostTags.includes(clean)) {
      setNewPostTags(prev => [...prev, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setNewPostTags(prev => prev.filter(t => t !== tag));
  };

  // Submit Post Logic
  const handlePublishSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newPostContent.trim()) {
      showToast('请填写动态正文内容');
      return;
    }
    const imageList = selectedPresetImage ? [selectedPresetImage] : undefined;
    createPost(
      newPostContent,
      newPostBoard,
      imageList,
      newPostTitle.trim() || undefined,
      newPostTags.length > 0 ? newPostTags : undefined
    );

    // Reset Form
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostTags(['DeepSeek', 'Agent']);
    setSelectedPresetImage(null);
    setShowPublishModal(false);
    setViewMode('feed');
    showToast('动态发布成功，已被收录进社区广场！');
  };

  const presetImageOptions = [
    { label: '网络架构', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80' },
    { label: 'AIGC 视觉', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80' },
    { label: '代码矩阵', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80' },
    { label: '数据看板', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80' },
  ];

  const quickTags = ['DeepSeek', 'Agent', 'RAG', 'Prompt', '大模型微调', 'SaaS变现', '黑客松', 'ComfyUI', 'Python'];

  // ================= 渲染：二级发帖页面 (Dedicated Secondary Publish Page) =================
  if (viewMode === 'publish') {
    return (
      <div className="w-full space-y-6 animate-fade-in pb-12 select-none max-w-6xl mx-auto">
        
        {/* Top Header & Back Button Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between gap-4">
          <button
            onClick={() => setViewMode('feed')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回社区大厅</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-800">创作中心 · 发帖编辑页面</span>
          </div>
        </div>

        {/* Publish Page Layout: Left Form + Right Live Card Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form: 7 columns */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
            
            <div className="border-b border-slate-100 pb-4">
              <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                发布新的社区动态
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                分享你的 AI Agent 开发实践、报错排查、副业商业化思考或学习干货
              </p>
            </div>

            <form onSubmit={handlePublishSubmit} className="space-y-5">
              
              {/* Row 1: Board Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  选择发布板块 <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(['干货分享', '求助答疑', '前沿观察', '赚钱交流', '同行交流', '娱乐灌水'] as CommunityBoard[]).map(board => {
                    const isSelected = newPostBoard === board;
                    return (
                      <button
                        type="button"
                        key={board}
                        onClick={() => setNewPostBoard(board)}
                        className={`p-3 rounded-xl border text-xs font-bold transition text-left flex items-center justify-between cursor-pointer ${
                          isSelected 
                            ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 shadow-xs' 
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span>{board}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title Field */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  动态标题 (推荐填写)
                </label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="【标题】用一句话概括核心观点，例如：DeepSeek-R1 量化部署优化总结..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 transition font-medium"
                />
              </div>

              {/* Content Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  正文内容 <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={6}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="在此输入正文详细内容。可以分享你的实战代码片段、提示词模板、环境配置或商业路径思考..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 transition leading-relaxed font-normal"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>支持普通文本与段落格式</span>
                  <span>已输入 {newPostContent.length} 字</span>
                </div>
              </div>

              {/* Tags Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  技术标签
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {newPostTags.map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center gap-1 border border-indigo-200">
                      #{t}
                      <button type="button" onClick={() => handleRemoveTag(t)} className="hover:text-rose-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <TagIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag(tagInput);
                        }
                      }}
                      placeholder="输入自定义标签按回车添加..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:bg-white focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddTag(tagInput)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                  >
                    添加
                  </button>
                </div>

                {/* Quick Tags Suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 text-[10px] text-slate-500">
                  <span className="font-bold text-slate-600">推荐标签:</span>
                  {quickTags.map(qt => (
                    <button
                      key={qt}
                      type="button"
                      onClick={() => handleAddTag(qt)}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 cursor-pointer transition font-medium"
                    >
                      #{qt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preset Image Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                  装饰配图 (可选)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {presetImageOptions.map((opt, idx) => {
                    const isSelected = selectedPresetImage === opt.url;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedPresetImage(isSelected ? null : opt.url)}
                        className={`p-1.5 rounded-xl border-2 cursor-pointer transition relative overflow-hidden ${
                          isSelected ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                        }`}
                      >
                        <img src={opt.url} alt={opt.label} className="w-full h-16 object-cover rounded-lg" />
                        <span className="text-[10px] font-bold text-slate-700 text-center block mt-1">
                          {opt.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode('feed')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  取消并返回
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-2 transition cursor-pointer active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>确认立即发表</span>
                </button>
              </div>

            </form>

          </div>

          {/* Right Live Card Preview: 5 columns */}
          <div className="lg:col-span-5 space-y-4 sticky top-4">
            <div className="p-4 rounded-2xl bg-indigo-900/90 text-white shadow-xs flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                实时发布效果预览 (Live Preview)
              </span>
              <span className="text-[10px] text-cyan-300 font-mono">卡片实时拟真</span>
            </div>

            {/* Preview Post Card */}
            <div className="p-5 rounded-2xl bg-white border border-indigo-200 shadow-lg space-y-3.5 relative overflow-hidden">
              
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-100" 
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{user.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                      <span className="text-indigo-600 font-bold">{user.identityTag}</span>
                      <span>·</span>
                      <span>刚刚</span>
                    </div>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border shrink-0 ${getBoardStyle(newPostBoard)}`}>
                  {newPostBoard}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-black text-slate-900 leading-snug">
                {newPostTitle.trim() || '【标题预览】用一句话概括你的核心观点...'}
              </h3>

              {/* Content */}
              <p className="text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-wrap min-h-[60px]">
                {newPostContent.trim() || '在这里填写的正文内容将会实时在社区瀑布流中向全站开发者展示...'}
              </p>

              {/* Image */}
              {selectedPresetImage && (
                <div className="rounded-xl overflow-hidden border border-slate-100">
                  <img src={selectedPresetImage} alt="preview" className="w-full h-40 object-cover" />
                </div>
              )}

              {/* Tags */}
              {newPostTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {newPostTags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium opacity-60 pointer-events-none">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> 0</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> 0</span>
                  <span className="flex items-center gap-1"><Bookmark className="w-3.5 h-3.5" /></span>
                </div>
                <span className="text-[10px] font-mono"><Eye className="w-3 h-3 inline mr-1" />1</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // ================= 默认渲染：社区主视图 (Feed View) =================
  return (
    <div className="w-full space-y-6 animate-fade-in pb-12 select-none relative">
      
      {/* Standard Unified Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              开发者技术社区
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                生态圈
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              汇聚全球 AI 开发者、算法工程师与独立创作者，分享实践经验、解答技术难题与人脉连接
            </p>
          </div>
        </div>

        {/* Action: 我要发帖 button */}
        <div className="shrink-0">
          <button
            onClick={() => setViewMode('publish')}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>我要发帖</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Sidebar (Board Navigation) + Right Stream (Waterfall Feed) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Sidebar: 6 Boards + All */}
        <div className="lg:col-span-1 space-y-3 sticky top-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
              社区板块分类
            </div>

            <div className="space-y-1.5">
              {boardConfigs.map(b => {
                const isActive = activeBoard === b.id;
                const count = boardCounts[b.id] || 0;

                return (
                  <button
                    key={b.id}
                    onClick={() => setActiveBoard(b.id)}
                    className={`w-full text-left p-3 rounded-xl transition flex items-start justify-between gap-3 cursor-pointer group ${
                      isActive 
                        ? 'bg-indigo-50/80 border border-indigo-200/80 shadow-xs' 
                        : 'bg-white hover:bg-slate-50 border border-transparent hover:border-slate-200/60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg shrink-0 transition ${
                        isActive ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      }`}>
                        {b.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold ${isActive ? 'text-indigo-900' : 'text-slate-800'}`}>
                            {b.label}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-medium">
                            {b.position}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 leading-tight font-normal">
                          {b.desc}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Area: Top Filter Bar & Waterfall Feed */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Top Filter Bar: 推荐 / 最新 / 关注 & Search */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
              {[
                { id: 'recommend', label: '推荐' },
                { id: 'latest', label: '最新' },
                { id: 'following', label: '关注' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeFilter === tab.id
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input Bar */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索动态标题、技术标签或关键词..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 transition font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Feed Post Status Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
            <span>正在展示 <strong className="text-slate-900 font-bold">{filteredPosts.length}</strong> 条社区动态</span>
            {activeBoard !== 'all' && (
              <span className="text-indigo-600 font-bold">当前筛选板块：{activeBoard}</span>
            )}
          </div>

          {/* Waterfall (Masonry) Feed Grid */}
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-200/80 space-y-3">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-800">暂无相关社区动态</div>
              <p className="text-xs text-slate-400">尝试更换搜索词或选择其他板块，也可以发布第一条动态！</p>
              <button
                onClick={() => setViewMode('publish')}
                className="mt-2 px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                发布动态
              </button>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 xl:columns-2 gap-4 space-y-4">
              {filteredPosts.map(post => {
                const isCollected = collectedPosts[post.id];
                const boardStyle = getBoardStyle(post.board);

                return (
                  <div
                    key={post.id}
                    className="break-inside-avoid p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-200 transition-all shadow-xs hover:shadow-md space-y-3.5 group"
                  >
                    {/* Card Header: Author Info & Board Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={post.authorAvatar} 
                          alt={post.author} 
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100" 
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{post.author}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                            <span className="text-indigo-600 font-bold">{post.authorTag}</span>
                            <span>·</span>
                            <span>{post.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Board Badge Tag */}
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border shrink-0 ${boardStyle}`}>
                        {post.board}
                      </span>
                    </div>

                    {/* Post Title */}
                    {post.title && (
                      <h3 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition leading-snug cursor-pointer">
                        {post.title}
                      </h3>
                    )}

                    {/* Post Content */}
                    <p className="text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {/* Image Preview Grid */}
                    {post.images && post.images.length > 0 && (
                      <div className="rounded-xl overflow-hidden border border-slate-100 pt-1">
                        {post.images.map((img, idx) => (
                          <img 
                            key={idx} 
                            src={img} 
                            alt="post media" 
                            className="w-full h-44 object-cover hover:scale-105 transition duration-300" 
                          />
                        ))}
                      </div>
                    )}

                    {/* Tags Pills */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {post.tags.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                      
                      <div className="flex items-center gap-4">
                        {/* Like Button */}
                        <button
                          onClick={() => likePost(post.id)}
                          className={`flex items-center gap-1 hover:text-indigo-600 transition cursor-pointer ${
                            post.isLiked ? 'text-indigo-600 font-bold' : ''
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-indigo-600' : ''}`} />
                          <span>{post.likesCount}</span>
                        </button>

                        {/* Comment Button */}
                        <button
                          onClick={() => setExpandedPostComments(expandedPostComments === post.id ? null : post.id)}
                          className="flex items-center gap-1 hover:text-cyan-600 transition cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{post.commentsCount}</span>
                        </button>

                        {/* Bookmark Button */}
                        <button
                          onClick={() => toggleBookmark(post.id)}
                          className={`flex items-center gap-1 hover:text-amber-600 transition cursor-pointer ${
                            isCollected ? 'text-amber-600 font-bold' : ''
                          }`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isCollected ? 'fill-amber-500' : ''}`} />
                        </button>

                        {/* Share Button */}
                        <button
                          onClick={() => showToast('动态链接已复制到剪贴板')}
                          className="flex items-center gap-1 hover:text-slate-900 transition cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Views Count */}
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                        <Eye className="w-3 h-3" />
                        <span>{post.viewsCount || 120}</span>
                      </div>
                    </div>

                    {/* Inline Comment Drawer */}
                    {expandedPostComments === post.id && (
                      <div className="pt-3 border-t border-slate-100 space-y-2.5 bg-slate-50/80 p-3 rounded-xl mt-2 animate-fade-in">
                        <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                          <span>热评列表</span>
                          <span className="text-[10px] text-slate-400">共 {post.commentsList?.length || 2} 条回复</span>
                        </div>

                        <div className="space-y-2 text-xs">
                          {(post.commentsList || [
                            { id: 'c1', author: '张Dev', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', content: '很有启发的干货！已经关注。', time: '1小时前' },
                            { id: 'c2', author: '极客小千', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', content: '赞！在算力工坊尝试了一下，效果显著。', time: '30分钟前' }
                          ]).map(comment => (
                            <div key={comment.id} className="p-2 rounded-lg bg-white border border-slate-200/70 text-[11px]">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-indigo-600">{comment.author}</span>
                                <span className="text-[10px] text-slate-400">{comment.time}</span>
                              </div>
                              <p className="text-slate-700 mt-1">{comment.content}</p>
                            </div>
                          ))}
                        </div>

                        {/* Input comment */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            placeholder="写下你的想法..."
                            className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-indigo-500"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-lg shadow-xs shrink-0 cursor-pointer"
                          >
                            发送
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* Floating Quick Action Button: 我要发帖 */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => setViewMode('publish')}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition cursor-pointer transform hover:scale-105 active:scale-95 border border-indigo-400/30"
        >
          <Plus className="w-4 h-4" />
          <span>我要发帖</span>
        </button>
      </div>

    </div>
  );
};
