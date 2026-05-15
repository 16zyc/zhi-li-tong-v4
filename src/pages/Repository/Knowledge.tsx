import { useState } from 'react'
import { Tabs, Card, Input, Tag, Modal, Row, Col, Space, Typography, Badge, Tooltip } from 'antd'
import { BookOpen, Search, FileText, Users, GitBranch, Building, Clock, AlertCircle } from 'lucide-react'
import { knowledgeData } from '@/mock/knowledgeData'
import type { KnowledgeItem } from '@/mock/types'

const { Title, Text, Paragraph } = Typography

const categoryTabs = [
  { key: 'all', label: '全部', icon: <BookOpen size={14} /> },
  { key: '制度文件', label: '制度文件库', icon: <FileText size={14} /> },
  { key: '部门职责', label: '部门职责库', icon: <Users size={14} /> },
  { key: '业务流程', label: '业务流程库', icon: <GitBranch size={14} /> },
  { key: '组织架构', label: '组织架构库', icon: <Building size={14} /> },
  { key: '专业术语', label: '专业术语库', icon: <BookOpen size={14} /> },
]

const categoryColorMap: Record<string, string> = {
  '制度文件': 'blue',
  '部门职责': 'green',
  '业务流程': 'orange',
  '组织架构': 'purple',
  '专业术语': 'cyan',
}

const tagColorPool = ['#1d4ed8', '#2563eb', '#0891b2', '#059669', '#7c3aed', '#d97706']

function isNearExpiry(expireDate?: string) {
  if (!expireDate) return false
  const diff = new Date(expireDate).getTime() - Date.now()
  return diff > 0 && diff < 90 * 24 * 60 * 60 * 1000
}

