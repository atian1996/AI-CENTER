import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, 
  Bot, 
  ShieldCheck, 
  BrainCircuit, 
  Terminal, 
  Award, 
  ArrowRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface AcademyCard {
  id: string;
  title: string;
  englishTitle: string;
  badge: string;
  description: string;
  icon: React.ReactNode;
  themeColor: 'cyan' | 'purple' | 'indigo' | 'emerald' | 'amber';
  url?: string;
}

export const LearningView: React.FC = () => {
  const { showToast } = useApp();

  const academyCards: AcademyCard[] = [
    {
      id: 'youth_ai',
      title: '青少年人工智能',
      englishTitle: 'Youth AI Exploration',
      badge: '启蒙教育',
      description: '专为青少年打造的人工智能与编程启蒙课程体系，结合智能硬件与计算思维训练，通过趣味化互动实验激发下一代科学与算法创造力。',
      icon: <Bot className="w-7 h-7 text-cyan-600" />,
      themeColor: 'cyan'
    },
    {
      id: 'security_awareness',
      title: '网络安全意识教育',
      englishTitle: 'Security Awareness',
      badge: '安全通识',
      description: '全员普及型网络安全通识与攻防演练，涵盖社交工程防范、数据隐私合规、钓鱼邮件识别与日常办公商业秘密保护防线。',
      icon: <ShieldCheck className="w-7 h-7 text-purple-600" />,
      themeColor: 'purple'
    },
    {
      id: 'ai_practice',
      title: '人工智能实训',
      englishTitle: 'AI Hands-on CyberLab',
      badge: '云端 GPU 实训',
      description: '基于真实工业级 GPU 算力的云端实训环境，涵盖大模型微调、RAG 知识库检索增强、Agent 智能体开发与云端高并发部署实操。',
      icon: <BrainCircuit className="w-7 h-7 text-indigo-600" />,
      themeColor: 'indigo',
      url: 'http://10.4.5.3/page/mg/course'
    },
    {
      id: 'cyber_security_practice',
      title: '网络安全实训',
      englishTitle: 'Cyber Security CyberRange',
      badge: '攻防靶场',
      description: '提供真实网络拓扑与安全漏洞场景，涵盖 Web 渗透测试、CTF 攻防竞赛题库、二进制 PWN 漏洞挖掘与红蓝对抗实战演练。',
      icon: <Terminal className="w-7 h-7 text-emerald-600" />,
      themeColor: 'emerald',
      url: 'http://10.30.130.11/page/mg/oj/all-course'
    },
    {
      id: 'certification',
      title: '培训&人才认证',
      englishTitle: 'Training & Certification',
      badge: '权威认证',
      description: '联合权威机构打造的数字技术人才认证体系，提供精准考前强化培训、智能在线监考评估与上链加密防伪技术人才技能证书。',
      icon: <Award className="w-7 h-7 text-amber-600" />,
      themeColor: 'amber',
      url: 'https://adworld.xctf.org.cn/home'
    }
  ];

  const handleEnterCard = (card: AcademyCard) => {
    if (card.url) {
      showToast(`正在前往【${card.title}】外部平台...`);
      window.open(card.url, '_blank', 'noopener,noreferrer');
    } else {
      showToast(`已成功进入【${card.title}】课程体系！`);
    }
  };

  // Color theme mapping for clean inline badges, subtle borders, and gradient buttons
  const getThemeStyles = (color: AcademyCard['themeColor']) => {
    switch (color) {
      case 'cyan':
        return {
          cardBorder: 'border-cyan-200/80 hover:border-cyan-400 hover:shadow-cyan-100/50',
          bgGlow: 'bg-cyan-500/10',
          badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
          btn: 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-3xs hover:shadow-sm hover:scale-[1.02] active:scale-95 shadow-cyan-500/20',
          iconBg: 'bg-cyan-50 border-cyan-100',
          cardBg: 'from-cyan-50/10 via-white to-slate-50/30'
        };
      case 'purple':
        return {
          cardBorder: 'border-purple-200/80 hover:border-purple-400 hover:shadow-purple-100/50',
          bgGlow: 'bg-purple-500/10',
          badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
          btn: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-3xs hover:shadow-sm hover:scale-[1.02] active:scale-95 shadow-purple-500/20',
          iconBg: 'bg-purple-50 border-purple-100',
          cardBg: 'from-purple-50/10 via-white to-slate-50/30'
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
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12 select-none font-sans">
      
      {/* Standard Unified Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              人才学院
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Talent Academy
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              打造专业的人工智能与网络安全人才培育基地，提供全流程实战与权威认证服务
            </p>
          </div>
        </div>
      </div>

      {/* 5大卡片陈列区：顶部3张，底部2张 */}
      <div className="space-y-6">
        
        {/* 第一排：3个卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {academyCards.slice(0, 3).map(card => {
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
                  <h2 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {card.title}
                  </h2>

                  {/* 简介描述 */}
                  <p className="text-xs text-slate-600 leading-relaxed font-normal min-h-[56px] line-clamp-3 md:line-clamp-4">
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

        {/* 第二排：2个大卡片 (宽卡片布局) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {academyCards.slice(3, 5).map(card => {
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
                  <h2 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {card.title}
                  </h2>

                  {/* 简介描述 */}
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
