/**
 * AI运营中心 - 类型定义
 */

export type MainTabType = 
  | 'home' 
  | 'marketplace' 
  | 'tasks' 
  | 'compute' 
  | 'learning' 
  | 'creative'
  | 'community' 
  | 'workspace';

export type MarketplaceSubTab = 'agent' | 'model' | 'dataset' | 'skill';

export type WorkspaceSubTab = 
  | 'overview' 
  | 'assets' 
  | 'my-tasks' 
  | 'orders'
  | 'calls' 
  | 'apikeys' 
  | 'points' 
  | 'notifications' 
  | 'settings';

export type AgentCategory = 
  | 'all' 
  | 'dialogue' 
  | 'coding' 
  | 'data' 
  | 'image' 
  | 'vertical';

export type ModelTypeTag = '文本' | '图像' | '音频' | '视频' | 'Embedding' | '重排';

// 用户信息与积分
export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  levelBadge: string;
  identityTag: string;
  skills: string[];
  balance: number; // 账户人民币可用余额(元)
  frozenBalance?: number; // 冻结资金(元)
  points: number; // 可用积分
  frozenPoints?: number; // 冻结积分
  todayEarnedPoints: number;
  githubUrl?: string;
  websiteUrl?: string;
  bio: string;
  mfaEnabled: boolean;
}

export type TransactionCategory = 'recharge' | 'expense' | 'points_earn' | 'points_spend';

export interface AccountTransaction {
  id: string;
  time: string;
  title: string; // 交易项目或类型 (如: 充值, 算力租赁, 每日签到, 购买Agent)
  category: TransactionCategory;
  currencyType: 'rmb' | 'points' | 'both';
  rmbAmount?: number; // 人民币金额 (正数为增加，负数为支出)
  pointsAmount?: number; // 积分变动 (正数为增加，负数为消耗)
  rmbBalanceAfter?: number; // 变动后余额
  pointsBalanceAfter?: number; // 变动后积分
  paymentMethod?: string; // 支付方式 (如 微信支付, 支付宝)
  status?: 'success' | 'failed' | 'pending';
  deductionInfo?: string; // 抵扣说明 (如 "积分抵扣 -200分")
}

export interface PointRecord {
  id: string;
  title: string;
  amount: number; // 正数为获取，负数为消耗
  type: 'earn' | 'spend';
  source: string;
  timestamp: string;
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  pointsReward: number;
  completed: boolean;
  actionKey: string;
}

export interface AppNotification {
  id: string;
  title: string;
  content: string;
  type: 'system' | 'interaction' | 'task' | 'points';
  time: string;
  read: boolean;
  targetTab?: MainTabType;
  targetId?: string;
}

// Agent 资产分类与形态筛选
export type AppType = '工作流' | 'Chatflow' | '聊天助手' | 'Agent' | '文本生成应用';
export type TechFormType = 'Chatbot' | 'Agent' | 'Chatflow' | 'Workflow' | '文本生成' | AppType;
export type AppSceneType = '内容创作' | '数据分析' | '智能客服' | '办公助理' | '编程开发' | '营销推广' | '教育培训' | '行业垂直';
export type IndustryDomainType = '政务' | '制造' | '零售' | '金融' | '医疗' | '教育' | '文旅' | '通用' | '企业' | '物流';
export type PriceModeFilterType = 'all' | 'free' | 'token';

export interface AgentComment {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  date: string;
}

export interface AgentVersionLog {
  version: string;
  date: string;
  log: string;
}

