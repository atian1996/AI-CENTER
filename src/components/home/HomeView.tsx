import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  Briefcase, 
  Cpu, 
  Calendar, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  Megaphone, 
  Trophy, 
  TrendingUp, 
  Award,
  Zap,
  Activity,
  UserCheck,
  Palette,
  BarChart3,
  ShieldAlert,
  Landmark,
  Rocket,
  MessageSquare,
  Clock,
  Coins,
  CheckCircle2,
  Users,
  Layers,
  ChevronRight,
  ExternalLink,
  Star,
  Tag,
  ShieldCheck,
  FileText,
  Boxes,
  Compass,
  Play,
  Heart,
  Eye,
  Building2,
  Check,
  Server,
  Sparkle,
  Search,
  Code2
} from 'lucide-react';

// 创意空间 5 大方向卡片数据（融合高质感科技插画背景与前沿赛题）
const creativeHubCards = [
  {
    id: 'ai_design',
    title: 'AI创意方案',
    englishTitle: 'AI Creative Solutions',
    slogan: '用AI设计看得见的未来',
    desc: '从AIGC多模态内容生成到软硬件方案，用AI工具把想法变成可落地的设计。',
    tag: 'AIGC 方案赛',
    icon: Palette,
    colorClass: 'text-purple-600',
    bgClass: 'bg-purple-50/40 hover:bg-purple-50/80 border-purple-200/80 hover:border-purple-300',
    iconBg: 'bg-purple-100 text-purple-600',
    image: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=500&auto=format&fit=crop&q=80',
    accentGradient: 'from-purple-500/15 via-indigo-500/5 to-transparent',
    url: 'https://adworld.xctf.org.cn/competitions-hall/competitions'
  },
  {
    id: 'ai_data_science',
    title: 'AI数据科学',
    englishTitle: 'AI Data Science',
    slogan: '用数据训练更聪明的模型',
    desc: '在真实业务数据集中打磨算法，构建销量预测、分类识别与时序预测模型。',
    tag: '数据科学赛',
    icon: BarChart3,
    colorClass: 'text-cyan-600',
    bgClass: 'bg-cyan-50/40 hover:bg-cyan-50/80 border-cyan-200/80 hover:border-cyan-300',
    iconBg: 'bg-cyan-100 text-cyan-600',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=80',
    accentGradient: 'from-cyan-500/15 via-blue-500/5 to-transparent',
    url: 'https://adworld.xctf.org.cn/competitions-hall/competitions'
  },
  {
    id: 'ai_security',
    title: 'AI安全挑战',
    englishTitle: 'AI Security Challenge',
    slogan: '用AI对抗AI，守护数字世界',
    desc: '在真实模拟攻防中，用智能体（Agent）去发现漏洞、破解谜题、抵御未知攻击。',
    tag: '渗透解题赛',
    icon: ShieldAlert,
    colorClass: 'text-emerald-600',
    bgClass: 'bg-emerald-50/40 hover:bg-emerald-50/80 border-emerald-200/80 hover:border-emerald-300',
    iconBg: 'bg-emerald-100 text-emerald-600',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=80',
    accentGradient: 'from-emerald-500/15 via-teal-500/5 to-transparent',
    url: 'https://adworld.xctf.org.cn/competitions-hall/competitions'
  },
  {
    id: 'gov_humanities',
    title: '政务人文',
    englishTitle: 'Gov & Humanities',
    slogan: '用创意点亮城市人文',
    desc: '挖掘本地文化故事、辅助政务宣传创意、用AI视角重新发现与构建城市的美好。',
    tag: '政务宣传平台',
    icon: Landmark,
    colorClass: 'text-amber-600',
    bgClass: 'bg-amber-50/40 hover:bg-amber-50/80 border-amber-200/80 hover:border-amber-300',
    iconBg: 'bg-amber-100 text-amber-600',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=500&auto=format&fit=crop&q=80',
    accentGradient: 'from-amber-500/15 via-orange-500/5 to-transparent'
  },
  {
    id: 'ai_application',
    title: 'AI应用创意',
    englishTitle: 'AI Application Showcase',
    slogan: '用AI解决真实世界的问题',
    desc: '从智能助手到行业应用落地，汇集各类脑洞大开的落地 AI 项目与前沿集成。',
    tag: '项目集成平台',
    icon: Rocket,
    colorClass: 'text-indigo-600',
    bgClass: 'bg-indigo-50/40 hover:bg-indigo-50/80 border-indigo-200/80 hover:border-indigo-300',
    iconBg: 'bg-indigo-100 text-indigo-600',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80',
    accentGradient: 'from-indigo-500/15 via-purple-500/5 to-transparent',
    url: 'http://10.4.5.3/page/mg/project-hall'
  }
];

