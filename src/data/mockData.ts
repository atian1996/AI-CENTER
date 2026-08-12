import { 
  AgentItem, 
  ModelItem, 
  DatasetItem, 
  SkillPluginItem, 
  TaskItem, 
  CourseItem, 
  LearningPathItem, 
  GPUInstance, 
  GpuPricing, 
  ComputeImageItem,
  FeedPost, 
  OnboardingTask, 
  AppNotification, 
  UserProfile, 
  PointRecord,
  AccountTransaction,
  ApiKeyItem,
  ApiCallLog,
  AsyncCallTask,
  OrderItem,
  PointStoreItem,
  DatasetApplication,
  TaskCollaborationMessage,
  LoginDeviceItem
} from '../types';

export const initialUserProfile: UserProfile = {
  id: 'usr_883920',
  name: '极客小千',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  email: 'wangt9483@qianji.ai',
  phone: '138****6688',
  levelBadge: 'LV.4 AI架构师',
  identityTag: '高级开发者 / 算法工程师',
  skills: ['Python', 'Agent Protocol', 'PyTorch', 'vLLM', 'React', 'TypeScript'],
  balance: 128.00,
  points: 1200,
  todayEarnedPoints: 120,
  githubUrl: 'https://github.com/qianji-ai',
  websiteUrl: 'https://qianji.ai',
  bio: '探索 Agent 与大模型前沿应用，致力于构建高吞吐 AI 工作流。',
  mfaEnabled: true,
};

export const initialOnboardingTasks: OnboardingTask[] = [
  { id: 't1', title: '完善个人资料', description: '填写技能标签与个人简介', pointsReward: 50, completed: true, actionKey: 'settings' },
  { id: 't2', title: '浏览3个Agent', description: '前往AI集市探索热门 Agent 应用', pointsReward: 30, completed: true, actionKey: 'marketplace' },
  { id: 't3', title: '试用1个Agent', description: '在网页对话框中在线体验沙箱交互', pointsReward: 50, completed: false, actionKey: 'agent_try' },
  { id: 't4', title: '每日签到', description: '领取每日专属积分奖励', pointsReward: 50, completed: true, actionKey: 'checkin' },
  { id: 't5', title: '发1条社区动态', description: '在社区论坛发表第一篇交流动态', pointsReward: 100, completed: false, actionKey: 'community_post' },
];

export const initialNotifications: AppNotification[] = [
  { id: 'n1', title: '每日签到成功', content: '您已连续签到 5 天，获得 50 积分奖励！', type: 'points', time: '10分钟前', read: false },
  { id: 'n2', title: '任务投标被关注', content: '您提交的《医疗QA模型微调》竞标方案已被发布者审阅。', type: 'task', time: '1小时前', read: false, targetTab: 'tasks', targetId: 'tsk_101' },
  { id: 'n3', title: 'Agent 被调用提醒', content: '您的 Agent【代码重构与安全审计 Agent】今日累计调用次数突破 1,000 次！获得 +40 积分分成。', type: 'system', time: '3小时前', read: false, targetTab: 'workspace', targetId: 'assets' },
  { id: 'n4', title: '社区点赞提醒', content: '用户 @TechMaster 点赞了您的帖子《vLLM推理加速实战解析》。', type: 'interaction', time: '5小时前', read: true, targetTab: 'community' },
  { id: 'n5', title: '帖子新评论回复', content: '用户 @李开发者 评论了您的帖子：“请问上下文超过 64k 时显存占用大概是多少？”', type: 'interaction', time: '昨天', read: false, targetTab: 'community' },
  { id: 'n6', title: 'Agent 审核通过', content: '您创建的 Agent【多语言编程与代码重构 Agent】已通过平台官方合规审核，正式上架 AI 集市！', type: 'system', time: '2天前', read: true, targetTab: 'workspace', targetId: 'assets' },
  { id: 'n7', title: '数据集申请提醒', content: '用户 @张学者 提交了数据集《A股上市公司财报与年报结构化 Corpus》的使用申请。', type: 'system', time: '2天前', read: false, targetTab: 'workspace', targetId: 'assets' },
  { id: 'n8', title: '订单支付成功', content: '您已成功充值【GPU 算力充值包 100 卡时】，算力积分已自动到账。', type: 'system', time: '3天前', read: true, targetTab: 'workspace', targetId: 'orders' }
];

export const mockBannerItems = [
  {
    id: 'b1',
    title: '千机·AI空间 1.0 全面重构上线',
    subtitle: '一站式赋能 AI 应用开发、算力调度与开发者社区生态',
    badge: '官方活动',
    bgGradient: 'from-indigo-900 via-purple-900 to-slate-900',
    buttonText: '立即体验',
    targetTab: 'marketplace' as const
  },
  {
    id: 'b2',
    title: 'GPU 算力狂欢季 · 领 100 小时 T4 体验券',
    subtitle: '秒级拉起 JupyterLab 与 ComfyUI 环境，闲时限时 5 折优惠',
    badge: '算力优惠',
    bgGradient: 'from-cyan-900 via-blue-900 to-slate-900',
    buttonText: '启动工坊',
    targetTab: 'compute' as const
  },
  {
    id: 'b3',
    title: '首届“千机杯”大模型 Agent 创客大赛',
    subtitle: '百万积分与十万现金赏金池，等最强 AI 开发者来战！',
    badge: '任务悬赏',
    bgGradient: 'from-amber-900 via-red-900 to-slate-900',
    buttonText: '参查看任务',
    targetTab: 'tasks' as const
  }
];