export interface AgentItem {
  id: string;
  name: string;
  avatar: string;
  description: string;
  category: AgentCategory;
  rating: number; // 1-5
  ratingCount: number;
  priceType: 'free' | 'points' | 'cash' | 'token';
  priceValue: number; // 0 或 积分值 或 元
  priceModel?: '免费' | '按Token计费';
  priceText?: string; // 如 "¥0.50 / 万Token"
  techForm?: TechFormType;
  appType?: AppType;
  iconBgColor?: string;
  iconType?: string;
  scene?: AppSceneType;
  industry?: IndustryDomainType;
  servicedCount?: number; // 如 1234
  developer?: string; // 如 "张三科技"
  giftTokenText?: string; // 如 "新用户赠送 10万Token体验额度（7天有效）"
  capabilityDesc?: string[];
  applicableScenes?: string[];
  inputExample?: string;
  outputExample?: string;
  useGuide?: string;
  versionLogs?: AgentVersionLog[];
  comments?: AgentComment[];
  usageCount: number;
  tags: string[]; // ['热门', '新上', '官方']
  author: string;
  authorAvatar?: string;
  baseModel?: string;
  version?: string;
  techDocs?: string;
  createdAt?: string;
  updatedAt?: string;
  isFavorite?: boolean;
  todayTokenUsage?: number;
  isPurchased?: boolean;
  isDeveloped?: boolean;
  publishStatus?: 'published' | 'reviewing' | 'offline';
}

// Agent 订阅套餐定义
export interface SubscriptionPackage {
  id: 'week' | 'month' | 'quarter' | 'year';
  name: string;
  price: number;
  tokenAmountText: string;
  tokenAmountVal: number; // 单位：万Token
  unitPriceText: string; // 换算每万Token单价
  validityDays: number;
  isRecommended?: boolean;
  tag?: string;
  targetAudience: string;
}

// 用户订阅的 Agent 记录
export interface AgentSubscriptionItem {
  agentId: string;
  agentName: string;
  tier: 'week' | 'month' | 'quarter' | 'year';
  tierName: string;
  price: number;
  tokenAmountVal: number;
  tokensLeftVal: number;
  expireDate: string;
  subscribedAt: string;
}

// 模型
export interface ModelItem {
  id: string;
  name: string;
  vendor: string; // 如 'DeepSeek', 'Google', '阿里', '智谱'
  author?: string; // 作者品牌，如 'DeepSeek', 'MoonshotAI', 'ByteDance', 'Alibaba', 'Z.ai', 'Qwen', 'MiniMax'
  providerList?: string[]; // 提供商列表，如 ['无问芯穹', '阿里云百炼', '百度千帆', '百度智能云', '腾讯云']
  modelCodeName?: string; // 如 'deepseek-v4-pro-0813'
  versionName?: string; // 如 'DeepSeek V4 Pro 0813 版本'
  totalTokensUsed?: string; // 如 '1.11B tokens', '10.31B tokens'
  protocol?: string; // 如 'OpenAI Completions'
  inputModalities?: string[]; // ['文本', '图像', '视频']
  outputModalities?: string[]; // ['文本']
  cachedPrice?: string; // 如 '¥0.025 /M tokens'
  throughputTps?: number; // 如 76
  availabilityPercent?: number; // 如 99.9
  typeTag: ModelTypeTag;
  contextLength?: string; // 如 '128K', '1M'
  priceInput: string; // ¥0.002 / 1k tokens
  priceOutput: string;
  tags: string[]; // ['热门', '国产', '免费额度']
  description: string;
  benchmarks: { name: string; score: number }[];
  latencyMs: number;
  apiDocsUrl: string;
}

// 数据集文件与结构
export interface DatasetFileItem {
  id: string;
  name: string;
  size: string;
  format: 'csv' | 'xlsx' | 'json' | 'jsonl' | 'parquet' | 'txt' | 'zip';
  rowsCount: number;
  colsCount: number;
  encoding: string;
  headers: string[];
  sampleRows: Record<string, string | number>[];
}

export interface DatasetCommentReply {
  id: string;
  userName: string;
  userAvatar: string;
  time: string;
  content: string;
}

export interface DatasetCommentItem {
  id: string;
  userName: string;
  userAvatar: string;
  time: string;
  content: string;
  likes?: number;
  replies?: DatasetCommentReply[];
}

