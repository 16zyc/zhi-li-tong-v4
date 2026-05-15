import type { Indicator } from './types'

export const indicatorData: Indicator[] = [
  { id: 'IND-001', name: '重点项目完成率', dimension: '战略执行', formula: '实际完成项目数/计划项目数×100%', dataSource: '项目管理系统', department: '战略部', historicalAvg: '85%', currentTarget: '90%', weight: 30, unit: '%', status: 'normal' },
  { id: 'IND-002', name: '审批平均用时', dimension: '运营效率', formula: '完成日期-受理日期', dataSource: 'OA审批系统', department: '审批部', historicalAvg: '3.5天', currentTarget: '2.5天', weight: 25, unit: '天', status: 'warning' },
  { id: 'IND-003', name: '跨部门协作满意度', dimension: '协同配合', formula: '满意评分/满分×100%', dataSource: '360评估系统', department: '所有部门', historicalAvg: '88%', currentTarget: '92%', weight: 20, unit: '%', status: 'normal' },
  { id: 'IND-004', name: '管理创新成果数', dimension: '创新改善', formula: '成果数量', dataSource: '创新管理系统', department: '各业务部门', historicalAvg: '5项', currentTarget: '8项', weight: 15, unit: '项', status: 'normal' },
  { id: 'IND-005', name: '投资完成率', dimension: '战略执行', formula: '实际投资/计划投资×100%', dataSource: '财务系统', department: '战略部', historicalAvg: '82%', currentTarget: '95%', weight: 30, unit: '%', status: 'danger' },
  { id: 'IND-006', name: '客户投诉处理及时率', dimension: '运营效率', formula: '及时处理数/总投诉数×100%', dataSource: '客服系统', department: '运营部', historicalAvg: '90%', currentTarget: '95%', weight: 20, unit: '%', status: 'normal' },
  { id: 'IND-007', name: '制度文件合规率', dimension: '协同配合', formula: '合规文件数/总文件数×100%', dataSource: '合规管理系统', department: '法务部', historicalAvg: '92%', currentTarget: '98%', weight: 25, unit: '%', status: 'normal' },
  { id: 'IND-008', name: '人才培训完成率', dimension: '创新改善', formula: '已完成培训人次/计划培训人次×100%', dataSource: '培训管理系统', department: '人力资源部', historicalAvg: '78%', currentTarget: '90%', weight: 15, unit: '%', status: 'warning' },
  { id: 'IND-009', name: '安全生产达标率', dimension: '战略执行', formula: '达标项目数/总项目数×100%', dataSource: '安全管理系统', department: '运营部', historicalAvg: '95%', currentTarget: '100%', weight: 30, unit: '%', status: 'normal' },
  { id: 'IND-010', name: '预算执行率', dimension: '运营效率', formula: '实际支出/预算支出×100%', dataSource: '财务系统', department: '财务部', historicalAvg: '88%', currentTarget: '95%', weight: 25, unit: '%', status: 'warning' },
  { id: 'IND-011', name: '项目验收合格率', dimension: '战略执行', formula: '合格项目数/验收项目数×100%', dataSource: '项目管理系统', department: '战略部', historicalAvg: '91%', currentTarget: '96%', weight: 20, unit: '%', status: 'normal' },
  { id: 'IND-012', name: '信息化系统可用率', dimension: '运营效率', formula: '系统正常运行时间/总时间×100%', dataSource: 'IT运维系统', department: '信息中心', historicalAvg: '99.2%', currentTarget: '99.9%', weight: 15, unit: '%', status: 'normal' },
  { id: 'IND-013', name: '员工满意度', dimension: '协同配合', formula: '满意评分/满分×100%', dataSource: '员工调查系统', department: '人力资源部', historicalAvg: '85%', currentTarget: '90%', weight: 20, unit: '%', status: 'warning' },
  { id: 'IND-014', name: '招商引资完成率', dimension: '战略执行', formula: '实际引资额/计划引资额×100%', dataSource: '招商管理系统', department: '战略部', historicalAvg: '75%', currentTarget: '88%', weight: 30, unit: '%', status: 'danger' },
  { id: 'IND-015', name: '文档归档及时率', dimension: '运营效率', formula: '及时归档数/应归档数×100%', dataSource: '档案管理系统', department: '行政部', historicalAvg: '82%', currentTarget: '95%', weight: 10, unit: '%', status: 'warning' },
  { id: 'IND-016', name: '审计问题整改率', dimension: '协同配合', formula: '已整改问题数/总问题数×100%', dataSource: '审计系统', department: '审计部', historicalAvg: '88%', currentTarget: '95%', weight: 25, unit: '%', status: 'normal' },
  { id: 'IND-017', name: '节能降耗完成率', dimension: '创新改善', formula: '实际节能量/目标节能量×100%', dataSource: '能源管理系统', department: '运营部', historicalAvg: '80%', currentTarget: '92%', weight: 15, unit: '%', status: 'warning' },
  { id: 'IND-018', name: '合同履约率', dimension: '运营效率', formula: '履约合同数/总合同数×100%', dataSource: '合同管理系统', department: '法务部', historicalAvg: '94%', currentTarget: '98%', weight: 20, unit: '%', status: 'normal' },
  { id: 'IND-019', name: '党建考核得分', dimension: '协同配合', formula: '考核评分', dataSource: '党建系统', department: '党群部', historicalAvg: '90分', currentTarget: '95分', weight: 15, unit: '分', status: 'normal' },
  { id: 'IND-020', name: '数字化转型进度', dimension: '创新改善', formula: '已完成项目数/计划项目数×100%', dataSource: '信息化项目系统', department: '信息中心', historicalAvg: '60%', currentTarget: '80%', weight: 20, unit: '%', status: 'danger' },
]

export const indicatorDimensions = ['战略执行', '运营效率', '协同配合', '创新改善']
