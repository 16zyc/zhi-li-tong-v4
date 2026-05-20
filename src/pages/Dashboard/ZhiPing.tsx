import { useState } from 'react'
import { Card, Table, Tag, Progress, Row, Col, Typography, Space, Badge, Button, message } from 'antd'
import ReactECharts from 'echarts-for-react'
import { Award, Star, TrendingUp, AlertTriangle, CheckCircle, BarChart3, UserCheck } from 'lucide-react'
import { performanceData, departmentRankHistory } from '@/mock/performanceData'
import { departmentData } from '@/mock/departmentData'

const { Title, Text } = Typography

const glassCard: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #f0f0f0',
  borderRadius: 12,
}

const levelColorMap: Record<string, string> = { A: '#22c55e', B: '#3b82f6', C: '#f59e0b', D: '#ef4444' }
const levelTagColor: Record<string, string> = { A: 'success', B: 'processing', C: 'warning', D: 'error' }

const deptCategoryMap: Record<string, { label: string; color: string }> = {
  '市京津冀协同办': { label: '业务管理类', color: 'blue' },
  '高技术处': { label: '业务管理类', color: 'blue' },
  '开放处': { label: '业务管理类', color: 'blue' },
  '营商政策处': { label: '业务管理类', color: 'blue' },
  '资环处': { label: '业务管理类', color: 'blue' },
  '投资处': { label: '业务管理类', color: 'blue' },
  '市疏整促专项办': { label: '业务管理类', color: 'blue' },
  '价格处': { label: '业务管理类', color: 'blue' },
}

const statusMap: Record<string, { color: string; label: string }> = {
  completed: { color: 'success', label: '已评分' },
  in_progress: { color: 'processing', label: '评分中' },
  pending: { color: 'default', label: '待评分' },
}

const deptStatusList = performanceData.map((p, i) => ({
  ...p,
  status: i < 5 ? 'completed' : i < 6 ? 'in_progress' : 'pending',
}))

const highlights = [
  { dept: '市京津冀协同办', text: '党建得分96，高效履职42分，综合排名第一', icon: <TrendingUp size={14} color="#22c55e" /> },
  { dept: '高技术处', text: '创新平台建设超额完成，加减分项获3分加分', icon: <Star size={14} color="#f59e0b" /> },
  { dept: '开放处', text: '对外开放政策落地顺利，依法行政满分9分', icon: <CheckCircle size={14} color="#3b82f6" /> },
  { dept: '营商政策处', text: '营商环境优化措施获好评，高效履职37分', icon: <BarChart3 size={14} color="#8b5cf6" /> },
]

const risks = [
  { dept: '投资处', text: '高效履职得分偏低(32/45)，建议加强重点任务推进力度', level: 'high' },
  { dept: '价格处', text: '依法行政扣分较多，建议加强规范性文件合法性审核', level: 'high' },
  { dept: '市疏整促专项办', text: '党建得分低于90(80分)，总成绩受系数影响较大', level: 'medium' },
  { dept: '资环处', text: '加减分项被扣1分，需关注减分事项整改', level: 'low' },
]

const excellenceCandidates = [
  { name: '市京津冀协同办', dept: '业务管理类', score: 92, reason: '党建得分96，高效履职42分，综合排名第一' },
  { name: '高技术处', dept: '业务管理类', score: 90, reason: '创新平台建设超额完成，加减分项获3分加分' },
  { name: '开放处', dept: '业务管理类', score: 88, reason: '对外开放政策落地顺利，依法行政得分8/10' },
]

