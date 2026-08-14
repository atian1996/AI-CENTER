import React, { useState } from 'react';
import { SkillPluginItem, SkillFileNode, SkillCommentItem } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Download,
  Share2,
  Copy,
  Check,
  FileCode,
  FileText,
  FileJson,
  Calendar,
  Eye,
  ThumbsUp,
  User,
  Send,
  Search,
  ExternalLink,
  Code2,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
  Sparkles,
  ArrowUp,
  Image as ImageIcon,
  Smile,
  Shield,
  Puzzle,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  Layers,
  Award
} from 'lucide-react';

interface SkillDetailProps {
  skill: SkillPluginItem;
  onBack: () => void;
  initialTab?: 'overview' | 'files' | 'comments' | 'history' | 'benchmark';
}

export const SkillDetail: React.FC<SkillDetailProps> = ({ skill, onBack, initialTab = 'overview' }) => {
  const { showToast } = useApp();

  // Active Tab: overview | files | comments | history | benchmark
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'comments' | 'history' | 'benchmark'>(initialTab);

  // Voting and Stats
  const [voteCount, setVoteCount] = useState<number>(skill.voteCount || skill.likesCount || 175);
  const [hasVoted, setHasVoted] = useState<boolean>(skill.hasVoted ?? false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Files Tab State
  const filesList: SkillFileNode[] = skill.files && skill.files.length > 0 ? skill.files : [
    {
      id: 'f_def_readme',
      name: 'README.md',
      path: '/README.md',
      size: '4.3 KB',
      type: 'file',
      language: 'markdown',
      content: `# ${skill.name}\n\n${skill.description}\n\n## 适用场景\n${skill.compatibleAgents}`
    },
    {
      id: 'f_def_skill',
      name: 'SKILL.md',
      path: '/SKILL.md',
      size: '22.5 KB',
      type: 'file',
      language: 'markdown',
      content: `# ${skill.name} Protocol Specification\n\n版本: ${skill.version}\n开发者: ${skill.developer}`
    },
    {
      id: 'f_def_req',
      name: 'requirements.txt',
      path: '/requirements.txt',
      size: '387 B',
      type: 'file',
      language: 'text',
      content: `python>=3.10\nrequests>=2.31.0\npydantic>=2.0.0`
    }
  ];

  // Helper to count total files in tree recursively
  const countAllFiles = (nodes: SkillFileNode[]): number => {
    let count = 0;
    nodes.forEach(node => {
      if (node.type === 'file') {
        count += 1;
      } else if (node.children) {
        count += countAllFiles(node.children);
      }
    });
    return count;
  };

  const totalFilesCount = countAllFiles(filesList);

  // Helper to find first file in tree for initial selection
  const findFirstFile = (nodes: SkillFileNode[]): SkillFileNode | null => {
    for (const node of nodes) {
      if (node.type === 'file') return node;
      if (node.children) {
        const found = findFirstFile(node.children);
        if (found) return found;
      }
    }
    return null;
  };

  const [selectedFile, setSelectedFile] = useState<SkillFileNode | null>(findFirstFile(filesList));
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    '/modules': true,
    '/references': true,
    '/scripts': true
  });
  const [copiedFileCode, setCopiedFileCode] = useState(false);

  // Comments Tab State
  const [commentSort, setCommentSort] = useState<'hot' | 'latest'>('hot');
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<SkillCommentItem[]>(skill.comments || []);
  const [likedCommentIds, setLikedCommentIds] = useState<Record<string, boolean>>({
    'c_val_1': true
  });

  const emojis = ['😊', '😂', '🥰', '👍', '🎉', '🔥', '👏'];

  // Handlers
  const handleVote = () => {
    if (hasVoted) {
      setHasVoted(false);
      setVoteCount(prev => Math.max(0, prev - 1));
      showToast('已取消投票');
    } else {
      setHasVoted(true);
      setVoteCount(prev => prev + 1);
      showToast(`已为【${skill.name}】投出支持的一票！`);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    showToast('已复制 Skill 分享链接至剪贴板');
  };

  const handleDownload = () => {
    showToast(`已开始下载【${skill.name}】全量源码包 (${skill.packageSize || '2.8 MB'})`);
  };

  const handleCopyText = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(identifier);
    showToast(`已复制命令: ${text}`);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleToggleFolder = (path: string) => {
    setOpenFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const handleSelectFile = (file: SkillFileNode) => {
    if (file.type === 'file') {
      setSelectedFile(file);
    }
  };

  const handleJumpToFile = (docPath: string) => {
    setActiveTab('files');
    // Find file in tree by path or name
    const findFileByPath = (nodes: SkillFileNode[]): SkillFileNode | null => {
      for (const node of nodes) {
        if (node.path.endsWith(docPath) || node.path.includes(docPath.replace('modules/', ''))) {
          return node;
        }
        if (node.children) {
          const found = findFileByPath(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    const target = findFileByPath(filesList);
    if (target) {
      setSelectedFile(target);
      showToast(`已跳转并打开文件: ${target.name}`);
    }
  };

  const handleAddComment = () => {
    if (!commentInput.trim()) {
      showToast('请输入评论内容');
      return;
    }

    const newComment: SkillCommentItem = {
      id: 'c_' + Date.now(),
      userName: '当前登录用户',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      userRole: '开发者',
      rating: 5,
      time: '刚刚',
      content: commentInput.trim(),
      likes: 0,
      isLiked: false
    };

    setComments([newComment, ...comments]);
    setCommentInput('');
    showToast('评论发表成功！');
  };

  const handleToggleCommentLike = (commentId: string) => {
    setLikedCommentIds(prev => {
      const current = !!prev[commentId];
      const updated = { ...prev, [commentId]: !current };
      
      setComments(list => list.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            likes: current ? Math.max(0, c.likes - 1) : c.likes + 1,
            isLiked: !current
          };
        }
        return c;
      }));

      showToast(!current ? '点赞成功' : '已取消点赞');
      return updated;
    });
  };

  // Render File Tree Node
  const renderFileNode = (node: SkillFileNode, depth = 0) => {
    if (node.type === 'folder') {
      const isOpen = !!openFolders[node.path];
      return (
        <div key={node.id} className="select-none">
          <div
            onClick={() => handleToggleFolder(node.path)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-xs text-slate-800 font-medium cursor-pointer transition"
            style={{ paddingLeft: `${depth * 16 + 12}px` }}
          >
            {isOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <Folder className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="font-mono">{node.name}</span>
          </div>

          {isOpen && node.children && (
            <div className="space-y-0.5">
              {node.children.map(child => renderFileNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // File item
    const isSelected = selectedFile?.id === node.id;
    return (
      <div
        key={node.id}
        onClick={() => handleSelectFile(node)}
        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition select-none ${
          isSelected
            ? 'bg-blue-50/80 text-blue-700 font-semibold border-l-2 border-blue-600'
            : 'hover:bg-slate-50 text-slate-700 font-medium'
        }`}
        style={{ paddingLeft: `${depth * 16 + 16}px` }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
          <span className="font-mono truncate">{node.name}</span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono ml-2 shrink-0">{node.size}</span>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6 select-none animate-fade-in pb-20 max-w-6xl mx-auto">
      
      {/* 1. Header Area (Matching skill详情-概述.png exactly) */}
      <div className="space-y-4">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>返回插件市场</span>
        </button>

        {/* Top Info Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            
            {/* Left: Icon, Title, Repo, Ratings, Description */}
            <div className="flex items-start gap-4 flex-1">
              
              {/* Skill Icon */}
              <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shadow-xs shrink-0">
                <div className="w-7 h-7 rounded-full border-4 border-amber-600 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-amber-600" />
                </div>
              </div>

              {/* Title & Meta Info */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  {skill.name}
                </h1>
                
                <div className="text-xs font-mono text-slate-500">
                  {skill.repoPath || `@user_a38fd8a2/${skill.id}`}
                </div>

                {/* Star Ratings, Safety and Source Badges */}
                <div className="flex flex-wrap items-center gap-3 pt-0.5 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center text-amber-500 text-xs">
                      {'★'.repeat(4)}{'☆'}
                    </div>
                    <span className="font-bold text-slate-800 ml-1">
                      {skill.aiRatingDesc || `${skill.aiRating || 4.3} 优秀 (AI 评分)`}
                    </span>
                  </div>

                  <span className="text-slate-300">•</span>

                  <div className="flex items-center gap-1 text-emerald-600 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{skill.securityStatus || '安全'}</span>
                  </div>

                  <span className="text-slate-300">•</span>

                  <div className="flex items-center gap-1 text-blue-600 font-medium">
                    <Puzzle className="w-3.5 h-3.5" />
                    <span>源自 {skill.source || 'SkillHub'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Actions (为 TA 投票, 分享, 下载) */}
            <div className="flex items-center gap-2.5 shrink-0 self-start">
              <button
                onClick={handleVote}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  hasVoted
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                }`}
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>为 TA 投票 ({voteCount})</span>
              </button>

              <button
                onClick={handleShare}
                className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>分享</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>下载 Skill 包</span>
              </button>
            </div>

          </div>

          {/* Description Paragraph */}
          <p className="text-xs text-slate-600 leading-relaxed font-normal pt-1">
            {skill.description}
          </p>

          {/* Tags row */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            {skill.tags?.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

        </div>

      </div>

      {/* 2. Navigation Tabs (Matching exact underline tabs style) */}
      <div className="flex items-center gap-8 border-b border-slate-200 text-sm font-medium px-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 relative transition cursor-pointer ${
            activeTab === 'overview'
              ? 'text-slate-900 font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>概述</span>
          {activeTab === 'overview' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('files')}
          className={`pb-3 relative transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'files'
              ? 'text-slate-900 font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>文件</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono">
            {totalFilesCount}
          </span>
          {activeTab === 'files' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          className={`pb-3 relative transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'comments'
              ? 'text-slate-900 font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>评论</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono">
            {comments.length}
          </span>
          {activeTab === 'comments' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 relative transition cursor-pointer ${
            activeTab === 'history'
              ? 'text-slate-900 font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>版本历史</span>
          {activeTab === 'history' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('benchmark')}
          className={`pb-3 relative transition cursor-pointer ${
            activeTab === 'benchmark'
              ? 'text-slate-900 font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>评测报告</span>
          {activeTab === 'benchmark' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
          )}
        </button>
      </div>

      {/* 3. TAB CONTENT AREA */}

      {/* 3.1 TAB: 概述 (Overview) - Exact match to skill详情-概述.png */}
      {activeTab === 'overview' && (
        <div className="space-y-8 bg-white p-8 rounded-2xl border border-slate-200/80 shadow-2xs">
          
          {/* Main Title Header */}
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {skill.name} ({skill.id.replace('sk_', '')})
            </h2>
          </div>

          {/* Section: 知识产权声明 */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">知识产权声明</h3>
            <p className="text-xs text-slate-600">
              {skill.copyrightNotice || `本技能及相关文档、脚本代码的著作权归${skill.developer}所有。`}
            </p>
          </div>

          {/* Section: 使用许可 */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-bold text-slate-900">使用许可:</h3>
            <div className="space-y-1.5 text-xs text-slate-700">
              {skill.licenseTerms ? (
                <>
                  {skill.licenseTerms.allowed.map((item, idx) => (
                    <div key={'allow_' + idx} className="flex items-center gap-2 text-slate-700">
                      <span className="text-emerald-600 font-bold">✔</span>
                      <span>{item}</span>
                    </div>
                  ))}
                  {skill.licenseTerms.forbidden.map((item, idx) => (
                    <div key={'forbid_' + idx} className="flex items-center gap-2 text-slate-700">
                      <span className="text-rose-600 font-bold">✖</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="text-emerald-600 font-bold">✔</span>
                    <span>允许个人学习、研究、非商业用途使用</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="text-emerald-600 font-bold">✔</span>
                    <span>允许修改后个人使用</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="text-rose-600 font-bold">✖</span>
                    <span>禁止直接复制核心算法用于商业产品或竞争性服务</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="text-rose-600 font-bold">✖</span>
                    <span>禁止移除或修改作者署名后重新分发</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="text-rose-600 font-bold">✖</span>
                    <span>禁止将本技能包装成独立产品对外销售</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Section: 免责声明 */}
          <div className="space-y-2">
            <p className="text-xs text-slate-700">
              <strong className="text-slate-900">免责声明：</strong>
              {skill.disclaimer || '本技能提供的分析结果仅供参考，不构成投资建议。使用者应自行判断并承担投资风险。'}
            </p>
          </div>

          {/* Section: 作者与方法论背景 */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700 leading-relaxed">
            <p>
              {skill.authorBio || `基于《股市真规则》（The Five Rules for Successful Stock Investing）的完整投资分析框架，由晨星公司首席股票分析师帕特·多尔西(Pat Dorsey)方法论构建。`}
            </p>
            <p className="font-bold text-slate-900">
              作者：{skill.authorSignature || skill.developer}
            </p>
          </div>

          {/* Section: 依赖技能表格 */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-900">依赖技能</h3>
            <p className="text-xs text-slate-500">本技能依赖以下技能，请确保已安装：</p>
            
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="py-2.5 px-4 w-1/4">依赖技能</th>
                    <th className="py-2.5 px-4 w-1/2">用途</th>
                    <th className="py-2.5 px-4 w-1/4">安装命令</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
                  {(skill.dependencies || [
                    {
                      name: 'pdf-parser',
                      purpose: '提取财报PDF中的财务数据',
                      installCmd: 'clawhub install pdf-parser'
                    }
                  ]).map((dep, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{dep.name}</td>
                      <td className="py-2.5 px-4">{dep.purpose}</td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center justify-between bg-purple-50/70 text-purple-700 px-2.5 py-1 rounded-md font-mono text-[11px] border border-purple-100">
                          <span>{dep.installCmd}</span>
                          <button
                            onClick={() => handleCopyText(dep.installCmd, 'dep_' + idx)}
                            className="text-purple-600 hover:text-purple-900 ml-2"
                            title="复制命令"
                          >
                            {copiedCmd === 'dep_' + idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: 系统架构 (ASCII Box Diagram) */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-900">系统架构</h3>
            
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 overflow-x-auto leading-tight shadow-inner">
              <pre>{skill.systemArchAscii || `+-------------------------------------------------------------------------+
|                           投资决策整合框架                                |
|                 modules/investment_decision_framework.md                |
+-------------------------------------------------------------------------+
                                     |
    +--------------------------------+--------------------------------+
    |                                |                                |
    v                                v                                v
+------------------+     +------------------+     +------------------+
|    护城河分析    |     |     财务分析     |     |    管理层评估    |
|       模块       |     |       模块       |     |       模块       |
|      (Moat)      |     |    (Financial)   |     |   (Management)   |
+------------------+     +------------------+     +------------------+
                                     |
                                     v
                         +----------------------+
                         |       行业分析       |
                         |         模块         |
                         |      (Industry)      |
                         +----------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                              工具层 (Tools)                             |
|  - DCF计算器        - 估值快照           - 同业对比                     |
|  - Watchlist管理    - 财务健康检查       - 护城河检查清单               |
+-------------------------------------------------------------------------+`}</pre>
            </div>
          </div>

          {/* Section: 核心模块表格 */}
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">核心模块</h3>
              <p className="text-xs text-slate-500">
                {skill.backgroundDesc || '价值投资导向的股票估值分析工具集，专为长期持有、商业模式优先、估值合理的投资风格设计。'}
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="py-2.5 px-4 w-1/4">模块</th>
                    <th className="py-2.5 px-4 w-1/2">功能</th>
                    <th className="py-2.5 px-4 w-1/4">文档路径</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
                  {(skill.coreModules || [
                    {
                      name: '护城河分析',
                      functionDesc: '五步检验法识别可持续竞争优势',
                      docPath: 'modules/moat_analysis.md'
                    },
                    {
                      name: '财务分析',
                      functionDesc: '六步财务健康检查与会计质量评估',
                      docPath: 'modules/financial_analysis.md'
                    },
                    {
                      name: '管理层评估',
                      functionDesc: '三维评估框架（能力/诚信/股东导向）',
                      docPath: 'modules/management_evaluation.md'
                    },
                    {
                      name: '行业分析',
                      functionDesc: '生命周期定位与行业特定指标',
                      docPath: 'modules/industry_analysis.md'
                    }
                  ]).map((mod, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-bold text-slate-900">{mod.name}</td>
                      <td className="py-2.5 px-4 text-slate-600">{mod.functionDesc}</td>
                      <td className="py-2.5 px-4">
                        <button
                          onClick={() => handleJumpToFile(mod.docPath)}
                          className="font-mono text-purple-600 hover:text-purple-800 hover:underline bg-purple-50/50 px-2 py-0.5 rounded text-[11px] text-left cursor-pointer"
                        >
                          {mod.docPath}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 3.2 TAB: 文件 (Files Tree & Preview) - Exact match to skill详情-文件.png */}
      {activeTab === 'files' && (
        <div className="space-y-4">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left: File Tree Explorer (4 Columns) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
              
              {/* Header: Total Files Count */}
              <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>共 {totalFilesCount} 个文件</span>
                <span className="text-[11px] text-slate-400 font-mono">/root</span>
              </div>

              {/* Tree list */}
              <div className="p-2 space-y-0.5 max-h-[540px] overflow-y-auto">
                {filesList.map(node => renderFileNode(node, 0))}
              </div>

            </div>

            {/* Right: File Content Previewer (8 Columns) */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col min-h-[480px]">
              
              {selectedFile ? (
                <>
                  {/* File preview header toolbar */}
                  <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileCode className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="font-mono font-bold text-slate-800 truncate">
                        {selectedFile.path}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-[10px]">
                        {selectedFile.size}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedFile.content || '');
                          setCopiedFileCode(true);
                          showToast(`已复制文件【${selectedFile.name}】源码`);
                          setTimeout(() => setCopiedFileCode(false), 2000);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                      >
                        {copiedFileCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">已复制</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>复制代码</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => showToast(`已下载文件【${selectedFile.name}】`)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition shadow-2xs cursor-pointer"
                        title="下载此文件"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* File preview content area */}
                  <div className="p-5 font-mono text-xs text-slate-800 overflow-x-auto leading-relaxed flex-1 bg-white">
                    <pre className="whitespace-pre font-mono">
                      {selectedFile.content || '// 文件为空或暂无文本内容'}
                    </pre>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400 space-y-2">
                  <FileText className="w-8 h-8 text-slate-300" />
                  <p className="text-xs">请在左侧文件树中点击任意文件进行在线预览</p>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* 3.3 TAB: 评论 (Comments) - Exact match to skill详情-评论.png */}
      {activeTab === 'comments' && (
        <div className="space-y-6">
          
          {/* Top: Comment Input Box Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
            
            {/* Target author prompt & Character count */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">与 {skill.authorSignature || skill.developer} 一起讨论这个 Skill</span>
              <span className="font-mono text-slate-400">{commentInput.length}/500</span>
            </div>

            {/* Textarea */}
            <textarea
              value={commentInput}
              onChange={e => setCommentInput(e.target.value.slice(0, 500))}
              placeholder="写下你的评论（最多 500 字）"
              rows={4}
              className="w-full p-3.5 rounded-xl bg-slate-50/50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition resize-none leading-relaxed"
            />

            {/* Bottom tools: Emojis, Image Upload & Submit Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              
              {/* Emojis list & Upload placeholder */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {emojis.map((emoji, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCommentInput(prev => (prev + emoji).slice(0, 500))}
                      className="p-1 rounded hover:bg-slate-100 text-sm transition cursor-pointer"
                      title="插入表情"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <div className="h-3 w-px bg-slate-200" />

                <button
                  onClick={() => showToast('已打开图片选择器 (0/9)')}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>上传图片 (0/9)</span>
                </button>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleAddComment}
                className="px-5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
              >
                发表评论
              </button>

            </div>

          </div>

          {/* Bottom: Comments List Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-6">
            
            {/* Header: Title & Hot/Latest Filter */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                评论 ({comments.length})
              </h3>

              <div className="flex items-center p-0.5 rounded-lg bg-slate-100 text-xs">
                <button
                  onClick={() => setCommentSort('hot')}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                    commentSort === 'hot' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  热门
                </button>
                <button
                  onClick={() => setCommentSort('latest')}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                    commentSort === 'latest' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  最新
                </button>
              </div>
            </div>

            {/* List */}
            {comments.length === 0 ? (
              <div className="py-12 text-center space-y-1 text-slate-400 text-xs">
                <p>还没有评论，来抢沙发吧</p>
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map(c => {
                  const isLiked = !!likedCommentIds[c.id];
                  return (
                    <div key={c.id} className="space-y-3 pb-5 border-b border-slate-100 last:border-0 last:pb-0">
                      
                      {/* User Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={c.userAvatar}
                            alt={c.userName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{c.userName}</span>
                              {c.userRole && (
                                <span className="px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 text-[10px] font-medium">
                                  {c.userRole}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium">{c.time}</div>
                          </div>
                        </div>

                        {/* Likes counter button */}
                        <button
                          onClick={() => handleToggleCommentLike(c.id)}
                          className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition cursor-pointer ${
                            isLiked
                              ? 'bg-rose-50 text-rose-600 font-bold'
                              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{c.likes}</span>
                        </button>
                      </div>

                      {/* Content */}
                      <p className="text-xs text-slate-700 leading-relaxed pl-10">
                        {c.content}
                      </p>

                      {/* Author Replies if any */}
                      {c.replies && c.replies.length > 0 && (
                        <div className="ml-10 p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                          {c.replies.map(rep => (
                            <div key={rep.id} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <img
                                    src={rep.userAvatar}
                                    alt={rep.userName}
                                    className="w-5 h-5 rounded-full object-cover"
                                  />
                                  <span className="text-xs font-bold text-slate-900">{rep.userName}</span>
                                  {rep.userRole && (
                                    <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                                      {rep.userRole}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400">{rep.time}</span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                                {rep.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      )}

      {/* 3.4 TAB: 版本历史 (Version History) */}
      {activeTab === 'history' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">版本迭代历史</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-xs font-mono font-bold">
                    {skill.version}
                  </span>
                  <span className="text-xs font-bold text-slate-900">首发正式版</span>
                </div>
                <span className="text-xs text-slate-400">{skill.updatedAt || '4个月前更新'}</span>
              </div>
              <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pt-1">
                <li>集成晨星护城河五步检验法分析框架</li>
                <li>实现 DCF 自由现金流折现三阶段估值模型</li>
                <li>增加全量财务健康指标审计与杜邦分解能力</li>
                <li>支持输出格式化 Markdown 研报与一键复制</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 3.5 TAB: 评测报告 (Benchmark Report) */}
      {activeTab === 'benchmark' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">AI 自动化安全与性能评测报告</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
              <div className="text-xs text-emerald-700 font-bold">代码安全合规</div>
              <div className="text-2xl font-black text-emerald-800">100%</div>
              <div className="text-[11px] text-emerald-600">无高危系统调用与外联敏感数据</div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
              <div className="text-xs text-blue-700 font-bold">Agent 执行平均延迟</div>
              <div className="text-2xl font-black text-blue-800">120 ms</div>
              <div className="text-[11px] text-blue-600">极速本地执行与规则推理</div>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1">
              <div className="text-xs text-purple-700 font-bold">综合能力评分</div>
              <div className="text-2xl font-black text-purple-800">4.3 / 5.0</div>
              <div className="text-[11px] text-purple-600">评级为“优秀”实用级 Skill</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
