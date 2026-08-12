import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockHistoryInstances } from '../../data/mockData';
import { X, History, Save, FileSpreadsheet, Download, RefreshCw } from 'lucide-react';

export const ComputeHistoryModal: React.FC = () => {
  const { historyModalOpen, setHistoryModalOpen, showToast, launchGpuInstance } = useApp();
  const [activeTab, setActiveTab] = useState<'history' | 'snapshots' | 'export'>('history');

  if (!historyModalOpen) return null;

  const handleReLaunch = (item: typeof mockHistoryInstances[0]) => {
    launchGpuInstance(item.scene, item.gpuModel, item.imageName, {
      instanceType: item.instanceType,
      region: item.region,
      billingType: item.billingType
    });
    setHistoryModalOpen(false);
  };

  const handleExportCSV = () => {
    showToast('已生成并下载 2026年8月 算力消费明细账单 (CSV)');
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[75vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">算力历史记录与费用明细</h3>
              <p className="text-[11px] text-slate-500 font-medium">查看已销毁实例、环境镜像快照与历史总流水</p>
            </div>
          </div>

          <button
            onClick={() => setHistoryModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-6 text-xs font-bold text-slate-600 gap-4">
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>已销毁/过期实例 ({mockHistoryInstances.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('snapshots')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'snapshots' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>环境快照库 (1)</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'export' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>费用明细与账单导出</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 text-xs">
          {activeTab === 'history' && (
            <div className="space-y-3 font-medium">
              {mockHistoryInstances.map((item) => (
                <div key={item.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{item.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        {item.instanceType === 'server' ? '云服务器' : '容器'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">
                        已销毁
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono mt-1 space-x-3">
                      <span>卡型: {item.gpuModel} × {item.gpuCount}</span>
                      <span>运行: {item.runningHours}h</span>
                      <span>费用: ¥{item.totalCost.toFixed(2)}</span>
                      <span>创建于: {item.createdAt}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleReLaunch(item)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>按此配置重新拉起</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'snapshots' && (
            <div className="space-y-3 font-medium">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-slate-900 text-sm">my-llama-v1-snapshot</div>
                  <p className="text-slate-500 text-[11px] mt-0.5">描述: 包含完整训练依赖与 DeepSpeed v0.12 架构组件</p>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    容量: 18.4 GB · 创建时间: 2026-08-10 18:00
                  </div>
                </div>

                <button
                  onClick={() => {
                    launchGpuInstance('大模型微调', 'A100 80GB', 'my-llama-v1-snapshot (自定义镜像)');
                    setHistoryModalOpen(false);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1 cursor-pointer"
                >
                  从快照拉起实例
                </button>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 font-medium">
              <div className="font-extrabold text-slate-900 text-sm">月度费用总结与账单导出</div>
              
              <div className="grid grid-cols-3 gap-4 font-mono">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-400 text-[10px] font-sans">2026年8月总时长</div>
                  <div className="text-slate-900 font-bold text-base mt-1">12.5 小时</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-400 text-[10px] font-sans">本月累计花费</div>
                  <div className="text-amber-600 font-bold text-base mt-1">¥89.00 元</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-400 text-[10px] font-sans">已省优惠金额</div>
                  <div className="text-emerald-600 font-bold text-base mt-1">¥24.50 元</div>
                </div>
              </div>

              <button
                onClick={handleExportCSV}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>导出月度 CSV 消费对账单</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
