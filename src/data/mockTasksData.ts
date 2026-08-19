import { TaskItem } from '../types';

export const mockRichTasks: TaskItem[] = [
  // ================= 任务大厅 & 我接单的任务 示例 =================
  {
    id: 'tsk_101',
    title: '定制基于 Qwen2.5 的法律合同智能审查 Agent',
    taskType: '比稿',
    brief: '自动识别劳动合同与采购协议隐藏风险，输出格式化审查报告',
    domain: '技术开发',
    difficulty: '困难',
    description: `<h3>【项目背景】</h3><p>为了提高法务部门对海量商务合同的初审效率，现需构建一套专用的合同风险审查 Agent 与配套 RAG 向量知识库。</p><h3>【核心需求】</h3><ul><li>支持上传 PDF / Docx 格式的合同文档；</li><li>自动检测<b>违约金比例超标</b>、<b>免责条款不平等</b>、<b>管辖法院不利</b>等 20+ 类常见法律风险；</li><li>输出高亮批注及修改建议，提供对应的《民法典》及司法解释法条溯源。</li></ul><h3>【交付环境】</h3><p>需提供可一键部署至千机平台的 Agent 配置文件及标准 Docker 镜像。</p>`,
    acceptanceCriteria: `<h3>【验收考核标准】</h3><ol><li>在提供的 200 份民商事测试合同上，核心风险条款召回率（Recall）≥ 92%，准确率（Precision）≥ 90%；</li><li>单篇 50 页合同全量分析耗时 ≤ 15 秒；</li><li>交付包含源代码、依赖配置清单及完整的本地测试报告。</li></ol>`,
    cashReward: 8000,
    pointsReward: 500,
    totalCashReward: 8000,
    totalPointsReward: 500,
    startTime: '2026-08-01 00:00:00',
    endTime: '2026-08-30 23:59:59',
    remainingDays: 13,
    publisher: '天元律师事务所',
    publisherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-01 10:00:00',
    status: '进行中',
    acceptedCount: 3,
    submittedCount: 2,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_1',
        taskId: 'tsk_101',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-05 14:20:00',
        status: '已提交',
        submissionId: 'sub_101_1'
      },
      {
        id: 'tk_2',
        taskId: 'tsk_101',
        username: '清华AI工程队',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-06 09:10:00',
        status: '已提交',
        submissionId: 'sub_101_2'
      },
      {
        id: 'tk_3',
        taskId: 'tsk_101',
        username: '法务智囊工作室',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-07 16:40:00',
        status: '已接单'
      }
    ],
    submissions: [
      {
        id: 'sub_101_1',
        taskId: 'tsk_101',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-14 18:30:00',
        notes: '已完成 Qwen2.5-72B 微调与 Milvus 知识库搭建，包含完整的前后端 API 与 Dockerfile，经 200 份样本实测召回率 93.8%。',
        files: [
          { id: 'f1', name: 'Legal_Agent_Source_v1.0.zip', size: '42.5 MB' },
          { id: 'f2', name: '测试报告与性能压测记录.pdf', size: '3.8 MB' }
        ],
        status: '待验收'
      },
      {
        id: 'sub_101_2',
        taskId: 'tsk_101',
        username: '清华AI工程队',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-15 11:20:00',
        notes: '基于 LangChain + Qwen2.5 构建了合同风险概率标注引擎，支持高亮 PDF 导出。',
        files: [
          { id: 'f101_2', name: 'Tsinghua_Legal_Agent_Bundle.zip', size: '38.2 MB' }
        ],
        status: '待验收'
      }
    ],
    bounty: 8000,
    bountyUnit: '¥'
  },

  {
    id: 'tsk_102',
    title: '胸部X光影像病灶语义区域多模态识别与标注',
    taskType: '比稿',
    brief: '对肺结节、肺炎及胸腔积液进行精准多边形标注与质量复核',
    domain: 'AI模型与数据',
    difficulty: '中等',
    description: `<h3>【任务概述】</h3><p>需要对 1,000 例胸部高分辨率数字 X 光（DICOM/PNG）影像进行多病灶分割标注与模型对齐。</p><h3>【具体规格】</h3><ul><li>标注目标：肺结节（≥3mm）、斑片状浸润影、胸腔积液；</li><li>格式标准：采用标准 COCO 格式的多边形（Polygon）掩码标注。</li></ul>`,
    acceptanceCriteria: `<p>1. 标注重合度（IoU）与资深放射科主治医师金标准相比 ≥ 0.88；</p><p>2. 无标签混淆或漏标缺陷；</p><p>3. 脚本格式校验 100% 通过。</p>`,
    cashReward: 6500,
    pointsReward: 600,
    totalCashReward: 6500,
    totalPointsReward: 600,
    startTime: '2026-08-10 09:00:00',
    endTime: '2026-08-28 18:00:00',
    remainingDays: 11,
    publisher: '迈瑞数字医疗研究院',
    publisherAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-10 09:00:00',
    status: '进行中',
    acceptedCount: 4,
    submittedCount: 2,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_102_1',
        taskId: 'tsk_102',
        username: '华西医学图像标注组',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-11 10:00:00',
        status: '已提交',
        submissionId: 'sub_102_1'
      },
      {
        id: 'tk_102_2',
        taskId: 'tsk_102',
        username: '协和AI标研社',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-11 11:30:00',
        status: '已提交',
        submissionId: 'sub_102_2'
      }
    ],
    submissions: [
      {
        id: 'sub_102_1',
        taskId: 'tsk_102',
        username: '华西医学图像标注组',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-13 14:00:00',
        notes: '已完成 1000 张影像精标，已过内部双盲审查，IoU 达标 91.2%。',
        files: [{ id: 'f_h1', name: 'chest_xray_coco_labels.json', size: '32.4 MB' }],
        status: '待验收'
      },
      {
        id: 'sub_102_2',
        taskId: 'tsk_102',
        username: '协和AI标研社',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-14 11:20:00',
        notes: '完成全量影像精标注与交叉核验，附带病灶热力图预览。',
        files: [{ id: 'f_h2', name: 'medical_xray_annotations_v2.zip', size: '48.8 MB' }],
        status: '待验收'
      }
    ],
    bounty: 6500,
    bountyUnit: '¥'
  },

  {
    id: 'tsk_103',
    title: '搭建电商小红书爆款文案与多图生成 Dify 工作流',
    taskType: '抢单',
    brief: '输入商品卖点与白底图，一键输出小红书种草文案与排版海报',
    domain: '工具与自动化',
    difficulty: '简单',
    description: `<p>在 Dify / ComfyUI 中编排一个营销物料自动化生成流程，需适配美妆、数码、服饰三种不同品类的语气语调与视觉模版。</p>`,
    acceptanceCriteria: `<p>1. 文案具备清晰的爆款标题、Emoji 分段排版及精准话题标签；</p><p>2. 导出标准的 DSL / JSON 工作流文件，无私有外部依赖。</p>`,
    cashReward: 2500,
    pointsReward: 300,
    totalCashReward: 2500,
    totalPointsReward: 300,
    startTime: '2026-08-12 00:00:00',
    endTime: '2026-08-25 23:59:59',
    remainingDays: 8,
    publisher: '极客优品零售',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-12 11:00:00',
    status: '进行中',
    acceptedCount: 1,
    submittedCount: 0,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_103_1',
        taskId: 'tsk_103',
        username: '提示词架构师-张同学',
        userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-13 09:30:00',
        status: '已接单'
      }
    ],
    submissions: [],
    bounty: 2500,
    bountyUnit: '¥'
  },

  {
    id: 'tsk_my_und_win',
    title: '自动驾驶多传感器融合点云分割与障碍物检测算法优化',
    taskType: '比稿',
    brief: '针对 LiDAR 与毫米波雷达高频点云优化 PointPillars 实时特征抽取算法',
    domain: 'AI模型与数据',
    difficulty: '困难',
    description: `<p>开发针对复杂路况的高频 3D 点云实时障碍物识别模型，提升行人和非机动车的远距离识别精度。</p>`,
    acceptanceCriteria: `<p>在 10,000 帧实测路采点云数据集上达到 3D mAP ≥ 82%，帧率 ≥ 35 FPS。</p>`,
    cashReward: 12000,
    pointsReward: 800,
    totalCashReward: 12000,
    totalPointsReward: 800,
    startTime: '2026-07-15 00:00:00',
    endTime: '2026-08-10 23:59:59',
    remainingDays: 0,
    publisher: '蔚来智能驾驶研究院',
    publisherAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-07-15 10:00:00',
    status: '已结束',
    winner: {
      username: '极客小千 (你)',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      passTime: '2026-08-08 16:30:00',
      notes: '引入轻量化 Cuda 算子重构了 Pillar Feature Net，在 NVIDIA Orin 平台实测达到 42 FPS 与 84.1% mAP。'
    },
    acceptedCount: 3,
    submittedCount: 2,
    verifiedCount: 1,
    takers: [
      {
        id: 'tk_und_win_1',
        taskId: 'tsk_my_und_win',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-18 11:00:00',
        status: '已验收',
        submissionId: 'sub_und_win_1'
      },
      {
        id: 'tk_und_win_2',
        taskId: 'tsk_my_und_win',
        username: '智驾视觉实验室',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-20 09:30:00',
        status: '已提交'
      }
    ],
    submissions: [
      {
        id: 'sub_und_win_1',
        taskId: 'tsk_my_und_win',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-05 14:00:00',
        notes: '引入轻量化 TensorRT 算子重构，已在汽车级芯片实测达标，附带有完整测试报告与编译工程文件。',
        files: [{ id: 'fw1', name: 'NIO_PointCloud_Net_v2.zip', size: '128 MB' }],
        status: '已通过',
        verifiedTime: '2026-08-08 16:30:00'
      }
    ],
    bounty: 12000,
    bountyUnit: '¥'
  },

  {
    id: 'tsk_my_und_fail',
    title: '高频交易订单流深度学习预测模型与策略回测',
    taskType: '比稿',
    brief: '基于 Level-2 逐笔委托单数据预测未来 5 秒价格变动趋势',
    domain: '技术开发',
    difficulty: '困难',
    description: `<p>根据高频 L2 Orderbook 数据抽取微观结构特征，构建 Transformer-LSTM 时间序列预测模型。</p>`,
    acceptanceCriteria: `<p>IC 评估指标 ≥ 0.08，夏普比率（Sharpe Ratio）在回测集上 ≥ 3.2。</p>`,
    cashReward: 16000,
    pointsReward: 1000,
    totalCashReward: 16000,
    totalPointsReward: 1000,
    startTime: '2026-07-20 00:00:00',
    endTime: '2026-08-12 23:59:59',
    remainingDays: 0,
    publisher: '幻方量化投研部',
    publisherAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-07-20 09:00:00',
    status: '已结束',
    winner: {
      username: '北大量化极客队',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      passTime: '2026-08-10 10:00:00',
      notes: '基于时序卷积与自注意力机制重构算法，回测 IC 达 0.092，夏普比率 3.85。'
    },
    acceptedCount: 4,
    submittedCount: 3,
    verifiedCount: 1,
    takers: [
      {
        id: 'tk_und_fail_1',
        taskId: 'tsk_my_und_fail',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-22 14:00:00',
        status: '已提交',
        submissionId: 'sub_und_fail_1'
      },
      {
        id: 'tk_und_fail_2',
        taskId: 'tsk_my_und_fail',
        username: '北大量化极客队',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-21 10:00:00',
        status: '已验收',
        submissionId: 'sub_und_fail_2'
      }
    ],
    submissions: [
      {
        id: 'sub_und_fail_1',
        taskId: 'tsk_my_und_fail',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-08 19:20:00',
        notes: '提交了 LSTM 预测模型代码与回测报告（回测 IC 0.076），全量源码已打包上传。',
        files: [{ id: 'ff1', name: 'Quant_L2_Predictor_v1.zip', size: '56 MB' }],
        status: '已驳回',
        rejectReason: '未被采纳：另一参赛队 IC 指标与夏普比率表现更优，感谢您的递交！'
      }
    ],
    bounty: 16000,
    bountyUnit: '¥'
  },

  // ================= 我发布的任务 示例 =================
  {
    id: 'tsk_my_pub_ing',
    title: '智算节点调度监控与告警微信小程序前端开发',
    taskType: '比稿',
    brief: '采用 uni-app + Tailwind 构建简洁高效的移动端 GPU 监控看板',
    domain: '技术开发',
    difficulty: '中等',
    description: `<h3>【需求描述】</h3><p>开发针对千机算力集群的移动端实时监控看板，展示显卡负载、温度、显存占用与异常通知推送。</p><h3>【核心模块】</h3><ul><li>集群节点概览卡片；</li><li>GPU 实时指标折线图表（Recharts/Echarts）；</li><li>告警日志列表与推送阈值设置。</li></ul>`,
    acceptanceCriteria: `<p>1. 完成 5 个核心页面 UI 高保真还原与 WebSocket 实时接口对接；</p><p>2. 支持微信小程序原生体验与 iOS/Android 适配。</p>`,
    cashReward: 5000,
    pointsReward: 300,
    totalCashReward: 5000,
    totalPointsReward: 300,
    startTime: '2026-08-10 09:00:00',
    endTime: '2026-08-30 23:59:59',
    remainingDays: 13,
    publisher: '极客小千 (你)',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-10 15:00:00',
    status: '进行中',
    acceptedCount: 2,
    submittedCount: 1,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_pub_ing_1',
        taskId: 'tsk_my_pub_ing',
        username: '前端狂魔-小王',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-12 10:00:00',
        status: '已提交',
        submissionId: 'sub_pub_ing_1'
      },
      {
        id: 'tk_pub_ing_2',
        taskId: 'tsk_my_pub_ing',
        username: '小程序开发全栈队',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-13 14:20:00',
        status: '已接单'
      }
    ],
    submissions: [
      {
        id: 'sub_pub_ing_1',
        taskId: 'tsk_my_pub_ing',
        username: '前端狂魔-小王',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-15 17:30:00',
        notes: '完成了全套 uni-app 页面构建与图表动画，组件已拆分完毕，体验流畅。请发布者验收！',
        files: [{ id: 'fpi1', name: 'GPU_Monitor_MiniProgram_v1.zip', size: '18.2 MB' }],
        status: '待验收'
      }
    ],
    bounty: 5000,
    bountyUnit: '¥'
  },

  {
    id: 'tsk_completed_01',
    title: '金融新闻情感分类模型优化与高频特征挖掘',
    taskType: '抢单',
    brief: '优化分类模型在金融新闻特定语料上的误判特征，F1-Score 提升至 93%+',
    domain: 'AI模型与数据',
    difficulty: '中等',
    description: `<p>对现有金融新闻的情感倾向分析模型（积极/消极/中性）进行重训与对齐，解决特定反讽与金融行业术语的识别短板。</p>`,
    acceptanceCriteria: `<p>在提供的 5,000 条金融突发新闻测试集上达到 F1-Score ≥ 90%。</p>`,
    cashReward: 2000,
    pointsReward: 200,
    totalCashReward: 2000,
    totalPointsReward: 200,
    startTime: '2026-08-01 00:00:00',
    endTime: '2026-08-15 23:59:59',
    remainingDays: 0,
    publisher: '极客小千 (你)',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-01 09:30:00',
    status: '已结束',
    winner: {
      username: '量化先锋-张工',
      userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
      passTime: '2026-08-11 11:20:00',
      notes: '已优化 BERT 结构，引入金融专属情感词典与对比学习微调，实测 F1 达到 93.6%。'
    },
    acceptedCount: 1,
    submittedCount: 1,
    verifiedCount: 1,
    takers: [
      {
        id: 'tk_c1',
        taskId: 'tsk_completed_01',
        username: '量化先锋-张工',
        userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-02 10:00:00',
        status: '已验收',
        submissionId: 'sub_c1'
      }
    ],
    submissions: [
      {
        id: 'sub_c1',
        taskId: 'tsk_completed_01',
        username: '量化先锋-张工',
        userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-10 15:00:00',
        notes: '已优化 BERT 结构，引入金融专属情感词典与对比学习微调，实测 F1 达到 93.6%，包含完整权重与部署文档。',
        files: [
          { id: 'fc1', name: 'fin_sentiment_bert_opt.zip', size: '412 MB' },
          { id: 'fc2', name: '评测与消融实验报告.pdf', size: '2.4 MB' }
        ],
        status: '已通过',
        verifiedTime: '2026-08-11 11:20:00'
      }
    ],
    bounty: 2000,
    bountyUnit: '¥'
  },

  {
    id: 'tsk_audit_01',
    title: '上市公司财报多因子量化提取与智能对账系统 Agent',
    taskType: '比稿',
    brief: '自动从复杂跨页 PDF 研报中抽取 40+ 财务指标并输出 Wind 规范 JSON',
    domain: '技术开发',
    difficulty: '困难',
    description: `<p>开发自动从上市公司 PDF 研报和年报中抽取 EBITDA、商誉减值、流动比率等 40+ 关键因子的 Agent，需具备复杂跨页表格结构化还原能力。</p>`,
    acceptanceCriteria: `<p>1. 对包含合并资产负债表的 PDF 识别准确率达到 98% 以上；</p><p>2. 输出格式符合标准 JSON Schema。</p>`,
    cashReward: 15000,
    pointsReward: 500,
    totalCashReward: 15000,
    totalPointsReward: 500,
    startTime: '2026-08-18 00:00:00',
    endTime: '2026-09-18 23:59:59',
    remainingDays: 32,
    publisher: '极客小千 (你)',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-17 08:30:00',
    status: '审核中',
    acceptedCount: 0,
    submittedCount: 0,
    verifiedCount: 0,
    takers: [],
    submissions: [],
    bounty: 15000,
    bountyUnit: '¥'
  },

  {
    id: 'tsk_rejected_01',
    title: '爬取某平台全量未公开商业会员隐私数据',
    taskType: '抢单',
    brief: '需要编写高频爬虫绕过反爬机制获取联系方式',
    domain: '技术开发',
    difficulty: '简单',
    description: `<p>爬取大量用户手机号与企业内部通信录。</p>`,
    acceptanceCriteria: `<p>交付 10 万条手机号 Excel。</p>`,
    cashReward: 3000,
    pointsReward: 0,
    totalCashReward: 3000,
    totalPointsReward: 0,
    startTime: '2026-08-16 00:00:00',
    endTime: '2026-08-26 23:59:59',
    remainingDays: 9,
    publisher: '极客小千 (你)',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-16 10:00:00',
    status: '已驳回',
    rejectReason: '违反平台《安全合规协议》：禁止发布涉及未授权爬取个人隐私或商业敏感数据的任务需求。预付冻结资金已全额退回账户。',
    auditTime: '2026-08-16 10:30:00',
    acceptedCount: 0,
    submittedCount: 0,
    verifiedCount: 0,
    takers: [],
    submissions: [],
    bounty: 3000,
    bountyUnit: '¥'
  },

  // ================= 任务大厅 更多类型示例 =================
  {
    id: 'tsk_104',
    title: '撰写《大模型 RAG 企业级落地方案与避坑指南》深度专栏',
    taskType: '抢单',
    brief: '包含 Chunk 切分、多路召回重排、GraphRAG 等前沿工程实践',
    domain: '内容创作',
    difficulty: '中等',
    description: `<p>撰写一篇 8,000+ 字的深度技术长文或 3 篇系统性专栏文章，要求图文并茂，包含完整可复现的架构图与核心代码片段。</p>`,
    acceptanceCriteria: `<p>1. 必须包含企业级检索增强生成的评估指标（如 Ragas 框架指标）；</p><p>2. 原创内容，严禁纯 AI 拼凑洗稿。</p>`,
    cashReward: 1800,
    pointsReward: 200,
    totalCashReward: 1800,
    totalPointsReward: 200,
    startTime: '2026-08-14 00:00:00',
    endTime: '2026-08-31 23:59:59',
    remainingDays: 14,
    publisher: '智算时代前沿媒体',
    publisherAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-14 14:00:00',
    status: '进行中',
    acceptedCount: 0,
    submittedCount: 0,
    verifiedCount: 0,
    takers: [],
    submissions: [],
    bounty: 1800,
    bountyUnit: '¥'
  },

  {
    id: 'tsk_105',
    title: '为传统制造企业提供 DeepSeek 私有化部署与算力选型咨询',
    taskType: '比稿',
    brief: '输出定制化算力配置方案、国产算力卡适配评估与成本收益测算报告',
    domain: '咨询与培训',
    difficulty: '困难',
    description: `<p>针对某大型装备制造企业，评估 1,000+ 内部并发场景下，部署 DeepSeek-R1 全尺寸及蒸馏版的算力硬件选型、网络拓扑及安全隔离方案。</p>`,
    acceptanceCriteria: `<p>1. 交付完整详尽的 PPT 与 Word 调研报告；</p><p>2. 包含 3 种不同预算梯度下的 TCO 成本对比。</p>`,
    cashReward: 18000,
    pointsReward: 1000,
    totalCashReward: 18000,
    totalPointsReward: 1000,
    startTime: '2026-08-15 00:00:00',
    endTime: '2026-09-15 23:59:59',
    remainingDays: 29,
    publisher: '工业智联数字化转型办',
    publisherAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-15 16:30:00',
    status: '进行中',
    acceptedCount: 3,
    submittedCount: 2,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_105_1',
        taskId: 'tsk_105',
        username: '华为云智算咨询团队',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-16 09:00:00',
        status: '已提交',
        submissionId: 'sub_105_1'
      },
      {
        id: 'tk_105_2',
        taskId: 'tsk_105',
        username: '阿里云混合云架构组',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-16 14:30:00',
        status: '已提交',
        submissionId: 'sub_105_2'
      },
      {
        id: 'tk_105_3',
        taskId: 'tsk_105',
        username: '联想企业级算力实验室',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-17 10:00:00',
        status: '已接单'
      }
    ],
    submissions: [
      {
        id: 'sub_105_1',
        taskId: 'tsk_105',
        username: '华为云智算咨询团队',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-17 18:00:00',
        notes: '交付包含昇腾 910B/C 算力集群部署方案、1,000 并发 TCO 成本对比与 Word 技术白皮书。',
        files: [
          { id: 'f_hw1', name: 'DeepSeek_Private_Deployment_Plan_HuaweiCloud.pdf', size: '14.5 MB' },
          { id: 'f_hw2', name: 'DeepSeek_TCO_Cost_Estimation.xlsx', size: '2.1 MB' }
        ],
        status: '待验收'
      },
      {
        id: 'sub_105_2',
        taskId: 'tsk_105',
        username: '阿里云混合云架构组',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-18 09:30:00',
        notes: '交付阿里云专有云敏捷版 DeepSeek-R1 部署架构图及 8 卡 H800 组网实测报告。',
        files: [
          { id: 'f_ali1', name: 'DeepSeek_Private_Deployment_Aliyun.pdf', size: '18.2 MB' }
        ],
        status: '待验收'
      }
    ],
    bounty: 18000,
    bountyUnit: '¥'
  },

  {
    id: 'tsk_hall_01',
    title: '基于 ComfyUI 的电商服装模特虚拟试衣 Agent 工作流',
    taskType: '比稿',
    brief: '输入平铺服装图与模特写真，自动生成无痕换装的高清宣发图',
    domain: '工具与自动化',
    difficulty: '中等',
    description: `<p>编排一套基于 Flux / SDXL ControlNet + Inpainting 的智能换装工作流，保持服装面料纹理与剪裁不变。</p>`,
    acceptanceCriteria: `<p>1. 服装边缘无发虚失真，皱褶自然；</p><p>2. 提供 4K 批处理能力导出节点说明。</p>`,
    cashReward: 3600,
    pointsReward: 250,
    totalCashReward: 3600,
    totalPointsReward: 250,
    startTime: '2026-08-11 00:00:00',
    endTime: '2026-08-28 23:59:59',
    remainingDays: 11,
    publisher: '时尚芭莎数字部',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-11 11:20:00',
    status: '进行中',
    acceptedCount: 3,
    submittedCount: 2,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_hall_1',
        taskId: 'tsk_hall_01',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-12 14:00:00',
        status: '已提交',
        submissionId: 'sub_hall_1'
      },
      {
        id: 'tk_hall_2',
        taskId: 'tsk_hall_01',
        username: 'AIGC视觉魔法师',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-13 10:20:00',
        status: '已提交',
        submissionId: 'sub_hall_2'
      },
      {
        id: 'tk_hall_3',
        taskId: 'tsk_hall_01',
        username: '时尚科技工作室',
        userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-14 16:00:00',
        status: '已接单'
      }
    ],
    submissions: [
      {
        id: 'sub_hall_1',
        taskId: 'tsk_hall_01',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-16 19:00:00',
        notes: '构建了 Flux.1 + ControlNet 姿态遮罩与面料纹理保持工作流，附带 10 组试衣高保真前后对比图。',
        files: [
          { id: 'fh1', name: 'Flux_Virtual_Fitting_ComfyUI_v2.json', size: '4.8 MB' },
          { id: 'fh2', name: '高清宣发效果对比图集.zip', size: '28.5 MB' }
        ],
        status: '待验收'
      },
      {
        id: 'sub_hall_2',
        taskId: 'tsk_hall_01',
        username: 'AIGC视觉魔法师',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-15 15:30:00',
        submitTime: '2026-08-17 10:00:00',
        notes: '使用 SDXL Inpainting + CatVTON 节点实现服装替换，运行稳定。',
        files: [
          { id: 'fh3', name: 'CatVTON_SDXL_Workflow.json', size: '2.3 MB' }
        ],
        status: '待验收'
      }
    ],
    bounty: 3600,
    bountyUnit: '¥'
  },

  // ================= 扩展：更多我接单的任务示例 =================
  {
    id: 'tsk_my_und_fcfs_ing',
    title: '基于 Qwen2-VL 的医疗电子病历多模态 OCR 结构化提取插件',
    taskType: '抢单',
    brief: '识别手写病历与检验单 PDF，结构化提取患者主诉、诊断及用药明细',
    domain: 'AI模型与数据',
    difficulty: '中等',
    description: `<h3>【项目需求】</h3><p>开发专门用于医疗三甲医院电子病历（EMR）与手写化验单的多模态 OCR 识别与结构化提取组件。</p><h3>【核心功能】</h3><ul><li>支持模糊照片、手写体识别与表格倾斜校正；</li><li>输出符合 HL7 FHIR 标准的 JSON 数据；</li><li>提供 Python CLI 命令行调用脚本与 FastAPI 服务封装。</li></ul>`,
    acceptanceCriteria: `<p>1. 手写体与印刷体混合病历识别字符准确率 ≥ 93%；</p><p>2. 提供 50 份测试样本的运行复现脚本；</p><p>3. 包含完整开箱即用的 Docker 容器与安装说明。</p>`,
    cashReward: 4800,
    pointsReward: 400,
    totalCashReward: 4800,
    totalPointsReward: 400,
    startTime: '2026-08-16 00:00:00',
    endTime: '2026-08-31 23:59:59',
    remainingDays: 14,
    publisher: '华西数字医疗实验室',
    publisherAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-16 10:00:00',
    status: '进行中',
    acceptedCount: 1,
    submittedCount: 0,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_und_fcfs_ing_1',
        taskId: 'tsk_my_und_fcfs_ing',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-16 10:30:00',
        status: '已接单'
      }
    ],
    submissions: [],
    bounty: 4800,
    bountyUnit: '¥'
  },

  {
    id: 'tsk_my_und_fcfs_win',
    title: '智算节点 GPU 动态监控 Grafana 仪表盘与 PromQL 插件',
    taskType: '抢单',
    brief: '针对 NVIDIA H100/A100 集群编排实时显存、功耗与 CUDA 占用监控 Dashboard',
    domain: '工具与自动化',
    difficulty: '简单',
    description: `<h3>【任务目标】</h3><p>编写 Prometheus 导出器 PromQL 规则与 Grafana v10.0+ 的高保真可视化仪表盘 JSON 导入文件。</p>`,
    acceptanceCriteria: `<p>1. 支持多节点、多 GPU 卡的温度、功耗、PCIe 带宽与显存动态告警；</p><p>2. 一键导入 Grafana Dashboard 即可正常渲染，无缺失图表面板。</p>`,
    cashReward: 2800,
    pointsReward: 200,
    totalCashReward: 2800,
    totalPointsReward: 200,
    startTime: '2026-08-01 00:00:00',
    endTime: '2026-08-15 23:59:59',
    remainingDays: 0,
    publisher: '阿里云智算架构部',
    publisherAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-01 11:00:00',
    status: '已结束',
    winner: {
      username: '极客小千 (you)',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      passTime: '2026-08-05 17:00:00',
      notes: '已完成全套 PromQL 规则编写与 8 块 GPU 压测看板导入模版，实测无延迟报警。'
    },
    acceptedCount: 1,
    submittedCount: 1,
    verifiedCount: 1,
    takers: [
      {
        id: 'tk_und_fcfs_win_1',
        taskId: 'tsk_my_und_fcfs_win',
        username: '极客小千',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-01 12:00:00',
        status: '已验收',
        submissionId: 'sub_fcfs_win_1'
      }
    ],
    submissions: [
      {
        id: 'sub_fcfs_win_1',
        taskId: 'tsk_my_und_fcfs_win',
        username: '极客小千',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-05 16:00:00',
        notes: '完成了基于 Prometheus + Grafana 10 的 GPU 显存及 Power 仪表盘编排，附带可一键导入的 grafana_gpu_board.json。',
        files: [{ id: 'f_g1', name: 'grafana_gpu_board.json', size: '1.2 MB' }],
        status: '已通过',
        verifiedTime: '2026-08-05 17:00:00'
      }
    ],
    bounty: 2800,
    bountyUnit: '¥'
  },

  {
    id: 'tsk_my_und_bigao_ing2',
    title: '千机 AI Agent 插件市场 CLI 命令行工具 (Python/Go) 开发',
    taskType: '比稿',
    brief: '支持命令 qianji plugin install/publish/search 的轻量级终端包管理器',
    domain: '技术开发',
    difficulty: '中等',
    description: `<h3>【需求说明】</h3><p>编写适用于 Linux / macOS / Windows 的跨平台 CLI 命令行工具，帮助极客通过命令行快速登录、打包及发布 Agent 插件。</p>`,
    acceptanceCriteria: `<p>1. 支持 qianji login 引导式登录与 API Key 凭证加密存储；</p><p>2. 支持 qianji publish 自动压缩打包与静态校验。</p>`,
    cashReward: 5500,
    pointsReward: 500,
    totalCashReward: 5500,
    totalPointsReward: 500,
    startTime: '2026-08-12 00:00:00',
    endTime: '2026-08-30 23:59:59',
    remainingDays: 13,
    publisher: '千机平台开发者社区',
    publisherAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-12 14:00:00',
    status: '进行中',
    acceptedCount: 3,
    submittedCount: 1,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_und_b2_1',
        taskId: 'tsk_my_und_bigao_ing2',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-14 09:00:00',
        status: '已提交',
        submissionId: 'sub_und_b2_mine'
      },
      {
        id: 'tk_und_b2_2',
        taskId: 'tsk_my_und_bigao_ing2',
        username: 'Go语言开发者联盟',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-13 16:00:00',
        status: '已提交',
        submissionId: 'sub_und_b2_other'
      }
    ],
    submissions: [
      {
        id: 'sub_und_b2_mine',
        taskId: 'tsk_my_und_bigao_ing2',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-17 14:20:00',
        notes: '使用 Python + Click + Rich 构建跨平台命令行工具，已封装支持 API Key 密钥链安全存储与一键 publish 插件打包校验。',
        files: [
          { id: 'fg_mine_1', name: 'qianji_cli_python_v1.0.tar.gz', size: '12.4 MB' },
          { id: 'fg_mine_2', name: 'CLI工具指令使用与自动化测试说明.pdf', size: '2.1 MB' }
        ],
        status: '待验收'
      },
      {
        id: 'sub_und_b2_other',
        taskId: 'tsk_my_und_bigao_ing2',
        username: 'Go语言开发者联盟',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-16 11:00:00',
        notes: '使用 Go + Cobra 框架编写完成，二进制可执行文件小于 8MB。',
        files: [{ id: 'fg_other', name: 'qianji-cli-go.zip', size: '7.8 MB' }],
        status: '待验收'
      }
    ],
    bounty: 5500,
    bountyUnit: '¥'
  },

  // ================= 扩展：更多我发布的任务示例 =================
  {
    id: 'tsk_my_pub_ing_fcfs',
    title: '搭建企业级 Milvus 向量数据库开箱即用 K8s Helm Chart',
    taskType: '抢单',
    brief: '包含分布式 Milvus 2.4 集群、Attu 管理面板及云原生持久化存储编排',
    domain: '工具与自动化',
    difficulty: '中等',
    description: `<h3>【项目背景】</h3><p>为了快速搭建千机 RAG 检索知识库底层基础设施，需要编排一套能在 AWS / 阿里云 ACK 上一键部署的高可用 Milvus Helm 模版。</p>`,
    acceptanceCriteria: `<p>1. 支持动态配置副本数与 MinIO/Etcd 状态持久化存储；</p><p>2. 提供一键脚本测试连通性与 1,000 万维度向量写入稳定性。</p>`,
    cashReward: 3500,
    pointsReward: 300,
    totalCashReward: 3500,
    totalPointsReward: 300,
    startTime: '2026-08-15 00:00:00',
    endTime: '2026-08-28 23:59:59',
    remainingDays: 11,
    publisher: '极客小千',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-15 15:00:00',
    status: '进行中',
    acceptedCount: 1,
    submittedCount: 0,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_pub_fcfs_1',
        taskId: 'tsk_my_pub_ing_fcfs',
        username: 'K8s云原生运维队',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-16 09:20:00',
        status: '已抢单承接'
      }
    ],
    submissions: [],
    bounty: 3500,
    bountyUnit: '¥'
  },

  {
    id: 'tsk_my_pub_finished_bigao',
    title: '微调 Flux.1 智算硬件 3D 渲染工业风 LoRA 绘画模型',
    taskType: '比稿',
    brief: '专用于渲染服务器、GPU 机架与芯片电路质感的极简科技风 LoRA',
    domain: 'AI模型与数据',
    difficulty: '困难',
    description: `<h3>【任务目标】</h3><p>基于 500 张高质量工业级 GPU 服务器与算力机房矢量 3D 渲染图，微调专属的 Flux.1 LoRA 模型。</p>`,
    acceptanceCriteria: `<p>1. 在 ComfyUI 中权重设为 0.8 时，能精准还原金属拉丝与光影变幻质感；</p><p>2. 提交微调数据集清单与训推参数。</p>`,
    cashReward: 9000,
    pointsReward: 600,
    totalCashReward: 9000,
    totalPointsReward: 600,
    startTime: '2026-07-25 00:00:00',
    endTime: '2026-08-10 23:59:59',
    remainingDays: 0,
    publisher: '极客小千',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-07-25 10:00:00',
    status: '已结束',
    winner: {
      username: 'SDLoRA专家组',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      passTime: '2026-08-08 15:00:00',
      notes: '已基于 Kohya_ss 完成 Flux.1 Dev 微调，生成的工业级机房渲染图光影极其细腻自然。'
    },
    acceptedCount: 2,
    submittedCount: 2,
    verifiedCount: 1,
    takers: [
      {
        id: 'tk_pub_b_1',
        taskId: 'tsk_my_pub_finished_bigao',
        username: 'SDLoRA专家组',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-27 11:00:00',
        status: '已验收',
        submissionId: 'sub_pub_b_1'
      },
      {
        id: 'tk_pub_b_2',
        taskId: 'tsk_my_pub_finished_bigao',
        username: '视觉设计魔法师',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-28 14:00:00',
        status: '已提交',
        submissionId: 'sub_pub_b_2'
      }
    ],
    submissions: [
      {
        id: 'sub_pub_b_1',
        taskId: 'tsk_my_pub_finished_bigao',
        username: 'SDLoRA专家组',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-06 18:00:00',
        notes: '交付包含 150MB LoRA 权重文件、工作流 JSON 模版及 20 张高清测试渲染对照图。',
        files: [{ id: 'f_lora1', name: 'Flux_Industrial_GPU_v1.safetensors', size: '154 MB' }],
        status: '已通过',
        verifiedTime: '2026-08-08 15:00:00'
      },
      {
        id: 'sub_pub_b_2',
        taskId: 'tsk_my_pub_finished_bigao',
        username: '视觉设计魔法师',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-07 10:00:00',
        notes: '基于 SDXL 微调的 3D 机架渲染权重，泛化表现尚可。',
        files: [{ id: 'f_lora2', name: 'sdxl_gpu_3d_render.safetensors', size: '120 MB' }],
        status: '已驳回',
        rejectReason: '未被采纳：另一组基于 Flux.1 模型的生成光影细节更符合预期。'
      }
    ],
    bounty: 9000,
    bountyUnit: '¥'
  },

  {
    id: 'tsk_my_pub_audit_2',
    title: '基于 DeepSeek-R1 的智能代码重构与安全漏洞扫描 CLI 工具',
    taskType: '比稿',
    brief: '自动扫描 Git 仓库中的 CWE 常见漏洞并提供重构 Patch 代码',
    domain: '技术开发',
    difficulty: '中等',
    description: `<h3>【需求描述】</h3><p>编写适用于 CI/CD 流程的自动化安全分析插件，结合 DeepSeek-R1 深度思考推理链对静态代码库进行代码审计与自动修复提案生成。</p>`,
    acceptanceCriteria: `<p>1. 支持 Python / C++ / Go / TypeScript 常见代码仓库；</p><p>2. 在 OWASP Benchmark 测试集上准确率 ≥ 88%。</p>`,
    cashReward: 6800,
    pointsReward: 400,
    totalCashReward: 6800,
    totalPointsReward: 400,
    startTime: '2026-08-18 00:00:00',
    endTime: '2026-09-15 23:59:59',
    remainingDays: 29,
    publisher: '极客小千 (你)',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-17 19:00:00',
    status: '审核中',
    acceptedCount: 0,
    submittedCount: 0,
    verifiedCount: 0,
    takers: [],
    submissions: [],
    bounty: 6800,
    bountyUnit: '¥'
  },

  {
    id: 'tsk_my_pub_rejected_2',
    title: '自动批量注册某平台无感账号并绕过人脸识别验证',
    taskType: '抢单',
    brief: '编写自动化黑产脚本用于高频注册',
    domain: '工具与自动化',
    difficulty: '简单',
    description: `<p>需要高频自动化挂机注册程序。</p>`,
    acceptanceCriteria: `<p>交付批量脚本。</p>`,
    cashReward: 15000,
    pointsReward: 0,
    totalCashReward: 15000,
    totalPointsReward: 0,
    startTime: '2026-08-15 00:00:00',
    endTime: '2026-08-25 23:59:59',
    remainingDays: 8,
    publisher: '极客小千',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-15 11:00:00',
    status: '已驳回',
    rejectReason: '违反平台《安全合规与法务审核条款》：禁止发布黑灰产自动化破解或未授权绕过人脸识别相关的违法技术需求。预付全额托管款项已原路返还。',
    acceptedCount: 0,
    submittedCount: 0,
    verifiedCount: 0,
    takers: [],
    submissions: [],
    bounty: 15000,
    bountyUnit: '¥'
  }
];