// 数据集
export interface DatasetItem {
  id: string;
  name: string;
  repoPath: string; // 如 "open-rs/HRSC2016", "PowerBI零售数据分析实战配套数据集"
  coverImage?: string; // 封面图
  author: string;
  authorAvatar?: string;
  authorOrg?: string; // 如 "逐聚开源智能平台", "百度开源", "中科天机", "开放数据集镜像"
  updatedAt: string; // 如 "2026/08/13"
  relativeTime: string; // 如 "1 年前", "2 年前", "3 天前", "6 天前", "5 个月前"
  viewsCount: number; // 👁 浏览量 (如 12091, 2254, 72)
  downloadCount: number; // ⬇ 下载量 (如 734, 146, 9)
  likesCount: number; // 👍 点赞数
  favoritesCount: number; // ⭐ 收藏数 (♡ 0, ♡ 2)
  isLiked?: boolean;
  isFavorite?: boolean;
  isCreatedByMe?: boolean;
  isMounted?: boolean;

  // 分类与标签
  modalityCategory: '多模态' | '计算机视觉' | '自然语言处理' | '音频' | '表格' | '强化学习';
  taskType: string; // 如 '图像描述', '无条件图像生成', '文本生成', '时间序列预测', '特征抽取', '文本分类', '物体检测'
  domainTags: string[]; // 如 ['科技互联网', '经济', '商业', '电商', '金融科技', '数据分析', '数据挖掘']
  license: string; // 如 'CC0 公共领域共享', 'Apache 2.0', 'MIT', 'CC-BY-4.0'
  language: string; // '中文' | 'English' | '多语言'

  // 描述与文档 (对齐详情页-概述)
  description: string;
  backgroundDesc: string; // 背景描述
  dataDesc: string; // 数据说明
  sourceDesc: string; // 数据来源
  problemDesc: string; // 问题描述

  // 基础信息 (对齐详情页-概述右侧信息)
  mountPath: string; // 挂载目录如 "/home/mw/input/sjiiaa8769"
  fileFormats: string; // 如 ".csv, .xlsx"
  fileSize: string; // 如 "267.5 MB", "1.2 MB", "30.8 GB"
  filesCount: number; // 如 6, 1, 20
  theme: string; // 主题 如 "商业", "科技互联网", "医疗健康", "气象"
  techDomain: string; // 技术领域 如 "数据挖掘", "特征工程", "多模态大模型"

  // 关联文件列表 (对齐详情页-文件)
  files: DatasetFileItem[];

  // 评论列表 (对齐详情页-评论)
  comments: DatasetCommentItem[];

  // 兼容性字段
  industry?: string;
  format?: string;
  scale?: string;
  size?: string;
  rowsCount?: string;
  dataType?: string;
  sampleRows?: any[];
  fields?: { name: string; type: string; desc: string }[];
  lineage?: string[];
  isPrivate?: boolean;
}

// Skill 插件文件节点
export interface SkillFileNode {
  id: string;
  name: string;
  path: string;
  size: string;
  type: 'file' | 'folder';
  language?: 'python' | 'json' | 'yaml' | 'markdown' | 'dockerfile' | 'bash' | 'text';
  content?: string; // 文件内容，用于代码与文本在线预览
  children?: SkillFileNode[];
}

// Skill 插件评论
export interface SkillCommentItem {
  id: string;
  userName: string;
  userAvatar: string;
  userRole?: string;
  rating?: number;
  time: string;
  content: string;
  likes: number;
  isLiked?: boolean;
  replies?: {
    id: string;
    userName: string;
    userAvatar: string;
    userRole?: string;
    time: string;
    content: string;
    likes: number;
    isLiked?: boolean;
  }[];
}

// Skill 插件
export interface SkillPluginItem {
  id: string;
  name: string;
  repoPath?: string; // 如 "@user_a38fd8a2/valuation-analysis", "google/live-web-search"
  category: string; // '知识管理' | '办公效率' | '内容创作' | '设计多媒体' | '数据分析' | '开发编程' | '行业专业' | 'AI Agent' | '自动化'
  source?: string; // 'SkillHub' | '官方' | '开源社区'
  isOfficial?: boolean; // 官方认证小蓝盾
  needsApiKey?: boolean; // 需配置 API Key
  apiKeyProvider?: string; // API Key 提供方
  aiRating?: number; // 如 4.3
  aiRatingDesc?: string; // 如 "优秀 (AI 评分)"
  securityStatus?: string; // 如 "安全"
  voteCount?: number; // 投票数
  hasVoted?: boolean;
  
