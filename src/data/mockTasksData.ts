import { TaskItem } from '../types';

export const mockRichTasks: TaskItem[] = [
  // ================= 任务大厅 & 我接单的任务 示例 =================
  {
    id: 'tsk_101',
    title: '定制基于 Qwen2.5 的法律合同智能审查 Agent',
    taskType: '接单任务',
    brief: '自动识别劳动合同与采购协议隐藏风险，输出格式化审查报告',
    domain: '技术开发',
    difficulty: '困难',
    recommendedResources: {
      agents: ['ag_law_eval_01', 'ag_procurement_guard_02'],
      models: ['mod_qwen_25_coder', 'mod_deepseek_v4_pro'],
      datasets: ['ds_legal_contracts_2026', 'ds_law_knowledge_base'],
      skills: ['sk_pdf_ocr_extractor', 'sk_milvus_vector_retriever'],
      environment: {
        spec: 'NVIDIA A100 / 80GB (双卡)',
        image: 'PyTorch 2.3.1 + CUDA 12.1 + vLLM Sandbox'
      }
    },
    description: `<h3>【项目背景与业务痛点】</h3><p>在大型企业及律所日常商务签署中，海量采购协议、劳动合同与外包服务框架协议存在防范疏漏。传统人工核对耗时且易遗漏关键隐蔽条款。现需基于 <b>Qwen2.5-72B-Instruct</b> 与领域向量知识库，构建一套企业级法律合同智能审查 Agent，自动识别法律隐患并输出带高亮锚点的专业修改建议。</p><h3>【核心功能与系统架构要求】</h3><ul><li><b>多格式文档解析：</b>支持精准解析 PDF (含扫描件 OCR)、Docx、TXT 格式合同，保持原文档段落层次与表格结构；</li><li><b>风险条款分类挖掘：</b>覆盖违约金比例偏高、免责条款不对等、不可抗力范围模糊、知识产权归属陷阱、管辖法院不利等 <b>25+ 类通用与行业专用风险场景</b>；</li><li><b>法条溯源与对比：</b>基于最新《中华人民共和国民法典》及相关司法解释，自动附带法律依据原句及合规修改标准句式；</li><li><b>标准 API 与 Agent 编排：</b>基于 LangChain/LangGraph 框架封装为开箱即用 Agent，暴露标准 RESTful API 接口，并支持流式（SSE）返回审查进展。</li></ul><h3>【交付物与运行环境要求】</h3><p>需提供完整的开箱即用源码仓库、Docker 镜像构建脚本、依赖配置清单及包含 200 份真实脱敏合同的评估测试脚本。</p>`,
    acceptanceCriteria: `<h3>【成果验收与量化考核标准】</h3><ol><li><b>召回与准确率：</b>在平台提供的 200 份标准盲测合同上，核心风险条款召回率（Recall）≥ 92.5%，准确率（Precision）≥ 90.0%；</li><li><b>处理性能：</b>单篇 50 页复杂合同的全量多维度分析响应时间（含 OCR 与 RAG 检索）≤ 15 秒，首 Token 延迟 ≤ 800ms；</li><li><b>系统稳定性：</b>高并发场景（10 个合同并发审查）下无显存溢出（OOM）或 API 崩溃，代码通过 PEP8 标准与安全性检测。</li></ol>`,
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
    taskType: '接单任务',
    brief: '对肺结节、肺炎及胸腔积液进行精准多边形标注与质量复核',
    domain: 'AI模型与数据',
    recommendedResources: {
      datasets: ['ds_medical_chest_xray_2026', 'ds_dicom_segmentation_v2'],
      models: ['mod_qwen_2_vl_72b', 'mod_medical_sam_v2'],
      skills: ['sk_dicom_image_parser', 'sk_coco_polygon_validator'],
      environment: {
        spec: 'NVIDIA RTX 4090 / 24GB',
        image: 'Ubuntu 22.04 LTS + Medical Imaging CUDA Toolkit'
      }
    },
    difficulty: '中等',
    description: `<h3>【任务概述与背景】</h3><p>本任务面向智能医疗影像辅助诊断研究，需对 1,000 例高质量胸部高分辨率 X 光数字影像（包含 DICOM 和 PNG 格式）进行精准的病灶语义分割与多边形（Polygon）边界标注，并与三甲医院放射科主治医师金标准进行对齐。</p><h3>【具体标注规格与细节】</h3><ul><li><b>目标病灶类型：</b>肺结节（直径 ≥ 3mm）、斑片状浸润影（肺炎迹象）、胸腔积液（液体积聚区）、气胸边缘；</li><li><b>标注标注规范：</b>采用标准 COCO Format 格式的多边形（Polygon）掩码顶点标注，每个病灶点顶点不少于 12 个，以保证复杂几何病灶边缘的真实拟合；</li><li><b>元数据属性标注：</b>包括病灶严重程度标记（轻度/中度/重度）、是否伴发骨骼遮挡等上下文属性。</li></ul>`,
    acceptanceCriteria: `<h3>【成果验收与质量指标】</h3><ol><li><b>重合度指标：</b>标注重合度（Mean IoU）与专家盲测金标准相比 ≥ 0.88，边缘交并比≥ 0.85；</li><li><b>零零错漏率：</b>无严重标签混淆（如将积液标为结节）或漏标关键大病灶（>10mm）；</li><li><b>校验通过率：</b>提交的 JSON 格式必须 100% 通过官方 coco-val 脚本校验，且附带清洗校验报告。</li></ol>`,
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
    taskType: '接单任务',
    brief: '输入商品卖点与白底图，一键输出小红书种草文案与排版海报',
    domain: '工具与自动化',
    recommendedResources: {
      agents: ['ag_redbook_copywriter_01'],
      models: ['mod_flux_1_dev', 'mod_qwen_25_coder'],
      skills: ['sk_image_watermark_remover', 'sk_comfyui_client_bridge'],
      environment: {
        spec: '2核CPU / 8GB内存',
        image: 'Dify v0.12.0 Sandbox Environment'
      }
    },
    difficulty: '简单',
    description: `<h3>【项目背景与需求】</h3><p>电商跨平台社媒运营效率低下，需在 <b>Dify 平台或 ComfyUI API</b> 编排一套自动生成小红书爆款营销文案与宣发海报的全流程 Agent 工作流。</p><h3>【核心功能节点】</h3><ul><li><b>输入接口：</b>支持上传商品白底图/实拍图，填写 3 个核心卖点及目标客群（美妆/数码/服饰）；</li><li><b>爆款文案生成节点：</b>自动生成吸引眼球的极简标题（含高热词）、带有丰富 Emoji 视觉排版的正文、以及 5-8 个精准小红书话题标签；</li><li><b>海报生成与排版节点：</b>自动调用绘图模型生成符合品牌风格背景，并将商品无缝融合，加上防伪水印与价格气泡图章。</li></ul>`,
    acceptanceCriteria: `<h3>【验收标准】</h3><ol><li>文案生成质量符合小红书受众阅读偏好， Emoji 排版符合视觉热点规则；</li><li>提供完整的 Dify DSL 工作流导出文件（.yml / .json），导入即可运行，无需依赖第三方未授权私有接口；</li><li>包含 5 组不同品类商品生成实测样例。</li></ol>`,
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
    taskType: '接单任务',
    brief: '针对 LiDAR 与毫米波雷达高频点云优化 PointPillars 实时特征抽取算法',
    domain: 'AI模型与数据',
    difficulty: '困难',
    recommendedResources: {
      datasets: ['ds_kitti_lidar_3d', 'ds_waymo_open_dataset'],
      models: ['mod_pointpillars_opt', 'mod_yolov9_3d'],
      skills: ['sk_cuda_custom_kernel', 'sk_tensorrt_optimizer'],
      environment: {
        spec: 'NVIDIA Orin-X / 32GB (车载环境)',
        image: 'ROS2 Humble + TensorRT 8.6 + CUDA 12.0'
      }
    },
    description: `<h3>【项目背景与技术瓶颈】</h3><p>在复杂城市场景自动驾驶中，车载 LiDAR 激光雷达与毫米波雷达的数据点云密度极高。原有 PointPillars 分割算法在 NVIDIA Drive Orin 芯片上推理帧率仅 18 FPS，且对远距离小目标（行人、非机动车、掉落障碍物）召回偏低。</p><h3>【优化任务与技术路线】</h3><ul><li><b>Cuda 算子级优化：</b>使用 Custom Cuda Kernel 重新实现 Pillar Feature Net，消除 GPU 显存频繁内存搬运；</li><li><b>多传感器时空对齐：</b>实现毫米波雷达速度特征与 LiDAR 空间三维点云在特征层面的 Early Fusion；</li><li><b>模型轻量化量化：</b>对骨干网络进行 INT8 敏感度分析量化，确保精度基本无损的前提下大幅压低延迟。</li></ul>`,
    acceptanceCriteria: `<h3>【验收考核标准】</h3><ol><li>在提供的 10,000 帧路采测试点云序列上，3D 障碍物检测指标 mAP ≥ 82.0%；</li><li>在车载端侧芯片（或仿真 TensorRT 环境）实测推理帧率 ≥ 35 FPS，P99 延迟 ≤ 25ms；</li><li>提交包含自定义 CUDA 算子源码、TensorRT 模型导出脚本及测试验证报告。</li></ol>`,
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
    taskType: '接单任务',
    brief: '基于 Level-2 逐笔委托单数据预测未来 5 秒价格变动趋势',
    domain: '技术开发',
    difficulty: '困难',
    description: `<h3>【需求说明与架构要求】</h3><p>在量化高频交易场景中，基于沪深 300 成分股的高频 Level-2 Orderbook（买卖十档行情与逐笔成交数据）抽取微观结构特征，设计并训练 Transformer-Temporal-CNN 模型预测未来 5 秒中点价格（Mid-Price）变化趋势。</p><h3>【核心考核方向】</h3><ul><li>高维时序特征工程提取：盘口不平衡度（OFI）、加权买卖价差、大单挂单撤单动量；</li><li>模型设计：低延迟浅层神经网络架构，支持在 C++ 回测引擎中通过 ONNX Runtime 毫秒级推理；</li><li>策略回测：包含严格的手续费、印花税及挂单撤单模拟。</li></ul>`,
    acceptanceCriteria: `<h3>【量化考核指标】</h3><ol><li>在 2025 全年盲测数据集上，预测收益率与实际中点价差的 Rank IC ≥ 0.080，IC_IR ≥ 2.0；</li><li>回测策略年化夏普比率（Sharpe Ratio）在扣除双边万分之二手续费后 ≥ 3.20；</li><li>推理耗时单次预测 ≤ 1.5ms。</li></ol>`,
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
    taskType: '接单任务',
    brief: '采用 uni-app + Tailwind 构建简洁高效的移动端 GPU 监控看板',
    domain: '技术开发',
    difficulty: '中等',
    description: `<h3>【需求背景】</h3><p>为了让运维管理员随时随地查看分布式 GPU 机房算力集群状态，需基于 <b>uni-app + TailwindCSS + Vue3 / TypeScript</b> 构建一款移动端智算节点实时监控微信小程序。</p><h3>【核心页面与功能】</h3><ul><li><b>概览仪表盘：</b>动态展现全网算力节点数、当前 GPU 平均利用率、在线实例数与今日消费大盘；</li><li><b>节点详情图表：</b>采用 Recharts / ECharts 渲染 GPU 显存、温度、功耗与 PCIe 带宽历史走势折线图；</li><li><b>告警与消息通知：</b>支持按节点温度（>85°C）或显存爆满动态触发微信模板消息推送。</li></ul>`,
    acceptanceCriteria: `<h3>【成果验收标准】</h3><ol><li>高保真还原设计的 5 个主界面，适配 iOS / Android 各种屏幕尺寸与小程序原生组件规范；</li><li>对接 WebSocket 实时推流接口，在大数据量长连接推流时页面流畅无卡顿；</li><li>交付规范的代码工程压缩包，提供开箱即用构建文档。</li></ol>`,
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
    taskType: '接单任务',
    brief: '优化分类模型在金融新闻特定语料上的误判特征，F1-Score 提升至 93%+',
    domain: 'AI模型与数据',
    difficulty: '中等',
    description: `<h3>【项目背景与需求】</h3><p>在自动化量化新闻交易系统里，需要根据突发金融资讯（如央行利率调整、上市公司财报预告、监管问询函）实时判断市场看多/看空/中性情感。现有基线 Bert 分类模型对专业金融反讽、对比句式识别不准。</p><h3>【优化要点】</h3><ul><li><b>微调数据增强：</b>引入 20,000 条高质量带标签金融新闻短文本；</li><li><b>金融情感词典结合：</b>结合 Loughran-McDonald 金融专属情感词库重构多任务对比学习 Loss；</li><li><b>推理加速：</b>将模型量化导出为 ONNX / TensorRT，提升实时吞吐速度。</li></ul>`,
    acceptanceCriteria: `<h3>【量化考核标准】</h3><ol><li>在提供的 5,000 条突发新闻盲测集中，加权 F1-Score ≥ 93.0%；</li><li>单条文本分类延迟 ≤ 5ms；</li><li>提交模型蒸馏源码及完整评测对比报告。</li></ol>`,
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
    taskType: '接单任务',
    brief: '自动从复杂跨页 PDF 研报中抽取 40+ 财务指标并输出 Wind 规范 JSON',
    domain: '技术开发',
    difficulty: '困难',
    description: `<h3>【核心需求描述】</h3><p>为了替代投研分析师人工录入上市公司年报、季报数据，开发一套基于多模态 Agent 的自动化财报对账与因子抽取系统。</p><h3>【提取因子范畴】</h3><ul><li>营业收入、净利润、归母扣非净利润、EBITDA 动态变动；</li><li>资产负债率、流动比率、商誉减值准备、经营活动现金流净额；</li><li>支持还原复杂跨页多栏表格及附注说明文本，清洗异常单元格。</li></ul>`,
    acceptanceCriteria: `<h3>【成果验收与考核标准】</h3><ol><li>在 100 份包含扫描件与电子版的上市公司财报上，40+ 核心因子提取准确率 ≥ 98.0%；</li><li>格式完全对齐标准 JSON Schema 规范，无错列溢出；</li><li>交付完整的算法架构源码与接口部署文档。</li></ol>`,
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
    taskType: '接单任务',
    brief: '需要编写高频爬虫绕过反爬机制获取联系方式',
    domain: '技术开发',
    difficulty: '简单',
    description: `<h3>【需求说明】</h3><p>需求方欲编写高频爬虫脚本，绕过人脸识别与验证码验证，批量爬取其他商业平台未公开的企业通讯录及私人联系方式。</p>`,
    acceptanceCriteria: `<p>交付包含 10 万条明文手机号与身份证件信息的 Excel 数据库。</p>`,
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
    taskType: '接单任务',
    brief: '包含 Chunk 切分、多路召回重排、GraphRAG 等前沿工程实践',
    domain: '内容创作',
    difficulty: '中等',
    description: `<h3>【专栏写作背景与大纲】</h3><p>邀请资深大模型 RAG 架构师撰写一套包含 3 篇深度文章的专栏（单篇不低于 3,000 字），全面剖析企业知识库落地的技术细节与踩坑实录。</p><h3>【写作必须包含模块】</h3><ul><li><b>文档切分与向量化：</b>递归字符切分（RecursiveCharacterTextSplitter）、语义 Parent Document 切分法；</li><li><b>多路召回与重排序：</b>BM25 关键字 + Dense Vector 混合检索，并使用 BGE-Reranker-Large 重排调优；</li><li><b>GraphRAG 实践：</b>结合 Neo4j 构建知识图谱与实体关系三元组增强推导；</li><li><b>评估指标体系：</b>基于 Ragas 框架计算忠实度（Faithfulness）与相关度（Answer Relevance）。</li></ul>`,
    acceptanceCriteria: `<h3>【验收考核标准】</h3><ol><li>文章必须完全原创，代码片段与架构原理图必须经过本地实践验证；</li><li>文字通俗易懂且专业严谨，包含至少 5 处企业级真实失败案例复盘；</li><li>附带全套示例 Python 源代码包。</li></ol>`,
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
    taskType: '接单任务',
    brief: '输出定制化算力配置方案、国产算力卡适配评估与成本收益测算报告',
    domain: '咨询与培训',
    difficulty: '困难',
    description: `<h3>【咨询服务背景】</h3><p>某大型重工制造企业准备私有化部署 DeepSeek-R1 (671B 完整版与蒸馏版)，需要专家团队为其规划工业园区级智算中心架构与硬件算力采购。</p><h3>【核心交付模块】</h3><ul><li><b>算力拓扑与选型测算：</b>评估 NVIDIA H800/A100 与 国产昇腾 910B/C 在 1,000 并发下的集群节点需求；</li><li><b>网络与存储方案：</b>InfiniBand 400G 互联与 NVMe 高速并行分布式文件系统配置建议；</li><li><b>TCO 成本收益分析：</b>对比云端 API 调用、自建数据中心与租赁算力工坊集群三者的 3 年总成本。</li></ul>`,
    acceptanceCriteria: `<h3>【成果交付标准】</h3><ol><li>交付完整详尽的 PPT 汇报方案与 Word 详细技术白皮书；</li><li>包含 3 种不同预算梯度下的详细配置清单与报价精算表；</li><li>提供 1 场线上/线下 2 小时的高管闭门研讨解答。</li></ol>`,
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
    taskType: '接单任务',
    brief: '输入平铺服装图与模特写真，自动生成无痕换装的高清宣发图',
    domain: '工具与自动化',
    difficulty: '中等',
    description: `<h3>【需求描述与技术路线】</h3><p>搭建一套适用于快时尚电商的高逼真虚拟换装工作流。输入服装平铺图与模特姿态图，自动产出保留面料质感与剪裁特性的商业级宣传照。</p><h3>【核心工作流节点配置】</h3><ul><li>基于 Flux.1 Dev 或 SDXL 挂载 ControlNet (OpenPose / Openpose + Depth)；</li><li>结合 CatVTON 或 Inpainting 节点，精准替换衣物区域且防范边缘发虚；</li><li>高清修复与超分放大（Ultimate SD Upscale）导出 4K 高保真图像。</li></ul>`,
    acceptanceCriteria: `<h3>【验收考核标准】</h3><ol><li>试衣图像细节自然无失真，面料纹理及光影匹配度高；</li><li>提供完整的 ComfyUI API 工作流 JSON 模版，支持单卡批量并发导出；</li><li>提交 10 组不同材质（丝绸/牛仔/针织）换装效果对照图。</li></ol>`,
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
    taskType: '接单任务',
    brief: '识别手写病历与检验单 PDF，结构化提取患者主诉、诊断及用药明细',
    domain: 'AI模型与数据',
    difficulty: '中等',
    description: `<h3>【项目需求与背景】</h3><p>面向医院信息化系统，开发一套采用 <b>Qwen2-VL-7B / 72B</b> 驱动的智能电子病历（EMR）解析插件，精准提取医生模糊手写体与各种规格的化验报告单数据。</p><h3>【核心处理能力】</h3><ul><li>支持扫描图像自动倾斜校正、降噪与对比度增强；</li><li>精准解析包含“主诉、现病史、既往史、初步诊断、医嘱用药”的嵌套 JSON 数据；</li><li>符合国际 HL7 FHIR 医疗数据互操作标准。</li></ul>`,
    acceptanceCriteria: `<h3>【成果验收标准】</h3><ol><li>手写体病历识别字符准确率 ≥ 93.5%，化验单数字表格精确率 ≥ 99.0%；</li><li>提供包含 Python SDK 和 FastAPI 封装接口源码；</li><li>提供包含 Docker 环境一键运行脚本及 50 份解密测试样本。</li></ol>`,
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
    taskType: '接单任务',
    brief: '针对 NVIDIA H100/A100 集群编排实时显存、功耗与 CUDA 占用监控 Dashboard',
    domain: '工具与自动化',
    difficulty: '简单',
    description: `<h3>【任务目标】</h3><p>为算力平台开发一套标准的 Grafana Dashboard 仪表盘与自定义 PromQL 指标解析工具，动态跟踪监控分布式 GPU 集群监控指标。</p><h3>【包含监控面板】</h3><ul><li>GPU 温度热力图、实时功耗与 PCIe 带宽吞吐率；</li><li>NVLink 跨卡传输吞吐与显存利用率（VRAM Used/Total）；</li><li>CUDA Kernel 执行队列堵塞与异常挂死告警阈值联动。</li></ul>`,
    acceptanceCriteria: `<h3>【验收考核标准】</h3><ol><li>提供一键导入的 Grafana Dashboard JSON 配置文件，支持 Grafana 10+；</li><li>包含标准的 Prometheus Alertmanager 预警配置文件；</li><li>测试环境中 8 卡 A100/H100 节点渲染流畅，图表刷新无卡死。</li></ol>`,
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
    title: 'AI Agent 插件市场 CLI 命令行工具 (Python/Go) 开发',
    taskType: '接单任务',
    brief: '支持命令 plugin install/publish/search 的轻量级终端包管理器',
    domain: '技术开发',
    difficulty: '中等',
    description: `<h3>【需求说明与架构设计】</h3><p>为了让极客开发者可以在终端（Terminal）快速管理 Agent 插件，需编写一款支持 Linux / macOS / Windows 跨平台的开源 CLI 工具。</p><h3>【命令行指令要求】</h3><ul><li><code>qianji login</code>：交互式引导输入平台 API Key，加密存储于本地 Keychain / SecretService；</li><li><code>qianji plugin search <keyword></code>：搜索平台公共 Agent 插件并展现星级评级；</li><li><code>qianji plugin install <repo-path></code>：下载解压依赖并校验安全 Hash 签名；</li><li><code>qianji plugin publish</code>：校验 manifest.json 格式、打包上传并触发平台静态审计。</li></ul>`,
    acceptanceCriteria: `<h3>【成果验收标准】</h3><ol><li>提供 Python (Click/Rich) 或 Go (Cobra) 实现源码；</li><li>命令行具备友好的终端彩色渲染与进度条显示；</li><li>通过全量自动化单元测试并提供交叉编译单文件二进制发布包。</li></ol>`,
    cashReward: 5500,
    pointsReward: 500,
    totalCashReward: 5500,
    totalPointsReward: 500,
    startTime: '2026-08-12 00:00:00',
    endTime: '2026-08-30 23:59:59',
    remainingDays: 13,
    publisher: '平台开发者社区',
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
    taskType: '接单任务',
    brief: '包含分布式 Milvus 2.4 集群、Attu 管理面板及云原生持久化存储编排',
    domain: '工具与自动化',
    difficulty: '中等',
    description: `<h3>【项目背景】</h3><p>为了在云原生 K8s 环境上快速一键拉起可横向扩展的高可用 Milvus 向量数据库集群，需编写开箱即用的 Helm Chart 包。</p><h3>【核心组件配置】</h3><ul><li>集成 Milvus 2.4+ 分布式组件（Proxy、QueryNode、DataNode、IndexNode）；</li><li>依赖项存储编排：MinIO 对象存储集群、Etcd 状态存储、Pulsar / Kafka 消息通道；</li><li>预置 Attu 可视化 GUI 管理面板与 Prometheus 告警 Pod 规则。</li></ul>`,
    acceptanceCriteria: `<h3>【验收考核标准】</h3><ol><li><code>helm install</code> 在 ACK / EKS / K3s 环境一键拉起无报错；</li><li>支持动态设置 StorageClass 持久化卷；</li><li>提供包含 1,000 万维 1536 维向量写入压测脚本。</li></ol>`,
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
        status: '已接单'
      }
    ],
    submissions: [],
    bounty: 3500,
    bountyUnit: '¥'
  },

  {
    id: 'tsk_my_pub_finished_bigao',
    title: '微调 Flux.1 智算硬件 3D 渲染工业风 LoRA 绘画模型',
    taskType: '接单任务',
    brief: '专用于渲染服务器、GPU 机架与芯片电路质感的极简科技风 LoRA',
    domain: 'AI模型与数据',
    difficulty: '困难',
    description: `<h3>【任务需求与艺术风格】</h3><p>基于 500 张高质量 3D 渲染工业风 GPU 机房、数据中心机架与高精芯片结构图像，基于 Kohya_ss 微调专属的 Flux.1 Dev / SDXL 绘画模型 LoRA。</p><h3>【核心风格要求】</h3><ul><li>工业级哑光金属拉丝、极简冷色调暗光与 LED 警示灯带光影；</li><li>支持通过 Trigger Word 灵活控制机房角度（俯拍/近景电路细节/全景机架阵列）；</li><li>避免模型产生过拟合死板重复图像。</li></ul>`,
    acceptanceCriteria: `<h3>【验收考核标准】</h3><ol><li>在 ComfyUI 中权重设为 0.7 - 0.8 时，能精准还原物理渲染光影；</li><li>提交打标数据集清单、训练 Log 及 safetensors 权重文件；</li><li>包含 20 张高清测试渲染对比图。</li></ol>`,
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
    taskType: '接单任务',
    brief: '自动扫描 Git 仓库中的 CWE 常见漏洞并提供重构 Patch 代码',
    domain: '技术开发',
    difficulty: '中等',
    description: `<h3>【项目背景与技术选型】</h3><p>为了提升团队 CI/CD 代码安全合规审查效率，开发基于 <b>DeepSeek-R1 CoT 深度推理能力</b> 的静态代码漏洞扫描与自动修复 CLI 工具。</p><h3>【核心检测项】</h3><ul><li>CWE-79 跨站脚本攻击 (XSS)、CWE-89 SQL 注入、CWE-78 命令注入；</li><li>SQL 内存泄漏、未释放锁、并发竞态条件风险检测；</li><li>自动输出符合 <code>git apply</code> 的 Unified Patch 补丁文件与重构对比报告。</li></ul>`,
    acceptanceCriteria: `<h3>【成果验收标准】</h3><ol><li>在 OWASP Benchmark 标准基准测试集中，漏洞识别准确率 ≥ 88.0%，虚报率 ≤ 8.0%；</li><li>支持 Python / C++ / Go / TypeScript 多语言开源项目；</li><li>提供完整的 CLI 源代码与 GitHub Action 自动化集成示例。</li></ol>`,
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
    taskType: '接单任务',
    brief: '编写自动化黑产脚本用于高频注册',
    domain: '工具与自动化',
    difficulty: '简单',
    description: `<h3>【需求说明】</h3><p>用户希望编写自动化攻击与接码脚本，伪造设备指纹以绕过某平台的真人人脸识别与手机短信验证。</p>`,
    acceptanceCriteria: `<p>交付可批量并发注册无感账号的自动化程序脚本。</p>`,
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
