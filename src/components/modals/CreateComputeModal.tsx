import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { GPUInstance, ComputeMode } from '../../types';
import { 
  X, 
  Cpu, 
  Server, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  HardDrive, 
  Globe, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Layers, 
  Box 
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

  // Selected Mode
  const [mode, setMode] = useState<ComputeMode>('container');

  // Multi-step Wizard Step (1-indexed)
  const [step, setStep] = useState<number>(1);

  // Form selections
  const [instanceName, setInstanceName] = useState('');
  const [scene, setScene] = useState<GPUInstance['scene']>('Notebook开发');
  const [region, setRegion] = useState('华北 · 北京');
  const [gpuModel, setGpuModel] = useState('RTX 4090 24GB');
  const [gpuCount, setGpuCount] = useState<number>(1);
  const [imageCategory, setImageCategory] = useState<'官方镜像' | '社区热门' | 'App市场'>('官方镜像');
  const [selectedImage, setSelectedImage] = useState('PyTorch 2.2 + CUDA 12.1 + FlashAttention-2');
  const [systemDisk, setSystemDisk] = useState('50GB NVMe');
  const [dataDisk, setDataDisk] = useState('200GB NVMe');
  const [publicIpType, setPublicIpType] = useState('按固定带宽 (10Mbps)');
  const [billingType, setBillingType] = useState<GPUInstance['billingType']>('按量计费');

  // Sync state if opened with preset
  useEffect(() => {
    if (createComputePreset) {
      if (createComputePreset.mode) setMode(createComputePreset.mode);
      if (createComputePreset.scene) setScene(createComputePreset.scene);
      if (createComputePreset.imageName) setSelectedImage(createComputePreset.imageName);
    }
  }, [createComputePreset]);

  if (!createComputeModalOpen) return null;

  const maxSteps = mode === 'server' ? 5 : 4;

  const handleNextStep = () => {
    if (step < maxSteps) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleCompleteCreation = () => {
    launchGpuInstance(
      scene,
      gpuModel,
      selectedImage,
      {
        name: instanceName.trim() || `${scene.toLowerCase()}-${gpuModel.split(' ')[0].toLowerCase()}-inst`,
        instanceType: mode,
        region,
        gpuCount,
        billingType,
        systemDisk,
        dataDisk,
        publicIp: publicIpType
      }
    );
    setCreateComputeModalOpen(false);
    setCreateComputePreset(null);
    setStep(1);
  };

  // Pricing Estimator Calculation
  let basePrice = 2.90;
  if (gpuModel.includes('T4')) basePrice = 1.25;
  if (gpuModel.includes('V100') || gpuModel.includes('A10')) basePrice = 8.00;
  if (gpuModel.includes('A100')) basePrice = 25.00;
  const totalPrice = (basePrice * gpuCount * (billingType === '包月' ? 0.7 : billingType === '抢占式' ? 0.2 : 1)).toFixed(2);

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        
        {/* Modal Top Navigation Bar */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">创建 GPU 算力实例向导</h3>
              <p className="text-[11px] text-slate-500 font-medium">弹性开箱即用 · 秒级拉起深度学习与推理环境</p>
            </div>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => {
                setMode('container');
                setStep(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                mode === 'container' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>容器实例 (轻量/秒启动)</span>
            </button>

            <button
              onClick={() => {
                setMode('server');
                setStep(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                mode === 'server' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>云服务器实例 (完整控制)</span>
            </button>
          </div>

          <button
            onClick={() => {
              setCreateComputeModalOpen(false);
              setCreateComputePreset(null);
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Multi-Step Wizard Progress Bar */}
        <div className="px-8 py-3 bg-slate-50/50 border-b border-slate-200 flex items-center justify-between text-xs font-bold">
          {mode === 'server' ? (
            <>
              <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">1</span>
                <span>1. 地域与GPU规格</span>
              </div>
              <div className="w-8 h-[1px] bg-slate-200" />
              <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-indigo-600' : 'text-slate-400'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">2</span>
                <span>2. 操作系统与镜像</span>
              </div>
              <div className="w-8 h-[1px] bg-slate-200" />
              <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-indigo-600' : 'text-slate-400'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">3</span>
                <span>3. 存储与网络</span>
              </div>
              <div className="w-8 h-[1px] bg-slate-200" />
              <div className={`flex items-center gap-1.5 ${step >= 4 ? 'text-indigo-600' : 'text-slate-400'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">4</span>
                <span>4. 计费模式</span>
              </div>
              <div className="w-8 h-[1px] bg-slate-200" />
              <div className={`flex items-center gap-1.5 ${step >= 5 ? 'text-indigo-600' : 'text-slate-400'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">5</span>
                <span>5. 确认与拉起</span>
              </div>
            </>
          ) : (
            <>
              <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">1</span>
                <span>1. GPU卡型与规格</span>
              </div>
              <div className="w-12 h-[1px] bg-slate-200" />
              <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-indigo-600' : 'text-slate-400'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">2</span>
                <span>2. 场景镜像选择</span>
              </div>
              <div className="w-12 h-[1px] bg-slate-200" />
              <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-indigo-600' : 'text-slate-400'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">3</span>
                <span>3. 计费租赁模式</span>
              </div>
              <div className="w-12 h-[1px] bg-slate-200" />
              <div className={`flex items-center gap-1.5 ${step >= 4 ? 'text-indigo-600' : 'text-slate-400'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">4</span>
                <span>4. 确认创建</span>
              </div>
            </>
          )}
        </div>

        {/* Wizard Main Content Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 text-xs text-slate-800">
          
          {/* STEP 1: Region & Hardware Specs */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="font-extrabold text-slate-900 block mb-2 text-sm">实例名称与使用场景</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={instanceName}
                    onChange={(e) => setInstanceName(e.target.value)}
                    placeholder="例如：my-qwen-finetune-01 (选填)"
                    className="p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-medium"
                  />

                  <div className="flex items-center gap-2">
                    {(['Notebook开发', '文生图', '大模型微调', '推理服务'] as GPUInstance['scene'][]).map(sc => (
                      <button
                        key={sc}
                        type="button"
                        onClick={() => setScene(sc)}
                        className={`flex-1 py-3 px-2 rounded-xl font-bold transition cursor-pointer text-[11px] ${
                          scene === sc ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {sc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-2 text-sm">部署地域 (Region)</label>
                <div className="grid grid-cols-3 gap-3">
                  {['华北 · 北京', '华东 · 上海', '华南 · 广州'].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRegion(r)}
                      className={`p-3.5 rounded-2xl border text-left font-bold transition cursor-pointer flex items-center justify-between ${
                        region === r ? 'border-indigo-600 bg-indigo-50/60 text-indigo-700' : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-indigo-600" />
                        <span>{r}</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-mono">资源充足</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-2 text-sm">GPU 显卡机型选择</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono">
                  {[
                    { model: 'RTX 4090 24GB', vram: '24 GB GDDR6X', cpu: '16 核 56GB', price: '2.90 元/时', badge: '生图/LoRA强推' },
                    { model: 'A100 80GB', vram: '80 GB HBM2e', cpu: '32 核 128GB', price: '25.00 元/时', badge: '百亿大模型训练' },
                    { model: 'V100/A10 24GB', vram: '24 GB HBM2', cpu: '8 核 32GB', price: '8.00 元/时', badge: '性价比推理' },
                    { model: 'RTX 3090 24GB', vram: '24 GB GDDR6', cpu: '12 核 48GB', price: '2.50 元/时', badge: '学生入门卡' },
                    { model: 'T4 16GB', vram: '16 GB GDDR6', cpu: '4 核 16GB', price: '1.25 元/时', badge: '轻量开发' }
                  ].map((gpu) => (
                    <div
                      key={gpu.model}
                      onClick={() => setGpuModel(gpu.model)}
                      className={`p-4 rounded-2xl border cursor-pointer transition relative flex flex-col justify-between space-y-2 ${
                        gpuModel === gpu.model ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20' : 'border-slate-200 bg-white hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center font-sans font-extrabold text-slate-900">
                          <span>{gpu.model}</span>
                          <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200 font-mono">{gpu.badge}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">显存: {gpu.vram} · 搭配: {gpu.cpu}</div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                        <span className="font-bold text-indigo-600 font-sans">{gpu.price}</span>
                        {gpuModel === gpu.model && <Check className="w-4 h-4 text-indigo-600" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-2 text-sm">GPU 卡数选择</label>
                <div className="flex gap-3">
                  {[1, 2, 4, 8].map(cnt => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setGpuCount(cnt)}
                      className={`px-5 py-2.5 rounded-xl font-bold font-mono transition cursor-pointer ${
                        gpuCount === cnt ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {cnt} 卡 ({cnt * 24}GB NVLink)
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: OS & Image */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="font-extrabold text-slate-900 block mb-2 text-sm">镜像来源分类</label>
                <div className="flex gap-2">
                  {(['官方镜像', '社区热门', 'App市场'] as const).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setImageCategory(cat)}
                      className={`px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                        imageCategory === cat ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-2 text-sm">预置环境镜像库</label>
                <div className="space-y-3 font-mono">
                  {[
                    { name: 'PyTorch 2.2.0 + CUDA 12.1 + FlashAttention-2', tag: '基础环境', desc: '官方深度学习框架，内嵌 torchvision, DeepSpeed v0.12 与 JupyterLab' },
                    { name: 'ComfyUI 官方整合包 (Flux.1 & SDXL Base)', tag: '文生图应用', desc: '预装节点与 ControlNet, IP-Adapter, 包含图形管理器与 Web Direct' },
                    { name: 'vLLM v0.4.2 高吞吐大模型推理引擎', tag: '推理服务', desc: '集成 PagedAttention 技术的 LLM 高吞吐 OpenAI API 兼容服务' },
                    { name: 'Ollama + OpenWebUI 离线大模型盒', tag: '私有化部署', desc: '开箱即用的大模型对话平台，支持 Llama 3.3, Qwen2.5 一键挂载' }
                  ].map((img) => (
                    <div
                      key={img.name}
                      onClick={() => setSelectedImage(img.name)}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-4 ${
                        selectedImage === img.name ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20' : 'border-slate-200 bg-white hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 font-sans font-bold text-slate-900 text-sm">
                          <span>{img.name}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-100 text-indigo-700 border border-indigo-200">{img.tag}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-sans mt-1">{img.desc}</p>
                      </div>

                      {selectedImage === img.name && <Check className="w-5 h-5 text-indigo-600 shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Storage & Network (For Server Mode) or Billing (For Container Mode) */}
          {step === 3 && mode === 'server' && (
            <div className="space-y-6">
              <div>
                <label className="font-extrabold text-slate-900 block mb-2 text-sm">系统盘容量 (System Disk)</label>
                <div className="grid grid-cols-3 gap-3">
                  {['40GB SSD', '60GB NVMe', '100GB HighSpeed NVMe'].map(disk => (
                    <button
                      key={disk}
                      type="button"
                      onClick={() => setSystemDisk(disk)}
                      className={`p-3.5 rounded-xl border text-left font-bold transition cursor-pointer ${
                        systemDisk === disk ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {disk}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-2 text-sm">数据持久盘 (Data Disk)</label>
                <div className="grid grid-cols-3 gap-3">
                  {['无数据盘', '200GB NVMe (+¥0.5/h)', '1TB HighSpeed NVMe (+¥2.0/h)'].map(ddisk => (
                    <button
                      key={ddisk}
                      type="button"
                      onClick={() => setDataDisk(ddisk)}
                      className={`p-3.5 rounded-xl border text-left font-bold transition cursor-pointer ${
                        dataDisk === ddisk ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ddisk}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-2 text-sm">公网 IP & 网络带宽</label>
                <div className="grid grid-cols-2 gap-3">
                  {['按固定带宽 (10Mbps)', '按使用流量 (100Mbps 峰值)'].map(net => (
                    <button
                      key={net}
                      type="button"
                      onClick={() => setPublicIpType(net)}
                      className={`p-3.5 rounded-xl border text-left font-bold transition cursor-pointer ${
                        publicIpType === net ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {net}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 for Container or STEP 4 for Server: Billing Selection */}
          {((step === 3 && mode === 'container') || (step === 4 && mode === 'server')) && (
            <div className="space-y-6">
              <div>
                <label className="font-extrabold text-slate-900 block mb-2 text-sm">租赁计费模式选择</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { type: '按量计费', badge: '按秒扣费 / 随时暂停', desc: '灵活度最高，不使用时随时暂停或销毁释放' },
                    { type: '包月', badge: '7折长租优惠', desc: '适合长周期项目训练与持久推理 API 部署' },
                    { type: '抢占式', badge: '低至1.5折起', desc: '利用闲置资源，适合可中断的批量实验计算' }
                  ].map((b) => (
                    <div
                      key={b.type}
                      onClick={() => setBillingType(b.type as GPUInstance['billingType'])}
                      className={`p-4 rounded-2xl border cursor-pointer transition space-y-2 ${
                        billingType === b.type ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20' : 'border-slate-200 bg-white hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex justify-between items-center font-bold text-slate-900">
                        <span>{b.type}</span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 font-mono">{b.badge}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{b.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FINAL STEP: Summary & Confirmation */}
          {step === maxSteps && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 font-mono">
                <div className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-3 font-sans flex items-center justify-between">
                  <span>算力配置订单汇总与确认</span>
                  <span className="text-xs text-indigo-600 font-mono">{mode === 'server' ? '云服务器实例' : '容器实例'}</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
                  <div>
                    <span className="text-slate-400 block text-[10px]">使用场景</span>
                    <span className="font-bold text-slate-900">{scene}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">部署地域</span>
                    <span className="font-bold text-slate-900">{region}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">GPU 算力规格</span>
                    <span className="font-bold text-indigo-600">{gpuModel} × {gpuCount}卡</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">计费租赁模式</span>
                    <span className="font-bold text-amber-600">{billingType}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px]">系统与环境镜像</span>
                    <span className="font-bold text-slate-800">{selectedImage}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">系统盘 / 数据盘</span>
                    <span className="font-bold text-slate-800">{systemDisk} / {dataDisk}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">预估秒级就绪耗时</span>
                    <span className="font-bold text-emerald-600">~ 3.2 秒</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Action Footer Bar */}
        <div className="p-5 border-t border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-slate-400 text-xs">预估费用:</span>
            <span className="text-amber-600 text-lg font-extrabold">¥{totalPrice}</span>
            <span className="text-slate-400 text-xs">/ 小时</span>
          </div>

          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 font-bold text-slate-700 text-xs flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>上一步</span>
              </button>
            )}

            {step < maxSteps ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>下一步</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCompleteCreation}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>立即提交并部署</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
