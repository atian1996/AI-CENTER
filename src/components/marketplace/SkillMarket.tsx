import React from 'react';
import { useApp } from '../../context/AppContext';
import { mockSkills } from '../../data/mockData';
import { Zap, Download, CheckCircle, Upload, Shield } from 'lucide-react';

export const SkillMarket: React.FC = () => {
  const { setActiveTab, setWorkspaceSubTab, showToast } = useApp();

  return (
    <div className="space-y-6 select-none">
      
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="text-xs text-slate-600">
          <span className="font-bold text-slate-900">Skill 插件市场:</span> 为 Agent 赋予联网搜索、代码沙箱执行、金融行情比对与自动化能力。
        </div>

        <button
          onClick={() => {
            setActiveTab('workspace');
            setWorkspaceSubTab('assets');
            showToast('已跳转工作台 - 我的 Skill 插件上传通道');
          }}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>上传 Skill (ZIP/Git) →</span>
        </button>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockSkills.map(sk => (
          <div key={sk.id} className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-300 shadow-xs hover:shadow-xl hover:shadow-purple-500/10 space-y-4 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono font-bold">v{sk.version}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{sk.name}</h3>
                <div className="text-[11px] text-slate-400 font-medium mt-0.5">开发者: {sk.developer}</div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {sk.description}
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-[11px] text-slate-500 font-medium">
                <div>适配 Agent: {sk.compatibleAgents}</div>
                <div>权限依赖: {sk.requiredPermissions.join(', ')}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">{sk.installs.toLocaleString()} 次安装</span>
              <button
                onClick={() => showToast(`已成功安装 Skill 插件【${sk.name}】！可在创建 Agent 时引用`)}
                className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-1 transition shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> 一键安装
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
