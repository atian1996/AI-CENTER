import React, { useState, useMemo, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { useApp } from '../../../context/AppContext';
import { AgentItem, AgentOrderItem } from '../../../types';
import {
  Bot,
  Receipt,
  Activity,
  Layers,
  Search,
  Plus,
  Trash2,
  Edit2,
  Power,
  CheckCircle,
  XCircle,
  Eye,
  ArrowLeft,
  DollarSign,
  Upload,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  PlusCircle,
  ArrowUpDown,
  FileText,
  Bold,
  Italic,
  Heading,
  List,
  ListOrdered,
  Code,
  Quote,
  Link as LinkIcon,
  Check,
  X,
  ChevronDown,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// ============================================================================
// MOCK DATA SEEDING
// ============================================================================

// Initial Mock Agent Orders
const initialAgentOrders: AgentOrderItem[] = [
  {
    id: 'ORD-AG-20260819-001',
    userName: 'AI探险家-李大明',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    agentId: 'ag_01',
    agentName: '法律智友 (Drafting Assistant)',
    orderType: '月卡',
    orderAmount: 99.00,
    tokenAmount: 200, // 200万 Token
    status: '已生效',
    createdAt: '2026-08-19 14:20:00',
    payTime: '2026-08-19 14:20:15',
    startTime: '2026-08-19 14:20:15',
    expireTime: '2026-09-18 23:59:59',
    usedTokens: 12.5
  },
  {
    id: 'ORD-AG-20260818-012',
    userName: '小雅Code',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    agentId: 'ag_03',
    agentName: 'SQL 智能分析专家',
    orderType: '年卡',
    orderAmount: 899.00,
    tokenAmount: 2500, // 2500万 Token
    status: '已生效',
    createdAt: '2026-08-18 09:15:33',
    payTime: '2026-08-18 09:16:00',
    startTime: '2026-08-18 09:16:00',
    expireTime: '2027-08-17 23:59:59',
    usedTokens: 145.2
  },
  {
    id: 'ORD-AG-20260817-045',
    userName: '金融老金',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    agentId: 'ag_02',
    agentName: '研报深度解析沙箱',
    orderType: '免费领取',
    orderAmount: 0.00,
    tokenAmount: 30, // 30万 Token
    status: '已生效',
    createdAt: '2026-08-17 18:40:12',
    payTime: '2026-08-17 18:40:12',
    startTime: '2026-08-17 18:40:12',
    expireTime: '2026-08-24 18:40:12',
    usedTokens: 14.8
  },
  {
    id: 'ORD-AG-20260815-089',
    userName: '内容制作者-张薇',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    agentId: 'ag_01',
    agentName: '法律智友 (Drafting Assistant)',
    orderType: '按Token订阅',
    orderAmount: 45.00,
    tokenAmount: 100, // 100万 Token
    status: '已用完',
    createdAt: '2026-08-15 11:05:00',
    payTime: '2026-08-15 11:05:40',
    startTime: '2026-08-15 11:05:40',
    expireTime: '2026-09-14 23:59:59',
    usedTokens: 100.0
  },
  {
    id: 'ORD-AG-20260812-112',
    userName: '政务云联-小陈',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    agentId: 'ag_05',
    agentName: '政务公文秒批系统',
    orderType: '季卡',
    orderAmount: 269.00,
    tokenAmount: 600,
    status: '已过期',
    createdAt: '2026-05-10 10:00:00',
    payTime: '2026-05-10 10:01:15',
    startTime: '2026-05-10 10:01:15',
    expireTime: '2026-08-10 23:59:59',
    usedTokens: 489.3
  },
  {
    id: 'ORD-AG-20260810-098',
    userName: '小极客2026',
    userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    agentId: 'ag_04',
    agentName: 'Python 贪吃蛇与经典游戏智能生成器',
    orderType: '周卡',
    orderAmount: 29.00,
    tokenAmount: 50,
    status: '已生效',
    createdAt: '2026-08-15 16:30:00',
    payTime: '2026-08-15 16:30:45',
    startTime: '2026-08-15 16:30:45',
    expireTime: '2026-08-22 16:30:45',
    usedTokens: 8.4
  }
];

// Initial Categories Mock State
const initialTechForms = ['Chatbot', 'Agent', '对话流', '工作流', '文本生成'];
const initialAppScenarios = ['内容创作', '数据分析', '智能客服', '办公助理', '编程开发', '营销推广', '教育培训', '行业垂直'];
const initialIndustries = ['通用', '政务', '制造', '零售', '金融', '医疗', '教育', '文旅', '物流', '企业'];

// Mock Token Consumption Trend for Recharts (Last 30 Days)
const mockUsageTrend = [
  { date: '07-21', tokens: 120, calls: 3500, revenue: 1540 },
  { date: '07-24', tokens: 145, calls: 4100, revenue: 1820 },
  { date: '07-27', tokens: 190, calls: 5200, revenue: 2300 },
  { date: '07-30', tokens: 165, calls: 4800, revenue: 2100 },
  { date: '08-02', tokens: 210, calls: 5900, revenue: 2800 },
  { date: '08-05', tokens: 250, calls: 6800, revenue: 3200 },
  { date: '08-08', tokens: 280, calls: 7300, revenue: 3450 },
  { date: '08-11', tokens: 320, calls: 8100, revenue: 4100 },
  { date: '08-14', tokens: 360, calls: 9200, revenue: 4700 },
  { date: '08-17', tokens: 410, calls: 10400, revenue: 5400 },
  { date: '08-19', tokens: 450, calls: 11800, revenue: 6100 }
];

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#14b8a6'];

// ============================================================================
// MAIN WRAPPER CONTAINER FOR SUBVIEWS
// ============================================================================
export const AgentAdminViews: React.FC<{ activeSubMenu: string }> = ({ activeSubMenu }) => {
  // Shared options states for categories (loaded with initial option values)
  const [techForms, setTechForms] = useState<string[]>(initialTechForms);
  const [appScenarios, setAppScenarios] = useState<string[]>(initialAppScenarios);
  const [industries, setIndustries] = useState<string[]>(initialIndustries);

  // Agent Orders local state
  const [orders, setOrders] = useState<AgentOrderItem[]>(initialAgentOrders);

  switch (activeSubMenu) {
    case 'agent_list':
      return <AgentListAdminView techForms={techForms} appScenarios={appScenarios} industries={industries} />;
    case 'agent_orders':
      return <AgentOrdersAdminView orders={orders} setOrders={setOrders} />;
    case 'agent_stats':
      return <AgentStatsAdminView techForms={techForms} appScenarios={appScenarios} />;
    default:
      return <AgentListAdminView techForms={techForms} appScenarios={appScenarios} industries={industries} />;
  }
};

// ============================================================================
// SUBVIEW 1: AGENT LIST & CREATION FORM
// ============================================================================
// HELPER REUSABLE COMPONENTS FOR AGENT ADMIN FORM
// ============================================================================

/** 头像上传与预览组件 */
const ImageUploadField: React.FC<{
  value?: string;
  onChange: (url: string) => void;
  label: string;
}> = ({ value, onChange, label }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('图片大小不能超过 3MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 3 * 1024 * 1024) {
        alert('图片大小不能超过 3MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1633409381648-e866e4a2c5ea?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=120&auto=format&fit=crop&q=80'
  ];

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-300 block">{label}</label>
      <div className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
        {/* Preview Avatar */}
        <div className="relative group shrink-0">
          <img
            src={value || sampleAvatars[0]}
            alt="Avatar"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/40 bg-slate-800 shadow-md"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute -top-1.5 -right-1.5 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full text-[10px] shadow-sm cursor-pointer"
              title="清除头像"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Upload Action Area */}
        <div className="flex-1 space-y-2.5 w-full">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition flex items-center justify-center gap-2 ${
              isDragging
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                : 'border-slate-800 hover:border-slate-700 bg-slate-900/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-xs font-semibold">点击上传本地图片，或直接将图片拖拽至此处</span>
            <span className="text-[10px] text-slate-500">(PNG / JPG / SVG / WebP, ≤3MB)</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
            />
          </div>

          {/* Direct URL input & Quick Presets */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="或直接输入图片URL网络地址..."
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none"
            />
            <span className="text-[10px] text-slate-500 whitespace-nowrap">预设:</span>
            <div className="flex gap-1">
              {sampleAvatars.slice(0, 4).map((url, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => onChange(url)}
                  className="w-6 h-6 rounded-md overflow-hidden border border-slate-700 hover:border-indigo-500 cursor-pointer shrink-0 transition"
                  title="使用预设头像"
                >
                  <img src={url} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/** 多选下拉组件（限制最多选择3项） */
const MultiSelectDropdown: React.FC<{
  label: string;
  required?: boolean;
  options: string[];
  selectedValues: string[];
  onChange: (vals: string[]) => void;
  max?: number;
  placeholder?: string;
  badgeTheme?: 'indigo' | 'teal' | 'cyan';
}> = ({
  label,
  required = false,
  options,
  selectedValues,
  onChange,
  max = 3,
  placeholder = '请下拉选择...',
  badgeTheme = 'indigo'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (opt: string) => {
    if (selectedValues.includes(opt)) {
      onChange(selectedValues.filter(v => v !== opt));
    } else {
      if (selectedValues.length >= max) {
        return; // Max reached
      }
      onChange([...selectedValues, opt]);
    }
  };

  const badgeColorClass =
    badgeTheme === 'indigo'
      ? 'bg-indigo-950/90 text-indigo-300 border-indigo-700/60'
      : badgeTheme === 'teal'
      ? 'bg-teal-950/90 text-teal-300 border-teal-700/60'
      : 'bg-cyan-950/90 text-cyan-300 border-cyan-700/60';

  return (
    <div className="space-y-1.5 relative" ref={containerRef}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <span className="text-[11px] font-mono text-slate-400">
          已选 <span className={selectedValues.length >= max ? 'text-amber-400 font-bold' : 'text-indigo-400 font-bold'}>{selectedValues.length}</span> / {max} 项 (最多选{max}个)
        </span>
      </div>

      {/* Trigger Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-[42px] px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-slate-700 transition focus-within:border-indigo-500"
      >
        <div className="flex flex-wrap gap-1.5 items-center flex-1">
          {selectedValues.length === 0 ? (
            <span className="text-xs text-slate-600 select-none">{placeholder}</span>
          ) : (
            selectedValues.map(val => (
              <span
                key={val}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold border ${badgeColorClass}`}
              >
                <span>{val}</span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(selectedValues.filter(v => v !== val));
                  }}
                  className="hover:text-white transition cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </span>
              </span>
            ))
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ml-2 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 max-h-56 overflow-y-auto space-y-1">
          <div className="px-2 py-1 text-[10px] text-slate-500 font-bold border-b border-slate-800/80 mb-1 flex items-center justify-between">
            <span>可选标签列表 (最多选 {max} 项)</span>
            {selectedValues.length > 0 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange([]); }}
                className="text-indigo-400 hover:underline cursor-pointer"
              >
                清空已选
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-1">
            {options.map(opt => {
              const isSelected = selectedValues.includes(opt);
              const isMaxed = selectedValues.length >= max && !isSelected;
              return (
                <button
                  type="button"
                  key={opt}
                  disabled={isMaxed}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(opt);
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition text-left cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-bold'
                      : isMaxed
                      ? 'bg-slate-950/40 text-slate-600 border border-transparent cursor-not-allowed opacity-60'
                      : 'hover:bg-slate-800 text-slate-300 border border-transparent'
                  }`}
                >
                  <span className="truncate">{opt}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/** Markdown 编辑器组件 (支持工具栏与实时渲染预览) */
const MarkdownEditorField: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  helperText?: string;
}> = ({
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  rows = 5,
  helperText
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertSnippet = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || defaultText;
    const replacement = `${before}${selected}${after}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <span>{label}</span>
          {required && <span className="text-red-500">*</span>}
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
            Markdown
          </span>
        </label>
        {/* Tab switch */}
        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            编辑模式
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
              activeTab === 'preview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>实时渲染预览</span>
          </button>
        </div>
      </div>

      {activeTab === 'edit' ? (
        <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden focus-within:border-indigo-500 transition">
          {/* Quick Markdown Toolbar */}
          <div className="flex flex-wrap items-center gap-1 px-2.5 py-1.5 bg-slate-900/80 border-b border-slate-800 text-slate-400 text-xs">
            <button
              type="button"
              onClick={() => insertSnippet('**', '**', '粗体文字')}
              className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer font-bold"
              title="加粗"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('*', '*', '斜体文字')}
              className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer italic"
              title="斜体"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('### ', '', '三级标题')}
              className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer font-black text-[11px]"
              title="插入标题"
            >
              <Heading className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-3.5 bg-slate-800 mx-1" />
            <button
              type="button"
              onClick={() => insertSnippet('- ', '', '列表项')}
              className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
              title="无序列表"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('1. ', '', '步骤描述')}
              className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
              title="有序列表"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('```typescript\n', '\n```', '// 示例代码')}
              className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
              title="代码块"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('> ', '', '引用说明')}
              className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
              title="引用"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('[', '](https://example.com)', '链接名称')}
              className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
              title="超链接"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
            <div className="flex-1" />
            <span className="text-[10px] text-slate-500 font-mono">
              {value.length} 字符
            </span>
          </div>

          <textarea
            ref={textareaRef}
            required={required}
            rows={rows}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3.5 py-3 bg-transparent text-xs text-white placeholder:text-slate-600 outline-none font-mono leading-relaxed resize-y"
          />
        </div>
      ) : (
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 min-h-[140px] max-h-[360px] overflow-y-auto">
          {value.trim() ? (
            <div className="text-xs text-slate-200 leading-relaxed space-y-2">
              <Markdown>{value}</Markdown>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500 italic">
              当前暂无内容，请切换到编辑模式输入 Markdown 文本
            </div>
          )}
        </div>
      )}

      {helperText && <p className="text-[10px] text-slate-500">{helperText}</p>}
    </div>
  );
};

/** 开关按钮组件 (是否上架) */
const ToggleSwitch: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  activeText?: string;
  inactiveText?: string;
}> = ({
  label,
  checked,
  onChange,
  activeText = '已开启上架：保存后在前台智能体商店公开发布，用户可直接查看、免费试用与购买订阅',
  inactiveText = '未开启上架（草稿状态）：仅在后台管理端可见，前台商店不展示，适合编辑阶段保存'
}) => {
  return (
    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="text-xs font-bold text-white flex items-center gap-2">
          <span>{label}</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono border ${
              checked
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {checked ? '已开启上架' : '已关闭 (草稿)'}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          {checked ? activeText : inactiveText}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? 'bg-emerald-500 shadow-md shadow-emerald-500/30' : 'bg-slate-700'
        }`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

// ============================================================================
// AGENT LIST VIEW & EDIT/CREATE MODAL
// ============================================================================
interface ListProps {
  techForms: string[];
  appScenarios: string[];
  industries: string[];
}

const AgentListAdminView: React.FC<ListProps> = ({ techForms, appScenarios, industries }) => {
  const { agents, setAgents, models, showToast } = useApp();

  // Selected agent for edit, or true for creating new agent
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingAgent, setEditingAgent] = useState<Partial<AgentItem> | null>(null);

  // Selected agent for secondary detail view
  const [detailAgent, setDetailAgent] = useState<AgentItem | null>(null);

  // Search and filter inside Agent list
  const [searchQuery, setSearchQuery] = useState('');
  const [techFormFilter, setTechFormFilter] = useState('全部');
  const [statusFilter, setStatusFilter] = useState('全部');

  // Multi-select help state for form
  const [formAppScenarios, setFormAppScenarios] = useState<string[]>([]);
  const [formIndustries, setFormIndustries] = useState<string[]>([]);
  // Launch status toggle (default: false / 关闭)
  const [isPublishedToggle, setIsPublishedToggle] = useState<boolean>(false);

  // Filtering Logic
  const filteredAgents = useMemo(() => {
    return agents.filter(ag => {
      const matchSearch =
        ag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ag.slogan || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchForm = techFormFilter === '全部' || ag.techForm === techFormFilter || ag.appType === techFormFilter;
      const matchStatus = statusFilter === '全部' || ag.status === statusFilter;
      return matchSearch && matchForm && matchStatus;
    });
  }, [agents, searchQuery, techFormFilter, statusFilter]);

  // Open creation form (默认上架状态为关闭/草稿)
  const handleOpenCreate = () => {
    setEditingAgent({
      name: '',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      slogan: '',
      techForm: 'Agent' as any,
      description: '',
      useGuide: '',
      techDocs: '',
      freeTrialCount: 3,
      weekCardPrice: undefined,
      weekCardTokens: undefined,
      monthCardPrice: undefined,
      monthCardTokens: undefined,
      quarterCardPrice: undefined,
      quarterCardTokens: undefined,
      yearCardPrice: undefined,
      yearCardTokens: undefined,
      apiAddress: 'https://api.qianji.ai/v1/agent/invoke',
      status: '草稿',
      linkedModel: 'DeepSeek-R1'
    });
    setFormAppScenarios([]);
    setFormIndustries([]);
    setIsPublishedToggle(false); // 默认为关闭
    setIsEditing(true);
  };

  // Open edit form
  const handleOpenEdit = (ag: AgentItem) => {
    setEditingAgent(ag);
    const initialScenarios = ag.categoryTags && ag.categoryTags.length > 0 
      ? ag.categoryTags.slice(0, 3) 
      : ag.scene ? [ag.scene] : ['办公助理'];
    const initialInds = ag.industryTags && ag.industryTags.length > 0 
      ? ag.industryTags.slice(0, 3) 
      : ag.industry ? [ag.industry] : ['通用'];
    setFormAppScenarios(initialScenarios);
    setFormIndustries(initialInds);
    setIsPublishedToggle(ag.status === '已上架');
    setIsEditing(true);
  };

  // Handle Form Submit
  const handleSaveAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgent) return;

    if (!editingAgent.name?.trim()) {
      showToast('Agent名称不能为空');
      return;
    }
    if (editingAgent.name.length > 20) {
      showToast('Agent名称限20字以内');
      return;
    }
    if (!editingAgent.slogan?.trim()) {
      showToast('一句话简介不能为空');
      return;
    }
    if (editingAgent.slogan.length > 30) {
      showToast('一句话简介限30字以内');
      return;
    }
    if (formAppScenarios.length === 0) {
      showToast('请至少选择一个应用场景（最多3个）');
      return;
    }
    if (!editingAgent.description?.trim()) {
      showToast('功能介绍不能为空');
      return;
    }
    if (!editingAgent.apiAddress?.trim()) {
      showToast('API调用地址不能为空');
      return;
    }

    // 检查包周期会员卡套餐设定中至少必填一种
    const hasValidWeekCard = !!(editingAgent.weekCardPrice && editingAgent.weekCardPrice > 0 && editingAgent.weekCardTokens && editingAgent.weekCardTokens > 0);
    const hasValidMonthCard = !!(editingAgent.monthCardPrice && editingAgent.monthCardPrice > 0 && editingAgent.monthCardTokens && editingAgent.monthCardTokens > 0);
    const hasValidQuarterCard = !!(editingAgent.quarterCardPrice && editingAgent.quarterCardPrice > 0 && editingAgent.quarterCardTokens && editingAgent.quarterCardTokens > 0);
    const hasValidYearCard = !!(editingAgent.yearCardPrice && editingAgent.yearCardPrice > 0 && editingAgent.yearCardTokens && editingAgent.yearCardTokens > 0);

    if (!hasValidWeekCard && !hasValidMonthCard && !hasValidQuarterCard && !hasValidYearCard) {
      showToast('⚠️ 包周期会员卡套餐设定中至少需完整填写一种套餐（周卡/月卡/季卡/年卡）的价格和包含Token量！');
      return;
    }

    const isNew = !editingAgent.id;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const targetId = editingAgent.id || `ag_${Date.now()}`;
    const finalizedAgent: AgentItem = {
      id: targetId,
      name: editingAgent.name,
      avatar: editingAgent.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      slogan: editingAgent.slogan,
      techForm: editingAgent.techForm || 'Agent',
      appType: (editingAgent.techForm as any) || 'Agent',
      category: (editingAgent.category || 'dialogue'),
      description: editingAgent.description || '',
      scene: (formAppScenarios[0] || '办公助理') as any,
      industry: (formIndustries[0] || '通用') as any,
      categoryTags: formAppScenarios.slice(0, 3),
      industryTags: formIndustries.slice(0, 3),
      priceType: 'token',
      priceValue: 0,
      tags: editingAgent.tags || ['官方', '新上'],
      apiAddress: editingAgent.apiAddress || 'https://api.qianji.ai/v1/agent/invoke',
      pricePerTenThousandTokens: 0,
      freeTrialCount: editingAgent.freeTrialCount !== undefined ? Math.max(0, editingAgent.freeTrialCount) : 3,
      hasTrialQuota: (editingAgent.freeTrialCount || 0) > 0,
      trialQuotaVal: 0,
      trialQuotaValidityDays: 7,
      weekCardPrice: editingAgent.weekCardPrice,
      weekCardTokens: editingAgent.weekCardTokens,
      monthCardPrice: editingAgent.monthCardPrice,
      monthCardTokens: editingAgent.monthCardTokens,
      quarterCardPrice: editingAgent.quarterCardPrice,
      quarterCardTokens: editingAgent.quarterCardTokens,
      yearCardPrice: editingAgent.yearCardPrice,
      yearCardTokens: editingAgent.yearCardTokens,
      status: isPublishedToggle ? '已上架' : '草稿',
      linkedModel: editingAgent.linkedModel || 'DeepSeek-R1',
      rating: editingAgent.rating || 4.8,
      ratingCount: editingAgent.ratingCount || 12,
      usageCount: editingAgent.usageCount || 1250,
      subscribersCount: editingAgent.subscribersCount || 88,
      createdAt: editingAgent.createdAt || nowStr,
      author: editingAgent.author || 'AI运营中心官方研发',
      useGuide: editingAgent.useGuide || '',
      techDocs: editingAgent.techDocs || ''
    };

    if (isNew) {
      setAgents(prev => [finalizedAgent, ...prev]);
      showToast(`✨ Agent【${finalizedAgent.name}】已成功创建（状态：${finalizedAgent.status}）！`);
    } else {
      setAgents(prev => prev.map(a => a.id === finalizedAgent.id ? finalizedAgent : a));
      showToast(`📝 Agent【${finalizedAgent.name}】配置已成功更新并生效（状态：${finalizedAgent.status}）！`);
    }

    setIsEditing(false);
    setEditingAgent(null);
  };

  // Toggle Publish Status
  const togglePublishStatus = (ag: AgentItem) => {
    let nextStatus: AgentItem['status'] = '已上架';
    if (ag.status === '已上架') {
      nextStatus = '已停止新订阅';
    } else if (ag.status === '已停止新订阅') {
      nextStatus = '已上架';
    } else if (ag.status === '已下架' || ag.status === '草稿') {
      nextStatus = '已上架';
    }

    setAgents(prev => prev.map(a => a.id === ag.id ? { ...a, status: nextStatus } : a));
    showToast(`Agent【${ag.name}】的状态已变更为【${nextStatus}】`);
  };

  // Delete Agent
  const handleDeleteAgent = (id: string, name: string) => {
    if (confirm(`您确定要删除 Agent【${name}】吗？此操作不可撤销。`)) {
      setAgents(prev => prev.filter(a => a.id !== id));
      showToast(`🗑️ Agent【${name}】已成功从平台移除！`);
    }
  };

  // View Details (Mock trigger detail modal in AppContext)
  const { setDetailModalAgent } = useApp();

  return (
    <div className="space-y-6">
      {detailAgent ? (
        // SECONDARY PAGE: DETAIL VIEW
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDetailAgent(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回 Agent 列表</span>
              </button>
              <div>
                <h3 className="text-base font-black text-white">{detailAgent.name} 详情档案</h3>
                <p className="text-xs text-slate-400">Agent ID: {detailAgent.id}</p>
              </div>
            </div>
            <button
              onClick={() => {
                const ag = detailAgent;
                setDetailAgent(null);
                handleOpenEdit(ag);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>编辑此类目</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Card: Basic info */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <img src={detailAgent.avatar} alt={detailAgent.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-700 bg-slate-800" />
                <div>
                  <h4 className="text-base font-bold text-white">{detailAgent.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{detailAgent.slogan}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-mono font-bold rounded border border-indigo-500/20">
                    {detailAgent.linkedModel || '默认基座'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">技术形态</span>
                  <span className="text-slate-200 font-bold">{detailAgent.techForm || detailAgent.appType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">上架状态</span>
                  <span className="text-emerald-400 font-bold">{detailAgent.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">免费体验次数</span>
                  <span className="text-amber-400 font-mono font-bold">{detailAgent.freeTrialCount !== undefined ? detailAgent.freeTrialCount : 3} 次</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">累计调用量</span>
                  <span className="text-indigo-400 font-mono font-bold">{(detailAgent.usageCount || 0).toLocaleString()} 次</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">订阅用户数</span>
                  <span className="text-teal-400 font-mono font-bold">{(detailAgent.subscribersCount || 0).toLocaleString()} 人</span>
                </div>
              </div>
            </div>

            {/* Right Card: Descriptions & Guides */}
            <div className="md:col-span-2 space-y-4">
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <h5 className="font-bold text-slate-200 border-l-2 border-indigo-500 pl-2">功能介绍</h5>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{detailAgent.description || '暂无详细介绍'}</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <h5 className="font-bold text-slate-200 border-l-2 border-indigo-500 pl-2">API 接口地址</h5>
                <p className="font-mono text-indigo-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800 break-all">{detailAgent.apiAddress || 'https://api.qianji.ai/v1/agent/invoke'}</p>
              </div>

              {detailAgent.useGuide && (
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <h5 className="font-bold text-slate-200 border-l-2 border-indigo-500 pl-2">使用指南</h5>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">{detailAgent.useGuide}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : isEditing && editingAgent ? (
        // EDIT / CREATE FORM PANEL
        <form onSubmit={handleSaveAgent} className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-8 text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => { setIsEditing(false); setEditingAgent(null); }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="text-base font-black text-white">{editingAgent.id ? '编辑 Agent 属性' : '上架全新智能体'}</h3>
                <p className="text-xs text-slate-400">请准确填写各项元数据与套餐配置，这会同步影响前台的用户订阅体验</p>
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer transition"
            >
              保存并生效
            </button>
          </div>

          {/* PART 1: SHOW INFO */}
          <div className="space-y-5">
            <div className="text-xs font-black text-indigo-400 uppercase tracking-widest border-l-2 border-indigo-500 pl-2">
              第一部分：基本展示信息 (对应前台卡片与详情展示)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Agent 名称 */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Agent名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={20}
                  required
                  placeholder="限20字内，简要吸睛"
                  value={editingAgent.name || ''}
                  onChange={e => setEditingAgent({ ...editingAgent, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none transition"
                />
              </div>

              {/* 一句话简介 */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  一句话简介 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={30}
                  required
                  placeholder="限30字内，展示于前台商店卡片"
                  value={editingAgent.slogan || ''}
                  onChange={e => setEditingAgent({ ...editingAgent, slogan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none transition"
                />
              </div>
            </div>

            {/* Agent 头像上传组件 */}
            <ImageUploadField
              label="Agent头像 (支持本地上传、拖拽或输入URL)"
              value={editingAgent.avatar}
              onChange={(url) => setEditingAgent({ ...editingAgent, avatar: url })}
            />

            {/* 技术形态 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  技术形态 <span className="text-red-500">*</span>
                </label>
                <select
                  value={editingAgent.techForm || 'Agent'}
                  onChange={e => setEditingAgent({ ...editingAgent, techForm: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-500 outline-none transition font-bold"
                >
                  {techForms.map(form => (
                    <option key={form} value={form}>{form}</option>
                  ))}
                </select>
              </div>

              {/* 关联底座模型 */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  关联基座模型 <span className="text-slate-500 font-normal">(选择平台已有模型)</span>
                </label>
                <select
                  value={editingAgent.baseModelId || (models.find(m => m.name === editingAgent.linkedModel || m.name === editingAgent.baseModel)?.id || '')}
                  onChange={e => {
                    const selectedId = e.target.value;
                    const matchedModel = models.find(m => m.id === selectedId);
                    setEditingAgent({
                      ...editingAgent,
                      baseModelId: selectedId,
                      baseModel: matchedModel ? matchedModel.name : (editingAgent.baseModel || matchedModel?.name),
                      linkedModel: matchedModel ? matchedModel.name : editingAgent.linkedModel
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-500 outline-none transition font-bold cursor-pointer"
                >
                  <option value="">-- 请选择平台已有模型 --</option>
                  {models.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.vendor || 'AI底座'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 应用场景 (多选下拉，最多选3个) */}
            <MultiSelectDropdown
              label="应用场景"
              required
              options={appScenarios}
              selectedValues={formAppScenarios}
              onChange={(vals) => setFormAppScenarios(vals)}
              max={3}
              placeholder="请下拉选择应用场景（最多选3个）..."
              badgeTheme="indigo"
            />

            {/* 行业领域 (多选下拉，最多选3个) */}
            <MultiSelectDropdown
              label="行业领域 (选填)"
              options={industries}
              selectedValues={formIndustries}
              onChange={(vals) => setFormIndustries(vals)}
              max={3}
              placeholder="请下拉选择行业领域（最多选3个）..."
              badgeTheme="teal"
            />

            {/* 功能介绍 (Markdown 编辑器) */}
            <MarkdownEditorField
              label="功能介绍"
              required
              rows={5}
              placeholder="详细说明此智能体的功能特性、算法机制、对业务系统的效率提升..."
              value={editingAgent.description || ''}
              onChange={(val) => setEditingAgent({ ...editingAgent, description: val })}
              helperText="支持标准 Markdown 语法，包括加粗、斜体、标题、代码块、列表及超链接等"
            />

            {/* 使用指南 & 技术文档 (Markdown 编辑器) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <MarkdownEditorField
                label="使用指南"
                rows={5}
                placeholder="如何快速开始、交互技巧、提示词优化要点..."
                value={editingAgent.useGuide || ''}
                onChange={(val) => setEditingAgent({ ...editingAgent, useGuide: val })}
              />

              <MarkdownEditorField
                label="技术文档 / 开发者API集成"
                rows={5}
                placeholder="API调用规范、请求头部鉴权、典型 Python/Node.js 接入代码..."
                value={editingAgent.techDocs || ''}
                onChange={(val) => setEditingAgent({ ...editingAgent, techDocs: val })}
              />
            </div>
          </div>

          {/* PART 2: ACCESSIBLE ENDPOINT CONFIG */}
          <div className="space-y-4">
            <div className="text-xs font-black text-indigo-400 uppercase tracking-widest border-l-2 border-indigo-500 pl-2">
              第二部分：接入配置 (后端服务调用通道)
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                API调用地址 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="https://api.qianji.ai/v1/agent/xxx"
                value={editingAgent.apiAddress || ''}
                onChange={e => setEditingAgent({ ...editingAgent, apiAddress: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>

          {/* PART 3: PRICING & TIERS */}
          <div className="space-y-5">
            <div className="text-xs font-black text-indigo-400 uppercase tracking-widest border-l-2 border-indigo-500 pl-2">
              第三部分：包周期套餐与免费试用设置
            </div>

            {/* 免费试用次数设置 */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>免费试用次数设置</span>
                  <span className="text-[10px] text-slate-500 font-normal">（新用户在未购买套餐前可免费发起调用的次数）</span>
                </label>
                <div className="flex items-center gap-2">
                  {[0, 3, 5, 10].map(cnt => (
                    <button
                      type="button"
                      key={cnt}
                      onClick={() => setEditingAgent({ ...editingAgent, freeTrialCount: cnt })}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border transition cursor-pointer ${
                        editingAgent.freeTrialCount === cnt
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {cnt === 0 ? '不提供试用' : `${cnt} 次`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  step={1}
                  placeholder="如：3"
                  value={editingAgent.freeTrialCount !== undefined ? editingAgent.freeTrialCount : 3}
                  onChange={e => setEditingAgent({ ...editingAgent, freeTrialCount: Math.max(0, parseInt(e.target.value) || 0) })}
                  className="w-40 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-500 outline-none transition font-mono font-bold"
                />
                <span className="text-xs text-slate-400">次免费调用（填 0 表示不赠送免费试用额度）</span>
              </div>
            </div>

            {/* 包周期会员卡套餐设定 (至少必填一种) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">
                  包周期会员卡套餐设定 <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-indigo-400 font-medium">
                  (周卡 / 月卡 / 季卡 / 年卡中至少需完整填写 1 种套餐的价格与包含Token量)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* 周卡 */}
                <div className={`p-3.5 rounded-xl bg-slate-950 border transition space-y-2.5 ${
                  editingAgent.weekCardPrice && editingAgent.weekCardTokens ? 'border-indigo-500/50 shadow-md shadow-indigo-500/10' : 'border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-indigo-400">⚡ 周卡套餐 (7天)</span>
                    {editingAgent.weekCardPrice && editingAgent.weekCardTokens ? (
                      <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 font-bold">已启用</span>
                    ) : (
                      <span className="text-[9px] text-slate-600">未启用</span>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">套餐售价 (元)</label>
                    <input
                      type="number"
                      step={0.1}
                      min={0.1}
                      placeholder="如: 49"
                      value={editingAgent.weekCardPrice || ''}
                      onChange={e => setEditingAgent({ ...editingAgent, weekCardPrice: parseFloat(e.target.value) || undefined })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:border-indigo-500 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">包含额度 (万Token)</label>
                    <input
                      type="number"
                      min={1}
                      placeholder="如: 200"
                      value={editingAgent.weekCardTokens || ''}
                      onChange={e => setEditingAgent({ ...editingAgent, weekCardTokens: parseInt(e.target.value) || undefined })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:border-indigo-500 outline-none font-mono"
                    />
                  </div>
                </div>

                {/* 月卡 */}
                <div className={`p-3.5 rounded-xl bg-slate-950 border transition space-y-2.5 ${
                  editingAgent.monthCardPrice && editingAgent.monthCardTokens ? 'border-indigo-500/50 shadow-md shadow-indigo-500/10' : 'border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-indigo-400">⚡ 月卡套餐 (30天)</span>
                    {editingAgent.monthCardPrice && editingAgent.monthCardTokens ? (
                      <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 font-bold">已启用</span>
                    ) : (
                      <span className="text-[9px] text-slate-600">未启用</span>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">套餐售价 (元)</label>
                    <input
                      type="number"
                      step={0.1}
                      min={0.1}
                      placeholder="如: 169"
                      value={editingAgent.monthCardPrice || ''}
                      onChange={e => setEditingAgent({ ...editingAgent, monthCardPrice: parseFloat(e.target.value) || undefined })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:border-indigo-500 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">包含额度 (万Token)</label>
                    <input
                      type="number"
                      min={1}
                      placeholder="如: 1000"
                      value={editingAgent.monthCardTokens || ''}
                      onChange={e => setEditingAgent({ ...editingAgent, monthCardTokens: parseInt(e.target.value) || undefined })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:border-indigo-500 outline-none font-mono"
                    />
                  </div>
                </div>

                {/* 季卡 */}
                <div className={`p-3.5 rounded-xl bg-slate-950 border transition space-y-2.5 ${
                  editingAgent.quarterCardPrice && editingAgent.quarterCardTokens ? 'border-indigo-500/50 shadow-md shadow-indigo-500/10' : 'border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-indigo-400">⚡ 季卡套餐 (90天)</span>
                    {editingAgent.quarterCardPrice && editingAgent.quarterCardTokens ? (
                      <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 font-bold">已启用</span>
                    ) : (
                      <span className="text-[9px] text-slate-600">未启用</span>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">套餐售价 (元)</label>
                    <input
                      type="number"
                      step={0.1}
                      min={0.1}
                      placeholder="如: 459"
                      value={editingAgent.quarterCardPrice || ''}
                      onChange={e => setEditingAgent({ ...editingAgent, quarterCardPrice: parseFloat(e.target.value) || undefined })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:border-indigo-500 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">包含额度 (万Token)</label>
                    <input
                      type="number"
                      min={1}
                      placeholder="如: 3500"
                      value={editingAgent.quarterCardTokens || ''}
                      onChange={e => setEditingAgent({ ...editingAgent, quarterCardTokens: parseInt(e.target.value) || undefined })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:border-indigo-500 outline-none font-mono"
                    />
                  </div>
                </div>

                {/* 年卡 */}
                <div className={`p-3.5 rounded-xl bg-slate-950 border transition space-y-2.5 ${
                  editingAgent.yearCardPrice && editingAgent.yearCardTokens ? 'border-indigo-500/50 shadow-md shadow-indigo-500/10' : 'border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-indigo-400">⚡ 年卡套餐 (365天)</span>
                    {editingAgent.yearCardPrice && editingAgent.yearCardTokens ? (
                      <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 font-bold">已启用</span>
                    ) : (
                      <span className="text-[9px] text-slate-600">未启用</span>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">套餐售价 (元)</label>
                    <input
                      type="number"
                      step={0.1}
                      min={0.1}
                      placeholder="如: 1499"
                      value={editingAgent.yearCardPrice || ''}
                      onChange={e => setEditingAgent({ ...editingAgent, yearCardPrice: parseFloat(e.target.value) || undefined })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:border-indigo-500 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">包含额度 (万Token)</label>
                    <input
                      type="number"
                      min={1}
                      placeholder="如: 15000"
                      value={editingAgent.yearCardTokens || ''}
                      onChange={e => setEditingAgent({ ...editingAgent, yearCardTokens: parseInt(e.target.value) || undefined })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:border-indigo-500 outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PART 4: LAUNCH STATUS (SWITCH BUTTON, DEFAULT OFF) */}
          <div className="space-y-4">
            <div className="text-xs font-black text-indigo-400 uppercase tracking-widest border-l-2 border-indigo-500 pl-2">
              第四部分：上架状态设定
            </div>

            <ToggleSwitch
              label="是否上架至前台商店"
              checked={isPublishedToggle}
              onChange={(checked) => setIsPublishedToggle(checked)}
              activeText="已开启上架：保存后将在前台 AI Agent 商店公开发布，用户可浏览、体验试用及购买会员订阅"
              inactiveText="已关闭上架（草稿状态）：仅在后台管理端可见与调试，前台普通用户不可见"
            />
          </div>

          {/* Buttons */}
          <div className="border-t border-slate-800 pt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => { setIsEditing(false); setEditingAgent(null); }}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition cursor-pointer"
            >
              取消返回
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold cursor-pointer transition shadow-md shadow-indigo-600/30"
            >
              提交保存
            </button>
          </div>
        </form>
      ) : (
        // TABLE LIST VIEW
        <div className="space-y-5">
          {/* Query and Add header */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-end gap-4 justify-between">
            <div className="flex flex-1 flex-col md:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索 Agent 标题名称、简介..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none transition"
                />
              </div>

              {/* Tech Form Filter */}
              <div className="w-full md:w-44">
                <select
                  value={techFormFilter}
                  onChange={e => setTechFormFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold focus:border-indigo-500 outline-none transition"
                >
                  <option value="全部">全部技术形态</option>
                  {techForms.map(form => (
                    <option key={form} value={form}>{form}</option>
                  ))}
                </select>
              </div>

              {/* Status filter */}
              <div className="w-full md:w-40">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold focus:border-indigo-500 outline-none transition"
                >
                  <option value="全部">全部上架状态</option>
                  <option value="已上架">已上架</option>
                  <option value="草稿">草稿</option>
                  <option value="已停止新订阅">已停止新订阅</option>
                  <option value="已下架">已下架</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleOpenCreate}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer transition flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>添加新 Agent</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900">
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                智能体 Agent 主列表
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 font-mono border border-indigo-500/20">
                共 {filteredAgents.length} 款 Agent
              </span>
            </div>

            {filteredAgents.length === 0 ? (
              <div className="py-20 text-center text-slate-500 space-y-2">
                <Bot className="w-10 h-10 mx-auto text-indigo-400 opacity-50" />
                <h4 className="text-sm font-bold text-slate-300">没有检索到对应的 Agent</h4>
                <p className="text-xs">请清空搜索词或更改筛选选项重试</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950/60 text-slate-400 uppercase text-[10px] font-black border-b border-slate-800">
                      <th className="py-3 px-3">Logo</th>
                      <th className="py-3 px-3">智能体名称</th>
                      <th className="py-3 px-3">一句话简介</th>
                      <th className="py-3 px-3">关联模型</th>
                      <th className="py-3 px-3">技术形态</th>
                      <th className="py-3 px-3">应用场景</th>
                      <th className="py-3 px-3">最低套餐价</th>
                      <th className="py-3 px-3">免费试用</th>
                      <th className="py-3 px-3 text-right">调用量</th>
                      <th className="py-3 px-3 text-right">订阅用户</th>
                      <th className="py-3 px-3">上架状态</th>
                      <th className="py-3 px-4 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-slate-300">
                    {filteredAgents.map(ag => {
                      const minPrice = ag.weekCardPrice || ag.monthCardPrice || ag.quarterCardPrice || ag.yearCardPrice;
                      return (
                        <tr key={ag.id} className="hover:bg-slate-800/30 transition">
                          {/* Logo */}
                          <td className="py-3.5 px-3">
                            <img
                              src={ag.avatar}
                              alt={ag.name}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-700 bg-slate-800 shrink-0"
                            />
                          </td>

                          {/* Agent Name */}
                          <td className="py-3.5 px-3 font-extrabold text-white text-xs whitespace-nowrap">
                            {ag.name}
                          </td>

                          {/* Slogan */}
                          <td className="py-3.5 px-3 text-[11px] text-slate-400 max-w-[200px] truncate">
                            {ag.slogan}
                          </td>

                          {/* Linked Model */}
                          <td className="py-3.5 px-3">
                            {ag.linkedModel ? (
                              <span className="text-[10px] px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20 font-mono font-bold whitespace-nowrap">
                                {ag.linkedModel}
                              </span>
                            ) : (
                              <span className="text-slate-600 text-[10px]">-</span>
                            )}
                          </td>

                          {/* Tech Form Badge */}
                          <td className="py-3.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 whitespace-nowrap">
                              {ag.techForm || ag.appType || 'Agent'}
                            </span>
                          </td>

                          {/* Scenarios */}
                          <td className="py-3.5 px-3">
                            <div className="flex flex-wrap gap-1 max-w-[150px]">
                              {(ag.categoryTags || ['办公助理']).slice(0, 3).map(tag => (
                                <span key={tag} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] border border-slate-700">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Min Price */}
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            {minPrice ? (
                              <div className="text-amber-400 font-mono font-bold text-xs">
                                ¥{minPrice} 起
                              </div>
                            ) : (
                              <div className="text-slate-500 text-xs">未配置</div>
                            )}
                          </td>

                          {/* Free Trial */}
                          <td className="py-3.5 px-3 text-center whitespace-nowrap">
                            <span className="text-emerald-400 font-bold font-mono text-xs">
                              {ag.freeTrialCount !== undefined ? ag.freeTrialCount : 3}
                            </span> <span className="text-slate-500 text-[10px]">次</span>
                          </td>

                          {/* Calls Count */}
                          <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-200 whitespace-nowrap">
                            {(ag.usageCount || 0).toLocaleString()} 次
                          </td>

                          {/* Subscribers Count */}
                          <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-200 whitespace-nowrap">
                            {(ag.subscribersCount || 0).toLocaleString()} 人
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            {ag.status === '已上架' ? (
                              <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                已上架
                              </span>
                            ) : ag.status === '已停止新订阅' ? (
                              <span className="flex items-center gap-1 text-amber-400 text-[11px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                停止新订阅
                              </span>
                            ) : ag.status === '已下架' ? (
                              <span className="flex items-center gap-1 text-red-400 text-[11px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                已下架
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-slate-500 text-[11px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                草稿
                              </span>
                            )}
                          </td>

                          {/* Actions column */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              {/* View details */}
                              <button
                                onClick={() => setDetailAgent(ag)}
                                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 border border-slate-700 transition"
                                title="查看详情"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => handleOpenEdit(ag)}
                                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-teal-400 hover:text-teal-300 border border-slate-700 transition"
                                title="编辑配置"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Toggle publish status */}
                              <button
                                onClick={() => togglePublishStatus(ag)}
                                className={`p-1.5 rounded border transition ${
                                  ag.status === '已上架'
                                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                }`}
                                title={ag.status === '已上架' ? '停止新订阅' : '重新上架'}
                              >
                                <Power className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteAgent(ag.id, ag.name)}
                                className="p-1.5 rounded bg-slate-800 hover:bg-red-900 hover:text-red-300 text-red-400 border border-slate-700 transition"
                                title="物理删除"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SUBVIEW 2: AGENT ORDERS MANAGEMENT
// ============================================================================
interface OrdersProps {
  orders: AgentOrderItem[];
  setOrders: React.Dispatch<React.SetStateAction<AgentOrderItem[]>>;
}

const AgentOrdersAdminView: React.FC<OrdersProps> = ({ orders, setOrders }) => {
  // Query Filters State
  const [statusFilter, setStatusFilter] = useState('全部');
  const [typeFilter, setTypeFilter] = useState('全部');
  const [searchWord, setSearchWord] = useState('');
  const [dateFilter, setDateFilter] = useState(''); // Simple filter YYYY-MM-DD

  // Selected Order for Detail View
  const [selectedOrder, setSelectedOrder] = useState<AgentOrderItem | null>(null);

  // Filtered Orders calculation
  const filteredOrders = useMemo(() => {
    return orders.filter(ord => {
      // 1. Status Filter
      if (statusFilter !== '全部' && ord.status !== statusFilter) return false;
      // 2. Type Filter
      if (typeFilter !== '全部' && ord.orderType !== typeFilter) return false;
      // 3. Search word (Order No, User name, Agent Name)
      if (searchWord.trim()) {
        const sw = searchWord.toLowerCase();
        const matchesNo = ord.id.toLowerCase().includes(sw);
        const matchesUser = ord.userName.toLowerCase().includes(sw);
        const matchesAgent = ord.agentName.toLowerCase().includes(sw);
        if (!matchesNo && !matchesUser && !matchesAgent) return false;
      }
      // 4. Simple Date filter
      if (dateFilter && !ord.createdAt.startsWith(dateFilter)) return false;

      return true;
    });
  }, [orders, statusFilter, typeFilter, searchWord, dateFilter]);

  return (
    <div className="space-y-6">
      {/* Search and Filters panel */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
          <span>订单检索控制中心</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Text search */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">综合检索 (订单号、用户名、智能体)</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="输入关键信息..."
                value={searchWord}
                onChange={e => setSearchWord(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Status filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">订单生效状态</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500 font-bold"
            >
              <option value="全部">全部状态</option>
              <option value="已生效">已生效 (运行中)</option>
              <option value="已用完">已用完</option>
              <option value="已过期">已过期</option>
            </select>
          </div>

          {/* Type filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">订单付费类型</label>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500 font-bold"
            >
              <option value="全部">全部付费方式</option>
              <option value="免费领取">免费领取</option>
              <option value="按Token订阅">按Token订阅</option>
              <option value="周卡">周卡</option>
              <option value="月卡">月卡</option>
              <option value="季卡">季卡</option>
              <option value="年卡">年卡</option>
            </select>
          </div>

          {/* Date Picker (Simple) */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">下单时间筛选</label>
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500 font-bold uppercase"
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span>Agent 订阅与结算账单流水</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
            共查询到 {filteredOrders.length} 个订单记录
          </span>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="py-20 text-center text-slate-500 space-y-2">
            <Receipt className="w-10 h-10 mx-auto text-emerald-400 opacity-50 animate-pulse" />
            <h4 className="text-sm font-bold text-slate-300">没有查找到对应的订单数据</h4>
            <p className="text-xs">您可以调整上方的日期范围、订单状态、或关键字进行重试</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/60 text-slate-400 uppercase text-[10px] font-black border-b border-slate-800">
                  <th className="py-3 px-4">唯一订单号</th>
                  <th className="py-3 px-3">下单用户</th>
                  <th className="py-3 px-3">订购 Agent</th>
                  <th className="py-3 px-3">套餐类型</th>
                  <th className="py-3 px-3 text-right">实付金额</th>
                  <th className="py-3 px-3 text-right">所含Token量</th>
                  <th className="py-3 px-3 text-right">已消耗/剩余</th>
                  <th className="py-3 px-3">状态</th>
                  <th className="py-3 px-3">创建时间</th>
                  <th className="py-3 px-4 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {filteredOrders.map(ord => {
                  const isFree = ord.orderAmount === 0;
                  return (
                    <tr key={ord.id} className="hover:bg-slate-800/30 transition">
                      {/* Order No */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                        {ord.id}
                      </td>

                      {/* User */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={ord.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&auto=format&fit=crop&q=80'}
                            alt={ord.userName}
                            className="w-6 h-6 rounded-full object-cover border border-slate-800 shrink-0"
                          />
                          <span className="font-bold text-slate-200">{ord.userName}</span>
                        </div>
                      </td>

                      {/* Agent Name */}
                      <td className="py-3.5 px-3 font-extrabold text-white text-xs">
                        {ord.agentName}
                      </td>

                      {/* Order Type */}
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.orderType === '免费领取'
                            ? 'bg-slate-800 text-slate-400 border border-slate-700'
                            : ord.orderType.includes('卡')
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {ord.orderType}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-3 text-right font-black font-mono">
                        {isFree ? (
                          <span className="text-emerald-400 text-xs">免费</span>
                        ) : (
                          <span className="text-white text-xs">¥{ord.orderAmount.toFixed(2)}</span>
                        )}
                      </td>

                      {/* Token Quant */}
                      <td className="py-3.5 px-3 text-right font-bold font-mono text-slate-200">
                        {ord.tokenAmount} 万Token
                      </td>

                      {/* Used and remaining */}
                      <td className="py-3.5 px-3 text-right font-mono text-[11px]">
                        <div className="text-slate-300">
                          已用: <span className="text-slate-400">{ord.usedTokens.toFixed(1)}万</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          剩: <span className="text-indigo-400">{(ord.tokenAmount - ord.usedTokens).toFixed(1)}万</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        {ord.status === '已生效' ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20 font-bold">
                            已生效
                          </span>
                        ) : ord.status === '已用完' ? (
                          <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 text-[10px] border border-yellow-500/20 font-bold">
                            已用完
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] border border-red-500/20 font-bold">
                            已过期
                          </span>
                        )}
                      </td>

                      {/* Created time */}
                      <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {ord.createdAt}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition text-[11px] font-bold cursor-pointer"
                        >
                          查看详情
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECONDARY PAGE: ORDER DETAIL */}
      {selectedOrder ? (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 text-slate-100">
          {/* Page Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回订阅订单列表</span>
              </button>
              <div>
                <h4 className="text-sm font-black text-white">Agent 账单流向详情档案</h4>
                <p className="text-xs text-slate-400">系统唯一订单号: {selectedOrder.id}</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 bg-slate-800 text-indigo-400 rounded-lg border border-slate-700">
              {selectedOrder.status}
            </span>
          </div>

          {/* Details Grid */}
          <div className="space-y-6">
            {/* Basic Info grid */}
            <div className="space-y-3">
              <h5 className="text-xs font-black text-slate-400 uppercase tracking-wider border-l-2 border-indigo-500 pl-2">
                1. 账期基础档案信息
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 block">系统唯一订单号</span>
                  <span className="font-mono text-slate-200 font-bold mt-0.5 block">{selectedOrder.id}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">订购客户姓名</span>
                  <span className="text-slate-200 font-bold mt-0.5 block">{selectedOrder.userName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">订购智能体 (Agent)</span>
                  <span className="text-slate-200 font-bold mt-0.5 block">{selectedOrder.agentName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">订单付费套餐类别</span>
                  <span className="text-slate-200 font-bold mt-0.5 block">{selectedOrder.orderType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">结算订单状态</span>
                  <span className="mt-0.5 block">
                    {selectedOrder.status === '已生效' ? (
                      <span className="text-emerald-400 font-bold">● 已生效 (正常运行)</span>
                    ) : selectedOrder.status === '已用完' ? (
                      <span className="text-yellow-400 font-bold">● 已用完</span>
                    ) : (
                      <span className="text-red-400 font-bold">● 已过期</span>
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">账期创建时序</span>
                  <span className="font-mono text-slate-300 mt-0.5 block">{selectedOrder.createdAt}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">支付时效</span>
                  <span className="font-mono text-slate-300 mt-0.5 block">{selectedOrder.payTime}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">起算生效期</span>
                  <span className="font-mono text-slate-300 mt-0.5 block">{selectedOrder.startTime}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">到期释放时间</span>
                  <span className="font-mono text-slate-300 mt-0.5 block">{selectedOrder.expireTime}</span>
                </div>
              </div>
            </div>

            {/* Order Breakdown Grid */}
            <div className="space-y-3">
              <h5 className="text-xs font-black text-slate-400 uppercase tracking-wider border-l-2 border-indigo-500 pl-2">
                2. 资源配额与结算扣减明细
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 block">应付/实付金额</span>
                  <span className="text-base font-black text-emerald-400 font-mono mt-1 block">
                    ¥{selectedOrder.orderAmount.toFixed(2)}
                  </span>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 block">套餐包容量</span>
                  <span className="text-base font-black text-indigo-400 font-mono mt-1 block">
                    {selectedOrder.tokenAmount} 万
                  </span>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 block">已累计消耗量</span>
                  <span className="text-base font-black text-slate-300 font-mono mt-1 block">
                    {selectedOrder.usedTokens.toFixed(2)} 万
                  </span>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 block">可用剩余存量</span>
                  <span className="text-base font-black text-teal-400 font-mono mt-1 block">
                    {(selectedOrder.tokenAmount - selectedOrder.usedTokens).toFixed(2)} 万
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

// ============================================================================
// SUBVIEW 3: USAGE STATISTICS
// ============================================================================
interface StatsProps {
  techForms: string[];
  appScenarios: string[];
}

const AgentStatsAdminView: React.FC<StatsProps> = ({ techForms, appScenarios }) => {
  const { agents } = useApp();

  // 1. Calculate General Aggregated Stats
  const totalAgents = agents.length;
  const totalCalls = useMemo(() => {
    return agents.reduce((sum, item) => sum + (item.usageCount || 0), 0) + 128400; // Adding mock baseline
  }, [agents]);

  const totalTokens = '84.2 亿'; // Large system wide mock number
  const totalRevenue = useMemo(() => {
    return (
      agents.reduce((sum, item) => {
        const subscribers = item.subscribersCount || 0;
        const avgPrice = item.pricePerTenThousandTokens ? 45 : 0; // average card price if not free
        return sum + subscribers * avgPrice;
      }, 0) + 124500
    );
  }, [agents]);

  // 2. Data rankings (Top 10 Agents by Calls)
  const top10AgentsData = useMemo(() => {
    return [...agents]
      .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
      .slice(0, 10)
      .map(item => ({
        name: item.name.length > 8 ? item.name.substring(0, 8) + '...' : item.name,
        '调用次数': item.usageCount || 0,
        '订阅数': item.subscribersCount || 0
      }));
  }, [agents]);

  // 3. App Scenarios pie distribution chart data
  const scenarioDistributionData = useMemo(() => {
    const counts: Record<string, number> = {};
    appScenarios.forEach(sc => {
      counts[sc] = 0;
    });

    agents.forEach(item => {
      if (item.categoryTags) {
        item.categoryTags.forEach(tag => {
          if (counts[tag] !== undefined) {
            counts[tag]++;
          } else {
            counts[tag] = 1;
          }
        });
      }
    });

    return Object.keys(counts)
      .map(key => ({
        name: key,
        value: counts[key] === 0 ? 1 : counts[key] // Fallback baseline for visual beauty
      }))
      .filter(item => item.value > 0);
  }, [agents, appScenarios]);

  // 4. Tech forms distribution pie chart data
  const techFormDistributionData = useMemo(() => {
    const counts: Record<string, number> = {};
    techForms.forEach(form => {
      counts[form] = 0;
    });

    agents.forEach(item => {
      const form = item.techForm || item.appType || '工作流';
      if (counts[form] !== undefined) {
        counts[form]++;
      } else {
        counts[form] = 1;
      }
    });

    return Object.keys(counts)
      .map(key => ({
        name: key,
        value: counts[key] === 0 ? 1 : counts[key]
      }))
      .filter(item => item.value > 0);
  }, [agents, techForms]);

  return (
    <div className="space-y-6 text-slate-100">
      {/* 4 Cards Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Agents */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
          <span className="text-xs text-slate-400 block">总 Agent 运营数量</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">{totalAgents} 款</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              已全量上架
            </span>
          </div>
          <p className="text-[10px] text-slate-500 border-t border-slate-800 pt-2 mt-2">其中包含草稿与测试沙箱</p>
        </div>

        {/* Total calls */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
          <span className="text-xs text-slate-400 block">总调用次数</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">{totalCalls.toLocaleString()} 次</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              +15.4% 日增
            </span>
          </div>
          <p className="text-[10px] text-slate-500 border-t border-slate-800 pt-2 mt-2">API 路由级网关流向累计</p>
        </div>

        {/* Total Token */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
          <span className="text-xs text-slate-400 block">总 Token 消耗</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">{totalTokens}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              流式吞吐
            </span>
          </div>
          <p className="text-[10px] text-slate-500 border-t border-slate-800 pt-2 mt-2">基于 LLM 模型底层算力节点统计</p>
        </div>

        {/* Total Revenue */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
          <span className="text-xs text-slate-400 block">累计总营收</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-emerald-400">¥{totalRevenue.toLocaleString()}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              分成已打款
            </span>
          </div>
          <p className="text-[10px] text-slate-500 border-t border-slate-800 pt-2 mt-2">算力会员订购与Token计费结算</p>
        </div>
      </div>

      {/* Grid of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: TOP 10 AGENTS CALLS */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div>
            <h4 className="text-sm font-black text-white">Agent 热门调用排行榜 (Top 10)</h4>
            <p className="text-xs text-slate-400">展示当前前台调用热度最高的 10 个智能体服务</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top10AgentsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="调用次数" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: TOKEN TREND */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div>
            <h4 className="text-sm font-black text-white">Token 流量吞吐趋势 (近30天)</h4>
            <p className="text-xs text-slate-400">平台全量 Agent API 端吞吐指标时序变化监控</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockUsageTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="tokens" name="万Token量" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="calls" name="调用频次" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: APPLICATION SCENARIO PIE */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div>
            <h4 className="text-sm font-black text-white">应用场景产品分布比例</h4>
            <p className="text-xs text-slate-400">全站智能体对应各应用场景领域的数量与活跃权重占比</p>
          </div>
          <div className="h-64 flex flex-col md:flex-row items-center justify-around gap-4">
            <div className="w-1/2 h-full min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scenarioDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {scenarioDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend to fit design */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              {scenarioDistributionData.map((entry, idx) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-slate-400 font-bold">{entry.name}</span>
                  <span className="text-[10px] font-mono text-slate-500">({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CHART 4: TECH FORM PIE */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div>
            <h4 className="text-sm font-black text-white">技术形态核心比重占比</h4>
            <p className="text-xs text-slate-400">当前在架智能体基于 Chatbot, Agent, 工作流等的技术分布比例</p>
          </div>
          <div className="h-64 flex flex-col md:flex-row items-center justify-around gap-4">
            <div className="w-1/2 h-full min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={techFormDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {techFormDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs">
              {techFormDistributionData.map((entry, idx) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[(idx + 3) % COLORS.length] }} />
                  <span className="text-slate-400 font-bold">{entry.name}</span>
                  <span className="text-[10px] font-mono text-slate-500">({entry.value} 款)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL RAW DATA TABLE */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            <span>各智能体 Agent 核心调用与用量明细大表</span>
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/60 text-slate-400 uppercase text-[10px] font-black border-b border-slate-800">
                <th className="py-3 px-4">智能体名称</th>
                <th className="py-3 px-3">技术架构形态</th>
                <th className="py-3 px-3 text-right">累计调用次数</th>
                <th className="py-3 px-3 text-right">消耗Token估算</th>
                <th className="py-3 px-3 text-right">当前订阅用户数</th>
                <th className="py-3 px-4 text-right">累计总营收</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300">
              {agents.map(ag => {
                const calls = ag.usageCount || 0;
                const tokensEst = (calls * 1.45).toFixed(1); // Mock token multiplier
                const revenueEst = (ag.subscribersCount || 0) * (ag.pricePerTenThousandTokens ? 149 : 0);
                return (
                  <tr key={ag.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-bold text-white">{ag.name}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px]">
                        {ag.techForm || ag.appType || '工作流'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-200">
                      {calls.toLocaleString()} 次
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-300">
                      {tokensEst} 万
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-200">
                      {(ag.subscribersCount || 0).toLocaleString()} 人
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                      ¥{revenueEst.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

