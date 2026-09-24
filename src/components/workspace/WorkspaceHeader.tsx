import React, { useState } from 'react';
import { 
  LayoutDashboard,
  Cpu,
  Activity,
  Layers,
  FileText
} from 'lucide-react';
import { GoogleDriveExportModal } from '../modals/GoogleDriveExportModal';

export const WorkspaceHeader: React.FC = () => {
  const [driveExportOpen, setDriveExportOpen] = useState(false);

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

      {/* Right Action: Design Specification in Google Drive */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setDriveExportOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 text-xs font-bold transition cursor-pointer shadow-2xs hover:shadow-xs"
          title="生成系统全功能设计文档并保存至 Google Drive"
        >
          <FileText className="w-4 h-4 text-indigo-600" />
          <span>系统设计文档 (Google Drive)</span>
        </button>
      </div>

      {/* Google Drive Export Modal */}
      <GoogleDriveExportModal
        isOpen={driveExportOpen}
        onClose={() => setDriveExportOpen(false)}
      />

    </div>
  );
};

