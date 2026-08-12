import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, Bot, Cpu, Database, Briefcase, GraduationCap, MessageSquare, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { 
    searchOpen, 
    setSearchOpen, 
    searchQuery, 
    setSearchQuery, 
    agents, 
    models, 
    datasets, 
    tasks, 
    courses, 
    posts,
    setActiveTab,
    setMarketplaceTab,
    setSandboxAgent,
    setTryoutModel
  } = useApp();

  if (!searchOpen) return null;

  const query = searchQuery.trim().toLowerCase();

  const matchedAgents = query ? agents.filter(a => a.name.toLowerCase().includes(query) || a.description.toLowerCase().includes(query)) : agents.slice(0, 3);
  const matchedModels = query ? models.filter(m => m.name.toLowerCase().includes(query) || m.vendor.toLowerCase().includes(query)) : models.slice(0, 3);
  const matchedDatasets = query ? datasets.filter(d => d.name.toLowerCase().includes(query) || d.industry.toLowerCase().includes(query)) : datasets.slice(0, 2);
  const matchedTasks = query ? tasks.filter(t => t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query)) : tasks.slice(0, 2);
  const matchedCourses = query ? courses.filter(c => c.title.toLowerCase().includes(query)) : courses.slice(0, 2);
  const matchedPosts = query ? posts.filter(p => p.content.toLowerCase().includes(query) || p.author.toLowerCase().includes(query)) : posts.slice(0, 2);

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-800/80 flex items-center gap-3 bg-slate-900/50">
          <Search className="w-5 h-5 text-indigo-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索全站 Agent / 模型 / 数据集 / 任务 / 课程 / 社区帖子 / 开发者..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-base outline-none"
            autoFocus
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 border border-slate-700/60 rounded-lg"
          >
            ESC 退出
          </button>
        </div>

        {/* Results Container */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300">
          {!query && (
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              全站热门检索推荐
            </div>
          )}

          {/* Agents */}
          {matchedAgents.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">
                <Bot className="w-4 h-4" /> Agent 智能体 ({matchedAgents.length})
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {matchedAgents.map(ag => (
                  <div 
                    key={ag.id}
                    onClick={() => {
                      setSearchOpen(false);
                      setSandboxAgent(ag);
                    }}
                    className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/40 hover:border-indigo-500/50 cursor-pointer transition flex items-start gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-xl shrink-0">
                      {ag.avatar}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <div className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 truncate">
                        {ag.name}
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {ag.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Models */}
          {matchedModels.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">
                <Cpu className="w-4 h-4" /> 大模型广场 ({matchedModels.length})
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {matchedModels.map(m => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSearchOpen(false);
                      setTryoutModel(m);
                    }}
                    className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/40 hover:border-cyan-500/50 cursor-pointer transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300">
                        {m.name}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {m.vendor} · {m.contextLength}
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                      {m.typeTag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {matchedTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                <Briefcase className="w-4 h-4" /> 悬赏与招标任务 ({matchedTasks.length})
              </div>
              <div className="space-y-2">
                {matchedTasks.map(t => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSearchOpen(false);
                      setActiveTab('tasks');
                    }}
                    className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/40 cursor-pointer transition flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-slate-200 hover:text-amber-300 truncate">
                      {t.title}
                    </span>
                    <span className="text-xs font-bold text-amber-400 shrink-0 ml-4">
                      {t.bountyUnit}{t.bounty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Datasets */}
          {matchedDatasets.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
                <Database className="w-4 h-4" /> 开源数据集 ({matchedDatasets.length})
              </div>
              <div className="grid grid-cols-1 gap-2">
                {matchedDatasets.map(d => (
                  <div
                    key={d.id}
                    onClick={() => {
                      setSearchOpen(false);
                      setActiveTab('marketplace');
                      setMarketplaceTab('dataset');
                    }}
                    className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/40 cursor-pointer transition flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-200">{d.name}</div>
                      <div className="text-xs text-slate-400">{d.industry} · {d.scale} · {d.format}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
