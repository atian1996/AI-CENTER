import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { SkillPluginItem } from '../../../types';
import {
  Puzzle,
  Plus,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  ArrowLeft,
  Upload,
  Folder,
  FileArchive,
  CheckCircle2,
  Zap,
  Sparkles,
  Terminal,
  FileText,
  BarChart3,
  Code2,
  BookOpen,
  Bot,
  Palette,
  Check,
  Eye,
  X,
  FileCode
} from 'lucide-react';

export const SkillAdminView: React.FC = () => {
  const { skills, setSkills, showToast } = useApp();

  // Mode: 'list' | 'create' | 'edit'
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingSkill, setEditingSkill] = useState<SkillPluginItem | null>(null);

  // Filter state for list
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('全部');

  // Form States (Matches "创建SKILL.png" design strictly)
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [slug, setSlug] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [category, setCategory] = useState('知识管理');
  const [iconType, setIconType] = useState<'preset' | 'custom'>('preset');
  const [selectedPresetIcon, setSelectedPresetIcon] = useState('Zap');
  const [customIconUrl, setCustomIconUrl] = useState('');
  const [description, setDescription] = useState('');
  const [previewModalSkill, setPreviewModalSkill] = useState<SkillPluginItem | null>(null);

  const categoriesList = [
    '知识管理',
    '效率工具',
    '数据分析',
    '内容创作',
    '编程开发',
    '图像影音',
    '生活娱乐'
  ];

  const presetIcons = [
    { name: 'Zap', label: '闪电/通用', icon: <Zap className="w-5 h-5 text-amber-400" /> },
    { name: 'Terminal', label: '终端/代码', icon: <Terminal className="w-5 h-5 text-indigo-400" /> },
    { name: 'FileText', label: '文档/知识', icon: <FileText className="w-5 h-5 text-blue-400" /> },
    { name: 'BarChart3', label: '图表/数据', icon: <BarChart3 className="w-5 h-5 text-emerald-400" /> },
    { name: 'Code2', label: '开发/云端', icon: <Code2 className="w-5 h-5 text-sky-400" /> },
    { name: 'BookOpen', label: '阅读/研报', icon: <BookOpen className="w-5 h-5 text-amber-500" /> },
    { name: 'Sparkles', label: '智能/AI', icon: <Sparkles className="w-5 h-5 text-purple-400" /> },
    { name: 'Bot', label: 'Agent机器人', icon: <Bot className="w-5 h-5 text-violet-400" /> },
    { name: 'Palette', label: '设计/多媒体', icon: <Palette className="w-5 h-5 text-rose-400" /> }
  ];

  const handleOpenCreate = () => {
    setEditingSkill(null);
    setSlug('');
    setDisplayName('');
    setCategory('知识管理');
    setIconType('preset');
    setSelectedPresetIcon('Zap');
    setCustomIconUrl('');
    setDescription('');
    setFileUploaded(false);
    setUploadedFileName('');
    setViewMode('create');
  };

  const handleOpenEdit = (skill: SkillPluginItem) => {
    setEditingSkill(skill);
    setSlug(skill.id || skill.repoPath || '');
    setDisplayName(skill.name);
    setCategory(skill.category || '知识管理');
    setIconType('preset');
    setSelectedPresetIcon('Zap');
    setCustomIconUrl('');
    setDescription(skill.description);
    setFileUploaded(true);
    setUploadedFileName(`${skill.id || 'skill'}.zip (1.2 MB)`);
    setViewMode('edit');
  };

  const handleSimulateSelectFolder = () => {
    setFileUploaded(true);
    setUploadedFileName(`skill-package-${slug || 'folder'}/ (含 SKILL.md, 14个文件)`);
    showToast('文件夹已选中，自动解析 SKILL.md 文件结构成功！');
  };

  const handleSimulateSelectZip = () => {
    setFileUploaded(true);
    setUploadedFileName(`${slug || 'skill-bundle'}-v1.0.0.zip (1.8 MB)`);
    showToast('ZIP 压缩包已解析，SKILL.md 验证通过！');
  };

  const handleSimulateUploadImage = () => {
    const mockAvatar = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80';
    setCustomIconUrl(mockAvatar);
    showToast('自定义 Icon 图片上传成功！经过系统合规审核');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug.trim()) {
      showToast('请输入唯一标识 Slug！');
      return;
    }
    if (!displayName.trim()) {
      showToast('请输入显示名称！');
      return;
    }

    if (viewMode === 'create') {
      const newSkill: SkillPluginItem = {
        id: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        name: displayName.trim(),
        category: category,
        developer: '系统管理员',
        developerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        version: 'v1.0.0',
        updatedAt: '刚刚',
        installs: 0,
        downloadsCount: 0,
        description: description || '暂无详细描述信息',
        compatibleAgents: '全量 Agent 兼容',
        requiredPermissions: ['网络访问', '本地沙盒'],
        packageFormat: 'ZIP / Skill 包',
        packageSize: '1.8 MB',
        repoPath: `@official/${slug.trim()}`
      };
      setSkills(prev => [newSkill, ...prev]);
      showToast(`Skill 插件【${displayName}】创建成功！`);
    } else if (viewMode === 'edit' && editingSkill) {
      setSkills(prev =>
        prev.map(item => {
          if (item.id === editingSkill.id) {
            return {
              ...item,
              name: displayName.trim(),
              category: category,
              description: description || item.description
            };
          }
          return item;
        })
      );
      showToast(`Skill 插件【${displayName}】更新成功！`);
    }

    setViewMode('list');
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`确定要删除 Skill 插件【${name}】吗？删除后不可恢复。`)) {
      setSkills(prev => prev.filter(s => s.id !== id));
      showToast(`已成功删除 Skill 插件【${name}】`);
    }
  };

  // Filter skills list
  const filteredList = skills.filter(item => {
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = categoryFilter === '全部' || item.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  // Render Editor Page (Matching System Admin Dark Theme Style)
  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 text-slate-100 shadow-2xl animate-fade-in select-none">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400" />
              <span>返回 Skill 列表</span>
            </button>
            <div>
              <h1 className="text-base font-black text-white">
                {viewMode === 'create' ? '创建 Skill 插件' : `编辑 Skill: ${editingSkill?.name}`}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                上传 SKILL.md 扩展包，配置场景分类与交互标识
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer border border-slate-700/60"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>保存 Skill</span>
            </button>
          </div>
        </div>

        {/* Form Container (Strictly matching "创建SKILL.png" with System Theme) */}
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
          
          {/* 1. Skill 文件 * */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              Skill 文件 <span className="text-rose-400">*</span>
            </label>

            {/* Drag & Drop Upload Zone */}
            <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/60 bg-slate-950/70 hover:bg-slate-950 rounded-2xl p-8 text-center transition cursor-pointer space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700/60 flex items-center justify-center mx-auto text-indigo-400 shadow-inner">
                <Upload className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-200">
                  拖拽文件夹或 zip 包到此处
                </p>
                <p className="text-[11px] text-slate-400">
                  请确保文件夹或压缩包中包含 SKILL.md 文件（最多 200 个，总大小不超过 10.00 MB）
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSimulateSelectFolder}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Folder className="w-4 h-4" />
                  <span>选择文件夹</span>
                </button>

                <button
                  type="button"
                  onClick={handleSimulateSelectZip}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <FileArchive className="w-4 h-4" />
                  <span>选择 zip 文件</span>
                </button>
              </div>
            </div>

            {/* File status if selected */}
            {fileUploaded && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-mono font-medium">{uploadedFileName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFileUploaded(false);
                    setUploadedFileName('');
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer text-[11px]"
                >
                  重新选择
                </button>
              </div>
            )}
          </div>

          {/* 2. Slug * */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Slug <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              placeholder="Skill 的唯一标识符，仅允许小写字母、数字和连字符"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition"
            />
          </div>

          {/* 3. 显示名称 * */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              显示名称 <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Skill 显示名称"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition"
            />
          </div>

          {/* 4. 场景分类 * (Required additional field corresponding to frontend) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              场景分类 <span className="text-rose-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2 pt-0.5">
              {categoriesList.map(catItem => {
                const isSelected = category === catItem;
                return (
                  <button
                    type="button"
                    key={catItem}
                    onClick={() => setCategory(catItem)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    {catItem}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. 图标 */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              图标
            </label>

            {/* Tabs: 预设图标 | 自定义 */}
            <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setIconType('preset')}
                className={`px-4 py-1.5 rounded-lg transition cursor-pointer ${
                  iconType === 'preset'
                    ? 'bg-slate-800 text-white shadow-2xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                预设图标
              </button>
              <button
                type="button"
                onClick={() => setIconType('custom')}
                className={`px-4 py-1.5 rounded-lg transition cursor-pointer ${
                  iconType === 'custom'
                    ? 'bg-slate-800 text-white shadow-2xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                自定义
              </button>
            </div>

            {/* Preset Icon Selector */}
            {iconType === 'preset' ? (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-2">
                {presetIcons.map(item => {
                  const isSel = selectedPresetIcon === item.name;
                  return (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => setSelectedPresetIcon(item.name)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                        isSel
                          ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-300 ring-1 ring-indigo-500/30'
                          : 'bg-slate-950 border-slate-800 hover:bg-slate-800/80 text-slate-400'
                      }`}
                    >
                      {item.icon}
                      <span className="text-[11px] font-bold">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Custom Upload Button */
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSimulateUploadImage}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer"
                  >
                    点击上传图片
                  </button>
                  {customIconUrl && (
                    <img
                      src={customIconUrl}
                      alt="Icon Preview"
                      className="w-10 h-10 rounded-xl border border-slate-700 object-cover shadow-2xs"
                    />
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  支持 jpg / png / webp，最大 5MB；上传后需经过合规审核。
                </p>
              </div>
            )}
          </div>

          {/* 6. 描述 */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              描述
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="请输入 Skill 描述，或使用下方从 SKILL.md 自动抓取的建议"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition resize-none"
            />
          </div>

        </form>
      </div>
    );
  }

  // List View Mode (Matching System Admin Dark Theme Style)
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 text-slate-100 shadow-2xl animate-fade-in select-none">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Puzzle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black text-white tracking-tight">
              Skill 插件管理
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              统一管理平台挂载的 Agent Skill 扩展包，控制场景分类与版本发布
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>创建 SKILL</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索 Skill 名称 / Slug / 描述..."
              className="w-full bg-slate-900 border border-slate-800 text-white placeholder:text-slate-500 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:border-indigo-500 outline-none transition"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none cursor-pointer"
            >
              <option value="全部">全部分类 ({skills.length})</option>
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-slate-500 font-mono text-[11px] self-end md:self-auto">
          共 {filteredList.length} 项 Skill 插件
        </div>
      </div>

      {/* Table List */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold">
              <tr>
                <th className="py-3.5 px-4">Skill 标识 / 名称</th>
                <th className="py-3.5 px-4">场景分类</th>
                <th className="py-3.5 px-4">版本 / 大小</th>
                <th className="py-3.5 px-4">简介描述</th>
                <th className="py-3.5 px-4">更新时间</th>
                <th className="py-3.5 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredList.map(sk => (
                <tr key={sk.id} className="hover:bg-slate-800/40 transition">
                  {/* Skill Name & Slug */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 font-bold">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate">
                          {sk.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 truncate">
                          {sk.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-300 font-bold text-[11px]">
                      {sk.category}
                    </span>
                  </td>

                  {/* Version & Size */}
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <div className="text-slate-200 font-bold">{sk.version}</div>
                    <div className="text-slate-500">{sk.packageSize || '1.8 MB'}</div>
                  </td>

                  {/* Description */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="text-slate-400 truncate" title={sk.description}>
                      {sk.description}
                    </p>
                  </td>

                  {/* Updated At */}
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    {sk.updatedAt || '最近更新'}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewModalSkill(sk)}
                        title="预览完整 Skill"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleOpenEdit(sk)}
                        title="编辑 Skill"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(sk.id, sk.name)}
                        title="删除 Skill"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                    未检索到符合条件的 Skill 插件
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {previewModalSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 max-w-2xl w-full p-6 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">
                  {previewModalSkill.name} (SKILL.md 规范预览)
                </h3>
              </div>
              <button
                onClick={() => setPreviewModalSkill(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 text-slate-300 font-mono text-xs space-y-2 max-h-80 overflow-y-auto border border-slate-800">
              <div className="text-emerald-400"># SKILL.md Manifest Specification</div>
              <div>name: {previewModalSkill.name}</div>
              <div>slug: {previewModalSkill.id}</div>
              <div>category: {previewModalSkill.category}</div>
              <div>version: {previewModalSkill.version}</div>
              <div>description: {previewModalSkill.description}</div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewModalSkill(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer transition border border-slate-700"
              >
                关闭预览
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

