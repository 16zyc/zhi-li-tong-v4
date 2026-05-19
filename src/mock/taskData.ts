import type { TaskItem, WorkflowStage } from './types'

export const workflowStages: WorkflowStage[] = [
  { key: 'capture', name: '任务捕获', description: '从政府工作报告、上级文件、领导批示等多渠道自动捕获任务来源', aiCapability: '公文智能解析、批示语义识别、政策文件关联', output: '任务清单', agent: '智策', icon: 'Target' },
  { key: 'goal', name: '目标制定', description: '基于捕获的任务，结合处室职责和考评方案，制定可量化、可考核的工作目标', aiCapability: '战略目标解码、职责-目标匹配、SMART校验', output: '目标卡', agent: '智策', icon: 'Flag' },
  { key: 'decompose', name: '任务分解', description: '将年度目标智能拆解为各处室的可执行任务，明确时间节点和量化指标', aiCapability: '职责精准匹配、跨处室协调、时间节点推算', output: '任务分解表', agent: '智管', icon: 'GitBranch' },
  { key: 'indicator', name: '指标生成', description: '基于任务目标和考评方案，自动生成与处室职责匹配的考核指标', aiCapability: '指标-职责关联、权重智能分配、数据源映射', output: '指标体系', agent: '智评', icon: 'BarChart3' },
  { key: 'process', name: '过程跟踪', description: '实时跟踪政策研究、规划编制、项目审批等工作进展', aiCapability: '里程碑识别、材料自动归档、进度智能研判', output: '进度报告', agent: '智办', icon: 'Activity' },
  { key: 'risk', name: '风险预警', description: '监控任务执行异常，对进度滞后、材料缺失等问题提前预警', aiCapability: '进度偏差分析、节点风险预测、自动催办', output: '风险看板', agent: '智巡', icon: 'AlertTriangle' },
  { key: 'verify', name: '查访核验', description: '支持对处室任务完成情况进行线上材料核验和现场查访', aiCapability: '材料完整性校验、数据交叉比对、核验报告生成', output: '核验报告', agent: '智巡', icon: 'Search' },
  { key: 'evaluate', name: '考核评价', description: '基于考评方案和过程数据，自动计算各处室考核得分', aiCapability: '多维度评分、处室画像生成、亮点与短板识别', output: '考核结果', agent: '智评', icon: 'Award' },
  { key: 'feedback', name: '绩效反馈', description: '将考核结果以可视化方式反馈给各处室，支持申诉和改进', aiCapability: '反馈报告生成、改进建议、申诉辅助处理', output: '绩效健康报告', agent: '智评', icon: 'MessageSquare' },
  { key: 'report', name: '报告生成', description: '自动汇总全链路数据，生成绩效分析报告、工作总结等', aiCapability: '多维度数据汇总、智能叙事生成、报告模板适配', output: '绩效分析报告', agent: '智训', icon: 'TrendingUp' },
]

