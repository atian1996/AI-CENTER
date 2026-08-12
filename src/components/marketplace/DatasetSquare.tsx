import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DatasetItem } from '../../types';
import { 
  Database, 
  Download, 
  Eye, 
  Sparkles, 
  FileSpreadsheet, 
  Lock, 
  Globe, 
  Filter,
  X,
  Table
} from 'lucide-react';

export const DatasetSquare: React.FC = () => {
  const { datasets, showToast } = useApp();

  const [dataTypeFilter, setDataTypeFilter] = useState('all');
  const [selectedDataset, setSelectedDataset] = useState<DatasetItem | null>(null);

  const filteredDatasets = datasets.filter(d => {
    if (dataTypeFilter !== 'all' && d.dataType !== dataTypeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 select-none">
      
      {/* Top Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-slate-800">数据模态筛选:</span>
          <div className="flex items-center gap-1.5 ml-2">
            {['all', '文本', '图像/视觉', '音频/语音', '多模态对话'].map(type => (
              <button
                key={type}
                onClick={() => setDataTypeFilter(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  dataTypeFilter === type
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {type === 'all' ? '全部模态' : type}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          共收录 <span className="font-bold text-emerald-600">{filteredDatasets.length}</span> 个高质量开源/优质数据集
        </div>
      </div>

      {/* Dataset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDatasets.map(ds => (
          <div
            key={ds.id}
            className="group rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 p-6 shadow-xs hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 ${
                  ds.license === 'CC-BY-4.0' || ds.license === 'MIT' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                }`}>
                  {ds.license}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mb-1">
                {ds.name}
              </h3>

              <div className="text-xs text-slate-400 mb-3 font-medium">
                上传者: {ds.author} · 格式: {ds.format}
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                {ds.description}
              </p>

              {/* Stats pill */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs mb-4">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>文件大小:</span>
                  <span className="font-mono font-bold text-slate-900">{ds.size}</span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>总记录条数:</span>
                  <span className="font-mono font-bold text-slate-900">{ds.rowsCount}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedDataset(ds)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" /> 样例预览
              </button>

              <button
                onClick={() => showToast(`正在打包下载数据集【${ds.name}】...`)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> 免费下载
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dataset Preview Modal */}
      {selectedDataset && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <Table className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">数据字段预览: {selectedDataset.name}</h3>
                  <div className="text-xs text-slate-500 font-mono">{selectedDataset.format} · {selectedDataset.rowsCount}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedDataset(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-medium leading-relaxed">
                {selectedDataset.description}
              </div>

              <div className="font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" /> 前 3 条样本数据切片示例:
              </div>

              <pre className="p-4 rounded-xl bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed">
{selectedDataset.sampleRows ? JSON.stringify(selectedDataset.sampleRows, null, 2) : `[
  { "id": 1001, "instruction": "设计一个高可用分布架构...", "response": "首先需要实现多节点冗余..." },
  { "id": 1002, "instruction": "优化SQL慢查询...", "response": "通过 EXPLAIN 分析索引覆盖..." }
]`}
              </pre>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedDataset(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  showToast(`开始下载【${selectedDataset.name}】完整压缩包`);
                  setSelectedDataset(null);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" /> 立即打包下载
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
