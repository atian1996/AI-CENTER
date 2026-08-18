import React, { createContext, useContext, useState } from 'react';
import { 
  MainTabType, 
  MarketplaceSubTab, 
  WorkspaceSubTab, 
  UserProfile, 
  AgentItem, 
  AgentSubscriptionItem,
  ModelItem, 
  DatasetItem, 
  SkillPluginItem,
  TaskItem, 
  CourseItem, 
  GPUInstance, 
  RentalGPUCard,
  FeedPost, 
  AppNotification, 
  OnboardingTask,
  PointRecord,
  ApiKeyItem,
  CompetitionItem,
  AdminMenuKey
} from '../types';
import { 
  initialUserProfile, 
  initialOnboardingTasks, 
  initialNotifications, 
  mockAgents, 
  mockModels, 
  mockDatasets, 
  mockSkills,
  mockCourses, 
  mockGpuInstances, 
  mockFeedPosts, 
  mockApiKeys, 
  mockPointRecords, 
  mockCompetitions 
} from '../data/mockData';
import { mockRichTasks } from '../data/mockTasksData';

interface AppContextType {
  // Navigation State
  activeTab: MainTabType;
  setActiveTab: (tab: MainTabType) => void;
  setSelectedMainTab: (tab: MainTabType) => void;
  tabResetKey: Record<MainTabType, number>;
  marketplaceTab: MarketplaceSubTab;
  setMarketplaceTab: (tab: MarketplaceSubTab) => void;
  workspaceSubTab: WorkspaceSubTab;
  setWorkspaceSubTab: (sub: WorkspaceSubTab) => void;

  // Backend Admin System State
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  activeAdminMenu: AdminMenuKey;
  setActiveAdminMenu: (menu: AdminMenuKey) => void;
  enterAdminMode: (defaultMenu?: AdminMenuKey) => void;
  exitAdminMode: () => void;

  // Search & Global Modals
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Active User State
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  checkInToday: () => void;
  hasCheckedInToday: boolean;
  pointRecords: PointRecord[];
  onboardingTasks: OnboardingTask[];
  completeOnboardingTask: (taskId: string) => void;

  // Notifications
  notifications: AppNotification[];
  unreadCount: number;
  markAllNotificationsRead: () => void;
  markNotificationAsRead: (id: string) => void;

  // Data Collections
  agents: AgentItem[];
  userAgents: AgentItem[];
  models: ModelItem[];
  datasets: DatasetItem[];
  skills: SkillPluginItem[];
  favorites: AgentItem[];
  toggleFavoriteAgent: (agentId: string) => void;
  tasks: TaskItem[];
  courses: CourseItem[];
  gpuInstances: GPUInstance[];
  posts: FeedPost[];
  apiKeys: ApiKeyItem[];
  createApiKey: (name: string, scope: string, limit: number) => void;
  revokeApiKey: (id: string) => void;

  // Modal Triggers & Selection State
  openModal: (modalType: string) => void;
  sandboxAgent: AgentItem | null;
  setSandboxAgent: (agent: AgentItem | null) => void;
  detailModalAgent: AgentItem | null;
  setDetailModalAgent: React.Dispatch<React.SetStateAction<AgentItem | null>>;
  subscribeModalAgent: AgentItem | null;
  setSubscribeModalAgent: React.Dispatch<React.SetStateAction<AgentItem | null>>;
  quotaModalAgent: AgentItem | null;
  setQuotaModalAgent: React.Dispatch<React.SetStateAction<AgentItem | null>>;
  trialCountLeft: number;
  setTrialCountLeft: React.Dispatch<React.SetStateAction<number>>;
  subscriptions: Record<string, AgentSubscriptionItem>;
  setSubscriptions: React.Dispatch<React.SetStateAction<Record<string, AgentSubscriptionItem>>>;
  payPerTokenAgents: Record<string, boolean>;
  setPayPerTokenAgents: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  openAgentDetail: (agent: AgentItem) => void;
  openAgentSubscribe: (agent: AgentItem) => void;
  tryoutModel: ModelItem | null;
  setTryoutModel: (model: ModelItem | null) => void;
  detailModel: ModelItem | null;
  setDetailModel: React.Dispatch<React.SetStateAction<ModelItem | null>>;
  openModelDetail: (model: ModelItem) => void;
  selectedCompareModels: ModelItem[];
  toggleCompareModel: (model: ModelItem) => void;
  clearCompareModels: () => void;

  // Competitions
  competitions: CompetitionItem[];
  selectedCompetitionId: string | null;
  setSelectedCompetitionId: (id: string | null) => void;
  openCompetitionDetail: (compId: string) => void;

