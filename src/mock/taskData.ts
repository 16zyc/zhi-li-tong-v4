import type { TaskItem, WorkflowStage } from './types'

export const workflowStages: WorkflowStage[] = [
  { key: 'capture', name: '任务捕获', description: '从多种渠道自动捕获任务来源，实现来源全覆盖、无遗漏', aiCapability: '多渠道智能识别、语音转文字、OCR识别', output: '任务卡片', agent: '智策/智管', icon: 'Target' },
  { key: 'goal', name: '目标建立', description: '从多源任务中自动识别、抽取、聚合，形成可执行的工作目标', aiCapability: '战略解码、批示解析、任务聚合', output: '目标卡', agent: '智策', icon: 'Flag' },
  { key: 'decompose', name: '任务分解', description: '将集团级目标智能拆解为各部门、外部单位的可执行子任务', aiCapability: '智能拆解、合理性校验、外部协同', output: '任务分解树', agent: '智管', icon: 'GitBranch' },
  { key: 'indicator', name: '指标生成', description: '基于目标和部门职责，自动生成职责匹配的考核指标体系', aiCapability: '职责数字化、指标-职责匹配、智能推荐', output: '指标体系', agent: '智评', icon: 'BarChart3' },
  { key: 'process', name: '过程管理', description: '实时跟踪工作进展，自动归集证明材料', aiCapability: '进度自动识别、材料自动归档、汇报生成', output: '进度报告', agent: '智管/智办', icon: 'Activity' },
  { key: 'risk', name: '风险预警', description: '实时监控项目异常，提前预警潜在风险', aiCapability: '多维度风险识别、智能阈值预警、预测性提示', output: '风险看板', agent: '智策/智巡', icon: 'AlertTriangle' },
  { key: 'verify', name: '查访核验', description: '支持审计部对项目进行线上/线下核查', aiCapability: '现场核验支持、材料智能比对、报告生成', output: '核验报告', agent: '智巡', icon: 'Search' },
  { key: 'evaluate', name: '考核评价', description: '基于过程数据自动计算考核结果', aiCapability: '自动评分、体检画像生成、亮点识别', output: '考核结果', agent: '智评', icon: 'Award' },
  { key: 'feedback', name: '绩效反馈', description: '将考核结果以可视化方式反馈给被考核对象', aiCapability: '反馈报告生成、AI辅助沟通、申诉处理', output: '绩效健康报告', agent: '智评', icon: 'MessageSquare' },
  { key: 'optimize', name: '效能优化', description: '基于全链路数据，持续优化管理效能', aiCapability: '目标合理性分析、流程瓶颈识别、最佳实践沉淀', output: '优化建议', agent: '智训', icon: 'TrendingUp' },
]

export const taskData: TaskItem[] = [
  { id: 'T-001', name: 'XX产业园项目推进', stage: 'process', source: '集团领导交办', department: '战略部', responsible: '张三', deadline: '2025-12-31', progress: 65, status: 'in_progress', priority: 'high', riskLevel: 'red', description: '推进XX产业园项目，完成用地审批、设计招标、施工准备等工作', children: [
    { id: 'T-001-1', name: '用地预审审批', stage: 'process', source: '项目计划', department: '战略部', responsible: '张三', deadline: '2025-06-30', progress: 100, status: 'completed', priority: 'high', description: '完成用地预审审批手续' },
    { id: 'T-001-2', name: '设计招标', stage: 'process', source: '项目计划', department: '运营部', responsible: '李四', deadline: '2025-08-31', progress: 45, status: 'in_progress', priority: 'high', riskLevel: 'yellow', description: '完成设计单位招标' },
    { id: 'T-001-3', name: '施工准备', stage: 'process', source: '项目计划', department: '运营部', responsible: '李四', deadline: '2025-10-31', progress: 10, status: 'pending', priority: 'medium', description: '完成施工前期准备工作' },
  ]},
  { id: 'T-002', name: '东南亚投资项目', stage: 'process', source: '上级单位文件', department: '战略部', responsible: '张三', deadline: '2025-09-30', progress: 42, status: 'in_progress', priority: 'high', riskLevel: 'yellow', description: '推进东南亚投资项目，完成可研报告和审批流程' },
  { id: 'T-003', name: 'XX数字化项目', stage: 'risk', source: '集团领导批示', department: '信息中心', responsible: '赵六', deadline: '2025-11-30', progress: 85, status: 'in_progress', priority: 'medium', riskLevel: 'yellow', description: '推进XX数字化项目，当前审批环节超期' },
  { id: 'T-004', name: '数据治理项目', stage: 'risk', source: '内部审计报告', department: '信息中心', responsible: '赵六', deadline: '2025-08-15', progress: 70, status: 'in_progress', priority: 'high', riskLevel: 'red', description: '数据治理项目即将超期，需加速推进' },
  { id: 'T-005', name: '客户投诉处理', stage: 'capture', source: '客户投诉', department: '运营部', responsible: '李四', deadline: '2025-06-20', progress: 0, status: 'pending', priority: 'high', description: '处理XX客户关于产品质量的投诉' },
  { id: 'T-006', name: '审计整改落实', stage: 'verify', source: '内部审计报告', department: '审计部', responsible: '王五', deadline: '2025-07-31', progress: 60, status: 'in_progress', priority: 'medium', description: '落实上季度审计发现问题的整改' },
  { id: 'T-007', name: 'Q2绩效考核', stage: 'evaluate', source: '制度规定', department: '人力资源部', responsible: '王五', deadline: '2025-07-15', progress: 30, status: 'in_progress', priority: 'medium', description: '完成Q2季度绩效考核评分工作' },
  { id: 'T-008', name: '招商引资目标', stage: 'goal', source: '集团战略', department: '战略部', responsible: '张三', deadline: '2025-12-31', progress: 35, status: 'in_progress', priority: 'high', riskLevel: 'red', description: '完成年度招商引资10亿元目标' },
  { id: 'T-009', name: '审批流程优化', stage: 'optimize', source: '效能分析', department: '审批部', responsible: '李四', deadline: '2025-09-30', progress: 50, status: 'in_progress', priority: 'low', description: '优化审批流程，将平均用时降至2.5天' },
  { id: 'T-010', name: '制度文件更新', stage: 'feedback', source: '制度到期提醒', department: '法务部', responsible: '王五', deadline: '2025-06-30', progress: 80, status: 'in_progress', priority: 'medium', description: '更新即将到期的3项制度文件' },
]