// 合作伙伴列表
const partnerList = [
  { name: '中国电信', tag: '天翼云算力协同', logoText: 'CHINA TELECOM', badge: '5G算力直连' },
  { name: '中国移动', tag: '九天大模型合作', logoText: 'CHINA MOBILE', badge: '边缘计算集群' },
  { name: '中国联通', tag: '联通云生态共建', logoText: 'CHINA UNICOM', badge: '云网融合底座' },
  { name: '华为云', tag: '昇腾 AI 生态支持', logoText: 'HUAWEI CLOUD', badge: '昇腾 NPU 适配' },
  { name: '阿里云百炼', tag: '通义千问战略伙伴', logoText: 'ALIBABA CLOUD', badge: '百炼大模型矩阵' },
  { name: '腾讯云 TI', tag: '知识图谱与向量库', logoText: 'TENCENT CLOUD', badge: 'TI 平台生态' }
];

export const HomeView: React.FC = () => {
  const { 
    setActiveTab, 
    setMarketplaceTab,
    setWorkspaceSubTab, 
    checkInToday, 
    hasCheckedInToday, 
    setCreateAgentModalOpen,
    setPublishTaskModalOpen,
    setCreateComputeModalOpen,
    posts,
    agents,
    tasks,
    skills,
    openAgentDetail,
    setSandboxAgent,
    showToast
  } = useApp();

  // Banner 状态与自动轮播
  const [currentBanner, setCurrentBanner] = useState(0);

  // 区域四 Tab 切换
  const [contentTab, setContentTab] = useState<'hot' | 'latest_agents' | 'latest_tasks' | 'creative' | 'hot_posts'>('hot');

  // Banner 轮播定时器
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // 自定义 Banner 列表数据（明亮通透的科技全景风格）
  const bannerList = [
    {
      id: 'b1',
      title: '发现 AI 智能体的无限可能',
      subtitle: '全栈 Agent 资产即开即用，融合多模型推理、知识库检索与工具调用，加速业务智能化跃迁',
      badge: 'Agent 商店 · 精选资产',
      techTag: 'NEURAL AGENT MATRIX',
      targetTab: 'marketplace' as const,
      subMarketplaceTab: 'agent' as const,
      baseGradient: 'from-slate-900 via-indigo-950/90 to-indigo-900/60',
      badgeBg: 'bg-indigo-500/25 text-indigo-200 border-indigo-400/40',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&auto=format&fit=crop&q=80',
      heroMetric: { title: '精选智能体', val: '350+ 款' },
      tag1: '极速纳秒级路由',
      tag2: '企业级安全沙箱'
    },
    {
      id: 'b2',
      title: '算力随行 · 极客 GPU 容器云',
      subtitle: '一键秒级拉起 RTX 5090、PRO 6000 与 H100 实例，预装 JupyterLab、ComfyUI 与微调环境',
      badge: '算力工坊 · 极速启动',
      techTag: 'GPU COMPUTE CLUSTER',
      targetTab: 'compute' as const,
      subMarketplaceTab: undefined,
      baseGradient: 'from-slate-900 via-cyan-950/90 to-blue-900/60',
      badgeBg: 'bg-cyan-500/25 text-cyan-200 border-cyan-400/40',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&auto=format&fit=crop&q=80',
      heroMetric: { title: '实例启动速度', val: '< 3.2s' },
      tag1: '秒级弹性计费',
      tag2: '预装大模型环境'
    },
    {
      id: 'b3',
      title: '用 AI 创造未来的无限想象',
      subtitle: '5 大前沿创意赛道全面开放，从 AIGC 多模态设计、数据科学建模到攻防安全与产业落地',
      badge: '创意空间 · 赛题征集',
      techTag: 'CREATIVE HACKATHON',
      targetTab: 'creative' as const,
      subMarketplaceTab: undefined,
      baseGradient: 'from-slate-900 via-purple-950/90 to-fuchsia-900/60',
      badgeBg: 'bg-purple-500/25 text-purple-200 border-purple-400/40',
      image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1600&auto=format&fit=crop&q=80',
      heroMetric: { title: '创意总奖池', val: '100,000+' },
      tag1: '官方认证背书',
      tag2: '优秀成果直接孵化'
    }
  ];

  const currentBannerData = bannerList[currentBanner];

  // 滚动动态列表
  const tickerEvents = [
    { id: 't1', text: '张三发布了新Agent「智能客服」', tag: '新Agent', targetTab: 'marketplace', subTab: 'agent' },
    { id: 't2', text: '李四完成了「金融数据分析」任务 (获得 8,000 赏金)', tag: '任务完成', targetTab: 'tasks' },
    { id: 't3', text: '王五在社区发表了「LLM微调实战与vLLM压测」干货热帖', tag: '社区精选', targetTab: 'community' },
    { id: 't4', text: '赵六获得了平台「AI认证架构师」专业徽章', tag: '开发者荣誉', targetTab: 'workspace' },
    { id: 't5', text: '华西数字医疗课题组上架了「三甲医院全科医疗预诊助手」', tag: '医疗专区', targetTab: 'marketplace', subTab: 'agent' },
    { id: 't6', text: '极客小千开源了全新 Skill 插件「股票价值投资分析系统」', tag: 'Skill上新', targetTab: 'marketplace', subTab: 'skill' }
  ];

  // 动态信息流（用于区域六右侧）
  const followFeeds = [
    {
      id: 'ff1',
      author: '华西数字医疗课题组',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80',
      action: '发布了新 Agent',
      targetName: '【三甲医院全科医疗预诊助手】',
      preview: '支持结合患者体检指标与主诉进行辅助分诊建议。',
      time: '10分钟前',
      actionBtn: '去试用',
      onAction: () => {
        const ag = agents.find(a => a.id === 'ag_04') || agents[0];
        if (ag) setSandboxAgent(ag);
      }
    },
    {
      id: 'ff2',
      author: '王AI-深度架构师',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      action: '发表了深度技术贴',
      targetName: '《DeepSeek-R1 8B/32B vLLM 高并发部署优化全指南》',
      preview: '通过 Chunked Prefill 机制降低 40% 首字延迟...',
      time: '1小时前',
      actionBtn: '看帖子',
      onAction: () => setActiveTab('community')
    },
    {
      id: 'ff3',
      author: '北京天元律所',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      action: '发布了悬赏任务',
      targetName: '【定制基于 Qwen2.5 的律所合同审查 Agent】',
      preview: '赏金 ¥8,000，急需合同审核与合规风险识别专家...',
      time: '2小时前',
      actionBtn: '去投标',
      onAction: () => setActiveTab('tasks')
    },
    {
      id: 'ff4',
      author: '弗兰克斯基 (Franski)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      action: '更新了 Skill 插件',
      targetName: '【腾讯文档企业知识库同步组件 v1.2】',
      preview: '新增表格与多维表实时双向写入支持。',
      time: '3小时前',
      actionBtn: '看插件',
      onAction: () => {
        setActiveTab('marketplace');
        setMarketplaceTab('skill');
      }
    },
    {
      id: 'ff5',
      author: '陈Workflow',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      action: '在算力工坊启动了容器',
      targetName: '【ComfyUI Official + Flux.1 Base】',
      preview: '上海机房 RTX 4090 24GB 正在渲染超清插画。',
      time: '4小时前',
      actionBtn: '去看看',
      onAction: () => setActiveTab('compute')
    },
    {
      id: 'ff6',
      author: 'SuperQuant',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      action: '积分榜登顶',
      targetName: '蝉联周榜第一名 (累计 128,500 积分)',
      preview: '贡献了 14 款热门量化策略 Agent 与 8 套清洗数据集。',
      time: '5小时前',
      actionBtn: '看榜单',
      onAction: () => setActiveTab('workspace')
    }
  ];

  // 区域四热门混合列表生成
  const hotMixedList = [
    {
      type: 'agent',
      typeLabel: '热门Agent',
      typeBadgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      title: '智能全科客服与售后工单 Agent',
      desc: '自动解答多轮咨询，支持对接企业 ERP 并生成故障工单。',
      rating: 4.9,
      hotMetric: '3.4k次使用',
      date: '2026-08-12',
      price: '免费',
      icon: '🤖',
      onClick: () => {
        const target = agents.find(a => a.id === 'ag_01') || agents[0];
        openAgentDetail(target);
      }
    },
    {
      type: 'agent',
      typeLabel: '热门Agent',
      typeBadgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      title: '股票价值投资分析与财报研报 Agent',
      desc: '输入股票代码，自动抓取财报并输出巴菲特估值决策分析。',
      rating: 4.8,
      hotMetric: '2.8k次使用',
      date: '2026-08-11',
      price: '¥0.01/次',
      icon: '📈',
      onClick: () => {
        const target = agents.find(a => a.id === 'ag_02') || agents[1];
        openAgentDetail(target);
      }
    },
    {
      type: 'task',
      typeLabel: '高额悬赏',
      typeBadgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      title: '【悬赏】定制基于 Qwen2.5 的律所合同审查 Agent',
      desc: '自动识别劳动合同与采购协议风险，支持输出红线修改建议。',
      rating: 5.0,
      hotMetric: '14人投标',
      date: '剩余12天',
      price: '¥8,000',
      icon: '📋',
      onClick: () => setActiveTab('tasks')
    },
    {
      type: 'task',
      typeLabel: '重点招标',
      typeBadgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      title: '【招标】微调 70B 医疗多模态大模型',
      desc: '要求 CT/X光片图像与电子病历联合推理，BLEU-4>0.42。',
      rating: 4.9,
      hotMetric: '8家团队竞标',
      date: '剩余28天',
      price: '¥35,000',
      icon: '🩺',
      onClick: () => setActiveTab('tasks')
    },
    {
      type: 'creative',
      typeLabel: '创意竞赛',
      typeBadgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      title: '“创新杯” AI 创意方案与赛博朋克生成赛',
      desc: '用AI设计看得见的未来，5大方向赛题面向全网征集。',
      rating: 4.9,
      hotMetric: '1,200人关注',
      date: '火热报名中',
      price: '50,000积分',
      icon: '💡',
      onClick: () => setActiveTab('creative')
    },
    {
      type: 'post',
      typeLabel: '社区热帖',
      typeBadgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      title: '【干货】DeepSeek-R1 8B/32B vLLM 高并发部署优化全指南',
      desc: '首 Token 延迟下降 40% 的全套配置与评测日志分享。',
      rating: 5.0,
      hotMetric: '128赞 · 34评',
      date: '2小时前',
      price: '干货精选',
      icon: '📝',
      onClick: () => setActiveTab('community')
    },
    {
      type: 'skill',
      typeLabel: 'Skill插件',
      typeBadgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      title: '股票价值投资分析系统 (ClawHub插件)',
      desc: '标准 Tool 规范，赋能任意智能体一键解析 A 股深度估值。',
      rating: 4.9,
      hotMetric: '3.3万次安装',
      date: 'v1.0.0',
      price: '免费开源',
      icon: '⚡',
      onClick: () => {
        setActiveTab('marketplace');
        setMarketplaceTab('skill');
      }
    },
    {
      type: 'agent',
      typeLabel: '热门Agent',
      typeBadgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      title: '多语言代码重构与单元测试生成 Agent',
      desc: '支持 Python/TS/Java/Go 代码异味识别与一键生成全覆盖用例。',
      rating: 4.8,
      hotMetric: '1.9k次使用',
      date: '2026-08-10',
      price: '按Token计费',
      icon: '💻',
      onClick: () => {
        const target = agents.find(a => a.id === 'ag_03') || agents[2];
        openAgentDetail(target);
      }
    }
  ];

  return (
    <div className="w-full space-y-8 animate-fade-in pb-16 select-none text-slate-800">
      
      {/* =========================================================================
          区域一 + 区域二：Banner + 快捷入口（左右并排布局 68% : 32%）
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* 左侧 Banner（明亮通透全幅科技大图，从右往左自然透明融合，点击卡片直接跳转） */}
        <div 
          onClick={() => {
            setActiveTab(currentBannerData.targetTab);
            if (currentBannerData.subMarketplaceTab) {
              setMarketplaceTab(currentBannerData.subMarketplaceTab);
            }
          }}
          className={`lg:col-span-8 relative rounded-3xl p-8 lg:p-9 bg-gradient-to-r ${currentBannerData.baseGradient} border border-slate-700/60 shadow-xl overflow-hidden flex flex-col justify-between min-h-[360px] cursor-pointer group hover:border-indigo-400/80 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 select-none`}
        >
          {/* 1. 全景科技背景大图（铺满整个 Banner，高透明亮，悬浮微放大） */}
          <img 
            src={currentBannerData.image} 
            alt={currentBannerData.title}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-70 group-hover:scale-105 group-hover:opacity-85 transition-all duration-1000 ease-out pointer-events-none"
          />

          {/* 2. 从右往左渐渐透明的平滑半透遮罩（左侧深蓝灰保证文字 100% 清晰，右侧透亮科技大图自然呈现） */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 via-50% to-slate-900/10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
          
          {/* 3. 柔和的亮色极光光晕，提升整体明亮度与通透感 */}
          <div className="absolute -top-12 right-1/4 w-96 h-96 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 right-10 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* 4. 精致的赛博微网格与顶部亮色细线 */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none" />
          <div className="absolute left-0 right-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-300/80 to-transparent pointer-events-none" />

          {/* 5. 右上角：明亮跳转微提示 */}
          <div className="absolute top-6 right-6 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-600 text-slate-200 text-xs font-semibold backdrop-blur-md group-hover:border-indigo-300 group-hover:text-white group-hover:bg-indigo-600/60 transition-all shadow-md">
            <span>点击直达</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* 6. Banner 左侧核心文案区 */}
          <div className="relative z-10 space-y-4 max-w-xl">
            {/* 顶栏 Badge 与 Tech Tag */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black border shadow-xs ${currentBannerData.badgeBg}`}>
                <Sparkle className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
                <span>{currentBannerData.badge}</span>
              </div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-300 uppercase bg-slate-800/90 border border-slate-700 px-2.5 py-0.5 rounded shadow-2xs">
                {currentBannerData.techTag}
              </span>
            </div>

            {/* 大标题（更加明亮饱满） */}
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-white tracking-tight leading-tight drop-shadow-md group-hover:text-indigo-100 transition-colors">
              {currentBannerData.title}
            </h1>

            {/* 副标题说明 */}
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-medium line-clamp-2 drop-shadow-2xs">
              {currentBannerData.subtitle}
            </p>
          </div>

          {/* 7. Banner 底部特性胶囊与指示器 */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-700/60 mt-6">
            {/* 核心亮点特性标签 */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-100 bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-2xs backdrop-blur-xs">
                <Cpu className="w-3.5 h-3.5 text-indigo-300" />
                <span>{currentBannerData.tag1}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-100 bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-2xs backdrop-blur-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                <span>{currentBannerData.tag2}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-100 bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-2xs backdrop-blur-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{currentBannerData.heroMetric.title}: <strong className="text-indigo-300 font-mono font-black">{currentBannerData.heroMetric.val}</strong></span>
              </span>
            </div>

            {/* 3 张图圆点指示器（点击圆点切换，阻止冒泡） */}
            <div 
              className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 shadow-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {bannerList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentBanner(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentBanner ? 'w-6 bg-indigo-400 shadow-md' : 'w-2 bg-slate-600 hover:bg-slate-400'
                  }`}
                  aria-label={`切换到第 ${idx + 1} 张 Banner`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 右侧快捷入口（网格布局 2列 × 3行，共 6 个入口，科技质感卡片） */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-3.5">
          
          {/* 1. 使用Agent */}
          <button
            onClick={() => {
              setActiveTab('marketplace');
              setMarketplaceTab('agent');
            }}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5 transition-all shadow-2xs flex flex-col justify-between text-left cursor-pointer group relative overflow-hidden"
          >
            {/* 科技背景底纹 */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-[radial-gradient(#6366f1_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-2xs">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
              </div>
            </div>
            <div className="mt-3 relative z-10">
              <div className="text-xs font-black text-slate-900 group-hover:text-indigo-600 flex items-center gap-1">
                🤖 使用Agent
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                浏览与运行已上架智能体
              </div>
            </div>
          </button>

          {/* 2. 启动算力 */}
          <button
            onClick={() => setCreateComputeModalOpen(true)}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-0.5 transition-all shadow-2xs flex flex-col justify-between text-left cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors shadow-2xs">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition" />
              </div>
            </div>
            <div className="mt-3 relative z-10">
              <div className="text-xs font-black text-slate-900 group-hover:text-cyan-600 flex items-center gap-1">
                ⚡ 启动算力
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                Jupyter / ComfyUI 一键拉起
              </div>
            </div>
          </button>

          {/* 3. 创建Agent */}
          <button
            onClick={() => {
              setActiveTab('workspace');
              setWorkspaceSubTab('assets');
              setCreateAgentModalOpen(true);
            }}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-0.5 transition-all shadow-2xs flex flex-col justify-between text-left cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-[radial-gradient(#a855f7_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-2xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition" />
              </div>
            </div>
            <div className="mt-3 relative z-10">
              <div className="text-xs font-black text-slate-900 group-hover:text-purple-600 flex items-center gap-1">
                ✨ 创建Agent
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                向导式自定义专属智能体
              </div>
            </div>
          </button>

          {/* 4. 发布任务 */}
          <button
            onClick={() => setPublishTaskModalOpen(true)}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-0.5 transition-all shadow-2xs flex flex-col justify-between text-left cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-2xs">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition" />
              </div>
            </div>
            <div className="mt-3 relative z-10">
              <div className="text-xs font-black text-slate-900 group-hover:text-amber-600 flex items-center gap-1">
                📋 发布任务
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                悬赏与定制需求在线撮合
              </div>
            </div>
          </button>

          {/* 5. 创意空间 */}
          <button
            onClick={() => setActiveTab('creative')}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 transition-all shadow-2xs flex flex-col justify-between text-left cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-2xs">
                <Zap className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
              </div>
            </div>
            <div className="mt-3 relative z-10">
              <div className="text-xs font-black text-slate-900 group-hover:text-blue-600 flex items-center gap-1">
                💡 创意空间
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                5 大前沿赛题方向探索
              </div>
            </div>
          </button>

          {/* 6. 每日签到 */}
          <button
            onClick={checkInToday}
            className={`p-4 rounded-2xl bg-white border ${
              hasCheckedInToday ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200/80 hover:border-emerald-400'
            } hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5 transition-all shadow-2xs flex flex-col justify-between text-left cursor-pointer group relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-2xs ${
                hasCheckedInToday ? 'bg-emerald-600 text-white' : 'bg-emerald-50 border border-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
              }`}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-200">
                +5 积分
              </span>
            </div>
            <div className="mt-3 relative z-10">
              <div className="text-xs font-black text-slate-900 group-hover:text-emerald-600 flex items-center gap-1">
                ✅ 每日签到
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                {hasCheckedInToday ? '今日已签到 (明日再来)' : '点击签到领 5 积分'}
              </div>
            </div>
          </button>

        </div>

      </div>

      {/* =========================================================================
          区域三：平台动态（滚动通知条 - 高阶浅色风格）
      ========================================================================= */}
      <div className="w-full bg-indigo-50/70 text-slate-700 rounded-2xl px-5 py-3 border border-indigo-100/90 shadow-2xs flex items-center gap-3.5 overflow-hidden">
        <div className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1 rounded-xl text-xs font-black shrink-0 shadow-xs">
          <Megaphone className="w-3.5 h-3.5" />
          <span>平台动态</span>
        </div>

        {/* 动态滚动条 */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex items-center gap-8 whitespace-nowrap text-xs text-slate-700 animate-marquee hover:[animation-play-state:paused]">
            {tickerEvents.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => {
                  setActiveTab(item.targetTab as any);
                  if (item.subTab) setMarketplaceTab(item.subTab as any);
                }}
                className="inline-flex items-center gap-2.5 hover:text-indigo-600 transition cursor-pointer"
              >
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-indigo-700 border border-indigo-200/80 shadow-2xs">
                  {item.tag}
                </span>
                <span className="font-medium text-slate-800">{item.text}</span>
                {idx < tickerEvents.length - 1 && <span className="text-slate-300 font-black">│</span>}
              </div>
            ))}
            {/* 复制一遍用于无缝循环 */}
            {tickerEvents.map((item) => (
              <div
                key={`dup_${item.id}`}
                onClick={() => {
                  setActiveTab(item.targetTab as any);
                  if (item.subTab) setMarketplaceTab(item.subTab as any);
                }}
                className="inline-flex items-center gap-2.5 hover:text-indigo-600 transition cursor-pointer"
              >
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-indigo-700 border border-indigo-200/80 shadow-2xs">
                  {item.tag}
                </span>
                <span className="font-medium text-slate-800">{item.text}</span>
                <span className="text-slate-300 font-black">│</span>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={() => setActiveTab('community')}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 shrink-0 ml-2 cursor-pointer"
        >
          <span>查看动态</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* =========================================================================
          区域四：内容推荐区（Tab切换 + 卡片网格 2行×4列）
      ========================================================================= */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
        
        {/* Tab 切换栏（5个Tab） */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                精选内容推荐
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                多维综合算法推荐 · 全域资产一键直达
              </p>
            </div>
          </div>

          {/* 5 个 Tab 切换按钮 */}
          <div className="flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/70 overflow-x-auto">
            <button
              onClick={() => setContentTab('hot')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                contentTab === 'hot'
                  ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>🔥 热门推荐</span>
            </button>

            <button
              onClick={() => setContentTab('latest_agents')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                contentTab === 'latest_agents'
                  ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-indigo-500" />
              <span>📦 最新Agent</span>
            </button>

            <button
              onClick={() => setContentTab('latest_tasks')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                contentTab === 'latest_tasks'
                  ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-500" />
              <span>📋 最新任务</span>
            </button>

            <button
              onClick={() => setContentTab('creative')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                contentTab === 'creative'
                  ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-purple-500" />
              <span>💡 创意空间</span>
            </button>

            <button
              onClick={() => setContentTab('hot_posts')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                contentTab === 'hot_posts'
                  ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
              <span>📝 社区热帖</span>
            </button>
          </div>
        </div>

        {/* Tab 1: 🔥 热门（Agent + 任务 + 帖子 + Skill 混合卡片网格 2行×4列 = 8个） */}
        {contentTab === 'hot' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {hotMixedList.map((item, idx) => (
              <div
                key={idx}
                onClick={item.onClick}
                className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{item.icon}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${item.typeBadgeColor}`}>
                      {item.typeLabel}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{item.rating}</span>
                    <span className="text-[10px] text-slate-400 font-normal ml-1">· {item.hotMetric}</span>
                  </div>

                  <span className="font-mono font-black text-indigo-600 text-xs">
                    {item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: 📦 最新Agent（8个精选 Agent 卡片） */}
        {contentTab === 'latest_agents' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.slice(0, 8).map((ag) => (
              <div
                key={ag.id}
                onClick={() => openAgentDetail(ag)}
                className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-2xs">
                      {ag.avatar || '🤖'}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                      {ag.appType || '智能体'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {ag.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed font-normal">
                      {ag.description || '高效大模型赋能的智能体应用，即开即用。'}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="ml-1">{ag.rating || 5.0}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({ag.usageCount || 100}+)
                    </span>
                  </div>

                  <span className={`font-bold text-xs ${
                    ag.priceType === 'free' ? 'text-emerald-600' : 'text-indigo-600'
                  }`}>
                    {ag.priceType === 'free' ? '免费' : `¥${ag.priceValue}/次`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: 📋 最新任务（8个任务卡片） */}
        {contentTab === 'latest_tasks' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tasks.concat(tasks).slice(0, 8).map((task, idx) => (
              <div
                key={`${task.id}_${idx}`}
                onClick={() => setActiveTab('tasks')}
                className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/5 hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      task.type === '悬赏任务' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      task.type === '招标任务' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      'bg-purple-50 text-purple-700 border-purple-200'
                    }`}>
                      {task.type}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {task.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                    {task.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                    {task.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-xs font-mono font-black text-rose-600">
                      {task.bountyUnit}{task.bounty?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span>{task.bidCount || 10} 人报名</span>
                    <span>· 剩 {idx % 2 === 0 ? '3天' : '15天'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: 💡 创意空间（5个创意方向固定卡片展示） */}
        {contentTab === 'creative' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {creativeHubCards.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    if (c.url) {
                      showToast(`正在跳转至【${c.title}】外部平台...`);
                      window.open(c.url, '_blank', 'noopener,noreferrer');
                    } else {
                      setActiveTab('creative');
                    }
                  }}
                  className={`rounded-2xl border ${c.bgClass} hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between overflow-hidden cursor-pointer group bg-white`}
                >
                  {/* 卡片头部科技图景 */}
                  <div className="relative h-28 w-full overflow-hidden">
                    <img 
                      src={c.image} 
                      alt={c.title} 
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />
                    
                    <div className={`absolute top-2.5 left-2.5 w-8 h-8 rounded-xl ${c.iconBg} shadow-sm flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <span className="absolute top-2.5 right-2.5 text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-900/70 backdrop-blur-xs text-white border border-white/20">
                      {c.tag}
                    </span>

                    <div className="absolute bottom-2 left-2.5 right-2.5">
                      <div className="text-xs font-black text-white truncate">
                        {c.title}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-indigo-600 mb-1">
                        {c.slogan}
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {c.desc}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400 font-mono">
                        官方赛道
                      </span>
                      <span className="text-xs font-bold text-indigo-600 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                        进入 <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 5: 📝 社区热帖（8篇热帖卡片） */}
        {contentTab === 'hot_posts' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {posts.slice(0, 8).map((post) => (
              <div
                key={post.id}
                onClick={() => setActiveTab('community')}
                className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {post.board}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {post.time}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {post.title || post.content}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                    {post.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img 
                      src={post.authorAvatar} 
                      alt={post.author} 
                      className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200" 
                    />
                    <span className="text-xs text-slate-700 font-medium truncate max-w-[80px]">
                      {post.author}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="flex items-center gap-0.5">
                      <Heart className="w-3 h-3 text-rose-400" /> {post.likesCount || 12}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <MessageSquare className="w-3 h-3 text-indigo-400" /> {post.commentsCount || 4}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 底部【查看全部 →】跳转对应模块 */}
        <div className="text-center pt-2">
          <button
            onClick={() => {
              if (contentTab === 'hot' || contentTab === 'latest_agents') {
                setActiveTab('marketplace');
                setMarketplaceTab('agent');
              } else if (contentTab === 'latest_tasks') {
                setActiveTab('tasks');
              } else if (contentTab === 'creative') {
                setActiveTab('creative');
              } else if (contentTab === 'hot_posts') {
                setActiveTab('community');
              }
            }}
            className="px-6 py-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-300 text-indigo-600 font-bold text-xs transition shadow-2xs inline-flex items-center gap-2 group cursor-pointer"
          >
            <span>
              {contentTab === 'hot' ? '查看更多热门资产' :
               contentTab === 'latest_agents' ? '前往 Agent 商店浏览全部' :
               contentTab === 'latest_tasks' ? '前往 任务大厅 查看更多悬赏' :
               contentTab === 'creative' ? '进入 创意空间 探索完整方向' :
               '进入 社区广场 查看更多讨论'}
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* =========================================================================
          区域五：创意空间（固定卡片入口区，独立展示）
      ========================================================================= */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-2xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  💡 用AI创造无限可能 · 创意空间
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  5 大方向全面开放
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                覆盖 AIGC方案、数据科学、安全攻防对抗、政务人文及真实项目落地
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('creative')}
            className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 text-indigo-600 font-bold text-xs transition shadow-2xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>进入创意空间主页</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5 个固定卡片横向网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {creativeHubCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => {
                  if (card.url) {
                    showToast(`正在前往【${card.title}】外部平台...`);
                    window.open(card.url, '_blank', 'noopener,noreferrer');
                  } else {
                    setActiveTab('creative');
                  }
                }}
                className={`rounded-2xl border ${card.bgClass} hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between overflow-hidden cursor-pointer group bg-white`}
              >
                {/* 卡片头部科技图景 */}
                <div className="relative h-28 w-full overflow-hidden">
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />
                  
                  <div className={`absolute top-2.5 left-2.5 w-8 h-8 rounded-xl ${card.iconBg} shadow-sm flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <span className="absolute top-2.5 right-2.5 text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-900/70 backdrop-blur-xs text-white border border-white/20">
                    {card.tag}
                  </span>

                  <div className="absolute bottom-2 left-2.5 right-2.5">
                    <div className="text-xs font-black text-white truncate">
                      {card.title}
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-indigo-600 mb-1">
                      {card.slogan}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400 font-mono">
                      官方赛道
                    </span>
                    <span className="text-xs font-bold text-indigo-600 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                      探索 <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* =========================================================================
          区域六：社区热帖 + 动态信息流（左右两栏 60% : 40%）
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* 左侧：📝 社区热帖精选（占 7 列，约 60% 宽度） */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-2xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    📝 社区热帖
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    开发者实战经验、踩坑指南与前沿评测
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('community')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <span>更多热帖</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 帖子列表（6条精选） */}
            <div className="space-y-2.5">
              {posts.slice(0, 6).map((post, idx) => (
                <div
                  key={post.id}
                  onClick={() => setActiveTab('community')}
                  className="p-3.5 rounded-2xl bg-slate-50/70 hover:bg-indigo-50/40 border border-slate-200/60 hover:border-indigo-200 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                      idx === 0 ? 'bg-amber-100 text-amber-800 font-black' :
                      idx === 1 ? 'bg-slate-200 text-slate-700' :
                      idx === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      {idx + 1}
                    </span>

                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-slate-600 border border-slate-200 shrink-0">
                      {post.board}
                    </span>

                    <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                      {post.title || post.content}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-400" />
                      <span>{post.likesCount || 8}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">{post.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActiveTab('community')}
              className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition border border-slate-200/80 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>进入社区广场参与讨论</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 右侧：🔔 实时动态流（占 5 列，约 40% 宽度） */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-2xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    🔔 最新动态
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    开发者动态、上新提醒与任务竞标
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('workspace')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <span>全部动态</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 动态列表 */}
            <div className="space-y-3">
              {followFeeds.map((feed) => (
                <div
                  key={feed.id}
                  className="p-3 rounded-2xl bg-slate-50/50 hover:bg-indigo-50/30 border border-slate-200/60 hover:border-indigo-200 transition-all flex items-start gap-3"
                >
                  <img
                    src={feed.avatar}
                    alt={feed.author}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-800 truncate">
                        {feed.author}
                      </div>
                      <span className="text-[10px] text-slate-400">{feed.time}</span>
                    </div>

                    <div className="text-[11px] text-slate-500 mt-0.5">
                      <span>{feed.action} </span>
                      <strong className="text-indigo-600 font-medium">{feed.targetName}</strong>
                    </div>

                    <div className="text-[11px] text-slate-400 truncate mt-1">
                      {feed.preview}
                    </div>
                  </div>

                  <button
                    onClick={feed.onAction}
                    className="self-center px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 text-[10px] font-bold text-indigo-600 shadow-2xs hover:bg-indigo-50 transition shrink-0 cursor-pointer"
                  >
                    {feed.actionBtn}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActiveTab('workspace')}
              className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition border border-slate-200/80 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>在工作台关注更多开发者</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* =========================================================================
          区域七：平台数据 + 合作伙伴
      ========================================================================= */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-8">
        
        {/* 平台数据统计 */}
        <div>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                平台实时运营与算力指标
              </h3>
              <p className="text-xs text-slate-500">
                服务于千行百业的 AI 开发者与企业级算力枢纽
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-slate-50/80 border border-indigo-100/90 relative overflow-hidden group hover:border-indigo-300 transition-all shadow-2xs">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-[radial-gradient(#6366f1_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-10 pointer-events-none" />

              <div className="text-xs font-bold text-slate-500 flex items-center justify-between relative z-10">
                <span>注册用户与开发者</span>
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-mono relative z-10">
                12,580<span className="text-sm font-sans font-normal text-slate-500 ml-1">人</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1 relative z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>↑ 周环比增长 18.4%</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-50/80 to-slate-50/80 border border-cyan-100/90 relative overflow-hidden group hover:border-cyan-300 transition-all shadow-2xs">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-10 pointer-events-none" />

              <div className="text-xs font-bold text-slate-500 flex items-center justify-between relative z-10">
                <span>上架 Agent 智能体</span>
                <Bot className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-mono relative z-10">
                356<span className="text-sm font-sans font-normal text-slate-500 ml-1">个</span>
              </div>
              <div className="text-[11px] text-cyan-700 font-bold mt-1.5 flex items-center gap-1 relative z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                <span>累计调用 1,280 万次</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/80 to-slate-50/80 border border-amber-100/90 relative overflow-hidden group hover:border-amber-300 transition-all shadow-2xs">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-10 pointer-events-none" />

              <div className="text-xs font-bold text-slate-500 flex items-center justify-between relative z-10">
                <span>完成任务撮合与交付</span>
                <Briefcase className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-mono relative z-10">
                1,234<span className="text-sm font-sans font-normal text-slate-500 ml-1">笔</span>
              </div>
              <div className="text-[11px] text-amber-700 font-bold mt-1.5 flex items-center gap-1 relative z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>撮合总赏金 ¥480万+</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-slate-50/80 border border-emerald-100/90 relative overflow-hidden group hover:border-emerald-300 transition-all shadow-2xs">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-[radial-gradient(#10b981_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-10 pointer-events-none" />

              <div className="text-xs font-bold text-slate-500 flex items-center justify-between relative z-10">
                <span>累计节省开发者算力</span>
                <Cpu className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-mono relative z-10">
                ¥168<span className="text-sm font-sans font-normal text-slate-500 ml-1">万元</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-bold mt-1.5 flex items-center gap-1 relative z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>按需秒级弹性计费</span>
              </div>
            </div>
          </div>
        </div>

        {/* 合作伙伴生态 */}
        <div className="pt-4 border-t border-slate-100">
          <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">
            战略合作运营商与生态算力伙伴
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {partnerList.map((p, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200/70 hover:border-indigo-300 hover:bg-white hover:shadow-md transition flex flex-col justify-between items-center text-center group cursor-pointer"
              >
                <div className="text-xs font-black text-slate-800 group-hover:text-indigo-600">
                  {p.name}
                </div>
                <div className="text-[10px] font-mono text-slate-400 tracking-wider my-1">
                  {p.logoText}
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white text-indigo-700 border border-indigo-100">
                  {p.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
