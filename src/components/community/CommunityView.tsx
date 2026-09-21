import React, { useState, useMemo, useEffect } from 'react';
import Markdown from 'react-markdown';
import { useApp } from '../../context/AppContext';
import { FeedPost, CommunityBoard } from '../../types';
import { sortCommunityPosts } from '../../utils/communityScore';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Send, 
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
  CheckCircle2,
  Bold,
  Italic,
  Heading,
  Code,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  CornerDownRight,
  Edit3,
  Heart,
  Pin,
  Layers
} from 'lucide-react';

interface BoardConfig {
  id: 'all' | CommunityBoard;
  label: string;
  desc: string;
  icon: React.ReactNode;
}

interface LocalReply {
  id: string;
  author: string;
  avatar: string;
  authorTag?: string;
  content: string;
  time: string;
  replyToUser?: string;
  likesCount: number;
  isLiked?: boolean;
}

interface LocalComment {
  id: string;
  author: string;
  avatar: string;
  authorTag?: string;
  content: string;
  time: string;
  likesCount: number;
  isLiked?: boolean;
  replies: LocalReply[];
}

export const CommunityView: React.FC = () => {
  const { posts, createPost, user, showToast, communityBoards, recordPostView } = useApp();

  // Navigation View Mode: 'feed' | 'publish' | 'detail'
  const [viewMode, setViewMode] = useState<'feed' | 'publish' | 'detail'>('feed');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // State
  const [activeBoard, setActiveBoard] = useState<'all' | CommunityBoard>('all');
  const [activeFilter, setActiveFilter] = useState<'recommend' | 'latest'>('recommend');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Local interaction states
  const [collectedPosts, setCollectedPosts] = useState<Record<string, boolean>>({});
  const [postLikesMap, setPostLikesMap] = useState<Record<string, { count: number; isLiked: boolean }>>({});
  
  // Comments and Replies Map keyed by postId
  const [commentsMap, setCommentsMap] = useState<Record<string, LocalComment[]>>({});
  const [mainCommentInput, setMainCommentInput] = useState('');
  // 评论回复目标：一级评论ID、被回复人姓名、可选的具体回复ID
  const [replyTarget, setReplyTarget] = useState<{
    commentId: string;
    targetAuthor: string;
    replyId?: string;
  } | null>(null);
  const [replyInput, setReplyInput] = useState('');

  // Publishing State
  const [newPostBoard, setNewPostBoard] = useState<CommunityBoard>('干货分享');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState<string[]>(['DeepSeek', 'Agent']);
  const [tagInput, setTagInput] = useState('');
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');

  // Helper for dynamic board icons
  const getBoardIcon = (name: string) => {
    switch (name) {
      case '干货分享': return <BookOpen className="w-4 h-4 text-emerald-600" />;
      case '求助答疑': return <HelpCircle className="w-4 h-4 text-amber-600" />;
      case '前沿观察': return <Compass className="w-4 h-4 text-indigo-600" />;
      case '赚钱交流': return <TrendingUp className="w-4 h-4 text-rose-600" />;
      case '同行交流': return <Users className="w-4 h-4 text-cyan-600" />;
      case '娱乐灌水': return <Coffee className="w-4 h-4 text-purple-600" />;
      default: return <Layers className="w-4 h-4 text-slate-600" />;
    }
  };

  // 板块停用后前台社区中应该隐藏此板块，并按后台排序权重展示
  const enabledBoards = useMemo(() => {
    return communityBoards
      .filter(b => b.status === '已启用')
      .sort((a, b) => a.sortWeight - b.sortWeight);
  }, [communityBoards]);

  const boardConfigs: BoardConfig[] = useMemo(() => {
    return [
      {
        id: 'all',
        label: '全部板块',
        desc: '浏览全站 AI 开发者最新实践、经验与问答',
        icon: <Sparkles className="w-4 h-4 text-indigo-600" />
      },
      ...enabledBoards.map(b => ({
        id: b.name as CommunityBoard,
        label: b.name,
        desc: b.description || '社区开发者讨论与分享',
        icon: getBoardIcon(b.name)
      }))
    ];
  }, [enabledBoards]);

  // 如果当前选中的板块被后台停用了，自动回退到“全部板块”
  useEffect(() => {
    if (activeBoard !== 'all') {
      const isStillEnabled = enabledBoards.some(b => b.name === activeBoard);
      if (!isStillEnabled) {
        setActiveBoard('all');
      }
    }
  }, [activeBoard, enabledBoards]);

  // 如果待发帖板块被停用了，自动切换为第一个有效板块
  useEffect(() => {
    const currentBoardObj = communityBoards.find(b => b.name === newPostBoard);
    if (!currentBoardObj || currentBoardObj.status === '已停用') {
      const firstEnabled = enabledBoards[0];
      if (firstEnabled) {
        setNewPostBoard(firstEnabled.name as CommunityBoard);
      }
    }
  }, [communityBoards, enabledBoards, newPostBoard]);

  // Helper to get initial or stored comments for a post
  const getPostComments = (postId: string): LocalComment[] => {
    if (commentsMap[postId]) {
      return commentsMap[postId];
    }
    // Default fallback comments if none present
    const postObj = posts.find(p => p.id === postId);
    if (postObj?.commentsList && postObj.commentsList.length > 0) {
      return postObj.commentsList.map(c => ({
        id: c.id,
        author: c.author,
        avatar: c.avatar,
        authorTag: c.authorTag || '社区贡献者',
        content: c.content,
        time: c.time,
        likesCount: c.likesCount || Math.floor(Math.random() * 8 + 2),
        isLiked: false,
        replies: c.replies ? c.replies.map(r => ({
          id: r.id,
          author: r.author,
          avatar: r.avatar,
          authorTag: r.authorTag || '开发者',
          content: r.content,
          time: r.time,
          replyToUser: r.replyToUser || c.author,
          likesCount: r.likesCount !== undefined ? r.likesCount : Math.floor(Math.random() * 5 + 1),
          isLiked: !!r.isLiked
        })) : [
          {
            id: `r_${c.id}_1`,
            author: 'AI智囊',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            authorTag: '官方架构师',
            content: '非常赞同！在实际应用中配合量化剪枝与上下文缓存效果更佳。',
            time: '30分钟前',
            replyToUser: c.author,
            likesCount: 3,
            isLiked: false
          }
        ]
      }));
    }
    return [
      {
        id: 'c_default_1',
        author: '张Dev',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        authorTag: '高级开发者',
        content: '非常详实的分享！针对长文本推理时显存优化的实操性很强，已收藏。',
        time: '1小时前',
        likesCount: 12,
        isLiked: false,
        replies: [
          {
            id: 'r_default_1',
            author: '极客小千',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
            authorTag: '全栈极客',
            content: '同感！在算力工坊 A100 实例上跑了这个配置，首 Token 延迟明显改善。',
            time: '40分钟前',
            replyToUser: '张Dev',
            likesCount: 5,
            isLiked: false
          }
        ]
      },
      {
        id: 'c_default_2',
        author: '李向量-数据专家',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        authorTag: '算法工程师',
        content: '请问一下中间如果在 RAG 环节加入 Hybrid Rerank，耗时大约会增加多少毫秒？',
        time: '2小时前',
        likesCount: 7,
        isLiked: false,
        replies: []
      }
    ];
  };

  // Filter & Search Logic
  const filteredPosts = useMemo(() => {
    let list = [...posts];

    // 1. 板块停用后前台社区中应该隐藏此板块的帖子
    const disabledBoardNames = new Set(
      communityBoards.filter(b => b.status === '已停用').map(b => b.name)
    );
    list = list.filter(p => !disabledBoardNames.has(p.board));

    // 2. 仅展示已审核通过或发布的帖子
    list = list.filter(p => !p.status || p.status === '已通过' || p.status === '已发布');

    // 3. Filter by board
    if (activeBoard !== 'all') {
      list = list.filter(p => p.board === activeBoard);
    }

    // 4. Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        (p.title && p.title.toLowerCase().includes(q)) ||
        p.content.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // 5. 排序规则：
    // - 后台帖子的置顶效果在前台可见，最新置顶的靠前 (pinnedAt 倒序)
    // - 加精只是加个“精华”标签，不影响帖子排序
    // - 推荐帖子按照公式实时计算：帖子得分 = 加权互动分 ÷ (发帖小时数 + 2) ^ 1.5
    //   加权互动分 = 评论数×5 + 收藏数×4 + 点赞数×2 + 查看数×0.2
    //   发帖小时数 = 当前时间 - 发帖时间（小时），向下取整，最小为0
    // - 最新帖子按发帖时间倒序
    return sortCommunityPosts(list, activeFilter, {
      likesMap: postLikesMap,
      bookmarksMap: collectedPosts,
      commentsMap: commentsMap
    });
  }, [posts, activeBoard, searchQuery, activeFilter, communityBoards, postLikesMap, collectedPosts, commentsMap]);

  // Selected post object for detail view
  const currentPost = useMemo(() => {
    if (!selectedPostId) return null;
    return posts.find(p => p.id === selectedPostId) || posts[0];
  }, [selectedPostId, posts]);

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
  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCollectedPosts(prev => {
      const nextState = !prev[id];
      showToast(nextState ? '已成功收藏该条动态' : '已取消收藏');
      return { ...prev, [id]: nextState };
    });
  };

  // Toggle Like for Post
  const handleLikePost = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPostLikesMap(prev => {
      const current = prev[postId] || { 
        count: posts.find(p => p.id === postId)?.likesCount || 0, 
        isLiked: posts.find(p => p.id === postId)?.isLiked || false 
      };
      const nextLiked = !current.isLiked;
      const nextCount = nextLiked ? current.count + 1 : Math.max(0, current.count - 1);
      showToast(nextLiked ? '点赞成功！' : '已取消点赞');
      return { ...prev, [postId]: { count: nextCount, isLiked: nextLiked } };
    });
  };

  // Get current post likes info
  const getPostLikes = (post: FeedPost) => {
    if (postLikesMap[post.id]) {
      return postLikesMap[post.id];
    }
    return { count: post.likesCount, isLiked: !!post.isLiked };
  };

  // Open Post Detail - 支持防刷查看计数（同一用户/IP对同一帖子多次查看只计1次）
  const openPostDetail = (postId: string) => {
    recordPostView(postId);
    setSelectedPostId(postId);
    setViewMode('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add Top Level Comment
  const handleAddMainComment = (postId: string) => {
    if (!mainCommentInput.trim()) {
      showToast('请输入评论内容');
      return;
    }

    const newComment: LocalComment = {
      id: `c_${Date.now()}`,
      author: user.name || '我的账号',
      avatar: user.avatar,
      authorTag: user.identityTag || '社区成员',
      content: mainCommentInput.trim(),
      time: '刚刚',
      likesCount: 0,
      isLiked: false,
      replies: []
    };

    setCommentsMap(prev => {
      const existing = prev[postId] || getPostComments(postId);
      return {
        ...prev,
        [postId]: [newComment, ...existing]
      };
    });

    setMainCommentInput('');
    showToast('评论发表成功！');
  };

  // Add Reply to a Comment (or to a Reply in the secondary area)
  // 整个评论区只分两级，评论的回复和评论的回复的回复都按回复时间在二级区域往后排
  const handleAddReply = (postId: string, commentId: string, targetAuthor: string) => {
    if (!replyInput.trim()) {
      showToast('请输入回复内容');
      return;
    }

    const newReply: LocalReply = {
      id: `r_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      author: user.name || '我的账号',
      avatar: user.avatar,
      authorTag: user.identityTag || '社区成员',
      content: replyInput.trim(),
      time: '刚刚',
      replyToUser: targetAuthor,
      likesCount: 0,
      isLiked: false
    };

    setCommentsMap(prev => {
      const list = prev[postId] || getPostComments(postId);
      const updatedList = list.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: [...c.replies, newReply]
          };
        }
        return c;
      });
      return { ...prev, [postId]: updatedList };
    });

    setReplyInput('');
    setReplyTarget(null);
    showToast('回复发表成功！');
  };

  // Toggle Like on Comment
  const handleLikeComment = (postId: string, commentId: string) => {
    setCommentsMap(prev => {
      const list = prev[postId] || getPostComments(postId);
      const updatedList = list.map(c => {
        if (c.id === commentId) {
          const isLiked = !c.isLiked;
          const likesCount = isLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1);
          return { ...c, isLiked, likesCount };
        }
        return c;
      });
      return { ...prev, [postId]: updatedList };
    });
  };

  // Toggle Like on Reply (in secondary area)
  const handleLikeReply = (postId: string, commentId: string, replyId: string) => {
    setCommentsMap(prev => {
      const list = prev[postId] || getPostComments(postId);
      const updatedList = list.map(c => {
        if (c.id === commentId) {
          const updatedReplies = c.replies.map(r => {
            if (r.id === replyId) {
              const isLiked = !r.isLiked;
              const likesCount = isLiked ? (r.likesCount || 0) + 1 : Math.max(0, (r.likesCount || 0) - 1);
              return { ...r, isLiked, likesCount };
            }
            return r;
          });
          return { ...c, replies: updatedReplies };
        }
        return c;
      });
      return { ...prev, [postId]: updatedList };
    });
  };

  // Insert markdown syntax helper
  const insertMarkdownSyntax = (prefix: string, suffix: string = '') => {
    setNewPostContent(prev => {
      if (!prev) return `${prefix}示例文本${suffix}`;
      return `${prev}\n${prefix}示例文本${suffix}`;
    });
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
    const targetBoardObj = communityBoards.find(b => b.name === newPostBoard);
    if (targetBoardObj && targetBoardObj.status === '已停用') {
      showToast('所选板块已被停用，不可选，请选择其他已启用的板块！');
      return;
    }
    createPost(
      newPostContent,
      newPostBoard,
      undefined,
      newPostTitle.trim() || undefined,
      newPostTags.length > 0 ? newPostTags : undefined
    );

    // Reset Form
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostTags(['DeepSeek', 'Agent']);
    setViewMode('feed');
    showToast('动态发布成功，已被收录进社区广场！');
  };

  const quickTags = ['DeepSeek', 'Agent', 'RAG', 'Prompt', '大模型微调', 'SaaS变现', '黑客松', 'ComfyUI', 'Python'];

  // ================= 渲染：详情页 View Mode === 'detail' =================
  if (viewMode === 'detail' && currentPost) {
    const isCollected = !!collectedPosts[currentPost.id];
    const likesInfo = getPostLikes(currentPost);
    const postComments = getPostComments(currentPost.id);
    const totalCommentsCount = postComments.reduce((acc, c) => acc + 1 + c.replies.length, 0);

    return (
      <div className="w-full space-y-6 animate-fade-in pb-16 max-w-4xl mx-auto select-none">
        
        {/* Top Header & Back Button Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between gap-4">
          <button
            onClick={() => setViewMode('feed')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回社区大厅</span>
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            {(currentPost.isPinned || currentPost.isTop) && (
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-rose-50 text-rose-600 border border-rose-200/90 flex items-center gap-1 shadow-2xs">
                <Pin className="w-3.5 h-3.5 text-rose-600 fill-rose-100" />
                置顶
              </span>
            )}
            {currentPost.isEssential && (
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-amber-50 text-amber-700 border border-amber-200/90 flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-100" />
                精华
              </span>
            )}
            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${getBoardStyle(currentPost.board)}`}>
              {currentPost.board}
            </span>
            <span className="text-xs font-bold text-slate-500">动态详情</span>
          </div>
        </div>

        {/* Article Full Detail Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
          
          {/* Author Info Banner */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <img 
                src={currentPost.authorAvatar} 
                alt={currentPost.author} 
                className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-100" 
              />
              <div>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>{currentPost.author}</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200/60">
                    {currentPost.authorTag}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">
                  发布于 {currentPost.time}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Eye className="w-4 h-4 text-slate-400" />
              <span>{currentPost.viewsCount || 1280} 浏览</span>
            </div>
          </div>

          {/* Article Title */}
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug tracking-tight">
            {currentPost.title || '社区动态分享'}
          </h1>

          {/* Tags */}
          {currentPost.tags && currentPost.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {currentPost.tags.map((t, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 border border-slate-200/80">
                  <TagIcon className="w-3 h-3 text-indigo-500" />
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Main Article Content rendered with Markdown */}
          <div className="pt-2 border-t border-slate-100 text-slate-800 text-sm leading-relaxed space-y-4">
            <div className="prose prose-slate max-w-none font-normal leading-relaxed text-slate-800">
              <Markdown>{currentPost.content}</Markdown>
            </div>
          </div>

          {/* Article Images (if any) */}
          {currentPost.images && currentPost.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentPost.images.map((img, idx) => (
                <div key={idx} className="rounded-2xl overflow-hidden border border-slate-200">
                  <img src={img} alt="article attachment" className="w-full h-56 object-cover hover:scale-105 transition duration-300" />
                </div>
              ))}
            </div>
          )}

          {/* Article Bottom Action Toolbar: Like, Bookmark, Share */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* Like Button */}
              <button
                onClick={(e) => handleLikePost(currentPost.id, e)}
                className={`px-5 py-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition cursor-pointer active:scale-95 ${
                  likesInfo.isLiked 
                    ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-xs' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${likesInfo.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>点赞 ({likesInfo.count})</span>
              </button>

              {/* Bookmark/Collect Button */}
              <button
                onClick={(e) => toggleBookmark(currentPost.id, e)}
                className={`px-5 py-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition cursor-pointer active:scale-95 ${
                  isCollected 
                    ? 'bg-amber-50 text-amber-600 border-amber-200 shadow-xs' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isCollected ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>{isCollected ? '已收藏' : '收藏文章'}</span>
              </button>

              {/* Share Button */}
              <button
                onClick={() => showToast('文章链接已复制到剪贴板！')}
                className="px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition cursor-pointer active:scale-95"
              >
                <Share2 className="w-4 h-4 text-slate-500" />
                <span>分享</span>
              </button>

            </div>

            <div className="text-xs text-slate-400 font-medium">
              共 {totalCommentsCount} 条评论回复
            </div>
          </div>

        </div>

        {/* Comments & Replies Section */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              评论与回复 ({totalCommentsCount})
            </h3>
            <span className="text-xs text-slate-400 font-medium">遵循社区友好交流公约</span>
          </div>

          {/* Top Level Comment Input Box */}
          <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-indigo-100" 
            />
            <div className="flex-1 space-y-3">
              <textarea
                rows={3}
                value={mainCommentInput}
                onChange={(e) => setMainCommentInput(e.target.value)}
                placeholder="发表你的见解，与全站开发者探讨交流..."
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 transition leading-relaxed"
              />
              <div className="flex items-center justify-end">
                <button
                  onClick={() => handleAddMainComment(currentPost.id)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>发表评论</span>
                </button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4 pt-2">
            {postComments.map((comment) => (
              <div key={comment.id} className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200/70 space-y-3">
                
                {/* Main Comment Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={comment.avatar} 
                      alt={comment.author} 
                      className="w-8 h-8 rounded-full object-cover" 
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{comment.author}</span>
                        {comment.authorTag && (
                          <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-600 text-[9px] font-medium">
                            {comment.authorTag}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{comment.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Comment Like Button */}
                    <button
                      onClick={() => handleLikeComment(currentPost.id, comment.id)}
                      className={`flex items-center gap-1 text-xs font-medium cursor-pointer transition ${
                        comment.isLiked ? 'text-rose-600 font-bold' : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-rose-500' : ''}`} />
                      <span>{comment.likesCount}</span>
                    </button>

                    {/* Reply Trigger Button */}
                    <button
                      onClick={() => {
                        if (replyTarget?.commentId === comment.id && !replyTarget?.replyId) {
                          setReplyTarget(null);
                        } else {
                          setReplyTarget({
                            commentId: comment.id,
                            targetAuthor: comment.author
                          });
                          setReplyInput('');
                        }
                      }}
                      className="flex items-center gap-1 text-xs text-indigo-600 font-bold hover:text-indigo-700 cursor-pointer"
                    >
                      <CornerDownRight className="w-3.5 h-3.5" />
                      <span>回复</span>
                    </button>
                  </div>
                </div>

                {/* Main Comment Content */}
                <p className="text-xs text-slate-700 leading-relaxed font-normal pl-10">
                  {comment.content}
                </p>

                {/* Inline Reply Input Box (for replying to root comment) */}
                {replyTarget?.commentId === comment.id && !replyTarget?.replyId && (
                  <div className="ml-10 pt-2 animate-fade-in space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        autoFocus
                        value={replyInput}
                        onChange={(e) => setReplyInput(e.target.value)}
                        placeholder={`回复 @${comment.author}...`}
                        className="flex-1 px-3 py-2 bg-white border border-indigo-300 rounded-xl text-xs text-slate-900 outline-none focus:border-indigo-600 shadow-2xs"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddReply(currentPost.id, comment.id, comment.author);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleAddReply(currentPost.id, comment.id, comment.author)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer active:scale-95 transition"
                      >
                        提交回复
                      </button>
                      <button
                        onClick={() => setReplyTarget(null)}
                        className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl shrink-0 cursor-pointer transition"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                )}

                {/* Sub Replies List - 整个评论区只分两级，评论的回复和评论的回复的回复都按回复时间在二级区域往后排 */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-10 space-y-2.5 pt-2 border-l-2 border-indigo-200 pl-3">
                    {comment.replies.map((rep) => (
                      <div key={rep.id} className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1.5 text-xs shadow-2xs">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <img src={rep.avatar} alt={rep.author} className="w-5 h-5 rounded-full object-cover shrink-0" />
                            <span className="font-bold text-slate-900">{rep.author}</span>
                            {rep.authorTag && (
                              <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 text-[9px] font-medium">
                                {rep.authorTag}
                              </span>
                            )}
                            {rep.replyToUser && (
                              <span className="text-[10px] text-slate-400">
                                回复 <strong className="text-indigo-600 font-bold">@{rep.replyToUser}</strong>
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2.5 shrink-0">
                            <span className="text-[10px] text-slate-400">{rep.time}</span>
                            
                            {/* Reply Like Button (评论的回复像评论一样点赞) */}
                            <button
                              type="button"
                              onClick={() => handleLikeReply(currentPost.id, comment.id, rep.id)}
                              className={`flex items-center gap-1 text-[11px] font-medium cursor-pointer transition ${
                                rep.isLiked ? 'text-rose-600 font-bold' : 'text-slate-400 hover:text-slate-700'
                              }`}
                              title="赞同该回复"
                            >
                              <ThumbsUp className={`w-3 h-3 ${rep.isLiked ? 'fill-rose-500' : ''}`} />
                              <span>{rep.likesCount || 0}</span>
                            </button>

                            {/* Reply to Reply Button (评论的回复像评论一样回复) */}
                            <button
                              type="button"
                              onClick={() => {
                                if (replyTarget?.commentId === comment.id && replyTarget?.replyId === rep.id) {
                                  setReplyTarget(null);
                                } else {
                                  setReplyTarget({
                                    commentId: comment.id,
                                    targetAuthor: rep.author,
                                    replyId: rep.id
                                  });
                                  setReplyInput('');
                                }
                              }}
                              className="flex items-center gap-1 text-[11px] text-indigo-600 font-bold hover:text-indigo-700 cursor-pointer"
                              title="回复该回复"
                            >
                              <CornerDownRight className="w-3 h-3" />
                              <span>回复</span>
                            </button>
                          </div>
                        </div>

                        <p className="text-slate-700 leading-relaxed font-normal pl-7">
                          {rep.content}
                        </p>

                        {/* Inline Reply Input directly below this reply */}
                        {replyTarget?.commentId === comment.id && replyTarget?.replyId === rep.id && (
                          <div className="ml-7 pt-2 animate-fade-in space-y-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                autoFocus
                                value={replyInput}
                                onChange={(e) => setReplyInput(e.target.value)}
                                placeholder={`回复 @${rep.author}...`}
                                className="flex-1 px-3 py-1.5 bg-slate-50 border border-indigo-300 rounded-xl text-xs text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddReply(currentPost.id, comment.id, rep.author);
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => handleAddReply(currentPost.id, comment.id, rep.author)}
                                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer active:scale-95 transition"
                              >
                                提交回复
                              </button>
                              <button
                                type="button"
                                onClick={() => setReplyTarget(null)}
                                className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl shrink-0 cursor-pointer transition"
                              >
                                取消
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              </div>
            ))}
          </div>

        </div>

      </div>
    );
  }

  // ================= 渲染：我要发帖页面 View Mode === 'publish' =================
  if (viewMode === 'publish') {
    return (
      <div className="w-full space-y-6 animate-fade-in pb-12 select-none max-w-4xl mx-auto">
        
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
            <span className="text-xs font-bold text-slate-800">创作中心 · 我要发帖</span>
          </div>
        </div>

        {/* Publish Form Container */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          
          <div className="border-b border-slate-100 pb-4">
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              发布新的社区动态
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              分享你的 AI Agent 开发实践、报错排查、副业商业化思考或学习干货（支持 Markdown 编辑）
            </p>
          </div>

          <form onSubmit={handlePublishSubmit} className="space-y-6">
            
            {/* Row 1: Board Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                选择发布板块 <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {communityBoards.map(board => {
                  const isSelected = newPostBoard === board.name;
                  const isDisabled = board.status === '已停用';
                  return (
                    <button
                      type="button"
                      key={board.id}
                      disabled={isDisabled}
                      onClick={() => {
                        if (!isDisabled) {
                          setNewPostBoard(board.name as CommunityBoard);
                        }
                      }}
                      className={`p-3 rounded-xl border text-xs font-bold transition text-left flex items-center justify-between ${
                        isDisabled
                          ? 'opacity-50 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                          : isSelected 
                            ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 shadow-xs cursor-pointer' 
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="truncate">{board.name}</span>
                        {isDisabled && (
                          <span className="text-[10px] text-rose-500 font-semibold shrink-0">
                            (已停用)
                          </span>
                        )}
                      </div>
                      {isSelected && !isDisabled && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
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
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 transition font-medium"
              />
            </div>

            {/* Markdown Content Editor Component */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4 text-indigo-600" />
                  正文内容 (Markdown 编辑器) <span className="text-rose-500">*</span>
                </label>

                {/* Editor Tabs: Edit vs Preview */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setEditorTab('write')}
                    className={`px-3 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                      editorTab === 'write' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    编辑 (Markdown)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorTab('preview')}
                    className={`px-3 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                      editorTab === 'preview' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    实时渲染预览
                  </button>
                </div>
              </div>

              {/* Markdown Toolbar (Only visible in 'write' mode) */}
              {editorTab === 'write' && (
                <div className="p-2 bg-slate-100/90 border border-slate-200 rounded-t-xl flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('**', '**')}
                    title="加粗"
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('*', '*')}
                    title="斜体"
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('### ')}
                    title="三级标题"
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <Heading className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-px h-4 bg-slate-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('```python\n# 请在此输入代码\n', '\n```')}
                    title="代码块"
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <Code className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('> ')}
                    title="引用"
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('- ')}
                    title="无序列表"
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('1. ')}
                    title="有序列表"
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('[链接名称](', 'https://example.com)')}
                    title="插入超链接"
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono ml-auto pr-2">
                    支持 Markdown 标准语法
                  </span>
                </div>
              )}

              {/* Textarea or Preview */}
              {editorTab === 'write' ? (
                <textarea
                  rows={10}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="在此输入正文内容（支持 Markdown 语法，如加粗 **文字**、代码块 ``` 等）..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-b-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 transition leading-relaxed font-mono"
                />
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl min-h-[240px] text-xs text-slate-800 leading-relaxed overflow-y-auto">
                  {newPostContent.trim() ? (
                    <div className="prose prose-slate max-w-none text-slate-800 text-xs">
                      <Markdown>{newPostContent}</Markdown>
                    </div>
                  ) : (
                    <div className="text-slate-400 italic text-center pt-16">
                      暂无正文内容，请在“编辑”选项卡中书写...
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>Markdown Editor</span>
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
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
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
                <span>确认发表</span>
              </button>
            </div>

          </form>

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

      {/* Main Grid: Left Sidebar (Category Navigation) + Right Stream (Waterfall Feed) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Sidebar: Clean Categories (Tags & Numbers deleted as requested) */}
        <div className="lg:col-span-1 space-y-3 sticky top-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
              社区板块分类
            </div>

            <div className="space-y-1.5">
              {boardConfigs.map(b => {
                const isActive = activeBoard === b.id;

                return (
                  <button
                    key={b.id}
                    onClick={() => setActiveBoard(b.id)}
                    className={`w-full text-left p-3 rounded-xl transition flex items-start gap-3 cursor-pointer group ${
                      isActive 
                        ? 'bg-indigo-50/80 border border-indigo-200/80 shadow-xs' 
                        : 'bg-white hover:bg-slate-50 border border-transparent hover:border-slate-200/60'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}>
                      {b.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-bold block ${isActive ? 'text-indigo-900' : 'text-slate-800'}`}>
                        {b.label}
                      </span>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 leading-tight font-normal">
                        {b.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Area: Top Filter Bar & Waterfall Feed */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Top Filter Bar: 推荐 / 最新 (Removed "关注" tab as requested) & Search */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Filter Tabs: Only 推荐 & 最新 */}
            <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
              {[
                { id: 'recommend', label: '推荐' },
                { id: 'latest', label: '最新' }
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
              <span className="text-indigo-600 font-bold">当前板块：{activeBoard}</span>
            )}
          </div>

          {/* Waterfall Feed Grid */}
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-200/80 space-y-3">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-800">暂无相关社区动态</div>
              <p className="text-xs text-slate-400">尝试更换搜索词或选择其他板块，也可以发布第一条动态！</p>
              <button
                onClick={() => setViewMode('publish')}
                className="mt-2 px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                发布动态
              </button>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 xl:columns-2 gap-4 space-y-4">
              {filteredPosts.map(post => {
                const isCollected = !!collectedPosts[post.id];
                const likesInfo = getPostLikes(post);
                const boardStyle = getBoardStyle(post.board);

                return (
                  <div
                    key={post.id}
                    onClick={() => openPostDetail(post.id)}
                    className="break-inside-avoid p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 transition-all shadow-xs hover:shadow-md space-y-3.5 group cursor-pointer"
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

                      {/* Tags: 置顶, 精华 & 板块标签 */}
                      <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                        {(post.isPinned || post.isTop) && (
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-200/90 flex items-center gap-1 shadow-2xs">
                            <Pin className="w-3 h-3 text-rose-600 fill-rose-100" />
                            置顶
                          </span>
                        )}
                        {post.isEssential && (
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200/90 flex items-center gap-1 shadow-2xs">
                            <Sparkles className="w-3 h-3 text-amber-600 fill-amber-100" />
                            精华
                          </span>
                        )}
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border shrink-0 ${boardStyle}`}>
                          {post.board}
                        </span>
                      </div>
                    </div>

                    {/* Post Title */}
                    {post.title && (
                      <h3 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition leading-snug">
                        {post.title}
                      </h3>
                    )}

                    {/* Post Content Snippet */}
                    <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-4">
                      {post.content}
                    </p>

                    {/* Image Preview Grid */}
                    {post.images && post.images.length > 0 && (
                      <div className="rounded-xl overflow-hidden border border-slate-100 pt-1">
                        {post.images.slice(0, 1).map((img, idx) => (
                          <img 
                            key={idx} 
                            src={img} 
                            alt="post media" 
                            className="w-full h-40 object-cover hover:scale-105 transition duration-300" 
                          />
                        ))}
                      </div>
                    )}

                    {/* Tags Pills */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {post.tags.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium hover:bg-indigo-50 hover:text-indigo-600 transition">
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
                          onClick={(e) => handleLikePost(post.id, e)}
                          className={`flex items-center gap-1 hover:text-indigo-600 transition cursor-pointer ${
                            likesInfo.isLiked ? 'text-indigo-600 font-bold' : ''
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${likesInfo.isLiked ? 'fill-indigo-600' : ''}`} />
                          <span>{likesInfo.count}</span>
                        </button>

                        {/* Comment Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openPostDetail(post.id);
                          }}
                          className="flex items-center gap-1 hover:text-cyan-600 transition cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{post.commentsCount || 12}</span>
                        </button>

                        {/* Bookmark Button */}
                        <button
                          onClick={(e) => toggleBookmark(post.id, e)}
                          className={`flex items-center gap-1 hover:text-amber-600 transition cursor-pointer ${
                            isCollected ? 'text-amber-600 font-bold' : ''
                          }`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isCollected ? 'fill-amber-500' : ''}`} />
                        </button>

                        {/* Share Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast('动态链接已复制到剪贴板');
                          }}
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

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