  developer: string;
  developerAvatar?: string;
  developerOrg?: string;
  authorSignature?: string; // 如 "弗兰克斯基 (Franski)"
  version: string;
  updatedAt?: string;
  relativeTime?: string;
  installs: number; // 安装量
  downloadsCount?: number; // 下载量
  viewsCount?: number;
  likesCount?: number;
  favoritesCount?: number;
  isLiked?: boolean;
  isFavorite?: boolean;
  description: string;
  license?: string;
  compatibleAgents: string;
  runtimeEnv?: string; // 如 "Python 3.11+", "Node.js 20+", "Docker Sandbox"
  packageFormat?: string; // 如 "ZIP, Wheel, Git"
  packageSize?: string; // 如 "1.4 MB", "3.2 MB"
  requiredPermissions: string[];
  tags?: string[];
  
  // 详情页 - 概述扩展
  copyrightNotice?: string; // 知识产权声明
  licenseTerms?: {
    allowed: string[]; // 允许的项目
    forbidden: string[]; // 禁止的项目
  };
  disclaimer?: string; // 免责声明
  authorBio?: string; // 作者及方法论说明
  dependencies?: {
    name: string;
    purpose: string;
    installCmd: string;
  }[];
  systemArchAscii?: string; // 系统架构 ASCII 示意框图
  coreModules?: {
    name: string;
    functionDesc: string;
    docPath: string;
  }[];
  backgroundDesc?: string;
  featuresDesc?: string[];
  toolDefinitionSchema?: string; // Function Calling JSON Schema
  pythonDecoratorCode?: string; // Python @tool 装饰器代码
  agentIntegrationCode?: string; // Agent 接入示例代码
  
  // 详情页 - 文件树与预览
  files?: SkillFileNode[];
  
  // 详情页 - 评论
  comments?: SkillCommentItem[];
}

// 任务大厅规范类型
export type TaskKindType = '抢单' | '比稿';
export type TaskCategoryType = '任务';
export type TaskDomainType = '技术开发' | '内容创作' | 'AI模型与数据' | '工具与自动化' | '咨询与培训';
export type TaskDomain = TaskDomainType;
export type TaskDifficultyLevel = '简单' | '中等' | '困难';
export type TaskGlobalStatus = '审核中' | '已驳回' | '已发布' | '进行中' | '已结束' | '已验收';
export type UserTakeStatus = '未接单' | '已接单' | '已提交' | '已验收' | '已驳回';

// 兼容别名
export type TaskType = string;
export type TaskCategory = TaskDomainType | '技术开发' | '数据服务' | '模型训练' | '应用构建' | '方案设计' | '其他';
export type TaskDifficulty = TaskDifficultyLevel | '入门' | '进阶' | '专家' | '大师';
export type TaskStatus = TaskGlobalStatus;

export interface TaskBidItem {
  id: string;
  taskId: string;
  bidderId: string;
  bidderName: string;
  bidderAvatar: string;
  bidderTitle: string;
  bidderScore: number;
  bidAmount: number;
  bidUnit: '¥' | '积分';
  proposal: string;
  deliverDays: number;
  submittedTime: string;
  status: '待审核' | '已中标' | '已谢绝';
}

export interface TaskFileItem {
  id: string;
  name: string;
  size: string;
  url?: string;
}

export interface TaskSubmissionRecord {
  id: string;
  taskId: string;
  username: string;
  userAvatar: string;
  submitTime: string;
  notes: string;
  files: TaskFileItem[];
  status: '待验收' | '已通过' | '已驳回';
  rejectReason?: string;
  verifiedTime?: string;
}

