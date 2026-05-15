import { useState } from 'react'
import { Card, Tag, Modal, Row, Col, Space, Typography, Button, Badge, Tooltip } from 'antd'
import { Lightbulb, AlertTriangle, Star, HelpCircle, Zap, Trophy, Copy, ChevronRight } from 'lucide-react'
import { caseData } from '@/mock/caseData'
import type { CaseItem } from '@/mock/types'

const { Title, Text, Paragraph } = Typography

const typeConfig: Record<string, { color: string; icon: React.ReactNode; tagColor: string }> = {
  '成功案例': { color: '#059669', icon: <Star size={14} />, tagColor: 'green' },
  '失败案例': { color: '#dc2626', icon: <AlertTriangle size={14} />, tagColor: 'red' },
  '最佳实践': { color: '#2563eb', icon: <Lightbulb size={14} />, tagColor: 'blue' },
  '问题案例': { color: '#d97706', icon: <HelpCircle size={14} />, tagColor: 'orange' },
  '创新案例': { color: '#7c3aed', icon: <Zap size={14} />, tagColor: 'purple' },
  '标杆项目': { color: '#b45309', icon: <Trophy size={14} />, tagColor: 'gold' },
}

const typeTabs = [
  { key: 'all', label: '全部类型' },
  ...Object.keys(typeConfig).map(key => ({ key, label: key })),
]

const replicabilityMap: Record<string, { color: string; label: string }> = {
  '高': { color: '#059669', label: '高可复制' },
  '中': { color: '#d97706', label: '中等可复制' },
  '低': { color: '#dc2626', label: '低可复制' },
}

function getReplicabilityLevel(text: string) {
  if (text.startsWith('高') || text.startsWith('极高')) return '高'
  if (text.startsWith('中')) return '中'
  if (text.startsWith('低')) return '低'
  if (text.startsWith('教训')) return '高'
  return '中'
}