  // Action Modals & Task Flow
  createAgentModalOpen: boolean;
  setCreateAgentModalOpen: (open: boolean) => void;
  publishTaskModalOpen: boolean;
  setPublishTaskModalOpen: (open: boolean) => void;
  createComputeModalOpen: boolean;
  setCreateComputeModalOpen: (open: boolean) => void;
  createComputePreset: { mode?: 'container' | 'server'; scene?: GPUInstance['scene']; imageName?: string; card?: RentalGPUCard } | null;
  setCreateComputePreset: (preset: { mode?: 'container' | 'server'; scene?: GPUInstance['scene']; imageName?: string; card?: RentalGPUCard } | null) => void;
  detailInstance: GPUInstance | null;
  setDetailInstance: (inst: GPUInstance | null) => void;
  historyModalOpen: boolean;
  setHistoryModalOpen: (open: boolean) => void;
  
  // 任务导航跳转
  selectedTaskIdForDetail: string | null;
  setSelectedTaskIdForDetail: (id: string | null) => void;
  selectedTaskForVerification: TaskItem | null;
  setSelectedTaskForVerification: (task: TaskItem | null) => void;

  // Interactive Operations
  addAgent: (agent: Omit<AgentItem, 'id' | 'rating' | 'ratingCount' | 'usageCount' | 'createdAt'>) => void;
  purchaseAgent: (agentId: string) => void;
  addTask: (task: any) => void;
  auditTask: (taskId: string, approved: boolean, remark?: string) => void;
  withdrawTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  takeTask: (taskId: string) => void;
  submitTaskResult: (taskId: string, notes: string, files: { name: string; size: string }[]) => void;
  verifyTaskSubmission: (taskId: string, submissionId: string, approved: boolean, rejectReason?: string) => void;
  updateTask: (task: TaskItem) => void;
  submitTaskBid: (taskId: string, proposal: string, quoteAmount: number, estimatedDays: number, attachments?: string[]) => void;
  submitTaskDeliverable: (taskId: string, fileName: string, fileSize: string, summary: string, demoUrl?: string) => void;
  acceptTaskSubmission: (taskId: string, submissionId: string, comment?: string) => void;
  rejectTaskSubmission: (taskId: string, submissionId: string, comment: string) => void;
  launchGpuInstance: (scene: GPUInstance['scene'], gpuModel: string, imageName: string, customOpts?: Partial<GPUInstance>) => void;
  toggleGpuInstanceStatus: (id: string) => void;
  restartGpuInstance: (id: string) => void;
  deleteGpuInstance: (id: string) => void;
  createPost: (content: string, board: FeedPost['board'], images?: string[], title?: string, tags?: string[]) => void;
  likePost: (postId: string) => void;

  // Toast System
  toast: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<MainTabType>('home');
  const [marketplaceTab, setMarketplaceTab] = useState<MarketplaceSubTab>('agent');
  const [workspaceSubTab, setWorkspaceSubTab] = useState<WorkspaceSubTab>('overview');

  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(false);
  const [pointRecords, setPointRecords] = useState<PointRecord[]>(mockPointRecords);
  const [onboardingTasks, setOnboardingTasks] = useState<OnboardingTask[]>(initialOnboardingTasks);

  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  
  const [agents, setAgents] = useState<AgentItem[]>(mockAgents);
  const [models] = useState<ModelItem[]>(mockModels);
  const [datasets] = useState<DatasetItem[]>(mockDatasets);
  const [skills] = useState<SkillPluginItem[]>(mockSkills);
  const [favoriteAgentIds, setFavoriteAgentIds] = useState<string[]>(['ag_01', 'ag_03']);
  const [tasks, setTasks] = useState<TaskItem[]>(mockRichTasks);
  const [courses] = useState<CourseItem[]>(mockCourses);
  const [gpuInstances, setGpuInstances] = useState<GPUInstance[]>(mockGpuInstances);
  const [posts, setPosts] = useState<FeedPost[]>(mockFeedPosts);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(mockApiKeys);
  
  // 任务导航状态
  const [selectedTaskIdForDetail, setSelectedTaskIdForDetail] = useState<string | null>(null);
  const [selectedTaskForVerification, setSelectedTaskForVerification] = useState<TaskItem | null>(null);

  // Modals & Selection
  const [sandboxAgentState, setSandboxAgentState] = useState<AgentItem | null>(null);
  const [detailModalAgent, setDetailModalAgent] = useState<AgentItem | null>(null);
  const [subscribeModalAgent, setSubscribeModalAgent] = useState<AgentItem | null>(null);
  const [quotaModalAgent, setQuotaModalAgent] = useState<AgentItem | null>(null);
  const [trialCountLeft, setTrialCountLeft] = useState<number>(25);
  const [subscriptions, setSubscriptions] = useState<Record<string, AgentSubscriptionItem>>({});
  const [payPerTokenAgents, setPayPerTokenAgents] = useState<Record<string, boolean>>({});

  const setSandboxAgent = (agent: AgentItem | null) => {
    setSandboxAgentState(agent);
    if (agent) {
      setDetailModalAgent(agent);
    }
  };

  const openAgentDetail = (agent: AgentItem) => {
    setDetailModalAgent(agent);
  };

