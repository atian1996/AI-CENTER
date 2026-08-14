import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RentalGPUCard, GPUInstance } from '../../types';
import { 
  Zap, 
  Cpu, 
  Play, 
  Square, 
  Trash2, 
  ExternalLink, 
  Search, 
  History, 
  Copy, 
  Check, 
  Box, 
  Sparkles, 
  Tag,
  BookOpen,
  Flame,
  Palette,
  Sliders,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export const ComputeView: React.FC = () => {
  const { 
    gpuInstances, 
    toggleGpuInstanceStatus, 
    deleteGpuInstance, 
    setCreateComputeModalOpen, 
    setCreateComputePreset,
    setDetailInstance, 
    setHistoryModalOpen, 
    showToast 
  } = useApp();

  // Top Main Tabs: 'available' (可租用实例) | 'my_instances' (我租用的实例)
  const [activeTab, setActiveTab] = useState<'available' | 'my_instances'>('available');

  // Filters for My Instances
  const [statusFilter, setStatusFilter] = useState<'all' | 'running' | 'stopped'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstIds, setSelectedInstIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 4 个顶部快速场景 Preset 卡片定义 (参考图片 3)
  const quickPresets = [
    {
      id: 'notebook',
      badge: '数据实验',
      badgeStyle: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      icon: <BookOpen className="w-5 h-5 text-cyan-600" />,
      iconBg: 'bg-cyan-50 border-cyan-100',
      title: '📓 Notebook 开发',
      description: '预装 JupyterLab 与 PyTorch 框架，开箱即用，支持在线交互调试',
      actionText: '一键创建 Notebook',
      actionColor: 'text-indigo-600 hover:text-indigo-700',
      scene: 'Notebook开发' as GPUInstance['scene'],
      imageName: 'PyTorch 2'
    },
    {
      id: 'finetune',
      badge: '大模型微调',
      badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <Flame className="w-5 h-5 text-amber-600" />,
      iconBg: 'bg-amber-50 border-amber-100',
      title: '🔥 大模型微调 (LLaMA/Qwen)',
      description: '适配 A100 80G 多卡集群，包含 DeepSpeed, LLaMA-Factory 与 LoRA',
      actionText: '一键创建微调环境',
      actionColor: 'text-indigo-600 hover:text-indigo-700',
      scene: 'LLaMA/Qwen微调' as GPUInstance['scene'],
      imageName: 'PyTorch 2'
    },
    {
      id: 'comfyui',
      badge: 'AIGC 绘画',
      badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: <Palette className="w-5 h-5 text-purple-600" />,
      iconBg: 'bg-purple-50 border-purple-100',
      title: '🎨 文生图生成 (ComfyUI)',
      description: '预装 Flux.1, ControlNet 基础模型包与节点拓展，开箱直接渲染',
      actionText: '一键创建 ComfyUI',
      actionColor: 'text-indigo-600 hover:text-indigo-700',
      scene: 'ComfyUI绘图' as GPUInstance['scene'],
      imageName: '🧘 ComfyUI v0.19.3 (包含 WAN2.2 Animation)'
    },
    {
      id: 'custom',
      badge: '全自由配置',
      badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <Sliders className="w-5 h-5 text-emerald-600" />,
      iconBg: 'bg-emerald-50 border-emerald-100',
      title: '⚙️ 自定义自由配置',
      description: '自由选择 GPU 型号、显存大小、网络带宽与私有 Docker 镜像',
      actionText: '高级自定义创建',
      actionColor: 'text-indigo-600 hover:text-indigo-700',
      scene: '自定义部署' as GPUInstance['scene'],
      imageName: 'Ubuntu 22.04 纯净版'
    }
  ];

  // 丰富的可租用实例卡片数据示例 (12 种典型算力卡)
  const availableRentalCards: RentalGPUCard[] = [
    {
      id: 'pro_6000_96g',
      title: 'PRO 6000 96GB',
      availableCards: 7,
      hourlyPrice: 6.19,
      dayPrice: 145,
      weekPrice: 987,
      monthPrice: 4011,
      topBorderColor: 'border-t-amber-500',
      gpuModel: 'RTX PRO 6000',
      vram: '96.0 GB 显存',
      cpu: '30 核 AMD EPYC 9J14',
      ram: '128.8 GB',
      disk: '1.1 TB 或更多'
    },
    {
      id: 'h100_sxm_80g',
      title: 'NVIDIA H100 SXM',
      availableCards: 4,
      hourlyPrice: 18.50,
      dayPrice: 420,
      weekPrice: 2800,
      monthPrice: 11200,
      topBorderColor: 'border-t-purple-600',
      gpuModel: 'NVIDIA H100 SXM',
      vram: '80.0 GB HBM3 显存',
      cpu: '64 核 AMD EPYC 9654',
      ram: '256.0 GB',
      disk: '2.0 TB NVMe High Speed'
    },
    {
      id: 'rtx_5090_32g',
      title: 'RTX 5090 32G',
      availableCards: 5,
      hourlyPrice: 4.50,
      dayPrice: 105,
      weekPrice: 710,
      monthPrice: 2880,
      topBorderColor: 'border-t-indigo-600',
      gpuModel: 'RTX 5090',
      vram: '32.0 GB GDDR7 显存',
      cpu: '24 核 AMD EPYC 9354',
      ram: '128.0 GB',
      disk: '1.0 TB 或更多'
    },
    {
      id: 'a100_80g',
      title: 'NVIDIA A100 80G',
      availableCards: 6,
      hourlyPrice: 8.80,
      dayPrice: 200,
      weekPrice: 1350,
      monthPrice: 5400,
      topBorderColor: 'border-t-emerald-600',
      gpuModel: 'NVIDIA A100',
      vram: '80.0 GB HBM2e 显存',
      cpu: '32 核 AMD EPYC 7742',
      ram: '128.0 GB',
      disk: '1.5 TB NVMe'
    },
    {
      id: 'rtx_4090_48g',
      title: 'RTX 4090 48G',
      availableCards: 2,
      hourlyPrice: 3.00,
      dayPrice: 70,
      weekPrice: 480,
      monthPrice: 1950,
      topBorderColor: 'border-t-yellow-600',
      gpuModel: 'RTX 4090 48G',
      vram: '48.0 GB 显存',
      cpu: '14 核 AMD EPYC 7453',
      ram: '60.1 GB',
      disk: '751.6 GB 或更多'
    },
    {
      id: 'rtx_4090',
      title: 'RTX 4090',
      availableCards: 3,
      hourlyPrice: 1.87,
      dayPrice: 44,
      weekPrice: 298,
      monthPrice: 1210,
      topBorderColor: 'border-t-amber-600',
      gpuModel: 'RTX 4090',
      vram: '25.2 GB 显存',
      cpu: '14 核 AMD EPYC 9354',
      ram: '60.1 GB',
      disk: '400.0 GB 或更多'
    },
    {
      id: 'l40s_48g',
      title: 'NVIDIA L40S 48G',
      availableCards: 3,
      hourlyPrice: 5.20,
      dayPrice: 120,
      weekPrice: 810,
      monthPrice: 3300,
      topBorderColor: 'border-t-cyan-600',
      gpuModel: 'NVIDIA L40S',
      vram: '48.0 GB GDDR6 显存',
      cpu: '32 核 Intel Xeon Gold',
      ram: '128.0 GB',
      disk: '1.0 TB NVMe'
    },
    {
      id: 'rtx_3090',
      title: 'RTX 3090',
      availableCards: 2,
      hourlyPrice: 1.62,
      dayPrice: 38,
      weekPrice: 258,
      monthPrice: 1050,
      topBorderColor: 'border-t-red-500',
      gpuModel: 'RTX 3090',
      vram: '25.4 GB 显存',
      cpu: '6 核 Xeon Gold 6142',
      ram: '60.1 GB',
      disk: '451.0 GB 或更多'
    },
    {
      id: 'rtx_4080s',
      title: 'RTX 4080 Super',
      availableCards: 8,
      hourlyPrice: 1.25,
      dayPrice: 28,
      weekPrice: 190,
      monthPrice: 780,
      topBorderColor: 'border-t-teal-600',
      gpuModel: 'RTX 4080 Super',
      vram: '16.0 GB 显存',
      cpu: '12 核 AMD EPYC 7543',
      ram: '48.0 GB',
      disk: '500.0 GB 或更多'
    },
    {
      id: 'rtx_2080ti_22g',
      title: 'RTX 2080 Ti 22G',
      availableCards: 8,
      hourlyPrice: 0.69,
      dayPrice: 16,
      weekPrice: 110,
      monthPrice: 448,
      topBorderColor: 'border-t-lime-600',
      gpuModel: 'RTX 2080 Ti',
      vram: '22.0 GB 显存',
      cpu: '8 核 Intel E5-2686 v4',
      ram: '27.9 GB',
      disk: '751.6 GB 或更多'
    },
    {
      id: 'rtx_3060',
      title: 'RTX 3060',
      availableCards: 6,
      hourlyPrice: 0.69,
      dayPrice: 16,
      weekPrice: 110,
      monthPrice: 448,
      topBorderColor: 'border-t-blue-600',
      gpuModel: 'RTX 3060',
      vram: '12.6 GB 显存',
      cpu: '5 核 E5-2686 v4',
      ram: '27.1 GB',
      disk: '375.8 GB 或更多'
    },
    {
      id: 'tesla_v100',
      title: 'Tesla V100 32G',
      availableCards: 4,
      hourlyPrice: 1.10,
      dayPrice: 25,
      weekPrice: 170,
      monthPrice: 680,
      topBorderColor: 'border-t-slate-600',
      gpuModel: 'Tesla V100',
      vram: '32.0 GB HBM2 显存',
      cpu: '16 核 Intel Xeon',
      ram: '64.0 GB',
      disk: '500.0 GB NVMe'
    }
  ];

  // Filter instances for My Instances Tab
  const myInstances = gpuInstances.filter(inst => {
    if (statusFilter !== 'all' && inst.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        inst.name.toLowerCase().includes(q) ||
        inst.id.toLowerCase().includes(q) ||
        inst.gpuModel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const runningInstances = myInstances.filter(i => i.status === 'running');
  const stoppedInstances = myInstances.filter(i => i.status === 'stopped');

  const copySSH = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    showToast('SSH 链接已复制到剪贴板');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStartCardRental = (card: RentalGPUCard) => {
    setCreateComputePreset({ card });
    setCreateComputeModalOpen(true);
  };

  const handleQuickPresetClick = (preset: typeof quickPresets[0]) => {
    setCreateComputePreset({
      scene: preset.scene,
      imageName: preset.imageName,
      card: availableRentalCards[0] // 默认选中首张优质卡
    });
    setCreateComputeModalOpen(true);
  };

  const handleBatchStop = () => {
    if (selectedInstIds.length === 0) return;
    selectedInstIds.forEach(id => {
      const inst = gpuInstances.find(i => i.id === id);
      if (inst && inst.status === 'running') toggleGpuInstanceStatus(id);
    });
    setSelectedInstIds([]);
    showToast('已批量停止选中算力实例');
  };

  const handleBatchDelete = () => {
    if (selectedInstIds.length === 0) return;
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

  return (
    <div className="w-full space-y-6 animate-fade-in text-slate-800 pb-12 select-none font-sans">
      
      {/* Standard Unified Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs shrink-0">
            <Zap className="w-6 h-6 fill-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              算力工坊
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                GPU 容器云
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              提供按量计费的优质高性能 GPU 算力资源，包含 RTX PRO 6000、5090、H100、4090 等多样化容器实例
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setHistoryModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span>历史明细 & 账单</span>
          </button>
        </div>
      </div>

      {/* TOP NAVIGATION TABS */}
      <div className="flex items-center border-b border-slate-200">
        <button
          onClick={() => setActiveTab('available')}
          className={`px-6 py-3 font-extrabold text-sm transition relative cursor-pointer ${
            activeTab === 'available'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          可租用实例
        </button>

        <button
          onClick={() => setActiveTab('my_instances')}
          className={`px-6 py-3 font-extrabold text-sm transition relative cursor-pointer flex items-center gap-2 ${
            activeTab === 'my_instances'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>我租用的实例</span>
          <span className="px-2 py-0.2 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
            {gpuInstances.length}
          </span>
        </button>
      </div>

      {/* TAB 1: 可租用实例 */}
      {activeTab === 'available' && (
        <div className="space-y-8">
          
          {/* SECTION A: 顶部4个快速方案卡片 (严格还原参考图片 3) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-extrabold text-slate-900">快速开箱配置（根据应用场景一键部署）</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {quickPresets.map((preset) => (
                <div 
                  key={preset.id}
                  onClick={() => handleQuickPresetClick(preset)}
                  className="group relative rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1 cursor-pointer overflow-hidden"
                >
                  <div className="space-y-3">
                    {/* Header: Icon & Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className={`w-10 h-10 rounded-xl ${preset.iconBg} border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                        {preset.icon}
                      </div>

                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold border ${preset.badgeStyle}`}>
                        {preset.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {preset.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-500 leading-relaxed font-normal min-h-[38px]">
                      {preset.description}
                    </p>
                  </div>

                  {/* Action Link */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                    <span>{preset.actionText}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION B: 丰富的实例数据卡片列表 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-extrabold text-slate-900">裸金属与 GPU 容器实例大厅 ({availableRentalCards.length})</h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">按需弹性秒级拉起 • 秒级计费</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableRentalCards.map((card) => (
                <div 
                  key={card.id}
                  className={`bg-white rounded-2xl border border-slate-200/90 ${card.topBorderColor} border-t-4 p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-5`}
                >
                  {/* Header: Title + Available Badge */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">
                        {card.title}
                      </h2>
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold text-blue-600 bg-blue-50 border border-blue-200/80">
                        {card.availableCards}卡可用
                      </span>
                    </div>

                    {/* Pricing Display */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium pb-2 border-b border-slate-100">
                      <Tag className="w-3.5 h-3.5 text-indigo-500 fill-indigo-100" />
                      <span>按量使用</span>
                      <span className="text-red-500 font-black text-lg font-mono">¥{card.hourlyPrice.toFixed(2)}</span>
                      <span className="text-slate-400">/ 小时</span>
                    </div>

                    {/* Specs List */}
                    <div className="space-y-2.5 text-xs font-medium text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="w-5 text-center">🟢</span>
                        <span className="text-slate-500 font-bold">GPU</span>
                        <span className="font-semibold text-slate-900">{card.gpuModel}，共 {card.vram}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-5 text-center">💻</span>
                        <span className="text-slate-500 font-bold">CPU</span>
                        <span className="font-semibold text-slate-900">{card.cpu}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-5 text-center">🧠</span>
                        <span className="text-slate-500 font-bold">内存</span>
                        <span className="font-semibold text-slate-900">{card.ram}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-5 text-center">🗄️</span>
                        <span className="text-slate-500 font-bold">硬盘</span>
                        <span className="font-semibold text-slate-900">{card.disk}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Button */}
                  <button
                    onClick={() => handleStartCardRental(card)}
                    className="w-full py-2.5 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-extrabold text-xs transition cursor-pointer active:scale-98"
                  >
                    开始使用
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: 我租用的实例 */}
      {activeTab === 'my_instances' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          
          {/* Header & Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900">
                我租用的实例 ({myInstances.length})
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-48 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索实例名称/ID/规格..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-600 font-medium"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-700 cursor-pointer"
              >
                <option value="all">全部状态</option>
                <option value="running">运行中</option>
                <option value="stopped">已停止</option>
              </select>

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

          {/* Instances List */}
          {myInstances.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-medium">
              <Box className="w-12 h-12 mx-auto mb-2 opacity-30 text-indigo-600" />
              <p className="text-xs">暂无正在租用中的算力容器实例</p>
              <button
                onClick={() => setActiveTab('available')}
                className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 cursor-pointer"
              >
                前去租用一个算力实例
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Running */}
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
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedInstIds.includes(inst.id)}
                            onChange={() => toggleSelectInst(inst.id)}
                            className="mt-1.5 rounded text-indigo-600 focus:ring-0 cursor-pointer"
                          />

                          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center font-bold text-lg shrink-0">
                            <Box className="w-5 h-5" />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-slate-900 text-sm">{inst.name}</span>
                              <span className="text-[10px] bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded-md font-mono font-bold">
                                ID: {inst.id}
                              </span>
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                                ● 运行中
                              </span>
                            </div>

                            <div className="text-xs font-mono font-medium text-slate-600 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                              <span className="font-bold text-indigo-600">规格: {inst.gpuModel} × {inst.gpuCount}卡</span>
                              <span>地域: {inst.region} ({inst.billingType})</span>
                              <span>配置: {inst.cpu} / {inst.ram}</span>
                            </div>

                            <div className="text-[11px] font-mono text-slate-500 mt-1 flex items-center gap-4">
                              <span>⏱ 运行时长: <strong className="text-slate-800">{inst.runningHours.toFixed(1)}h</strong></span>
                              <span>💰 实时费用: <strong className="text-amber-600">¥{inst.totalCost.toFixed(2)}</strong> (¥{inst.hourlyCost.toFixed(2)}/h)</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
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

              {/* Stopped */}
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
                            <Box className="w-5 h-5" />
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

            </div>
          )}

        </div>
      )}

    </div>
  );
};