export const mockAgents: AgentItem[] = [
  {
    id: 'ag_01',
    name: '代码重构与安全审计 Agent',
    avatar: '⚡',
    description: '深度分析 TypeScript/Python/Rust 代码，智能发现内存泄漏、SQL注入与性能瓶颈，并自动生成优雅重构方案。',
    category: 'coding',
    rating: 4.9,
    ratingCount: 328,
    priceType: 'free',
    priceValue: 0,
    usageCount: 14250,
    tags: ['热门', '官方', '编程辅助'],
    author: '千机官方实验室',
    authorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    baseModel: 'Gemini 3.6 Flash',
    version: 'v2.4.0',
    techDocs: '支持 AST 语法树解析与静态数据流跟踪，自动检测并修复 50+ 种常见安全漏洞。',
    createdAt: '2026-06-15'
  },
  {
    id: 'ag_02',
    name: '金融研报 & 财报速读智囊',
    avatar: '📈',
    description: '秒级解析 100+ 页 PDF 研报与上市公司财报，提取营收、EBITDA、风险点并输出专业对冲与投资分析报告。',
    category: 'vertical',
    rating: 4.8,
    ratingCount: 215,
    priceType: 'points',
    priceValue: 20,
    usageCount: 8900,
    tags: ['热门', '金融', '数据分析'],
    author: '量化星云团队',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    baseModel: 'DeepSeek-R1-Distill',
    version: 'v1.8.2',
    techDocs: '集成多维表格提取算法，具备跨表关联比对与现金流预测公式推演能力。',
    createdAt: '2026-07-01'
  },
  {
    id: 'ag_03',
    name: 'ComfyUI 绘图提示词大师',
    avatar: '🎨',
    description: '将简短自然语言一键转为 SDXL/Flux 精准 negative & positive Prompt，附带采样器与 ControlNet 参数建议。',
    category: 'image',
    rating: 4.7,
    ratingCount: 410,
    priceType: 'free',
    priceValue: 0,
    usageCount: 23100,
    tags: ['热门', '图像生成'],
    author: 'AIGC 视觉引擎',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    baseModel: 'Flux.1-Dev',
    version: 'v3.0.1',
    techDocs: '内嵌百万图文对调优词库，支持艺术风格、摄像机角度与光照参数解耦配置。',
    createdAt: '2026-05-20'
  },
  {
    id: 'ag_04',
    name: '三甲医院全科医疗预诊助手',
    avatar: '🩺',
    description: '基于权威医学知识库，针对患者症状提供精准导诊分诊建议、检验单解读与用药禁忌风险预警。',
    category: 'vertical',
    rating: 4.9,
    ratingCount: 189,
    priceType: 'points',
    priceValue: 30,
    usageCount: 6540,
    tags: ['新上', '医疗垂直'],
    author: '华西数字医疗课题组',
    authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80',
    baseModel: 'Qwen2.5-72B-Instruct',
    version: 'v1.1.0',
    techDocs: '通过国内 3,000+ 临床案例对抗测试，合规性与隐私保护符合 HIPAA 标准。',
    createdAt: '2026-07-28'
  },
  {
    id: 'ag_05',
    name: 'SQL 复杂查询优化与方言转换器',
    avatar: '🗄️',
    description: '自动优化大表 JOIN、窗口函数与慢查询语句，完美实现 PostgreSQL、MySQL、Oracle 与 ClickHouse 间转换。',
    category: 'data',
    rating: 4.8,
    ratingCount: 156,
    priceType: 'free',
    priceValue: 0,
    usageCount: 11200,
    tags: ['编程辅助', '数据分析'],
    author: 'DBA极客联合会',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    baseModel: 'Gemini 3.6 Flash',
    version: 'v2.0.0',
    techDocs: '基于执行计划 Parsing 分析，能够给出索引创建提示与分区优化建议。',
    createdAt: '2026-06-10'
  },
  {
    id: 'ag_06',
    name: '全语种实时翻译与同传专家',
    avatar: '🌐',
    description: '支持 80+ 种语言双向同传，具备语境感知的行业术语库，保留原文语气与排版格式。',
    category: 'dialogue',
    rating: 4.6,
    ratingCount: 512,
    priceType: 'free',
    priceValue: 0,
    usageCount: 31000,
    tags: ['热门', '对话助手'],
    author: '千机官方实验室',
    authorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    baseModel: 'Gemini 3.6 Flash',
    version: 'v3.2.0',
    techDocs: '毫秒级流式响应，支持多方对话角色自动识别与专有名词比对。',
    createdAt: '2026-04-12'
  }
];

export const mockModels: ModelItem[] = [
  {
    id: 'mod_01',
    name: 'Gemini 3.6 Flash',
    vendor: 'Google DeepMind',
    typeTag: '文本',
    contextLength: '1M Tokens',
    priceInput: '¥0.001 / 1K Tokens',
    priceOutput: '¥0.003 / 1K Tokens',
    tags: ['热门', '推荐底座', '免费额度'],
    description: '多模态新一代旗舰模型，具备超强长上下文逻辑推理、代码生成与极低延迟响应能力。',
    benchmarks: [{ name: 'MMLU-Pro', score: 88.5 }, { name: 'HumanEval', score: 92.1 }, { name: 'GSM8K', score: 95.4 }],
    latencyMs: 180,
    apiDocsUrl: 'https://ai.google.dev/docs'
  },
  {
    id: 'mod_02',
    name: 'DeepSeek-R1-Distill-70B',
    vendor: 'DeepSeek 深度求索',
    typeTag: '文本',
    contextLength: '128K Tokens',
    priceInput: '¥0.002 / 1K Tokens',
    priceOutput: '¥0.008 / 1K Tokens',
    tags: ['热门', '国产之光', '深度思考'],
    description: '突破性开源推理模型，拥有强化学习 Self-Verification 能力，擅长高难度数学与复杂逻辑推演。',
    benchmarks: [{ name: 'MATH 500', score: 90.2 }, { name: 'AIME 2024', score: 79.8 }, { name: 'HumanEval', score: 89.4 }],
    latencyMs: 320,
    apiDocsUrl: 'https://deepseek.com'
  },
  {
    id: 'mod_03',
    name: 'Qwen2.5-72B-Instruct',
    vendor: '阿里云 通义千问',
    typeTag: '文本',
    contextLength: '128K Tokens',
    priceInput: '¥0.0015 / 1K Tokens',
    priceOutput: '¥0.0045 / 1K Tokens',
    tags: ['国产', '全能王'],
    description: '国内最强开源指令微调大模型之一，在中英文理解、结构化输出与 Agent 工具调用上表现优异。',
    benchmarks: [{ name: 'MMLU', score: 86.2 }, { name: 'C-Eval', score: 89.1 }],
    latencyMs: 240,
    apiDocsUrl: 'https://qwenlm.github.io'
  },
  {
    id: 'mod_04',
    name: 'Flux.1-Schnell Image Generator',
    vendor: 'Black Forest Labs',
    typeTag: '图像',
    contextLength: 'N/A',
    priceInput: '¥0.02 / 张',
    priceOutput: '¥0.02 / 张',
    tags: ['热门', '文生图旗舰'],
    description: '120 亿参数的流匹配架构文生图模型，解剖学细节精准，支持高保真文字渲染与极速生成。',
    benchmarks: [{ name: 'Image Fidelity', score: 94.0 }, { name: 'Prompt Adherence', score: 96.2 }],
    latencyMs: 1200,
    apiDocsUrl: 'https://blackforestlabs.ai'
  },
  {
    id: 'mod_05',
    name: 'bge-m3-embedding',
    vendor: '智源研究院 BAAI',
    typeTag: 'Embedding',
    contextLength: '8192 Tokens',
    priceInput: '¥0.0001 / 1K Tokens',
    priceOutput: '¥0.0001 / 1K Tokens',
    tags: ['多语言', '向量检索'],
    description: '支持多语言、多粒度（密集、稀疏、多向量）的通用向量嵌入模型，RAG 检索系统必备。',
    benchmarks: [{ name: 'MTEB Multi-lingual', score: 68.4 }],
    latencyMs: 45,
    apiDocsUrl: 'https://baai.ac.cn'
  }
];