export interface TaskTakerRecord {
  id: string;
  taskId: string;
  username: string;
  userAvatar: string;
  takeTime: string;
  status: '已接单' | '已抢单承接' | '已提交' | '已验收' | '已驳回';
  submissionId?: string;
  submission?: TaskSubmissionRecord;
}

export interface TaskItem {
  id: string;
  title: string; // 标题限30字
  taskType: TaskKindType; // '抢单' 或 '比稿'
  maxTakersLimit?: number; // 比稿任务上限人数（如最少不少于2人，0表示不限）
  brief?: string; // 一句话简述
  domain: TaskDomainType; // 所属领域5选1
  difficulty: TaskDifficultyLevel; // 简单/中等/困难
  
  // 描述与验收标准（富文本）
  description: string; // 富文本HTML/Markdown
  acceptanceCriteria: string; // 富文本HTML/Markdown
  
  // 奖励设置
  cashReward: number; // 现金奖励（元）
  pointsReward: number; // 积分奖励（个）
  totalCashReward?: number; // 兼容总现金
  totalPointsReward?: number; // 兼容总积分
  
  // 交付周期
  startTime: string; // YYYY-MM-DD HH:mm:ss
  endTime: string; // YYYY-MM-DD HH:mm:ss
  remainingDays?: number; // 剩余天数
  
  // 发布者信息
  publisher: string;
  publisherAvatar: string;
  publishTime: string; // 提交/发布时间
  
  // 任务全局状态
  status: TaskGlobalStatus; // '审核中' | '已驳回' | '已发布' | '进行中' | '已结束' | '已验收'
  isAccepted?: boolean;
  rejectReason?: string; // 审核驳回原因
  auditTime?: string;
  
  // 中标获胜者信息
  winner?: {
    username: string;
    userAvatar: string;
    passTime: string;
    notes?: string;
  };
  
  // 统计数据
  acceptedCount: number; // 已接单人数
  submittedCount: number; // 已提交人数
  verifiedCount: number; // 已验收人数 (0 或 1)
  
  // 明细记录
  takers?: TaskTakerRecord[];
  submissions?: TaskSubmissionRecord[];
  
  // 兼容与可选字段
  categoryType?: string;
  taskCount?: number;
  type?: any;
  category?: any;
  bounty?: number;
  bountyUnit?: '¥' | '积分';
  rewardText?: string;
  requiredSkills?: string[];
  bidCount?: number;
  viewCount?: number;
  deliverables?: string;
  attachments?: any;
  escrow?: any;
  bids?: any;
  milestones?: any;
}

export interface TaskBid extends TaskBidItem {}

// 学习中心
export interface CourseItem {
  id: string;
  title: string;
  category: 'AI基础' | '大模型' | 'Agent开发' | '行业应用';
  cover: string;
  instructor: string;
  instructorTitle: string;
  studentsCount: number;
  rating: number;
  chaptersCount: number;
  description: string;
  hasCert: boolean;
  chapters: { id: string; title: string; duration: string; notebookPreset?: string }[];
}

export interface LearningPathItem {
  id: string;
  title: string;
  description: string;
  stepCount: number;
  badgeName: string;
  targetRole: string;
}

// 算力工坊
export type ComputeMode = 'container' | 'server'; // 容器实例 | 云服务器实例

export interface RentalGPUCard {
  id: string;
  title: string;
  availableCards: number;
  hourlyPrice: number;
  dayPrice: number;
  weekPrice: number;
  monthPrice: number;
  topBorderColor: string; // border-t-amber-600等
  gpuModel: string;
  vram: string;
  cpu: string;
  ram: string;
  disk: string;
}

export interface InstanceFileItem {
  name: string;
  size: string;
  isDir: boolean;
  modified: string;
}

export interface InstanceSnapshot {
  id: string;
  name: string;
  description: string;
  size: string;
  createdAt: string;
  gpuModel: string;
}

