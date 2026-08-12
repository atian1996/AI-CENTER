import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, 
  Coins, 
  CreditCard, 
  PlusCircle, 
  CalendarCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Sparkles, 
  QrCode, 
  ShieldCheck, 
  Receipt,
  HelpCircle,
  Gift,
  X,
  History,
  TrendingUp,
  AlertCircle,
  ShoppingBag,
  Zap
} from 'lucide-react';
import { AccountTransaction } from '../../types';
import { mockAccountTransactions, mockPointStoreItems } from '../../data/mockData';

export const WorkspacePoints: React.FC = () => {
  const { user, setUser, checkInToday, hasCheckedInToday, showToast } = useApp();

  // Tab State: 'all' | 'recharge' | 'expense' | 'points_earn' | 'points_spend'
  const [activeTab, setActiveTab] = useState<'all' | 'recharge' | 'expense' | 'points_earn' | 'points_spend'>('all');
  
  // Transactions State
  const [transactions, setTransactions] = useState<AccountTransaction[]>(mockAccountTransactions);

  // Recharge Modal State
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay'>('wechat');
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  // Modal Triggers
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);

  const currentBalance = user.balance ?? 128.00;
  const currentPoints = user.points ?? 1200;
  const pointsWorthRmb = (currentPoints * 0.01).toFixed(2);

  // Handle Recharge Execution
  const handleConfirmRecharge = () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
    if (isNaN(finalAmount) || finalAmount <= 0) {
      showToast('请输入有效的充值金额');
      return;
    }

    setIsProcessingPay(true);

    setTimeout(() => {
      const newBalance = currentBalance + finalAmount;

      // Update User Balance in AppContext
      setUser(prev => ({
        ...prev,
        balance: newBalance
      }));

      // Add New Transaction Record
      const newTx: AccountTransaction = {
        id: `tx_${Date.now()}`,
        time: '今天 ' + new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        title: '在线充值',
        category: 'recharge',
        currencyType: 'rmb',
        rmbAmount: finalAmount,
        rmbBalanceAfter: newBalance,
        paymentMethod: paymentMethod === 'wechat' ? '微信支付' : '支付宝',
        status: 'success'
      };

      setTransactions(prev => [newTx, ...prev]);
      setIsProcessingPay(false);
      setShowRechargeModal(false);
      setCustomAmount('');
      showToast(`充值成功！已成功向账户充值 ¥${finalAmount.toFixed(2)} 元`);
    }, 600);
  };

  // Handle Daily Checkin with Transaction Record
  const handleCheckIn = () => {
    if (hasCheckedInToday) {
      showToast('今日已签到，明日再来吧！');
      return;
    }
    checkInToday();
    const newTx: AccountTransaction = {
      id: `tx_${Date.now()}`,
      time: '今天 ' + new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      title: '每日签到',
      category: 'points_earn',
      currencyType: 'points',
      pointsAmount: 50,
      pointsBalanceAfter: currentPoints + 50,
      status: 'success'
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  // Filter transactions based on active Tab
  const filteredTransactions = transactions.filter(tx => {
    if (activeTab === 'all') return true;
    if (activeTab === 'recharge') return tx.category === 'recharge';
    if (activeTab === 'expense') return tx.category === 'expense';
    if (activeTab === 'points_earn') return tx.category === 'points_earn';
    if (activeTab === 'points_spend') return tx.category === 'points_spend';
    return true;
  });

  const presetAmounts = [30, 50, 100, 200, 500, 1000];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Wallet className="w-6 h-6 text-indigo-600" />
            <span>我的账户</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-100">
              资产与交易中心
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            统一管理可用余额、积分资产，实时查询充值、消费与积分收支明细
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStoreModal(true)}
            className="px-3.5 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Gift className="w-4 h-4 text-amber-600" />
            <span>积分商城</span>
          </button>
          <button
            onClick={() => setShowRulesModal(true)}
            className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>抵扣与规则</span>
          </button>
        </div>
      </div>

      {/* 顶部：资产总览卡片 */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>我的账户</span>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            实名认证账号：<span className="font-bold text-slate-700">{user.name}</span> ({user.phone})
          </div>
        </div>

        {/* 资产卡片内部核心区块 */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            
            {/* 可用余额 */}
            <div className="space-y-3 md:border-r md:border-white/10 md:pr-8">
              <div className="text-xs text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                <Wallet className="w-4 h-4 text-indigo-400" />
                <span>可用余额</span>
              </div>
              
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tight text-white">
                  ¥{currentBalance.toFixed(2)}
                </span>
              </div>

              <div>
                <button
                  onClick={() => setShowRechargeModal(true)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>充 值</span>
                </button>
              </div>
            </div>

            {/* 积分 */}
            <div className="space-y-3">
              <div className="text-xs text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>积分</span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight text-amber-400">
                  {currentPoints.toLocaleString()}
                </span>
                <span className="text-xs font-extrabold text-amber-200/90">
                  （=¥{pointsWorthRmb}）
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-xs text-amber-100/90 font-medium flex items-center gap-2">
                <span className="text-amber-300 text-sm">💡</span>
                <span>1积分 = ¥0.01 · 每笔订单最高抵扣 30%</span>
              </div>
            </div>

          </div>

          {/* Background Ambient Glow */}
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>

      {/* 下方：Tab切换 (5个Tab) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        <div className="p-4 bg-slate-50/80 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { key: 'all', label: '全部流水' },
            { key: 'recharge', label: '充值记录' },
            { key: 'expense', label: '消费记录' },
            { key: 'points_earn', label: '积分获取' },
            { key: 'points_spend', label: '积分消耗' },
          ].map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200' 
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 流水明细列表 */}
        <div className="overflow-x-auto">
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs space-y-2">
              <History className="w-8 h-8 mx-auto text-slate-300" />
              <div>暂无相关流水记录</div>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-500 font-extrabold border-b border-slate-200">
                <tr>
                  <th className="p-4 pl-6">交易时间 / 类型</th>
                  <th className="p-4">变动明细</th>
                  <th className="p-4">支付或来源方式</th>
                  <th className="p-4">抵扣与附加说明</th>
                  <th className="p-4 text-right pr-6">变动后结余</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredTransactions.map(tx => {
                  const isPositiveRmb = (tx.rmbAmount ?? 0) > 0;
                  const isPositivePoints = (tx.pointsAmount ?? 0) > 0;

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                      
                      {/* 时间 & 标题 */}
                      <td className="p-4 pl-6">
                        <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                          {tx.category === 'recharge' && <ArrowUpRight className="w-4 h-4 text-emerald-500" />}
                          {tx.category === 'expense' && <ArrowDownRight className="w-4 h-4 text-rose-500" />}
                          {tx.category === 'points_earn' && <Coins className="w-4 h-4 text-amber-500" />}
                          {tx.category === 'points_spend' && <Coins className="w-4 h-4 text-slate-400" />}
                          <span>{tx.title}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{tx.time}</div>
                      </td>

                      {/* 金额变动 */}
                      <td className="p-4">
                        {tx.rmbAmount !== undefined && (
                          <div className={`font-black text-sm ${isPositiveRmb ? 'text-emerald-600' : 'text-slate-800'}`}>
                            {isPositiveRmb ? `+¥${tx.rmbAmount.toFixed(2)}` : `-¥${Math.abs(tx.rmbAmount).toFixed(2)}`}
                          </div>
                        )}
                        {tx.pointsAmount !== undefined && (
                          <div className={`font-extrabold text-xs mt-0.5 ${isPositivePoints ? 'text-amber-600' : 'text-rose-600'}`}>
                            {isPositivePoints ? `+${tx.pointsAmount}分` : `${tx.pointsAmount}分`}
                          </div>
                        )}
                      </td>

                      {/* 支付/来源渠道 */}
                      <td className="p-4 text-slate-600">
                        {tx.paymentMethod ? (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-bold text-[11px] text-slate-700">
                            {tx.paymentMethod}
                          </span>
                        ) : tx.category === 'points_earn' ? (
                          <span className="text-slate-500 font-medium">任务与活动奖励</span>
                        ) : (
                          <span className="text-slate-400">账户余额 / 抵扣</span>
                        )}
                      </td>

                      {/* 抵扣或扩展说明 */}
                      <td className="p-4 text-slate-500">
                        {tx.deductionInfo ? (
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200/60">
                            {tx.deductionInfo}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>

                      {/* 变动后结余 */}
                      <td className="p-4 text-right pr-6 font-mono text-slate-700">
                        {tx.rmbBalanceAfter !== undefined && (
                          <div className="font-bold text-xs text-slate-900">
                            余额 ¥{tx.rmbBalanceAfter.toFixed(2)}
                          </div>
                        )}
                        {tx.pointsBalanceAfter !== undefined && (
                          <div className="text-[11px] text-amber-700 font-bold">
                            剩余 {tx.pointsBalanceAfter.toLocaleString()}分
                          </div>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 底部固定区域：每日签到 */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50/80 rounded-3xl border border-amber-200/80 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span>每日打卡领积分</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-200 text-amber-900">
                +50 PTS / 天
              </span>
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              坚持每日签到可赚取免费积分，直接用于抵扣 GPU 算力租赁与模型调用订单
            </p>
          </div>
        </div>

        <button
          onClick={handleCheckIn}
          disabled={hasCheckedInToday}
          className={`px-6 py-2.5 rounded-2xl text-xs font-extrabold transition shadow-md shrink-0 cursor-pointer ${
            hasCheckedInToday
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed shadow-none border border-slate-300'
              : 'bg-amber-500 hover:bg-amber-600 active:scale-95 text-white'
          }`}
        >
          {hasCheckedInToday ? '今日已签到 (已领 50 积分)' : '立即签到 (+50积分)'}
        </button>
      </div>

      {/* ============================================================ */}
      {/* 充值 Modal (点击【充值】按钮进入) */}
      {/* ============================================================ */}
      {showRechargeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-6 animate-scale-up relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">账户充值</h3>
                  <p className="text-[11px] text-slate-400 font-medium">即时到账 · 支持开具增值税发票</p>
                </div>
              </div>

              <button
                onClick={() => setShowRechargeModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 当前余额提示 */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">当前可用余额</span>
              <span className="font-black text-slate-900 text-sm">¥{currentBalance.toFixed(2)}</span>
            </div>

            {/* 充值金额选择 (6档) */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-800 block">选择充值金额</label>
              <div className="grid grid-cols-3 gap-3">
                {presetAmounts.map(amt => {
                  const isSelected = selectedAmount === amt && !customAmount;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 font-black ring-2 ring-indigo-200' 
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 font-bold bg-white'
                      }`}
                    >
                      <div className="text-base">¥{amt}</div>
                      <div className="text-[10px] text-slate-400 font-normal">得 ¥{amt} 余额</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 自定义金额 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">自定义金额 (元)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">¥</span>
                <input
                  type="number"
                  placeholder="输入自定义金额（如 150）"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                  }}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
            </div>

            {/* 支付方式 (微信支付 / 支付宝) */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-800 block">选择支付方式</label>
              <div className="grid grid-cols-2 gap-3">
                
                {/* 微信支付 */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wechat')}
                  className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition cursor-pointer ${
                    paymentMethod === 'wechat'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-black ring-2 ring-emerald-200'
                      : 'border-slate-200 text-slate-700 font-bold bg-white'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
                    微
                  </span>
                  <span className="text-xs">微信支付</span>
                </button>

                {/* 支付宝 */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('alipay')}
                  className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition cursor-pointer ${
                    paymentMethod === 'alipay'
                      ? 'border-sky-500 bg-sky-50 text-sky-800 font-black ring-2 ring-sky-200'
                      : 'border-slate-200 text-slate-700 font-bold bg-white'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center">
                    支
                  </span>
                  <span className="text-xs">支付宝</span>
                </button>

              </div>
            </div>

            {/* 确认支付 */}
            <div className="pt-2">
              <button
                onClick={handleConfirmRecharge}
                disabled={isProcessingPay}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm transition shadow-lg hover:shadow-xl active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessingPay ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin text-white" />
                    <span>正在处理支付...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>确认支付 ¥{customAmount ? parseFloat(customAmount) || 0 : selectedAmount} 元</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 积分规则 Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <span>积分获取与抵扣规则</span>
              </h3>
              <button onClick={() => setShowRulesModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-3 text-slate-600 leading-relaxed font-medium">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 text-amber-900 font-bold">
                💡 1 积分 = ¥0.01 元人民币，用于消费抵扣。
              </div>
              <ul className="space-y-2 list-disc pl-4 text-slate-700">
                <li><strong>抵扣比例：</strong> 每笔算力租赁或 Agent 消费订单，最多可用积分抵扣订单金额的 <strong>30%</strong>。</li>
                <li><strong>每日签到：</strong> 每日点击签到可获得 50 积分奖励。</li>
                <li><strong>发布 Agent：</strong> 成功上架 Agent 可额外奖励 100 积分。</li>
                <li><strong>积分有效期：</strong> 积分长期有效，不设过期时间。</li>
              </ul>
            </div>

            <button
              onClick={() => setShowRulesModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
            >
              我知道了
            </button>
          </div>
        </div>
      )}

      {/* 积分商城 Modal (可选福利兑换) */}
      {showStoreModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-up max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-500" />
                <span>积分商城与兑换福利</span>
              </h3>
              <button onClick={() => setShowStoreModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mockPointStoreItems.map(item => (
                <div key={item.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="text-2xl">{item.image}</div>
                  <div className="text-xs font-black text-slate-900">{item.name}</div>
                  <div className="text-[11px] text-slate-500">{item.description}</div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs font-extrabold text-amber-600">{item.pointsRequired} 积分</span>
                    <button
                      onClick={() => {
                        if (user.points < item.pointsRequired) {
                          showToast(`积分不足！需要 ${item.pointsRequired} 积分`);
                        } else {
                          setUser(prev => ({ ...prev, points: prev.points - item.pointsRequired }));
                          showToast(`成功兑换【${item.name}】！福利已自动发放`);
                          setShowStoreModal(false);
                        }
                      }}
                      className="px-3 py-1 rounded-xl bg-amber-500 text-white text-[11px] font-bold cursor-pointer"
                    >
                      兑换
                    </button>
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
