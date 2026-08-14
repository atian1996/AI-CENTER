import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ModelItem } from '../../types';
import { 
  Play, 
  Scale, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  FileText, 
  Image as ImageIcon, 
  Music, 
  Video, 
  Binary, 
  Info,
  Check,
  Search,
  Sparkles,
  Zap,
  Server
} from 'lucide-react';

export const ModelSquare: React.FC = () => {
  const { 
    models, 
    setTryoutModel, 
    openModelDetail, 
    selectedCompareModels, 
    toggleCompareModel, 
    showToast 
  } = useApp();

  // 1. 左侧多维筛选条件 state (参考截图 1 左侧侧边栏)
  const [selectedAuthor, setSelectedAuthor] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [selectedInputModality, setSelectedInputModality] = useState('all');
  const [selectedContextLength, setSelectedContextLength] = useState('all');

  // 展开更多 collapse 状态
  const [showMoreAuthors, setShowMoreAuthors] = useState(false);
  const [showMoreProviders, setShowMoreProviders] = useState(false);

  // 2. 顶部分类 Tabs state (参考截图 1 顶部按钮: 全部 78, 文本 56, 图像 2, 音频 5, 视频 15, 向量 1)
  const [topTabModality, setTopTabModality] = useState<string>('all');

  // 动态数据源
  const authorsList = [
    'Alibaba', 'ByteDance', 'DeepSeek', 'JinaAI', 'Minimax', 'MoonshotAI', 'Qwen', 'Z.ai', 'Google', 'BAAI'
  ];
  const providersList = [
    '阿里云', '阿里云百炼', '百度千帆', '百度智能云', '捷查', '腾讯云', '火山引擎'
  ];

  // 过滤函数
  const filteredModels = models.filter(m => {
    if (selectedAuthor !== 'all' && m.author !== selectedAuthor && m.vendor !== selectedAuthor) return false;
    if (selectedProvider !== 'all' && !m.providerList?.includes(selectedProvider)) return false;
    if (selectedInputModality !== 'all' && !m.inputModalities?.includes(selectedInputModality) && m.typeTag !== selectedInputModality) return false;
    
    if (selectedContextLength !== 'all') {
      if (selectedContextLength === '200K+') {
        const is200KPlus = m.contextLength.includes('200K') || 
                           m.contextLength.includes('256K') || 
                           m.contextLength.includes('1.0M') || 
                           m.contextLength.includes('1M') ||
                           m.contextLength.includes('50素材') ||
                           m.contextLength.includes('50个素材') ||
                           m.contextLength.includes('500K');
        if (!is200KPlus) return false;
      } else if (selectedContextLength === '128K+') {
        const is128KPlus = m.contextLength.includes('128K') || 
                           m.contextLength.includes('200K') || 
                           m.contextLength.includes('256K') || 
                           m.contextLength.includes('1.0M') || 
                           m.contextLength.includes('1M');
        if (!is128KPlus) return false;
      } else if (selectedContextLength === '32K+') {
        const is32KPlus = m.contextLength.includes('32K') || 
                          m.contextLength.includes('128K') || 
                          m.contextLength.includes('200K') || 
                          m.contextLength.includes('256K') || 
                          m.contextLength.includes('1.0M') || 
                          m.contextLength.includes('1M');
        if (!is32KPlus) return false;
      } else if (selectedContextLength === '8K+') {
        const is8KPlus = m.contextLength.includes('8.0K') || 
                         m.contextLength.includes('8K') || 
                         m.contextLength.includes('32K') || 
                         m.contextLength.includes('128K') || 
                         m.contextLength.includes('200K') || 
                         m.contextLength.includes('256K') || 
                         m.contextLength.includes('1.0M') || 
                         m.contextLength.includes('1M');
        if (!is8KPlus) return false;
      }
    }

    if (topTabModality !== 'all') {
      if (topTabModality === '文本' && m.typeTag !== '文本') return false;
      if (topTabModality === '图像' && m.typeTag !== '图像') return false;
      if (topTabModality === '视频' && m.typeTag !== '视频') return false;
      if (topTabModality === '音频' && m.typeTag !== '音频') return false;
      if (topTabModality === '向量' && m.typeTag !== 'Embedding' && m.typeTag !== '向量') return false;
    }

    return true;
  });

  // 各分类统计数量
  const textCount = models.filter(m => m.typeTag === '文本').length;
  const imageCount = models.filter(m => m.typeTag === '图像').length;
  const videoCount = models.filter(m => m.typeTag === '视频').length;
  const audioCount = models.filter(m => m.typeTag === '音频').length;
  const vectorCount = models.filter(m => m.typeTag === 'Embedding' || m.typeTag === '向量').length;

  return (
    <div className="flex flex-col lg:flex-row gap-6 select-none items-start">
      
      {/* 1. 左侧多维筛选侧边栏 Panel (统一高质感 Slate 卡片) */}
      <div className="w-full lg:w-60 bg-white rounded-2xl border border-slate-200/80 p-4 shrink-0 space-y-5 text-xs shadow-2xs font-medium">
        
        {/* 作者 Author Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-slate-900 font-extrabold text-xs">
            <span>作者</span>
            {selectedAuthor !== 'all' && (
              <button onClick={() => setSelectedAuthor('all')} className="text-[10px] text-indigo-600 hover:text-indigo-700 font-bold hover:underline cursor-pointer">
                重置
              </button>
            )}
          </div>

          <div className="space-y-1 text-slate-600">
            <button
              onClick={() => setSelectedAuthor('all')}
              className={`w-full text-left py-1.5 px-2.5 rounded-xl transition cursor-pointer flex items-center justify-between ${
                selectedAuthor === 'all' ? 'bg-indigo-50/80 text-indigo-700 font-extrabold' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span>全部</span>
              {selectedAuthor === 'all' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
            </button>
            {(showMoreAuthors ? authorsList : authorsList.slice(0, 6)).map(author => (
              <button
                key={author}
                onClick={() => setSelectedAuthor(author)}
                className={`w-full text-left py-1.5 px-2.5 rounded-xl transition cursor-pointer truncate flex items-center justify-between ${
                  selectedAuthor === author ? 'bg-indigo-50/80 text-indigo-700 font-extrabold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="truncate">{author}</span>
                {selectedAuthor === author && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
              </button>
            ))}

            <button
              onClick={() => setShowMoreAuthors(!showMoreAuthors)}
              className="text-[11px] text-slate-400 hover:text-slate-700 py-1 px-2.5 flex items-center gap-1 cursor-pointer font-bold transition"
            >
              {showMoreAuthors ? (
                <>收起 <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>+12 更多作者 <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          </div>
        </div>

        <div className="h-px bg-slate-100"></div>

        {/* 服务商 Provider Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-slate-900 font-extrabold text-xs">
            <span>服务商</span>
            {selectedProvider !== 'all' && (
              <button onClick={() => setSelectedProvider('all')} className="text-[10px] text-indigo-600 hover:text-indigo-700 font-bold hover:underline cursor-pointer">
                重置
              </button>
            )}
          </div>

          <div className="space-y-1 text-slate-600">
            <button
              onClick={() => setSelectedProvider('all')}
              className={`w-full text-left py-1.5 px-2.5 rounded-xl transition cursor-pointer flex items-center justify-between ${
                selectedProvider === 'all' ? 'bg-indigo-50/80 text-indigo-700 font-extrabold' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span>全部</span>
              {selectedProvider === 'all' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
            </button>
            {(showMoreProviders ? providersList : providersList.slice(0, 5)).map(provider => (
              <button
                key={provider}
                onClick={() => setSelectedProvider(provider)}
                className={`w-full text-left py-1.5 px-2.5 rounded-xl transition cursor-pointer truncate flex items-center justify-between ${
                  selectedProvider === provider ? 'bg-indigo-50/80 text-indigo-700 font-extrabold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="truncate">{provider}</span>
                {selectedProvider === provider && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
              </button>
            ))}

            <button
              onClick={() => setShowMoreProviders(!showMoreProviders)}
              className="text-[11px] text-slate-400 hover:text-slate-700 py-1 px-2.5 flex items-center gap-1 cursor-pointer font-bold transition"
            >
              {showMoreProviders ? (
                <>收起 <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>+16 更多服务商 <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          </div>
        </div>

        <div className="h-px bg-slate-100"></div>

        {/* 输入模态 Input Modality Filter */}
        <div className="space-y-2">
          <div className="text-slate-900 font-extrabold text-xs">输入模态</div>
          <div className="space-y-1 text-slate-600">
            {['all', '文本', '图像', '音频', '视频', '向量'].map(mod => (
              <button
                key={mod}
                onClick={() => setSelectedInputModality(mod)}
                className={`w-full text-left py-1.5 px-2.5 rounded-xl transition cursor-pointer flex items-center justify-between ${
                  selectedInputModality === mod ? 'bg-indigo-50/80 text-indigo-700 font-extrabold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span>{mod === 'all' ? '全部模态' : mod}</span>
                {selectedInputModality === mod && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-slate-100"></div>

        {/* 上下文长度 Context Length Filter */}
        <div className="space-y-2">
          <div className="text-slate-900 font-extrabold text-xs">上下文长度</div>
          <div className="space-y-1 text-slate-600">
            {['all', '8K+', '32K+', '128K+', '200K+'].map(ctx => (
              <button
                key={ctx}
                onClick={() => setSelectedContextLength(ctx)}
                className={`w-full text-left py-1.5 px-2.5 rounded-xl transition cursor-pointer flex items-center justify-between ${
                  selectedContextLength === ctx ? 'bg-indigo-50/80 text-indigo-700 font-extrabold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span>{ctx === 'all' ? '全部长度' : ctx}</span>
                {selectedContextLength === ctx && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 2. 右侧主框架 Area */}
      <div className="flex-1 space-y-5 w-full">
        
        {/* Top Pills Tabs (精细 Indigo 主色配合与阴影效果) */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-extrabold">
            {[
              { id: 'all', label: '全部', count: models.length, icon: Layers },
              { id: '文本', label: '文本', count: textCount, icon: FileText },
              { id: '图像', label: '图像', count: imageCount, icon: ImageIcon },
              { id: '音频', label: '音频', count: audioCount, icon: Music },
              { id: '视频', label: '视频', count: videoCount, icon: Video },
              { id: '向量', label: '向量', count: vectorCount, icon: Binary },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = topTabModality === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTopTabModality(tab.id)}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-black'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-bold'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-indigo-500/30 text-white' : 'bg-slate-200/60 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 font-medium px-3">
            符合条件模型：<span className="text-indigo-600 font-extrabold font-mono text-sm">{filteredModels.length}</span> 款
          </div>
        </div>

        {/* Model Cards Grid Matrix (双列精细卡片) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredModels.map(m => {
            const isCompared = selectedCompareModels.some(cm => cm.id === m.id);

            return (
              <div
                key={m.id}
                onClick={() => openModelDetail(m)}
                className="group rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 p-5 shadow-2xs hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
              >
                <div>
                  {/* Card Header: Brand Icon + Title + Tokens Usage Badge */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                        {m.vendor.slice(0, 1)}
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {m.vendor}: {m.name}
                      </h3>
                    </div>

                    <span className="text-[11px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg font-medium shrink-0 border border-slate-200/60">
                      {m.totalTokensUsed || '1.11B tokens'}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 font-medium mb-4 h-9">
                    {m.description}
                  </p>

                  {/* Specs Pill Bar */}
                  <div className={`p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center text-[11px] font-mono mb-4 ${m.contextLength ? 'justify-between' : 'justify-end'}`}>
                    {m.contextLength && (
                      <div className="text-slate-700 font-bold flex items-center gap-1">
                        <span className="text-indigo-600">{m.contextLength}</span>
                        <span className="text-slate-400 font-normal">context</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      {m.typeTag === '图像' ? (
                        <>
                          <span className="text-slate-500">
                            输出 <strong className="text-emerald-600 font-bold">{m.priceOutput}</strong>
                          </span>
                          <span className="text-slate-500">
                            输入 <strong className="text-emerald-600 font-bold">{m.priceInput}</strong>
                          </span>
                        </>
                      ) : m.typeTag === '视频' ? (
                        <>
                          <span className="text-slate-500">
                            <strong className="text-emerald-600 font-bold">{m.priceInput}</strong>
                          </span>
                          <span className="text-slate-500">
                            <strong className="text-emerald-600 font-bold">{m.priceOutput}</strong>
                          </span>
                        </>
                      ) : m.typeTag === '音频' ? (
                        <>
                          {m.priceInput !== '免费' && (
                            <span className="text-slate-500">
                              输入 <strong className="text-emerald-600 font-bold">{m.priceInput}</strong>
                            </span>
                          )}
                          <span className="text-slate-500">
                            输出 <strong className="text-emerald-600 font-bold">{m.priceOutput}</strong>
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-slate-500">
                            输入 <strong className="text-emerald-600 font-bold">{m.priceInput}</strong>
                          </span>
                          <span className="text-slate-500">
                            输出 <strong className="text-emerald-600 font-bold">{m.priceOutput}</strong>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};

