import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  ShieldCheck, 
  Bell, 
  Route, 
  Save, 
  Lock, 
  Smartphone, 
  Mail, 
  Key, 
  Laptop, 
  Check, 
  AlertCircle,
  Plus,
  X
} from 'lucide-react';
import { mockLoginDevices } from '../../data/mockData';

export const WorkspaceSettings: React.FC = () => {
  const { user, setUser, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notice' | 'routing'>('profile');

  // Profile Form state
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [githubUrl, setGithubUrl] = useState(user.githubUrl || '');
  const [websiteUrl, setWebsiteUrl] = useState(user.websiteUrl || '');
  const [identityTag, setIdentityTag] = useState(user.identityTag);

  // Security Form state
  const [mfa, setMfa] = useState(user.mfaEnabled);
  const [devices, setDevices] = useState(mockLoginDevices);

  // Routing Preference state
  const [routingStrategy, setRoutingStrategy] = useState<'order' | 'only' | 'ignore'>('order');

  const handleSaveProfile = () => {
    setUser({
      ...user,
      name,
      bio,
      githubUrl,
      websiteUrl,
      identityTag,
      mfaEnabled: mfa
    });
    showToast('个人资料与账户设置保存成功！');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>我的账号</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
              安全 & 偏好
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            配置个人资料、绑定手机邮箱、MFA 身份认证与大模型多厂商路由调度策略
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>保存设置</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-extrabold">
        {[
          { key: 'profile', label: '个人资料', icon: User },
          { key: 'security', label: '安全与登录设备', icon: ShieldCheck },
          { key: 'notice', label: '通知接收偏好', icon: Bell },
          { key: 'routing', label: '模型调用路由偏好', icon: Route },
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
                isActive ? 'border-indigo-600 text-indigo-600 font-black' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Profile Form */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6 max-w-2xl">
          <div className="flex items-center gap-4">
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/30" />
            <button
              onClick={() => showToast('选择新头像图片已拉起')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              更换头像
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-extrabold mb-1">昵称 / 开发者 ID</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:bg-white focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-extrabold mb-1">身份类型</label>
              <select
                value={identityTag}
                onChange={(e) => setIdentityTag(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:bg-white"
              >
                <option value="高级开发者 / 算法工程师">高级开发者 / 算法工程师</option>
                <option value="AI 创客 / 独立开发者">AI 创客 / 独立开发者</option>
                <option value="企业研发组 / 架构师">企业研发组 / 架构师</option>
                <option value="数据贡献者 / 数据分析师">数据贡献者 / 数据分析师</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-extrabold mb-1">个人简介 / Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-extrabold mb-1">GitHub 链接</label>
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold mb-1">个人/公司主页 URL</label>
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Security & Devices */}
      {activeTab === 'security' && (
        <div className="space-y-6 max-w-3xl">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="text-sm font-black text-slate-900">账号安全设置</h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-indigo-600" />
                  <div>
                    <div className="font-extrabold text-slate-900">绑定邮箱</div>
                    <div className="text-[11px] text-slate-400">{user.email}</div>
                  </div>
                </div>
                <button onClick={() => showToast('换绑验证码已发送')} className="text-indigo-600 font-bold cursor-pointer">修改</button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="font-extrabold text-slate-900">绑定手机号</div>
                    <div className="text-[11px] text-slate-400">{user.phone}</div>
                  </div>
                </div>
                <button onClick={() => showToast('修改手机号验证码已发送')} className="text-indigo-600 font-bold cursor-pointer">修改</button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-extrabold text-slate-900">MFA 二步验证 (Google Authenticator)</div>
                    <div className="text-[11px] text-slate-400">{mfa ? '已开启安全防护' : '未开启'}</div>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={mfa} 
                  onChange={(e) => setMfa(e.target.checked)} 
                  className="w-4 h-4 accent-indigo-600 cursor-pointer" 
                />
              </div>
            </div>
          </div>

          {/* Login Device Manager */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="text-sm font-black text-slate-900">历史登录设备管理</h3>
            <div className="space-y-2 text-xs">
              {devices.map((d) => (
                <div key={d.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Laptop className="w-5 h-5 text-slate-600" />
                    <div>
                      <div className="font-extrabold text-slate-900 flex items-center gap-2">
                        <span>{d.deviceName}</span>
                        {d.isCurrent && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 text-[9px] font-extrabold">
                            当前设备
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {d.browser} • IP: {d.ip} ({d.location})
                      </div>
                    </div>
                  </div>

                  {!d.isCurrent && (
                    <button 
                      onClick={() => {
                        setDevices(devices.filter(x => x.id !== d.id));
                        showToast(`已强退设备 ${d.deviceName}`);
                      }}
                      className="text-red-600 font-bold hover:underline cursor-pointer"
                    >
                      下线设备
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Notification Preferences */}
      {activeTab === 'notice' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4 max-w-2xl text-xs font-bold text-slate-800">
          <h3 className="text-sm font-black text-slate-900">通知偏好配置</h3>
          {[
            '任务提交与验收进度变动通知',
            '积分增加与消耗交易变动提醒',
            'Agent 审核结果通知',
            '社区评论与点赞互动通知',
            '平台例行维护与更新公告',
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span>{item}</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600 cursor-pointer" />
            </div>
          ))}
        </div>
      )}

      {/* 4. Model Routing Preferences */}
      {activeTab === 'routing' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4 max-w-2xl text-xs font-bold">
          <h3 className="text-sm font-black text-slate-900">大模型多厂商路由调度策略</h3>
          <p className="text-slate-400 font-medium">
            当某模型服务商触发 Rate Limit 或发生网络故障时，系统的底座模型自动降级策略：
          </p>

          <div className="space-y-2">
            {[
              { key: 'order', label: '按优先级顺序自动降级（推荐：Google -> DeepSeek -> 通义千问）' },
              { key: 'only', label: '严格限定特定服务商（如果故障则直接报错，不降级）' },
              { key: 'ignore', label: '智能延迟调度（选择当前全网响应延迟最低的服务）' },
            ].map(r => (
              <label key={r.key} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
                <input
                  type="radio"
                  name="routing"
                  value={r.key}
                  checked={routingStrategy === r.key}
                  onChange={() => setRoutingStrategy(r.key as any)}
                  className="accent-indigo-600"
                />
                <span className="text-slate-800">{r.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
