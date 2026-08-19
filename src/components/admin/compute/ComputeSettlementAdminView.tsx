import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { ComputeSettlementItem } from '../../../types';
import {
  FileText,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  Coins,
  Building2,
  CreditCard,
  Check,
  X,
  Eye,
  Calendar,
  Layers,
  ArrowUpRight,
  Receipt
} from 'lucide-react';

export const ComputeSettlementAdminView: React.FC = () => {
  const {
    computeSettlements,
    confirmComputeSettlement,
    markComputeSettlementPaid,
    generateComputeSettlement,
    computePools,
    showToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | '待对账' | '已确认' | '已结算'>('all');
  const [operatorFilter, setOperatorFilter] = useState<string>('all');

  // 生成对账单弹窗
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState('中国电信天翼云');
  const [selectedPeriod, setSelectedPeriod] = useState('2026-08');

  // 查看明细弹窗
  const [detailSettlement, setDetailSettlement] = useState<ComputeSettlementItem | null>(null);

  // 标记打款弹窗
  const [paidModalSettlement, setPaidModalSettlement] = useState<ComputeSettlementItem | null>(null);
  const [invoiceNo, setInvoiceNo] = useState('');

  // 统计概览
  const stats = useMemo(() => {
    const total = computeSettlements.length;
    const pending = computeSettlements.filter(s => s.status === '待对账').length;
    const totalPayable = (computeSettlements.reduce((acc, s) => acc + (s.payableAmount ?? 0), 0) || 0).toFixed(2);
    const totalProfit = (computeSettlements.reduce((acc, s) => acc + (s.platformGrossProfit ?? 0), 0) || 0).toFixed(2);
    return { total, pending, totalPayable, totalProfit };
  }, [computeSettlements]);

  // 筛选列表
  const filteredSettlements = useMemo(() => {
    return computeSettlements.filter(s => {
      const matchSearch =
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.period.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      const matchOperator = operatorFilter === 'all' || s.operator === operatorFilter;

      return matchSearch && matchStatus && matchOperator;
    });
  }, [computeSettlements, searchTerm, statusFilter, operatorFilter]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    generateComputeSettlement(selectedOperator, selectedPeriod);
    setGenerateModalOpen(false);
  };

  const handleConfirmPaid = (e: React.FormEvent) => {
    e.preventDefault();
    if (paidModalSettlement) {
      markComputeSettlementPaid(paidModalSettlement.id, invoiceNo);
      setPaidModalSettlement(null);
      setInvoiceNo('');
    }
  };

  return (
    <div className="space-y-6">
      {/* 顶部对账统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">累计对账单</div>
            <div className="text-2xl font-bold text-white mt-1">{stats.total} <span className="text-xs font-normal text-slate-400">期</span></div>
          </div>
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">待核对确认账单</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{stats.pending} <span className="text-xs font-normal text-slate-400">期</span></div>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">应付运营商总额</div>
            <div className="text-2xl font-bold text-slate-200 mt-1">¥{stats.totalPayable}</div>
          </div>
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">累计对账结算毛利</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">¥{stats.totalProfit}</div>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
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
              placeholder="搜索对账单号、运营商或结算周期..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">状态:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">全部状态</option>
              <option value="待对账">待对账</option>
              <option value="已确认">已确认 (待打款)</option>
              <option value="已结算">已结算 (已打款)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">运营商:</span>
            <select
              value={operatorFilter}
              onChange={e => setOperatorFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">全部运营商</option>
              <option value="中国电信天翼云">中国电信天翼云</option>
              <option value="中国移动九天算力">中国移动九天算力</option>
              <option value="中国联通沃云智算">中国联通沃云智算</option>
              <option value="世纪互联智算中心">世纪互联智算中心</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setGenerateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-lg text-sm font-medium shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          生成周期对账单
        </button>
      </div>

      {/* 对账单列表 Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/60 border-b border-slate-800 text-xs font-semibold text-slate-400">
                <th className="py-3.5 px-4">对账单号</th>
                <th className="py-3.5 px-4">运营商 & 账期</th>
                <th className="py-3.5 px-4">总消耗卡时</th>
                <th className="py-3.5 px-4">协议单价</th>
                <th className="py-3.5 px-4">应付运营商 (成本)</th>
                <th className="py-3.5 px-4">平台营收 & 毛利</th>
                <th className="py-3.5 px-4">对账状态</th>
                <th className="py-3.5 px-4">发票号 / 结算时间</th>
                <th className="py-3.5 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredSettlements.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-sm">
                    未检索到符合条件的对账单
                  </td>
                </tr>
              ) : (
                filteredSettlements.map(stl => (
                  <tr key={stl.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-indigo-300 font-semibold">
                      {stl.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs font-semibold text-slate-200">{stl.operator}</div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {stl.period}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-slate-200">
                      {stl.totalCardHours.toLocaleString()} 卡·时
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-slate-300">
                      ¥{(stl.agreedPrice ?? 0).toFixed(2)}/h
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs font-bold font-mono text-slate-200">
                        ¥{stl.payableAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs font-mono text-emerald-400 font-medium">
                        收 ¥{stl.platformRevenue.toLocaleString()}
                      </div>
                      <div className="text-[11px] font-mono text-indigo-400 mt-0.5">
                        利 ¥{stl.platformGrossProfit.toLocaleString()} ({stl.grossMargin}%)
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {stl.status === '待对账' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-500/20 text-amber-400">
                          <Clock className="w-3 h-3" />
                          待对账
                        </span>
                      )}
                      {stl.status === '已确认' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                          <Check className="w-3 h-3" />
                          已确认(待付款)
                        </span>
                      )}
                      {stl.status === '已结算' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          已完成结算
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs font-mono text-slate-400">
                      {stl.invoiceNo ? (
                        <div>
                          <div className="text-slate-300">{stl.invoiceNo}</div>
                          <div className="text-[10px] text-slate-500">{stl.settledAt}</div>
                        </div>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setDetailSettlement(stl)}
                          className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-md transition-colors"
                        >
                          明细
                        </button>

                        {stl.status === '待对账' && (
                          <button
                            onClick={() => confirmComputeSettlement(stl.id)}
                            className="px-2.5 py-1 text-xs bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 rounded-md transition-colors"
                          >
                            确认核对
                          </button>
                        )}

                        {stl.status === '已确认' && (
                          <button
                            onClick={() => {
                              setPaidModalSettlement(stl);
                              setInvoiceNo(`FP-${new Date().getFullYear()}${Math.floor(100000 + Math.random() * 900000)}`);
                            }}
                            className="px-2.5 py-1 text-xs bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-md transition-colors"
                          >
                            结算付款
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

      {/* 生成对账单弹窗 */}
      {generateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">生成算力消耗对账单</h3>
                  <p className="text-xs text-slate-400 mt-0.5">汇总运营商集群在指定账期的卡时用量</p>
                </div>
              </div>
              <button
                onClick={() => setGenerateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerate} className="py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">选择运营商</label>
                <select
                  value={selectedOperator}
                  onChange={e => setSelectedOperator(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="中国电信天翼云">中国电信天翼云</option>
                  <option value="中国移动九天算力">中国移动九天算力</option>
                  <option value="中国联通沃云智算">中国联通沃云智算</option>
                  <option value="世纪互联智算中心">世纪互联智算中心</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">选择结算账期 (月份)</label>
                <select
                  value={selectedPeriod}
                  onChange={e => setSelectedPeriod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="2026-08">2026-08 (本期)</option>
                  <option value="2026-07">2026-07 (上期)</option>
                  <option value="2026-06">2026-06</option>
                </select>
              </div>

              <div className="text-xs text-slate-400 bg-slate-800/40 p-3 rounded-lg border border-slate-800">
                系统将自动拉取底层物理节点的 GPU 真实运行时长、匹配协议价格并计算平台毛利，生成正式对账单据。
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setGenerateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium shadow-sm"
                >
                  开始生成
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 对账规格明细弹窗 */}
      {detailSettlement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">对账明细 #{detailSettlement.id}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{detailSettlement.operator} · {detailSettlement.period} 账期</p>
                </div>
              </div>
              <button
                onClick={() => setDetailSettlement(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4">
              <div className="bg-slate-800/40 rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-800/80 border-b border-slate-700/60 text-slate-400">
                      <th className="py-2.5 px-3.5">GPU 型号规格</th>
                      <th className="py-2.5 px-3.5">消耗小时数</th>
                      <th className="py-2.5 px-3.5">协议单价</th>
                      <th className="py-2.5 px-3.5 text-right">小计金额</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {detailSettlement.specDetails.map(spec => (
                      <tr key={spec.gpuModel}>
                        <td className="py-2.5 px-3.5 font-medium text-slate-200">{spec.gpuModel}</td>
                        <td className="py-2.5 px-3.5 font-mono text-slate-300">{spec.hours} h ({spec.percentage}%)</td>
                        <td className="py-2.5 px-3.5 font-mono text-slate-300">¥{(spec.agreedPrice ?? 0).toFixed(2)}</td>
                        <td className="py-2.5 px-3.5 font-mono text-emerald-400 font-semibold text-right">
                          ¥{(spec.subtotal ?? 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">总计卡时：</span>
                  <span className="font-mono text-white font-semibold">{detailSettlement.totalCardHours} 卡·时</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">应付运营商成本：</span>
                  <span className="font-mono text-slate-200 font-semibold">¥{(detailSettlement.payableAmount ?? 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">平台前台总营收：</span>
                  <span className="font-mono text-emerald-400 font-semibold">¥{(detailSettlement.platformRevenue ?? 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-700/60 pt-2">
                  <span className="text-indigo-400 font-medium">平台毛利与毛利率：</span>
                  <span className="font-mono text-indigo-400 font-bold">
                    ¥{(detailSettlement.platformGrossProfit ?? 0).toFixed(2)} ({detailSettlement.grossMargin}%)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
              <button
                onClick={() => setDetailSettlement(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 结算打款确认弹窗 */}
      {paidModalSettlement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">确认结算与登记发票</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{paidModalSettlement.operator} · ¥{(paidModalSettlement.payableAmount ?? 0).toFixed(2)}</p>
                </div>
              </div>
              <button
                onClick={() => setPaidModalSettlement(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmPaid} className="py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  运营商结算发票凭证号 <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="如: FP-20260818-0091"
                  value={invoiceNo}
                  onChange={e => setInvoiceNo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="text-xs text-slate-400 bg-slate-800/40 p-3 rounded-lg border border-slate-800">
                确认后，该对账单将被归档为<b>“已结算”</b>状态，系统将记录结款时间与发票信息。
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPaidModalSettlement(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium shadow-sm"
                >
                  确认付款完成
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
