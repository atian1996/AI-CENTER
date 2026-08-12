import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { HomeView } from './components/home/HomeView';
import { MarketplaceView } from './components/marketplace/MarketplaceView';
import { TasksView } from './components/tasks/TasksView';
import { LearningView } from './components/learning/LearningView';
import { ComputeView } from './components/compute/ComputeView';
import { CommunityView } from './components/community/CommunityView';
import { WorkspaceView } from './components/workspace/WorkspaceView';

import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { CreateAgentModal } from './components/modals/CreateAgentModal';
import { CreateComputeModal } from './components/modals/CreateComputeModal';
import { InstanceDetailModal } from './components/compute/InstanceDetailModal';
import { ComputeHistoryModal } from './components/compute/ComputeHistoryModal';
import { AgentSandboxModal } from './components/modals/AgentSandboxModal';
import { ModelTryoutModal } from './components/modals/ModelTryoutModal';
import { ModelCompareBar } from './components/modals/ModelCompareBar';
import { Toast } from './components/common/Toast';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen w-full bg-slate-50/90 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white flex flex-col bg-tech-grid relative">
      {/* Subtle Top Ambient Glow Background */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1920px] h-[500px] bg-gradient-to-b from-indigo-100/40 via-cyan-50/30 to-transparent blur-3xl -z-10" />

      {/* Top Header */}
      <Header />

      {/* Main Container tailored for 1920x1080 resolution */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto px-8 py-6 overflow-x-hidden">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'marketplace' && <MarketplaceView />}
        {activeTab === 'tasks' && <TasksView />}
        {activeTab === 'learning' && <LearningView />}
        {activeTab === 'compute' && <ComputeView />}
        {activeTab === 'community' && <CommunityView />}
        {activeTab === 'workspace' && <WorkspaceView />}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white/80 backdrop-blur-md py-6 text-center text-xs text-slate-500">
        <div className="max-w-[1920px] mx-auto px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-medium text-slate-600">
            © 2026 <span className="font-bold text-indigo-600">千机·AI空间</span> (Qianji AI Space) - 全场景一站式 AI 应用 + 社区 + 算力 综合平台
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              集群状态: 100% 正常运行
            </span>
            <span>· 开发者 API</span>
            <span>· 隐私政策</span>
            <span>· 社区规范</span>
          </div>
        </div>
      </footer>

      {/* Global Modals & Overlays */}
      <GlobalSearchModal />
      <CreateAgentModal />
      <CreateComputeModal />
      <InstanceDetailModal />
      <ComputeHistoryModal />
      <AgentSandboxModal />
      <ModelTryoutModal />
      <ModelCompareBar />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