export const mockDatasets: DatasetItem[] = [
  {
    id: 'ds_01',
    name: 'Chinese Medical QA 500K 临床问答数据集',
    industry: '医疗',
    format: 'JSONL',
    scale: '50万条',
    license: 'CC-BY-NC 4.0',
    downloadCount: 4200,
    description: '涵盖内科、外科、妇产、儿科等20+科室真实匿名化问答数据，包含医生诊断思路与处方禁忌标注。',
    updatedAt: '2026-07-20',
    fields: [
      { name: 'question_id', type: 'string', desc: '唯一问答标识' },
      { name: 'department', type: 'string', desc: '医学科室分类' },
      { name: 'patient_symptoms', type: 'text', desc: '主诉与主观症状' },
      { name: 'doctor_reply', type: 'text', desc: '三甲主治医师结构化回复' }
    ],
    lineage: ['三甲医院全科医疗预诊助手', 'MedLLM-7B'],
    isPrivate: false
  },
  {
    id: 'ds_02',
    name: 'A股上市公司财报与年报结构化 Corpus (2020-2025)',
    industry: '金融',
    format: 'Parquet',
    scale: '12GB',
    license: '商业可授权',
    downloadCount: 1850,
    description: '包含沪深三千余家上市公司 5 年完整财报文本、MD&A 讨论、资产负债表 JSON 解析与研报标注。',
    updatedAt: '2026-08-01',
    fields: [
      { name: 'stock_code', type: 'string', desc: '股票代码' },
      { name: 'report_year', type: 'int', desc: '报告年份' },
      { name: 'ebitda', type: 'float', desc: '息税折旧摊销前利润' },
      { name: 'mda_text', type: 'text', desc: '管理层讨论与分析' }
    ],
    lineage: ['金融研报 & 财报速读智囊'],
    isPrivate: true
  },
  {
    id: 'ds_03',
    name: 'Code-Instruct-200K 多语言编程微调集',
    industry: '通用',
    format: 'JSON',
    scale: '20万对',
    license: 'Apache 2.0',
    downloadCount: 8900,
    description: '包含 Python, TypeScript, Rust, Go, C++ 复杂的单测生成、Refactor 与 Bug Fix 问答对。',
    updatedAt: '2026-06-18',
    fields: [
      { name: 'lang', type: 'string', desc: '编程语言类型' },
      { name: 'instruction', type: 'string', desc: '编程任务指令' },
      { name: 'input_code', type: 'text', desc: '输入源代码片段' },
      { name: 'output_code', type: 'text', desc: '期望生成重构代码' }
    ],
    lineage: ['代码重构与安全审计 Agent', 'SQL 复杂查询优化助手'],
    isPrivate: false
  }
];

export const mockSkills: SkillPluginItem[] = [
  {
    id: 'sk_01',
    name: 'Google Live Web Search Engine',
    description: '为 Agent 提供实时网络搜索能力，能够抓取最新新闻、股市行情与网页文本元数据。',
    compatibleAgents: '对话助手 / 数据分析 / 通用 Agent',
    developer: '千机官方',
    installs: 15400,
    version: 'v1.4.0',
    requiredPermissions: ['Network Request', 'Google Search API Key']
  },
  {
    id: 'sk_02',
    name: 'Python Code Sandbox Executor',
    description: '安全隔离的 Docker 沙箱环境，可实时执行 Python 代码并返回图表打印结果与 stdout 日志。',
    compatibleAgents: '编程辅助 / 数据分析 Agent',
    developer: 'Sandbox Lab',
    installs: 9200,
    version: 'v2.1.0',
    requiredPermissions: ['Container Runtime', 'File I/O']
  },
  {
    id: 'sk_03',
    name: 'Financial Data API Bridge',
    description: '对接新浪财经、Tushare 与东方财富 API，实时拉取 K线图、分时数据与资金流向。',
    compatibleAgents: '金融垂直 Agent',
    developer: 'Quant Master',
    installs: 3400,
    version: 'v1.0.5',
    requiredPermissions: ['Financial Data License']
  }
];

export const mockTasks: TaskItem[] = [
  {
    id: 'tsk_101',
    title: '【悬赏】定制基于 Qwen2.5 的律所合同审查 Agent 与 RAG 向量库',
    type: '悬赏任务',
    bounty: 8000,
    bountyUnit: '¥',
    publisher: '北京天元律师事务所',
    publisherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-09',
    deadline: '2026-08-25',
    requiredSkills: ['Qwen2.5', 'RAG', 'Python', 'Milvus', '合同分析'],
    bidCount: 14,
    status: '招募中',
    description: '需要开发一个能够自动识别劳动合同、采购协议中隐藏法律风险（如违约金陷阱、免责条款不符）的 Agent，需支持上传 PDF/Docx 并输出红线标注报告。',
    deliverables: '1. 可上架千机 AI 集市的 Agent 配置文件；2. 预建的民商法 RAG 向量数据库；3. 部署文档与单元测试集。',
    attachments: ['合同审查需求说明书.pdf', '测试用例范本_200例.zip']
  },
  {
    id: 'tsk_102',
    title: '【招标】微调 70B 医疗多模态大模型，要求图像与病历联合推理',
    type: '招标任务',
    bounty: 35000,
    bountyUnit: '¥',
    publisher: '迈瑞数字医疗研究院',
    publisherAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-05',
    deadline: '2026-09-10',
    requiredSkills: ['LoRA / Full Fine-tuning', 'PyTorch', 'vLLM', 'DICOM Medical Imaging'],
    bidCount: 8,
    status: '进行中',
    description: '针对 CT/X光片图像与电子病历（EMR）文本进行对齐微调。要求在华西/协和公开数据集上 BLEU-4 达到 0.42 以上，推理时延控制在 2 秒以内。',
    deliverables: '1. 合并后的 GGUF / SafeTensors 模型权重；2. 评估代码与显存吞吐测试报告；3. 源码仓库导出。'
  },
  {
    id: 'tsk_103',
    title: '【竞赛】“千机杯”创意文生图 Lora 模型训练挑战赛',
    type: '竞赛任务',
    bounty: 50000,
    bountyUnit: '积分',
    publisher: '千机官方运营组',
    publisherAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-01',
    deadline: '2026-08-31',
    requiredSkills: ['Flux.1 Lora', 'ComfyUI', 'Dataset Tagging'],
    bidCount: 65,
    status: '招募中',
    description: '训练一个专属于“赛博朋克国风建筑”风格的 Flux.1 / SDXL Lora 模型，根据社区投票与专家组综合评分决出一二三等奖，获奖模型将在算力工坊首页推荐。',
    deliverables: '1. Lora 权重文件 (.safetensors)；2. 10 张示例渲染图与完整 Prompt 工作流 (.json)。'
  }
];