export const taskData: TaskItem[] = [
  { id: 'T-001', name: '编制京津冀协同发展年度工作要点', stage: 'process', source: '市政府工作报告', department: '协同政策处', responsible: '刘主任', deadline: '2025-03-31', progress: 100, status: 'completed', priority: 'high', description: '制定2025年京津冀协同发展工作要点，明确年度重点任务' },
  { id: 'T-002', name: '研究出台"一带一路"高质量发展实施方案', stage: 'process', source: '市政府工作报告第9项', department: '开放处', responsible: '陈处长', deadline: '2025-06-30', progress: 75, status: 'in_progress', priority: 'high', riskLevel: 'yellow', description: '研究制定北京市融入"一带一路"高质量发展实施方案' },
  { id: 'T-003', name: '制定营商环境6.0版改革实施方案', stage: 'decompose', source: '市政府工作报告第25项', department: '营商改革处', responsible: '王处长', deadline: '2025-09-30', progress: 40, status: 'in_progress', priority: 'high', riskLevel: 'red', description: '深化营商环境改革，制定6.0版改革方案' },
  { id: 'T-004', name: '推进碳达峰碳中和政策体系建设', stage: 'process', source: '市政府工作报告第31项', department: '资环处', responsible: '赵处长', deadline: '2025-12-31', progress: 55, status: 'in_progress', priority: 'medium', riskLevel: 'yellow', description: '完善双碳"1+N"政策体系，出台配套文件' },
  { id: 'T-005', name: '编制现代化首都都市圈空间协同规划', stage: 'capture', source: '市政府工作报告第2项', department: '协同政策处', responsible: '刘主任', deadline: '2025-12-31', progress: 0, status: 'pending', priority: 'high', description: '配合自然资源部编制京津冀国土空间规划' },
  { id: 'T-006', name: '推进重点领域节能降碳改造', stage: 'risk', source: '市政府工作报告第31项', department: '资环处', responsible: '赵处长', deadline: '2025-11-30', progress: 30, status: 'in_progress', priority: 'high', riskLevel: 'red', description: '推进工业、建筑等重点领域节能降碳改造，进度严重滞后' },
  { id: 'T-007', name: 'Q2处室绩效考核评分', stage: 'evaluate', source: '考评方案', department: '人事处', responsible: '孙处长', deadline: '2025-07-15', progress: 60, status: 'in_progress', priority: 'medium', description: '完成Q2季度各处室绩效考核评分工作' },
  { id: 'T-008', name: '年度重点任务目标制定', stage: 'goal', source: '考评方案', department: '办公室', responsible: '李主任', deadline: '2025-02-28', progress: 100, status: 'completed', priority: 'high', description: '基于政府工作报告和考评方案，制定年度重点任务目标' },
  { id: 'T-009', name: '价格监测预警体系建设', stage: 'verify', source: '市政府工作报告第42项', department: '价格处', responsible: '周处长', deadline: '2025-08-31', progress: 70, status: 'in_progress', priority: 'medium', description: '完善价格监测预警体系，核验建设成效' },
  { id: 'T-010', name: '2025年度绩效分析报告', stage: 'report', source: '制度规定', department: '人事处', responsible: '孙处长', deadline: '2025-12-31', progress: 20, status: 'in_progress', priority: 'medium', description: '汇总全年绩效数据，生成绩效分析报告' },
  { id: 'T-011', name: '高效履职指标体系生成', stage: 'indicator', source: '考评方案', department: '人事处', responsible: '孙处长', deadline: '2025-03-31', progress: 90, status: 'in_progress', priority: 'high', description: '基于考评方案生成各处室高效履职考核指标' },
  { id: 'T-012', name: 'Q1绩效反馈与改进', stage: 'feedback', source: '制度规定', department: '人事处', responsible: '孙处长', deadline: '2025-05-15', progress: 85, status: 'in_progress', priority: 'medium', description: '将Q1考核结果反馈各处室，提出改进建议' },
  { id: 'T-013', name: '推动中关村先行先试改革落地', stage: 'process', source: '市政府工作报告第15项', department: '高技术处', responsible: '吴处长', deadline: '2025-12-31', progress: 60, status: 'in_progress', priority: 'high', description: '推动中关村24条先行先试改革措施落地' },
  { id: 'T-014', name: '城市更新年度计划制定', stage: 'decompose', source: '市政府工作报告第50项', department: '投资处', responsible: '钱处长', deadline: '2025-06-30', progress: 50, status: 'in_progress', priority: 'medium', riskLevel: 'yellow', description: '制定城市更新年度计划，分解老旧小区改造任务' },
  { id: 'T-015', name: '非首都功能疏解协调保障', stage: 'process', source: '市政府工作报告第13项', department: '协同疏解处', responsible: '郑处长', deadline: '2025-12-31', progress: 45, status: 'in_progress', priority: 'high', riskLevel: 'yellow', description: '协调保障中央标志性项目落地，推进第二批搬迁' },
]
