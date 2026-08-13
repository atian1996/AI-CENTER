import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { HomeView } from './components/home/HomeView';
import { MarketplaceView } from './components/marketplace/MarketplaceView';
import { TasksView } from './components/tasks/TasksView';
import { LearningView } from './components/learning/LearningView';
import { ComputeView } from './components/compute/ComputeView';
import { CreativeView } from './components/creative/CreativeView';
import { CommunityView } from './components/community/CommunityView';
import { WorkspaceView } from './components/workspace/WorkspaceView';

import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { CreateAgentModal } from './components/modals/CreateAgentModal';
import { CreateComputeModal } from './components/modals/CreateComputeModal';
import { InstanceDetailModal } from './components/compute/InstanceDetailModal';
import { ComputeHistoryModal } from './components/compute/ComputeHistoryModal';
import { AgentSandboxModal } from './components/modals/AgentSandboxModal';
import { AgentDetailViewModal } from './components/marketplace/AgentDetailViewModal';
import { SubscribeModal } from './components/marketplace/SubscribeModal';
import { QuotaExhaustedModal } from './components/marketplace/QuotaExhaustedModal';
import { ModelTryoutModal } from './components/modals/ModelTryoutModal';
import { ModelDetailModal } from './components/modals/ModelDetailModal';
import { ModelCompareBar } from './components/modals/ModelCompareBar';
import { Toast } from './components/common/Toast';

const AppContent: React.FC = () => {
  const { 
    activeTab, 
    detailModalAgent, 
    setDetailModalAgent, 
    subscribeModalAgent, 
    setSubscribeModalAgent,
    quotaModalAgent,
    setQuotaModalAgent,
    subscriptions,
    setSubscriptions,
    payPerTokenAgents,
    setPayPerTokenAgents,
    trialCountLeft,
    setTrialCountLeft,
    detailModel,
    setDetailModel,
    setTryoutModel,
    showToast
  } = useApp();

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
        {activeTab === 'compute' && <ComputeView />}
        {activeTab === 'learning' && <LearningView />}
        {activeTab === 'creative' && <CreativeView />}
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
      
      {/* Global Agent Modals */}
      {detailModalAgent && (
        <AgentDetailViewModal
          agent={detailModalAgent}
          isOpen={!!detailModalAgent}
          onClose={() => setDetailModalAgent(null)}
          onOpenSubscribeModal={(ag) => setSubscribeModalAgent(ag)}
          onOpenQuotaModal={(ag) => setQuotaModalAgent(ag)}
          userSubscription={subscriptions[detailModalAgent.id]}
          isPayPerTokenMode={!!payPerTokenAgents[detailModalAgent.id]}
          trialCountLeft={trialCountLeft}
          setTrialCountLeft={setTrialCountLeft}
          setPayPerTokenMode={(enabled) => {
            setPayPerTokenAgents(prev => ({ ...prev, [detailModalAgent.id]: enabled }));
          }}
        />
      )}

      {subscribeModalAgent && (
        <SubscribeModal
          agent={subscribeModalAgent}
          isOpen={!!subscribeModalAgent}
          onClose={() => setSubscribeModalAgent(null)}
          currentTrialLeft={trialCountLeft}
          onSuccess={(newSub) => {
            setSubscriptions(prev => ({ ...prev, [newSub.agentId]: newSub }));
          }}
        />
      )}

      {quotaModalAgent && (
        <QuotaExhaustedModal
          agent={quotaModalAgent}
          isOpen={!!quotaModalAgent}
          onClose={() => setQuotaModalAgent(null)}
          onSelectPayPerToken={() => {
            setPayPerTokenAgents(prev => ({ ...prev, [quotaModalAgent.id]: true }));
            showToast('已开启“按 Token 扣费”继续使用模式！');
            const ag = quotaModalAgent;
            setQuotaModalAgent(null);
            setDetailModalAgent(ag);
          }}
          onSelectSubscribe={() => {
            const ag = quotaModalAgent;
            setQuotaModalAgent(null);
            setSubscribeModalAgent(ag);
          }}
        />
      )}

      <AgentSandboxModal />
      <ModelTryoutModal />
      <ModelDetailModal
        model={detailModel}
        isOpen={!!detailModel}
        onClose={() => setDetailModel(null)}
        onOpenTryout={(model) => setTryoutModel(model)}
      />
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
