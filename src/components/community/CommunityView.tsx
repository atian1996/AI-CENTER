import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FeedPost } from '../../types';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Send, 
  Image as ImageIcon, 
  Sparkles, 
  TrendingUp, 
  Flame, 
  UserPlus, 
  Award, 
  Search, 
  Filter 
} from 'lucide-react';

export const CommunityView: React.FC = () => {
  const { posts, createPost, likePost, user, showToast } = useApp();

  const [activeBoard, setActiveBoard] = useState<'all' | FeedPost['board']>('all');
  const [postContent, setPostContent] = useState('');
  const [selectedBoard, setSelectedBoard] = useState<FeedPost['board']>('干货分享');
  const [expandedPostComments, setExpandedPostComments] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  const boards: { id: 'all' | FeedPost['board']; label: string }[] = [
    { id: 'all', label: '全部动态' },
    { id: '干货分享', label: '干货分享' },
    { id: '求助答疑', label: '求助答疑' },
    { id: '前沿知识', label: '前沿知识' },
    { id: '赚钱交流', label: '赚钱交流' },
    { id: '交友扩列', label: '交友扩列' },
    { id: '娱乐灌水', label: '娱乐灌水' },
  ];

  const filteredPosts = posts.filter(p => {
    if (activeBoard !== 'all' && p.board !== activeBoard) return false;
    return true;
  });

  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) {
      showToast('请输入帖子内容');
      return;
    }
    createPost(postContent, selectedBoard);
    setPostContent('');
  };

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;
    showToast('评论发表成功！');
    setCommentInput('');
  };

  return (
    <div className="w-full space-y-8 animate-fade-in pb-12 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            开发者技术社区 - 极客交流与极客精神
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            分享 Agent 最佳实践、大模型提示工程技巧、找队友合作与技术问答
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Publisher & Posts Stream */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Post Creation Publisher Box */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30" />
              <div>
                <div className="text-xs font-bold text-slate-900">{user.name}</div>
                <div className="text-[10px] text-indigo-600 font-bold">{user.identityTag}</div>
              </div>
            </div>

            <form onSubmit={handleCreatePostSubmit} className="space-y-3">
              <textarea
                rows={3}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="分享你今天的 Agent 开发体会、调参心得或技术困惑..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 transition leading-relaxed font-medium"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 font-medium">选择板块:</span>
                  <select
                    value={selectedBoard}
                    onChange={(e: any) => setSelectedBoard(e.target.value)}
                    className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-none text-xs font-bold focus:bg-white"
                  >
                    <option value="干货分享">干货分享</option>
                    <option value="求助答疑">求助答疑</option>
                    <option value="前沿知识">前沿知识</option>
                    <option value="赚钱交流">赚钱交流</option>
                    <option value="交友扩列">交友扩列</option>
                    <option value="娱乐灌水">娱乐灌水</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => showToast('可以上传 PNG / JPG 示例效果图片')}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
                    title="添加图片"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>发布动态</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Board Filters */}
          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-1.5 overflow-x-auto">
            {boards.map(b => (
              <button
                key={b.id}
                onClick={() => setActiveBoard(b.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activeBoard === b.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Posts Stream */}
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <div
                key={post.id}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 transition shadow-xs space-y-4"
              >
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={post.authorAvatar} alt={post.author} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100" />
                    <div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span>{post.author}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                          {post.authorTag}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{post.time}</div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {post.board}
                  </span>
                </div>

                {/* Content */}
                <p className="text-xs text-slate-700 leading-relaxed font-sans font-medium">
                  {post.content}
                </p>

                {/* Optional Images */}
                {post.images && post.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {post.images.map((img, idx) => (
                      <img key={idx} src={img} alt="post media" className="rounded-xl object-cover h-40 w-full border border-slate-200" />
                    ))}
                  </div>
                )}

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => likePost(post.id)}
                      className={`flex items-center gap-1.5 hover:text-indigo-600 transition cursor-pointer ${
                        post.isLiked ? 'text-indigo-600 font-bold' : ''
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.likesCount} 点赞</span>
                    </button>

                    <button
                      onClick={() => setExpandedPostComments(expandedPostComments === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 hover:text-cyan-600 transition cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.commentsCount} 评论</span>
                    </button>

                    <button
                      onClick={() => showToast('动态链接已复制')}
                      className="flex items-center gap-1.5 hover:text-slate-900 transition cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>分享</span>
                    </button>
                  </div>
                </div>

                {/* Expanded Comments Section */}
                {expandedPostComments === post.id && (
                  <div className="pt-4 border-t border-slate-100 space-y-3 bg-slate-50 p-4 rounded-xl">
                    <div className="text-xs font-bold text-slate-800">评论回复 (2)</div>
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                        <div className="font-bold text-indigo-600 text-[11px]">极客小千</div>
                        <div className="text-slate-700 mt-0.5">太棒了！请问有开源的示例 Notebook 吗？</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                        <div className="font-bold text-cyan-600 text-[11px]">清华NLP实验室</div>
                        <div className="text-slate-700 mt-0.5">可以在 AI 集市里搜索相关的开放数据集测试效果。</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="写下你的想法..."
                        className="flex-1 bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-900 outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="px-3 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs"
                      >
                        发送
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          {/* Hot Topics */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              社区热门讨论话题
            </div>
            <div className="space-y-2 text-xs font-medium">
              {[
                { tag: '# DeepSeek-R1 满血版微调经验分享', count: '1.2万 讨论' },
                { tag: '# LangGraph Agent 多智能体协同实践', count: '8.5千 讨论' },
                { tag: '# 法律/医疗行业大模型私有化落地', count: '5.6千 讨论' },
                { tag: '# 算力工坊哪款 GPU 性价比最高？', count: '3.4千 讨论' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 transition cursor-pointer flex items-center justify-between border border-slate-100">
                  <span className="text-slate-800 font-bold truncate">{item.tag}</span>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-2 font-mono">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Community Authors */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              优质内容创作者推荐
            </div>
            <div className="space-y-3 text-xs">
              {[
                { name: '清华NLP实验室', tag: '学术前沿', fans: '2.4万' },
                { name: '阿里大模型技术专家', tag: '架构师', fans: '1.8万' },
                { name: '华西数字医疗', tag: '行业专家', fans: '9.5千' }
              ].map((aut, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <div className="font-bold text-slate-900">{aut.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{aut.tag} · {aut.fans} 粉丝</div>
                  </div>
                  <button
                    onClick={() => showToast(`已关注 ${aut.name}`)}
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] shadow-xs cursor-pointer"
                  >
                    + 关注
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
