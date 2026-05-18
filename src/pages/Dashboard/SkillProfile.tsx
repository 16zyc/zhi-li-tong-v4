import { useState, useMemo } from 'react'
import { Card, Row, Col, Tag, Select, Typography, Space, Badge } from 'antd'
import ReactECharts from 'echarts-for-react'
import { Star, Users, Activity, Zap } from 'lucide-react'

const { Title, Text } = Typography

interface SkillDimension {
  name: string
  score: number
  color: string
}

interface SkillProfile {
  id: string
  name: string
  avatar: string
  role: string
  totalScore: number
  dimensions: SkillDimension[]
  tags: string[]
  status: 'active' | 'standby' | 'training'
}

const skillData: SkillProfile[] = [
  {
    id: 'zhice',
    name: '智策',
    avatar: '🧠',
    role: '领导驾驶舱',
    totalScore: 92,
    dimensions: [
      { name: '战略分析', score: 95, color: '#1a365d' },
      { name: '决策支持', score: 90, color: '#2563eb' },
      { name: '风险预警', score: 88, color: '#3b82f6' },
      { name: '数据整合', score: 93, color: '#60a5fa' },
      { name: '报告生成', score: 91, color: '#93c5fd' },
    ],
    tags: ['战略级', '核心技能'],
    status: 'active',
  },
  {
    id: 'zhiguan',
    name: '智管',
    avatar: '📋',
    role: '部门工作台',
    totalScore: 88,
    dimensions: [
      { name: '任务分配', score: 92, color: '#1a365d' },
      { name: '进度跟踪', score: 90, color: '#2563eb' },
      { name: '资源协调', score: 85, color: '#3b82f6' },
      { name: '绩效分析', score: 88, color: '#60a5fa' },
      { name: '沟通协作', score: 86, color: '#93c5fd' },
    ],
    tags: ['管理级', '协调能力'],
    status: 'active',
  },
  {
    id: 'zhiban',
    name: '智办',
    avatar: '✅',
    role: '经办人助手',
    totalScore: 85,
    dimensions: [
      { name: '任务执行', score: 95, color: '#1a365d' },
      { name: '流程处理', score: 90, color: '#2563eb' },
      { name: '文档管理', score: 82, color: '#3b82f6' },
      { name: '时间管理', score: 78, color: '#60a5fa' },
      { name: '协同配合', score: 80, color: '#93c5fd' },
    ],
    tags: ['执行级', '高效处理'],
    status: 'active',
  },
  {
    id: 'zhixun',
    name: '智巡',
    avatar: '🔍',
    role: '审计核验',
    totalScore: 90,
    dimensions: [
      { name: '合规检查', score: 95, color: '#1a365d' },
      { name: '异常检测', score: 92, color: '#2563eb' },
      { name: '数据核验', score: 88, color: '#3b82f6' },
      { name: '风险识别', score: 90, color: '#60a5fa' },
      { name: '报告输出', score: 85, color: '#93c5fd' },
    ],
    tags: ['监督级', '精准识别'],
    status: 'active',
  },
  {
    id: 'zhiping',
    name: '智评',
    avatar: '⭐',
    role: '考核评价',
    totalScore: 87,
    dimensions: [
      { name: '指标计算', score: 92, color: '#1a365d' },
      { name: '公平评估', score: 90, color: '#2563eb' },
      { name: '趋势分析', score: 85, color: '#3b82f6' },
      { name: '结果输出', score: 83, color: '#60a5fa' },
      { name: '标准制定', score: 85, color: '#93c5fd' },
    ],
    tags: ['评价级', '客观公正'],
    status: 'standby',
  },
  {
    id: 'zhixun2',
    name: '智训',
    avatar: '📚',
    role: '知识助手',
    totalScore: 83,
    dimensions: [
      { name: '知识检索', score: 90, color: '#1a365d' },
      { name: '案例匹配', score: 85, color: '#2563eb' },
      { name: '培训推荐', score: 80, color: '#3b82f6' },
      { name: '经验沉淀', score: 78, color: '#60a5fa' },
      { name: '学习路径', score: 82, color: '#93c5fd' },
    ],
    tags: ['知识级', '持续学习'],
    status: 'training',
  },
]

const statusMap: Record<string, { label: string; color: string }> = {
  active: { label: '运行中', color: '#22c55e' },
  standby: { label: '待命', color: '#f59e0b' },
  training: { label: '训练中', color: '#3b82f6' },
}

