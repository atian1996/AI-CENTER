import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CourseItem } from '../../types';
import { mockLearningPaths } from '../../data/mockData';
import { 
  GraduationCap, 
  Play, 
  Terminal, 
  Award, 
  BookOpen, 
  Star, 
  Users, 
  CheckCircle, 
  Sparkles, 
  MessageSquare, 
  ArrowRight,
  X
} from 'lucide-react';

export const LearningView: React.FC = () => {
  const { 
    courses, 
    setActiveTab, 
    setWorkspaceSubTab, 
    launchGpuInstance, 
    showToast 
  } = useApp();

  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  const [activeChapter, setActiveChapter] = useState<number>(0);
  const [examModalOpen, setExamModalOpen] = useState(false);

  const handleLaunchExperiment = (notebookPreset?: string) => {
    showToast(` 正在为您自动拉起算力工坊【${notebookPreset || 'Notebook开发'}】GPU 实验环境...`);
    launchGpuInstance('Notebook开发', 'T4 16GB', 'JupyterLab + PyTorch 2.3.1');
    setActiveTab('compute');
  };

  return (
    <div className="w-full space-y-8 animate-fade-in pb-12 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            学习中心 - 从入门到精通全栈 AI 开发者学院
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            系统化理论课程 + 零部署在线 GPU 算法实验 + 权威可验证技能认证证书
          </p>
        </div>

        <button
          onClick={() => setExamModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Award className="w-4 h-4 text-amber-300" />
          <span>参加认证考试 (领证书)</span>
        </button>
      </div>

      {/* Learning Roadmaps */}
      <div className="space-y-4">
        <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          推荐职业进阶路线图
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockLearningPaths.map(lp => (
            <div key={lp.id} className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 shadow-xs hover:shadow-xl hover:shadow-indigo-500/10 space-y-3 transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-indigo-600">{lp.targetRole}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{lp.stepCount} 门关卡</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{lp.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-normal">{lp.description}</p>
              </div>

              <button
                onClick={() => showToast(`已加入【${lp.title}】学习计划`)}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>一键加入路径</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Course Catalog */}
      <div className="space-y-4">
        <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-600" />
          热门精品实战课程
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map(crs => (
            <div
              key={crs.id}
              className="group rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 overflow-hidden shadow-xs hover:shadow-xl hover:shadow-indigo-500/10 transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={crs.cover}
                    alt={crs.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-indigo-700 text-[10px] font-bold border border-slate-200 shadow-xs">
                    {crs.category}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {crs.title}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
                    <span>讲师: {crs.instructor}</span>
                    <span>· {crs.studentsCount} 学员在学</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                    {crs.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between text-xs border-t border-slate-100 pt-4">
                <span className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {crs.rating}
                </span>
                <button
                  onClick={() => setSelectedCourse(crs)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" /> 进入学习
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Detail & Video Player Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedCourse.title}</h3>
                  <div className="text-[11px] text-slate-500 font-medium">讲师: {selectedCourse.instructor} ({selectedCourse.instructorTitle})</div>
                </div>
              </div>
              <button onClick={() => setSelectedCourse(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 font-medium">
              {/* Simulated Video Player */}
              <div className="relative w-full aspect-video rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden group">
                <img src={selectedCourse.cover} alt="video" className="w-full h-full object-cover opacity-30" />
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-2xl">
                    <Play className="w-8 h-8 fill-white ml-1" />
                  </div>
                  <div className="text-xs font-bold text-white">
                    播放第 {activeChapter + 1} 章: {selectedCourse.chapters[activeChapter]?.title || '视频加载中'}
                  </div>
                </div>
              </div>

              {/* Action: 拉起算力工坊 Notebook 在线实验 */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-white to-cyan-50 border border-indigo-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Terminal className="w-6 h-6 text-cyan-600 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900 text-sm">学完一章点击“在线实验”</div>
                    <div className="text-slate-500 text-[11px]">自动为您拉起已预装代码与依赖包的算力工坊 Notebook 环境</div>
                  </div>
                </div>
                <button
                  onClick={() => handleLaunchExperiment(selectedCourse.chapters[activeChapter]?.notebookPreset)}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Terminal className="w-4 h-4" />
                  <span>在线拉起 GPU 实验环境</span>
                </button>
              </div>

              {/* Chapters List */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">课程大纲</h4>
                <div className="space-y-1.5">
                  {selectedCourse.chapters.map((ch, idx) => (
                    <div
                      key={ch.id}
                      onClick={() => setActiveChapter(idx)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        activeChapter === idx
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold'
                          : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Play className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{ch.title}</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px]">{ch.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certification Exam Modal */}
      {examModalOpen && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4 text-xs font-medium">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                千机开发者认证技能考试
              </h3>
              <button onClick={() => setExamModalOpen(false)} className="p-1 rounded-lg text-slate-400 bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-600 leading-relaxed font-normal">
              考试包含 20 道单选与 1 道 Agent 编写实操题，合格通过后将为您颁发加密与区块链可验证的电子认证证书。
            </p>

            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-800">初级: AI 基础与 Prompt 认证</span>
                <button onClick={() => { showToast('准备开始初级认证在线测试...'); setExamModalOpen(false); }} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold">开始</button>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-800">中级: LangGraph Agent 架构师</span>
                <button onClick={() => { showToast('准备开始中级认证在线测试...'); setExamModalOpen(false); }} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold">开始</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