function isExpired(expireDate?: string) {
  if (!expireDate) return false
  return new Date(expireDate).getTime() < Date.now()
}

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [detailItem, setDetailItem] = useState<KnowledgeItem | null>(null)

  const filtered = knowledgeData.filter(item => {
    if (activeTab !== 'all' && item.category !== activeTab) return false
    if (keyword && !item.title.includes(keyword) && !item.content.includes(keyword) && !item.tags.some(t => t.includes(keyword))) return false
    return true
  })

  const stats = [
    { label: '制度文件', count: knowledgeData.filter(i => i.category === '制度文件').length, color: '#1d4ed8' },
    { label: '部门职责', count: knowledgeData.filter(i => i.category === '部门职责').length, color: '#059669' },
    { label: '业务流程', count: knowledgeData.filter(i => i.category === '业务流程').length, color: '#d97706' },
    { label: '组织架构', count: knowledgeData.filter(i => i.category === '组织架构').length, color: '#7c3aed' },
    { label: '专业术语', count: knowledgeData.filter(i => i.category === '专业术语').length, color: '#0891b2' },
  ]

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: '#1e293b' }}>知识库</Title>
        <Text type="secondary">沉淀组织智慧，让每个决策都有据可依</Text>
      </div>

      <Row gutter={12} style={{ marginBottom: 24 }}>
        {stats.map(s => (
          <Col flex={1} key={s.label}>
            <Card size="small" style={{ borderLeft: `3px solid ${s.color}`, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.count}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>{s.label}</div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={categoryTabs.map(t => ({
            key: t.key,
            label: (
              <Space size={4}>
                {t.icon}
                <span>{t.label}</span>
              </Space>
            ),
          }))}
        />

        <Input
          placeholder="全文搜索：标题、内容、标签"
          prefix={<Search size={14} style={{ color: '#94a3b8' }} />}
          allowClear
          style={{ width: 320, marginBottom: 20 }}
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />

        <Row gutter={[16, 16]}>
          {filtered.map(item => {
            const nearExpiry = isNearExpiry(item.expireDate)
            const expired = isExpired(item.expireDate)
            return (
              <Col span={8} key={item.id}>
                <Card
                  hoverable
                  size="small"
                  style={{
                    borderLeft: `3px solid ${categoryColorMap[item.category] || '#1d4ed8'}`,
                    borderColor: nearExpiry ? '#faad14' : undefined,
                  }}
                  onClick={() => setDetailItem(item)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <Text strong style={{ fontSize: 15, flex: 1 }}>{item.title}</Text>
                    {nearExpiry && !expired && (
                      <Tooltip title="即将到期">
                        <Badge color="#faad14" />
                      </Tooltip>
                    )}
                    {expired && (
                      <Tooltip title="已过期">
                        <AlertCircle size={16} color="#ff4d4f" />
                      </Tooltip>
                    )}
                  </div>

                  <Space size={4} style={{ marginBottom: 8 }}>
                    <Tag color={categoryColorMap[item.category]}>{item.category}</Tag>
                    <Text type="secondary" style={{ fontSize: 12 }}>{item.department}</Text>
                  </Space>

                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{ color: '#475569', fontSize: 13, marginBottom: 8 }}
                  >
                    {item.content}
                  </Paragraph>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space size={4} wrap>
                      {item.tags.map((tag, idx) => (
                        <Tag key={tag} style={{ fontSize: 11, color: tagColorPool[idx % tagColorPool.length], borderColor: tagColorPool[idx % tagColorPool.length], background: 'transparent' }}>
                          {tag}
                        </Tag>
                      ))}
                    </Space>
                    <Tooltip title="发布日期">
                      <Space size={2} style={{ color: '#94a3b8', fontSize: 12 }}>
                        <Clock size={12} />
                        <span>{item.publishDate}</span>
                      </Space>
                    </Tooltip>
                  </div>

                  {item.expireDate && (
                    <div style={{ marginTop: 6, fontSize: 12 }}>
                      {nearExpiry && !expired && (
                        <Space size={2} style={{ color: '#d97706' }}>
                          <AlertCircle size={12} />
                          <span>即将到期：{item.expireDate}</span>
                        </Space>
                      )}
                      {expired && (
                        <Space size={2} style={{ color: '#ff4d4f' }}>
                          <AlertCircle size={12} />
                          <span>已过期：{item.expireDate}</span>
                        </Space>
                      )}
                    </div>
                  )}
                </Card>
              </Col>
            )
          })}
        </Row>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
            <BookOpen size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
            <div>暂无匹配的知识条目</div>
          </div>
        )}
      </Card>

      <Modal
        open={!!detailItem}
        title={null}
        footer={null}
        onCancel={() => setDetailItem(null)}
        width={640}
        destroyOnClose
      >
        {detailItem && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Title level={4} style={{ margin: '0 0 8px 0', color: '#1e293b' }}>{detailItem.title}</Title>
              <Space size={8}>
                <Tag color={categoryColorMap[detailItem.category]}>{detailItem.category}</Tag>
                <Text type="secondary">{detailItem.department}</Text>
                <Text type="secondary">编号：{detailItem.id}</Text>
              </Space>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <Text style={{ fontSize: 14, lineHeight: 1.8, color: '#334155' }}>{detailItem.content}</Text>
            </div>

            <Row gutter={24} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Space size={4}>
                  <Clock size={14} style={{ color: '#94a3b8' }} />
                  <Text type="secondary">发布日期：</Text>
                  <Text>{detailItem.publishDate}</Text>
                </Space>
              </Col>
              {detailItem.expireDate && (
                <Col span={12}>
                  <Space size={4}>
                    <AlertCircle size={14} style={{ color: isExpired(detailItem.expireDate) ? '#ff4d4f' : isNearExpiry(detailItem.expireDate) ? '#d97706' : '#94a3b8' }} />
                    <Text type="secondary">有效期至：</Text>
                    <Text style={{ color: isExpired(detailItem.expireDate) ? '#ff4d4f' : isNearExpiry(detailItem.expireDate) ? '#d97706' : undefined }}>
                      {detailItem.expireDate}
                    </Text>
                  </Space>
                </Col>
              )}
            </Row>

            <div>
              <Text type="secondary" style={{ marginRight: 8 }}>标签：</Text>
              {detailItem.tags.map((tag, idx) => (
                <Tag key={tag} color={tagColorPool[idx % tagColorPool.length]}>{tag}</Tag>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
