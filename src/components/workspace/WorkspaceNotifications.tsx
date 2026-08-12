import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  CheckCheck, 
  MessageCircle, 
  ShieldCheck, 
  Coins, 
  CheckCircle, 
  ExternalLink,
  Trash2
} from 'lucide-react';
import { AppNotification } from '../../types';

export const WorkspaceNotifications: React.FC = () => {
  const { notifications, markNotificationAsRead, setWorkspaceSubTab, setSelectedMainTab, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'interaction' | 'system'>('all');

  const filtered = notifications.filter(n => {
    if (activeTab === 'interaction') return n.type === 'interaction';
    if (activeTab === 'system') return n.type === 'system' || n.type === 'task' || n.type === 'points';
    return true;
  });

  const handleMarkAllRead = () => {
    notifications.forEach(n => markNotificationAsRead(n.id));
    showToast('已将所有未读通知标记为已读');
  };

  const handleItemClick = (n: AppNotification) => {
    markNotificationAsRead(n.id);
    if (n.targetTab === 'community') {
      setSelectedMainTab('community');
    } else if (n.targetTab === 'tasks') {
      setWorkspaceSubTab('my-tasks');
    } else if (n.targetTab === 'workspace') {
      setWorkspaceSubTab((n.targetId as any) || 'assets');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>通知中心</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700">
              消息网关
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            实时接收平台社区互动、Agent 审核、任务状态、积分变动与系统公告
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          <CheckCheck className="w-4 h-4 text-indigo-600" />
          <span>全部标记为已读</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-extrabold">
        {[
          { key: 'all', label: '全部消息' },
          { key: 'interaction', label: '社区互动' },
          { key: 'system', label: '系统与变动通知' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`pb-3 px-3 border-b-2 transition cursor-pointer ${
              activeTab === t.key ? 'border-indigo-600 text-indigo-600 font-black' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs font-medium">
            暂无通知消息
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => handleItemClick(n)}
              className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 cursor-pointer group ${
                !n.read 
                  ? 'bg-indigo-50/40 border-indigo-200/80 shadow-2xs' 
                  : 'bg-white border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 ${
                  n.type === 'interaction' 
                    ? 'bg-purple-100 text-purple-700' 
                    : n.type === 'points' 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {n.type === 'interaction' ? <MessageCircle className="w-4 h-4" /> : n.type === 'points' ? <Coins className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition">
                      {n.title}
                    </h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {n.content}
                  </p>
                  <div className="text-[10px] text-slate-400 font-medium pt-0.5">
                    {n.time}
                  </div>
                </div>
              </div>

              <div className="text-slate-400 group-hover:text-indigo-600 transition pt-1">
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
