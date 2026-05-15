import type { Department, Person } from './types'

export const departmentData: Department[] = [
  { id: 'D-001', name: '战略部', head: '张总监', memberCount: 12, score: 92.5, rank: 2, level: 'A', workload: 85, projectCount: 5 },
  { id: 'D-002', name: '运营部', head: '李总监', memberCount: 15, score: 88.3, rank: 3, level: 'A', workload: 78, projectCount: 4 },
  { id: 'D-003', name: '财务部', head: '王总监', memberCount: 10, score: 90.1, rank: 1, level: 'A', workload: 72, projectCount: 3 },
  { id: 'D-004', name: '人力资源部', head: '赵总监', memberCount: 8, score: 85.6, rank: 4, level: 'B', workload: 68, projectCount: 2 },
  { id: 'D-005', name: '审计部', head: '钱总监', memberCount: 6, score: 87.2, rank: 5, level: 'B', workload: 65, projectCount: 3 },
  { id: 'D-006', name: '法务部', head: '孙总监', memberCount: 7, score: 86.8, rank: 6, level: 'B', workload: 70, projectCount: 2 },
  { id: 'D-007', name: '行政部', head: '周总监', memberCount: 9, score: 78.5, rank: 8, level: 'C', workload: 60, projectCount: 1 },
  { id: 'D-008', name: '信息中心', head: '吴总监', memberCount: 11, score: 82.3, rank: 7, level: 'B', workload: 90, projectCount: 4 },
]

export const personData: Person[] = [
  { id: 'P-001', name: '张三', department: '战略部', role: '项目经理', workload: 80, score: 92 },
  { id: 'P-002', name: '李四', department: '运营部', role: '运营主管', workload: 60, score: 88 },
  { id: 'P-003', name: '王五', department: '财务部', role: '财务专员', workload: 100, score: 90 },
  { id: 'P-004', name: '赵六', department: '信息中心', role: '技术负责人', workload: 95, score: 85 },
  { id: 'P-005', name: '钱七', department: '审计部', role: '审计专员', workload: 55, score: 87 },
  { id: 'P-006', name: '孙八', department: '法务部', role: '法务专员', workload: 70, score: 86 },
  { id: 'P-007', name: '周九', department: '行政部', role: '行政专员', workload: 45, score: 78 },
  { id: 'P-008', name: '吴十', department: '人力资源部', role: 'HR主管', workload: 65, score: 85 },
]