  const openAgentSubscribe = (agent: AgentItem) => {
    setSubscribeModalAgent(agent);
  };

  const [tryoutModel, setTryoutModel] = useState<ModelItem | null>(null);
  const [detailModel, setDetailModel] = useState<ModelItem | null>(null);

  const openModelDetail = (model: ModelItem) => {
    setDetailModel(model);
  };

  const [selectedCompareModels, setSelectedCompareModels] = useState<ModelItem[]>([]);

  // Competitions
  const [competitions] = useState<CompetitionItem[]>(mockCompetitions);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string | null>(null);

  // Tab reset keys to force fresh initial view on menu switches
  const [tabResetKey, setTabResetKey] = useState<Record<MainTabType, number>>({
    home: 0,
    marketplace: 0,
    tasks: 0,
    compute: 0,
    learning: 0,
    creative: 0,
    community: 0,
    workspace: 0,
  });

  // Backend Admin System State
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [activeAdminMenu, setActiveAdminMenu] = useState<AdminMenuKey>('operations');

  const enterAdminMode = (defaultMenu: AdminMenuKey = 'operations') => {
    setIsAdminMode(true);
    setActiveAdminMenu(defaultMenu);
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    } catch {
      // ignore
    }
  };

  const exitAdminMode = () => {
    setIsAdminMode(false);
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    } catch {
      // ignore
    }
  };

  const handleSetActiveTab = (tab: MainTabType) => {
    // If in admin mode, exiting back to frontend
    setIsAdminMode(false);

    // Reset all sub-page states across modules to their clean initial default
    setSelectedCompetitionId(null);
    setMarketplaceTab('agent');
    setWorkspaceSubTab('overview');
    setSelectedCompareModels([]);
    setDetailModalAgent(null);
    setSubscribeModalAgent(null);
    setQuotaModalAgent(null);
    setDetailModel(null);
    setTryoutModel(null);
    setDetailInstance(null);
    setCreateComputePreset(null);
    setCreateComputeModalOpen(false);
    setCreateAgentModalOpen(false);
    setPublishTaskModalOpen(false);
    setHistoryModalOpen(false);

    // Bump reset key for this tab to force clean re-mount and reset internal subpage states
    setTabResetKey(prev => ({
      ...prev,
      [tab]: (prev[tab] || 0) + 1
    }));

    // Scroll window and document element back to top
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    } catch {
      // ignore fallback
    }

    setActiveTab(tab);
  };

  const openCompetitionDetail = (compId: string) => {
    handleSetActiveTab('creative');
    // Set selected competition detail explicitly after resetting tab
    setSelectedCompetitionId(compId);
  };

  const [createAgentModalOpen, setCreateAgentModalOpen] = useState<boolean>(false);
  const [publishTaskModalOpen, setPublishTaskModalOpen] = useState<boolean>(false);
  const [createComputeModalOpen, setCreateComputeModalOpen] = useState<boolean>(false);
  const [createComputePreset, setCreateComputePreset] = useState<{ mode?: 'container' | 'server'; scene?: GPUInstance['scene']; imageName?: string; card?: RentalGPUCard } | null>(null);
  const [detailInstance, setDetailInstance] = useState<GPUInstance | null>(null);
  const [historyModalOpen, setHistoryModalOpen] = useState<boolean>(false);

  const [toast, setToast] = useState<string | null>(null);

  const setSelectedMainTab = (tab: MainTabType) => setActiveTab(tab);

  const userAgents = agents.filter(a => a.author === user.name || a.id.startsWith('ag_custom') || a.id.startsWith('app_') || a.isDeveloped || a.isPurchased);
  const favorites = agents.filter(a => favoriteAgentIds.includes(a.id));

  const purchaseAgent = (agentId: string) => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, isPurchased: true } : a));
    showToast('已成功添加使用权限，可在工作台/我的Agent中随时管理！');
  };

  const toggleFavoriteAgent = (agentId: string) => {
    setFavoriteAgentIds(prev => {
      if (prev.includes(agentId)) {
        showToast('已取消收藏');
        return prev.filter(id => id !== agentId);
      } else {
        showToast('已加入我的收藏');
        return [...prev, agentId];
      }
    });
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('已全部标记为已读');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const openModal = (modalType: string) => {
    if (modalType === 'createAgent') setCreateAgentModalOpen(true);
    else if (modalType === 'publishTask') setPublishTaskModalOpen(true);
    else if (modalType === 'createCompute') setCreateComputeModalOpen(true);
    else if (modalType === 'history') setHistoryModalOpen(true);
  };

  const createApiKey = (name: string, scope: string, limit: number) => {
    const newKey: ApiKeyItem = {
      id: `key_${Date.now()}`,
      name,
      prefix: `qj_sk_${Math.random().toString(36).substring(2, 8)}...`,
      keySecret: `qj_sk_${Math.random().toString(36).substring(2, 18)}`,
      scope,
      dailyLimit: limit,
      usedToday: 0,
      totalCalls: 0,
      createdAt: '刚刚',
      lastUsedAt: '从未使用',
      status: 'active'
    };
    setApiKeys(prev => [newKey, ...prev]);
    showToast(`成功创建 API Key【${name}】！`);
  };

  const revokeApiKey = (id: string) => {
    setApiKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'revoked' } : k));
    showToast('API Key 已撤销失效');
  };

  const checkInToday = () => {
    if (hasCheckedInToday) {
      showToast('今日已签到，明日再来吧！');
      return;
    }
    setHasCheckedInToday(true);
    const earnedPoints = 50;
    setUser(prev => ({
      ...prev,
      points: prev.points + earnedPoints,
      todayEarnedPoints: prev.todayEarnedPoints + earnedPoints
    }));
    const newRecord: PointRecord = {
      id: `pr_${Date.now()}`,
      title: '每日签到领积分',
      amount: earnedPoints,
      type: 'earn',
      source: '每日签到',
      timestamp: '刚刚'
    };
    setPointRecords(prev => [newRecord, ...prev]);

    // Update onboarding task
    setOnboardingTasks(prev => prev.map(t => t.actionKey === 'checkin' ? { ...t, completed: true } : t));

    showToast(`签到成功！获得 +${earnedPoints} 积分`);
  };

  const completeOnboardingTask = (taskId: string) => {
    setOnboardingTasks(prev => prev.map(t => {
      if (t.id === taskId && !t.completed) {
        setUser(u => ({ ...u, points: u.points + t.pointsReward }));
        showToast(`完成任务【${t.title}】！获得 +${t.pointsReward} 积分`);
        return { ...t, completed: true };
      }
      return t;
    }));
  };

  const toggleCompareModel = (model: ModelItem) => {
    if (selectedCompareModels.some(m => m.id === model.id)) {
      setSelectedCompareModels(prev => prev.filter(m => m.id !== model.id));
      showToast(`已将 ${model.name} 从对比项移除`);
    } else {
      if (selectedCompareModels.length >= 3) {
        showToast('最多同时对比 3 个模型');
        return;
      }
      setSelectedCompareModels(prev => [...prev, model]);
      showToast(`已添加 ${model.name} 到对比模型列表`);
    }
  };

  const clearCompareModels = () => {
    setSelectedCompareModels([]);
  };

  const addAgent = (newAgentData: Omit<AgentItem, 'id' | 'rating' | 'ratingCount' | 'usageCount' | 'createdAt'>) => {
    const newAgent: AgentItem = {
      ...newAgentData,
      id: `ag_custom_${Date.now()}`,
      rating: 5.0,
      ratingCount: 1,
      usageCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAgents(prev => [newAgent, ...prev]);
    showToast(` Agent【${newAgent.name}】创建成功并上线！`);
  };

  const addTask = (newTaskData: any) => {
    const cashReq = Number(newTaskData.totalCashReward ?? newTaskData.cashReward ?? newTaskData.bounty ?? 0);
    const pointsReq = Number(newTaskData.totalPointsReward ?? newTaskData.pointsReward ?? 0);

    // 检查可用资金与积分
    if (user.balance < cashReq) {
      showToast(`可用余额不足 (需 ¥${cashReq.toLocaleString()}，当前可用 ¥${user.balance.toLocaleString()})，请先充值`);
      return;
    }
    if (user.points < pointsReq) {
      showToast(`可用积分不足 (需 ${pointsReq} 积分，当前可用 ${user.points} 积分)`);
      return;
    }

    // 资金与积分转入冻结
    setUser(prev => ({
      ...prev,
      balance: Math.max(0, prev.balance - cashReq),
      frozenBalance: (prev.frozenBalance || 0) + cashReq,
      points: Math.max(0, prev.points - pointsReq),
      frozenPoints: (prev.frozenPoints || 0) + pointsReq
    }));

    const newTask: TaskItem = {
      id: `tsk_${Date.now()}`,
      title: newTaskData.title?.trim() || '未命名任务',
      taskType: newTaskData.taskType || '抢单',
      brief: newTaskData.brief || newTaskData.description?.replace(/<[^>]+>/g, '').slice(0, 50) || '任务简述',
      domain: newTaskData.domain || '技术开发',
      difficulty: newTaskData.difficulty || '简单',
      description: newTaskData.description || '',
      acceptanceCriteria: newTaskData.acceptanceCriteria || '',
      cashReward: cashReq,
      pointsReward: pointsReq,
      totalCashReward: cashReq,
      totalPointsReward: pointsReq,
      startTime: newTaskData.startTime || new Date().toISOString().replace('T', ' ').substring(0, 19),
      endTime: newTaskData.endTime || new Date(Date.now() + 14 * 86400000).toISOString().replace('T', ' ').substring(0, 19),
      remainingDays: 14,
      publisher: user.name,
      publisherAvatar: user.avatar,
      publishTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: '审核中', // 发布任务默认进入审核中
      acceptedCount: 0,
      submittedCount: 0,
      verifiedCount: 0,
      takers: [],
      submissions: [],
      // 兼容字段
      bounty: cashReq,
      bountyUnit: '¥'
    };

    setTasks(prev => [newTask, ...prev]);
    showToast(`任务【${newTask.title}】已提交审核！已预付托管 ¥${cashReq.toLocaleString()} 及 ${pointsReq} 积分`);
  };

  const auditTask = (taskId: string, approved: boolean, remark?: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        if (approved) {
          showToast(`已审核通过任务【${t.title}】，已上架并在大厅展示！`);
          return {
            ...t,
            status: '进行中' as const,
            auditTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
          };
        } else {
          // 审核驳回：若发布者是当前用户，全额解冻退还
          if (t.publisher === user.name) {
            const refundCash = t.cashReward || t.totalCashReward || (t.bounty || 0);
            const refundPoints = t.pointsReward || t.totalPointsReward || 0;
            setUser(u => ({
              ...u,
              balance: u.balance + refundCash,
              frozenBalance: Math.max(0, (u.frozenBalance || 0) - refundCash),
              points: u.points + refundPoints,
              frozenPoints: Math.max(0, (u.frozenPoints || 0) - refundPoints)
            }));
          }
          showToast(`已驳回任务【${t.title}】，预付托管资金已全额解冻退回！`);
          return {
            ...t,
            status: '已驳回' as const,
            rejectReason: remark || '任务描述不够详尽或存在违规内容，请修改后重新提交。',
            auditTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
          };
        }
      }
      return t;
    }));
  };

  const withdrawTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => {
      const target = prev.find(t => t.id === taskId);
      if (!target) return prev;
      if (target.publisher === user.name && target.status === '审核中') {
        const refundCash = target.cashReward || target.totalCashReward || 0;
        const refundPoints = target.pointsReward || target.totalPointsReward || 0;
        setUser(u => ({
          ...u,
          balance: u.balance + refundCash,
          frozenBalance: Math.max(0, (u.frozenBalance || 0) - refundCash),
          points: u.points + refundPoints,
          frozenPoints: Math.max(0, (u.frozenPoints || 0) - refundPoints)
        }));
        showToast(`已删除任务【${target.title}】，预付托管资金已全额退回可用账户`);
      } else {
        showToast(`已成功删除任务【${target.title}】`);
      }
      return prev.filter(t => t.id !== taskId);
    });
  };

  const takeTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        if (t.status === '已结束' || t.status === '已验收') {
          showToast('该任务已结束，无法继续接单');
          return t;
        }
        if (t.status !== '进行中' && t.status !== '已发布') {
          showToast('该任务当前不可接单');
          return t;
        }
        // 抢单任务规则：只能有1个人接单，先到先得
        if (t.taskType === '抢单' && (t.acceptedCount || 0) >= 1) {
          showToast('⚡ 该抢单任务已被其他人接单，抢单任务只能由一人承接');
          return t;
        }
        // 比稿任务上限人数校验
        if (t.taskType === '比稿' && t.maxTakersLimit && (t.acceptedCount || 0) >= t.maxTakersLimit) {
          showToast(`🎨 该比稿任务已达到最高接单人数限制 (${t.maxTakersLimit}人)`);
          return t;
        }
        // 检查是否已接单
        const existing = (t.takers || []).find(tk => tk.username === user.name || tk.username.includes('你'));
        if (existing) {
          showToast('您已经接单该任务，请在“我承接的任务”中提交交付成果');
          return t;
        }
        const newTaker = {
          id: `tk_${Date.now()}`,
          taskId,
          username: `${user.name} (你)`,
          userAvatar: user.avatar,
          takeTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          status: '已接单' as const
        };
        const updatedStatus = t.status === '已发布' ? '进行中' : t.status;
        showToast(`成功接单【${t.title}】（${t.taskType === '抢单' ? '⚡ 抢单任务' : '🎨 比稿任务'}）！`);
        return {
          ...t,
          status: updatedStatus,
          acceptedCount: (t.acceptedCount || 0) + 1,
          takers: [newTaker, ...(t.takers || [])]
        };
      }
      return t;
    }));
  };

  const submitTaskResult = (taskId: string, notes: string, files: { name: string; size: string }[]) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (targetTask && (targetTask.status === '已结束' || targetTask.status === '已验收')) {
      showToast('该任务发布者已验收结束，无法继续提交成果');
      return;
    }

    const subId = `sub_${Date.now()}`;
    const newSubmission = {
      id: subId,
      taskId,
      username: `${user.name} (你)`,
      userAvatar: user.avatar,
      submitTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      notes,
      files: files.map((f, i) => ({ id: `f_${Date.now()}_${i}`, name: f.name, size: f.size })),
      status: '待验收' as const
    };

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedTakers = (t.takers || []).map(tk => {
          if (tk.username === user.name || tk.username.includes('你') || tk.username.includes(user.name)) {
            return { ...tk, status: '已提交' as const, submissionId: subId, submission: newSubmission };
          }
          return tk;
        });

        // 如果之前没有 taker 记录，自动补上
        const hasTaker = updatedTakers.some(tk => tk.username.includes(user.name) || tk.username.includes('你'));
        const finalTakers = hasTaker ? updatedTakers : [
          {
            id: `tk_${Date.now()}`,
            taskId,
            username: `${user.name} (你)`,
            userAvatar: user.avatar,
            takeTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
            status: '已提交' as const,
            submissionId: subId,
            submission: newSubmission
          },
          ...updatedTakers
        ];

        return {
          ...t,
          submittedCount: (t.submittedCount || 0) + 1,
          submissions: [newSubmission, ...(t.submissions || [])],
          takers: finalTakers
        };
      }
      return t;
    }));

    showToast('交付成果已提交，请耐心等待雇主验收！');
  };

  const verifyTaskSubmission = (taskId: string, submissionId: string, approved: boolean, rejectReason?: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        let subTargetUser = '';
        let subTargetAvatar = '';
        let subNotes = '';

        // 更新提交记录
        const updatedSubs = (t.submissions || []).map(s => {
          if (s.id === submissionId) {
            subTargetUser = s.username;
            subTargetAvatar = s.userAvatar;
            subNotes = s.notes;
            return {
              ...s,
              status: approved ? ('已通过' as const) : ('已驳回' as const),
              rejectReason: approved ? undefined : (rejectReason || '未被选为验收通过方案。'),
              verifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
            };
          } else if (approved) {
            // 比稿任务中，一旦某个成果被“选为通过”，其他未被选中的成果自动标注为“未通过” / “已驳回”
            return {
              ...s,
              status: '已驳回' as const,
              rejectReason: '未被选为最佳比稿通过方案。'
            };
          }
          return s;
        });

        // 更新接单人记录
        const updatedTakers = (t.takers || []).map(tk => {
          if (tk.submissionId === submissionId || tk.username === subTargetUser) {
            return {
              ...tk,
              status: approved ? ('已验收' as const) : ('已驳回' as const)
            };
          } else if (approved) {
            return {
              ...tk,
              status: '已驳回' as const
            };
          }
          return tk;
        });

        // 资金结算逻辑：
        if (approved) {
          // 1. 如果发布者是当前用户，扣除发布者冻结资金/积分
          if (t.publisher === user.name) {
            const cashAmount = t.cashReward || 0;
            const pointsAmount = t.pointsReward || 0;
            setUser(u => ({
              ...u,
              frozenBalance: Math.max(0, (u.frozenBalance || 0) - cashAmount),
              frozenPoints: Math.max(0, (u.frozenPoints || 0) - pointsAmount)
            }));
          }

          // 2. 如果获胜接单者是当前用户，发放赏金与积分
          if (subTargetUser.includes(user.name) || subTargetUser.includes('你')) {
            const earnedCash = t.cashReward || 0;
            const earnedPoints = t.pointsReward || 0;
            setUser(u => ({
              ...u,
              balance: u.balance + earnedCash,
              points: u.points + earnedPoints,
              todayEarnedPoints: u.todayEarnedPoints + earnedPoints
            }));
            showToast(`🎉 恭喜！您的比稿/抢单作品已被选为【验收通过】，赏金 ¥${earnedCash.toLocaleString()} 及 ${earnedPoints} 积分已到账！`);
          } else if (t.publisher === user.name) {
            showToast(`已成功将【${subTargetUser}】的成果【选为通过】！赏金结算完毕，任务已顺利结束。`);
          }
        } else {
          // 拒绝/未通过逻辑
          if (t.taskType === '抢单') {
            // 抢单任务拒绝后，退还预付资金给发布者，任务结束
            if (t.publisher === user.name) {
              const refundCash = t.cashReward || 0;
              const refundPoints = t.pointsReward || 0;
              setUser(u => ({
                ...u,
                balance: u.balance + refundCash,
                points: u.points + refundPoints,
                frozenBalance: Math.max(0, (u.frozenBalance || 0) - refundCash),
                frozenPoints: Math.max(0, (u.frozenPoints || 0) - refundPoints)
              }));
              showToast(`已拒绝抢单成果。预付保证金 ¥${refundCash.toLocaleString()} 已解冻退还，任务已结束。`);
            }
          } else {
            showToast(`已驳回【${subTargetUser}】提交的成果。`);
          }
        }

        // 抢单任务拒绝后任务也直接结束；比稿任务选为通过后任务结束
        const isTaskFinished = approved || t.taskType === '抢单';

        return {
          ...t,
          verifiedCount: approved ? 1 : (t.verifiedCount || 0),
          status: isTaskFinished ? ('已结束' as const) : t.status,
          winner: approved ? {
            username: subTargetUser,
            userAvatar: subTargetAvatar,
            passTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
            notes: subNotes
          } : t.winner,
          submissions: updatedSubs,
          takers: updatedTakers
        };
      }
      return t;
    }));
  };

  const updateTask = (updatedTask: TaskItem) => {
    setTasks(prev => {
      const existing = prev.find(t => t.id === updatedTask.id);
      if (existing && existing.status === '已驳回') {
        const cashReq = updatedTask.cashReward || updatedTask.totalCashReward || 0;
        const pointsReq = updatedTask.pointsReward || updatedTask.totalPointsReward || 0;
        setUser(u => ({
          ...u,
          balance: Math.max(0, u.balance - cashReq),
          frozenBalance: (u.frozenBalance || 0) + cashReq,
          points: Math.max(0, u.points - pointsReq),
          frozenPoints: (u.frozenPoints || 0) + pointsReq
        }));
      }

      return prev.map(t => {
        if (t.id === updatedTask.id) {
          return {
            ...updatedTask,
            status: '审核中' as const,
            rejectReason: undefined,
            auditTime: undefined,
            publishTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
          };
        }
        return t;
      });
    });
    showToast(`任务【${updatedTask.title}】已修改并重新提交审核！`);
  };

  const submitTaskBid = (taskId: string, proposal: string, quoteAmount: number, estimatedDays: number, attachments?: string[]) => {
    showToast('投标方案已递交！');
  };

  const submitTaskDeliverable = (taskId: string, fileName: string, fileSize: string, summary: string, demoUrl?: string) => {
    submitTaskResult(taskId, summary, [{ name: fileName, size: fileSize }]);
  };

  const acceptTaskSubmission = (taskId: string, submissionId: string, comment?: string) => {
    verifyTaskSubmission(taskId, submissionId, true, comment);
  };

  const rejectTaskSubmission = (taskId: string, submissionId: string, comment: string) => {
    verifyTaskSubmission(taskId, submissionId, false, comment);
  };

  const launchGpuInstance = (scene: GPUInstance['scene'], gpuModel: string, imageName: string, customOpts?: Partial<GPUInstance>) => {
    let hourlyCost = 2.5;
    if (gpuModel.includes('4090') || gpuModel.includes('3090')) hourlyCost = 2.90;
    if (gpuModel.includes('V100') || gpuModel.includes('A10')) hourlyCost = 8.0;
    if (gpuModel.includes('A100')) hourlyCost = 25.0;

    const instanceType = customOpts?.instanceType || 'container';
    const gpuCount = customOpts?.gpuCount || 1;
    const region = customOpts?.region || '华北 · 北京';
    const billingType = customOpts?.billingType || '按量计费';

    const newInst: GPUInstance = {
      id: `inst_${instanceType === 'server' ? 's' : 'c'}_${Date.now().toString().slice(-4)}`,
      name: customOpts?.name || `${scene.toLowerCase()}-${gpuModel.split(' ')[0].toLowerCase()}-node`,
      instanceType,
      scene,
      gpuModel,
      gpuCount,
      vram: gpuModel.includes('A100') ? `${80 * gpuCount} GB` : gpuModel.includes('24GB') || gpuModel.includes('4090') || gpuModel.includes('3090') ? `${24 * gpuCount} GB` : '16 GB',
      cpu: customOpts?.cpu || '16 核',
      ram: customOpts?.ram || '64 GB',
      region,
      billingType,
      status: 'running',
      systemDisk: customOpts?.systemDisk || (instanceType === 'server' ? '100GB NVMe' : '50GB NVMe'),
      dataDisk: customOpts?.dataDisk || '200GB NVMe',
      publicIp: customOpts?.publicIp || `120.24.${Math.floor(Math.random()*200+10)}.${Math.floor(Math.random()*200+10)}`,
      osName: customOpts?.osName || 'Ubuntu 22.04 LTS (Docker 26.1)',
      ipAddress: `10.240.18.${Math.floor(Math.random() * 90 + 10)}:8888`,
      runningHours: 0.1,
      hourlyCost: hourlyCost * gpuCount,
      totalCost: (hourlyCost * gpuCount) * 0.1,
      createdAt: '刚刚',
      jupyterUrl: instanceType === 'container' ? `https://jupyter.qianji.ai/?token=qj_${Date.now()}` : undefined,
      vncUrl: instanceType === 'server' ? `https://vnc.qianji.ai/?node=${Date.now()}` : undefined,
      vscodeUrl: `https://vscode.qianji.ai/?instance=${Date.now()}`,
      sshCommand: `ssh -p ${Math.floor(Math.random() * 500 + 22000)} root@gpu-cluster.qianji.ai`,
      imageName,
      monitoring: {
        gpuUsage: [15, 30, 45, 60, 80, 85, 90, 88],
        vramUsage: [20, 35, 50, 65, 75, 82, 85, 84],
        cpuUsage: [10, 20, 35, 40, 50, 55, 52, 54],
        ramUsage: [25, 30, 35, 40, 45, 48, 50, 49]
      },
      fileList: [
        { name: 'workspace/', size: '128 MB', isDir: true, modified: '刚刚' },
        { name: 'README.md', size: '2.4 KB', isDir: false, modified: '刚刚' }
      ],
      logs: [
        { id: `lg_${Date.now()}`, action: '系统成功调度并分配算力卡资源', time: '刚刚', status: '成功' }
      ]
    };
    setGpuInstances(prev => [newInst, ...prev]);
    showToast(` ${instanceType === 'server' ? '云服务器' : '容器'}实例【${newInst.name}】成功发布并秒级拉起！`);
  };

  const toggleGpuInstanceStatus = (id: string) => {
    setGpuInstances(prev => prev.map(inst => {
      if (inst.id === id) {
        const nextStatus = inst.status === 'running' ? 'stopped' : 'running';
        showToast(`算力实例 ${inst.name} 已${nextStatus === 'running' ? '启动' : '停止'}`);
        return { ...inst, status: nextStatus };
      }
      return inst;
    }));
  };

  const restartGpuInstance = (id: string) => {
    setGpuInstances(prev => prev.map(inst => {
      if (inst.id === id) {
        showToast(`算力实例 ${inst.name} 已重新启动`);
        return { ...inst, status: 'running' };
      }
      return inst;
    }));
  };

  const deleteGpuInstance = (id: string) => {
    setGpuInstances(prev => prev.filter(inst => inst.id !== id));
    showToast('已成功释放销毁算力实例');
  };

  const createPost = (content: string, board: FeedPost['board'], images?: string[], title?: string, tags?: string[]) => {
    const newPost: FeedPost = {
      id: `pst_${Date.now()}`,
      title,
      author: user.name,
      authorAvatar: user.avatar,
      authorTag: user.identityTag,
      content,
      images,
      board,
      tags,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      viewsCount: 1,
      time: '刚刚',
      isLiked: false
    };
    setPosts(prev => [newPost, ...prev]);
    showToast('社区动态发表成功！');
  };

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1
        };
      }
      return p;
    }));
  };

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab: handleSetActiveTab,
      setSelectedMainTab: handleSetActiveTab,
      tabResetKey,
      marketplaceTab,
      setMarketplaceTab,
      workspaceSubTab,
      setWorkspaceSubTab,
      isAdminMode,
      setIsAdminMode,
      activeAdminMenu,
      setActiveAdminMenu,
      enterAdminMode,
      exitAdminMode,
      searchOpen,
      setSearchOpen,
      searchQuery,
      setSearchQuery,
      user,
      setUser,
      checkInToday,
      hasCheckedInToday,
      pointRecords,
      onboardingTasks,
      completeOnboardingTask,
      notifications,
      unreadCount,
      markAllNotificationsRead,
      markNotificationAsRead,
      agents,
      userAgents,
      models,
      datasets,
      skills,
      favorites,
      toggleFavoriteAgent,
      tasks,
      courses,
      gpuInstances,
      posts,
      apiKeys,
      createApiKey,
      revokeApiKey,
      openModal,
      sandboxAgent: sandboxAgentState,
      setSandboxAgent,
      detailModalAgent,
      setDetailModalAgent,
      subscribeModalAgent,
      setSubscribeModalAgent,
      quotaModalAgent,
      setQuotaModalAgent,
      trialCountLeft,
      setTrialCountLeft,
      subscriptions,
      setSubscriptions,
      payPerTokenAgents,
      setPayPerTokenAgents,
      openAgentDetail,
      openAgentSubscribe,
      tryoutModel,
      setTryoutModel,
      detailModel,
      setDetailModel,
      openModelDetail,
      selectedCompareModels,
      toggleCompareModel,
      clearCompareModels,
      competitions,
      selectedCompetitionId,
      setSelectedCompetitionId,
      openCompetitionDetail,
      createAgentModalOpen,
      setCreateAgentModalOpen,
      publishTaskModalOpen,
      setPublishTaskModalOpen,
      createComputeModalOpen,
      setCreateComputeModalOpen,
      createComputePreset,
      setCreateComputePreset,
      detailInstance,
      setDetailInstance,
      historyModalOpen,
      setHistoryModalOpen,
      selectedTaskIdForDetail,
      setSelectedTaskIdForDetail,
      selectedTaskForVerification,
      setSelectedTaskForVerification,
      addAgent,
      purchaseAgent,
      addTask,
      auditTask,
      withdrawTask,
      deleteTask,
      takeTask,
      submitTaskResult,
      verifyTaskSubmission,
      updateTask,
      submitTaskBid,
      submitTaskDeliverable,
      acceptTaskSubmission,
      rejectTaskSubmission,
      launchGpuInstance,
      toggleGpuInstanceStatus,
      restartGpuInstance,
      deleteGpuInstance,
      createPost,
      likePost,
      toast,
      showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
