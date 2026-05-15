export interface Indicator {
  id: string
  name: string
  dimension: string
  formula: string
  dataSource: string
  department: string
  historicalAvg: string
  currentTarget: string
  weight: number
  unit: string
  status: 'normal' | 'warning' | 'danger'
}

export interface KnowledgeItem {
  id: string
  title: string
  category: '制度文件' | '部门职责' | '业务流程' | '组织架构' | '专业术语'
  department: string
  publishDate: string
  expireDate?: string
  content: string
  tags: string[]
}

export interface PerformanceRecord {
  id: string
  department: string
  quarter: string
  score: number
  rank: number
  level: 'A' | 'B' | 'C' | 'D'
  dimensions: { name: string; score: number; maxScore: number }[]
  highlights: string[]
  improvements: string[]
}

export interface CaseItem {
  id: string
  title: string
  type: '成功案例' | '失败案例' | '最佳实践' | '问题案例' | '创新案例' | '标杆项目'
  department: string
  project: string
  background: string
  approach: string
  result: string
  replicability: string
  date: string
  tags: string[]
}

export interface GraphNode {
  id: string
  name: string
  category: '项目' | '部门' | '人员' | '文件' | '制度' | '指标' | '任务' | '案例'
  symbolSize: number
  value?: number
}

export interface GraphLink {
  source: string
  target: string
  relation: string
}

export interface TaskItem {
  id: string
  name: string
  stage: string
  source: string
  department: string
  responsible: string
  deadline: string
  progress: number
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'
  priority: 'high' | 'medium' | 'low'
  children?: TaskItem[]
  riskLevel?: 'green' | 'yellow' | 'red'
  description: string
}

export interface Department {
  id: string
  name: string
  head: string
  memberCount: number
  score: number
  rank: number
  level: 'A' | 'B' | 'C' | 'D'
  workload: number
  projectCount: number
}

export interface Person {
  id: string
  name: string
  department: string
  role: string
  workload: number
  score: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  actionCards?: ActionCard[]
}

export interface ActionCard {
  type: 'task' | 'indicator' | 'risk' | 'case' | 'knowledge'
  title: string
  description: string
  status?: string
}

export interface WorkflowStage {
  key: string
  name: string
  description: string
  aiCapability: string
  output: string
  agent: string
  icon: string
}