const synergyCombos = [
  { skills: ['智策', '智管', '智办'], desc: '战略-管理-执行全链路闭环', boost: '+35%' },
  { skills: ['智巡', '智评'], desc: '监督+评价双重保障', boost: '+28%' },
  { skills: ['智策', '智巡'], desc: '战略决策+风险预警联动', boost: '+25%' },
  { skills: ['智管', '智训'], desc: '管理协调+知识赋能', boost: '+22%' },
]

function getRadarOption(skill: SkillProfile) {
  return {
    radar: {
      indicator: skill.dimensions.map(d => ({ name: d.name, max: 100 })),
      shape: 'polygon' as const,
      radius: '65%',
      splitNumber: 4,
      axisName: { color: '#64748b', fontSize: 10 },
      splitArea: { areaStyle: { color: ['rgba(26,54,93,0.02)', 'rgba(26,54,93,0.04)', 'rgba(26,54,93,0.06)', 'rgba(26,54,93,0.08)'] } },
      splitLine: { lineStyle: { color: 'rgba(0,0,0,0.08)' } },
      axisLine: { lineStyle: { color: 'rgba(0,0,0,0.1)' } },
    },
    series: [{
      type: 'radar',
      data: [{
        value: skill.dimensions.map(d => d.score),
        areaStyle: { color: 'rgba(59,130,246,0.15)' },
        lineStyle: { color: '#3b82f6', width: 2 },
        itemStyle: { color: '#3b82f6' },
        symbol: 'circle',
        symbolSize: 5,
      }],
    }],
  }
}

function getBarOption(skill: SkillProfile) {
  return {
    grid: { left: 60, right: 16, top: 4, bottom: 4 },
    xAxis: { type: 'value' as const, max: 100, show: false },
    yAxis: {
      type: 'category' as const,
      data: skill.dimensions.map(d => d.name),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 11, color: '#64748b' },
    },
    series: [{
      type: 'bar',
      data: skill.dimensions.map(d => ({
        value: d.score,
        itemStyle: { color: d.color, borderRadius: [0, 4, 4, 0] },
      })),
      barWidth: 10,
      label: {
        show: true,
        position: 'right' as const,
        fontSize: 11,
        fontWeight: 600,
        color: '#1a365d',
        formatter: '{c}',
      },
    }],
  }
}

type SortKey = 'total' | string
type FilterStatus = 'all' | 'active' | 'standby' | 'training'

