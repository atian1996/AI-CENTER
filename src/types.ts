/**
 * 千机·AI空间 - 类型定义
 */

export type MainTabType = 
  | 'home' 
  | 'marketplace' 
  | 'tasks' 
  | 'learning' 
  | 'compute' 
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
  balance: number; // 账户人民币余额(元)
  points: number;
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

// Agent 资产
export interface AgentItem {
  id: string;
  name: string;
  avatar: string;
  description: string;
  category: AgentCategory;
  rating: number; // 1-5
  ratingCount: number;
  priceType: 'free' | 'points' | 'cash';
  priceValue: number; // 0 或 积分值 或 元
  usageCount: number;
  tags: string[]; // ['热门', '新上', '官方']
  author: string;
  authorAvatar: string;
  baseModel: string;
  version: string;
  techDocs: string;
  createdAt: string;
  isFavorite?: boolean;
}

export interface AgentComment {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  date: string;
}

// 模型
export interface ModelItem {
  id: string;
  name: string;
  vendor: string; // 如 'DeepSeek', 'Google', '阿里', '智谱'
  typeTag: ModelTypeTag;
  contextLength: string; // 如 '128K', '1M'
  priceInput: string; // ¥0.002 / 1k tokens
  priceOutput: string;
  tags: string[]; // ['热门', '国产', '免费额度']
  description: string;
  benchmarks: { name: string; score: number }[];
  latencyMs: number;
  apiDocsUrl: string;
}

// 数据集
export interface DatasetItem {
  id: string;
  name: string;
  industry: string; // 医疗 / 金融 / 法律 / 自动驾驶 / 通用
  format: string; // JSON / CSV / Parquet / Images
  scale: string; // 50GB / 100万条 / 10万张
  license: string; // Apache 2.0 / Commercial / CC-BY
  downloadCount: number;
  description: string;
  updatedAt: string;
  fields: { name: string; type: string; desc: string }[];
  lineage: string[]; // 被引用的 Agent/模型 列表
  isPrivate: boolean;
}

// Skill 插件
export interface SkillPluginItem {
  id: string;
  name: string;
  description: string;
  compatibleAgents: string;
  developer: string;
  installs: number;
  version: string;
  requiredPermissions: string[];
}

// 任务大厅
export type TaskType = '悬赏任务' | '招标任务' | '竞赛任务';
export type TaskStatus = '招募中' | '进行中' | '已完成';

export interface TaskItem {
  id: string;
  title: string;
  type: TaskType;
  bounty: number; // 赏金 (元或积分)
  bountyUnit: '¥' | '积分';
  publisher: string;
  publisherAvatar: string;
  publishTime: string;
  deadline: string;
  requiredSkills: string[];
  bidCount: number;
  status: TaskStatus;
  description: string;
  deliverables: string;
  attachments?: string[];
}

export interface TaskBid {
  id: string;
  taskId: string;
  bidderName: string;
  bidderAvatar: string;
  proposal: string;
  portfolioUrl?: string;
  time: string;
}

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
export interface FeedPost {
  id: string;
  author: string;
  authorAvatar: string;
  authorTag: string;
  content: string;
  images?: string[];
  board: '干货分享' | '求助答疑' | '交友扩列' | '娱乐灌水' | '前沿知识' | '赚钱交流';
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  time: string;
  isLiked?: boolean;
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

// 登录设备
export interface LoginDeviceItem {
  id: string;
  deviceName: string;
  browser: string;
  ip: string;
  location: string;
  loginTime: string;
  isCurrent: boolean;
}
