import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DatasetItem } from '../../types';
import { DatasetDetail } from './DatasetDetail';
import { motion, AnimatePresence } from 'motion/react';
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
  Table,
  Search,
  Grid,
  List,
  Heart,
  Bookmark,
  Calendar,
  Layers,
  ArrowUpDown,
  HardDrive,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  FolderOpen,
  RotateCcw,
  ChevronDown,
  Flame
} from 'lucide-react';

export const DatasetSquare: React.FC = () => {
  const { datasets, showToast } = useApp();

  // Selected dataset for viewing details
  const [activeDetailDataset, setActiveDetailDataset] = useState<DatasetItem | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModality, setSelectedModality] = useState<string>('all');
  const [selectedTaskType, setSelectedTaskType] = useState<string>('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedLicense, setSelectedLicense] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mountedOnly, setMountedOnly] = useState<boolean>(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);

  const activeFiltersCount = 
    (selectedTaskType !== 'all' ? 1 : 0) + 
    (selectedDomain !== 'all' ? 1 : 0) + 
    (selectedFormat !== 'all' ? 1 : 0) + 
    (mountedOnly ? 1 : 0);

  const handleResetFilters = () => {
    setSelectedModality('all');
    setSelectedTaskType('all');
    setSelectedDomain('all');
    setSelectedFormat('all');
    setMountedOnly(false);
    setSearchQuery('');
  };

  // Filter Categories
  const modalityList = [
    { key: 'all', label: '全部模态' },
    { key: '表格', label: '表格数据' },
    { key: '计算机视觉', label: '计算机视觉' },
    { key: '自然语言处理', label: '自然语言处理' },
    { key: '多模态', label: '多模态' },
    { key: '音频', label: '音频/语音' }
  ];

  const taskTypeList = [
    { key: 'all', label: '全部任务' },
    { key: '表格回归', label: '表格回归' },
    { key: '表格分类', label: '表格分类' },
    { key: '时间序列预测', label: '时间序列预测' },
    { key: '物体检测', label: '物体检测' },
    { key: '图像分类', label: '图像分类' },
    { key: '文本生成', label: '文本生成' },
    { key: '问答', label: '问答' },
    { key: '图像描述', label: '图像描述' },
    { key: '无条件图像生成', label: '无条件图像生成' }
  ];

  const domainList = [
    { key: 'all', label: '全部领域' },
    { key: '商业', label: '商业' },
    { key: '电商', label: '电商' },
    { key: '科技互联网', label: '科技互联网' },
    { key: '经济', label: '经济' },
    { key: '地球气象', label: '地球气象' },
    { key: '地理遥感', label: '地理遥感' },
    { key: '医疗健康', label: '医疗健康' },
    { key: '数理逻辑', label: '数理逻辑' },
    { key: '金融科技', label: '金融科技' },
    { key: '教育科学', label: '教育科学' }
  ];

  const formatList = [
    { key: 'all', label: '全部格式' },
    { key: 'CSV', label: 'CSV / XLSX' },
    { key: 'JSON', label: 'JSON / JSONL' },
    { key: 'NC', label: 'NC / GeoTIFF' },
    { key: 'PNG', label: 'PNG / JPG' }
  ];

  // Filtering Logic
  const filteredDatasets = datasets.filter(ds => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = ds.name.toLowerCase().includes(q);
      const matchAuthor = (ds.author || '').toLowerCase().includes(q);
      const matchRepo = (ds.repoPath || '').toLowerCase().includes(q);
      const matchDesc = (ds.description || '').toLowerCase().includes(q);
      const matchTags = (ds.domainTags || []).some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchAuthor && !matchRepo && !matchDesc && !matchTags) return false;
    }

    // Modality filter
    if (selectedModality !== 'all' && ds.modalityCategory !== selectedModality) {
      return false;
    }

    // Task Type filter
    if (selectedTaskType !== 'all' && ds.taskType !== selectedTaskType) {
      return false;
    }

    // Domain filter
    if (selectedDomain !== 'all') {
      const hasDomain = (ds.domainTags || []).includes(selectedDomain) || 
                        ds.theme === selectedDomain || 
                        ds.industry === selectedDomain;
      if (!hasDomain) return false;
    }

    // Format filter
    if (selectedFormat !== 'all') {
      const form = (ds.fileFormats || ds.format || '').toUpperCase();
      if (!form.includes(selectedFormat.toUpperCase())) return false;
    }

    // License filter
    if (selectedLicense !== 'all' && !ds.license.includes(selectedLicense)) {
      return false;
    }

    // Mounted only toggle
    if (mountedOnly && !ds.isMounted) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'updated') return (b.updatedAt || '').localeCompare(a.updatedAt || '');
    if (sortBy === 'downloads') return (b.downloadCount || 0) - (a.downloadCount || 0);
    if (sortBy === 'views') return (b.viewsCount || 0) - (a.viewsCount || 0);
    if (sortBy === 'likes') return (b.likesCount || 0) - (a.likesCount || 0);
    return 0;
  });

  // If Detail View is active, render Detail Component directly
  if (activeDetailDataset) {
    return (
      <DatasetDetail 
        dataset={activeDetailDataset} 
        onBack={() => setActiveDetailDataset(null)} 
      />
    );
  }

  return (
    <div className="space-y-6 select-none animate-fade-in pb-12 w-full">
      
      {/* 统一的单行控制检索面板 (Control Row) */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs relative z-10">
        
        {/* 左侧搜索框 */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索数据集名称、作者、格式、领域标签..."
            className="w-full pl-10 pr-16 py-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100/50 shadow-2xs transition-all duration-300"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
            >
              清空
            </button>
          )}
        </div>

        {/* 排序、过滤、视图模式组合 */}
        <div className="flex flex-wrap items-center justify-between w-full md:w-auto gap-3 shrink-0">
          
          {/* 高级过滤按钮 */}
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 cursor-pointer ${
              isAdvancedOpen || activeFiltersCount > 0
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-2xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>高级过滤</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* 排序下拉 */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold outline-none cursor-pointer hover:bg-slate-50 appearance-none pr-8 shadow-2xs"
            >
              <option value="recommended">推荐排序</option>
              <option value="downloads">下载最多</option>
              <option value="views">访问最多</option>
              <option value="likes">点赞最多</option>
              <option value="updated">最新更新</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>

          {/* 视图模式切换 */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-3xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="网格视图"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-indigo-600 shadow-3xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="列表视图"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 热门场景快捷分类圆角胶囊推荐 (Modality Capsules Row) */}
      <div className="flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-none no-scrollbar w-full">
        <span className="text-xs text-slate-400 font-extrabold shrink-0 mr-1.5 flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-indigo-500 fill-indigo-100" /> 推荐模态:
        </span>
        {modalityList.map(item => {
          const isActive = selectedModality === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setSelectedModality(item.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-tight transition-all shrink-0 cursor-pointer border ${
                isActive
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200/80 shadow-3xs'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* 丝滑动效高级过滤面板 (Advanced Filters Drawer) */}
      <AnimatePresence>
        {isAdvancedOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              
              {/* 任务类型 */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 shrink-0 w-20 pt-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                  <span>任务类型:</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 flex-1">
                  {taskTypeList.map(item => (
                    <button
                      key={item.key}
                      onClick={() => setSelectedTaskType(item.key)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        selectedTaskType === item.key
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-3xs'
                          : 'bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 行业领域 */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 shrink-0 w-20 pt-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>行业领域:</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 flex-1">
                  {domainList.map(item => (
                    <button
                      key={item.key}
                      onClick={() => setSelectedDomain(item.key)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        selectedDomain === item.key
                          ? 'bg-purple-50 border-purple-200 text-purple-700 shadow-3xs'
                          : 'bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 文件格式 */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 shrink-0 w-20 pt-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                  <span>文件格式:</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 flex-1">
                  {formatList.map(item => (
                    <button
                      key={item.key}
                      onClick={() => setSelectedFormat(item.key)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        selectedFormat === item.key
                          ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-3xs'
                          : 'bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 挂载状态与重置操作 */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
                
                {/* 挂载过滤 */}
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-slate-700">状态过滤:</span>
                  <button
                    onClick={() => setMountedOnly(!mountedOnly)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      mountedOnly
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-3xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    仅看已挂载到工作台
                  </button>
                </div>

                {/* 重置筛选按钮 */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 font-bold transition cursor-pointer animate-fade-in"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>重置所有过滤</span>
                  </button>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dataset List Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <div>
          找到 <span className="font-extrabold text-blue-600">{filteredDatasets.length}</span> 个符合条件的数据集
        </div>
        <div className="text-[11px] text-slate-400">
          点击任意数据集卡片可查看【概述 / 文件预览 / 评论】详情
        </div>
      </div>

      {/* Datasets View (Grid / List) */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatasets.map(ds => (
            <div
              key={ds.id}
              onClick={() => setActiveDetailDataset(ds)}
              className="group rounded-3xl bg-white border border-slate-200/80 hover:border-blue-300 p-6 shadow-xs hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
            >
              <div className="space-y-3">
                
                {/* Header: Repo Path & Modality Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="text-xs font-mono text-slate-500 font-bold truncate max-w-[200px]">
                    {ds.repoPath || `${ds.author}/${ds.id}`}
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80 shrink-0">
                    {ds.modalityCategory || '表格'}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                  {ds.name}
                </h3>

                {/* Author Info & Date */}
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <img
                    src={ds.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={ds.author}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span className="font-bold text-slate-700">{ds.author}</span>
                  <span>·</span>
                  <span>{ds.relativeTime || ds.updatedAt}</span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                  {ds.description}
                </p>

                {/* Domain Tags */}
                {ds.domainTags && ds.domainTags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 pt-1">
                    {ds.domainTags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold"
                      >
                        #{tag}
                      </span>
                    ))}
                    {ds.domainTags.length > 3 && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        +{ds.domainTags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer: Metrics & Direct Action */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ds.viewsCount ?? 72}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ds.downloadCount ?? 9}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span>{ds.likesCount ?? 0}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-slate-700">
                    {ds.fileSize || ds.scale || '267 MB'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition group-hover:translate-x-0.5" />
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-black border-b border-slate-200">
              <tr>
                <th className="p-4">数据集名称与仓库</th>
                <th className="p-4">模态 / 任务</th>
                <th className="p-4">作者 / 机构</th>
                <th className="p-4">文件大小</th>
                <th className="p-4">浏览 / 下载</th>
                <th className="p-4">更新时间</th>
                <th className="p-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredDatasets.map(ds => (
                <tr
                  key={ds.id}
                  onClick={() => setActiveDetailDataset(ds)}
                  className="hover:bg-blue-50/40 transition cursor-pointer"
                >
                  <td className="p-4">
                    <div className="font-extrabold text-slate-900 hover:text-blue-600 transition">
                      {ds.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      {ds.repoPath || `${ds.author}/${ds.id}`}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                      {ds.modalityCategory || '表格'}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{ds.taskType || '表格回归'}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{ds.author}</div>
                    <div className="text-[10px] text-slate-400">{ds.authorOrg || '个人贡献者'}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-700">
                    {ds.fileSize || ds.scale || '267 MB'}
                  </td>
                  <td className="p-4 text-slate-500 font-mono">
                    {ds.viewsCount ?? 72} 浏览 · {ds.downloadCount ?? 9} 下载
                  </td>
                  <td className="p-4 text-slate-400">
                    {ds.relativeTime || ds.updatedAt}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDetailDataset(ds);
                      }}
                      className="px-3 py-1 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 font-bold text-xs transition cursor-pointer"
                    >
                      查看详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
