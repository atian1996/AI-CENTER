import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard,
  Plus,
  Sparkles,
  Zap
} from 'lucide-react';

export const WorkspaceHeader: React.FC = () => {
  const { 
    setCreateAgentModalOpen, 
    setPublishTaskModalOpen, 
    setCreateComputeModalOpen 
  } = useApp();

  return (
    <div className="bg-white border-b border-slate-200/80 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
      
      {/* Title & Status */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center font-black text-lg shadow-sm shadow-indigo-200">
          <LayoutDashboard className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black text-slate-900 tracking-tight">
              开发者工作台
            </h1>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
              Console v2.5
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              服务运行正常
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            全站 AI 资产控制、任务协同、算力调度与云端数据统一管理平台
          </p>
        </div>
      </div>

      {/* Quick Action Buttons for Workspace */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={() => setCreateAgentModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm transition-all transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>创建新 Agent</span>
        </button>

        <button
          onClick={() => setPublishTaskModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>发布需求任务</span>
        </button>

        <button
          onClick={() => setCreateComputeModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-indigo-600" />
          <span>租用算力</span>
        </button>
      </div>

    </div>
  );
};

