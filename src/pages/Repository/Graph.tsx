import { useState, useRef, useCallback } from 'react'
import { Card, Tag, Badge, Space, Typography, Drawer, List } from 'antd'
import ReactECharts from 'echarts-for-react'
import { Share2, Maximize2, Info, X } from 'lucide-react'
import { graphNodes, graphLinks, graphCategories } from '@/mock/graphData'

const { Title, Text } = Typography

const categoryColorMap: Record<string, string> = {
  '战略层': '#1a365d',
  '管理层': '#3b82f6',
  '执行层': '#93c5fd',
}

const echartsCategories = graphCategories.map(c => ({
  name: c.name,
  itemStyle: { color: categoryColorMap[c.name] },
}))

function getOption(highlightId: string | null) {
  const nodes = graphNodes.map(n => ({
    id: n.id,
    name: n.name,
    category: graphCategories.findIndex(c => c.name === n.category),
    symbolSize: n.symbolSize,
    label: { show: true, fontSize: 12, color: '#333' },
    itemStyle: highlightId
      ? (n.id === highlightId || graphLinks.some(
          l => (l.source === highlightId && l.target === n.id) || (l.target === highlightId && l.source === n.id)
        )
        ? undefined
        : { opacity: 0.2 })
      : undefined,
  }))

  const links = graphLinks.map(l => ({
    source: l.source,
    target: l.target,
    lineStyle: highlightId
      ? (l.source === highlightId || l.target === highlightId
        ? { color: '#94a3b8', width: 2, opacity: 1 }
        : { opacity: 0.06 })
      : { color: '#94a3b8', width: 1, opacity: 0.5, curveness: 0.1 },
    label: {
      show: true,
      formatter: l.relation,
      fontSize: 10,
      color: '#64748b',
    },
  }))

  return {
    backgroundColor: '#fff',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#fff',
      borderColor: '#e2e8f0',
      textStyle: { color: '#333', fontSize: 12 },
      formatter: (params: any) => {
        if (params.dataType === 'edge') return params.data.label?.formatter || ''
        const cat = graphCategories[params.data.category]?.name || ''
        return `<b>${params.name}</b><br/>类别：${cat}`
      },
    },
    legend: [{
      data: graphCategories.map(c => c.name),
      orient: 'vertical',
      right: 10,
      top: 20,
      textStyle: { color: '#333', fontSize: 12 },
    }],
    series: [{
      type: 'graph',
      layout: 'force',
      data: nodes,
      links,
      categories: echartsCategories,
      force: { repulsion: 400, edgeLength: [120, 250] },
      roam: true,
      draggable: true,
      emphasis: {
        focus: 'adjacency',
        lineStyle: { width: 3 },
        label: { fontSize: 14 },
      },
      edgeLabel: { fontSize: 10 },
    }],
  }
}

function getNodeRelations(nodeId: string) {
  const related: Record<string, { node: typeof graphNodes[0]; relation: string }[]> = {}
  graphLinks.forEach(l => {
    if (l.source === nodeId) {
      const t = graphNodes.find(n => n.id === l.target)
      if (t) {
        const key = l.relation
        ;(related[key] ??= []).push({ node: t, relation: l.relation })
      }
    } else if (l.target === nodeId) {
      const s = graphNodes.find(n => n.id === l.source)
      if (s) {
        const key = l.relation
        ;(related[key] ??= []).push({ node: s, relation: l.relation })
      }
    }
  })
  return related
}

export default function GraphPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const chartRef = useRef<any>(null)

  const selectedNode = selectedId ? graphNodes.find(n => n.id === selectedId) : null
  const relations = selectedId ? getNodeRelations(selectedId) : {}

  const handleChartClick = useCallback((params: any) => {
    if (params.dataType === 'node') {
      setSelectedId(prev => prev === params.data.id ? null : params.data.id)
    } else {
      setSelectedId(null)
    }
  }, [])

  const uniqueCategories = new Set(graphNodes.map(n => n.category)).size

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <Space align="center" size={8}>
          <Share2 size={22} color="#3b82f6" />
          <Title level={3} style={{ margin: 0 }}>考评知识本体关系图</Title>
        </Space>
        <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
          北京市发改委考评知识本体关系图谱，展示战略层、管理层与执行层之间的关联
        </Text>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        {graphCategories.map(c => (
          <Tag key={c.name} color={categoryColorMap[c.name]} style={{ margin: 0 }}>
            {c.name}
          </Tag>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Card size="small" style={{ flex: 1, textAlign: 'center' }}>
          <Badge count={graphNodes.length} overflowCount={999} color="#1a365d" />
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>本体实体</div>
        </Card>
        <Card size="small" style={{ flex: 1, textAlign: 'center' }}>
          <Badge count={graphLinks.length} overflowCount={999} color="#3b82f6" />
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>关系总数</div>
        </Card>
        <Card size="small" style={{ flex: 1, textAlign: 'center' }}>
          <Badge count={uniqueCategories} overflowCount={999} color="#93c5fd" />
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>概念类别</div>
        </Card>
      </div>

      <div style={{ position: 'relative' }}>
        <Card
          bodyStyle={{ padding: 0, overflow: 'hidden', borderRadius: 8 }}
          style={{ borderRadius: 8 }}
        >
          <ReactECharts
            ref={chartRef}
            option={getOption(selectedId)}
            style={{ height: 560 }}
            onEvents={{ click: handleChartClick }}
          />
        </Card>
        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 8 }}>
          <Card size="small" style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.9)', border: 'none' }}>
            <Space size={6}>
              <Info size={14} color="#64748b" />
              <Text style={{ fontSize: 11, color: '#64748b' }}>点击节点查看详情</Text>
            </Space>
          </Card>
          <Card
            size="small"
            style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer' }}
          >
            <Maximize2 size={14} color="#64748b" />
          </Card>
        </div>
      </div>

      <Drawer
        title={null}
        placement="right"
        width={360}
        open={!!selectedNode}
        onClose={() => setSelectedId(null)}
        closeIcon={<X size={16} />}
        styles={{ body: { padding: '16px 24px' } }}
      >
        {selectedNode && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <Title level={4} style={{ margin: '0 0 8px 0' }}>{selectedNode.name}</Title>
              <Tag color={categoryColorMap[selectedNode.category]}>{selectedNode.category}</Tag>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">关联数量：</Text>
              <Text strong>
                {graphLinks.filter(l => l.source === selectedId || l.target === selectedId).length}
              </Text>
            </div>

            {Object.entries(relations).map(([relation, items]) => (
              <div key={relation} style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Badge color="#3b82f6" />
                  <Text strong style={{ fontSize: 13 }}>{relation}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>({items.length})</Text>
                </div>
                <List
                  size="small"
                  dataSource={items}
                  renderItem={(item) => (
                    <List.Item style={{ padding: '6px 0', border: 'none' }}>
                      <Space size={8}>
                        <Tag
                          color={categoryColorMap[item.node.category]}
                          style={{ fontSize: 11, margin: 0 }}
                        >
                          {item.node.category}
                        </Tag>
                        <Text style={{ fontSize: 13 }}>{item.node.name}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </div>
  )
}