export const mockCourses: CourseItem[] = [
  {
    id: 'crs_01',
    title: 'Zero to Hero: 从零手写多 Agent 协作系统 (LangGraph + Protocol)',
    category: 'Agent开发',
    cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80',
    instructor: '陈哲 博士',
    instructorTitle: '前 Google DeepMind 资深研究员',
    studentsCount: 3820,
    rating: 4.9,
    chaptersCount: 12,
    description: '深度解密 Router、Orchestrator、Self-Correction 与 Multi-Agent 通信机制，实战构建自动化软件开发团队。',
    hasCert: true,
    chapters: [
      { id: 'ch1', title: '1.1 大模型 Agent 范式演进与 ReAct 框架原理', duration: '25分钟' },
      { id: 'ch2', title: '1.2 StateGraph 状态树建模与节点状态流转', duration: '35分钟', notebookPreset: 'Agent开发实战' },
      { id: 'ch3', title: '1.3 打造自定义 Tool 插件与 API 错误容错机制', duration: '40分钟', notebookPreset: 'Notebook开发' },
      { id: 'ch4', title: '1.4 多 Agent 人工干预 (Human-in-the-loop) 架构设计', duration: '50分钟' }
    ]
  },
  {
    id: 'crs_02',
    title: '高效大模型微调实战：DeepSpeed + QLoRA 工业级落地',
    category: '大模型',
    cover: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=80',
    instructor: '李林 教授',
    instructorTitle: '清华大学 AI 实验室客座导师',
    studentsCount: 5100,
    rating: 4.8,
    chaptersCount: 16,
    description: '教你在消费级 GPU 上利用 QLoRA 部署百亿参数模型，掌握量化、FlashAttention-2 与数据集清洗技巧。',
    hasCert: true,
    chapters: [
      { id: 'ch201', title: '2.1 参数高效微调 (PEFT) 数学逻辑与矩阵低秩分解', duration: '30分钟' },
      { id: 'ch202', title: '2.2 使用算力工坊拉起 PyTorch + DeepSpeed 训练集群', duration: '45分钟', notebookPreset: '大模型微调' },
      { id: 'ch203', title: '2.3 vLLM 部署与 PagedAttention 吞吐压测', duration: '40分钟', notebookPreset: '推理服务' }
    ]
  },
  {
    id: 'crs_03',
    title: 'AIGC 视觉创作进阶：ComfyUI 节点工作流与 Flux 部署',
    category: 'AI基础',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    instructor: '艾达 (Ada)',
    instructorTitle: '视觉艺术家 / AIGC 社区主理人',
    studentsCount: 6400,
    rating: 4.9,
    chaptersCount: 10,
    description: '系统拆解 ControlNet, IP-Adapter, AnimateDiff 与采样步数优化，轻松搭建可重复利用的高级渲染流。',
    hasCert: true,
    chapters: [
      { id: 'ch301', title: '3.1 ComfyUI 核心节点原理与模型加载流', duration: '20分钟' },
      { id: 'ch302', title: '3.2 在算力工坊一键启动 ComfyUI GPU 镜像', duration: '15分钟', notebookPreset: '文生图' }
    ]
  }
];

export const mockLearningPaths: LearningPathItem[] = [
  { id: 'lp_1', title: 'AI 基础入门路径', description: '适合无 AI 经验的开发者，快速掌握 Prompt 工程与 LLM 原理。', stepCount: 4, badgeName: 'AI 启蒙勋章', targetRole: '初级 AI 爱好者' },
  { id: 'lp_2', title: 'Agent 全栈开发者', description: '掌握 LangChain, LangGraph, Tools 编写与千机平台 Agent 上架发布。', stepCount: 8, badgeName: 'Agent 架构师', targetRole: '全栈 Agent 工程师' },
  { id: 'lp_3', title: '工业级 AI 算法专家', description: '涵盖 70B 大模型训练、分布式推理加速、CUDA 算子优化与模型量化。', stepCount: 12, badgeName: '算力与算法专家', targetRole: '算法工程师' },
  { id: 'lp_4', title: '数据工程师 & RAG 专家', description: '数据清洗、Embedding 向量化、Milvus/Qdrant 混合检索与 GraphRAG。', stepCount: 6, badgeName: '数据血缘大师', targetRole: 'RAG 数据专家' }
];