export default function SkillProfile() {
  const [sortBy, setSortBy] = useState<SortKey>('total')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')

  const allDimensions = useMemo(() => {
    const set = new Set<string>()
    skillData.forEach(s => s.dimensions.forEach(d => set.add(d.name)))
    return Array.from(set)
  }, [])

  const filtered = useMemo(() => {
    let list = skillData
    if (filterStatus !== 'all') {
      list = list.filter(s => s.status === filterStatus)
    }
    if (sortBy === 'total') {
      list = [...list].sort((a, b) => b.totalScore - a.totalScore)
    } else {
      list = [...list].sort((a, b) => {
        const aDim = a.dimensions.find(d => d.name === sortBy)
        const bDim = b.dimensions.find(d => d.name === sortBy)
        return (bDim?.score ?? 0) - (aDim?.score ?? 0)
      })
    }
    return list
  }, [sortBy, filterStatus])

  const avgScore = Math.round(skillData.reduce((s, d) => s + d.totalScore, 0) / skillData.length)
  const activeCount = skillData.filter(s => s.status === 'active').length

  const statCards = [
    { label: '数字员工总数', value: skillData.length, icon: <Users size={20} color="#1a365d" />, color: '#1a365d' },
    { label: '平均能力分', value: avgScore, icon: <Activity size={20} color="#3b82f6" />, color: '#3b82f6' },
    { label: '活跃数量', value: activeCount, icon: <Zap size={20} color="#22c55e" />, color: '#22c55e' },
    { label: '协同组合数', value: synergyCombos.length, icon: <Star size={20} color="#f59e0b" />, color: '#f59e0b' },
  ]

  return (
    <div style={{ minHeight: 'auto', background: 'transparent', padding: 24, color: '#333' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ color: '#1a365d', margin: 0 }}>
          <Star size={22} style={{ marginRight: 8, verticalAlign: -3, color: '#f59e0b' }} />
          能力画像 · 数字员工评分
        </Title>
        <Text style={{ color: '#666', fontSize: 14, marginTop: 6, display: 'block' }}>
          对AI技能进行多维度能力评估，量化数字员工表现
        </Text>
      </div>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        {statCards.map((item, i) => (
          <Col span={6} key={i}>
            <Card style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 12 }} styles={{ body: { padding: 16 } }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text style={{ color: '#8c8c8c', fontSize: 13 }}>{item.label}</Text>
                  <div style={{ fontSize: 32, fontWeight: 700, color: item.color, marginTop: 4 }}>{item.value}</div>
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <Text style={{ color: '#666', fontSize: 13 }}>排序：</Text>
        <Select
          value={sortBy}
          onChange={setSortBy}
          style={{ width: 160 }}
          size="small"
          options={[
            { value: 'total', label: '按总分排序' },
            ...allDimensions.map(d => ({ value: d, label: `按${d}排序` })),
          ]}
        />
        <Text style={{ color: '#666', fontSize: 13, marginLeft: 16 }}>状态：</Text>
        <Select
          value={filterStatus}
          onChange={setFilterStatus}
          style={{ width: 120 }}
          size="small"
          options={[
            { value: 'all', label: '全部' },
            { value: 'active', label: '运行中' },
            { value: 'standby', label: '待命' },
            { value: 'training', label: '训练中' },
          ]}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.map((skill) => {
          const st = statusMap[skill.status]
          return (
            <Card
              key={skill.id}
              style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 12 }}
              styles={{ body: { padding: 20 } }}
            >
              <Row gutter={24} align="middle">
                <Col span={4}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 48, lineHeight: 1, marginBottom: 8 }}>{skill.avatar}</div>
                    <Title level={5} style={{ margin: 0, color: '#1a365d' }}>{skill.name}</Title>
                    <Text style={{ color: '#8c8c8c', fontSize: 12, display: 'block', marginTop: 2 }}>{skill.role}</Text>
                    <div style={{ marginTop: 8 }}>
                      <Badge color={st.color} text={<Text style={{ color: st.color, fontSize: 12 }}>{st.label}</Text>} />
                    </div>
                    <div style={{ marginTop: 8, display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
                      {skill.tags.map(tag => (
                        <Tag key={tag} style={{ fontSize: 11, margin: 0, borderRadius: 4 }}>{tag}</Tag>
                      ))}
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <ReactECharts option={getRadarOption(skill)} style={{ height: 220 }} />
                </Col>
                <Col span={5} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 56, fontWeight: 700, color: '#1a365d', lineHeight: 1 }}>{skill.totalScore}</div>
                  <Text style={{ color: '#8c8c8c', fontSize: 13 }}>综合能力分</Text>
                  <div style={{ marginTop: 12 }}>
                    <div style={{ width: '100%', height: 6, background: 'rgba(0,0,0,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${skill.totalScore}%`, height: '100%', background: 'linear-gradient(90deg, #1a365d, #3b82f6)', borderRadius: 3 }} />
                    </div>
                  </div>
                </Col>
                <Col span={7}>
                  <ReactECharts option={getBarOption(skill)} style={{ height: 220 }} />
                </Col>
              </Row>
            </Card>
          )
        })}
      </div>

      <Card
        title={<Text style={{ color: '#1a365d', fontWeight: 600 }}>🤝 协同组合推荐</Text>}
        style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 12, marginTop: 24 }}
        styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '16px 20px' } }}
      >
        <Row gutter={16}>
          {synergyCombos.map((combo, i) => (
            <Col span={6} key={i}>
              <div style={{ padding: 16, background: 'rgba(26,54,93,0.03)', borderRadius: 10, border: '1px solid rgba(26,54,93,0.08)' }}>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                  {combo.skills.map(s => (
                    <Tag key={s} color="#1a365d" style={{ margin: 0, fontSize: 11 }}>{s}</Tag>
                  ))}
                </div>
                <Text style={{ color: '#333', fontSize: 13, display: 'block', marginBottom: 6 }}>{combo.desc}</Text>
                <Space>
                  <Text style={{ color: '#22c55e', fontWeight: 700, fontSize: 16 }}>{combo.boost}</Text>
                  <Text style={{ color: '#8c8c8c', fontSize: 12 }}>效能提升</Text>
                </Space>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  )
}
