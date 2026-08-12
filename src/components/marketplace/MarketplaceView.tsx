import React from 'react';
import { useApp } from '../../context/AppContext';
import { MarketplaceSubTab } from '../../types';
import { AgentStore } from './AgentStore';
import { ModelSquare } from './ModelSquare';
import { DatasetSquare } from './DatasetSquare';
import { SkillMarket } from './SkillMarket';
import { Bot, Cpu, Database, Zap, Store } from 'lucide-react';

export const MarketplaceView: React.FC = () => {
  const { marketplaceTab, setMarketplaceTab } = useApp();

  const tabs: { id: MarketplaceSubTab; label: string; icon: React.ReactNode }[] = [
    { id: 'agent', label: 'Agent 商店', icon: <Bot className="w-4 h-4" /> },
    { id: 'model', label: '模型广场', icon: <Cpu className="w-4 h-4" /> },
    { id: 'dataset', label: '数据集广场', icon: <Database className="w-4 h-4" /> },
    { id: 'skill', label: 'Skill 插件市场', icon: <Zap className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12 select-none">
      
      {/* Top Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Store className="w-6 h-6 text-indigo-600" />
            AI 资产统一发现与交易集市
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            一站式检索 Agent 智能体、大模型底座、高质数据集与开放 Skill 插件
          </p>
        </div>

        {/* Sub Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
          {tabs.map(t => {
            const isActive = marketplaceTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setMarketplaceTab(t.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Selected Tab */}
      {marketplaceTab === 'agent' && <AgentStore />}
      {marketplaceTab === 'model' && <ModelSquare />}
      {marketplaceTab === 'dataset' && <DatasetSquare />}
      {marketplaceTab === 'skill' && <SkillMarket />}

    </div>
  );
};
