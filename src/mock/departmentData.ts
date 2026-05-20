import type { Department, Person } from './types'

export const departmentData: Department[] = [
  { id: 'D-001', name: '市京津冀协同办', head: '刘主任', memberCount: 15, score: 92, rank: 1, level: 'A', workload: 85, projectCount: 5 },
  { id: 'D-002', name: '高技术处', head: '吴处长', memberCount: 8, score: 90, rank: 2, level: 'A', workload: 75, projectCount: 3 },
  { id: 'D-003', name: '开放处', head: '陈处长', memberCount: 7, score: 88, rank: 3, level: 'B', workload: 70, projectCount: 2 },
  { id: 'D-004', name: '营商政策处', head: '王处长', memberCount: 9, score: 85, rank: 4, level: 'B', workload: 80, projectCount: 3 },
  { id: 'D-005', name: '资环处', head: '赵处长', memberCount: 8, score: 82, rank: 5, level: 'B', workload: 78, projectCount: 3 },
  { id: 'D-006', name: '投资处', head: '钱处长', memberCount: 10, score: 78, rank: 6, level: 'C', workload: 65, projectCount: 2 },
  { id: 'D-007', name: '市疏整促专项办', head: '郑处长', memberCount: 6, score: 75, rank: 7, level: 'C', workload: 60, projectCount: 2 },
  { id: 'D-008', name: '价格处', head: '周处长', memberCount: 5, score: 72, rank: 8, level: 'C', workload: 55, projectCount: 1 },
  { id: 'D-009', name: '办公室', head: '李主任', memberCount: 20, score: 87, rank: 9, level: 'B', workload: 90, projectCount: 4 },
  { id: 'D-010', name: '人事处', head: '孙处长', memberCount: 8, score: 86, rank: 10, level: 'B', workload: 70, projectCount: 2 },
  { id: 'D-011', name: '法规处', head: '马处长', memberCount: 6, score: 84, rank: 11, level: 'B', workload: 65, projectCount: 2 },
  { id: 'D-012', name: '经济信息中心', head: '林主任', memberCount: 12, score: 80, rank: 12, level: 'B', workload: 72, projectCount: 3 },
]

export const personData: Person[] = [
  { id: 'P-001', name: '刘主任', department: '市京津冀协同办', role: '负责人', workload: 80, score: 92 },
  { id: 'P-002', name: '吴处长', department: '高技术处', role: '处长', workload: 75, score: 90 },
  { id: 'P-003', name: '陈处长', department: '开放处', role: '处长', workload: 70, score: 88 },
  { id: 'P-004', name: '王处长', department: '营商政策处', role: '处长', workload: 80, score: 85 },
  { id: 'P-005', name: '赵处长', department: '资环处', role: '处长', workload: 78, score: 82 },
  { id: 'P-006', name: '钱处长', department: '投资处', role: '处长', workload: 65, score: 78 },
  { id: 'P-007', name: '郑处长', department: '市疏整促专项办', role: '处长', workload: 60, score: 75 },
  { id: 'P-008', name: '周处长', department: '价格处', role: '处长', workload: 55, score: 72 },
]
