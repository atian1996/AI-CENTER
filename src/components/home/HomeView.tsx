import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  mockBannerItems, 
  mockLeaderboards, 
  mockSystemAnnouncements 
} from '../../data/mockData';
import { 
  Bot, 
  Briefcase, 
  Cpu, 
  Calendar, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Megaphone, 
  Trophy, 
  TrendingUp, 
  Award,
  Zap,
  Activity,
  UserCheck
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { 
    setActiveTab, 
    setWorkspaceSubTab, 
    checkInToday, 
    hasCheckedInToday, 
    onboardingTasks, 
    completeOnboardingTask,
    setCreateAgentModalOpen,
    setPublishTaskModalOpen,
    setCreateComputeModalOpen,
    posts,
    setSandboxAgent,
    agents
  } = useApp();

  const [currentBanner, setCurrentBanner] = useState(0);
  const [leaderboardTab, setLeaderboardTab] = useState<'week' | 'month'>('week');
  const [showOnboarding, setShowOnboarding] = useState(true);

  const banner = mockBannerItems[currentBanner];

  const onboardingCompletedCount = onboardingTasks.filter(t => t.completed).length;

  return (
    <div className="w-full space-y-8 animate-fade-in pb-12 select-none">
      
      {/* 1. Carousel Banner */}
      <div className="relative w-full rounded-3xl p-8 lg:p-10 bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white border border-indigo-200/40 shadow-xl overflow-hidden flex flex-col justify-between min-h-[220px] transition-all duration-500">
        {/* Background Decorative Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-20 w-80 h-80 bg-indigo-500/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> {banner.badge}
          </span>
          <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug">
            {banner.title}
          </h1>
          <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed font-normal">
            {banner.subtitle}
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-6">
          <button
            onClick={() => setActiveTab(banner.targetTab)}
            className="px-6 py-2.5 rounded-xl bg-white text-indigo-950 hover:bg-indigo-50 font-extrabold text-xs transition shadow-md flex items-center gap-2 group cursor-pointer"
          >
            <span>{banner.buttonText}</span>
            <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Banner Dots */}
          <div className="flex items-center gap-2">
            {mockBannerItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBanner(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentBanner ? 'w-8 bg-cyan-400' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 2. Quick Access Shortcuts (4 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <button
          onClick={() => {
            setActiveTab('workspace');
            setWorkspaceSubTab('assets');
            setCreateAgentModalOpen(true);
          }}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/10 hover:scale-[1.02] transition shadow-xs flex items-center gap-4 group text-left cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600">
              【创建 Agent】
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              提示词 / 工具库自定
            </div>
          </div>
        </button>

        <button
          onClick={() => setPublishTaskModalOpen(true)}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10 hover:scale-[1.02] transition shadow-xs flex items-center gap-4 group text-left cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-amber-600">
              【发布任务】
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              悬赏 / 招标需求撮合
            </div>
          </div>
        </button>

        <button
          onClick={() => setCreateComputeModalOpen(true)}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/10 hover:scale-[1.02] transition shadow-xs flex items-center gap-4 group text-left cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-cyan-600">
              【启动算力】
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Jupyter / ComfyUI 拉起
            </div>
          </div>
        </button>

        <button
          onClick={checkInToday}
          className={`p-5 rounded-2xl bg-white border ${
            hasCheckedInToday ? 'border-emerald-300' : 'border-slate-200/80 hover:border-emerald-400'
          } hover:shadow-xl hover:shadow-emerald-500/10 hover:scale-[1.02] transition shadow-xs flex items-center gap-4 group text-left cursor-pointer`}
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-600">
              【每日签到】
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {hasCheckedInToday ? '今日已签到 (+50积分)' : '点击领取 +50 积分'}
            </div>
          </div>
        </button>

      </div>

      {/* 3. Main Body Split: Left Feed & Announcements, Right Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Dynamic Feed (动态信息流) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                <Activity className="w-5 h-5 text-indigo-600" />
                全站动态信息流
              </div>
              <button 
                onClick={() => setActiveTab('community')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
              >
                进入社区动态 <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-3 hover:border-indigo-200 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={post.authorAvatar} alt={post.author} className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-100" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{post.author}</div>
                        <div className="text-[10px] text-slate-400">{post.time} · {post.authorTag}</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {post.board}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {post.content}
                  </p>
                </div>
              ))}

              {/* Follow Activity Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50/60 via-slate-50 to-cyan-50/60 border border-indigo-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    医
                  </span>
                  <div>
                    <span className="font-bold text-slate-900">华西数字医疗课题组</span>
                    <span className="text-slate-600"> 发布了新 Agent【三甲医院全科医疗预诊助手】</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const target = agents.find(a => a.id === 'ag_04');
                    if (target) setSandboxAgent(target);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition"
                >
                  去试用
                </button>
              </div>
            </div>
          </div>

          {/* System Announcements (系统公告) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              <Megaphone className="w-5 h-5 text-amber-500" />
              平台升级与系统公告
            </div>
            <div className="space-y-2 text-xs">
              {mockSystemAnnouncements.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 transition cursor-pointer border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-700 font-medium truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </div>
                  <span className="text-slate-400 text-[10px] font-mono shrink-0 ml-3">{item.date}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Leaderboards (热门榜单) */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                <Trophy className="w-5 h-5 text-amber-500" />
                热门英雄榜
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setLeaderboardTab('week')}
                  className={`px-2.5 py-1 rounded-md transition ${leaderboardTab === 'week' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  周榜
                </button>
                <button
                  onClick={() => setLeaderboardTab('month')}
                  className={`px-2.5 py-1 rounded-md transition ${leaderboardTab === 'month' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  月榜
                </button>
              </div>
            </div>

            {/* Sub-list 1: 最火 Agent */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-indigo-600 flex items-center gap-1.5 uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-amber-500" /> 最火 Agent 榜
              </div>
              <div className="space-y-2">
                {mockLeaderboards.topAgents.map((ag, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 transition border border-slate-100">
                    <div className="flex items-center gap-2.5 truncate">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                        idx === 0 ? 'bg-amber-400 text-amber-950' : idx === 1 ? 'bg-slate-300 text-slate-800' : idx === 2 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {ag.rank}
                      </span>
                      <span className="text-slate-800 font-bold truncate">{ag.name}</span>
                    </div>
                    <span className="text-[10px] text-indigo-600 font-mono font-bold shrink-0 ml-2">{ag.usage}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-list 2: 最活跃开发者 */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-cyan-700 flex items-center gap-1.5 uppercase tracking-wider">
                <UserCheck className="w-3.5 h-3.5 text-cyan-600" /> 最活跃开发者
              </div>
              <div className="space-y-2">
                {mockLeaderboards.topDevelopers.map((dev, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 hover:bg-cyan-50/50 transition border border-slate-100">
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-slate-400 font-mono font-bold text-[10px]">{dev.rank}.</span>
                      <span className="text-slate-800 font-bold truncate">{dev.name}</span>
                    </div>
                    <span className="text-[10px] text-cyan-700 font-mono font-bold shrink-0">{dev.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-list 3: 积分富豪榜 */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-emerald-600" /> 积分富豪榜
              </div>
              <div className="space-y-2">
                {mockLeaderboards.richPoints.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/50 transition border border-slate-100">
                    <span className="text-slate-800 font-bold">{p.name}</span>
                    <span className="text-[10px] text-emerald-700 font-mono font-bold">{p.points}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 4. Bottom New User Onboarding Tasks */}
      {showOnboarding && (
        <div className="p-6 rounded-2xl bg-white border border-indigo-200/80 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                  新手开发者启动引导任务
                  <span className="text-xs text-indigo-600 font-bold">({onboardingCompletedCount}/{onboardingTasks.length})</span>
                </div>
                <div className="text-xs text-slate-500">
                  完成所有新手引导任务即可领取启动积分大礼包 (+300 积分)
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowOnboarding(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              隐藏引导
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {onboardingTasks.map(t => (
              <div 
                key={t.id}
                onClick={() => completeOnboardingTask(t.id)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition flex flex-col justify-between space-y-2 ${
                  t.completed 
                    ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900' 
                    : 'bg-slate-50 border-slate-200/80 hover:border-indigo-300 hover:bg-white text-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="font-bold">{t.title}</div>
                  {t.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </div>
                <div className="text-[10px] text-slate-500">{t.description}</div>
                <div className="text-[10px] font-mono font-bold text-amber-600 pt-1">
                  +{t.pointsReward} 积分
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
