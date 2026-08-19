import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { ComputeRunningInstanceItem } from '../../../types';
import {
  Activity,
  Search,
  RefreshCw,
  PowerOff,
  RotateCcw,
  Terminal,
  Cpu,
  Flame,
  Zap,
  Server,
  X,
  AlertTriangle,
  CheckCircle2,
  HardDrive
} from 'lucide-react';

export const ComputeInstanceMonitorView: React.FC = () => {
  const {
    computeRunningInstances,
    restartComputeRunningInstance,
    stopComputeRunningInstance,
    showToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [healthFilter, setHealthFilter] = useState<'all' | '良好' | '高载' | '告警'>('all');

  // 日志弹窗
  const [logModalInstance, setLogModalInstance] = useState<ComputeRunningInstanceItem | null>(null);

  // 统计
  const stats = useMemo(() => {
    const total = computeRunningInstances.length;
    const highLoad = computeRunningInstances.filter(i => (i.health ?? (i.gpuUtil ?? i.gpuUsage ?? 0) > 85 ? '高载' : '良好') === '高载').length;
    const warning = computeRunningInstances.filter(i => i.health === '告警' || (i.temp ?? 0) > 80).length;
    const avgGpuUtil = total > 0
      ? (computeRunningInstances.reduce((acc, i) => acc + (i.gpuUtil ?? i.gpuUsage ?? 0), 0) / total).toFixed(1)
      : '0.0';
    return { total, highLoad, warning, avgGpuUtil };
  }, [computeRunningInstances]);

  // 筛选
  const filteredInstances = useMemo(() => {
    return computeRunningInstances.filter(inst => {
      const gpuName = inst.gpuSpec || inst.specName || '';
      const opName = inst.operator || '';
      const matchSearch =
        inst.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (inst.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        gpuName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opName.toLowerCase().includes(searchTerm.toLowerCase());

      const currentHealth = inst.health || ((inst.gpuUtil ?? inst.gpuUsage ?? 0) > 85 ? '高载' : '良好');
      const matchHealth = healthFilter === 'all' || currentHealth === healthFilter;
      return matchSearch && matchHealth;
    });
  }, [computeRunningInstances, searchTerm, healthFilter]);

  return (
    <div className="space-y-6">
      {/* 顶部监控大盘统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">运行中活跃实例</div>
            <div className="text-2xl font-bold text-white mt-1">{stats.total} <span className="text-xs font-normal text-slate-400">台</span></div>
          </div>
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">平均 GPU 计算利用率</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">{stats.avgGpuUtil}%</div>
          </div>
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">高负载训练节点 (≥85%)</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{stats.highLoad} <span className="text-xs font-normal text-slate-400">台</span></div>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">过温 / 功耗告警节点</div>
            <div className="text-2xl font-bold text-rose-400 mt-1">{stats.warning} <span className="text-xs font-normal text-slate-400">台</span></div>
          </div>
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
            <Flame className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 搜索与工具栏 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[320px]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索实例ID、用户、GPU型号或运营商..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">健康状态:</span>
            <select
              value={healthFilter}
              onChange={e => setHealthFilter(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">全部健康等级</option>
              <option value="良好">良好 (正常负载)</option>
              <option value="高载">高载 (算力跑满)</option>
              <option value="告警">告警 (高温或降频)</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => showToast('已刷新全部实例容器遥测指标')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-all"
        >
          <RefreshCw className="w-4 h-4 text-indigo-400" />
          刷新遥测数据
        </button>
      </div>

      {/* 实例监控 Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/60 border-b border-slate-800 text-xs font-semibold text-slate-400">
                <th className="py-3.5 px-4">实例ID / 用户</th>
                <th className="py-3.5 px-4">硬件型号 & 算力池</th>
                <th className="py-3.5 px-4">GPU 核心利用率</th>
                <th className="py-3.5 px-4">显存占用 (VRAM)</th>
                <th className="py-3.5 px-4">CPU & 内存</th>
                <th className="py-3.5 px-4">核心温度 / 功耗</th>
                <th className="py-3.5 px-4">已持续运行</th>
                <th className="py-3.5 px-4">健康指标</th>
                <th className="py-3.5 px-4 text-right">运维操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredInstances.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-sm">
                    暂无符合条件的运行中实例
                  </td>
                </tr>
              ) : (
                filteredInstances.map(inst => {
                  const gpuName = inst.gpuSpec || inst.specName || 'GPU 计算实例';
                  const gpuUtilVal = inst.gpuUtil ?? inst.gpuUsage ?? 0;
                  const vramUsedText = inst.vramUsed || (inst.vramUsage ? `${(inst.vramUsage * 0.24).toFixed(1)}GB` : '16.0GB');
                  const vramTotalText = inst.vramTotal || '24.0GB';
                  const vramPercent = (parseFloat(vramUsedText) / (parseFloat(vramTotalText) || 1)) * 100 || inst.vramUsage || 0;
                  const currentHealth = inst.health || (gpuUtilVal > 85 ? '高载' : '良好');
                  const durationText = inst.runningDuration || (inst.runningHours ? `${inst.runningHours}小时` : '3.5小时');
                  const tempVal = inst.temp ?? 62;
                  const powerText = inst.power || '320W / 450W';
                  const cpuUtilVal = inst.cpuUtil ?? 45;
                  const ramUsedText = inst.ramUsed || (inst.ramUsage ? `${inst.ramUsage}%` : '24GB / 60GB');

                  return (
                    <tr key={inst.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-white">
                        <div className="font-mono text-xs text-indigo-300 font-semibold">{inst.id}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{inst.userName}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-xs font-semibold text-slate-200">{gpuName}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{inst.operator || '机房算力池'}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono font-bold ${gpuUtilVal > 85 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {gpuUtilVal}%
                          </span>
                        </div>
                        <div className="w-20 bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className={`h-full ${gpuUtilVal > 85 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${gpuUtilVal}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-xs font-mono text-slate-200">
                          {vramUsedText} / {vramTotalText}
                        </div>
                        <div className="text-[10px] text-indigo-400 font-mono mt-0.5">
                          {vramPercent.toFixed(0)}% 占用
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs font-mono text-slate-300">
                        <div>CPU: {cpuUtilVal}%</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">RAM: {ramUsedText}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-xs font-mono">
                          <Flame className={`w-3.5 h-3.5 ${tempVal > 75 ? 'text-rose-400' : 'text-slate-400'}`} />
                          <span className={tempVal > 75 ? 'text-rose-400 font-bold' : 'text-slate-300'}>{tempVal}°C</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 mt-0.5">
                          <Zap className="w-3 h-3 text-amber-400" />
                          <span>{powerText}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs font-mono text-slate-300">
                        {durationText}
                      </td>

                      <td className="py-3.5 px-4">
                        {currentHealth === '良好' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            良好
                          </span>
                        )}
                        {currentHealth === '高载' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-500/20 text-amber-400">
                            <Zap className="w-3 h-3" />
                            高载训练
                          </span>
                        )}
                        {currentHealth === '告警' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 border border-rose-500/20 text-rose-400">
                            <AlertTriangle className="w-3 h-3" />
                            温度告警
                          </span>
                        )}
                      </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setLogModalInstance(inst)}
                          className="px-2 py-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-400 rounded-md transition-colors"
                          title="查看实时控制台日志"
                        >
                          日志
                        </button>

                        <button
                          onClick={() => restartComputeRunningInstance(inst.id)}
                          className="px-2 py-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-md transition-colors"
                          title="软重启容器"
                        >
                          重启
                        </button>

                        <button
                          onClick={() => stopComputeRunningInstance(inst.id)}
                          className="px-2 py-1 text-xs bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-md transition-colors"
                          title="强制关停实例"
                        >
                          停机
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          </table>
        </div>
      </div>

      {/* 控制台实时日志弹窗 */}
      {logModalInstance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">容器实例实时日志 - {logModalInstance.id}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{logModalInstance.gpuSpec} · {logModalInstance.userName}</p>
                </div>
              </div>
              <button
                onClick={() => setLogModalInstance(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4">
              <div className="bg-black/90 p-4 rounded-xl font-mono text-xs text-emerald-400 border border-slate-800 h-64 overflow-y-auto space-y-1">
                <div>[2026-08-18 18:40:02] [SYSTEM] NVIDIA-SMI 550.54.14   Driver Version: 550.54.14   CUDA Version: 12.4</div>
                <div>[2026-08-18 18:40:05] [CONTAINER] Initializing Jupyter Lab on port 8888...</div>
                <div>[2026-08-18 18:40:08] [CONTAINER] SSH Daemon active on port 2222 (Forwarding via public proxy)</div>
                <div>[2026-08-18 18:41:20] [TRAIN] Step 1200/5000 - loss: 0.2412 - lr: 2e-5 - gpu_mem: {logModalInstance.vramUsed}</div>
                <div>[2026-08-18 18:42:15] [TRAIN] Step 1300/5000 - loss: 0.2289 - lr: 2e-5 - throughput: 84.2 samples/sec</div>
                <div>[2026-08-18 18:43:00] [TELEMETRY] Heartbeat reported: GPU Core {logModalInstance.gpuUtil}%, Temp {logModalInstance.temp}°C, Power {logModalInstance.power}</div>
                <div className="text-slate-500 animate-pulse">_ 实时数据流传输中 (WebSocket Connected)</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
              <button
                onClick={() => setLogModalInstance(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
