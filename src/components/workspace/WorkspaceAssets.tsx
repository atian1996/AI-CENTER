import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  Database, 
  Wrench, 
  Bookmark, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Edit3, 
  Trash2, 
  Key, 
  BarChart2, 
  Download, 
  UserCheck, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { DatasetApplication } from '../../types';
import { mockDatasetApplications } from '../../data/mockData';

export const WorkspaceAssets: React.FC = () => {
  const { 
    userAgents, 
    datasets, 
    skills, 
    favorites, 
    setWorkspaceSubTab, 
    showToast, 
    openModal,
    setSelectedMainTab,
    toggleFavoriteAgent,
    openAgentDetail
  } = useApp();

  const [activeAssetTab, setActiveAssetTab] = useState<'agents' | 'datasets' | 'skills' | 'favorites'>('agents');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Dataset applications state
  const [applications, setApplications] = useState<DatasetApplication[]>(mockDatasetApplications);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const handleApprove = (id: string, pass: boolean) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: pass ? '已通过' : '已驳回' } : a));
    showToast(pass ? '已通过数据集使用申请！' : '已驳回该申请');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header & SubTabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>我的资产</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700">
              资产库中心
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            统一管理您上架、创建与收藏的 Agent 应用、数据集 Corpus、Skill 插件与云端资源
          </p>
        </div>

        {/* Primary Create Button */}
        <div>
          {activeAssetTab === 'agents' && (
            <button
              onClick={() => openModal('createAgent')}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>创建 Agent</span>
            </button>
          )}

          {activeAssetTab === 'datasets' && (
            <button
              onClick={() => showToast('上传数据集功能已拉起，选择 CSV/Parquet/JSONL 文件')}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>上传数据集</span>
            </button>
          )}

          {activeAssetTab === 'skills' && (
            <button
              onClick={() => showToast('上传 Skill 插件功能已拉起')}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>上传 Skill</span>
            </button>
          )}
        </div>
      </div>

      {/* SubTabs bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-extrabold">
        {[
          { key: 'agents', label: '我的 Agent', count: userAgents.length, icon: Bot },
          { key: 'datasets', label: '我的数据集', count: datasets.length, icon: Database },
          { key: 'skills', label: '我的 Skill', count: skills.length, icon: Wrench },
          { key: 'favorites', label: '我的收藏', count: favorites.length, icon: Bookmark },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAssetTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveAssetTab(tab.key as any)}
              className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
                isActive 
                  ? 'border-indigo-600 text-indigo-600 font-black' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 1. SubTab: 我的 Agent */}
      {activeAssetTab === 'agents' && (
        <div className="space-y-6">
          
          {/* Section 1: 已购 Agent 列表 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-600" />
                <span>已购 Agent 资产 ({userAgents.filter(a => a.isPurchased).length})</span>
              </h3>
              <button
                onClick={() => setSelectedMainTab('marketplace')}
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>在 Agent 商店中探索更多 →</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userAgents.filter(a => a.isPurchased).map(ag => (
                <div
                  key={ag.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl font-bold shadow-xs">
                          {ag.avatar}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900 line-clamp-1">{ag.name}</h4>
                          <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                            <span className="text-indigo-600 font-bold">{ag.priceModel || (ag.priceType === 'free' ? '免费' : '按Token计费')}</span>
                            <span>•</span>
                            <span>{ag.version || 'v1.0.0'}</span>
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                        已授权
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 font-medium line-clamp-2 leading-relaxed">
                      {ag.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>今日调用: <strong className="text-indigo-600 font-bold">{ag.todayTokenUsage || 1234} Token</strong></span>
                      <span>开发者: <strong className="text-slate-800">{ag.developer || ag.author}</strong></span>
                    </div>

                    {/* Action buttons: [对话] [API] [用量] */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        onClick={() => openAgentDetail(ag)}
                        className="flex-1 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-extrabold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>对话</span>
                      </button>
                      <button
                        onClick={() => setWorkspaceSubTab('apikeys')}
                        className="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Key className="w-3.5 h-3.5 text-slate-500" />
                        <span>API</span>
                      </button>
                      <button
                        onClick={() => showToast(`【${ag.name}】今日调用量: ${ag.todayTokenUsage || 1234} Token | 本月累计调用: ${(ag.todayTokenUsage || 1234) * 18} Token`)}
                        className="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <BarChart2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>用量</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: 我开发的 Agent */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-slate-700" />
                <span>我开发的 Agent ({userAgents.filter(a => !a.isPurchased || a.isDeveloped || a.id.startsWith('ag_custom')).length})</span>
              </h3>

              {/* Status Tabs: [已上架] [审核中] [已下架] */}
              <div className="flex items-center gap-1.5 text-xs font-bold">
                {[
                  { key: 'all', label: '全部' },
                  { key: 'published', label: '已上架' },
                  { key: 'reviewing', label: '审核中' },
                  { key: 'draft', label: '草稿/下架' },
                ].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setStatusFilter(f.key)}
                    className={`px-3 py-1 rounded-xl transition cursor-pointer ${
                      statusFilter === f.key ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userAgents.filter(a => !a.isPurchased || a.isDeveloped || a.id.startsWith('ag_custom')).map(ag => (
                <div
                  key={ag.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl font-bold shadow-xs">
                          {ag.avatar}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900 line-clamp-1">{ag.name}</h4>
                          <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                            <span>{ag.version || 'v1.0.0'}</span>
                            <span>•</span>
                            <span>{ag.baseModel || 'Gemini 3.6 Flash'}</span>
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-700">
                        我的开发
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 font-medium line-clamp-2 leading-relaxed">
                      {ag.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>总调用: <strong className="text-slate-800">{ag.usageCount.toLocaleString()} 次</strong></span>
                      <span>评分: <strong className="text-amber-600">{ag.rating} ★</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        onClick={() => showToast(`编辑 Agent【${ag.name}】`)}
                        className="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>编辑</span>
                      </button>
                      <button
                        onClick={() => setWorkspaceSubTab('apikeys')}
                        className="py-1.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>Key</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: 【创建 Agent】（主入口） */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-base font-black flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>【创建 Agent】定制个人/企业专有智能体</span>
              </div>
              <p className="text-xs text-indigo-100 font-medium">
                低代码快速编排 System Prompt、绑定多源知识库与自定义 API 插件，一键发布到商店变现或内部调用
              </p>
            </div>
            <button
              onClick={() => openModal('createAgent')}
              className="px-6 py-3 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-black shadow-md cursor-pointer shrink-0 transition"
            >
              + 立即创建 Agent
            </button>
          </div>

        </div>
      )}

      {/* 2. SubTab: 我的数据集 */}
      {activeAssetTab === 'datasets' && (
        <div className="space-y-4">
          
          {/* Dataset Application Approval Banner */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-900">使用申请待处理</h4>
                <p className="text-[11px] text-amber-800/80 font-medium">有 1 位开发者申请授权使用您的私有 Corpus 数据集</p>
              </div>
            </div>
            <button
              onClick={() => setShowApplyModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-extrabold transition cursor-pointer"
            >
              查看审批 ({applications.filter(a => a.status === '待审批').length})
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-200">
                <tr>
                  <th className="p-4">数据集名称</th>
                  <th className="p-4">行业领域</th>
                  <th className="p-4">数据规模</th>
                  <th className="p-4">开源协议</th>
                  <th className="p-4">下载/授权数</th>
                  <th className="p-4">状态</th>
                  <th className="p-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {datasets.map((ds) => (
                  <tr key={ds.id} className="hover:bg-slate-50 transition">
                    <td className="p-4">
                      <div className="font-extrabold text-slate-900">{ds.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{ds.format} • 更新于 {ds.updatedAt}</div>
                    </td>
                    <td className="p-4 font-bold text-slate-700">{ds.industry}</td>
                    <td className="p-4 font-bold text-slate-700">{ds.scale}</td>
                    <td className="p-4 font-medium text-slate-500">{ds.license}</td>
                    <td className="p-4 font-bold text-indigo-600">{ds.downloadCount.toLocaleString()} 次</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                        已上架
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => showToast(`编辑数据集【${ds.name}】`)}
                        className="text-slate-600 hover:text-indigo-600 font-extrabold cursor-pointer"
                      >
                        编辑
                      </button>
                      <button 
                        onClick={() => showToast(`已下载 ${ds.name}`)}
                        className="text-indigo-600 hover:text-indigo-700 font-extrabold cursor-pointer"
                      >
                        导出/下载
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* 3. SubTab: 我的 Skill */}
      {activeAssetTab === 'skills' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((sk) => (
            <div key={sk.id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center font-bold text-purple-600">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                    已上架
                  </span>
                </div>
                <h3 className="text-xs font-black text-slate-900">{sk.name}</h3>
                <p className="text-[11px] text-slate-500 font-medium line-clamp-2 mt-1">{sk.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="text-[11px] text-slate-400 font-medium">兼容: {sk.compatibleAgents}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">安装量: <strong className="text-indigo-600">{sk.installs.toLocaleString()}</strong></span>
                  <button 
                    onClick={() => showToast(`编辑 Skill【${sk.name}】`)}
                    className="text-slate-700 hover:text-indigo-600 font-extrabold cursor-pointer"
                  >
                    管理设置
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. SubTab: 我的收藏 */}
      {activeAssetTab === 'favorites' && (
        <div className="space-y-3">
          {favorites.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs font-medium">
              您还没有收藏任何 Agent，可以在集市中浏览并点击收藏 ⭐️
            </div>
          ) : (
            favorites.map((ag) => (
              <div key={ag.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl font-bold">
                    {ag.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">{ag.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{ag.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedMainTab('marketplace')}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition cursor-pointer"
                  >
                    立即体验
                  </button>
                  <button
                    onClick={() => toggleFavoriteAgent(ag.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition cursor-pointer"
                  >
                    取消收藏
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Dataset Approval Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>数据集使用申请审批</span>
              </h3>
              <button 
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                关闭
              </button>
            </div>

            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={app.applicantAvatar} alt={app.applicantName} className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-xs font-extrabold text-slate-900">{app.applicantName}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{app.applyTime}</span>
                  </div>

                  <div className="text-xs text-slate-700 font-medium bg-white p-2.5 rounded-xl border border-slate-100">
                    <strong className="text-slate-900">用途说明:</strong> {app.purpose}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-indigo-600 font-bold">{app.datasetName}</span>
                    {app.status === '待审批' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(app.id, true)}
                          className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition cursor-pointer"
                        >
                          批准授权
                        </button>
                        <button
                          onClick={() => handleApprove(app.id, false)}
                          className="px-3 py-1 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold transition cursor-pointer"
                        >
                          驳回
                        </button>
                      </div>
                    ) : (
                      <span className={`text-xs font-bold ${app.status === '已通过' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {app.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