export default function ZhiPing() {
  const [selectedDept, setSelectedDept] = useState(performanceData[0])

  const radarOption = {
    tooltip: {},
    radar: {
      indicator: selectedDept.dimensions.map(d => ({ name: d.name, max: d.maxScore })),
      shape: 'polygon' as const,
      splitNumber: 4,
      axisName: { color: '#8c8c8c', fontSize: 12 },
      splitLine: { lineStyle: { color: 'rgba(0,0,0,0.06)' } },
      splitArea: { areaStyle: { color: ['rgba(59,130,246,0.02)', 'rgba(59,130,246,0.04)'] } },
      axisLine: { lineStyle: { color: 'rgba(0,0,0,0.08)' } },
    },
    series: [{
      type: 'radar',
      data: [{
        value: selectedDept.dimensions.map(d => d.score),
        name: selectedDept.department,
        areaStyle: { color: 'rgba(59,130,246,0.2)' },
        lineStyle: { color: '#3b82f6', width: 2 },
        itemStyle: { color: '#3b82f6' },
      }],
    }],
  }

  const columns = [
    {
      title: '处室',
      dataIndex: 'department',
      key: 'department',
      render: (t: string, r: typeof deptStatusList[0]) => {
        const cat = deptCategoryMap[t]
        return (
          <Space size={4}>
            <Button type="text" size="small" style={{ color: '#1a365d', fontWeight: 600, padding: 0 }} onClick={() => setSelectedDept(r)}>{t}</Button>
            {cat && <Tag color={cat.color} style={{ fontSize: 10, lineHeight: '16px', padding: '0 4px', margin: 0 }}>{cat.label}</Tag>}
          </Space>
        )
      },
    },
    {
      title: '总分',
      dataIndex: 'score',
      key: 'score',
      sorter: (a: typeof deptStatusList[0], b: typeof deptStatusList[0]) => a.score - b.score,
      render: (t: number) => <Text style={{ color: '#1a365d', fontWeight: 700, fontSize: 16 }}>{t}</Text>,
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      render: (t: string) => <Tag color={levelTagColor[t]} style={{ fontWeight: 600 }}>{t}级</Tag>,
    },
    {
      title: '维度评分',
      key: 'dimensions',
      width: 280,
      render: (_: unknown, r: typeof deptStatusList[0]) => (
        <Space direction="vertical" size={2} style={{ width: '100%' }}>
          {r.dimensions.map(d => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Text style={{ color: '#8c8c8c', fontSize: 11, width: 48, flexShrink: 0 }}>{d.name}</Text>
              <Progress
                percent={Math.round((d.score / d.maxScore) * 100)}
                strokeColor={d.score / d.maxScore >= 0.9 ? '#22c55e' : d.score / d.maxScore >= 0.8 ? '#3b82f6' : '#f59e0b'}
                trailColor="#f0f0f0"
                size="small"
                style={{ flex: 1 }}
              />
            </div>
          ))}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (t: string) => {
        const s = statusMap[t]
        return <Tag color={s.color}>{s.label}</Tag>
      },
    },
  ]

  const avgScore = (performanceData.reduce((s, d) => s + d.score, 0) / performanceData.length).toFixed(1)
  const aLevelCount = performanceData.filter(d => d.level === 'A').length

  return (
    <div style={{ minHeight: 'auto', background: 'transparent', padding: 24, color: '#333' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ color: '#1a365d', margin: 0 }}>
            <Award size={22} style={{ marginRight: 8, verticalAlign: -3, color: '#3b82f6' }} />
            智评助手 · 综合考评工作台
          </Title>
          <Text style={{ color: '#666', fontSize: 14, marginTop: 6, display: 'block' }}>
            2025年度综合考评进行中，48个处室单位参评，已完成
            <Text style={{ color: '#3b82f6', fontWeight: 600 }}>29/48</Text>处室评分
          </Text>
        </div>
        <Space>
          <Badge count={3}><Button type="text" style={{ color: '#8c8c8c' }} icon={<AlertTriangle size={18} />} /></Badge>
          <Badge count={5}><Button type="text" style={{ color: '#8c8c8c' }} icon={<CheckCircle size={18} />} /></Badge>
        </Space>
      </div>

      <div style={{ background: '#f0f4f8', padding: 12, borderRadius: 8, marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: '#1a365d', fontWeight: 600 }}>📊 数据来源</span>
        <span style={{ fontSize: 12, color: '#666' }}>指标体系 ← 指标生成环节</span>
        <span style={{ fontSize: 12, color: '#999' }}>→</span>
        <span style={{ fontSize: 12, color: '#666' }}>过程数据 ← 过程跟踪/智巡核验</span>
        <span style={{ fontSize: 12, color: '#999' }}>→</span>
        <span style={{ fontSize: 12, color: '#666' }}>处室自评 ← 处室提交</span>
        <span style={{ fontSize: 12, color: '#999' }}>→</span>
        <span style={{ fontSize: 12, color: '#1a365d', fontWeight: 600 }}>智评汇总</span>
      </div>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        {[
          { label: '参评处室', value: 48, suffix: '个', color: '#3b82f6', icon: <BarChart3 size={20} color="#3b82f6" /> },
          { label: '已完成', value: 29, suffix: '个', color: '#22c55e', icon: <CheckCircle size={20} color="#22c55e" /> },
          { label: 'A级处室', value: aLevelCount, suffix: '个', color: '#f59e0b', icon: <Star size={20} color="#f59e0b" /> },
          { label: '平均得分', value: avgScore, suffix: '分', color: '#8b5cf6', icon: <TrendingUp size={20} color="#8b5cf6" /> },
        ].map((item, i) => (
          <Col span={6} key={i}>
            <Card style={glassCard} styles={{ body: { padding: 16 } }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text style={{ color: '#8c8c8c', fontSize: 13 }}>{item.label}</Text>
                  <div style={{ fontSize: 32, fontWeight: 700, color: item.color, marginTop: 4 }}>
                    {item.value}<span style={{ fontSize: 14, fontWeight: 400, marginLeft: 2 }}>{item.suffix}</span>
                  </div>
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card style={{ ...glassCard, marginBottom: 20 }} styles={{ body: { padding: '12px 20px' } }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#1a365d', fontWeight: 600 }}>📐 考评成绩计算公式</span>
          <span style={{ fontSize: 13, color: '#333', fontFamily: 'monospace' }}>
            年度考评成绩 = (工作实绩得分 + 履职测评得分 + 加分项得分 - 减分得分) × (党的建设得分 ÷ 90)
          </span>
          <Tag color="blue" style={{ marginLeft: 'auto' }}>党建系数调节</Tag>
        </div>
      </Card>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={24}>
          <Card
            title={<Space><BarChart3 size={16} color="#3b82f6" /><Text style={{ color: '#1a365d', fontWeight: 600 }}>智能评分面板</Text><Tag color="blue">点击处室查看画像</Tag></Space>}
            style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: 0 } }}
          >
            <Table
              dataSource={deptStatusList}
              columns={columns}
              rowKey="id"
              pagination={false}
              size="middle"
              style={{ background: 'transparent' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={10}>
          <Card
            title={<Space><UserCheck size={16} color="#8b5cf6" /><Text style={{ color: '#1a365d', fontWeight: 600 }}>{selectedDept.department} · 处室画像</Text></Space>}
            style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '8px 16px 16px' } }}
          >
            <ReactECharts option={radarOption} style={{ height: 280 }} />
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8 }}>
              {selectedDept.dimensions.map(d => (
                <div key={d.name} style={{ textAlign: 'center' }}>
                  <Text style={{ color: levelColorMap[selectedDept.level], fontWeight: 700, fontSize: 16 }}>{d.score}</Text>
                  <div><Text style={{ color: '#8c8c8c', fontSize: 11 }}>{d.name}</Text></div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col span={14}>
          <Row gutter={16}>
            <Col span={12}>
              <Card
                title={<Space><Star size={16} color="#f59e0b" /><Text style={{ color: '#1a365d', fontWeight: 600 }}>亮点识别</Text></Space>}
                style={glassCard}
                styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '8px 12px' } }}
              >
                {highlights.map((h, i) => (
                  <div key={i} style={{ padding: '8px 10px', background: 'rgba(34,197,94,0.06)', borderRadius: 8, marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      {h.icon}
                      <Text style={{ color: '#22c55e', fontWeight: 600, fontSize: 13 }}>{h.dept}</Text>
                    </div>
                    <Text style={{ color: '#8c8c8c', fontSize: 12, lineHeight: 1.6 }}>{h.text}</Text>
                  </div>
                ))}
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title={<Space><AlertTriangle size={16} color="#ef4444" /><Text style={{ color: '#1a365d', fontWeight: 600 }}>风险预警</Text></Space>}
                style={glassCard}
                styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '8px 12px' } }}
              >
                {risks.map((r, i) => (
                  <div key={i} style={{ padding: '8px 10px', background: 'rgba(239,68,68,0.06)', borderRadius: 8, marginBottom: 6, borderLeft: `3px solid ${r.level === 'high' ? '#ef4444' : r.level === 'medium' ? '#f59e0b' : '#3b82f6'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <Tag color={r.level === 'high' ? 'red' : r.level === 'medium' ? 'orange' : 'blue'} style={{ margin: 0, fontSize: 11 }}>{r.level === 'high' ? '高' : r.level === 'medium' ? '中' : '低'}</Tag>
                      <Text style={{ color: '#1a365d', fontWeight: 600, fontSize: 13 }}>{r.dept}</Text>
                    </div>
                    <Text style={{ color: '#8c8c8c', fontSize: 12, lineHeight: 1.6 }}>{r.text}</Text>
                  </div>
                ))}
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card
            title={<Space><Award size={16} color="#f59e0b" /><Text style={{ color: '#1a365d', fontWeight: 600 }}>卓越推荐</Text><Tag color="gold">AI智能推荐</Tag></Space>}
            style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '12px 16px' } }}
          >
            <Row gutter={16}>
              {excellenceCandidates.map((c, i) => (
                <Col span={8} key={i}>
                  <div style={{ padding: 16, background: 'rgba(245,158,11,0.06)', borderRadius: 10, border: '1px solid rgba(245,158,11,0.12)', textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                      <Award size={22} color="#f59e0b" />
                    </div>
                    <Text style={{ color: '#1a365d', fontWeight: 700, fontSize: 16, display: 'block' }}>{c.name}</Text>
                    <Text style={{ color: '#8c8c8c', fontSize: 12, display: 'block', marginBottom: 4 }}>{c.dept}</Text>
                    <Tag color="gold" style={{ marginBottom: 8 }}>{c.score}分</Tag>
                    <Text style={{ color: '#8c8c8c', fontSize: 12, lineHeight: 1.6, display: 'block' }}>{c.reason}</Text>
                    <Button size="small" type="primary" style={{ borderRadius: 6, marginTop: 10 }} icon={<Star size={12} style={{ verticalAlign: -1 }} />} onClick={() => message.success('已生成本年度评优推荐名单')}>推荐评优</Button>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      <style>{`
        .ant-table { background: transparent !important; }
        .ant-table-thead > tr > th { background: #fafafa !important; color: #8c8c8c !important; border-bottom: 1px solid #f0f0f0 !important; }
        .ant-table-tbody > tr > td { border-bottom: 1px solid #f0f0f0 !important; color: #333 !important; background: transparent !important; }
        .ant-table-tbody > tr:hover > td { background: rgba(0,0,0,0.02) !important; }
      `}</style>
    </div>
  )
}