export const mockGpuInstances: GPUInstance[] = [
  // 容器实例 Container Instances
  {
    id: 'inst_c01',
    name: 'my-llama-finetune',
    instanceType: 'container',
    scene: '大模型微调',
    gpuModel: 'A100 80GB',
    gpuCount: 1,
    vram: '76 GB / 80 GB',
    cpu: '16 核',
    ram: '64 GB',
    region: '华北 · 北京',
    billingType: '包月',
    status: 'running',
    systemDisk: '50GB NVMe',
    dataDisk: '500GB HighSpeed NVMe',
    publicIp: '120.24.88.102',
    osName: 'Ubuntu 22.04 LTS (Docker 26.1)',
    ipAddress: '10.240.12.89:8888',
    runningHours: 3.2,
    hourlyCost: 14.25,
    totalCost: 45.60,
    createdAt: '2026-08-11 08:30',
    jupyterUrl: 'https://jupyter.qianji.ai/?token=qj883920_c01',
    sshCommand: 'ssh -p 22321 root@gpu-cluster-04.qianji.ai',
    imageName: 'PyTorch 2.2 + CUDA 12.1 + DeepSpeed v0.12',
    monitoring: {
      gpuUsage: [45, 62, 88, 92, 95, 89, 94, 91],
      vramUsage: [60, 72, 80, 85, 90, 92, 94, 95],
      cpuUsage: [30, 45, 55, 68, 70, 65, 72, 75],
      ramUsage: [40, 48, 52, 58, 62, 60, 64, 65]
    },
    fileList: [
      { name: 'train_lora.py', size: '12.4 KB', isDir: false, modified: '10分钟前' },
      { name: 'dataset_clean.jsonl', size: '428.5 MB', isDir: false, modified: '2小时前' },
      { name: 'output_checkpoints/', size: '4.8 GB', isDir: true, modified: '15分钟前' },
      { name: 'deepspeed_config.json', size: '2.1 KB', isDir: false, modified: '昨天' }
    ],
    snapshots: [
      { id: 'snp_01', name: 'my-llama-v1-snapshot', description: '包含完整训练依赖与数据清洗脚本', size: '18.4 GB', createdAt: '2026-08-10 18:00', gpuModel: 'A100 80GB' }
    ],
    logs: [
      { id: 'lg_1', action: '创建并启动容器实例', time: '2026-08-11 08:30:00', status: '成功' },
      { id: 'lg_2', action: '挂载 500GB 数据盘', time: '2026-08-11 08:30:15', status: '成功' },
      { id: 'lg_3', action: '开启 JupyterLab 远程端口 8888', time: '2026-08-11 08:31:02', status: '成功' }
    ]
  },
  {
    id: 'inst_c02',
    name: 'comfyui-drawing',
    instanceType: 'container',
    scene: '文生图',
    gpuModel: 'RTX 4090 24GB',
    gpuCount: 1,
    vram: '18 GB / 24 GB',
    cpu: '16 核',
    ram: '56 GB',
    region: '华东 · 上海',
    billingType: '按量计费',
    status: 'running',
    systemDisk: '40GB SSD',
    dataDisk: '100GB NVMe',
    publicIp: '114.215.120.45',
    osName: 'Ubuntu 22.04 LTS (ComfyUI Env)',
    ipAddress: '10.240.14.12:8188',
    runningHours: 1.1,
    hourlyCost: 2.90,
    totalCost: 3.20,
    createdAt: '2026-08-11 10:15',
    jupyterUrl: 'https://comfy.qianji.ai/?instance=inst_c02',
    sshCommand: 'ssh -p 22325 root@gpu-cluster-02.qianji.ai',
    imageName: 'ComfyUI Official + Flux.1 Base + SDXL ControlNet',
    monitoring: {
      gpuUsage: [10, 85, 95, 20, 98, 15, 90, 80],
      vramUsage: [30, 75, 78, 70, 82, 75, 80, 78],
      cpuUsage: [15, 30, 40, 25, 45, 20, 35, 30],
      ramUsage: [25, 35, 40, 38, 42, 40, 41, 42]
    },
    fileList: [
      { name: 'custom_nodes/', size: '1.2 GB', isDir: true, modified: '刚刚' },
      { name: 'models/checkpoints/', size: '24.5 GB', isDir: true, modified: '1小时前' },
      { name: 'output_renders/', size: '156.8 MB', isDir: true, modified: '2分钟前' }
    ],
    snapshots: [],
    logs: [
      { id: 'lg_10', action: '秒级启动 ComfyUI 容器', time: '2026-08-11 10:15:00', status: '成功' }
    ]
  },
  {
    id: 'inst_c03',
    name: 'test-env',
    instanceType: 'container',
    scene: 'Notebook开发',
    gpuModel: 'T4 16GB',
    gpuCount: 1,
    vram: '0 GB / 16 GB',
    cpu: '4 核',
    ram: '16 GB',
    region: '华南 · 广州',
    billingType: '按量计费',
    status: 'stopped',
    systemDisk: '40GB SSD',
    dataDisk: '无',
    publicIp: '以关机释放',
    osName: 'JupyterLab + Python 3.11',
    ipAddress: '10.240.09.44:8888',
    runningHours: 4.8,
    hourlyCost: 2.50,
    totalCost: 12.00,
    createdAt: '2026-08-09 14:00',
    sshCommand: 'ssh -p 22100 root@gpu-cluster-01.qianji.ai',
    imageName: 'JupyterLab + PyTorch 2.1 + Pandas',
    monitoring: {
      gpuUsage: [0, 0, 0, 0, 0, 0, 0, 0],
      vramUsage: [0, 0, 0, 0, 0, 0, 0, 0],
      cpuUsage: [0, 0, 0, 0, 0, 0, 0, 0],
      ramUsage: [0, 0, 0, 0, 0, 0, 0, 0]
    },
    logs: [
      { id: 'lg_20', action: '用户主动暂停实例', time: '2天前', status: '成功' }
    ]
  },

  // 云服务器实例 Server Instances
  {
    id: 'inst_s01',
    name: 'vllm-inference-node-01',
    instanceType: 'server',
    scene: '推理服务',
    gpuModel: 'A100 80GB',
    gpuCount: 2,
    vram: '152 GB / 160 GB',
    cpu: '32 核 (AMD EPYC)',
    ram: '128 GB',
    region: '华北 · 北京',
    billingType: '包月',
    status: 'running',
    systemDisk: '100GB NVMe',
    dataDisk: '1TB NVMe',
    publicIp: '123.57.190.22 (50Mbps)',
    osName: 'Ubuntu 22.04 LTS (Docker & Systemd)',
    ipAddress: '123.57.190.22:8000',
    runningHours: 120.0,
    hourlyCost: 48.00,
    totalCost: 5760.00,
    createdAt: '2026-08-01 10:00',
    jupyterUrl: 'https://jupyter.qianji.ai/?token=qj883920_s01',
    vncUrl: 'https://vnc.qianji.ai/?node=vllm-01',
    sshCommand: 'ssh -p 22800 root@123.57.190.22',
    imageName: 'Ubuntu 22.04 + vLLM v0.4.2 + CUDA 12.2',
    securityRules: [
      { port: '22', protocol: 'TCP', cidr: '0.0.0.0/0', desc: 'SSH 远端控制' },
      { port: '8000', protocol: 'TCP', cidr: '0.0.0.0/0', desc: 'vLLM OpenAI API 服务端口' },
      { port: '443', protocol: 'TCP', cidr: '0.0.0.0/0', desc: 'HTTPS 加密传输' }
    ],
    monitoring: {
      gpuUsage: [82, 85, 88, 90, 87, 89, 91, 93],
      vramUsage: [92, 92, 94, 95, 95, 95, 95, 95],
      cpuUsage: [45, 50, 52, 58, 60, 55, 62, 65],
      ramUsage: [70, 72, 75, 78, 80, 82, 81, 83]
    },
    logs: [
      { id: 'lg_30', action: '云服务器启动并分配公网 EIP', time: '2026-08-01 10:00:00', status: '成功' },
      { id: 'lg_31', action: '安全组开放 8000 端口', time: '2026-08-01 10:05:12', status: '成功' }
    ]
  },
  {
    id: 'inst_s02',
    name: 'sd-webui-enterprise',
    instanceType: 'server',
    scene: '文生图',
    gpuModel: 'V100 32GB',
    gpuCount: 1,
    vram: '12 GB / 32 GB',
    cpu: '16 核',
    ram: '64 GB',
    region: '华东 · 上海',
    billingType: '按量计费',
    status: 'stopped',
    systemDisk: '60GB SSD',
    dataDisk: '200GB NVMe',
    publicIp: '139.196.42.11',
    osName: 'Windows Server 2019 Datacenter',
    ipAddress: '139.196.42.11:3389',
    runningHours: 18.5,
    hourlyCost: 8.00,
    totalCost: 148.00,
    createdAt: '2026-08-05 16:30',
    vncUrl: 'https://vnc.qianji.ai/?node=win-rdp-sd',
    sshCommand: 'mstsc /v:139.196.42.11:3389',
    imageName: 'Windows Server 2019 + SD WebUI + ControlNet',
    securityRules: [
      { port: '3389', protocol: 'TCP', cidr: '0.0.0.0/0', desc: 'RDP 远程桌面' },
      { port: '7860', protocol: 'TCP', cidr: '0.0.0.0/0', desc: 'WebUI 界面' }
    ],
    logs: [
      { id: 'lg_40', action: '已成功停止 Windows 云服务器以节省费用', time: '1天前', status: '成功' }
    ]
  }
];

