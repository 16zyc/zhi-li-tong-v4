import type { PerformanceRecord } from './types'

export const performanceData: PerformanceRecord[] = [
  { id: 'PF-001', department: '市京津冀协同办', quarter: '2025年度', score: 92, rank: 1, level: 'A', dimensions: [{ name: '党的建设', score: 96, maxScore: 100 }, { name: '高效履职', score: 42, maxScore: 45 }, { name: '依法行政', score: 9, maxScore: 10 }, { name: '履职测评', score: 14, maxScore: 15 }, { name: '加减分', score: 2, maxScore: 5 }], highlights: ['党建得分96，综合排名第一', '京津冀协同发展重点项目按期推进'], improvements: ['依法行政仍有提升空间'] },
  { id: 'PF-002', department: '高技术处', quarter: '2025年度', score: 90, rank: 2, level: 'A', dimensions: [{ name: '党的建设', score: 93, maxScore: 100 }, { name: '高效履职', score: 41, maxScore: 45 }, { name: '依法行政', score: 9, maxScore: 10 }, { name: '履职测评', score: 13, maxScore: 15 }, { name: '加减分', score: 3, maxScore: 5 }], highlights: ['高技术产业扶持成效显著', '创新平台建设超额完成'], improvements: ['履职测评得分可进一步提升'] },
  { id: 'PF-003', department: '开放处', quarter: '2025年度', score: 88, rank: 3, level: 'B', dimensions: [{ name: '党的建设', score: 90, maxScore: 100 }, { name: '高效履职', score: 39, maxScore: 45 }, { name: '依法行政', score: 8, maxScore: 10 }, { name: '履职测评', score: 13, maxScore: 15 }, { name: '加减分', score: 1, maxScore: 5 }], highlights: ['对外开放政策落地顺利'], improvements: ['高效履职得分需加强'] },
  { id: 'PF-004', department: '营商政策处', quarter: '2025年度', score: 85, rank: 4, level: 'B', dimensions: [{ name: '党的建设', score: 88, maxScore: 100 }, { name: '高效履职', score: 37, maxScore: 45 }, { name: '依法行政', score: 8, maxScore: 10 }, { name: '履职测评', score: 12, maxScore: 15 }, { name: '加减分', score: 0, maxScore: 5 }], highlights: ['营商环境优化措施获好评'], improvements: ['加减分项无加分，建议争取创新加分'] },
  { id: 'PF-005', department: '资环处', quarter: '2025年度', score: 82, rank: 5, level: 'B', dimensions: [{ name: '党的建设', score: 86, maxScore: 100 }, { name: '高效履职', score: 36, maxScore: 45 }, { name: '依法行政', score: 8, maxScore: 10 }, { name: '履职测评', score: 12, maxScore: 15 }, { name: '加减分', score: -1, maxScore: 5 }], highlights: ['双碳工作推进有序'], improvements: ['加减分项被扣分，需关注减分事项'] },
  { id: 'PF-006', department: '投资处', quarter: '2025年度', score: 78, rank: 6, level: 'C', dimensions: [{ name: '党的建设', score: 82, maxScore: 100 }, { name: '高效履职', score: 32, maxScore: 45 }, { name: '依法行政', score: 7, maxScore: 10 }, { name: '履职测评', score: 11, maxScore: 15 }, { name: '加减分', score: 0, maxScore: 5 }], highlights: ['重点项目审批效率提升'], improvements: ['高效履职得分偏低(32/45)，建议加强重点任务推进力度', '党建得分低于90，影响总成绩系数'] },
  { id: 'PF-007', department: '市疏整促专项办', quarter: '2025年度', score: 75, rank: 7, level: 'C', dimensions: [{ name: '党的建设', score: 80, maxScore: 100 }, { name: '高效履职', score: 33, maxScore: 45 }, { name: '依法行政', score: 7, maxScore: 10 }, { name: '履职测评', score: 10, maxScore: 15 }, { name: '加减分', score: -2, maxScore: 5 }], highlights: ['疏解整治任务持续推进'], improvements: ['党建得分低于90，总成绩受系数影响较大', '加减分项扣分较多'] },
  { id: 'PF-008', department: '价格处', quarter: '2025年度', score: 72, rank: 8, level: 'C', dimensions: [{ name: '党的建设', score: 78, maxScore: 100 }, { name: '高效履职', score: 31, maxScore: 45 }, { name: '依法行政', score: 6, maxScore: 10 }, { name: '履职测评', score: 10, maxScore: 15 }, { name: '加减分', score: -1, maxScore: 5 }], highlights: ['价格监测预警机制运行正常'], improvements: ['依法行政扣分较多，建议加强规范性文件合法性审核', '党建得分78，系数拉低总成绩明显'] },
  { id: 'PF-009', department: '办公室', quarter: '2025年度', score: 87, rank: 9, level: 'B', dimensions: [{ name: '党的建设', score: 91, maxScore: 100 }, { name: '高效履职', score: 38, maxScore: 45 }, { name: '依法行政', score: 8, maxScore: 10 }, { name: '履职测评', score: 13, maxScore: 15 }, { name: '加减分', score: 1, maxScore: 5 }], highlights: ['督查督办工作成效显著', '应急值守零事故'], improvements: ['高效履职可进一步提升'] },
  { id: 'PF-010', department: '人事处', quarter: '2025年度', score: 86, rank: 10, level: 'B', dimensions: [{ name: '党的建设', score: 92, maxScore: 100 }, { name: '高效履职', score: 37, maxScore: 45 }, { name: '依法行政', score: 8, maxScore: 10 }, { name: '履职测评', score: 12, maxScore: 15 }, { name: '加减分', score: 1, maxScore: 5 }], highlights: ['干部队伍建设稳步推进'], improvements: ['履职测评得分可提升'] },
  { id: 'PF-011', department: '法规处', quarter: '2025年度', score: 84, rank: 11, level: 'B', dimensions: [{ name: '党的建设', score: 89, maxScore: 100 }, { name: '高效履职', score: 36, maxScore: 45 }, { name: '依法行政', score: 9, maxScore: 10 }, { name: '履职测评', score: 12, maxScore: 15 }, { name: '加减分', score: 0, maxScore: 5 }], highlights: ['依法行政得分较高(9/10)'], improvements: ['建议争取创新加分'] },
  { id: 'PF-012', department: '经济信息中心', quarter: '2025年度', score: 80, rank: 12, level: 'B', dimensions: [{ name: '党的建设', score: 85, maxScore: 100 }, { name: '高效履职', score: 35, maxScore: 45 }, { name: '依法行政', score: 7, maxScore: 10 }, { name: '履职测评', score: 11, maxScore: 15 }, { name: '加减分', score: 0, maxScore: 5 }], highlights: ['信息化建设支撑有力'], improvements: ['党建得分低于90，系数影响总成绩'] },
]

export const departmentRankHistory = [
  { department: '市京津冀协同办', q1: 90, q2: 91, q3: 93, q4: 92 },
  { department: '高技术处', q1: 88, q2: 89, q3: 91, q4: 90 },
  { department: '开放处', q1: 86, q2: 87, q3: 88, q4: 88 },
  { department: '营商政策处', q1: 83, q2: 84, q3: 86, q4: 85 },
  { department: '资环处', q1: 80, q2: 81, q3: 82, q4: 82 },
  { department: '投资处', q1: 76, q2: 77, q3: 78, q4: 78 },
  { department: '办公室', q1: 85, q2: 86, q3: 87, q4: 87 },
  { department: '人事处', q1: 84, q2: 85, q3: 86, q4: 86 },
]