export interface GPUInstance {
  id: string;
  name: string;
  instanceType: ComputeMode; // 'container' | 'server'
  scene: '大模型微调' | '文生图' | 'Notebook开发' | '推理服务' | '自定义';
  gpuModel: string; // 'T4 16GB' | 'V100 24GB' | 'A100 80GB' | 'RTX 4090 24GB' | 'RTX 3090 24GB'
  gpuCount: number;
  vram: string;
  cpu: string;
  ram: string;
  region: string; // '华北 · 北京' | '华东 · 上海' | '华南 · 广州'
  billingType: '按量计费' | '包日' | '包周' | '包月' | '抢占式';
  status: 'running' | 'stopped' | 'allocating' | 'failed' | 'destroyed';
  isCpuOnly?: boolean;
  
  // 存储与网络
  systemDisk: string; // '40GB SSD' | '100GB NVMe'
  dataDisk: string; // '无' | '100GB NVMe' | '500GB NVMe'
  publicIp: string; // IP 或 包含 10Mbps Bandwidth
  osName: string; // 'Ubuntu 22.04 LTS' | 'Windows Server 2019'
  
  // 连接入口
  ipAddress: string;
  runningHours: number;
  hourlyCost: number; // 元/小时
  totalCost: number;
  createdAt: string;
  jupyterUrl?: string;
  vncUrl?: string;
  vscodeUrl?: string;
  sshCommand?: string;
  imageName: string;

  // 监控与数据
  monitoring?: {
    gpuUsage: number[];
    vramUsage: number[];
    cpuUsage: number[];
    ramUsage: number[];
  };
  fileList?: InstanceFileItem[];
  snapshots?: InstanceSnapshot[];
  securityRules?: { port: string; protocol: string; cidr: string; desc: string }[];
  logs?: { id: string; action: string; time: string; status: string }[];
}

export interface GpuPricing {
  model: string;
  vram: string;
  scenario: string;
  pricePerHour: number;
  discountPrice?: number;
  badge: string;
}

export interface ComputeImageItem {
  id: string;
  name: string;
  category: '官方镜像' | '社区热门' | 'App市场';
  tag: string;
  version: string;
  description: string;
  downloads: number;
  icon: string;
  presetScene: GPUInstance['scene'];
}

// 社区
export type CommunityBoard = 
  | '干货分享' 
  | '求助答疑' 
  | '前沿观察' 
  | '赚钱交流' 
  | '同行交流' 
  | '娱乐灌水';

export interface FeedPost {
  id: string;
  title?: string;
  author: string;
  authorAvatar: string;
  authorTag: string;
  content: string;
  images?: string[];
  board: CommunityBoard;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount?: number;
  time: string;
  isLiked?: boolean;
  isCollected?: boolean;
  isTop?: boolean;
  tags?: string[];
  commentsList?: { id: string; author: string; avatar: string; content: string; time: string }[];
}

// API Key 管理
export interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  keySecret?: string;
  scope: string; // 'Full Access' | 'Read Only'
  dailyLimit: number;
  usedToday: number;
  totalCalls: number;
  createdAt: string;
  lastUsedAt: string;
  status: 'active' | 'revoked';
}

// API 调用记录
export interface ApiCallLog {
  id: string;
  timestamp: string;
  targetName: string; // Agent / Model 名称
  endpoint: string;
  inputTokens: number;
  outputTokens: number;
  tokensUsed: number;
  cost: number;
  status: '200 OK' | '429 Rate Limit' | '500 Error';
  responseTimeMs: number;
}

// 异步任务记录
export interface AsyncCallTask {
  id: string;
  taskType: '视频生成' | '图像生成' | '模型微调' | '音频合成';
  status: '排队中' | '处理中' | '已完成' | '已失败';
  durationSec: number;
  cost: number;
  createdAt: string;
  outputUrl?: string;
  errorMsg?: string;
}

// 交易订单
export interface OrderItem {
  id: string;
  orderNo: string;
  itemName: string;
  type: 'Agent购买' | '算力充值' | '积分充值';
  amount: number;
  amountUnit: '元' | '积分';
  payMethod: '微信支付' | '支付宝' | '积分扣减';
  payTime: string;
  status: '待支付' | '已支付' | '已取消' | '已退款';
  transactionNo: string;
}

