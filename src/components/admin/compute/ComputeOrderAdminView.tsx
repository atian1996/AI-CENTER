import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { ComputeOrderItem } from '../../../types';
import {
  Search,
  Filter,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  PowerOff,
  Trash2,
  RotateCcw,
  Eye,
  X,
  User,
  Cpu,
  Terminal,
  Building2,
  Coins,
  Server,
  RefreshCw
} from 'lucide-react';

export const ComputeOrderAdminView: React.FC = () => {
  const {
    computeOrders,
    stopComputeOrder,
    releaseComputeOrder,
    retryComputeOrder,
    showToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | '运行中' | '已停止' | '已释放' | '创建失败'>('all');
  const [billingFilter, setBillingFilter] = useState<'all' | '按量计费' | '包日' | '包周' | '包月'>('all');

  // 详情弹窗
  const [detailModalOrder, setDetailModalOrder] = useState<ComputeOrderItem | null>(null);

  // 统计概览
  const stats = useMemo(() => {
    const total = computeOrders.length;
    const running = computeOrders.filter(o => o.status === '运行中').length;
    const failed = computeOrders.filter(o => o.status === '创建失败').length;
    const totalRevenue = (computeOrders.reduce((acc, o) => acc + (o.totalCost ?? 0), 0) || 0).toFixed(2);
    return { total, running, failed, totalRevenue };
  }, [computeOrders]);

  // 筛选列表
  const filteredOrders = useMemo(() => {
    return computeOrders.filter(order => {
      const matchSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.userId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.specName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.imageName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.operator || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchBilling = billingFilter === 'all' || 
        (billingFilter === '按量计费' ? (order.billingType === '按量' || order.billingType === '按量计费') :
         billingFilter === '包日' ? (order.billingType === '日租' || order.billingType === '包日') :
         billingFilter === '包周' ? (order.billingType === '周租' || order.billingType === '包周') :
         billingFilter === '包月' ? (order.billingType === '月租' || order.billingType === '包月') :
         order.billingType === billingFilter);

      return matchSearch && matchStatus && matchBilling;
    });
  }, [computeOrders, searchTerm, statusFilter, billingFilter]);

  return (
    <div className="space-y-6">
      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">实例订单总数</div>
            <div className="text-2xl font-bold text-white mt-1">{stats.total} <span className="text-xs font-normal text-slate-400">单</span></div>
          </div>
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">当前活跃运行订单</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{stats.running} <span className="text-xs font-normal text-slate-400">单</span></div>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">异常与调度失败</div>
            <div className="text-2xl font-bold text-rose-400 mt-1">{stats.failed} <span className="text-xs font-normal text-slate-400">单</span></div>
          </div>
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">累计订单结算收入</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">¥{stats.totalRevenue}</div>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
            <Coins className="w-5 h-5" />
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
              placeholder="搜索订单号、用户昵称/ID、规格或镜像..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">订单状态:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">全部状态</option>
              <option value="运行中">运行中</option>
              <option value="已停止">已停止</option>
              <option value="已释放">已释放</option>
              <option value="创建失败">创建失败</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">计费模式:</span>
            <select
              value={billingFilter}
              onChange={e => setBillingFilter(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">全部计费模式</option>
              <option value="按量计费">按量计费</option>
              <option value="包日">包日</option>
              <option value="包周">包周</option>
              <option value="包月">包月</option>
            </select>
          </div>
        </div>
      </div>

      {/* 订单列表 Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/60 border-b border-slate-800 text-xs font-semibold text-slate-400">
                <th className="py-3.5 px-4">订单号</th>
                <th className="py-3.5 px-4">下单用户</th>
                <th className="py-3.5 px-4">GPU 规格 / 镜像</th>
                <th className="py-3.5 px-4">计费模式</th>
                <th className="py-3.5 px-4">消费金额 / 运行时长</th>
                <th className="py-3.5 px-4">算力集群归属</th>
                <th className="py-3.5 px-4">状态</th>
                <th className="py-3.5 px-4">下单时间</th>
                <th className="py-3.5 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-sm">
                    未检索到符合条件的实例订单
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs font-medium text-slate-200">
                      {order.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs">
                          {order.userName.slice(0, 1)}
                        </div>
                        <div>
                          <div className="text-xs font-medium text-slate-200">{order.userName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{order.userId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs font-semibold text-slate-100">{order.specName}</div>
                      <div className="text-[11px] text-indigo-400 mt-0.5 line-clamp-1 max-w-[200px]" title={order.imageName}>
                        {order.imageName}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-xs font-mono text-slate-300 px-2 py-0.5 bg-slate-800 border border-slate-700 rounded">
                        {order.billingType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs font-bold font-mono text-emerald-400">
                        ¥{(order.totalCost ?? order.currentCost ?? 0).toFixed(2)}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {order.runningHours ?? order.runningDuration ?? '—'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1 text-xs text-slate-300">
                        <Building2 className="w-3 h-3 text-slate-500" />
                        {order.operator || '机房集群'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {order.status === '运行中' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          运行中
                        </span>
                      )}
                      {order.status === '已停止' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-500/20 text-amber-400">
                          <Clock className="w-3 h-3" />
                          已关机
                        </span>
                      )}
                      {order.status === '已释放' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 border border-slate-500/20 text-slate-400">
                          <XCircle className="w-3 h-3" />
                          已销毁释放
                        </span>
                      )}
                      {order.status === '创建失败' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 border border-rose-500/20 text-rose-400">
                          <AlertCircle className="w-3 h-3" />
                          调度异常
                        </span>
                      )}
                      {order.status === '待支付' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 border border-blue-500/20 text-blue-400">
                          <Clock className="w-3 h-3" />
                          待支付
                        </span>
                      )}
                      {order.status === '分配中' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 border border-purple-500/20 text-purple-400">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          调度分配中
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs font-mono text-slate-400">
                      {order.createTime ?? order.createdAt ?? '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setDetailModalOrder(order)}
                          className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-md transition-colors"
                        >
                          详情
                        </button>

                        {order.status === '运行中' && (
                          <button
                            onClick={() => stopComputeOrder(order.id)}
                            className="px-2.5 py-1 text-xs bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 rounded-md transition-colors"
                          >
                            关停
                          </button>
                        )}

                        {order.status === '已停止' && (
                          <button
                            onClick={() => releaseComputeOrder(order.id)}
                            className="px-2.5 py-1 text-xs bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-md transition-colors"
                          >
                            释放
                          </button>
                        )}

                        {order.status === '创建失败' && (
                          <button
                            onClick={() => retryComputeOrder(order.id)}
                            className="px-2.5 py-1 text-xs bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 rounded-md transition-colors"
                          >
                            重试
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 订单详细弹窗 */}
      {detailModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">订单详情 #{detailModalOrder.id}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">创建时间: {detailModalOrder.createTime}</p>
                </div>
              </div>
              <button
                onClick={() => setDetailModalOrder(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-800/40 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400">下单账号:</span>
                  <div className="font-semibold text-white mt-0.5">{detailModalOrder.userName} ({detailModalOrder.userId})</div>
                </div>
                <div>
                  <span className="text-slate-400">实例规格:</span>
                  <div className="font-semibold text-indigo-400 mt-0.5">{detailModalOrder.specName}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400">运行镜像:</span>
                  <div className="font-semibold text-slate-200 mt-0.5">{detailModalOrder.imageName}</div>
                </div>
                <div>
                  <span className="text-slate-400">计费模式:</span>
                  <div className="font-mono text-slate-200 mt-0.5">{detailModalOrder.billingType}</div>
                </div>
                <div>
                  <span className="text-slate-400">运行时长:</span>
                  <div className="font-mono text-slate-200 mt-0.5">{detailModalOrder.runningHours}</div>
                </div>
                <div>
                  <span className="text-slate-400">累计消费:</span>
                  <div className="font-mono text-emerald-400 font-bold mt-0.5">¥{(detailModalOrder.totalCost ?? 0).toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-slate-400">运营商集群:</span>
                  <div className="font-semibold text-slate-200 mt-0.5">{detailModalOrder.operator}</div>
                </div>
              </div>

              {detailModalOrder.errorMessage && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-lg text-xs">
                  <b>异常报错记录：</b> {detailModalOrder.errorMessage}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
              <button
                onClick={() => setDetailModalOrder(null)}
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
