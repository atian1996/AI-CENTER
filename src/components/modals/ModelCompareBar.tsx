import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Cpu, X, Scale, ArrowRight } from 'lucide-react';

export const ModelCompareBar: React.FC = () => {
  const { selectedCompareModels, toggleCompareModel, clearCompareModels } = useApp();
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  if (selectedCompareModels.length === 0) return null;

  return (
    <>
      {/* Bottom Floating Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] animate-bounce-short select-none">
        <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white border border-cyan-300 shadow-2xl backdrop-blur-md text-xs text-slate-800 font-medium">
          <div className="flex items-center gap-2 font-bold text-cyan-700">
            <Scale className="w-4 h-4" />
            已选择 {selectedCompareModels.length} 个对比模型:
          </div>

          <div className="flex items-center gap-2">
            {selectedCompareModels.map(m => (
              <span key={m.id} className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 flex items-center gap-1.5 font-bold text-slate-800">
                {m.name}
                <button onClick={() => toggleCompareModel(m)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
            <button
              onClick={() => setCompareModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <span>开始横向对比</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button onClick={clearCompareModels} className="text-slate-500 hover:text-slate-800 cursor-pointer">
              清空
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in select-none">
          <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-5 text-xs text-slate-700 font-medium">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                <Scale className="w-5 h-5 text-cyan-600" />
                大模型多维度指标横向测评对比
              </div>
              <button onClick={() => setCompareModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="p-3 font-bold text-slate-500 w-36">对比维指标</th>
                    {selectedCompareModels.map(m => (
                      <th key={m.id} className="p-3 font-extrabold text-slate-900 text-sm">
                        {m.name} ({m.vendor})
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-bold text-slate-500">上下文窗口 (Context)</td>
                    {selectedCompareModels.map(m => (
                      <td key={m.id} className="p-3 font-mono font-bold text-cyan-600">{m.contextLength}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-500">输入价格 (Input)</td>
                    {selectedCompareModels.map(m => (
                      <td key={m.id} className="p-3 font-mono font-bold text-amber-600">{m.priceInput}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-500">输出价格 (Output)</td>
                    {selectedCompareModels.map(m => (
                      <td key={m.id} className="p-3 font-mono font-bold text-amber-600">{m.priceOutput}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-500">平均延迟 (Latency)</td>
                    {selectedCompareModels.map(m => (
                      <td key={m.id} className="p-3 font-mono font-bold text-emerald-600">{m.latencyMs} ms</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-500">基准测试 Benchmark</td>
                    {selectedCompareModels.map(m => (
                      <td key={m.id} className="p-3 space-y-1">
                        {m.benchmarks.map((b, idx) => (
                          <div key={idx} className="flex justify-between text-[11px] font-mono">
                            <span className="text-slate-500">{b.name}:</span>
                            <span className="font-bold text-indigo-600">{b.score}%</span>
                          </div>
                        ))}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
