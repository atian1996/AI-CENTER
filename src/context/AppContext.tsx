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
  ApiKeyItem
} from '../types';
import { 
  initialUserProfile, 
  initialOnboardingTasks, 
  initialNotifications, 
  mockAgents, 
  mockModels, 
  mockDatasets, 
  mockSkills,
  mockTasks, 
  mockCourses, 
  mockGpuInstances, 
  mockFeedPosts,
  mockApiKeys,
  mockPointRecords
} from '../data/mockData';

interface AppContextType {
  // Navigation State
  activeTab: MainTabType;
  setActiveTab: (tab: MainTabType) => void;
  setSelectedMainTab: (tab: MainTabType) => void;
  marketplaceTab: MarketplaceSubTab;
  setMarketplaceTab: (tab: MarketplaceSubTab) => void;
  workspaceSubTab: WorkspaceSubTab;
  setWorkspaceSubTab: (sub: WorkspaceSubTab) => void;

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

  // Action Modals
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

  // Interactive Operations
  addAgent: (agent: Omit<AgentItem, 'id' | 'rating' | 'ratingCount' | 'usageCount' | 'createdAt'>) => void;
  purchaseAgent: (agentId: string) => void;
  addTask: (task: Omit<TaskItem, 'id' | 'bidCount' | 'publishTime' | 'status'>) => void;
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
  const [tasks, setTasks] = useState<TaskItem[]>(mockTasks);
  const [courses] = useState<CourseItem[]>(mockCourses);
  const [gpuInstances, setGpuInstances] = useState<GPUInstance[]>(mockGpuInstances);
  const [posts, setPosts] = useState<FeedPost[]>(mockFeedPosts);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(mockApiKeys);

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

  const [createAgentModalOpen, setCreateAgentModalOpen] = useState<boolean>(false);
  const [publishTaskModalOpen, setPublishTaskModalOpen] = useState<boolean>(false);
  const [createComputeModalOpen, setCreateComputeModalOpen] = useState<boolean>(false);
  const [createComputePreset, setCreateComputePreset] = useState<{ mode?: 'container' | 'server'; scene?: GPUInstance['scene']; imageName?: string; card?: RentalGPUCard } | null>(null);
  const [detailInstance, setDetailInstance] = useState<GPUInstance | null>(null);
  const [historyModalOpen, setHistoryModalOpen] = useState<boolean>(false);

  const [toast, setToast] = useState<string | null>(null);

  const setSelectedMainTab = (tab: MainTabType) => setActiveTab(tab);

  const userAgents = agents.filter(a => a.author === user.name || a.id.startsWith('ag_custom') || a.isDeveloped || a.isPurchased);
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

  const addTask = (newTaskData: Omit<TaskItem, 'id' | 'bidCount' | 'publishTime' | 'status'>) => {
    const newTask: TaskItem = {
      ...newTaskData,
      id: `tsk_${Date.now()}`,
      bidCount: 0,
      publishTime: '刚刚',
      status: '招募中'
    };
    setTasks(prev => [newTask, ...prev]);
    showToast(` 任务【${newTask.title}】发布成功！`);
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
      setActiveTab,
      setSelectedMainTab,
      marketplaceTab,
      setMarketplaceTab,
      workspaceSubTab,
      setWorkspaceSubTab,
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
      addAgent,
      purchaseAgent,
      addTask,
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
