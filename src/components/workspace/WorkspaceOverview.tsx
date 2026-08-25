import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Coins, 
  CheckSquare, 
  Bot, 
  Cpu, 
  PlusCircle, 
  Zap, 
  CalendarCheck, 
  ArrowUpRight, 
  Clock, 
  FileText, 
  Database, 
  TrendingUp, 
  Activity, 
  ChevronRight,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  Award,
  Layers,
  BarChart3
} from 'lucide-react';

export const WorkspaceOverview: React.FC = () => {
  const { 
    user, 
    userAgents, 
    tasks, 
    gpuInstances, 
    setWorkspaceSubTab, 
    setSelectedMainTab,
    checkInToday, 
    showToast,
    openModal
  } = useApp();

  // Todos count
  const pendingAgentAuditCount = 1;
  const pendingTaskCount = tasks.filter(t => t.status === '已发布' || t.status === '进行中').length;
  const pendingOrderCount = 1;
  const pendingDatasetApplyCount = 1;

  // Recent 5 items mock
  const recentItems = [
    { id: '1', name: '代码重构与安全审计 Agent', type: 'Agent', icon: '⚡', category: '编程辅助', targetTab: 'assets' },
    { id: '2', name: 'my-llama-finetune (A100 80GB)', type: '算力容器', icon: '💻', category: '包月运行中', targetTab: 'compute' },
    { id: '3', name: 'ComfyUI 绘图提示词大师', type: 'Agent', icon: '🎨', category: '文生图', targetTab: 'assets' },
    { id: '4', name: 'A股上市公司财报与年报结构化 Corpus', type: '数据集', icon: '📊', category: '金融 Corpus', targetTab: 'assets' },
    { id: '5', name: 'Google Live Web Search Engine', type: 'Skill', icon: '🌐', category: '实时搜索', targetTab: 'assets' },
  ];

  // Activities
  const activityFeed = [
    { id: '1', text: '您的 Agent【代码重构与安全审计 Agent】今日被调用 1,200 次，收益 +40 积分', time: '10分钟前', icon: '💰' },
    { id: '2', text: '每日签到成功，获得 50 积分奖励！', time: '2小时前', icon: '✅' },
    { id: '3', text: '用户 @张学者 提交了数据集《A股上市公司财报数据》的使用申请', time: '3小时前', icon: '📥' },
    { id: '4', text: '您提交的《医疗QA模型微调》竞标方案已被发布者审阅', time: '5小时前', icon: '🎯' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* 1. User Welcome Area */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-500/30 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black tracking-tight">{user.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  {user.levelBadge}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {user.identityTag}
                </span>
              </div>
              <p className="text-xs text-indigo-200/80 font-medium">
                早上好！今天也是构建强大 AI 应用的好日子。全站算力运行正常，Agent 节点正常响应中。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setWorkspaceSubTab('points')}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>今日已赚 +{user.todayEarnedPoints} PTS</span>
            </button>
            <button
              onClick={() => setWorkspaceSubTab('settings')}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition shadow-md cursor-pointer"
            >
              修改资料 & 偏好
            </button>
          </div>
        </div>
      </div>

      {/* 2. 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: 积分余额 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold text-slate-600">积分余额</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight mb-4">
            {user.points.toLocaleString()} <span className="text-xs text-slate-400 font-normal">PTS</span>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setWorkspaceSubTab('points')}
              className="flex-1 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-extrabold transition text-center cursor-pointer"
            >
              赚积分
            </button>
            <button
              onClick={() => setWorkspaceSubTab('points')}
              className="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition text-center cursor-pointer"
            >
              去兑换
            </button>
          </div>
        </div>

        {/* Card 2: 本月任务完成 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold text-slate-600">本月任务完成</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight mb-4">
            12 <span className="text-xs text-emerald-600 font-bold ml-1">↑ 同比+33%</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-medium">累计悬赏获益</span>
            <span className="font-extrabold text-slate-800">¥12,400</span>
          </div>
        </div>

        {/* Card 3: 我的Agent数 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold text-slate-600">我的 Agent 数</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight mb-4 flex items-center justify-between">
            <span>{userAgents.length} <span className="text-xs text-slate-400 font-normal">个</span></span>
            <button
              onClick={() => openModal('createAgent')}
              className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>新建</span>
            </button>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-medium">总调用量</span>
            <span className="font-extrabold text-slate-800">45,200 次</span>
          </div>
        </div>

        {/* Card 4: 本月算力消耗 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold text-slate-600">本月算力消耗</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight mb-4">
            12.5 <span className="text-xs text-slate-400 font-normal">小时</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-medium">折算费用</span>
            <span className="font-extrabold text-emerald-600">¥89.00</span>
          </div>
        </div>

      </div>

      {/* 3. 待办事项 TodoList */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-indigo-600" />
            <span>待办事项</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-700">
              {pendingAgentAuditCount + pendingTaskCount + pendingOrderCount + pendingDatasetApplyCount} 项待处理
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          
          <button
            onClick={() => setWorkspaceSubTab('assets')}
            className="p-4 rounded-2xl bg-amber-50/60 hover:bg-amber-50 border border-amber-200/60 text-left transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-extrabold text-amber-900">待审核 Agent</span>
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-extrabold text-[10px] flex items-center justify-center">
                {pendingAgentAuditCount}
              </span>
            </div>
            <p className="text-[11px] text-amber-800/80 font-medium truncate">《多模态法律文书Agent》审核中</p>
          </button>

          <button
            onClick={() => setWorkspaceSubTab('my-tasks')}
            className="p-4 rounded-2xl bg-indigo-50/60 hover:bg-indigo-50 border border-indigo-200/60 text-left transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-extrabold text-indigo-900">待处理任务</span>
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-extrabold text-[10px] flex items-center justify-center">
                {pendingTaskCount}
              </span>
            </div>
            <p className="text-[11px] text-indigo-800/80 font-medium truncate">《医疗QA模型微调》待提交验收</p>
          </button>

          <button
            onClick={() => setWorkspaceSubTab('points')}
            className="p-4 rounded-2xl bg-purple-50/60 hover:bg-purple-50 border border-purple-200/60 text-left transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-extrabold text-purple-900">账户流水 & 消费</span>
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-extrabold text-[10px] flex items-center justify-center">
                {pendingOrderCount}
              </span>
            </div>
            <p className="text-[11px] text-purple-800/80 font-medium truncate">智能客服订阅 · 算力租赁明细</p>
          </button>

          <button
            onClick={() => setWorkspaceSubTab('assets')}
            className="p-4 rounded-2xl bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-200/60 text-left transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-extrabold text-emerald-900">待审批数据集</span>
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] flex items-center justify-center">
                {pendingDatasetApplyCount}
              </span>
            </div>
            <p className="text-[11px] text-emerald-800/80 font-medium truncate">@张学者 申请 《A股财报数据集》</p>
          </button>

        </div>
      </div>

      {/* 4. 快速入口 Row & 5. 最近使用 Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Entrance Row */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>快捷入口</span>
          </h3>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => openModal('createAgent')}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200/80 transition text-left cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-2 font-bold shadow-xs group-hover:scale-105 transition">
                <Bot className="w-4 h-4" />
              </div>
              <div className="text-xs font-extrabold text-slate-800 group-hover:text-indigo-600 transition">创建 Agent</div>
              <div className="text-[10px] text-slate-400 font-medium">配置能力与模型</div>
            </button>

            <button
              onClick={() => openModal('publishTask')}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200/80 transition text-left cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-2 font-bold shadow-xs group-hover:scale-105 transition">
                <FileText className="w-4 h-4" />
              </div>
              <div className="text-xs font-extrabold text-slate-800 group-hover:text-indigo-600 transition">发布悬赏任务</div>
              <div className="text-[10px] text-slate-400 font-medium">招募专家完成需求</div>
            </button>

            <button
              onClick={() => setSelectedMainTab('compute')}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200/80 transition text-left cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2 font-bold shadow-xs group-hover:scale-105 transition">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="text-xs font-extrabold text-slate-800 group-hover:text-indigo-600 transition">启动算力工坊</div>
              <div className="text-[10px] text-slate-400 font-medium">开箱即用 GPU 容器</div>
            </button>

            <button
              onClick={() => {
                checkInToday();
              }}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50 hover:border-amber-200 border border-slate-200/80 transition text-left cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-2 font-bold shadow-xs group-hover:scale-105 transition">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <div className="text-xs font-extrabold text-slate-800 group-hover:text-amber-600 transition">每日签到领奖</div>
              <div className="text-[10px] text-slate-400 font-medium">+50 积分奖励</div>
            </button>
          </div>
        </div>

        {/* Recent Items (最近使用 5个) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>最近使用</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">保留最近 5 项操作</span>
          </div>

          <div className="space-y-2">
            {recentItems.map((item) => (
              <div 
                key={item.id}
                onClick={() => {
                  if (item.targetTab === 'compute') {
                    setSelectedMainTab('compute');
                  } else {
                    setWorkspaceSubTab(item.targetTab as any);
                  }
                }}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-slate-100 transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-bold">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-800 group-hover:text-indigo-600 transition">
                      {item.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium flex items-center gap-2">
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">{item.type}</span>
                      <span>{item.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-slate-400 group-hover:text-indigo-600 text-xs font-bold gap-1 transition">
                  <span>打开</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 6. 用量概览图表 & 7. 动态信息流 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Usage Overview Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>用量概览（近7天）</span>
            </h3>
            <button
              onClick={() => setWorkspaceSubTab('calls')}
              className="text-xs font-extrabold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              <span>明细报告</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bar Chart Representation */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Token 消耗量 (k Tokens)</span>
              <span className="text-indigo-600">本周累计: 184.2k Tokens</span>
            </div>

            <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2 bg-slate-50 rounded-2xl border border-slate-100">
              {[
                { day: '08-05', val: 12, cost: '12k' },
                { day: '08-06', val: 28, cost: '28k' },
                { day: '08-07', val: 45, cost: '45k' },
                { day: '08-08', val: 32, cost: '32k' },
                { day: '08-09', val: 68, cost: '68k' },
                { day: '08-10', val: 54, cost: '54k' },
                { day: '08-11', val: 89, cost: '89k' },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[9px] font-bold text-slate-400 group-hover:text-indigo-600 transition opacity-0 group-hover:opacity-100">
                    {item.cost}
                  </span>
                  <div 
                    style={{ height: `${(item.val / 90) * 100}%` }}
                    className="w-full max-w-[28px] bg-indigo-600 rounded-t-lg group-hover:bg-indigo-500 transition shadow-2xs"
                  />
                  <span className="text-[10px] text-slate-400 font-medium">{item.day}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">GPU 算力运行</div>
                  <div className="text-base font-black text-slate-900">12.5 小时</div>
                </div>
                <Cpu className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">API 平均延迟</div>
                  <div className="text-base font-black text-emerald-600">280 ms</div>
                </div>
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Activity Feed */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-600" />
            <span>动态信息流</span>
          </h3>

          <div className="space-y-3">
            {activityFeed.map((item) => (
              <div key={item.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                    <span>{item.icon}</span>
                    <span>动态通知</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{item.time}</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
