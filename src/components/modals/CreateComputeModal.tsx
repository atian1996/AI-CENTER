import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { RentalGPUCard, GPUInstance } from '../../types';
import { 
  X, 
  Cpu, 
  Check, 
  AlertTriangle, 
  HardDrive, 
  Sparkles, 
  ChevronDown,
  Layers,
  Info
} from 'lucide-react';

export const CreateComputeModal: React.FC = () => {
  const { 
    createComputeModalOpen, 
    setCreateComputeModalOpen, 
    createComputePreset, 
    setCreateComputePreset,
    launchGpuInstance, 
    showToast 
  } = useApp();

  // Selected GPU Card default: PRO 6000 96GB
  const defaultCard: RentalGPUCard = {
    id: 'pro_6000_96g',
    title: 'PRO 6000 96GB',
    availableCards: 7,
    hourlyPrice: 6.19,
    dayPrice: 145,
    weekPrice: 987,
    monthPrice: 4011,
    topBorderColor: 'border-t-amber-600',
    gpuModel: 'RTX PRO 6000',
    vram: '90 GB',
    cpu: '30 x AMD EPYC 9J14',
    ram: '120 GB',
    disk: '1024 GB'
  };

  const currentCard: RentalGPUCard = createComputePreset?.card || defaultCard;

  // Billing Type selected: 'hourly' | 'daily' | 'weekly' | 'monthly'
  const [billingType, setBillingType] = useState<'hourly' | 'daily' | 'weekly' | 'monthly'>('hourly');

  // Image Category Tab: '官方镜像' | '我的镜像' | '热门镜像'
  const [imageCategory, setImageCategory] = useState<'官方镜像' | '我的镜像' | '热门镜像'>('官方镜像');

  // Selected Image ID
  const [selectedImageId, setSelectedImageId] = useState<string>('pytorch_2');

  // GPU count selected (e.g. 1 x RTX PRO 6000)
  const [gpuCount, setGpuCount] = useState<number>(1);

  useEffect(() => {
    if (createComputePreset?.card) {
      setBillingType('hourly');
    }
  }, [createComputePreset]);

  if (!createComputeModalOpen) return null;

  const imagesList = [
    {
      id: 'pytorch_2',
      name: 'PyTorch 2',
      size: '13.5 GB',
      usageCount: 7502,
      isOfficial: true,
      hasDescription: false
    },
    {
      id: 'comfyui_wan',
      name: '🧘 ComfyUI v0.19.3 (包含 WAN2.2 Animation)',
      size: '50.4 GB',
      usageCount: 789,
      isOfficial: true,
      hasDescription: true
    },
    {
      id: 'pytorch_1',
      name: 'PyTorch 1 (Pro 6000 以及 5090 无法使用)',
      size: '12.4 GB',
      usageCount: 551,
      isOfficial: true,
      hasDescription: true
    },
    {
      id: 'ubuntu_clean',
      name: 'Ubuntu 22.04 纯净版',
      size: '6.9 GB',
      usageCount: 265,
      isOfficial: true,
      hasDescription: true
    },
    {
      id: 'openclaw',
      name: '🦞 OpenClaw镜像',
      size: '20.3 GB',
      usageCount: 162,
      isOfficial: true,
      hasDescription: true
    },
    {
      id: 'openclaw_ollama',
      name: '🦞 OpenClaw + 🦙 Ollama Qwen3.6',
      size: '49.2 GB',
      usageCount: 105,
      isOfficial: true,
      hasDescription: true
    },
    {
      id: 'remote_desktop',
      name: '🖥️ 远程桌面',
      size: '20.5 GB',
      usageCount: 46,
      isOfficial: false,
      hasDescription: true
    }
  ];

  const selectedImageObj = imagesList.find(img => img.id === selectedImageId) || imagesList[0];

  const handleStartUse = () => {
    let mappedBilling: GPUInstance['billingType'] = '按量计费';
    if (billingType === 'daily') mappedBilling = '包日';
    if (billingType === 'weekly') mappedBilling = '包周';
    if (billingType === 'monthly') mappedBilling = '包月';

    launchGpuInstance(
      'Notebook开发',
      currentCard.gpuModel,
      selectedImageObj.name,
      {
        name: `${currentCard.title.toLowerCase()}-inst`,
        instanceType: 'container',
        gpuCount,
        vram: currentCard.vram,
        cpu: currentCard.cpu,
        ram: currentCard.ram,
        billingType: mappedBilling,
        hourlyCost: currentCard.hourlyPrice,
        systemDisk: '50GB NVMe',
        dataDisk: currentCard.disk
      }
    );

    showToast(`实例部署成功！已为您启动 ${currentCard.title} (${gpuCount}卡)`);
    setCreateComputeModalOpen(false);
    setCreateComputePreset(null);
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in select-none">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
        
        {/* Modal Scrollable Container */}
        <div className="flex-1 overflow-y-auto">
          
          {/* Top Banner (Reference Image 2) */}
          <div className="relative bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 text-white p-6 overflow-hidden">
            {/* Background Light Pattern */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* NVIDIA Icon Badge */}
                  <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 font-black text-xl text-emerald-400">
                    <Cpu className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                    <span>{currentCard.gpuModel}</span>
                    <span className="text-xs bg-amber-500/30 text-amber-100 px-2.5 py-0.5 rounded-full border border-amber-400/40 font-bold">
                      {currentCard.availableCards} 卡可用
                    </span>
                  </h2>
                </div>

                <button
                  onClick={() => {
                    setCreateComputeModalOpen(false);
                    setCreateComputePreset(null);
                  }}
                  className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Hardware Specs Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1 rounded-lg bg-black/30 text-amber-200 backdrop-blur-sm">
                  显存: <strong className="text-white">{currentCard.vram}</strong>
                </span>
                <span className="px-3 py-1 rounded-lg bg-black/30 text-amber-200 backdrop-blur-sm">
                  CPU: <strong className="text-white">{currentCard.cpu}</strong>
                </span>
                <span className="px-3 py-1 rounded-lg bg-black/30 text-amber-200 backdrop-blur-sm">
                  内存: <strong className="text-white">{currentCard.ram}</strong>
                </span>
                <span className="px-3 py-1 rounded-lg bg-black/30 text-amber-200 backdrop-blur-sm">
                  磁盘: <strong className="text-white">{currentCard.disk}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Mining Warning Banner (Reference Image 2) */}
          <div className="bg-amber-50 border-y border-amber-200/80 px-6 py-2.5 text-xs text-amber-900 font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Featurize 平台严禁任何形式的挖矿行为，如若发现账号封禁且不退款！</span>
          </div>

          {/* Main Form Area */}
          <div className="p-6 space-y-6">
            
            {/* Section 1: Billing Method (计费方式) */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900">计费方式</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Hourly */}
                <div 
                  onClick={() => setBillingType('hourly')}
                  className={`p-4 rounded-xl border transition cursor-pointer relative flex flex-col justify-between ${
                    billingType === 'hourly' 
                      ? 'border-emerald-500 bg-white ring-1 ring-emerald-500 shadow-xs' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {billingType === 'hourly' && (
                    <div className="absolute top-2 right-2 text-emerald-500">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                  <div className="text-xs text-slate-600 font-bold">按量</div>
                  <div className="mt-2 flex items-baseline gap-0.5">
                    <span className="text-emerald-600 font-bold text-xs">¥</span>
                    <span className="text-emerald-600 font-black text-2xl font-mono">{currentCard.hourlyPrice.toFixed(2)}</span>
                    <span className="text-slate-400 text-[11px] font-normal">/小时</span>
                  </div>
                </div>

                {/* Daily */}
                <div 
                  onClick={() => setBillingType('daily')}
                  className={`p-4 rounded-xl border transition cursor-pointer relative flex flex-col justify-between ${
                    billingType === 'daily' 
                      ? 'border-emerald-500 bg-white ring-1 ring-emerald-500 shadow-xs' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {billingType === 'daily' && (
                    <div className="absolute top-2 right-2 text-emerald-500">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                  <div className="text-xs text-slate-600 font-bold">日租</div>
                  <div className="mt-2 flex items-baseline gap-0.5">
                    <span className="text-slate-800 font-bold text-xs">¥</span>
                    <span className="text-slate-900 font-black text-2xl font-mono">{currentCard.dayPrice}</span>
                  </div>
                </div>

                {/* Weekly */}
                <div 
                  onClick={() => setBillingType('weekly')}
                  className={`p-4 rounded-xl border transition cursor-pointer relative flex flex-col justify-between ${
                    billingType === 'weekly' 
                      ? 'border-emerald-500 bg-white ring-1 ring-emerald-500 shadow-xs' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {billingType === 'weekly' && (
                    <div className="absolute top-2 right-2 text-emerald-500">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                  <div className="text-xs text-slate-600 font-bold">周租</div>
                  <div className="mt-2 flex items-baseline gap-0.5">
                    <span className="text-slate-800 font-bold text-xs">¥</span>
                    <span className="text-slate-900 font-black text-2xl font-mono">{currentCard.weekPrice}</span>
                  </div>
                </div>

                {/* Monthly */}
                <div 
                  onClick={() => setBillingType('monthly')}
                  className={`p-4 rounded-xl border transition cursor-pointer relative flex flex-col justify-between ${
                    billingType === 'monthly' 
                      ? 'border-emerald-500 bg-white ring-1 ring-emerald-500 shadow-xs' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {billingType === 'monthly' && (
                    <div className="absolute top-2 right-2 text-emerald-500">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                  <div className="text-xs text-slate-600 font-bold">月租</div>
                  <div className="mt-2 flex items-baseline gap-0.5">
                    <span className="text-slate-800 font-bold text-xs">¥</span>
                    <span className="text-slate-900 font-black text-2xl font-mono">{currentCard.monthPrice}</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed font-normal pt-1">
                实例实时计费，优先使用代金券抵扣费用，当账户没有余额时实例会自动退回，请保持余额充足。
                建议在长期租用之前，先使用该方式验证实例环境是否可用，验证成功后再切换为长期租用即可。
              </p>
            </div>

            {/* Section 2: Choose Image (选择镜像) */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-extrabold text-slate-900">选择镜像</h3>
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  {(['官方镜像', '我的镜像', '热门镜像'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setImageCategory(cat)}
                      className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                        imageCategory === cat ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Radio Item List */}
              <div className="space-y-2.5">
                {imagesList.map(img => (
                  <div
                    key={img.id}
                    onClick={() => setSelectedImageId(img.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                      selectedImageId === img.id
                        ? 'border-blue-500 bg-white ring-1 ring-blue-500 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                        <span>{img.name}</span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 font-mono text-[10px]">
                          {img.size}
                        </span>
                        <span>已使用 {img.usageCount} 次</span>
                        {img.isOfficial && (
                          <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-200">
                            官方
                          </span>
                        )}
                        {img.hasDescription && (
                          <span className="text-slate-400 hover:text-blue-600 cursor-pointer">
                            查看镜像描述
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Radio circle */}
                    <div className="shrink-0">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedImageId === img.id ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                      }`}>
                        {selectedImageId === img.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Modal Bottom Action Bar (Reference Image 2) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {/* Card Selector Dropdown */}
          <div className="relative">
            <select
              value={gpuCount}
              onChange={(e) => setGpuCount(Number(e.target.value))}
              className="appearance-none bg-slate-200 hover:bg-slate-300/80 text-slate-800 font-extrabold text-xs px-4 py-2.5 pr-8 rounded-xl outline-none cursor-pointer"
            >
              <option value={1}>1 x {currentCard.gpuModel}</option>
              <option value={2}>2 x {currentCard.gpuModel}</option>
              <option value={4}>4 x {currentCard.gpuModel}</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCreateComputeModalOpen(false);
                setCreateComputePreset(null);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer transition"
            >
              取消
            </button>

            <button
              onClick={handleStartUse}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs cursor-pointer shadow-md shadow-indigo-500/20 transition"
            >
              开始使用
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
