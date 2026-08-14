import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskItem, TaskType, TaskStatus } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Plus, 
  Clock, 
  Coins, 
  Send, 
  FileText, 
  MessageSquare, 
  UploadCloud, 
  Paperclip, 
  X, 
  ShieldAlert, 
  User, 
  CheckCircle2, 
  TrendingUp,
  Search,
  Users,
  Sparkles,
  ArrowLeft,
  ArrowUpDown,
  Check,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';

// Unified 30-Task Database Mapping exactly to the 5 Domains requested
const INITIAL_30_TASKS = [
  // 领域一：技术开发
  {
    id: 't1',
    title: '金融新闻情感分类模型优化',
    domain: '技术开发',
    difficulty: '进阶',
    rewardText: '¥2,000 + 200积分',
    description: '需要优化现有模型在金融领域的情感分类准确率，提升F1值到90%以上，解决多类别下暗弱舆情漏报问题。',
    deadlineText: '3 天',
    participantsCount: 5,
    participantsUnit: '人已报名',
    completedStatusText: '✅ 1人已完成',
    publisher: '某基金公司',
    publishDate: '2026-08-12',
    skills: ['NLP', 'BERT', '情感分析', '模型微调'],
    details: [
      '分析现有分类模型在金融特定语料上的误判特征与性能瓶颈；',
      '针对金融专业词汇及上下文反讽语气提出并实施特征优化方案；',
      '目标将主流金融新闻分类的F1-Score提升至90%以上，并通过严格测试集考核；',
      '最终交付优化后的模型权重、部署文件及技术优化实施文档。'
    ]
  },
  {
    id: 't2',
    title: '智能玩具AI对话Agent开发',
    domain: '技术开发',
    difficulty: '专家',
    rewardText: '¥5,000-¥10,000',
    description: '为儿童智能交互玩具开发端侧AI对话功能模块，需深度适配并嵌入至特定硬件中，支持完全离线运行。',
    deadlineText: '12 天',
    participantsCount: 8,
    participantsUnit: '人已报名',
    publisher: '某玩具厂商',
    publishDate: '2026-08-11',
    skills: ['Agent', '嵌入式', '离线推理', '语音TTS'],
    details: [
      '定制适合儿童角色对话、情绪安抚及益智问答的离线Prompt模板与逻辑链；',
      '优化轻量级语言模型在ARM低算力芯片上的本地化推理部署，降低资源占用率；',
      '实现端侧语音合成（TTS）与识别（ASR）的低延迟串联（单次响应控制在1s内）；',
      '交付支持离线物理硬件烧录的工程代码与音视频接口API方案。'
    ]
  },
  {
    id: 't3',
    title: 'Python脚本自动化报表生成',
    domain: '技术开发',
    difficulty: '入门',
    rewardText: '¥500',
    description: '编写轻量化脚本从指定数据库定期提取关键业务数据并自动生成格式化的Excel/PDF日报表。',
    deadlineText: '2 天',
    participantsCount: 3,
    participantsUnit: '人已报名',
    publisher: '某科技初创企业',
    publishDate: '2026-08-13',
    skills: ['Python', 'SQL', 'Pandas', '自动化'],
    details: [
      '编写健壮的SQL查询语句连接业务数据库，提取多维度业务转化数据；',
      '使用Pandas与OpenPyXL对数据进行清洗、汇总并导出精美的图表样式；',
      '结合SMTP协议，实现每日定时自动发送报表及附件到指定的管理层邮箱；',
      '交付完整且含中文注释的Python脚本及一键环境依赖清单。'
    ]
  },
  {
    id: 't4',
    title: '电商推荐系统算法优化',
    domain: '技术开发',
    difficulty: '进阶',
    rewardText: '¥3,000-¥5,000',
    description: '重构并优化现有的电商微服务推荐算法，提升千万级高并发商品库的实时推荐点击转化率。',
    deadlineText: '7 天',
    participantsCount: 4,
    participantsUnit: '人已报名',
    publisher: '某知名电商平台',
    publishDate: '2026-08-10',
    skills: ['协同过滤', '推荐算法', '深度学习', '并发优化'],
    details: [
      '分析现有协同过滤在应对新用户冷启动与稀疏矩阵时的性能缺陷；',
      '引入向量检索（如Faiss）等深度召回策略，提升多级相关度召回精度；',
      '实测推荐转化率（CTR）提升2%以上，并保障高峰期系统平均响应时间≤80ms；',
      '交付优化后的推荐核心算法代码、召回排队流及压力测试评估报告。'
    ]
  },
  {
    id: 't5',
    title: '语音识别模型API接口开发',
    domain: '技术开发',
    difficulty: '进阶',
    rewardText: '¥1,500',
    description: '将现有的端到端中文语音识别模型（ASR）封装为高性能、易扩展且高可用的标准RESTful API接口服务。',
    deadlineText: '4 天',
    participantsCount: 2,
    participantsUnit: '人已报名',
    publisher: '某智能语音公司',
    publishDate: '2026-08-12',
    skills: ['FastAPI', 'ASR封装', 'Docker部署', '高并发'],
    details: [
      '使用FastAPI或Sanic框架编写语音输入、流式传输、音效格式转换及文字输出接口；',
      '编写多进程/多线程并发队列逻辑，确保多音频流输入时服务不宕机、无死锁；',
      '封装整体运行环境至轻量级Docker镜像中，提供一键构建与部署命令；',
      '提供标准的Postman测试集、调用示例及完备的API中文手册。'
    ]
  },
  {
    id: 't6',
    title: '工业质检视觉模型开发',
    domain: '技术开发',
    difficulty: '专家',
    rewardText: '¥8,000-¥15,000',
    description: '为工厂自动化流水线开发基于计算机视觉的实时缺陷检测模型，高效识别钢板表面的裂纹与微瑕。',
    deadlineText: '20 天',
    participantsCount: 3,
    participantsUnit: '人已报名',
    publisher: '某智能制造工厂',
    publishDate: '2026-08-08',
    skills: ['计算机视觉', 'YOLOv8', '缺陷检测', '工业视觉'],
    details: [
      '针对钢板流水线因反光和低对比度导致的微小微瑕进行自适应对比度增强处理；',
      '训练轻量化的YOLO检测模型，并在边缘计算板卡（如Jetson）上运行实测；',
      '要求瑕疵识别准确率≥98.5%，检测延迟≤30ms以配合高流速传输；',
      '交付完整的标注数据集、模型训练脚本、推理部署脚本及实地调试指南。'
    ]
  },

  // 领域二：内容创作
  {
    id: 't7',
    title: '电商产品图文详情批量生成',
    domain: '内容创作',
    difficulty: '入门',
    rewardText: '¥2/套 + 1积分/套',
    description: '根据产品基础数据与卖点信息，利用AI批量生成1000套电商平台精美详情页图文（文案+配图方案）。',
    deadlineText: '5 天',
    participantsCount: 12,
    participantsUnit: '人已认领',
    publisher: '某电商运营公司',
    publishDate: '2026-08-13',
    skills: ['Midjourney', '电商文案', '批量处理', 'Stable Diffusion'],
    details: [
      '结合大模型批量输出切合产品属性的吸引性爆款营销卖点文案；',
      '设计多套背景、光影与材质匹配的AI摄影合成图文配图提示词模板；',
      '按照批量格式规范，完美拼装出首尾连贯的高质量单品详情长图；',
      '交付1000套打包的高清电商详情配图文件及对应的核心营销文案Word。'
    ]
  },
  {
    id: 't8',
    title: '政务宣传海报方案设计',
    domain: '内容创作',
    difficulty: '进阶',
    rewardText: '¥1,000-¥2,000',
    description: '设计并输出一套展现现代智慧城市与生态宜居形象的政务海报方案（共5张不同宣传子主题）。',
    deadlineText: '6 天',
    participantsCount: 6,
    participantsUnit: '人已报名',
    publisher: '某市政宣传部门',
    publishDate: '2026-08-11',
    skills: ['海报设计', 'AI辅助制图', '文案润色', '视觉排版'],
    details: [
      '海报主题需围绕“绿色、智能、人文、包容、共享”五大板块展开宏伟叙事；',
      '使用主流AI图片生成平台辅助获取写实底画，手工在矢量软件中进行二次精修；',
      '文案需庄重大气，排版色彩和谐，并完全适配印刷级别的超高清精度规格；',
      '交付5张海报的PSD源文件、印刷级TIFF以及无水印超清JPG大图。'
    ]
  },
  {
    id: 't9',
    title: '短视频脚本创作（10条）',
    domain: '内容创作',
    difficulty: '入门',
    rewardText: '¥300',
    description: '围绕“AI如何改变我们的日常生活”主题，创作10条适合在短视频平台快速传播的60秒快节奏剧情脚本。',
    deadlineText: '3 天',
    participantsCount: 4,
    participantsUnit: '人已报名',
    publisher: '某新媒体工作室',
    publishDate: '2026-08-13',
    skills: ['文案创作', '脚本分镜', '新媒体运营', '创意策划'],
    details: [
      '每条脚本结构需遵循“3秒黄金钩子吸引-15秒冲突切入-35秒反转方案-7秒引导点赞”；',
      '内容需要融合真实日常痛点，融入趣味生活场景，避免刻板说教和冰冷名词；',
      '每份脚本需清晰标注出具体的台词、环境音、视觉参考和角色分镜动作；',
      '交付10个分栏编写好的Word分镜脚本，确保能直接提供给编导进行实地开拍。'
    ]
  },
  {
    id: 't10',
    title: '产品评测文章撰写（20篇）',
    domain: '内容创作',
    difficulty: '入门',
    rewardText: '¥50/篇',
    description: '深度体验并撰写20篇针对当下热门AI产品与应用的横向测评文章，要求文章生动具有极高参考价值。',
    deadlineText: '10 天',
    participantsCount: 5,
    participantsUnit: '人已报名',
    publisher: '某科技自媒体',
    publishDate: '2026-08-12',
    skills: ['科技写作', '产品测评', '用户视角', '体验报告'],
    details: [
      '选择20款包含画图、协作、翻译及垂直赛道的最新消费级AI工具进行深度上手；',
      '每篇文章不少于1500字，包含真实使用体验图、详细功能对比及客观的优缺点；',
      '以幽默、通俗、专业的互联网语言拆解技术细节，确保内容易懂且极具实操价值；',
      '交付20篇带有实操插图的MarkDown/Word格式文案，文字排版需层次优雅清晰。'
    ]
  },
  {
    id: 't11',
    title: '品牌Slogan创意征集',
    domain: '内容创作',
    difficulty: '入门',
    rewardText: '¥800',
    description: '为新成立的智能家居与人性化科技品牌，创意撰写3条兼具科技感、现代感与人文关怀的品牌宣传语。',
    deadlineText: '4 天',
    participantsCount: 9,
    participantsUnit: '人已报名',
    publisher: '某家居科技公司',
    publishDate: '2026-08-13',
    skills: ['文案策划', '创意定位', '品牌语', '市场调研'],
    details: [
      '梳理该智能家居品牌的硬件优势、主打生态和核心用户画像定位；',
      '提交不少于15个备选创意案，并最终精选出3款最具冲击力与辨识度的标志性Slogan；',
      '每条Slogan需提供详尽的创意思路、文化背景、释义说明及户外、大屏模拟效果；',
      '交付一整套品牌Slogan策略提议PPT（或Word文档），观点鲜明阐述充分。'
    ]
  },
  {
    id: 't12',
    title: '行业白皮书撰写',
    domain: '内容创作',
    difficulty: '进阶',
    rewardText: '¥3,000-¥5,000',
    description: '调研并撰写一份深度剖析《2026年中国AI大模型行业应用与企业落地实务白皮书》，总篇幅2万字左右。',
    deadlineText: '15 天',
    participantsCount: 2,
    participantsUnit: '人已报名',
    publisher: '某行业研究机构',
    publishDate: '2026-08-10',
    skills: ['行业调研', '白皮书', '数据分析', '商务文案'],
    details: [
      '系统梳理2025-2026年大模型核心技术的迭代演进、垂直应用代表及典型落地方案；',
      '包含金融、制造、零售等不少于4个代表性行业的详细深度案例剖析与得失总结；',
      '预测未来3-5年内生成式AI在政企落地上面临的阻碍、变革以及投资规模展望；',
      '交付排版严谨、包含高质量图表与详实参考文献的专业级PDF及可编辑Word原稿。'
    ]
  },

  // 领域三：AI模型与数据
  {
    id: 't13',
    title: '图像分类数据标注',
    domain: 'AI模型与数据',
    difficulty: '入门',
    rewardText: '¥0.5/张 + 0.2积分/张',
    description: '对10000张自然多场景下的海量图像进行多分类极精细标注，标注结果需满足极高质量验证要求。',
    deadlineText: '7 天',
    participantsCount: 12,
    participantsUnit: '人已认领',
    publisher: '某数据标注平台',
    publishDate: '2026-08-13',
    skills: ['数据标注', '分类打标', '图像清洗', '质量管控'],
    details: [
      '使用指定的在线标注工具（如LabelMe），对图片中的多类型物体进行框选并分类；',
      '严格根据打标细则标准判别各类歧义场景、遮挡、阴影等边界复杂物体的归属；',
      '要求首批及多轮返修打标结果综合准确率达到99.5%以上，并无漏标、错标情况；',
      '提交完整导出的包含标准分类层级的JSON/COCO标注数据集及简要打标总结报表。'
    ]
  },
  {
    id: 't14',
    title: '大模型微调指令数据生成',
    domain: 'AI模型与数据',
    difficulty: '进阶',
    rewardText: '¥3/条 + 1积分/条',
    description: '按指定严苛格式生成2000条高质量垂直行业的Agent多轮微调指令问答数据（偏向客服与业务纠纷）。',
    deadlineText: '10 天',
    participantsCount: 3,
    participantsUnit: '人已报名',
    publisher: '某大模型研发团队',
    publishDate: '2026-08-12',
    skills: ['指令微调', '数据集生成', 'Prompt', '大模型微调'],
    details: [
      '设计多维度、复杂场景和高拟真度的用户提问Prompt指令；',
      '人工纠正并产出专业精炼、逻辑性极强、符合法律法规与企业规范的详实优质回复；',
      '包含单轮基础对话和多轮追问澄清等多种格式，且不包含套话和AI模板语；',
      '交付2000条符合Alpaca或JSONL标准指令微调数据集要求的UTF-8文件。'
    ]
  },
  {
    id: 't15',
    title: '医疗影像分割模型训练',
    domain: 'AI模型与数据',
    difficulty: '专家',
    rewardText: '¥6,000-¥12,000',
    description: '基于小样本CT/MRI三维立体医学影像，训练特定胸部器官或病灶位置的自动分割与边缘提取模型。',
    deadlineText: '30 天',
    participantsCount: 4,
    participantsUnit: '人已报名',
    publisher: '某三甲医院研究中心',
    publishDate: '2026-08-05',
    skills: ['医疗分割', '3D-UNet', 'PyTorch', '图像分割'],
    details: [
      '对获取的高分辨率CT图像进行预处理（包括多折叠去燥、空腔滤波、数据增强）；',
      '选用3D-UNet, SegFormer或Swin-UNETR等主流优秀分割模型进行定制并精调；',
      '平均Dice相似性系数要求达到88%以上，并且具备极佳的边缘平滑度与抗噪能力；',
      '交付模型全套训练源码、最优权重包、推理预测测试演示及详细的研究性技术方案。'
    ]
  },
  {
    id: 't16',
    title: '爬虫数据采集与清洗',
    domain: 'AI模型与数据',
    difficulty: '进阶',
    rewardText: '¥1,200',
    description: '编写分布式采集系统，对数个电商平台特定垂直品类的海量公开评论及商品信息进行多维清洗整合。',
    deadlineText: '5 天',
    participantsCount: 6,
    participantsUnit: '人已报名',
    publisher: '某数据分析服务商',
    publishDate: '2026-08-12',
    skills: ['爬虫', 'Scrapy', '数据清洗', '文本过滤'],
    details: [
      '编写支持多线程、分布式和自动规避反爬限流策略的优雅爬虫程序；',
      '高效抓取商品标题、价格、销量、星级、全量历史评论文案及发布时间等；',
      '使用正则表达式与情感分析初级分类器，对获取的低质水军及灌水垃圾评论进行彻底过滤；',
      '交付结构化的MySQL表、清洗干净的CSV文件，以及整套安全合规运行的采集脚本。'
    ]
  },
  {
    id: 't17',
    title: '金融情感词典构建',
    domain: 'AI模型与数据',
    difficulty: '进阶',
    rewardText: '¥2,000-¥3,000',
    description: '构建一个面向中国金融证券垂直领域的精细化情感极性词典，支持多级别舆情因子加权评估。',
    deadlineText: '14 天',
    participantsCount: 2,
    participantsUnit: '人已报名',
    publisher: '某量化投资机构',
    publishDate: '2026-08-10',
    skills: ['词典构建', '金融语料', '情感加权', '词干分析'],
    details: [
      '梳理包括财报、券商研报、股吧发言及行业新闻等数百万字的金融专有中文文本；',
      '人工标定并结合自研共现频率算法，抽离出超8000个极具行业指向性的强烈情感词汇；',
      '为词汇标注正面、负面、中性倾向度，并分配合理的置信概率与金融专属加权权重；',
      '交付可直接被jieba等分词工具读取的文本词典、Excel完整版、及说明权重原理的白皮书。'
    ]
  },
  {
    id: 't18',
    title: '模型推理速度优化',
    domain: 'AI模型与数据',
    difficulty: '专家',
    rewardText: '¥2,500',
    description: '针对主流百亿级（如Llama3/Qwen2-7B）开源模型，对端侧硬件部署下的本地推理吞吐指标进行极致调优。',
    deadlineText: '6 天',
    participantsCount: 1,
    participantsUnit: '人已报名',
    publisher: '某智能软硬件厂商',
    publishDate: '2026-08-13',
    skills: ['模型量化', 'vLLM', 'TensorRT', '吞吐优化'],
    details: [
      '使用INT8/INT4等先进算法（AWQ、GPTQ）在保障困惑度不明显受损下完成极限压缩；',
      '利用vLLM、TensorRT-LLM等推理框架重新配置底层多路计算流程与Cache机制；',
      '测试多并发条件下的吞吐速度（Token/s）提升50%以上，大幅降低首字延迟与显存占用；',
      '交付经过极致量化的模型权重文件、优化前后的横向基准测试文档以及详细的部署脚本。'
    ]
  },

  // 领域四：工具与自动化
  {
    id: 't19',
    title: 'ComfyUI工作流搭建',
    domain: '工具与自动化',
    difficulty: '进阶',
    rewardText: '¥1,000',
    description: '搭建一个支持高度精修与可控人物骨架姿态的多级文生图/图生图ComfyUI融合工作流。',
    deadlineText: '4 天',
    participantsCount: 7,
    participantsUnit: '人已报名',
    publisher: '某创意设计工作室',
    publishDate: '2026-08-13',
    skills: ['ComfyUI', 'SDXL', 'ControlNet', '工作流搭建'],
    details: [
      '合理组织并在画布中整洁编排包含Prompt调度、大模型加载、ControlNet细节控制和多重精修节点；',
      '针对画面特定细节局部、人脸畸变或手部结构设计自动高分辨率多级重绘链路；',
      '编写每个节点输入参数在生产环境下的参考标准，附带详细排错及插件缺少补齐方案；',
      '交付可无损直接导入运行的JSON工作流文件、所用插件清单以及详细的设计文档。'
    ]
  },
  {
    id: 't20',
    title: '企业知识库RAG系统搭建',
    domain: '工具与自动化',
    difficulty: '进阶',
    rewardText: '¥4,000-¥8,000',
    description: '基于企业海量零散的内部PDF、Word和图片合同文档，搭建一套私有化、高可信度且不跑题的RAG系统。',
    deadlineText: '20 天',
    participantsCount: 5,
    participantsUnit: '人已报名',
    publisher: '某中型集团企业',
    publishDate: '2026-08-08',
    skills: ['RAG系统', '向量库', 'LangChain', '文档清洗'],
    details: [
      '开发支持复杂表格、流程图解析与多层级标题层层继承的文档高保真分割清洗管道；',
      '采用两阶段重排机制（Re-ranker）优化召回，最大程度消除幻觉并减少不相关片段输入；',
      '设计支持引用溯源、来源超链接和智能澄清缺损信息的炫酷前端交互问答面板；',
      '交付完整本地私有化部署的系统源码、所用数据库及全面的安全测试报告。'
    ]
  },
  {
    id: 't21',
    title: 'AI客服微信公众号接入工具',
    domain: '工具与自动化',
    difficulty: '进阶',
    rewardText: '¥1,800',
    description: '开发支持将外部大模型Agent一键式极简接入至个人/企业微信公众号或企微生态的自动化工具插件。',
    deadlineText: '6 天',
    participantsCount: 3,
    participantsUnit: '人已报名',
    publisher: '某SaaS服务提供商',
    publishDate: '2026-08-12',
    skills: ['微信生态', '自动化工具', 'SaaS插件', 'API对接'],
    details: [
      '基于微信官方公众平台API，开发可以自适应识别文本、图文、菜单触控和语音回复的中间服务；',
      '针对微信强制的5秒内超时无应答机制，编写多重并发轮询挂起与异步队列兜底推送系统；',
      '提供傻瓜式的配置Web页面，供普通用户直接填写AppID及大模型APIKey即可一键通电；',
      '交付可立即上线的整套服务端代码、Web安装包、系统操作手册及常见拦截解答说明。'
    ]
  },
  {
    id: 't22',
    title: '跨平台内容分发自动化',
    domain: '工具与自动化',
    difficulty: '进阶',
    rewardText: '¥2,000-¥3,500',
    description: '开发一款支持多账户、批量多平台的文章一键同步与跨平台发布自动化工具。',
    deadlineText: '10 天',
    participantsCount: 4,
    participantsUnit: '人已报名',
    publisher: '某自媒体运营机构',
    publishDate: '2026-08-11',
    skills: ['内容分发', '自动化', 'Playwright', '矩阵运营'],
    details: [
      '使用Playwright或Puppeteer实现主流自媒体平台的自动化Cookie登录与账号矩阵存储；',
      '统一文本内容、配图、排版格式，自适应调整并一键分发并定时发布多篇优质长文；',
      '设计多进程任务分配架构，避免发布阻塞，具备高鲁棒性的断点续传与发布状态反馈报表；',
      '交付具有UI控制界面的完整独立软件安装包或一键网页部署平台。'
    ]
  },
  {
    id: 't23',
    title: 'AI模型API网关开发',
    domain: '工具与自动化',
    difficulty: '专家',
    rewardText: '¥2,200',
    description: '为企业内部团队调用的十余个异构第三方/私有化大模型大底座API开发统一的高性能分发网关。',
    deadlineText: '8 天',
    participantsCount: 2,
    participantsUnit: '人已报名',
    publisher: '某科技研发部门',
    publishDate: '2026-08-12',
    skills: ['API网关', '限流熔断', 'Go语言', '负载均衡'],
    details: [
      '使用Go语言或Kong网关搭建统一转换标准OpenAI/Anthropic接口报文的动态分发层；',
      '实现多维度流控（限频、限Token并发）和熔断策略，在多通道拥堵时自动降级和无感切源；',
      '设计极细粒度的调用审计机制，包含计算各应用组、各模型的Token花费与响应时间监控图表；',
      '交付全部网关逻辑源码、高稳定性测试数据以及开箱即用的部署方案。'
    ]
  },
  {
    id: 't24',
    title: 'AI工作流编排工具开发',
    domain: '工具与自动化',
    difficulty: '专家',
    rewardText: '¥8,000-¥15,000',
    description: '开发一款轻量级、完全可视化的图形界面AI多步骤逻辑工作流编排与底层大模型API调度调度工具。',
    deadlineText: '25 天',
    participantsCount: 2,
    participantsUnit: '人已报名',
    publisher: '某自动化解决方案商',
    publishDate: '2026-08-05',
    skills: ['工作流编排', 'ReactFlow', '可视化', '调度系统'],
    details: [
      '使用ReactFlow或Canvas技术构建直观的节点编辑、拖拽连线与属性动态编辑交互画布；',
      '支持编排各种类型节点：LLM调用、If分支、HTTP请求、变量提取及Python自定义脚本节点；',
      '编写底层DAG算法完成节点有向无环拓扑图排序，实现高效、可挂起并保存现场的运行调度器；',
      '交付完整支持私有云运行的纯前端模块源码、配套微服务API代码及详实的二次开发规范。'
    ]
  },

  // 领域五：咨询与培训
  {
    id: 't25',
    title: '企业AI质检方案技术咨询',
    domain: '咨询与培训',
    difficulty: '专家',
    rewardText: '¥5,000-¥10,000',
    description: '为一家大型汽车零配件制造加工企业，提供一份全面的视觉AI精密表面质检系统落地技术咨询与可行性方案。',
    deadlineText: '15 天',
    participantsCount: 3,
    participantsUnit: '人已报名',
    publisher: '某制造工业集团',
    publishDate: '2026-08-11',
    skills: ['AI咨询', '工业质检', '可行性研究', '架构规划'],
    details: [
      '实地调研（或远程视频）车间流水线的机械结构、生产节奏、现有误检漏检率等难点；',
      '评估包含相机选型、光源补光布置、边缘计算单元算力开销和模型更新闭环的技术拓扑；',
      '针对该车间提供详尽的ROI投入产出回报预测、建设周期、预估成本和硬件配置清单；',
      '交付一份不低于60页、具备高可落地性与学术严谨度的中文技术咨询PPT和Word报告。'
    ]
  },
  {
    id: 't26',
    title: 'Agent开发实战课程制作',
    domain: '咨询与培训',
    difficulty: '进阶',
    rewardText: '¥3,000-¥5,000',
    description: '制作一套针对中高级前端/Python开发者的《企业级Agent智能体多阶段实战课程》含全套教案、PPT及源码。',
    deadlineText: '20 天',
    participantsCount: 4,
    participantsUnit: '人已报名',
    publisher: '某在线IT教育平台',
    publishDate: '2026-08-10',
    skills: ['课程设计', 'Agent实战', '视频录制', '教案编写'],
    details: [
      '设计一套循序渐进的系统课大纲，内容涵盖ReAct框架、多Agent协同、向量外脑与工具链调用；',
      '录制不低于15课时、讲解生动直观的高画质实战视频，每一集讲解一个核心业务落定Demo；',
      '配套提供各章节开箱即用的Jupyter教学课件、课后思考实验以及标准答疑解析包；',
      '交付最终全部录制的1080P视频大盘、配套PPT教案源文件和完整的演示代码仓库。'
    ]
  },
  {
    id: 't27',
    title: '大模型选型评估报告',
    domain: '咨询与培训',
    difficulty: '进阶',
    rewardText: '¥1,500',
    description: '针对某金融客服与自动化文档场景，出具国内主流千亿/万亿大模型选型评估及对比测试分析方案报告。',
    deadlineText: '5 天',
    participantsCount: 6,
    participantsUnit: '人已报名',
    publisher: '某信息化咨询公司',
    publishDate: '2026-08-12',
    skills: ['大模型评估', '选型对比', '指标测评', '分析报告'],
    details: [
      '针对国内头部开源/商业化的大语言模型核心中文理解与金融推理指标进行横向数据基准整理；',
      '分析对比各服务在各API调用并发数、调用单价、网络吞吐延迟、私有化和安全策略上的优劣势；',
      '结合该金融公司的具体安全红线与可用预算，给出一套兼具科学性与性价比的最优选型结论；',
      '交付无冗余水分、逻辑紧凑且干货满满的中文研究对比白皮书文档。'
    ]
  },
  {
    id: 't28',
    title: '企业AI转型培训',
    domain: '咨询与培训',
    difficulty: '专家',
    rewardText: '¥8,000-¥12,000',
    description: '为一传统零售集团的中高层管理者，定制并讲授一门关于“AI时代传统零售核心破局与降本增效转型”培训课。',
    deadlineText: '10 天',
    participantsCount: 2,
    participantsUnit: '人已报名',
    publisher: '某传统零售企业',
    publishDate: '2026-08-12',
    skills: ['AI培训', '数字化转型', '新零售', '变革管理'],
    details: [
      '结合传统零售痛点（如高周转、高客单、多库存、重履约），拆解AI如何切入营销和供应链管理；',
      '定制一期不少于6小时的企业内部实地培训方案（支持远程多会场联动交互与典型推演）；',
      '提供生动案例（如瑞幸、Zara的AI配料与智能调价），让零技术背景的管理层快速洞悉技术能力；',
      '交付完整课件PPT、管理变革工具包、培训后考核测试方案与推荐阅读材料包。'
    ]
  },
  {
    id: 't29',
    title: 'AI产品可行性分析报告',
    domain: '咨询与培训',
    difficulty: '进阶',
    rewardText: '¥800',
    description: '为一初创团队设计的高保真垂直AI社交对话产品，从AI工程架构和商业变现场景维度，出具深度可行性分析。',
    deadlineText: '3 天',
    participantsCount: 5,
    participantsUnit: '人已报名',
    publisher: '某初创孵化团队',
    publishDate: '2026-08-13',
    skills: ['产品可行性', '社交AI', '商业变现', '产品经理'],
    details: [
      '深入拆解该社交产品在底层大模型长期记忆（Long-term Memory）、防沉迷、违规拦截等工程可行性；',
      '多维度剖析当前商业变现途径的可复制性及主要竞争壁垒（含同类型产品的商业策略研究）；',
      '提出一整套如何运用轻量级自研微调模型降低调用显卡算力开销的切实优化提议；',
      '交付一份逻辑严密、数据支撑充分、条理分明的产品规划与可行性建议报告。'
    ]
  },
  {
    id: 't30',
    title: '数据安全合规方案咨询',
    domain: '咨询与培训',
    difficulty: '专家',
    rewardText: '¥6,000-¥10,000',
    description: '为一家出海AI初创企业，提供一套完整的符合欧盟GDPR、美国CCPA及国内数据跨境法规范的数据安全合规方案。',
    deadlineText: '20 天',
    participantsCount: 2,
    participantsUnit: '人已报名',
    publisher: '某跨国应用服务商',
    publishDate: '2026-08-12',
    skills: ['数据合规', 'GDPR', '法律咨询', '数据出境安全'],
    details: [
      '系统审计该应用在收集、存储、训练大模型时，涉及用户敏感隐私和Cookie授权的处理路径；',
      '建立完善的用户选择和一键无损注销、彻底抹除其模型训练数据的工程设计机制规范；',
      '编写符合国际通用标准且严密无死角的数据传输协议模板、隐私服务条款以及数据合规审查大纲；',
      '交付整套极具实操性与防雷避坑价值的AI数据合规中文咨询总结大报告。'
    ]
  }
];