export const mockComputeImages: ComputeImageItem[] = [
  {
    id: 'img_01',
    name: 'PyTorch 2.2.0 + CUDA 12.1',
    category: '官方镜像',
    tag: '基础环境',
    version: 'v2.2.0-cuda12.1-ubuntu22.04',
    description: '最受欢迎的官方深度学习框架，内含 FlashAttention-2 与 torchvision',
    downloads: 38200,
    icon: '🔥',
    presetScene: 'Notebook开发'
  },
  {
    id: 'img_02',
    name: 'ComfyUI 官方整合包 (Flux & SDXL)',
    category: 'App市场',
    tag: '一键生图',
    version: 'v0.2.4-flux-supported',
    description: '预装节点与模型管理器，内嵌 ControlNet, IP-Adapter 与 AnimateDiff',
    downloads: 29400,
    icon: '🎨',
    presetScene: '文生图'
  },
  {
    id: 'img_03',
    name: 'vLLM 高吞吐大模型推理引擎',
    category: '官方镜像',
    tag: '推理服务',
    version: 'v0.4.2-openai-api-compatible',
    description: '集成 PagedAttention 技术的百亿参数 LLM 高吞吐推理镜像',
    downloads: 18900,
    icon: '⚡',
    presetScene: '推理服务'
  },
  {
    id: 'img_04',
    name: 'Ollama + OpenWebUI 离线大模型盒',
    category: '社区热门',
    tag: '私有化部署',
    version: 'v0.1.32-webui-bundle',
    description: '开箱即用的离线大模型交互平台，支持 Llama 3.3, Qwen2.5 一键下载',
    downloads: 14200,
    icon: '🦙',
    presetScene: '自定义'
  },
  {
    id: 'img_05',
    name: 'TensorFlow 2.16 + GPU Driver',
    category: '官方镜像',
    tag: '工业标准',
    version: 'v2.16.1-cuda12.2',
    description: 'TensorFlow 官方 GPU 加速基础镜像，附带 TensorBoard',
    downloads: 12100,
    icon: '🧠',
    presetScene: 'Notebook开发'
  }
];

export const mockHistoryInstances: GPUInstance[] = [
  {
    id: 'hist_01',
    name: 'llama3-70b-eval-temp',
    instanceType: 'container',
    scene: '推理服务',
    gpuModel: 'A100 80GB',
    gpuCount: 2,
    vram: '160 GB',
    cpu: '32 核',
    ram: '128 GB',
    region: '华北 · 北京',
    billingType: '按量计费',
    status: 'destroyed',
    systemDisk: '50GB NVMe',
    dataDisk: '无',
    publicIp: '已销毁',
    osName: 'Ubuntu 22.04 LTS',
    ipAddress: 'N/A',
    runningHours: 8.5,
    hourlyCost: 28.00,
    totalCost: 238.00,
    createdAt: '2026-08-01 14:00',
    imageName: 'vLLM v0.4.1 + PyTorch 2.2'
  },
  {
    id: 'hist_02',
    name: 'old-torch1.13-experiment',
    instanceType: 'server',
    scene: 'Notebook开发',
    gpuModel: 'T4 16GB',
    gpuCount: 1,
    vram: '16 GB',
    cpu: '4 核',
    ram: '16 GB',
    region: '华南 · 广州',
    billingType: '按量计费',
    status: 'destroyed',
    systemDisk: '40GB SSD',
    dataDisk: '100GB NVMe',
    publicIp: '已销毁',
    osName: 'Ubuntu 20.04 LTS',
    ipAddress: 'N/A',
    runningHours: 24.0,
    hourlyCost: 2.50,
    totalCost: 60.00,
    createdAt: '2026-07-20 09:00',
    imageName: 'PyTorch 1.13.1 + CUDA 11.7'
  }
];

export const mockGpuPricings: GpuPricing[] = [
  { model: 'T4 16GB', vram: '16 GB GDDR6', scenario: 'Notebook/轻量推理/课程实验', pricePerHour: 2.5, discountPrice: 1.25, badge: '新手门槛低' },
  { model: 'V100/A10 24GB', vram: '24 GB HBM2', scenario: '微调/ComfyUI文生图/LoRA', pricePerHour: 8.0, discountPrice: 6.0, badge: '主力性价比' },
  { model: 'A100 80GB', vram: '80 GB HBM2e', scenario: '70B大模型全参数训练/vLLM压测', pricePerHour: 25.0, discountPrice: 20.0, badge: '高性能集群' }
];

export const mockFeedPosts: FeedPost[] = [
  {
    id: 'pst_01',
    author: '王AI-深度架构师',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    authorTag: 'VIP 核心贡献者',
    content: '今天在千机算力工坊尝试用 A100 80GB 微调了 DeepSeek-R1-Distill 模型，发现配合 vLLM + Chunked Prefill 之后，首 Token 延迟下降了 40%！附上我们的评估日志与配置文件，欢迎大家在【AI集市】试用我发布的【代码重构与安全审计 Agent】！🚀',
    images: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80'
    ],
    board: '干货分享',
    likesCount: 128,
    commentsCount: 34,
    sharesCount: 12,
    time: '2小时前',
    isLiked: true,
    commentsList: [
      { id: 'c1', author: '张Dev', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', content: '太强了！请问上下文超过 64k 时显存占用大概是多少？', time: '1小时前' },
      { id: 'c2', author: '王AI-深度架构师', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', content: '使用 PagedAttention 后显存只占到了 52GB，完全能够稳定运行。', time: '45分钟前' }
    ]
  },
  {
    id: 'pst_02',
    author: 'AIGC 视觉创作者',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    authorTag: '算法美术师',
    content: '分享一组在千机算力工坊生成的“赛博朋克古建”概念设计图！使用的模型是 Flux.1-Schnell + 自制 Lora，细节真的拉满！参与千机杯比赛中，求各位小伙伴点赞支持！',
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
    ],
    board: '前沿知识',
    likesCount: 256,
    commentsCount: 52,
    sharesCount: 29,
    time: '4小时前',
    isLiked: false
  }
];

export const mockApiKeys: ApiKeyItem[] = [
  {
    id: 'key_01',
    name: '生产环境 Agent 专属 Key',
    prefix: 'qj_live_8f3a9...',
    scope: 'Full Access',
    dailyLimit: 10000,
    usedToday: 1420,
    totalCalls: 45200,
    createdAt: '2026-06-01',
    lastUsedAt: '5分钟前',
    status: 'active'
  },
  {
    id: 'key_02',
    name: '测试环境 Test Key',
    prefix: 'qj_test_3b11c...',
    scope: 'Read Only',
    dailyLimit: 2000,
    usedToday: 320,
    totalCalls: 8900,
    createdAt: '2026-07-15',
    lastUsedAt: '2小时前',
    status: 'active'
  }
];

