import { useState } from 'react'
import { Card, Input, Tag, Timeline, Row, Col, Typography, Space, Badge, Button } from 'antd'
import { BookOpen, Search, HelpCircle, Bell, Lightbulb, GraduationCap, FileText, TrendingUp } from 'lucide-react'
import { knowledgeData } from '@/mock/knowledgeData'
import { caseData } from '@/mock/caseData'
import { indicatorData } from '@/mock/indicatorData'

const { Title, Text } = Typography

const glassCard: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #f0f0f0',
  borderRadius: 12,
}

const quickQuestions = [
  { question: '今年KPI是什么？', source: '指标库', icon: <TrendingUp size={18} color="#3b82f6" />, color: '#3b82f6' },
  { question: '项目审批流程是什么？', source: '知识库·业务流程', icon: <FileText size={18} color="#22c55e" />, color: '#22c55e' },
  { question: '市京津冀协同办去年得分多少？', source: '绩效库', icon: <GraduationCap size={18} color="#8b5cf6" />, color: '#8b5cf6' },
  { question: '有没有类似成功案例？', source: '经验案例库', icon: <Lightbulb size={18} color="#f59e0b" />, color: '#f59e0b' },
]

const recentUpdates = [
  { time: '2025-06-15', title: '《投资管理办法》更新', category: '制度文件', color: '#3b82f6' },
  { time: '2025-06-14', title: '审批提速"五步工作法"入库', category: '最佳实践', color: '#22c55e' },
  { time: '2025-06-13', title: 'Q2绩效考核指标发布', category: '指标更新', color: '#8b5cf6' },
  { time: '2025-06-12', title: '跨处室协作"1+3"机制入库', category: '最佳实践', color: '#22c55e' },
  { time: '2025-06-11', title: '《审计监督办法》修订', category: '制度文件', color: '#3b82f6' },
]

const systemAlerts = [
  { title: '《投资管理办法》有效期即将届满', date: '2027-01-15', level: 'warning' },
  { title: '《项目管理办法》修订版已发布', date: '2025-06-10', level: 'info' },
  { title: '绩效考核评分标准调整通知', date: '2025-06-08', level: 'info' },
]

const categoryColorMap: Record<string, string> = {
  '制度文件': 'blue',
  '部门职责': 'green',
  '业务流程': 'purple',
  '组织架构': 'cyan',
  '专业术语': 'orange',
}

const caseTypeColorMap: Record<string, string> = {
  '成功案例': 'green',
  '失败案例': 'red',
  '最佳实践': 'blue',
  '问题案例': 'orange',
  '创新案例': 'purple',
  '标杆项目': 'cyan',
}