// Mock participants data for high quality presentation in task details
const MOCK_PARTICIPANTS = [
  { name: '张三 (AI研发专家)', role: '独立开发者 · 提交方案', status: '已提交' },
  { name: '李四 (全栈软件工程师)', role: '某算法工作室 · 提交方案', status: '已提交' },
  { name: '王五 (数据科学硕士)', role: '独立开发者 · 方案验证中', status: '已完成' },
  { name: '赵六 (新媒体运营总监)', role: '某创意营销机构', status: '已报名' },
  { name: '钱七 (NLP算法工程师)', role: '大模型科技实验室', status: '已报名' },
  { name: '极客小千 (你)', role: '认证高级AI架构师', status: '已报名' },
  { name: '阿木木 (嵌入式工程师)', role: '边缘计算探索者', status: '已报名' },
  { name: '灵感捕手 (设计师)', role: '自由职业者', status: '已认领' },
  { name: '数字漫游者 (开发者)', role: '独立全栈开发', status: '已提交' },
  { name: 'AI先驱者', role: '算法联合战队', status: '已报名' },
  { name: '元宇宙原住民', role: '创意内容工坊', status: '已认领' },
  { name: '代码搬运工', role: '系统集成商', status: '已报名' }
];

export const TasksView: React.FC = () => {
  const { 
    publishTaskModalOpen, 
    setPublishTaskModalOpen, 
    showToast 
  } = useApp();

  // Redesigned tasks list state starting with the 30 highly detailed domains-specific tasks
  const [localTasks, setLocalTasks] = useState<any[]>(INITIAL_30_TASKS);
  
  // Search and Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [sortBy, setSortBy] = useState<string>('latest');
  const [visibleCount, setVisibleCount] = useState<number>(6); // '加载更多...' control count

  // Active Selected Task for redone sub-page details view
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  // Redesigned interactive publish task wizard steps
  const [publishStep, setPublishStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: '技术开发',
    difficulty: '进阶',
    rewardType: 'both', // 'cash' | 'points' | 'both'
    cashAmount: '2000',
    pointsAmount: '200',
    deadlineDays: '7',
    publisher: '极客小千 (你)',
    skillsInput: 'PyTorch, Agent, 大模型',
    detailsInput: '1. 分析现有环境并重构\n2. 引入AI智能层\n3. 交付代码与文档'
  });

  // Calculate sum for "合计奖励" preview
  const getSumRewardText = () => {
    const cash = Number(formData.cashAmount) || 0;
    const pts = Number(formData.pointsAmount) || 0;
    if (formData.rewardType === 'cash') {
      return `¥${cash.toLocaleString()}`;
    }
    if (formData.rewardType === 'points') {
      return `${pts.toLocaleString()} 积分`;
    }
    return `¥${cash.toLocaleString()} + ${pts.toLocaleString()} 积分`;
  };

  // Handle viewing task details (seamless, elegant page transition)
  const handleViewDetails = (task: any) => {
    setSelectedTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return back from detail view
  const handleBackToList = () => {
    setSelectedTask(null);
  };

  // Apply to a task
  const handleApplyTask = (task: any) => {
    showToast(`🎉 报名成功！已将您的简历与技术方案匹配度提交给【${task.publisher}】`);
  };

  // Publish flow submit handlers
  const handleNextStep = () => {
    if (publishStep === 1) {
      if (!formData.title.trim() || !formData.description.trim()) {
        showToast('⚠️ 请完整填写任务标题与基本需求描述！');
        return;
      }
    }
    setPublishStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setPublishStep(prev => prev - 1);
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add new task with high compliance
    const newTask = {
      id: `task_${Date.now()}`,
      title: formData.title,
      domain: formData.domain,
      difficulty: formData.difficulty,
      rewardText: getSumRewardText(),
      description: formData.description,
      deadlineText: `${formData.deadlineDays} 天`,
      participantsCount: 1,
      participantsUnit: '人已报名',
      publisher: '极客小千 (你)',
      publishDate: new Date().toISOString().split('T')[0],
      skills: formData.skillsInput.split(',').map(s => s.trim()).filter(Boolean),
      details: formData.detailsInput.split('\n').map(d => d.trim()).filter(Boolean)
    };

    setLocalTasks(prev => [newTask, ...prev]);
    showToast('🚀 恭喜您，新任务发布成功并已上架！平台将扣除托管担保资金。');
    
    // Reset modal and states
    setPublishTaskModalOpen(false);
    setPublishStep(1);
    setFormData({
      title: '',
      description: '',
      domain: '技术开发',
      difficulty: '进阶',
      rewardType: 'both',
      cashAmount: '2000',
      pointsAmount: '200',
      deadlineDays: '7',
      publisher: '极客小千 (你)',
      skillsInput: 'PyTorch, Agent, 大模型',
      detailsInput: '1. 分析现有环境并重构\n2. 引入AI智能层\n3. 交付代码与文档'
    });
  };

  // Search and filter algorithms
  const filteredTasks = localTasks.filter(t => {
    // Domain match
    if (selectedCategory !== '全部' && t.domain !== selectedCategory) return false;
    
    // Search query match (title, description, skills)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchSkills = t.skills.some((sk: string) => sk.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchSkills;
    }
    return true;
  });

  // Sort algorithm
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'latest') {
      return b.id.localeCompare(a.id); // Newer first
    }
    if (sortBy === 'bountyHigh') {
      // Parse numerical value from reward text as rough estimator for sorting
      const valA = parseInt(a.rewardText.replace(/[^0-9]/g, '')) || 0;
      const valB = parseInt(b.rewardText.replace(/[^0-9]/g, '')) || 0;
      return valB - valA;
    }
    if (sortBy === 'deadlineClose') {
      const daysA = parseInt(a.deadlineText) || 999;
      const daysB = parseInt(b.deadlineText) || 999;
      return daysA - daysB; // Closer first
    }
    return 0;
  });

  const categories = ['全部', '技术开发', '内容创作', 'AI模型与数据', '工具与自动化', '咨询与培训'];

  return (
    <div className="w-full min-h-screen text-slate-800" id="task-hall-container">
      
      <AnimatePresence mode="wait">
        {!selectedTask ? (
          // LIST VIEW (Main Screen Layout)
          <motion.div 
            key="list-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6 select-none animate-fade-in pb-12"
          >
            {/* Unified Page Header matching Design Guidelines */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5" id="task-header-row">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-2xs shrink-0">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                    任务大厅
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      撮合交易佣金
                    </span>
                  </h1>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    汇聚AI领域所有任务需求，开发者在这里找到赚钱机会，需求方在这里找到靠谱的人
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setPublishStep(1);
                  setPublishTaskModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-200/40 flex items-center gap-2 shrink-0 cursor-pointer transition"
              >
                <Plus className="w-4 h-4" />
                <span>发布任务</span>
              </button>
            </div>

            {/* Search row with modern layout */}
            <div className="relative" id="task-search-panel">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 搜索任务（输入标题、描述、技能关键词...）"
                className="w-full bg-white border border-slate-200 rounded-2xl py-4.5 pl-12 pr-6 text-sm text-slate-800 font-medium outline-none shadow-2xs focus:border-amber-400 focus:ring-1 focus:ring-amber-200/30 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Category selection and sorting controls row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs" id="task-filter-panel">
              {/* Category tag filters (领域) */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 flex-1">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mr-2 select-none shrink-0">领域：</span>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setVisibleCount(6); // reset pagination when category switches
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer border ${
                      selectedCategory === cat
                        ? 'bg-amber-600 border-amber-600 text-white shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 hover:text-slate-900 text-slate-500 border-transparent'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              {/* Sort by dropdown */}
              <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-2.5 md:pt-0 border-slate-100">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider shrink-0">排序：</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 font-extrabold rounded-xl px-3.5 py-1.5 text-xs outline-none cursor-pointer hover:bg-slate-100 appearance-none pr-8 shadow-3xs"
                  >
                    <option value="latest">最新发布 ▾</option>
                    <option value="bountyHigh">奖励最高 ▾</option>
                    <option value="deadlineClose">时间最急 ▾</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Beautiful Platform Stats Banner */}
            <div className="bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-200/50 rounded-2xl p-4.5 flex flex-wrap items-center justify-around gap-6 text-sm" id="platform-stats-banner">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100/80 border border-amber-200 flex items-center justify-center text-amber-700 font-extrabold shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">今日新增</div>
                  <div className="text-base font-black text-slate-800 font-mono">12 <span className="text-xs font-semibold text-slate-500">个新任务</span></div>
                </div>
              </div>
              <div className="h-7 w-px bg-slate-200 hidden md:block"></div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/80 border border-emerald-200 flex items-center justify-center text-emerald-700 font-extrabold shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">进行中任务</div>
                  <div className="text-base font-black text-slate-800 font-mono">89 <span className="text-xs font-semibold text-slate-500">个任务</span></div>
                </div>
              </div>
              <div className="h-7 w-px bg-slate-200 hidden md:block"></div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100/80 border border-indigo-200 flex items-center justify-center text-indigo-700 font-extrabold shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">已有先锋参与</div>
                  <div className="text-base font-black text-slate-800 font-mono">1,234 <span className="text-xs font-semibold text-slate-500">人参与</span></div>
                </div>
              </div>
            </div>

            {/* Task Cards Grid */}
            {sortedTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-3xl text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-slate-300" />
                <h3 className="text-sm font-bold text-slate-800">未找到符合当前筛选条件的任务</h3>
                <p className="text-xs text-slate-400">请尝试清除部分过滤条件或重新输入关键词进行精准检索</p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-extrabold text-amber-600 hover:underline cursor-pointer"
                  >
                    清除搜索关键词
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="tasks-cards-grid">
                {sortedTasks.slice(0, visibleCount).map((task) => (
                  <div
                    key={task.id}
                    className="bg-white border border-slate-200/80 hover:border-amber-400 rounded-2xl p-6 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full group relative overflow-hidden"
                  >
                    <div className="space-y-4.5">
                      {/* Tags Row */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-100">
                            📌 {task.domain}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${
                            task.difficulty === '专家'
                              ? 'bg-rose-50 text-rose-700 border-rose-100'
                              : task.difficulty === '进阶'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          }`}>
                            {task.difficulty}
                          </span>
                        </div>
                        {task.completedStatusText && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                            {task.completedStatusText}
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-amber-700 transition-colors line-clamp-2">
                          {task.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2 line-clamp-3">
                          {task.description}
                        </p>
                      </div>

                      {/* Skills tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {task.skills.map((sk: string, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-150">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Meta rewards & action row */}
                    <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                      {/* Reward Info */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-black text-amber-600 flex items-center gap-1 font-mono">
                          💰 奖励 {task.rewardText}
                        </span>
                        <span className="text-slate-400 font-extrabold text-[10px]">
                          {task.publisher}
                        </span>
                      </div>

                      {/* Time, Participants & Action Button */}
                      <div className="flex items-center justify-between gap-3 text-[11px] text-slate-500 font-bold">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-slate-500">
                            ⏰ 剩余 {task.deadlineText}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-slate-500">
                            👥 {task.participantsCount}{task.participantsUnit.replace('已报名', '').replace('已认领', '')}人已参与
                          </span>
                        </div>

                        <button
                          onClick={() => handleViewDetails(task)}
                          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-extrabold text-xs transition shadow-2xs hover:shadow-xs shrink-0 cursor-pointer"
                        >
                          查看详情
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls - Load More */}
            {sortedTasks.length > visibleCount && (
              <div className="flex items-center justify-center pt-6" id="pagination-panel">
                <button
                  onClick={() => setVisibleCount(prev => prev + 6)}
                  className="px-6 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-950 font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-3xs"
                >
                  <span>加载更多任务...</span>
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          // DETAILS VIEW (Redesigned Full View replacement with slide-in animation)
          <motion.div
            key="details-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 select-none pb-12 w-full"
            id="task-details-panel"
          >
            {/* Header back button row */}
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <button
                onClick={() => handleBackToList()}
                className="flex items-center gap-1.5 text-slate-600 hover:text-amber-700 text-xs font-bold transition cursor-pointer"
              >
                <ArrowLeft className="w-4.5 h-4.5 text-slate-400" />
                <span>返回任务大厅</span>
              </button>
              
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                  📌 {selectedTask.domain}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${
                  selectedTask.difficulty === '专家'
                    ? 'bg-rose-50 text-rose-700 border-rose-100'
                    : selectedTask.difficulty === '进阶'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                }`}>
                  {selectedTask.difficulty}
                </span>
              </div>
            </div>

            {/* Main details contents layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Requirements & Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                      {selectedTask.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-bold mt-3">
                      <span>发布者：<span className="text-slate-600">{selectedTask.publisher}</span></span>
                      <span>·</span>
                      <span>发布时间：<span className="text-slate-600">{selectedTask.publishDate}</span></span>
                      <span>·</span>
                      <span>剩余时间：<span className="text-amber-600">⏰ {selectedTask.deadlineText}</span></span>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Skills Box */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">所需关键技能</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTask.skills.map((sk: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Requirements Box (📋 任务详情) */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-amber-500" />
                      <span>📋 任务详情</span>
                    </h3>
                    <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-xl space-y-4 text-xs leading-relaxed text-slate-600 font-medium">
                      <p className="font-bold text-slate-800 text-[13px]">{selectedTask.description}</p>
                      
                      <div className="space-y-2.5">
                        <div className="font-extrabold text-slate-700 border-b border-slate-200 pb-1.5">具体任务与交付指标需求：</div>
                        <ul className="list-decimal pl-5 space-y-2.5">
                          {selectedTask.details && selectedTask.details.length > 0 ? (
                            selectedTask.details.map((detail: string, idx: number) => (
                              <li key={idx} className="font-bold text-slate-600">{detail}</li>
                            ))
                          ) : (
                            <>
                              <li className="font-semibold text-slate-600">认真研究项目背景与目标细节，确保开发交付件高质量；</li>
                              <li className="font-semibold text-slate-600">代码需有完善的注释文档与一键容器化部署脚本；</li>
                              <li className="font-semibold text-slate-600">模型性能符合或超出委托方的预设验收标准。</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Participants List Box (👥 参与者) */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-500" />
                    <span>👥 参与者（{selectedTask.participantsCount}人已报名）</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {MOCK_PARTICIPANTS.slice(0, selectedTask.participantsCount).map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-extrabold text-xs">
                            {p.name[0]}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">{p.name}</div>
                            <div className="text-[10px] text-slate-400 font-semibold">{p.role}</div>
                          </div>
                        </div>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                          p.status === '已完成'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                        } border`}>
                          {p.status || '已提交'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Reward, Safe & Actions */}
              <div className="space-y-6">
                {/* Rewards Card */}
                <div className="bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-white border border-amber-200 rounded-2xl p-6 shadow-2xs space-y-5">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">该任务设立的总奖励</div>
                    <div className="text-2xl font-black text-amber-600 mt-1 font-mono">
                      💰 {selectedTask.rewardText}
                    </div>
                  </div>

                  <div className="h-px bg-amber-200/40" />

                  <div className="text-xs font-bold text-slate-500 leading-relaxed space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                      <span>奖励支持多端合并代缴代扣</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                      <span>全资金托管于平台，验收自动结算</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                      <span>首位高水准完成并通过核查者得全款</span>
                    </div>
                  </div>

                  {/* Main Action Button */}
                  <button
                    onClick={() => handleApplyTask(selectedTask)}
                    className="w-full py-4 rounded-xl bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-extrabold text-xs transition shadow-md shadow-amber-200/50 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01]"
                  >
                    <span>报名参与此任务</span>
                  </button>
                </div>

                {/* Safety Note */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 text-xs text-slate-400 leading-relaxed font-bold space-y-2">
                  <div className="text-slate-500 font-extrabold flex items-center gap-1.5 mb-1 text-xs">
                    <ShieldAlert className="w-4.5 h-4.5 text-slate-400" />
                    双方履约担保与交易保障
                  </div>
                  <p>本项目赏金已由发布方全额托管于本平台。完成开发并通过阶段性验收后，系统将在 24 小时内无缝划转款项至承接开发者的账户。双方享受法律合规保障。</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Redesigned 4-Step Wizard Publish Task Modal */}
      {publishTaskModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Title Row */}
            <div className="p-5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4.5 h-4.5 text-amber-500" />
                发布新任务 ({publishStep}/4 步)
              </h3>
              <button 
                onClick={() => setPublishTaskModalOpen(false)} 
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps Progress Header Indicator */}
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-150 flex items-center justify-between text-[11px] font-bold text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${publishStep >= 1 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1</span>
                <span className={publishStep >= 1 ? 'text-slate-800' : ''}>基本信息</span>
              </div>
              <div className="w-10 h-px bg-slate-200"></div>
              <div className="flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${publishStep >= 2 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</span>
                <span className={publishStep >= 2 ? 'text-slate-800' : ''}>设定奖励</span>
              </div>
              <div className="w-10 h-px bg-slate-200"></div>
              <div className="flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${publishStep >= 3 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-500'}`}>3</span>
                <span className={publishStep >= 3 ? 'text-slate-800' : ''}>设定周期</span>
              </div>
              <div className="w-10 h-px bg-slate-200"></div>
              <div className="flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${publishStep >= 4 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-500'}`}>4</span>
                <span className={publishStep >= 4 ? 'text-slate-800' : ''}>确认发布</span>
              </div>
            </div>

            {/* Main Form Box */}
            <form onSubmit={handlePublishSubmit} className="p-6 space-y-4.5 text-xs font-bold text-slate-700">
              
              {/* STEP 1: Basic info fields */}
              {publishStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="text-slate-800 font-extrabold mb-1.5 block">任务标题 *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="例如：金融舆情大模型高阶微调优化任务"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-amber-500 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-800 font-extrabold mb-1.5 block">所属领域</label>
                      <select
                        value={formData.domain}
                        onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white cursor-pointer"
                      >
                        <option value="技术开发">技术开发</option>
                        <option value="内容创作">内容创作</option>
                        <option value="AI模型与数据">AI模型与数据</option>
                        <option value="工具与自动化">工具与自动化</option>
                        <option value="咨询与培训">咨询与培训</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-800 font-extrabold mb-1.5 block">难度要求</label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white cursor-pointer"
                      >
                        <option value="入门">入门</option>
                        <option value="进阶">进阶</option>
                        <option value="专家">专家</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-800 font-extrabold mb-1.5 block">核心开发技能要求 (英文逗号隔开)</label>
                    <input
                      type="text"
                      value={formData.skillsInput}
                      onChange={(e) => setFormData(prev => ({ ...prev, skillsInput: e.target.value }))}
                      placeholder="例如: NLP, PyTorch, Model-Tuning"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-amber-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-slate-800 font-extrabold mb-1.5 block">一句话需求描述 * (限30-50字)</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="简单说明您的核心需求。需要优化现有模型在金融领域的情感分类准确率..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-amber-500 font-medium leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Reward Settings fields */}
              {publishStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-slate-800 font-extrabold block">奖励设置形式</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      <label className={`flex items-center justify-center gap-1.5 p-3.5 rounded-xl border cursor-pointer transition ${formData.rewardType === 'cash' ? 'bg-amber-50 border-amber-500 text-amber-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                        <input
                          type="radio"
                          name="rewardType"
                          value="cash"
                          checked={formData.rewardType === 'cash'}
                          onChange={() => setFormData(prev => ({ ...prev, rewardType: 'cash' }))}
                          className="accent-amber-600"
                        />
                        <span>纯现金</span>
                      </label>
                      
                      <label className={`flex items-center justify-center gap-1.5 p-3.5 rounded-xl border cursor-pointer transition ${formData.rewardType === 'points' ? 'bg-amber-50 border-amber-500 text-amber-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                        <input
                          type="radio"
                          name="rewardType"
                          value="points"
                          checked={formData.rewardType === 'points'}
                          onChange={() => setFormData(prev => ({ ...prev, rewardType: 'points' }))}
                          className="accent-amber-600"
                        />
                        <span>纯积分</span>
                      </label>

                      <label className={`flex items-center justify-center gap-1.5 p-3.5 rounded-xl border cursor-pointer transition ${formData.rewardType === 'both' ? 'bg-amber-50 border-amber-500 text-amber-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                        <input
                          type="radio"
                          name="rewardType"
                          value="both"
                          checked={formData.rewardType === 'both'}
                          onChange={() => setFormData(prev => ({ ...prev, rewardType: 'both' }))}
                          className="accent-amber-600"
                        />
                        <span>现金+积分</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    {/* Cash part */}
                    {(formData.rewardType === 'cash' || formData.rewardType === 'both') && (
                      <div>
                        <label className="text-slate-800 font-extrabold mb-1.5 block">现金赏金部分 (¥元)</label>
                        <input
                          type="number"
                          min="1"
                          value={formData.cashAmount}
                          onChange={(e) => setFormData(prev => ({ ...prev, cashAmount: e.target.value }))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white font-mono"
                        />
                      </div>
                    )}

                    {/* Points part */}
                    {(formData.rewardType === 'points' || formData.rewardType === 'both') && (
                      <div>
                        <label className="text-slate-800 font-extrabold mb-1.5 block">积分奖励部分</label>
                        <input
                          type="number"
                          min="1"
                          value={formData.pointsAmount}
                          onChange={(e) => setFormData(prev => ({ ...prev, pointsAmount: e.target.value }))}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white font-mono"
                        />
                      </div>
                    )}
                  </div>

                  {/* Dynamic calculation banner */}
                  <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-1">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">合计设立的赏金总额</div>
                    <div className="text-base font-black text-amber-600 font-mono">
                      💰 {getSumRewardText()}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Period & detail description lists */}
              {publishStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="text-slate-800 font-extrabold mb-1.5 block">招募周期 & 截止日期 (剩余天数)</label>
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={formData.deadlineDays}
                      onChange={(e) => setFormData(prev => ({ ...prev, deadlineDays: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white font-mono"
                    />
                    <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                      设定任务开始招募到最终提交作品的周期，通常建议设置在 3 到 30 天之间。
                    </span>
                  </div>

                  <div>
                    <label className="text-slate-800 font-extrabold mb-1.5 block">📋 详细说明与验收交付细则 (换行分割项目)</label>
                    <textarea
                      rows={4}
                      value={formData.detailsInput}
                      onChange={(e) => setFormData(prev => ({ ...prev, detailsInput: e.target.value }))}
                      placeholder="1. 性能指标需达到 F1 值 >= 90%&#13;2. 提供全套带有中文备注的源代码&#13;3. 交付一键运行的Docker化打包环境"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-amber-500 font-medium leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Final verification confirm before uploading */}
              {publishStep === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-amber-500/5 border border-amber-200 rounded-2xl p-4.5 space-y-3.5">
                    <div className="text-xs text-slate-500 font-bold border-b border-amber-200/20 pb-2 flex items-center justify-between">
                      <span>任务大厅上架卡片预览：</span>
                      <span className="text-amber-700">📌 {formData.domain}</span>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-sm font-extrabold text-slate-900">{formData.title || '未填写标题'}</h4>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-3">{formData.description || '未填写需求简介描述'}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-amber-200/20 text-slate-600">
                      <span>💰 奖励总计: <span className="text-amber-600 font-black font-mono">{getSumRewardText()}</span></span>
                      <span>⏰ 周期: {formData.deadlineDays} 天</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-slate-400 font-semibold leading-relaxed p-1">
                    <input type="checkbox" required defaultChecked className="mt-0.5 accent-amber-600" id="agree-terms-check" />
                    <label htmlFor="agree-terms-check" className="text-[10px] cursor-pointer">
                      我确认同意《平台开发者委托交易与双向佣金协议》，并授权平台锁定并托管上述赏金。
                    </label>
                  </div>
                </div>
              )}

              {/* Modal Step-Navigation Controls */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-150">
                <div>
                  {publishStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-extrabold text-xs cursor-pointer transition"
                    >
                      上一步
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPublishTaskModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-500 font-extrabold text-xs cursor-pointer hover:bg-slate-200"
                  >
                    取消
                  </button>

                  {publishStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs cursor-pointer shadow-2xs transition"
                    >
                      下一步
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs cursor-pointer shadow-xs transition flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>确认并发布上架</span>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