export const mockApiLogs: ApiCallLog[] = [
  { id: 'log_1', timestamp: '2026-08-11 11:20:14', targetName: 'Gemini 3.6 Flash', endpoint: '/v1/chat/completions', inputTokens: 420, outputTokens: 420, tokensUsed: 840, cost: 0.0025, status: '200 OK', responseTimeMs: 190 },
  { id: 'log_2', timestamp: '2026-08-11 11:18:02', targetName: '代码重构与安全审计 Agent', endpoint: '/v1/agent/run', inputTokens: 1200, outputTokens: 900, tokensUsed: 2100, cost: 0.0063, status: '200 OK', responseTimeMs: 420 },
  { id: 'log_3', timestamp: '2026-08-11 11:05:40', targetName: 'DeepSeek-R1-Distill-70B', endpoint: '/v1/chat/completions', inputTokens: 2800, outputTokens: 1400, tokensUsed: 4200, cost: 0.0126, status: '200 OK', responseTimeMs: 650 },
  { id: 'log_4', timestamp: '2026-08-11 10:45:11', targetName: 'Flux.1-Schnell', endpoint: '/v1/images/generations', inputTokens: 150, outputTokens: 0, tokensUsed: 150, cost: 0.0200, status: '200 OK', responseTimeMs: 1100 },
  { id: 'log_5', timestamp: '2026-08-11 10:30:22', targetName: 'Qwen2.5-72B-Instruct', endpoint: '/v1/chat/completions', inputTokens: 3500, outputTokens: 1800, tokensUsed: 5300, cost: 0.0159, status: '200 OK', responseTimeMs: 510 },
  { id: 'log_6', timestamp: '2026-08-11 09:15:00', targetName: 'bge-m3-embedding', endpoint: '/v1/embeddings', inputTokens: 800, outputTokens: 0, tokensUsed: 800, cost: 0.0008, status: '429 Rate Limit', responseTimeMs: 45 }
];

