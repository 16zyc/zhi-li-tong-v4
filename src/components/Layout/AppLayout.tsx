import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom'
import { Layout, Menu, Breadcrumb, Avatar, Badge, Button, Dropdown, Tag } from 'antd'
import {
  Home,
  Users,
  Database,
  GitBranch,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
  Shield,
  Target,
  Settings,
  ClipboardList,
  Eye,
  Award,
  BookOpen,
  BarChart3,
  TrendingUp,
  FolderOpen,
  Share2,
  LogOut,
  Star,
  FileText,
  Sliders,
  ScrollText,
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

const { Sider, Header, Content } = Layout

const roleLabelMap: Record<string, { label: string; color: string }> = {
  admin: { label: '系统管理员', color: 'blue' },
  pfm: { label: '绩效管理员', color: 'green' },
  pfl: { label: '绩效领导', color: 'gold' },
}

type MenuItemType = NonNullable<Parameters<typeof Menu>[0]['items']>[number]

const getMenuByRole = (role: string): MenuItemType[] => {
  const allDashboardChildren = [
    { key: '/dashboard/zhice', icon: <Target size={14} />, label: '智策' },
    { key: '/dashboard/zhiguan', icon: <Settings size={14} />, label: '智管' },
    { key: '/dashboard/zhiban', icon: <ClipboardList size={14} />, label: '智办' },
    { key: '/dashboard/zhixun', icon: <Eye size={14} />, label: '智巡' },
    { key: '/dashboard/zhiping', icon: <Award size={14} />, label: '智评' },
    { key: '/dashboard/zhixun2', icon: <BookOpen size={14} />, label: '智训' },
    { key: '/dashboard/skill-profile', icon: <Star size={14} />, label: '能力画像' },
  ]

  const allRepositoryChildren = [
    { key: '/repository/indicator', icon: <BarChart3 size={14} />, label: '指标库' },
    { key: '/repository/knowledge', icon: <BookOpen size={14} />, label: '知识库' },
    { key: '/repository/performance', icon: <TrendingUp size={14} />, label: '绩效库' },
    { key: '/repository/case', icon: <FolderOpen size={14} />, label: '经验案例库' },
    { key: '/repository/graph', icon: <Share2 size={14} />, label: '知识图谱' },
  ]

  const systemChildren = [
    { key: '/system/users', icon: <Users size={14} />, label: '用户管理' },
    { key: '/system/config', icon: <Sliders size={14} />, label: '系统配置' },
    { key: '/system/logs', icon: <ScrollText size={14} />, label: '操作日志' },
  ]

  if (role === 'admin') {
    return [
      { key: '/', icon: <Home size={16} />, label: '总览首页' },
      { key: 'dashboard', icon: <Users size={16} />, label: '六员工作台', children: allDashboardChildren },
      { key: 'repository', icon: <Database size={16} />, label: '四库一图', children: allRepositoryChildren },
      { key: '/workflow', icon: <GitBranch size={16} />, label: '十大环节' },
      { key: '/workflow/task-decompose', icon: <ClipboardList size={14} />, label: '任务分解' },
      { key: '/chat', icon: <MessageSquare size={16} />, label: '对话即操作' },
      { key: 'system', icon: <FileText size={16} />, label: '系统管理', children: systemChildren },
    ]
  }

  if (role === 'pfm') {
    return [
      {
        key: 'dashboard',
        icon: <Users size={16} />,
        label: '工作台',
        children: [
          { key: '/dashboard/zhiguan', icon: <Settings size={14} />, label: '智管（部门工作台）' },
          { key: '/dashboard/zhiban', icon: <ClipboardList size={14} />, label: '智办（经办人助手）' },
          { key: '/dashboard/zhiping', icon: <Award size={14} />, label: '智评（考核评价）' },
          { key: '/dashboard/zhixun2', icon: <BookOpen size={14} />, label: '智训（知识助手）' },
        ],
      },
      { key: 'repository', icon: <Database size={16} />, label: '四库一图', children: allRepositoryChildren },
      { key: '/workflow/task-decompose', icon: <ClipboardList size={14} />, label: '任务分解' },
      { key: '/chat', icon: <MessageSquare size={16} />, label: '对话即操作' },
    ]
  }

  if (role === 'pfl') {
    return [
      {
        key: 'dashboard',
        icon: <Users size={16} />,
        label: '领导驾驶舱',
        children: [
          { key: '/dashboard/zhice', icon: <Target size={14} />, label: '智策（领导驾驶舱）' },
          { key: '/dashboard/zhixun', icon: <Eye size={14} />, label: '智巡（审计核验）' },
          { key: '/dashboard/skill-profile', icon: <Star size={14} />, label: '能力画像' },
        ],
      },
      {
        key: 'repository',
        icon: <Database size={16} />,
        label: '四库一图',
        children: [
          { key: '/repository/indicator', icon: <BarChart3 size={14} />, label: '指标库' },
          { key: '/repository/performance', icon: <TrendingUp size={14} />, label: '绩效库' },
          { key: '/repository/graph', icon: <Share2 size={14} />, label: '知识图谱' },
        ],
      },
      { key: '/chat', icon: <MessageSquare size={16} />, label: '对话即操作' },
    ]
  }

  return [
    { key: '/', icon: <Home size={16} />, label: '总览首页' },
    { key: 'dashboard', icon: <Users size={16} />, label: '六员工作台', children: allDashboardChildren },
    { key: 'repository', icon: <Database size={16} />, label: '四库一图', children: allRepositoryChildren },
    { key: '/workflow', icon: <GitBranch size={16} />, label: '十大环节' },
    { key: '/workflow/task-decompose', icon: <ClipboardList size={14} />, label: '任务分解' },
    { key: '/chat', icon: <MessageSquare size={16} />, label: '对话即操作' },
    { key: 'system', icon: <FileText size={16} />, label: '系统管理', children: systemChildren },
  ]
}

const breadcrumbNameMap: Record<string, string> = {
  '/': '总览首页',
  '/dashboard': '六员工作台',
  '/dashboard/zhice': '智策',
  '/dashboard/zhiguan': '智管',
  '/dashboard/zhiban': '智办',
  '/dashboard/zhixun': '智巡',
  '/dashboard/zhiping': '智评',
  '/dashboard/zhixun2': '智训',
  '/dashboard/skill-profile': '能力画像',
  '/repository': '四库一图',
  '/repository/indicator': '指标库',
  '/repository/knowledge': '知识库',
  '/repository/performance': '绩效库',
  '/repository/case': '经验案例库',
  '/repository/graph': '知识图谱',
  '/workflow': '十大环节',
  '/workflow/task-decompose': '任务分解',
  '/chat': '对话即操作',
  '/system': '系统管理',
  '/system/users': '用户管理',
  '/system/config': '系统配置',
  '/system/logs': '操作日志',
}

const AppLayout = () => {
  const { collapsed, toggleCollapsed, currentUser, logout } = useAppStore()
  const navigate = useNavigate()
  const location = useLocation()

  const role = currentUser?.role || 'admin'
  const menuItems = getMenuByRole(role)
  const roleInfo = roleLabelMap[role] || { label: '未知角色', color: 'default' }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const pathSnippets = location.pathname.split('/').filter(Boolean)
  const breadcrumbItems = [
    { title: <Link to="/">首页</Link> },
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
      const isLast = index === pathSnippets.length - 1
      const name = breadcrumbNameMap[url] || url
      return { title: isLast ? name : <Link to={url}>{name}</Link> }
    }),
  ]

  const selectedKeys = [location.pathname]
  const defaultOpenKeys = (() => {
    if (location.pathname.startsWith('/dashboard')) return ['dashboard']
    if (location.pathname.startsWith('/repository')) return ['repository']
    if (location.pathname.startsWith('/system')) return ['system']
    return []
  })()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        collapsedWidth={80}
        style={{
          background: '#1a365d',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          overflow: 'auto',
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Shield size={24} color="#60a5fa" />
          {!collapsed && (
            <span
              style={{
                color: '#f1f5f9',
                fontSize: 16,
                fontWeight: 700,
                marginLeft: 10,
                whiteSpace: 'nowrap',
              }}
            >
              智理通 V4.0
            </span>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          defaultOpenKeys={defaultOpenKeys}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ background: 'transparent', borderRight: 'none' }}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 240,
          transition: 'margin-left 0.2s',
        }}
      >
        <Header
          style={{
            height: 64,
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 99,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              onClick={toggleCollapsed}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              {collapsed ? (
                <ChevronRight size={18} color="#64748b" />
              ) : (
                <ChevronLeft size={18} color="#64748b" />
              )}
            </div>
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Tag color={roleInfo.color} style={{ margin: 0, fontSize: 13 }}>{roleInfo.label}</Tag>
            <Badge count={5} size="small">
              <Bell size={18} color="#64748b" style={{ cursor: 'pointer' }} />
            </Badge>
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'userInfo',
                    label: currentUser ? `${currentUser.displayName} (${currentUser.username})` : '',
                    disabled: true,
                  },
                  { type: 'divider' },
                  {
                    key: 'logout',
                    icon: <LogOut size={14} />,
                    label: '退出登录',
                    onClick: handleLogout,
                  },
                ],
              }}
              placement="bottomRight"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <Avatar size={32} style={{ backgroundColor: '#1a365d' }}>
                  <User size={16} color="#fff" />
                </Avatar>
                {currentUser && <span style={{ fontSize: 14, color: '#333' }}>{currentUser.displayName}</span>}
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: 24, minHeight: 280 }}>
          <div key={location.pathname} className="page-fade-in">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout
