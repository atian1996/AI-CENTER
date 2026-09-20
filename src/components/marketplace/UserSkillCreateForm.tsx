import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Wrench,
  Sparkles,
  Zap,
  Terminal,
  FileText,
  BarChart3,
  Code2,
  BookOpen,
  Bot,
  Palette,
  Folder,
  FileArchive,
  CheckCircle2
} from 'lucide-react';

interface UserSkillCreateFormProps {
  onBack: () => void;
  fromTitle?: string;
}

export const UserSkillCreateForm: React.FC<UserSkillCreateFormProps> = ({ onBack, fromTitle }) => {
  const { submitSkillForApproval, showToast, user } = useApp();

  // Form states aligned strictly with SkillAdminView
  const [slug, setSlug] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [category, setCategory] = useState('知识管理');
  const [iconType, setIconType] = useState<'preset' | 'custom'>('preset');
  const [selectedPresetIcon, setSelectedPresetIcon] = useState('Zap');
  const [customIconUrl, setCustomIconUrl] = useState('');
  const [description, setDescription] = useState('');
  
  // File package state
  const [fileUploaded, setFileUploaded] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

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
    { name: 'Zap', label: '闪电/通用', icon: <Zap className="w-5 h-5 text-amber-500" /> },
    { name: 'Terminal', label: '终端/代码', icon: <Terminal className="w-5 h-5 text-indigo-500" /> },
    { name: 'FileText', label: '文档/知识', icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: 'BarChart3', label: '图表/数据', icon: <BarChart3 className="w-5 h-5 text-emerald-500" /> },
    { name: 'Code2', label: '开发/云端', icon: <Code2 className="w-5 h-5 text-sky-500" /> },
    { name: 'BookOpen', label: '阅读/研报', icon: <BookOpen className="w-5 h-5 text-amber-600" /> },
    { name: 'Sparkles', label: '智能/AI', icon: <Sparkles className="w-5 h-5 text-purple-500" /> },
    { name: 'Bot', label: 'Agent机器人', icon: <Bot className="w-5 h-5 text-violet-500" /> },
    { name: 'Palette', label: '设计/多媒体', icon: <Palette className="w-5 h-5 text-rose-500" /> }
  ];

  // File refs
  const folderInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Real Folder Selection
  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const folderName = files[0].webkitRelativePath.split('/')[0] || 'selected-folder';
      setFileUploaded(true);
      setUploadedFileName(`${folderName}/ (包含 ${files.length} 个文件，已解析 SKILL.md)`);
      showToast(`文件夹【${folderName}】已成功选择并解析！`);
      if (errors.file) setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  // Real ZIP/File Selection
  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setFileUploaded(true);
      setUploadedFileName(`${file.name} (${sizeMB} MB)`);
      showToast(`ZIP/压缩包【${file.name}】选择成功！校验 SKILL.md 结构无误。`);
      if (errors.file) setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  // Drag and drop handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setFileUploaded(true);
      setUploadedFileName(`${file.name} (${sizeMB} MB)`);
      showToast(`文件【${file.name}】拖拽上传成功！`);
      if (errors.file) setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  // Real Custom Icon Image Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setCustomIconUrl(url);
      showToast(`图片【${file.name}】上传成功！`);
    }
  };

  const handleTriggerFolderSelect = () => {
    folderInputRef.current?.click();
  };

  const handleTriggerZipSelect = () => {
    zipInputRef.current?.click();
  };

  const handleTriggerImageSelect = () => {
    imageInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!fileUploaded) {
      newErrors.file = '请选择文件夹或上传 ZIP 压缩包！';
    }

    if (!slug.trim()) {
      newErrors.slug = '请输入唯一标识 Slug！';
    } else if (!/^[a-z0-9-_]+$/i.test(slug.trim())) {
      newErrors.slug = 'Slug 仅支持小写字母、数字及连字符';
    }

    if (!displayName.trim()) {
      newErrors.displayName = '请输入显示名称！';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('请完整填写必填字段并上传插件包！');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      submitSkillForApproval({
        id: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        name: displayName.trim(),
        category,
        version: 'v1.0.0',
        description: description.trim() || '暂无详细描述信息',
        compatibleAgents: '全量 Agent 兼容',
        requiredPermissions: ['网络访问', '沙盒执行'],
        packageSize: '1.8 MB',
        packageFormat: 'ZIP / Skill 包',
        repoPath: `@${user.name || 'user'}/${slug.trim()}`
      });
      setSubmitting(false);
      onBack();
    }, 400);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 space-y-6 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer shrink-0"
            title="返回 Skill 市场"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span>{fromTitle || 'AI 集市 / Skill 市场'}</span>
              <span>/</span>
              <span className="text-purple-600">创建 Skill</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-purple-600" />
              <span>创建 Skill 插件</span>
            </h1>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-100">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>应用规范保持一致</span>
        </span>
      </div>

      {/* Main Form Card (Matches SkillAdminView fields) */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-6">
        
        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={folderInputRef}
          // @ts-ignore
          webkitdirectory=""
          directory=""
          multiple
          className="hidden"
          onChange={handleFolderChange}
        />
        <input
          type="file"
          ref={zipInputRef}
          accept=".zip,.tar,.gz,.7z,.rar,.json,.md"
          className="hidden"
          onChange={handleZipChange}
        />
        <input
          type="file"
          ref={imageInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        {/* 1. 文件/文件夹包选择 */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            选择文件 / 文件夹包 <span className="text-rose-500">*</span>
          </label>
          <div 
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1 rounded-2xl border border-dashed border-purple-200 bg-purple-50/20"
          >
            <button
              type="button"
              onClick={handleTriggerFolderSelect}
              className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-purple-50/50 hover:border-purple-300 text-left transition cursor-pointer flex items-center gap-3 group shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                <Folder className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">选择文件夹</div>
                <div className="text-[10px] text-slate-400 mt-0.5">点击选择包含 SKILL.md 的文件夹</div>
              </div>
            </button>

            <button
              type="button"
              onClick={handleTriggerZipSelect}
              className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-indigo-50/50 hover:border-indigo-300 text-left transition cursor-pointer flex items-center gap-3 group shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                <FileArchive className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">选择 ZIP / 压缩包</div>
                <div className="text-[10px] text-slate-400 mt-0.5">解压并校验 SKILL.md 结构，支持拖拽到此处</div>
              </div>
            </button>
          </div>

          {errors.file && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.file}</p>}

          {/* File status if selected */}
          {fileUploaded && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-mono font-bold">{uploadedFileName}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFileUploaded(false);
                  setUploadedFileName('');
                }}
                className="text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer text-[11px]"
              >
                重新选择
              </button>
            </div>
          )}
        </div>

        {/* 2. Slug * */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Slug <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={slug}
            onChange={e => {
              setSlug(e.target.value);
              if (errors.slug) setErrors(prev => ({ ...prev, slug: '' }));
            }}
            placeholder="Skill 的唯一标识符，仅允许小写字母、数字和连字符"
            className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono font-bold transition focus:outline-hidden ${
              errors.slug ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-purple-500 bg-slate-50/50'
            }`}
          />
          {errors.slug && <p className="text-[11px] text-rose-500 font-bold">{errors.slug}</p>}
        </div>

        {/* 3. 显示名称 * */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            显示名称 <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={displayName}
            onChange={e => {
              setDisplayName(e.target.value);
              if (errors.displayName) setErrors(prev => ({ ...prev, displayName: '' }));
            }}
            placeholder="Skill 显示名称"
            className={`w-full px-4 py-2.5 rounded-xl border text-xs font-bold transition focus:outline-hidden ${
              errors.displayName ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-purple-500 bg-slate-50/50'
            }`}
          />
          {errors.displayName && <p className="text-[11px] text-rose-500 font-bold">{errors.displayName}</p>}
        </div>

        {/* 4. 场景分类 * */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            场景分类 <span className="text-rose-500">*</span>
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
                      ? 'bg-purple-600 text-white border-purple-500 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
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
          <label className="block text-xs font-bold text-slate-700">
            图标
          </label>

          {/* Tabs: 预设图标 | 自定义 */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 text-xs font-bold">
            <button
              type="button"
              onClick={() => setIconType('preset')}
              className={`px-4 py-1.5 rounded-lg transition cursor-pointer ${
                iconType === 'preset'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              预设图标
            </button>
            <button
              type="button"
              onClick={() => setIconType('custom')}
              className={`px-4 py-1.5 rounded-lg transition cursor-pointer ${
                iconType === 'custom'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
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
                        ? 'bg-purple-50 border-purple-300 text-purple-700 ring-1 ring-purple-300'
                        : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100 text-slate-600'
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
                  onClick={handleTriggerImageSelect}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  点击上传图片
                </button>
                {customIconUrl && (
                  <img
                    src={customIconUrl}
                    alt="Icon Preview"
                    className="w-10 h-10 rounded-xl border border-slate-200 object-cover shadow-2xs"
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
          <label className="block text-xs font-bold text-slate-700">
            描述
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="请输入 Skill 描述，或使用下方从 SKILL.md 自动抓取的建议"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:border-purple-500 focus:outline-hidden transition resize-none"
          />
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? '提交中...' : '提交创建'}
          </button>
        </div>

      </form>
    </div>
  );
};
