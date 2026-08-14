import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Palette, 
  Wand2, 
  BarChart3, 
  ShieldAlert, 
  Landmark, 
  Rocket, 
  ArrowRight, 
  ExternalLink, 
  Sparkles
} from 'lucide-react';

interface CreativeCard {
  id: string;
  title: string;
  englishTitle: string;
  badge: string;
  description: string;
  icon: React.ReactNode;
  themeColor: 'purple' | 'cyan' | 'emerald' | 'amber' | 'indigo';
  url?: string;
}

export const CreativeView: React.FC = () => {
  const { showToast } = useApp();

  const creativeCards: CreativeCard[] = [
    {
      id: 'ai_design',
      title: 'AI创意方案',
      englishTitle: 'AI Creative Solutions',
      badge: '视觉与生成',
      description: '从AIGC内容生成到软硬件产品方案，用AI工具把想法变成可落地的设计。无论是营销素材、概念原型还是产品蓝图，这里都是创意方案的孵化场。',
      icon: <Wand2 className="w-7 h-7 text-purple-600" />,
      themeColor: 'purple',
      url: 'https://adworld.xctf.org.cn/competitions-hall/competitions'
    },
    {
      id: 'ai_data_science',
      title: 'AI数据科学',
      englishTitle: 'AI Data Science',
      badge: '数据建模',
      description: '给你一个训练集，你来构建预测模型——销量预测、分类识别、时序 forecasting……在真实数据集中打磨算法，用测试集分数验证你的实力。这里是数据科学家的实战练兵场。',
      icon: <BarChart3 className="w-7 h-7 text-cyan-600" />,
      themeColor: 'cyan',
      url: 'https://adworld.xctf.org.cn/competitions-hall/competitions'
    },
    {
      id: 'ai_security',
      title: 'AI安全挑战',
      englishTitle: 'AI Security Challenge',
      badge: '攻防对抗',
      description: '在真实的模拟攻防中，用智能体（Agent）去发现漏洞、破解谜题、抵御攻击。网络安全没有标准答案，只有不断进化的挑战。',
      icon: <ShieldAlert className="w-7 h-7 text-emerald-600" />,
      themeColor: 'emerald',
      url: 'https://adworld.xctf.org.cn/competitions-hall/competitions'
    },
    {
      id: 'gov_humanities',
      title: '政务人文',
      englishTitle: 'Gov & Humanities',
      badge: '智慧文化',
      description: '挖掘本地文化故事、辅助政务宣传创意、用AI视角重新发现城市的美好。这里是科技与人文的交汇处。',
      icon: <Landmark className="w-7 h-7 text-amber-600" />,
      themeColor: 'amber'
    },
    {
      id: 'ai_application',
      title: 'AI应用创意',
      englishTitle: 'AI Application Showcase',
      badge: '场景落地',
      description: '从智能助手到行业应用，看AI如何落地到实际场景中。这里汇集了各种脑洞大开的AI项目，等你来探索和借鉴。',
      icon: <Rocket className="w-7 h-7 text-indigo-600" />,
      themeColor: 'indigo',
      url: 'http://10.4.5.3/page/mg/project-hall'
    }
  ];

  const handleEnterCard = (card: CreativeCard) => {
    if (card.url) {
      showToast(`正在前往【${card.title}】外部平台...`);
      window.open(card.url, '_blank', 'noopener,noreferrer');
    } else {
      showToast(`【${card.title}】板块即将开放，敬请期待！`);
    }
  };

  const getThemeStyles = (color: CreativeCard['themeColor']) => {
    switch (color) {
      case 'purple':
        return {
          cardBorder: 'border-purple-200/80 hover:border-purple-400 hover:shadow-purple-100/50',
          bgGlow: 'bg-purple-500/10',
          badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
          btn: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-3xs hover:shadow-sm hover:scale-[1.02] active:scale-95 shadow-purple-500/20',
          iconBg: 'bg-purple-50 border-purple-100',
          cardBg: 'from-purple-50/10 via-white to-slate-50/30'
        };
      case 'cyan':
        return {
          cardBorder: 'border-cyan-200/80 hover:border-cyan-400 hover:shadow-cyan-100/50',
          bgGlow: 'bg-cyan-500/10',
          badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
          btn: 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-3xs hover:shadow-sm hover:scale-[1.02] active:scale-95 shadow-cyan-500/20',
          iconBg: 'bg-cyan-50 border-cyan-100',
          cardBg: 'from-cyan-50/10 via-white to-slate-50/30'
        };
      case 'emerald':
        return {
          cardBorder: 'border-emerald-200/80 hover:border-emerald-400 hover:shadow-emerald-100/50',
          bgGlow: 'bg-emerald-500/10',
          badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          btn: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-3xs hover:shadow-sm hover:scale-[1.02] active:scale-95 shadow-emerald-500/20',
          iconBg: 'bg-emerald-50 border-emerald-100',
          cardBg: 'from-emerald-50/10 via-white to-slate-50/30'
        };
      case 'amber':
        return {
          cardBorder: 'border-amber-200/80 hover:border-amber-400 hover:shadow-amber-100/50',
          bgGlow: 'bg-amber-500/10',
          badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
          btn: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-3xs hover:shadow-sm hover:scale-[1.02] active:scale-95 shadow-amber-500/20',
          iconBg: 'bg-amber-50 border-amber-100',
          cardBg: 'from-amber-50/10 via-white to-slate-50/30'
        };
      case 'indigo':
        return {
          cardBorder: 'border-indigo-200/80 hover:border-indigo-400 hover:shadow-indigo-100/50',
          bgGlow: 'bg-indigo-500/10',
          badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          btn: 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-3xs hover:shadow-sm hover:scale-[1.02] active:scale-95 shadow-indigo-500/20',
          iconBg: 'bg-indigo-50 border-indigo-100',
          cardBg: 'from-indigo-50/10 via-white to-slate-50/30'
        };
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12 select-none font-sans">
      
      {/* Standard Unified Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-2xs shrink-0">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              创意空间
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                Creative Space
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              激发 AI 创新灵感，涵盖设计生成、数据科学、安全挑战与产业落地场景
            </p>
          </div>
        </div>
      </div>

      {/* 5大卡片陈列区：顶部3张，底部2张 (与人才学院完全一致的 3+2 双排排版) */}
      <div className="space-y-6">
        
        {/* 第一排：3个卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creativeCards.slice(0, 3).map(card => {
            const styles = getThemeStyles(card.themeColor);
            return (
              <div 
                key={card.id}
                className={`group relative rounded-3xl bg-gradient-to-br ${styles.cardBg} border ${styles.cardBorder} p-7 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1 min-h-[300px]`}
              >
                {/* 科技感微点阵背景 */}
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-35 pointer-events-none" />

                {/* 右上角背景微光效果 */}
                <div className={`absolute -top-10 -right-10 w-40 h-40 ${styles.bgGlow} rounded-full blur-2xl group-hover:scale-125 transition-transform pointer-events-none`} />

                <div className="space-y-4 relative z-10">
                  {/* 头部图标与 Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className={`w-14 h-14 rounded-2xl ${styles.iconBg} border shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                      {card.icon}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${styles.badgeBg}`}>
                        {card.badge}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold font-mono tracking-tight">
                        {card.englishTitle}
                      </span>
                    </div>
                  </div>

                  {/* 标题 */}
                  <div>
                    <h2 className="text-xl font-black text-slate-900 group-hover:text-purple-600 transition-colors">
                      {card.title}
                    </h2>
                  </div>

                  {/* 详细描述 */}
                  <p className="text-xs text-slate-600 leading-relaxed font-normal min-h-[64px] line-clamp-3 md:line-clamp-4">
                    {card.description}
                  </p>
                </div>

                {/* 底部按钮：自适应宽度、精致、不再太长太突兀 */}
                <div className="pt-4 relative z-10 flex justify-start">
                  <button
                    onClick={() => handleEnterCard(card)}
                    className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95 ${styles.btn}`}
                  >
                    <span>立即进入</span>
                    {card.url ? <ExternalLink className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* 第二排：2个大卡片 (宽卡片排版，完全对齐人才学院) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {creativeCards.slice(3, 5).map(card => {
            const styles = getThemeStyles(card.themeColor);
            return (
              <div 
                key={card.id}
                className={`group relative rounded-3xl bg-gradient-to-br ${styles.cardBg} border ${styles.cardBorder} p-7 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1 min-h-[260px]`}
              >
                {/* 科技感微点阵背景 */}
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-35 pointer-events-none" />

                {/* 右上角背景微光效果 */}
                <div className={`absolute -top-10 -right-10 w-44 h-44 ${styles.bgGlow} rounded-full blur-2xl group-hover:scale-125 transition-transform pointer-events-none`} />

                <div className="space-y-4 relative z-10">
                  {/* 头部图标与 Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className={`w-14 h-14 rounded-2xl ${styles.iconBg} border shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                      {card.icon}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${styles.badgeBg}`}>
                        {card.badge}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold font-mono tracking-tight">
                        {card.englishTitle}
                      </span>
                    </div>
                  </div>

                  {/* 标题 */}
                  <div>
                    <h2 className="text-xl font-black text-slate-900 group-hover:text-purple-600 transition-colors">
                      {card.title}
                    </h2>
                  </div>

                  {/* 详细描述 */}
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>

                {/* 底部按钮：自适应宽度、精致、不再太长太突兀 */}
                <div className="pt-4 relative z-10 flex justify-start">
                  <button
                    onClick={() => handleEnterCard(card)}
                    className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95 ${styles.btn}`}
                  >
                    <span>立即进入</span>
                    {card.url ? <ExternalLink className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