export default function CasePage() {
  const [activeType, setActiveType] = useState('all')
  const [detailItem, setDetailItem] = useState<CaseItem | null>(null)

  const filtered = caseData.filter(item => {
    if (activeType !== 'all' && item.type !== activeType) return false
    return true
  })

  const stats = [
    { label: '案例总数', count: caseData.length, color: '#1e293b' },
    ...Object.entries(typeConfig).map(([key, cfg]) => ({
      label: key,
      count: caseData.filter(i => i.type === key).length,
      color: cfg.color,
    })),
  ]

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: '#1e293b' }}>经验案例库</Title>
        <Text type="secondary">将隐性的经验智慧转化为显性的组织资产</Text>
      </div>

      <Row gutter={10} style={{ marginBottom: 20 }}>
        {stats.map(s => (
          <Col flex={1} key={s.label}>
            <Card size="small" style={{ borderLeft: `3px solid ${s.color}`, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.count}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {typeTabs.map(tab => {
            const cfg = typeConfig[tab.key]
            const isActive = activeType === tab.key
            return (
              <Button
                key={tab.key}
                size="small"
                type={isActive ? 'primary' : 'default'}
                style={isActive && cfg ? { background: cfg.color, borderColor: cfg.color } : undefined}
                icon={cfg?.icon}
                onClick={() => setActiveType(tab.key)}
              >
                {tab.label}
              </Button>
            )
          })}
        </div>

        <Row gutter={[16, 16]}>
          {filtered.map(item => {
            const cfg = typeConfig[item.type]
            const level = getReplicabilityLevel(item.replicability)
            const repCfg = replicabilityMap[level]
            return (
              <Col span={12} key={item.id}>
                <Card
                  hoverable
                  size="small"
                  style={{ borderLeft: `3px solid ${cfg?.color || '#1e293b'}` }}
                  onClick={() => setDetailItem(item)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <Text strong style={{ fontSize: 15, flex: 1 }}>{item.title}</Text>
                    <Tag color={cfg?.tagColor} icon={cfg?.icon} style={{ marginLeft: 8, flexShrink: 0 }}>
                      {item.type}
                    </Tag>
                  </div>

                  <Space size={8} style={{ marginBottom: 8, fontSize: 12 }}>
                    <Text type="secondary">{item.department}</Text>
                    <Text type="secondary">·</Text>
                    <Text type="secondary">{item.project}</Text>
                    <Text type="secondary">·</Text>
                    <Text type="secondary">{item.date}</Text>
                  </Space>

                  <Paragraph ellipsis={{ rows: 2 }} style={{ color: '#475569', fontSize: 13, marginBottom: 6 }}>
                    {item.background}
                  </Paragraph>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space size={4} wrap>
                      {item.tags.map(tag => (
                        <Tag key={tag} style={{ fontSize: 11, background: 'transparent' }}>{tag}</Tag>
                      ))}
                    </Space>
                    <Tooltip title={repCfg.label}>
                      <Badge color={repCfg.color} text={<Text style={{ fontSize: 12, color: repCfg.color }}>{level}</Text>} />
                    </Tooltip>
                  </div>
                </Card>
              </Col>
            )
          })}
        </Row>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
            <Lightbulb size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
            <div>暂无匹配的案例</div>
          </div>
        )}
      </Card>

      <Modal
        open={!!detailItem}
        title={null}
        footer={null}
        onCancel={() => setDetailItem(null)}
        width={700}
        destroyOnClose
      >
        {detailItem && (() => {
          const cfg = typeConfig[detailItem.type]
          const level = getReplicabilityLevel(detailItem.replicability)
          const repCfg = replicabilityMap[level]
          return (
            <div>
              <div style={{ marginBottom: 16 }}>
                <Title level={4} style={{ margin: '0 0 8px 0', color: '#1e293b' }}>{detailItem.title}</Title>
                <Space size={8}>
                  <Tag color={cfg?.tagColor} icon={cfg?.icon}>{detailItem.type}</Tag>
                  <Text type="secondary">{detailItem.department}</Text>
                  <Text type="secondary">·</Text>
                  <Text type="secondary">{detailItem.project}</Text>
                  <Text type="secondary">·</Text>
                  <Text type="secondary">{detailItem.date}</Text>
                </Space>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                <Text strong style={{ color: '#1e293b', display: 'block', marginBottom: 6 }}>背景</Text>
                <Text style={{ fontSize: 14, lineHeight: 1.8, color: '#334155' }}>{detailItem.background}</Text>
              </div>

              <div style={{ background: '#eff6ff', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                <Text strong style={{ color: '#1e293b', display: 'block', marginBottom: 6 }}>做法</Text>
                <Text style={{ fontSize: 14, lineHeight: 1.8, color: '#334155' }}>{detailItem.approach}</Text>
              </div>

              <div style={{ background: '#f0fdf4', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                <Text strong style={{ color: '#1e293b', display: 'block', marginBottom: 6 }}>结果</Text>
                <Text style={{ fontSize: 14, lineHeight: 1.8, color: '#334155' }}>{detailItem.result}</Text>
              </div>

              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={12}>
                  <Card size="small" style={{ background: '#fefce8' }}>
                    <Space size={6}>
                      <Copy size={16} style={{ color: repCfg.color }} />
                      <Text strong style={{ color: '#1e293b' }}>可复制性</Text>
                    </Space>
                    <div style={{ marginTop: 8 }}>
                      <Badge color={repCfg.color} text={<Text style={{ color: repCfg.color, fontWeight: 600 }}>{level}</Text>} />
                      <div style={{ marginTop: 4, fontSize: 13, color: '#475569' }}>{detailItem.replicability}</div>
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small" style={{ background: '#f8fafc' }}>
                    <Space size={6}>
                      <ChevronRight size={16} style={{ color: '#64748b' }} />
                      <Text strong style={{ color: '#1e293b' }}>案例编号</Text>
                    </Space>
                    <div style={{ marginTop: 8, fontSize: 15, fontWeight: 600, color: '#1e293b' }}>{detailItem.id}</div>
                  </Card>
                </Col>
              </Row>

              <div>
                <Text type="secondary" style={{ marginRight: 8 }}>标签：</Text>
                {detailItem.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
          )
        })()}
      </Modal>
    </div>
  )
}