export default function ZhiXun2() {
  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState<typeof knowledgeData>([])
  const [carouselIdx, setCarouselIdx] = useState(0)

  const handleSearch = (value: string) => {
    setSearchValue(value)
    if (!value.trim()) {
      setSearchResults([])
      return
    }
    const kw = value.toLowerCase()
    const results = knowledgeData.filter(
      k => k.title.toLowerCase().includes(kw) || k.content.toLowerCase().includes(kw) || k.tags.some(t => t.includes(kw))
    )
    setSearchResults(results)
  }

  const handleQuickQuestion = (q: string) => {
    setSearchValue(q)
    handleSearch(q)
  }

  const carouselItems = caseData.slice(carouselIdx, carouselIdx + 3)
  const canPrev = carouselIdx > 0
  const canNext = carouselIdx + 3 < caseData.length

  return (
    <div style={{ minHeight: 'auto', background: 'transparent', padding: 24, color: '#333' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ color: '#1a365d', margin: 0 }}>
          <BookOpen size={22} style={{ marginRight: 8, verticalAlign: -3, color: '#3b82f6' }} />
          智训助手 · 知识助手
        </Title>
        <Text style={{ color: '#666', fontSize: 14, marginTop: 6, display: 'block' }}>
          智能问答、经验学习、知识检索一站式服务
        </Text>
      </div>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        {quickQuestions.map((item, i) => (
          <Col span={6} key={i}>
            <Card
              style={{ ...glassCard, cursor: 'pointer', transition: 'all 0.2s' }}
              styles={{ body: { padding: 16 } }}
              hoverable
              onClick={() => handleQuickQuestion(item.question)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ color: '#1a365d', fontWeight: 600, fontSize: 14, display: 'block' }}>{item.question}</Text>
                  <Tag color={item.color === '#3b82f6' ? 'blue' : item.color === '#22c55e' ? 'green' : item.color === '#8b5cf6' ? 'purple' : 'orange'} style={{ marginTop: 4, fontSize: 11 }}>
                    {item.source}
                  </Tag>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={24}>
          <Card
            title={<Space><Search size={16} color="#3b82f6" /><Text style={{ color: '#1a365d', fontWeight: 600 }}>知识检索</Text></Space>}
            style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '12px 16px' } }}
          >
            <Input
              prefix={<Search size={16} color="#8c8c8c" />}
              placeholder="输入关键词搜索指标库、知识库、绩效库、案例库..."
              size="large"
              value={searchValue}
              onChange={e => handleSearch(e.target.value)}
              style={{ borderRadius: 8, marginBottom: 12 }}
              allowClear
            />
            {searchResults.length > 0 && (
              <div>
                {searchResults.map(item => (
                  <div key={item.id} style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.04)', borderRadius: 8, marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <Space size={8}>
                        <Text style={{ color: '#1a365d', fontWeight: 600 }}>{item.title}</Text>
                        <Tag color={categoryColorMap[item.category] || 'default'}>{item.category}</Tag>
                      </Space>
                      <Text style={{ color: '#64748b', fontSize: 12 }}>{item.department}</Text>
                    </div>
                    <Text style={{ color: '#8c8c8c', fontSize: 13 }}>{item.content}</Text>
                  </div>
                ))}
              </div>
            )}
            {searchValue && searchResults.length === 0 && (
              <div style={{ textAlign: 'center', padding: 24 }}>
                <HelpCircle size={32} color="#64748b" style={{ marginBottom: 8 }} />
                <Text style={{ color: '#64748b' }}>未找到相关知识，请尝试其他关键词</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={14}>
          <Card
            title={<Space><Bell size={16} color="#06b6d4" /><Text style={{ color: '#1a365d', fontWeight: 600 }}>最近更新</Text></Space>}
            style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '12px 16px' } }}
          >
            <Timeline
              items={recentUpdates.map(item => ({
                color: item.color === '#3b82f6' ? 'blue' : 'green',
                children: (
                  <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.04)', borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space size={8}>
                        <Text style={{ color: '#1a365d', fontWeight: 600, fontSize: 14 }}>{item.title}</Text>
                        <Tag color={item.color === '#3b82f6' ? 'blue' : 'green'} style={{ fontSize: 11 }}>{item.category}</Tag>
                      </Space>
                      <Text style={{ color: '#64748b', fontSize: 12 }}>{item.time}</Text>
                    </div>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
        <Col span={10}>
          <Card
            title={<Space><Bell size={16} color="#f59e0b" /><Text style={{ color: '#1a365d', fontWeight: 600 }}>制度更新提醒</Text><Badge count={systemAlerts.length} /></Space>}
            style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '12px 16px' } }}
          >
            {systemAlerts.map((alert, i) => (
              <div key={i} style={{ padding: '10px 14px', background: alert.level === 'warning' ? 'rgba(245,158,11,0.08)' : 'rgba(59,130,246,0.08)', borderRadius: 8, marginBottom: 8, borderLeft: `3px solid ${alert.level === 'warning' ? '#f59e0b' : '#3b82f6'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space size={8}>
                    <Bell size={14} color={alert.level === 'warning' ? '#f59e0b' : '#3b82f6'} />
                    <Text style={{ color: '#1a365d', fontWeight: 600, fontSize: 13 }}>{alert.title}</Text>
                  </Space>
                  <Text style={{ color: '#64748b', fontSize: 12 }}>{alert.date}</Text>
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space><GraduationCap size={16} color="#8b5cf6" /><Text style={{ color: '#1a365d', fontWeight: 600 }}>案例学习推荐</Text></Space>
                <Space>
                  <Button size="small" disabled={!canPrev} onClick={() => setCarouselIdx(Math.max(0, carouselIdx - 3))} style={{ borderRadius: 6 }}>上一组</Button>
                  <Button size="small" disabled={!canNext} onClick={() => setCarouselIdx(Math.min(caseData.length - 3, carouselIdx + 3))} style={{ borderRadius: 6 }}>下一组</Button>
                </Space>
              </div>
            }
            style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '12px 16px' } }}
          >
            <Row gutter={16}>
              {carouselItems.map(item => (
                <Col span={8} key={item.id}>
                  <div style={{ padding: 16, background: 'rgba(0,0,0,0.04)', borderRadius: 10, height: '100%' }}>
                    <div style={{ marginBottom: 8 }}>
                      <Space size={6}>
                        <Tag color={caseTypeColorMap[item.type] || 'default'}>{item.type}</Tag>
                        <Text style={{ color: '#64748b', fontSize: 12 }}>{item.department}</Text>
                      </Space>
                    </div>
                    <Text style={{ color: '#1a365d', fontWeight: 600, fontSize: 14, display: 'block', marginBottom: 6 }}>{item.title}</Text>
                    <Text style={{ color: '#8c8c8c', fontSize: 12, marginBottom: 8, lineHeight: 1.6, overflow: 'hidden', textOverflow: 'ellipsis', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', display: '-webkit-box' } as React.CSSProperties}>{item.result}</Text>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {item.tags.map(tag => (
                        <Tag key={tag} style={{ fontSize: 11, margin: 0 }}>{tag}</Tag>
                      ))}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      <style>{`
        .ant-timeline-item-content { margin-inline-start: 20px !important; }
      `}</style>
    </div>
  )
}