export const mockAsyncTasks: AsyncCallTask[] = [
  { id: 'async_vid_9921', taskType: '视频生成', status: '已完成', durationSec: 42, cost: 0.50, createdAt: '2026-08-11 10:30', outputUrl: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-details-4220-large.mp4' },
  { id: 'async_img_8832', taskType: '图像生成', status: '已完成', durationSec: 8, cost: 0.08, createdAt: '2026-08-11 09:15', outputUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80' },
  { id: 'async_tune_1002', taskType: '模型微调', status: '处理中', durationSec: 1820, cost: 12.50, createdAt: '2026-08-11 08:00' },
  { id: 'async_tts_4410', taskType: '音频合成', status: '已完成', durationSec: 12, cost: 0.15, createdAt: '2026-08-10 16:20' }
];

export const mockOrders: OrderItem[] = [
  { id: 'ord_101', orderNo: 'ORD_20260811001', itemName: '代码重构专家 VIP 永久授权', type: 'Agent购买', amount: 99.00, amountUnit: '元', payMethod: '微信支付', payTime: '2026-08-11 10:15', status: '已支付', transactionNo: 'TX_WX_883920199201' },
  { id: 'ord_102', orderNo: 'ORD_20260810088', itemName: 'GPU 算力充值包 (100 卡时)', type: '算力充值', amount: 200.00, amountUnit: '元', payMethod: '支付宝', payTime: '2026-08-10 14:30', status: '已支付', transactionNo: 'TX_ALI_992018832011' },
  { id: 'ord_103', orderNo: 'ORD_20260808012', itemName: '开发者 5,000 积分礼包', type: '积分充值', amount: 50.00, amountUnit: '元', payMethod: '微信支付', payTime: '2026-08-08 11:20', status: '已支付', transactionNo: 'TX_WX_772819002811' },
  { id: 'ord_104', orderNo: 'ORD_20260805003', itemName: '金融研报 & 财报速读智囊 专属订阅', type: 'Agent购买', amount: 200, amountUnit: '积分', payMethod: '积分扣减', payTime: '2026-08-05 16:45', status: '已支付', transactionNo: 'TX_PTS_102938472911' },
  { id: 'ord_105', orderNo: 'ORD_20260801009', itemName: 'A100 包月算力预付定金', type: '算力充值', amount: 1000.00, amountUnit: '元', payMethod: '支付宝', payTime: '2026-08-01 09:00', status: '已退款', transactionNo: 'TX_ALI_110293848122' }
];

export const mockPointStoreItems: PointStoreItem[] = [
  { id: 'store_1', name: 'GPU 算力卡 (10 卡时 T4/RTX4090)', type: '算力卡', pointsRequired: 500, stock: 120, image: '⚡', description: '包含 10 小时 T4 或 4090 算力体验时长，全平台算力容器通用。' },
  { id: 'store_2', name: '大模型 API Token 礼包 (1,000,000 Tokens)', type: 'Token包', pointsRequired: 300, stock: 500, image: '🎁', description: '全平台模型通用 API 调用额度，有效期 90 天。' },
  { id: 'store_3', name: '千机认证 Agent 架构师考试券', type: '认证考试券', pointsRequired: 1000, stock: 50, image: '📜', description: '包含 1 次千机 AI 官方认证架构师线上考试资格与电子证书。' },
  { id: 'store_4', name: '千机 AI 极客纪念版连帽衫', type: '实体周边', pointsRequired: 2500, stock: 15, image: '👕', description: '纯棉高品质极客定制连帽卫衣，含千机专属刺绣 LOGO（包邮）。' }
];

export const mockDatasetApplications: DatasetApplication[] = [
  { id: 'app_1', datasetId: 'ds_02', datasetName: 'A股上市公司财报与年报结构化 Corpus', applicantName: '张学者', applicantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', purpose: '用于高校课题组《上市公司 ESG 报告与财务风险推演大模型》论文对比实验', applyTime: '2026-08-10 16:30', status: '待审批' },
  { id: 'app_2', datasetId: 'ds_02', datasetName: 'A股上市公司财报与年报结构化 Corpus', applicantName: '量化星云团队', applicantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', purpose: '用于商业量化策略回测与财报舆情情绪分析 Agent 训练', applyTime: '2026-08-08 11:00', status: '已通过' }
];

export const mockCollaborationMessages: TaskCollaborationMessage[] = [
  { id: 'm1', senderName: '北京天元律师事务所', senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', isSelf: false, content: '你好！我们已经审阅了你提交的竞标方案，主要关注劳动合同与采购免责条款的抽取准确率。', time: '2026-08-10 10:00' },
  { id: 'm2', senderName: '极客小千 (你)', senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', isSelf: true, content: '您好！我们基于 Qwen2.5-72B 构建了两阶段 RAG 检索引擎，在 200 例测试用例上 F1-score 达到 94.2%。我已经上传了 preliminary_test_report.pdf。', attachmentName: 'preliminary_test_report.pdf', attachmentSize: '3.2 MB', time: '2026-08-10 10:15', versionTag: '交付物 v1.0' },
  { id: 'm3', senderName: '北京天元律师事务所', senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', isSelf: false, content: '太棒了！报告我们看到了，请继续推进并完成交付物归档。', time: '2026-08-10 11:05' }
];

export const mockLoginDevices: LoginDeviceItem[] = [
  { id: 'dev_1', deviceName: 'MacBook Pro 16" (M3 Max)', browser: 'Chrome 127.0 (macOS)', ip: '120.24.88.102', location: '中国 · 北京市', loginTime: '2026-08-11 08:30 (当前设备)', isCurrent: true },
  { id: 'dev_2', deviceName: 'iPhone 15 Pro Max', browser: 'Mobile Safari 17.5', ip: '114.215.120.45', location: '中国 · 北京市', loginTime: '2026-08-10 21:15', isCurrent: false },
  { id: 'dev_3', deviceName: 'Ubuntu Workstation', browser: 'Firefox 128.0', ip: '123.57.190.22', location: '中国 · 浙江省杭州市', loginTime: '2026-08-08 14:00', isCurrent: false }
];

export const mockPointRecords: PointRecord[] = [
  { id: 'pr_1', title: '每日签到奖励', amount: 50, type: 'earn', source: '每日签到', timestamp: '2026-08-11 09:00' },
  { id: 'pr_2', title: '完成新手引导任务【浏览Agent】', amount: 30, type: 'earn', source: '新手引导', timestamp: '2026-08-11 09:05' },
  { id: 'pr_3', title: '租赁 T4 16GB GPU 算力 (2小时)', amount: -50, type: 'spend', source: '算力工坊', timestamp: '2026-08-10 14:00' },
  { id: 'pr_4', title: 'Agent【代码重构助手】获用户好评', amount: 40, type: 'earn', source: 'Agent分成收益', timestamp: '2026-08-09 18:30' }
];

export const mockLeaderboards = {
  topAgents: [
    { rank: 1, name: '代码重构与安全审计 Agent', usage: '14,250 次调用', author: '千机官方实验室' },
    { rank: 2, name: 'ComfyUI 绘图提示词大师', usage: '23,100 次调用', author: 'AIGC 视觉引擎' },
    { rank: 3, name: '全语种实时翻译与同传专家', usage: '31,000 次调用', author: '千机官方实验室' },
    { rank: 4, name: '金融研报 & 财报速读智囊', usage: '8,900 次调用', author: '量化星云团队' }
  ],
  topDevelopers: [
    { rank: 1, name: '王AI-深度架构师', score: '9,850 开发者积分', title: '千机认证架构师' },
    { rank: 2, name: '极客小千 (你)', score: '7,420 开发者积分', title: '全栈 Agent 专家' },
    { rank: 3, name: '华西数字医疗课题组', score: '6,900 开发者积分', title: '医疗垂直专家' },
    { rank: 4, name: '量化星云团队', score: '5,800 开发者积分', title: '金融量化先锋' }
  ],
  hardestTasks: [
    { rank: 1, title: '【招标】微调 70B 医疗多模态大模型', bounty: '¥35,000', difficulty: 'SSS 级' },
    { rank: 2, title: '【悬赏】定制基于 Qwen2.5 的合同审查 Agent', bounty: '¥8,000', difficulty: 'SS 级' },
    { rank: 3, title: '【竞赛】“千机杯”创意文生图 Lora 挑战赛', bounty: '50,000 积分', difficulty: 'S 级' }
  ],
  richPoints: [
    { rank: 1, name: 'SuperQuant', points: '128,500  pts' },
    { rank: 2, name: 'AI_Master_2026', points: '98,200 pts' },
    { rank: 3, name: '全栈算法小白', points: '64,100 pts' },
    { rank: 4, name: '极客小千 (你)', points: '1,280 pts' }
  ]
};

export const mockSystemAnnouncements = [
  { id: 'a1', title: '【平台公告】千机·AI空间 1.0 版本正式发版，新增 Gemini 3.6 与 DeepSeek-R1 算力节点支持', date: '2026-08-11' },
  { id: 'a2', title: '【维护通知】算力工坊 A100 集群将于今晚 02:00-03:00 进行固件例行升级', date: '2026-08-10' },
  { id: 'a3', title: '【规则变更】Agent 分成比例全面提升至 85%，鼓励开发者创建高质量行业 Agent', date: '2026-08-08' }
];

export const mockAccountTransactions: AccountTransaction[] = [
  {
    id: 'tx_001',
    time: '今天 10:32',
    title: '充值',
    category: 'recharge',
    currencyType: 'rmb',
    rmbAmount: 100.00,
    rmbBalanceAfter: 128.00,
    paymentMethod: '微信支付',
    status: 'success'
  },
  {
    id: 'tx_002',
    time: '今天 09:15',
    title: '算力租赁',
    category: 'expense',
    currencyType: 'both',
    rmbAmount: -42.00,
    pointsAmount: -200,
    rmbBalanceAfter: 28.00,
    pointsBalanceAfter: 1200,
    deductionInfo: '积分抵扣 -200分',
    status: 'success'
  },
  {
    id: 'tx_003',
    time: '昨天 18:00',
    title: '每日签到',
    category: 'points_earn',
    currencyType: 'points',
    pointsAmount: 5,
    pointsBalanceAfter: 1400,
    status: 'success'
  },
  {
    id: 'tx_004',
    time: '昨天 14:20',
    title: '购买Agent',
    category: 'expense',
    currencyType: 'rmb',
    rmbAmount: -30.00,
    rmbBalanceAfter: 70.00,
    status: 'success'
  },
  {
    id: 'tx_005',
    time: '前天 09:00',
    title: '发布Agent',
    category: 'points_earn',
    currencyType: 'points',
    pointsAmount: 50,
    pointsBalanceAfter: 1395,
    status: 'success'
  },
  {
    id: 'tx_006',
    time: '3天前 16:45',
    title: '算力按时消费',
    category: 'expense',
    currencyType: 'rmb',
    rmbAmount: -15.00,
    rmbBalanceAfter: 100.00,
    status: 'success'
  },
  {
    id: 'tx_007',
    time: '4天前 11:20',
    title: '在线充值',
    category: 'recharge',
    currencyType: 'rmb',
    rmbAmount: 50.00,
    rmbBalanceAfter: 115.00,
    paymentMethod: '支付宝',
    status: 'success'
  },
  {
    id: 'tx_008',
    time: '5天前 10:00',
    title: '兑换高级模型抵扣券',
    category: 'points_spend',
    currencyType: 'points',
    pointsAmount: -100,
    pointsBalanceAfter: 1345,
    status: 'success'
  }
];
