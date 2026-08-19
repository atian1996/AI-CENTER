import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { mockComputeStats } from '../../../data/mockComputeAdminData';
import {
  TrendingUp,
  Cpu,
  Coins,
  Users,
  Building2,
  Calendar,
  Layers,
  ArrowUpRight,
  BarChart3,
  PieChart,
  Server,
  Activity
} from 'lucide-react';

export const ComputeStatsAdminView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  const stats = mockComputeStats;

  return (
    <div className="space-y-6">
      {/* 顶部总览统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5">
          <div className="text-xs text-slate-400 font-medium">累计运行实例总数</div>
          <div className="text-2xl font-bold text-white mt-1">
            {stats.totalInstances.toLocaleString()} <span className="text-xs font-normal text-slate-400">个</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>月度新增 +18.4%</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5">
          <div className="text-xs text-slate-400 font-medium">实时运行中活跃实例</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">
            {stats.runningInstances} <span className="text-xs font-normal text-slate-400">台</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-cyan-400 mt-2">
            <Activity className="w-3.5 h-3.5" />
            <span>平均利用率 {stats.avgGpuUtilization}%</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5">
          <div className="text-xs text-slate-400 font-medium">本月算力总流水营收</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            ¥{stats.monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>日均营收 ¥{(stats.monthlyRevenue / 30).toFixed(0)}</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5">
          <div className="text-xs text-slate-400 font-medium">全网平均 GPU 利用率</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">
            {stats.avgGpuUtilization}%
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>处于高效利用区间</span>
          </div>
        </div>
      </div>

      {/* 中部图表与分析板块 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 近7天算力消耗趋势 */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">平台算力日均流水与实例趋势</h3>
            </div>
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors ${timeRange === '7d' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
              >
                近7天
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors ${timeRange === '30d' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
              >
                近30天
              </button>
              <button
                onClick={() => setTimeRange('90d')}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors ${timeRange === '90d' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
              >
                本季度
              </button>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-800">
            {stats.dailyTrend.map(item => {
              const maxRev = 7000;
              const heightPercent = Math.min(100, (item.revenue / maxRev) * 100);
              return (
                <div key={item.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[11px] font-mono text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ¥{item.revenue}
                  </div>
                  <div className="w-full max-w-[42px] bg-slate-800 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 to-emerald-400 group-hover:from-indigo-500 group-hover:to-cyan-400 transition-all rounded-t-lg"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-1">{item.date}</div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-1">
            <span>峰值日营收: ¥6,240 (08-15 智能体赛事冲刺期)</span>
            <span>平均利用率: 76.8%</span>
          </div>
        </div>

        {/* 热门 GPU 规格排行榜 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">热门 GPU 型号占有率</h3>
            </div>

            <div className="space-y-4">
              {stats.specDistribution.map((spec, index) => (
                <div key={spec.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 flex items-center gap-2">
                      <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${index === 0 ? 'bg-amber-500/20 text-amber-400 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                        {index + 1}
                      </span>
                      {spec.name}
                    </span>
                    <span className="font-mono text-slate-300">{spec.count} 台 ({spec.value}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${spec.value}%`, backgroundColor: spec.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-400">
            💡 <b>运营建议</b>：RTX 4090 占全平台 45% 算力需求，建议优先扩容电信云与移动智算机房节点。
          </div>
        </div>
      </div>

      {/* 底部两列：运营商分布与用户用量榜单 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 运营商用量分布 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">运营商集群资源利用与供给</h3>
          </div>

          <div className="space-y-3.5">
            {stats.operatorContribution.map(op => (
              <div key={op.name} className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">{op.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    已挂载 {op.cards} 卡 · 平台算力占比 {op.share}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-bold text-cyan-400">
                    {op.share}%
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">资源池贡献</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 用户消耗排行榜 TOP 10 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">用户算力用量排行榜 (TOP 榜)</h3>
          </div>

          <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
            {stats.topUsers.map((u, i) => (
              <div key={u.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-400 text-slate-900' : i === 1 ? 'bg-slate-300 text-slate-900' : i === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {u.rank}
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{u.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{u.company}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xs font-mono font-medium text-slate-300">{u.cardHours} 卡时</div>
                    <div className="text-[10px] text-slate-500">累计租用</div>
                  </div>
                  <div className="text-right min-w-[70px]">
                    <div className="text-xs font-mono font-bold text-emerald-400">¥{u.totalSpent.toFixed(2)}</div>
                    <div className="text-[10px] text-slate-500">总消费</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
