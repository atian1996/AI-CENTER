import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { DatasetItem, DatasetFileItem, DatasetCommentItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  Table, 
  MessageSquare, 
  FileText, 
  Layers, 
  Calendar, 
  Eye, 
  Send, 
  Search, 
  Database,
  ChevronRight,
  FolderOpen,
  Tag,
  Building2,
  HardDrive
} from 'lucide-react';

interface DatasetDetailProps {
  dataset: DatasetItem;
  onBack: () => void;
}

export const DatasetDetail: React.FC<DatasetDetailProps> = ({ dataset, onBack }) => {
  const { showToast } = useApp();

  // Active Tab: overview | files | comments
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'comments'>('overview');

  // Files Tab State
  const filesList: DatasetFileItem[] = dataset.files && dataset.files.length > 0 ? dataset.files : [
    {
      id: 'f_default_1',
      name: `${dataset.name || 'dataset'}.${dataset.formats?.[0]?.toLowerCase()?.includes('json') ? 'json' : 'csv'}`,
      size: dataset.fileSize || dataset.scale || '10.5 MB',
      format: dataset.formats?.[0]?.toLowerCase()?.includes('json') ? 'json' : 'csv',
      rowsCount: 25000,
      colsCount: 6,
      encoding: 'UTF-8',
      headers: ['ID', 'Category', 'Feature_A', 'Feature_B', 'Label_Value', 'Timestamp'],
      sampleRows: [
        { ID: '1001', Category: 'Sample_A', Feature_A: 'Alpha_01', Feature_B: 'Active', Label_Value: 128.5, Timestamp: '2026-08-01' },
        { ID: '1002', Category: 'Sample_B', Feature_A: 'Beta_02', Feature_B: 'Pending', Label_Value: 94.2, Timestamp: '2026-08-02' },
        { ID: '1003', Category: 'Sample_C', Feature_A: 'Gamma_03', Feature_B: 'Completed', Label_Value: 310.0, Timestamp: '2026-08-03' }
      ]
    }
  ];
  const [selectedFileId, setSelectedFileId] = useState<string>(filesList[0]?.id || '');
  const [fileSearchQuery, setFileSearchQuery] = useState('');
  const [tableSearchQuery, setTableSearchQuery] = useState('');

  // Selected File Object
  const currentFile = filesList.find(f => f.id === selectedFileId) || filesList[0];

  // Comments Tab State
  const [commentsList, setCommentsList] = useState<DatasetCommentItem[]>(dataset.comments && dataset.comments.length > 0 ? dataset.comments : [
    {
      id: 'c_default_1',
      userName: '数据科学研究员',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      time: '2 天前',
      content: '这个数据集的字段清洗得很规整，可以直接导入做模型验证，非常推荐！'
    }
  ]);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('已复制数据集公开分享链接到剪贴板！');
    } else {
      showToast('已生成数据集分享链接！');
    }
  };

  const handleAddComment = () => {
    if (!newCommentText.trim()) {
      showToast('请输入评论内容');
      return;
    }
    const newComment: DatasetCommentItem = {
      id: `c_${Date.now()}`,
      userName: '当前登录用户',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      time: '刚刚',
      content: newCommentText.trim()
    };
    setCommentsList(prev => [newComment, ...prev]);
    setNewCommentText('');
    showToast('评论发布成功！');
  };

  const handleAddReply = (parentCommentId: string) => {
    if (!replyText.trim()) return;
    setCommentsList(prev => prev.map(c => {
      if (c.id === parentCommentId) {
        const replies = c.replies || [];
        return {
          ...c,
          replies: [
            ...replies,
            {
              id: `r_${Date.now()}`,
              userName: '当前登录用户',
              userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
              time: '刚刚',
              content: replyText.trim()
            }
          ]
        };
      }
      return c;
    }));
    setReplyText('');
    setReplyTargetId(null);
    showToast('回复成功！');
  };

  // Filter sample rows by tableSearchQuery
  const filteredSampleRows = (currentFile?.sampleRows || []).filter(row => {
    if (!tableSearchQuery.trim()) return true;
    const q = tableSearchQuery.toLowerCase();
    return Object.values(row).some(val => String(val).toLowerCase().includes(q));
  });

  const modalitiesText = dataset.modalities?.join('、') || dataset.modalityCategory || '表格数据';
  const taskTypesText = dataset.taskTypes?.join('、') || dataset.taskType || '分类任务';
  const domainsList = dataset.domains || dataset.domainTags || [];
  const formatsText = dataset.formats?.join(' / ') || dataset.fileFormats || dataset.format || 'CSV';

  return (
    <div className="space-y-6 select-none animate-fade-in max-w-7xl mx-auto pb-16">
      
      {/* Top Breadcrumb & Return Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/80 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 shadow-2xs transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回数据集广场</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <span>数据集广场</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-700 font-bold truncate max-w-xs">{dataset.name}</span>
        </div>
      </div>

      {/* Dataset Header Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          
          {/* Left info */}
          <div className="space-y-3 flex-1 min-w-0">
            {/* Badges: Modality, Task Type, Format */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-xs font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>{modalitiesText}</span>
              </span>

              <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-bold flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>{taskTypesText}</span>
              </span>

              <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono font-bold">
                {formatsText}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {dataset.name}
            </h1>

            {/* Brief Introduction */}
            {dataset.brief && (
              <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                {dataset.brief}
              </p>
            )}

            {/* Metadata Chips: Update Time, Views, Downloads */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-1">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>更新时间：{dataset.updatedAt}</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-500">
                <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                <span>数据大小：<strong className="font-mono text-slate-800">{dataset.fileSize || dataset.scale || '0 B'}</strong></span>
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {dataset.viewsCount ?? 0} 次浏览
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> {dataset.downloadCount ?? 0} 次下载
                </span>
              </div>
            </div>

            {/* Domain Tags */}
            {domainsList.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 font-medium">行业领域：</span>
                {domainsList.map(tag => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer bg-white shadow-2xs"
            >
              <Share2 className="w-4 h-4 text-slate-400" />
              <span>分享</span>
            </button>

            {/* Download Package */}
            <button
              onClick={() => showToast(`已启动数据集文件包下载【${dataset.name}】(${dataset.fileSize || dataset.scale || '完整包'})`)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-sm shadow-indigo-500/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>下载完整数据 ({dataset.fileSize || dataset.scale || '完整包'})</span>
            </button>
          </div>

        </div>

        {/* 3 Main Tabs: Overview, Files, Comments */}
        <div className="flex items-center gap-4 border-t border-slate-100 pt-4 text-xs font-black">
          {[
            { key: 'overview', label: '概述', icon: FileText, count: undefined },
            { key: 'files', label: '文件', icon: FolderOpen, count: filesList.length },
            { key: 'comments', label: '评论', icon: MessageSquare, count: commentsList.length }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`pb-2 px-3 border-b-2 flex items-center gap-2 transition cursor-pointer text-sm ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* ================= TAB 1: 概述 (Overview) ================= */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-black text-sm pb-3 border-b border-slate-100">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>数据描述</span>
          </div>
          
          {/* Render Backend Markdown Description */}
          <div className="prose prose-sm prose-slate max-w-none text-slate-700 text-xs leading-relaxed">
            <Markdown>
              {dataset.description || dataset.brief || '暂无数据描述。'}
            </Markdown>
          </div>
        </div>
      )}

      {/* ================= TAB 2: 文件 (Files) ================= */}
      {activeTab === 'files' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
            
            {/* Left Col: File Explorer Tree (4 Cols) */}
            <div className="lg:col-span-4 border-r border-slate-200/80 p-4 space-y-4 bg-slate-50/60">
              
              {/* Search file in dataset */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索子文件..."
                  value={fileSearchQuery}
                  onChange={(e) => setFileSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold px-1">
                <span>包含文件 ({filesList.length})</span>
                <span>格式 / 大小</span>
              </div>

              {/* Files Tree List */}
              <div className="space-y-1.5 overflow-y-auto max-h-[500px]">
                {filesList
                  .filter(f => f.name.toLowerCase().includes(fileSearchQuery.toLowerCase()))
                  .map(f => {
                    const isSelected = f.id === selectedFileId;
                    return (
                      <button
                        key={f.id}
                        onClick={() => setSelectedFileId(f.id)}
                        className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white border-slate-200/80 text-slate-700 hover:border-indigo-200 hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {f.format === 'csv' || f.format === 'xlsx' ? (
                              <FileSpreadsheet className="w-4 h-4" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                              {f.name}
                            </div>
                            <div className={`text-[10px] font-medium ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                              {f.rowsCount ? `${f.rowsCount.toLocaleString()} 行 · ` : ''}{f.colsCount ? `${f.colsCount} 列` : ''}
                            </div>
                          </div>
                        </div>

                        <div className={`text-[11px] font-mono shrink-0 font-bold ${
                          isSelected ? 'text-indigo-100' : 'text-slate-500'
                        }`}>
                          {f.size}
                        </div>
                      </button>
                    );
                  })}
              </div>

            </div>

            {/* Right Col: Structured Table Data Previewer (8 Cols) */}
            <div className="lg:col-span-8 p-6 flex flex-col justify-between space-y-4">
              
              {/* Header Info Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">{currentFile?.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                      {currentFile?.format?.toUpperCase() || 'CSV'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">编码: {currentFile?.encoding || 'UTF-8'}</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    文件大小: <span className="font-bold text-slate-800">{currentFile?.size}</span> · 
                    数据规模: <span className="font-bold text-slate-800">{currentFile?.rowsCount?.toLocaleString() || '10,000+'}</span> 行 · 
                    字段数: <span className="font-bold text-slate-800">{currentFile?.colsCount || (currentFile?.headers?.length || 6)}</span> 列
                  </div>
                </div>

                {/* Search in current table */}
                <div className="flex items-center gap-2">
                  <div className="relative w-48 sm:w-60">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="过滤表格样本..."
                      value={tableSearchQuery}
                      onChange={(e) => setTableSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    onClick={() => showToast(`正在导出文件【${currentFile?.name}】`)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                    title="下载单表"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Table Data View */}
              <div className="flex-1 overflow-x-auto border border-slate-200/80 rounded-2xl bg-white shadow-2xs max-h-[440px]">
                {currentFile?.headers && currentFile.headers.length > 0 ? (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 text-slate-700 font-extrabold sticky top-0 z-10 border-b border-slate-200 shadow-2xs">
                      <tr>
                        <th className="py-2.5 px-3 border-r border-slate-200 w-12 text-center text-slate-400 font-mono">
                          #
                        </th>
                        {currentFile.headers.map(h => (
                          <th key={h} className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap font-bold text-slate-800">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredSampleRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-indigo-50/40 transition">
                          <td className="py-2 px-3 border-r border-slate-100 text-center text-slate-400 font-mono text-[10px]">
                            {idx + 1}
                          </td>
                          {currentFile.headers!.map(h => (
                            <td key={h} className="py-2 px-3 border-r border-slate-100 font-mono text-slate-700 whitespace-nowrap">
                              {String(row[h] ?? '-')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                    <Table className="w-8 h-8 mx-auto text-slate-300" />
                    <div>当前文件为非结构化格式，请下载后使用对应工具读取解析。</div>
                  </div>
                )}
              </div>

              {/* Footer row counter */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 font-medium">
                <div>
                  展示前 <span className="font-bold text-slate-700">{filteredSampleRows.length}</span> 条采样样本（完整数据共 {currentFile?.rowsCount?.toLocaleString() || '10,000+'} 条）
                </div>
                <div className="text-[11px] text-indigo-600 font-bold">
                  ● 结构化样本视图已就绪
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ================= TAB 3: 评论 (Comments) ================= */}
      {activeTab === 'comments' && (
        <div className="space-y-6">
          
          {/* Post Comment Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>发表讨论与问题反馈</span>
            </div>

            <textarea
              rows={3}
              placeholder="分享您对该数据集的使用心得、清洗体验或向发布者反馈..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white leading-relaxed resize-none"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">请保持友好交流，文明用语</span>
              <button
                onClick={handleAddComment}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>发布讨论</span>
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-900">全部讨论 ({commentsList.length})</h3>
              <span className="text-xs text-slate-400">按时间倒序</span>
            </div>

            <div className="space-y-6">
              {commentsList.map(comment => (
                <div key={comment.id} className="space-y-3 pb-5 border-b border-slate-100 last:border-0 last:pb-0">
                  
                  {/* Top: Avatar & Name */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={comment.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                        alt={comment.userName}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800">{comment.userName}</span>
                        <div className="text-[10px] text-slate-400">{comment.time}</div>
                      </div>
                    </div>
                  </div>

                  {/* Comment Text */}
                  <p className="text-xs text-slate-700 leading-relaxed font-medium pl-9">
                    {comment.content}
                  </p>

                  {/* Reply Button Trigger */}
                  <div className="pl-9 flex items-center gap-3 text-[11px]">
                    <button
                      onClick={() => setReplyTargetId(replyTargetId === comment.id ? null : comment.id)}
                      className="text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer"
                    >
                      {replyTargetId === comment.id ? '取消回复' : '回复'}
                    </button>
                  </div>

                  {/* Inline Reply Input Box */}
                  {replyTargetId === comment.id && (
                    <div className="ml-9 p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <input
                        type="text"
                        placeholder={`回复 @${comment.userName}...`}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setReplyTargetId(null)}
                          className="px-3 py-1 rounded-lg text-xs text-slate-500 hover:bg-slate-200 cursor-pointer"
                        >
                          取消
                        </button>
                        <button
                          onClick={() => handleAddReply(comment.id)}
                          className="px-4 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 cursor-pointer"
                        >
                          发送
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Nested Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-9 mt-3 space-y-2.5 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={reply.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                                alt={reply.userName}
                                className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
                              />
                              <span className="font-bold text-slate-800">{reply.userName}</span>
                            </div>
                            <span className="text-[10px] text-slate-400">{reply.time}</span>
                          </div>
                          <p className="text-slate-600 pl-7 leading-relaxed font-medium">
                            {reply.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ))}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

