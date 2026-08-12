import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GPUInstance, ComputeMode, ComputeImageItem } from '../../types';
import { mockComputeImages } from '../../data/mockData';
import { 
  Zap, 
  Cpu, 
  Server, 
  Play, 
  Square, 
  RotateCcw, 
  Trash2, 
  ExternalLink, 
  Search, 
  Filter, 
  Plus, 
  Clock, 
  Coins, 
  History, 
  ChevronRight, 
  Layers, 
  BookOpen, 
  Flame, 
  Palette, 
  Sliders, 
  Terminal, 
  Activity, 
  Copy, 
  Check, 
  Box, 
  Sparkles, 
  HelpCircle, 
  Download 
} from 'lucide-react';

export const ComputeView: React.FC = () => {
  const { 
    gpuInstances, 
    toggleGpuInstanceStatus, 
    restartGpuInstance, 
    deleteGpuInstance, 
    setCreateComputeModalOpen, 
    setCreateComputePreset,
    setDetailInstance, 
    setHistoryModalOpen, 
    user, 
    showToast 
  } = useApp();

  // Mode Tab Switcher: 'container' | 'server'
  const [activeMode, setActiveMode] = useState<ComputeMode>('container');

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'running' | 'stopped'>('all');
  const [archFilter, setArchFilter] = useState<'all' | 'gpu' | 'cpu'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstIds, setSelectedInstIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter instances according to activeMode & filter bar
  const filteredInstances = gpuInstances.filter(inst => {
    if (inst.instanceType !== activeMode) return false;
    if (statusFilter !== 'all' && inst.status !== statusFilter) return false;
    if (archFilter === 'gpu' && inst.isCpuOnly) return false;
    if (archFilter === 'cpu' && !inst.isCpuOnly) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        inst.name.toLowerCase().includes(q) ||
        inst.id.toLowerCase().includes(q) ||
        inst.gpuModel.toLowerCase().includes(q) ||
        inst.imageName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const runningInstances = filteredInstances.filter(i => i.status === 'running');
  const stoppedInstances = filteredInstances.filter(i => i.status === 'stopped');

  // Copy SSH helper
  const copySSH = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    showToast('SSH 链接已复制到剪贴板');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Batch action handlers
  const handleBatchStop = () => {
    if (selectedInstIds.length === 0) {
      showToast('请先选择要操作的实例');
      return;
    }
    selectedInstIds.forEach(id => {
      const inst = gpuInstances.find(i => i.id === id);
      if (inst && inst.status === 'running') toggleGpuInstanceStatus(id);
    });
    setSelectedInstIds([]);
    showToast('已批量停止选中算力实例');
  };

  const handleBatchDelete = () => {
    if (selectedInstIds.length === 0) {
      showToast('请先选择要操作的实例');
      return;
    }
    selectedInstIds.forEach(id => deleteGpuInstance(id));
    setSelectedInstIds([]);
    showToast('已批量释放销毁选中算力实例');
  };

  const toggleSelectInst = (id: string) => {
    if (selectedInstIds.includes(id)) {
      setSelectedInstIds(prev => prev.filter(i => i !== id));
    } else {
      setSelectedInstIds(prev => [...prev, id]);
    }
  };

  // Quick scenario card launcher
  const launchScenario = (scene: GPUInstance['scene']) => {
    setCreateComputePreset({ mode: activeMode, scene });
    setCreateComputeModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 pb-12 select-none">
      
      {/* HEADER SECTION */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xl shadow-xs">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>算力工坊 (Compute Workshop)</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  GPU 资源调度中心
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                为开发者提供开箱即用的高性能云端 GPU 容器与服务器，支持秒级调度与环境快照保存
              </p>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setHistoryModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span>历史记录 & 账单明细</span>
          </button>

          <button
            onClick={() => {
              setCreateComputePreset({ mode: activeMode });
              setCreateComputeModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>启动算力实例</span>
          </button>
        </div>
      </div>

      {/* MODE TAB SWITCHER */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2 bg-slate-200/60 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveMode('container')}
            className={`px-5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
              activeMode === 'container' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>容器实例 (轻量 / 低价 / 秒级启动)</span>
          </button>

          <button
            onClick={() => setActiveMode('server')}
            className={`px-5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
              activeMode === 'server' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>云服务器实例 (完整 OS 控制 / 持久化)</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium hidden md:block">
          当前租赁模式: <span className="font-bold text-slate-900">{activeMode === 'container' ? '容器轻量镜像' : '云服务器 Root 根权限'}</span>
        </div>
      </div>

      {/* AREA 1: QUICK CREATE SCENARIO CARDS (区域一：快捷创建 4场景) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Notebook */}
        <div
          onClick={() => launchScenario('Notebook开发')}
          className="p-5 bg-white hover:bg-slate-50/80 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-full font-bold border border-cyan-200">
              数据实验
            </span>
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-600 transition">
              📓 Notebook 开发
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              预装 JupyterLab 与 PyTorch 框架，开箱即用，支持在线交互调试
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
            <span>一键创建 Notebook</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 2: Fine-Tuning */}
        <div
          onClick={() => launchScenario('大模型微调')}
          className="p-5 bg-white hover:bg-slate-50/80 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold border border-amber-200">
              大模型微调
            </span>
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-600 transition">
              🔥 大模型微调 (LLaMA/Qwen)
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              适配 A100 80G 多卡集群，包含 DeepSpeed, LLaMA-Factory 与 LoRA
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
            <span>一键创建微调环境</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 3: Image Gen */}
        <div
          onClick={() => launchScenario('文生图')}
          className="p-5 bg-white hover:bg-slate-50/80 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition">
              <Palette className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold border border-purple-200">
              AIGC 绘画
            </span>
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-600 transition">
              🎨 文生图生成 (ComfyUI)
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              预装 Flux.1, ControlNet 基础模型包与节点拓展，开箱直接渲染
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
            <span>一键创建 ComfyUI</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 4: Custom Config */}
        <div
          onClick={() => launchScenario('自定义')}
          className="p-5 bg-white hover:bg-slate-50/80 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition">
              <Sliders className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
              全自由配置
            </span>
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-600 transition">
              ⚙️ 自定义自由配置
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              自由选择 GPU 型号、显存大小、网络带宽与私有 Docker 镜像
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
            <span>高级自定义创建</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </div>

      </div>

      {/* AREA 2: MY WORKSHOP - INSTANCE LIST (区域二：我的工坊 实例列表) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
        
        {/* Section Header & Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900">
              我的工坊算力实例 ({filteredInstances.length})
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">
              模式: {activeMode === 'container' ? '容器环境' : '云服务器'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索实例名称/ID/镜像..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-600 font-medium"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-700 cursor-pointer"
            >
              <option value="all">全部状态</option>
              <option value="running">运行中</option>
              <option value="stopped">已停止</option>
            </select>

            {/* Batch Operation Buttons */}
            {selectedInstIds.length > 0 && (
              <div className="flex items-center gap-2 animate-fade-in">
                <button
                  onClick={handleBatchStop}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100 transition cursor-pointer"
                >
                  批量停止 ({selectedInstIds.length})
                </button>
                <button
                  onClick={handleBatchDelete}
                  className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold hover:bg-red-100 transition cursor-pointer"
                >
                  批量释放 ({selectedInstIds.length})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Instance List Render */}
        {filteredInstances.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-medium">
            <Box className="w-12 h-12 mx-auto mb-2 opacity-30 text-indigo-600" />
            <p className="text-xs">暂无符合条件的 {activeMode === 'container' ? '容器' : '云服务器'} 算力实例</p>
            <button
              onClick={() => {
                setCreateComputePreset({ mode: activeMode });
                setCreateComputeModalOpen(true);
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 cursor-pointer"
            >
              立即新建一个实例
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Running Instances Group */}
            {runningInstances.length > 0 && (
              <div className="space-y-3">
                <div className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>运行中实例 ({runningInstances.length})</span>
                </div>

                <div className="space-y-3">
                  {runningInstances.map((inst) => (
                    <div
                      key={inst.id}
                      className="p-5 bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-wrap items-center justify-between gap-4"
                    >
                      {/* Left Specs & Info */}
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedInstIds.includes(inst.id)}
                          onChange={() => toggleSelectInst(inst.id)}
                          className="mt-1.5 rounded text-indigo-600 focus:ring-0 cursor-pointer"
                        />

                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 ${
                          inst.instanceType === 'server' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'bg-cyan-50 text-cyan-600 border border-cyan-200'
                        }`}>
                          {inst.instanceType === 'server' ? <Server className="w-5 h-5" /> : <Box className="w-5 h-5" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 text-sm">{inst.name}</span>
                            <span className="text-[10px] bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded-md font-mono font-bold">
                              ID: {inst.id}
                            </span>
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold border border-indigo-200">
                              {inst.scene}
                            </span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                              ● 运行中
                            </span>
                          </div>

                          <div className="text-xs font-mono font-medium text-slate-600 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                            <span className="font-bold text-indigo-600">规格: {inst.gpuModel} × {inst.gpuCount}卡</span>
                            <span>地域: {inst.region} ({inst.billingType})</span>
                            <span>配置: {inst.cpu} / {inst.ram}</span>
                            <span className="text-slate-500">镜像: {inst.imageName}</span>
                          </div>

                          <div className="text-[11px] font-mono text-slate-500 mt-1 flex items-center gap-4">
                            <span>⏱ 运行时长: <strong className="text-slate-800">{inst.runningHours.toFixed(1)}h</strong></span>
                            <span>💰 实时费用: <strong className="text-amber-600">¥{inst.totalCost.toFixed(2)}</strong> (¥{inst.hourlyCost.toFixed(2)}/h)</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Direct Access Entrance */}
                        {inst.jupyterUrl && (
                          <a
                            href={inst.jupyterUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <span>JupyterLab</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {inst.vncUrl && (
                          <a
                            href={inst.vncUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <span>VNC 控制台</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {inst.sshCommand && (
                          <button
                            onClick={() => copySSH(inst.sshCommand || '', inst.id)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            {copiedId === inst.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedId === inst.id ? '已复制 SSH' : '复制 SSH'}</span>
                          </button>
                        )}

                        <button
                          onClick={() => toggleGpuInstanceStatus(inst.id)}
                          className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>停止</span>
                        </button>

                        <button
                          onClick={() => setDetailInstance(inst)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                        >
                          详情
                        </button>

                        <button
                          onClick={() => deleteGpuInstance(inst.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="释放销毁"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stopped Instances Group */}
            {stoppedInstances.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-extrabold text-slate-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>已停止实例 ({stoppedInstances.length})</span>
                </div>

                <div className="space-y-3">
                  {stoppedInstances.map((inst) => (
                    <div
                      key={inst.id}
                      className="p-5 bg-slate-100/60 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 opacity-85 hover:opacity-100 transition"
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedInstIds.includes(inst.id)}
                          onChange={() => toggleSelectInst(inst.id)}
                          className="mt-1.5 rounded text-indigo-600 focus:ring-0 cursor-pointer"
                        />

                        <div className="w-10 h-10 rounded-2xl bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-lg shrink-0">
                          {inst.instanceType === 'server' ? <Server className="w-5 h-5" /> : <Box className="w-5 h-5" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-800 text-sm">{inst.name}</span>
                            <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-mono font-bold">
                              ID: {inst.id}
                            </span>
                            <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                              ○ 已暂停
                            </span>
                          </div>

                          <div className="text-xs font-mono font-medium text-slate-500 mt-1 flex flex-wrap items-center gap-x-4">
                            <span>规格: {inst.gpuModel}</span>
                            <span>地域: {inst.region}</span>
                            <span>已用时长: {inst.runningHours.toFixed(1)}h</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => toggleGpuInstanceStatus(inst.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>启动</span>
                        </button>

                        <button
                          onClick={() => setDetailInstance(inst)}
                          className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
                        >
                          详情
                        </button>

                        <button
                          onClick={() => deleteGpuInstance(inst.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick History Button Link */}
            <div className="pt-2 text-center">
              <button
                onClick={() => setHistoryModalOpen(true)}
                className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>查看全部历史已销毁实例 & 月度费用账单流水 →</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* AREA 3: USAGE OVERVIEW STATS (区域三：用量概览) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-[11px] font-extrabold">⏱ 本月已用时长</div>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">12.5 <span className="text-xs font-normal">小时</span></div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-[11px] font-extrabold">💰 本月算力花费</div>
            <div className="text-2xl font-black text-amber-600 font-mono mt-1">¥89.00 <span className="text-xs font-normal text-slate-400">元</span></div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Coins className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-[11px] font-extrabold">💳 账户可用算力积分</div>
            <div className="text-2xl font-black text-indigo-600 font-mono mt-1">{user.points.toLocaleString()} <span className="text-xs font-normal text-slate-400">积分</span></div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex justify-between text-[11px] font-extrabold">
            <span className="text-slate-600">模式用量占比</span>
            <span className="text-indigo-600 font-mono">容器 78% / 服务器 22%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div className="h-full bg-indigo-600" style={{ width: '78%' }} title="容器 78%" />
            <div className="h-full bg-cyan-400" style={{ width: '22%' }} title="云服务器 22%" />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-0.5">
            <span>● 容器实例</span>
            <span>● 云服务器</span>
          </div>
        </div>
      </div>

      {/* AREA 4: POPULAR IMAGES RECOMMENDATIONS (区域四：热门镜像推荐) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span>热门 GPU 镜像预置推荐</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-50 text-red-600 border border-red-200 font-bold">
                开箱即用
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              选择适合您框架的环境镜像，点击直接预填参数一键拉起
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockComputeImages.map((img) => (
            <div
              key={img.id}
              className="p-4 bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                    <span className="text-lg">{img.icon}</span>
                    <span>{img.name}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 shrink-0">
                    {img.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-medium line-clamp-2">
                  {img.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  📥 {img.downloads.toLocaleString()} 次部署
                </span>

                <button
                  onClick={() => {
                    setCreateComputePreset({ imageName: img.name, scene: img.presetScene });
                    setCreateComputeModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <span>一键拉起</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
