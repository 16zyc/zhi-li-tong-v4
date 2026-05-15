import type { PerformanceRecord } from './types'

export const performanceData: PerformanceRecord[] = [
  { id: 'PF-001', department: '战略部', quarter: '2025-Q1', score: 92.5, rank: 2, level: 'A', dimensions: [{ name: '战略执行', score: 28, maxScore: 30 }, { name: '运营效率', score: 22, maxScore: 25 }, { name: '协同配合', score: 18, maxScore: 20 }, { name: '创新改善', score: 12, maxScore: 15 }, { name: '满意度', score: 12.5, maxScore: 10 }], highlights: ['战略目标完成率98%', '重点项目按期交付'], improvements: ['跨部门协作满意度82%需提升'] },
  { id: 'PF-002', department: '运营部', quarter: '2025-Q1', score: 88.3, rank: 3, level: 'A', dimensions: [{ name: '战略执行', score: 25, maxScore: 30 }, { name: '运营效率', score: 23, maxScore: 25 }, { name: '协同配合', score: 17, maxScore: 20 }, { name: '创新改善', score: 13, maxScore: 15 }, { name: '满意度', score: 10.3, maxScore: 10 }], highlights: ['安全生产零事故', '客户满意度提升5%'], improvements: ['预算执行率偏低'] },
  { id: 'PF-003', department: '财务部', quarter: '2025-Q1', score: 90.1, rank: 1, level: 'A', dimensions: [{ name: '战略执行', score: 26, maxScore: 30 }, { name: '运营效率', score: 24, maxScore: 25 }, { name: '协同配合', score: 19, maxScore: 20 }, { name: '创新改善', score: 11, maxScore: 15 }, { name: '满意度', score: 10.1, maxScore: 10 }], highlights: ['预算执行率95%', '资金使用效率提升'], improvements: ['审批流程仍需优化'] },
  { id: 'PF-004', department: '人力资源部', quarter: '2025-Q1', score: 85.6, rank: 4, level: 'B', dimensions: [{ name: '战略执行', score: 24, maxScore: 30 }, { name: '运营效率', score: 21, maxScore: 25 }, { name: '协同配合', score: 18, maxScore: 20 }, { name: '创新改善', score: 12, maxScore: 15 }, { name: '满意度', score: 10.6, maxScore: 10 }], highlights: ['培训计划完成率92%'], improvements: ['人才引进目标未完成', '员工满意度需提升'] },
  { id: 'PF-005', department: '审计部', quarter: '2025-Q1', score: 87.2, rank: 5, level: 'B', dimensions: [{ name: '战略执行', score: 25, maxScore: 30 }, { name: '运营效率', score: 22, maxScore: 25 }, { name: '协同配合', score: 17, maxScore: 20 }, { name: '创新改善', score: 13, maxScore: 15 }, { name: '满意度', score: 10.2, maxScore: 10 }], highlights: ['审计问题整改率92%'], improvements: ['审计覆盖率需扩大'] },
  { id: 'PF-006', department: '法务部', quarter: '2025-Q1', score: 86.8, rank: 6, level: 'B', dimensions: [{ name: '战略执行', score: 23, maxScore: 30 }, { name: '运营效率', score: 22, maxScore: 25 }, { name: '协同配合', score: 19, maxScore: 20 }, { name: '创新改善', score: 12, maxScore: 15 }, { name: '满意度', score: 10.8, maxScore: 10 }], highlights: ['合同履约率98%'], improvements: ['法务审核周期偏长'] },
  { id: 'PF-007', department: '行政部', quarter: '2025-Q1', score: 78.5, rank: 8, level: 'C', dimensions: [{ name: '战略执行', score: 20, maxScore: 30 }, { name: '运营效率', score: 19, maxScore: 25 }, { name: '协同配合', score: 16, maxScore: 20 }, { name: '创新改善', score: 10, maxScore: 15 }, { name: '满意度', score: 13.5, maxScore: 10 }], highlights: ['后勤保障满意度提升'], improvements: ['文档归档及时率低', '连续两季度排名下降'] },
  { id: 'PF-008', department: '信息中心', quarter: '2025-Q1', score: 82.3, rank: 7, level: 'B', dimensions: [{ name: '战略执行', score: 22, maxScore: 30 }, { name: '运营效率', score: 20, maxScore: 25 }, { name: '协同配合', score: 17, maxScore: 20 }, { name: '创新改善', score: 13, maxScore: 15 }, { name: '满意度', score: 10.3, maxScore: 10 }], highlights: ['系统可用率99.8%'], improvements: ['数字化转型进度滞后'] },
]

export const departmentRankHistory = [
  { department: '战略部', q1: 92.5, q2: 94.1, q3: 91.8, q4: 95.2 },
  { department: '运营部', q1: 88.3, q2: 86.5, q3: 89.2, q4: 90.1 },
  { department: '财务部', q1: 90.1, q2: 91.3, q3: 93.5, q4: 92.8 },
  { department: '人力资源部', q1: 85.6, q2: 87.2, q3: 86.8, q4: 88.5 },
  { department: '行政部', q1: 82.1, q2: 80.5, q3: 78.5, q4: 79.2 },
  { department: '信息中心', q1: 82.3, q2: 84.1, q3: 85.6, q4: 86.2 },
]
