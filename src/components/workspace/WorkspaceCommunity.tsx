import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FeedPost } from '../../types';
import { 
  MessageSquare, 
  Heart, 
  Bookmark, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  ExternalLink, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  CornerDownRight, 
  Send,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface UserPostItem {
  id: string;
  title: string;
  content: string;
  board: string;
  status: 'published' | 'reviewing' | 'rejected';
  statusLabel: string;
  likesCount: number;
  commentsCount: number;
  collectsCount: number;
  createdAt: string;
  rejectReason?: string;
}

interface UserCommentItem {
  id: string;
  content: string;
  postTitle: string;
  postId: string;
  board: string;
  likesCount: number;
  createdAt: string;
}

interface UserFavoriteItem {
  id: string;
  postId: string;
  postTitle: string;
  authorName: string;
  authorAvatar: string;
  board: string;
  collectedAt: string;
  likesCount: number;
  commentsCount: number;
}

const initialUserPosts: UserPostItem[] = [
  {
    id: 'up-1',
    title: '实战经验：如何用 ComfyUI + SDXL LoRA 搭建高保真工业级视觉生成工作流？',
    content: '在实际产业落地中，LoRA 权重的动态融合与 ControlNet 深度图预处理对于保证生成一致性至关重要。本文详细记录了从环境部署到显存优化的完整步骤...',
    board: '🤖Agent开发',
    status: 'published',
    statusLabel: '已发布',
    likesCount: 68,
    commentsCount: 24,
    collectsCount: 45,
    createdAt: '2026-08-22 15:40'
  },
  {
    id: 'up-2',
    title: '【开源分享】基于 LangGraph 的多角色 Code Review 自动化审计工具',
    content: '写了一个轻量级的代码审计工作流，支持自动检测 SQL 注入、越权访问并生成带行号的修复 Patch，已部署在平台，欢迎大家体验交流！',
    board: '💻代码调试',
    status: 'published',
    statusLabel: '已发布',
    likesCount: 112,
    commentsCount: 38,
    collectsCount: 89,
    createdAt: '2026-08-19 11:20'
  },
  {
    id: 'up-3',
    title: '关于大模型 Agent 自主调用外部 Python 沙箱环境时的安全性思考',
    content: '智能体在生成并执行动态代码时，若未做严格的 cgroup 资源配额与网络隔离，可能引发宿主机提权与数据窃取风险。本方案提出了一种新型的轻量级 MicroVM 容器隔离法...',
    board: '💡创意脑洞',
    status: 'reviewing',
    statusLabel: '审核中',
    likesCount: 0,
    commentsCount: 0,
    collectsCount: 0,
    createdAt: '2026-08-24 08:30'
  },
  {
    id: 'up-4',
    title: '求助：在 RTX 4090 上对 70B 模型进行 QLoRA 微调时出现 CUDA OOM 报错',
    content: '设置了 batch_size=1, gradient_accumulation_steps=16, 仍然在反向传播第 4 步抛出 CUDA out of memory，请问各位大佬有遇到类似情况吗？',
    board: '💻代码调试',
    status: 'rejected',
    statusLabel: '已驳回',
    rejectReason: '帖子排版包含较长无格式化报错日志，请使用 Markdown 代码块排版后重新提交审核。',
    likesCount: 0,
    commentsCount: 0,
    collectsCount: 0,
    createdAt: '2026-08-16 19:10'
  }
];

const initialUserComments: UserCommentItem[] = [
  {
    id: 'uc-1',
    content: '这个多Agent路由策略非常优雅！我们在政务知识库检索场景也遇到了类似的多意图分流问题，受教了！',
    postTitle: '【技术深度】万字长文拆解 Enterprise Agent 生产环境架构设计',
    postId: 'post-101',
    board: '🤖Agent开发',
    likesCount: 15,
    createdAt: '2026-08-23 14:20'
  },
  {
    id: 'uc-2',
    content: '建议将 FlashAttention-2 开启，并在 Deepspeed Zero-3 中配置 CPU offload，显存占用可以再降 35% 左右。',
    postTitle: '求助：Llama-3-70B 全参数微调的最小显存配置建议',
    postId: 'post-102',
    board: '💻代码调试',
    likesCount: 28,
    createdAt: '2026-08-21 16:45'
  },
  {
    id: 'uc-3',
    content: '已报名参加今年的 AI 创新巅峰赛，期待与诸位开发者在数据科学赛道切磋交流！',
    postTitle: '🏆 2026 AI 创新巅峰赛正式开赛！¥200,000 奖池等你来战',
    postId: 'post-103',
    board: '📢官方公告',
    likesCount: 9,
    createdAt: '2026-08-18 10:30'
  }
];

const initialUserFavorites: UserFavoriteItem[] = [
  {
    id: 'uf-1',
    postId: 'post-201',
    postTitle: '【深度干货】从 0 到 1 构建工业级 RAG 知识图谱增强检索系统',
    authorName: '林教授 @AI研究院',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    board: '🤖Agent开发',
    collectedAt: '2026-08-23 20:15',
    likesCount: 245,
    commentsCount: 56
  },
  {
    id: 'uf-2',
    postId: 'post-202',
    postTitle: 'PyTorch 2.4 + vLLM 极致推理吞吐压测对比报告 (A100 vs H100 vs 4090)',
    authorName: '张算力工程师',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    board: '💻代码调试',
    collectedAt: '2026-08-20 18:40',
    likesCount: 189,
    commentsCount: 42
  },
  {
    id: 'uf-3',
    postId: 'post-203',
    postTitle: 'AI运营中心平台 2026 Q3 积分与免费算力激励计划全景指南',
    authorName: '官方运营',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    board: '📢官方公告',
    collectedAt: '2026-08-15 09:30',
    likesCount: 520,
    commentsCount: 98
  }
];

export const WorkspaceCommunity: React.FC = () => {
  const { setActiveTab, showToast } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'posts' | 'comments' | 'favorites'>('posts');
  
  // Data States
  const [posts, setPosts] = useState<UserPostItem[]>(initialUserPosts);
  const [comments, setComments] = useState<UserCommentItem[]>(initialUserComments);
  const [favorites, setFavorites] = useState<UserFavoriteItem[]>(initialUserFavorites);

  // Filters for Posts
  const [postStatusFilter, setPostStatusFilter] = useState<'all' | 'published' | 'reviewing' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [viewPostModal, setViewPostModal] = useState<UserPostItem | null>(null);
  const [editPostModal, setEditPostModal] = useState<UserPostItem | null>(null);
  const [editForm, setEditForm] = useState({ title: '', content: '', board: '🤖Agent开发' });
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'post' | 'comment'; id: string } | null>(null);

  // Filtered Posts
  const filteredPosts = posts.filter(p => {
    if (postStatusFilter !== 'all' && p.status !== postStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.content.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Filtered Comments
  const filteredComments = comments.filter(c => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!c.content.toLowerCase().includes(q) && !c.postTitle.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Filtered Favorites
  const filteredFavorites = favorites.filter(f => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!f.postTitle.toLowerCase().includes(q) && !f.authorName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Actions
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPostModal) return;
    if (!editForm.title.trim() || !editForm.content.trim()) {
      showToast('标题与正文内容不能为空');
      return;
    }

    setPosts(prev => prev.map(p => {
      if (p.id === editPostModal.id) {
        return {
          ...p,
          title: editForm.title,
          content: editForm.content,
          board: editForm.board,
          status: 'reviewing',
          statusLabel: '审核中'
        };
      }
      return p;
    }));

    showToast('帖子修改成功，已提交重新审核');
    setEditPostModal(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'post') {
      setPosts(prev => prev.filter(p => p.id !== deleteConfirm.id));
      showToast('帖子已成功删除');
    } else if (deleteConfirm.type === 'comment') {
      setComments(prev => prev.filter(c => c.id !== deleteConfirm.id));
      showToast('评论已删除');
    }
    setDeleteConfirm(null);
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
    showToast('已取消收藏');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* 顶部标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            我的社区
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            统一管理您在社区发布的帖子、讨论评论与收藏的精华干货
          </p>
        </div>

        <button
          onClick={() => setActiveTab('community')}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>去社区广场发帖</span>
        </button>
      </div>

      {/* 1. 顶部 Tab 切换 */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-2 shadow-2xs flex items-center gap-2">
        <button
          onClick={() => { setActiveSubTab('posts'); setSearchQuery(''); }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'posts'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>我的帖子 ({posts.length})</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('comments'); setSearchQuery(''); }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'comments'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <CornerDownRight className="w-4 h-4" />
          <span>我的评论 ({comments.length})</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('favorites'); setSearchQuery(''); }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'favorites'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>我的收藏 ({favorites.length})</span>
        </button>
      </div>

      {/* 2. 搜索与状态筛选栏 */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* 状态筛选（仅在我的帖子tab展示） */}
        {activeSubTab === 'posts' ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 font-bold mr-1">审核状态:</span>
            {[
              { id: 'all', label: '全部' },
              { id: 'published', label: `已发布 (${posts.filter(p => p.status === 'published').length})` },
              { id: 'reviewing', label: `审核中 (${posts.filter(p => p.status === 'reviewing').length})` },
              { id: 'rejected', label: `已驳回 (${posts.filter(p => p.status === 'rejected').length})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setPostStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  postStatusFilter === tab.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-xs font-bold text-slate-500">
            {activeSubTab === 'comments' ? '我的历史发表评论记录' : '我收藏的社区优质技术帖子'}
          </div>
        )}

        {/* 搜索框 */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={activeSubTab === 'posts' ? '搜索我的帖子标题/内容...' : activeSubTab === 'comments' ? '搜索评论内容/原帖标题...' : '搜索收藏帖子/作者...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>
      </div>

      {/* =========================================================================
          TAB 1: 我的帖子
      ========================================================================= */}
      {activeSubTab === 'posts' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-700">暂无相关帖子</div>
              <p className="text-xs text-slate-400">
                您可以前往社区广场分享您的技术实践、经验心得或发起技术提问
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">帖子标题与概要</th>
                    <th className="py-3.5 px-4">所属板块</th>
                    <th className="py-3.5 px-4">审核状态</th>
                    <th className="py-3.5 px-4">互动数据</th>
                    <th className="py-3.5 px-4">发布时间</th>
                    <th className="py-3.5 px-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {filteredPosts.map((post) => {
                    const isPublished = post.status === 'published';
                    const isReviewing = post.status === 'reviewing';
                    const isRejected = post.status === 'rejected';

                    return (
                      <tr key={post.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* 标题 */}
                        <td className="py-3.5 px-4 max-w-md">
                          <div className="space-y-1">
                            <div 
                              onClick={() => setViewPostModal(post)}
                              className="font-black text-slate-900 hover:text-emerald-600 transition-colors cursor-pointer line-clamp-1 text-sm"
                            >
                              {post.title}
                            </div>
                            <p className="text-slate-500 line-clamp-1 text-[11px]">
                              {post.content}
                            </p>
                            {isRejected && post.rejectReason && (
                              <div className="text-[11px] text-rose-600 bg-rose-50 p-1.5 rounded-lg border border-rose-100">
                                驳回原因: {post.rejectReason}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 所属板块 */}
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {post.board}
                          </span>
                        </td>

                        {/* 状态 */}
                        <td className="py-3.5 px-4">
                          {isPublished && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              已发布
                            </span>
                          )}
                          {isReviewing && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                              <Clock className="w-3 h-3 text-amber-600" />
                              审核中
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              <AlertCircle className="w-3 h-3 text-rose-600" />
                              已驳回
                            </span>
                          )}
                        </td>

                        {/* 互动数据 */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3 text-[11px] text-slate-500">
                            <span className="flex items-center gap-0.5 text-rose-600" title="点赞数">
                              <Heart className="w-3.5 h-3.5 fill-rose-100" /> {post.likesCount}
                            </span>
                            <span className="flex items-center gap-0.5 text-indigo-600" title="评论数">
                              <MessageSquare className="w-3.5 h-3.5" /> {post.commentsCount}
                            </span>
                            <span className="flex items-center gap-0.5 text-amber-600" title="收藏数">
                              <Bookmark className="w-3.5 h-3.5" /> {post.collectsCount}
                            </span>
                          </div>
                        </td>

                        {/* 发布时间 */}
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                          {post.createdAt}
                        </td>

                        {/* 操作 */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setViewPostModal(post)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                              title="查看帖子"
                            >
                              <Eye className="w-3 h-3" />
                              <span>查看</span>
                            </button>
                            <button
                              onClick={() => {
                                setEditPostModal(post);
                                setEditForm({ title: post.title, content: post.content, board: post.board });
                              }}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                              title="编辑帖子"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>编辑</span>
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'post', id: post.id })}
                              className="px-2 py-1 rounded-lg text-rose-600 hover:bg-rose-50 font-bold text-xs transition cursor-pointer"
                              title="删除帖子"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* 分页组件 */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div>共 {filteredPosts.length} 条帖子</div>
                <div className="flex items-center gap-2">
                  <button className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-400 cursor-not-allowed">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold">1</span>
                  <button className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-400 cursor-not-allowed">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: 我的评论
      ========================================================================= */}
      {activeSubTab === 'comments' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
          {filteredComments.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <CornerDownRight className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-700">暂无评论记录</div>
              <p className="text-xs text-slate-400">
                在社区帖子下发表您的独到见解，与其他开发者交流互动
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">评论内容</th>
                    <th className="py-3.5 px-4">所属原帖</th>
                    <th className="py-3.5 px-4">所属板块</th>
                    <th className="py-3.5 px-4">获赞</th>
                    <th className="py-3.5 px-4">评论时间</th>
                    <th className="py-3.5 px-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {filteredComments.map((comment) => (
                    <tr key={comment.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* 评论内容 */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="font-bold text-slate-800 line-clamp-2 leading-relaxed">
                          {comment.content}
                        </div>
                      </td>

                      {/* 所属原帖 */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div 
                          onClick={() => setActiveTab('community')}
                          className="font-bold text-indigo-600 hover:underline cursor-pointer line-clamp-1 flex items-center gap-1"
                        >
                          <span>{comment.postTitle}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </div>
                      </td>

                      {/* 板块 */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                          {comment.board}
                        </span>
                      </td>

                      {/* 获赞 */}
                      <td className="py-3.5 px-4">
                        <span className="text-rose-600 font-bold flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 fill-rose-100" /> {comment.likesCount}
                        </span>
                      </td>

                      {/* 评论时间 */}
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {comment.createdAt}
                      </td>

                      {/* 操作 */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setActiveTab('community')}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                          >
                            查看原帖
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'comment', id: comment.id })}
                            className="px-2 py-1 rounded-lg text-rose-600 hover:bg-rose-50 font-bold text-xs transition cursor-pointer"
                            title="删除评论"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: 我的收藏
      ========================================================================= */}
      {activeSubTab === 'favorites' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
          {filteredFavorites.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-700">暂无收藏内容</div>
              <p className="text-xs text-slate-400">
                在社区广场浏览时，点击帖子下方的书签图标即可将其加入收藏夹
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">帖子标题</th>
                    <th className="py-3.5 px-4">作者信息</th>
                    <th className="py-3.5 px-4">所属板块</th>
                    <th className="py-3.5 px-4">互动数据</th>
                    <th className="py-3.5 px-4">收藏时间</th>
                    <th className="py-3.5 px-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {filteredFavorites.map((fav) => (
                    <tr key={fav.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* 标题 */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div 
                          onClick={() => setActiveTab('community')}
                          className="font-black text-slate-900 hover:text-emerald-600 cursor-pointer line-clamp-1 text-sm flex items-center gap-1"
                        >
                          <span>{fav.postTitle}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                        </div>
                      </td>

                      {/* 作者 */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <img 
                            src={fav.authorAvatar} 
                            alt={fav.authorName} 
                            className="w-5 h-5 rounded-full object-cover" 
                          />
                          <span className="text-slate-800 font-bold">{fav.authorName}</span>
                        </div>
                      </td>

                      {/* 所属板块 */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {fav.board}
                        </span>
                      </td>

                      {/* 互动数据 */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span className="flex items-center gap-0.5 text-rose-500">
                            <Heart className="w-3 h-3" /> {fav.likesCount}
                          </span>
                          <span className="flex items-center gap-0.5 text-indigo-500">
                            <MessageSquare className="w-3 h-3" /> {fav.commentsCount}
                          </span>
                        </div>
                      </td>

                      {/* 收藏时间 */}
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {fav.collectedAt}
                      </td>

                      {/* 操作 */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setActiveTab('community')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs transition cursor-pointer"
                          >
                            查看帖子
                          </button>
                          <button
                            onClick={() => handleRemoveFavorite(fav.id)}
                            className="px-2.5 py-1 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-bold text-xs transition cursor-pointer"
                          >
                            取消收藏
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 4. 查看帖子详情弹窗 */}
      {viewPostModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {viewPostModal.board}
              </span>
              <button
                onClick={() => setViewPostModal(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 leading-snug">
                {viewPostModal.title}
              </h3>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>发布时间: {viewPostModal.createdAt}</span>
                <span>•</span>
                <span className="text-emerald-600 font-bold">{viewPostModal.statusLabel}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                {viewPostModal.content}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-slate-500">
                <span className="flex items-center gap-1 text-rose-600 font-bold"><Heart className="w-3.5 h-3.5 fill-rose-100" /> {viewPostModal.likesCount} 点赞</span>
                <span className="flex items-center gap-1 text-indigo-600 font-bold"><MessageSquare className="w-3.5 h-3.5" /> {viewPostModal.commentsCount} 评论</span>
                <span className="flex items-center gap-1 text-amber-600 font-bold"><Bookmark className="w-3.5 h-3.5" /> {viewPostModal.collectsCount} 收藏</span>
              </div>
              <button
                onClick={() => setViewPostModal(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
              >
                关闭
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. 编辑帖子弹窗 */}
      {editPostModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                编辑社区帖子
              </h3>
              <button
                onClick={() => setEditPostModal(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">所属板块</label>
                <select
                  value={editForm.board}
                  onChange={(e) => setEditForm({ ...editForm, board: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 font-bold"
                >
                  <option value="🤖Agent开发">🤖Agent开发</option>
                  <option value="💻代码调试">💻代码调试</option>
                  <option value="💡创意脑洞">💡创意脑洞</option>
                  <option value="📢官方公告">📢官方公告</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">帖子标题</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">正文内容</label>
                <textarea
                  required
                  rows={5}
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditPostModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-xs cursor-pointer"
                >
                  保存修改
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 6. 删除确认弹窗 */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900">
              确认删除该{deleteConfirm.type === 'post' ? '帖子' : '评论'}？
            </h3>
            <p className="text-xs text-slate-500">
              删除后此操作不可撤回，关联的互动数据将一并清理。
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
