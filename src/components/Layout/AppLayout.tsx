import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom'
import { Layout, Menu, Breadcrumb, Select, Avatar, Badge, Button, Dropdown } from 'antd'
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
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

const { Sider, Header, Content } = Layout

const roleOptions = [
  { value: '集团领导', label: '集团领导' },
  { value: '部门负责人', label: '部门负责人' },
  { value: '经办人', label: '经办人' },
  { value: '审计员', label: '审计员' },
]

const menuItems = [
  {
    key: '/',
    icon: <Home size={16} />,
    label: '总览首页',
  },
  {
    key: 'dashboard',
    icon: <Users size={16} />,
    label: '六员工作台',
    children: [
      { key: '/dashboard/zhice', icon: <Target size={14} />, label: '智策' },
      { key: '/dashboard/zhiguan', icon: <Settings size={14} />, label: '智管' },
      { key: '/dashboard/zhiban', icon: <ClipboardList size={14} />, label: '智办' },
      { key: '/dashboard/zhixun', icon: <Eye size={14} />, label: '智巡' },
      { key: '/dashboard/zhiping', icon: <Award size={14} />, label: '智评' },
      { key: '/dashboard/zhixun2', icon: <BookOpen size={14} />, label: '智训' },
      { key: '/dashboard/skill-profile', icon: <Star size={14} />, label: '能力画像' },
    ],
  },
  {
    key: 'repository',
    icon: <Database size={16} />,
    label: '四库一图',
    children: [
      { key: '/repository/indicator', icon: <BarChart3 size={14} />, label: '指标库' },
      { key: '/repository/knowledge', icon: <BookOpen size={14} />, label: '知识库' },
      { key: '/repository/performance', icon: <TrendingUp size={14} />, label: '绩效库' },
      { key: '/repository/case', icon: <FolderOpen size={14} />, label: '经验案例库' },
      { key: '/repository/graph', icon: <Share2 size={14} />, label: '知识图谱' },
    ],
  },
  {
    key: '/workflow',
    icon: <GitBranch size={16} />,
    label: '十大环节',
  },
  {
    key: '/chat',
    icon: <MessageSquare size={16} />,
    label: '对话即操作',
  },
]

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
  '/chat': '对话即操作',
}

const AppLayout = () => {
  const { collapsed, toggleCollapsed, currentRole, setCurrentRole, currentUser, logout } = useAppStore()
  const navigate = useNavigate()
  const location = useLocation()

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
            <Select
              value={currentRole}
              onChange={setCurrentRole}
              options={roleOptions}
              style={{ width: 130 }}
              size="small"
            />
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
              <Avatar
                size={32}
                style={{ backgroundColor: '#1a365d', cursor: 'pointer' }}
              >
                <User size={16} color="#fff" />
              </Avatar>
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