// 积分商城商品
export interface PointStoreItem {
  id: string;
  name: string;
  type: '算力卡' | 'Token包' | '认证考试券' | '实体周边';
  pointsRequired: number;
  stock: number;
  image: string;
  description: string;
}

// 数据集审批申请
export interface DatasetApplication {
  id: string;
  datasetId: string;
  datasetName: string;
  applicantName: string;
  applicantAvatar: string;
  purpose: string;
  applyTime: string;
  status: '待审批' | '已通过' | '已驳回';
}

// 任务协作空间消息
export interface TaskCollaborationMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  isSelf: boolean;
  content: string;
  image?: string;
  attachmentName?: string;
  attachmentSize?: string;
  time: string;
  versionTag?: string;
}

// 赛事中心类型定义
export type CompetitionStatus = 'all' | 'unstarted' | 'ongoing' | 'ended';

export type CompetitionTypeTag = 
  | 'AI数据科学赛' 
  | 'AI安全挑战赛' 
  | 'AIGC生成赛' 
  | 'AI产品应用赛';

export interface MatchTrackItem {
  id: string;
  name: string; // 全称 如 "AI数据科学赛道"
  shortName: string; // 简称 如 "数据科学赛道"，用于 TAB 名称
  coverImage: string; // 比赛封面小图
  timeRange: string; // 如 "2026-09-01 00:00:00 ~ 2026-10-15 23:59:59"
  typeTag: CompetitionTypeTag;
  description: string; // 赛道介绍
  problemStatement: string; // 赛题说明
  evaluationMetrics: string; // 评估指标
  dataDescription?: string; // 数据说明
  ruleDescription?: string; // 赛规说明
  targetUrl?: string; // 进入比赛的目标跳转 URL
  submissionsCount?: number;
  participantsCount?: number;
  featuredWorks?: {
    id: string;
    title: string;
    author: string;
    avatar: string;
    image: string;
    score?: string;
    description: string;
    likes: number;
  }[];
}

export interface CompetitionItem {
  id: string;
  title: string; // 赛事名称
  organizer: string; // 主办方名称 如 "中国人工智能学会"
  organizerBadge?: string; // 主办方标签 如 "国家一级学会"
  coverImage: string; // 赛事封面图片 (列表卡片用)
  bannerImage: string; // 详情页顶部长条 BANNER 图片
  startTime: string; // 年月日时分秒 如 "2026-08-01 00:00:00"
  endTime: string; // 年月日时分秒 如 "2026-10-31 23:59:59"
  status: 'unstarted' | 'ongoing' | 'ended'; // 状态: 未开始 / 进行中 / 已结束
  typeTags: CompetitionTypeTag[]; // 赛事类型列表
  
  // 赛事介绍 TAB 固定内容
  introduction: {
    summary: string; // 赛事简介
    schedule: { stage: string; time: string; desc: string }[]; // 赛事流程阶段
    awards: { rank: string; reward: string; quota: string; iconBg?: string }[]; // 奖项设置
    evaluationStandards: string[]; // 评审标准
    organizingCommittee: { role: string; name: string }[]; // 组委会信息
  };

  // 绑定的比赛赛道列表
  tracks: MatchTrackItem[];
}

// 登录设备管理
export interface LoginDeviceItem {
  id: string;
  deviceName: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os?: string;
  ip: string;
  location: string;
  loginTime?: string;
  lastActiveTime?: string;
  isCurrent: boolean;
}

// 后台管理菜单
export type AdminMenuKey = 
  | 'operations'          // 运营中心
  | 'marketplace_admin'   // AI集市管理
  | 'publish_audit'       // 任务管理 - 发布审核
  | 'task_monitor'        // 任务管理 - 任务监控
  | 'compute_admin'       // 算力管理
  | 'competition_admin'   // 赛事管理
  | 'system_admin';       // 系统管理

