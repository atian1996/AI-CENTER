import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Receipt, 
  Search, 
  Filter, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  RotateCcw, 
  ShoppingBag, 
  FileText,
  ExternalLink
} from 'lucide-react';
import { OrderItem } from '../../types';
import { mockOrders } from '../../data/mockData';

export const WorkspaceOrders: React.FC = () => {
  const { showToast } = useApp();

  const [orders, setOrders] = useState<OrderItem[]>(mockOrders);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const filteredOrders = orders.filter(o => {
    if (typeFilter !== 'all' && o.type !== typeFilter) return false;
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchQuery && !o.itemName.includes(searchQuery) && !o.orderNo.includes(searchQuery)) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>我的订单</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700">
              财务中心
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            查看您在全站购买 Agent、充值算力与兑换积分的明细记录与电子发票
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        
        {/* Type & Status Filters */}
        <div className="flex items-center gap-3 flex-wrap text-xs font-bold">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {[
              { key: 'all', label: '全部类型' },
              { key: 'Agent购买', label: 'Agent购买' },
              { key: '算力充值', label: '算力充值' },
              { key: '积分充值', label: '积分充值' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTypeFilter(t.key)}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  typeFilter === t.key ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {[
              { key: 'all', label: '全部状态' },
              { key: '已支付', label: '已支付' },
              { key: '已退款', label: '已退款' },
            ].map(s => (
              <button
                key={s.key}
                onClick={() => setStatusFilter(s.key)}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  statusFilter === s.key ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索订单号或商品名称..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-600"
          />
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-200">
            <tr>
              <th className="p-4">订单编号</th>
              <th className="p-4">商品名称</th>
              <th className="p-4">订单类型</th>
              <th className="p-4">支付金额</th>
              <th className="p-4">支付方式</th>
              <th className="p-4">下单时间</th>
              <th className="p-4">交易状态</th>
              <th className="p-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.map((ord) => (
              <tr key={ord.id} className="hover:bg-slate-50 transition">
                <td className="p-4 font-mono font-bold text-slate-800">{ord.orderNo}</td>
                <td className="p-4 font-black text-slate-900">{ord.itemName}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    ord.type === 'Agent购买' ? 'bg-purple-100 text-purple-700' : ord.type === '算力充值' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {ord.type}
                  </span>
                </td>
                <td className="p-4 font-black text-slate-900">
                  {ord.amountUnit === '积分' ? `${ord.amount} PTS` : `¥${(ord.amount ?? 0).toFixed(2)}`}
                </td>
                <td className="p-4 font-medium text-slate-600">{ord.payMethod}</td>
                <td className="p-4 text-slate-400 font-medium">{ord.payTime}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    ord.status === '已支付' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {ord.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => setSelectedOrder(ord)}
                    className="text-slate-700 hover:text-indigo-600 font-extrabold cursor-pointer"
                  >
                    查看详情
                  </button>
                  <button
                    onClick={() => showToast(`已重新下单【${ord.itemName}】`)}
                    className="text-indigo-600 hover:text-indigo-700 font-extrabold cursor-pointer"
                  >
                    再次购买
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">订单详情：{selectedOrder.orderNo}</h3>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                关闭
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between text-slate-500">
                  <span>商品名称</span>
                  <strong className="text-slate-900">{selectedOrder.itemName}</strong>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>订单类型</span>
                  <strong className="text-slate-900">{selectedOrder.type}</strong>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>支付金额</span>
                  <strong className="text-indigo-600 font-black text-sm">
                    {selectedOrder.amountUnit === '积分' ? `${selectedOrder.amount} PTS` : `¥${(selectedOrder.amount ?? 0).toFixed(2)}`}
                  </strong>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>支付渠道</span>
                  <strong className="text-slate-900">{selectedOrder.payMethod}</strong>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>第三方流水号</span>
                  <strong className="text-slate-700 font-mono text-[11px]">{selectedOrder.transactionNo}</strong>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    showToast('发票开具申请已提交至邮箱！');
                    setSelectedOrder(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  开具电子发票
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-extrabold cursor-pointer"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
