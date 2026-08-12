import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ModelItem } from '../../types';
import { 
  Cpu, 
  Play, 
  Sparkles, 
  Scale, 
  Zap, 
  Send, 
  X, 
  Check, 
  Code2, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const ModelSquare: React.FC = () => {
  const { 
    models, 
    tryoutModel, 
    setTryoutModel, 
    selectedCompareModels, 
    toggleCompareModel, 
    clearCompareModels,
    showToast
  } = useApp();

  const [vendorFilter, setVendorFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [compareDrawerOpen, setCompareDrawerOpen] = useState(false);

  // Model Tryout Dialog state
  const [tryoutPrompt, setTryoutPrompt] = useState('');
  const [tryoutResponse, setTryoutResponse] = useState('');
  const [tryoutLoading, setTryoutLoading] = useState(false);

  const vendors = ['all', 'Google DeepMind', 'DeepSeek 深度求索', '阿里云 通义千问', 'Black Forest Labs', '智源研究院 BAAI'];
  const types = ['all', '文本', '图像', 'Embedding'];

  const filteredModels = models.filter(m => {
    if (vendorFilter !== 'all' && m.vendor !== vendorFilter) return false;
    if (typeFilter !== 'all' && m.typeTag !== typeFilter) return false;
    return true;
  });

  const handleRunTryout = async () => {
    if (!tryoutPrompt.trim() || tryoutLoading) return;
    setTryoutLoading(true);
    setTryoutResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: tryoutPrompt,
          model: tryoutModel?.name.includes('Gemini') ? 'gemini-3.6-flash' : 'gemini-3.6-flash'
        })
      });
      const data = await res.json();
      setTryoutResponse(data.text || '完成');
    } catch {
      setTryoutResponse('模型体验调用超时，请稍后重试。');
    } finally {
      setTryoutLoading(false);
    }
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Top Filter Bar & Compare Entry */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Vendor Filter */}
          <select
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
            className="bg-slate-50 text-slate-800 border border-slate-200 font-bold rounded-xl px-3 py-1.5 text-xs outline-none cursor-pointer focus:bg-white"
          >
            <option value="all">全部厂商</option>
            {vendors.filter(v => v !== 'all').map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 text-slate-800 border border-slate-200 font-bold rounded-xl px-3 py-1.5 text-xs outline-none cursor-pointer focus:bg-white"
          >
            <option value="all">全部模态</option>
            {types.filter(t => t !== 'all').map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Compare Models Floating Action */}
        <div className="flex items-center gap-3">
          {selectedCompareModels.length > 0 && (
            <button
              onClick={() => setCompareDrawerOpen(true)}
              className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-xs flex items-center gap-2 animate-bounce-short cursor-pointer"
            >
              <Scale className="w-4 h-4" />
              <span>并列对比模型 ({selectedCompareModels.length}/3)</span>
            </button>
          )}
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map(m => {
          const isCompared = selectedCompareModels.some(cm => cm.id === m.id);

          return (
            <div
              key={m.id}
              className="group rounded-2xl bg-white border border-slate-200/80 hover:border-cyan-400 p-6 shadow-xs hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                      {m.name}
                    </h3>
                    <div className="text-xs text-slate-400 font-medium mt-0.5">{m.vendor}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-200 shrink-0">
                    {m.typeTag}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {m.description}
                </p>

                {/* Specs Box */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs mb-4">
                  <div className="flex items-center justify-between text-slate-600 font-medium">
                    <span>上下文长度:</span>
                    <span className="text-slate-900 font-mono font-bold">{m.contextLength}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 font-medium">
                    <span>计费价格 (输入/输出):</span>
                    <span className="text-amber-700 font-mono font-bold">{m.priceInput}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 font-medium">
                    <span>典型响应延迟:</span>
                    <span className="text-emerald-700 font-mono font-bold">~{m.latencyMs} ms</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {m.tags.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleCompareModel(m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1 cursor-pointer ${
                    isCompared
                      ? 'bg-cyan-50 text-cyan-700 border-cyan-300'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  {isCompared ? '已加入对比' : '对比'}
                </button>

                <button
                  onClick={() => {
                    setTryoutModel(m);
                    setTryoutPrompt('');
                    setTryoutResponse('');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" /> 在线体验
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Model Tryout Dialog Modal */}
      {tryoutModel && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">在线调用体验: {tryoutModel.name}</h3>
                  <div className="text-[11px] text-slate-500 font-medium">{tryoutModel.vendor} · {tryoutModel.contextLength}</div>
                </div>
              </div>
              <button
                onClick={() => setTryoutModel(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-800 font-bold">输入体验 Prompt 测试文本：</label>
                <textarea
                  rows={3}
                  value={tryoutPrompt}
                  onChange={(e) => setTryoutPrompt(e.target.value)}
                  placeholder="例如：请用一段优雅的 Python 代码示范如何实现 LRU 缓存逻辑..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-cyan-500 font-medium"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleRunTryout}
                  disabled={tryoutLoading}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{tryoutLoading ? '模型生成中...' : '发送请求体验'}</span>
                </button>
              </div>

              {tryoutResponse && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="text-slate-700 font-bold flex items-center gap-1.5 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600" /> 模型输出响应:
                  </div>
                  <div className="text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                    {tryoutResponse}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Model Comparison Drawer / Modal */}
      {compareDrawerOpen && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                <Scale className="w-5 h-5 text-cyan-600" />
                模型能力指标多维对比
              </div>
              <button
                onClick={() => setCompareDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {selectedCompareModels.map(m => (
                <div key={m.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="border-b border-slate-200 pb-3">
                    <div className="text-sm font-black text-cyan-700">{m.name}</div>
                    <div className="text-slate-500 font-medium mt-0.5">{m.vendor}</div>
                  </div>

                  <div className="space-y-2 text-slate-700 font-medium">
                    <div className="flex justify-between">
                      <span className="text-slate-500">模态类型</span>
                      <span className="font-bold">{m.typeTag}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">上下文</span>
                      <span className="font-mono font-bold text-slate-900">{m.contextLength}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">输入价格</span>
                      <span className="font-mono text-amber-700 font-bold">{m.priceInput}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">典型延迟</span>
                      <span className="font-mono text-emerald-700 font-bold">{m.latencyMs} ms</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-3">
                    <div className="text-[11px] font-bold text-slate-500 mb-2">基准 Benchmark:</div>
                    <div className="space-y-1">
                      {m.benchmarks.map((b, idx) => (
                        <div key={idx} className="flex justify-between text-[11px]">
                          <span className="text-slate-500">{b.name}</span>
                          <span className="font-mono text-cyan-700 font-bold">{b.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={clearCompareModels}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium"
              >
                清空所有对比项
              </button>
              <button
                onClick={() => setCompareDrawerOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
              >
                完成对比
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
