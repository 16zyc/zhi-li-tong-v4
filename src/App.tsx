import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { lazy, Suspense, useEffect, useState } from 'react'
import AppLayout from '@/components/Layout/AppLayout'
import { useAppStore } from '@/store/useAppStore'

const Login = lazy(() => import('@/pages/Login/index'))
const Home = lazy(() => import('@/pages/Home/index'))
const ZhiCe = lazy(() => import('@/pages/Dashboard/ZhiCe'))
const ZhiGuan = lazy(() => import('@/pages/Dashboard/ZhiGuan'))
const ZhiBan = lazy(() => import('@/pages/Dashboard/ZhiBan'))
const ZhiXun = lazy(() => import('@/pages/Dashboard/ZhiXun'))
const ZhiPing = lazy(() => import('@/pages/Dashboard/ZhiPing'))
const ZhiXun2 = lazy(() => import('@/pages/Dashboard/ZhiXun2'))
const SkillProfile = lazy(() => import('@/pages/Dashboard/SkillProfile'))
const Indicator = lazy(() => import('@/pages/Repository/Indicator'))
const Knowledge = lazy(() => import('@/pages/Repository/Knowledge'))
const Performance = lazy(() => import('@/pages/Repository/Performance'))
const Case = lazy(() => import('@/pages/Repository/Case'))
const Graph = lazy(() => import('@/pages/Repository/Graph'))
const WorkflowIndex = lazy(() => import('@/pages/Workflow/index'))
const StageDetail = lazy(() => import('@/pages/Workflow/StageDetail'))
const GoalSetting = lazy(() => import('@/pages/Workflow/GoalSetting'))
const ReportGeneration = lazy(() => import('@/pages/Workflow/ReportGeneration'))
const TaskDecompose = lazy(() => import('@/pages/Workflow/TaskDecompose'))
const Chat = lazy(() => import('@/pages/Chat/index'))
const SystemUsers = lazy(() => import('@/pages/System/Users'))
const SystemConfig = lazy(() => import('@/pages/System/Config'))
const SystemLogs = lazy(() => import('@/pages/System/Logs'))

function PageLoading() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 200)
    return () => clearTimeout(t)
  }, [])
  if (!show) return null
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '50vh', opacity: 0.6,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 32, height: 32, margin: '0 auto 12px',
          border: '3px solid #e2e8f0', borderTopColor: '#1a365d',
          borderRadius: '50%', animation: 'spin 0.8s linear infinite',
        }} />
        <div style={{ color: '#94a3b8', fontSize: 13 }}>加载中...</div>
      </div>
    </div>
  )
}

export default function App() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1a365d',
          borderRadius: 6,
          colorBgContainer: '#ffffff',
        },
        components: {
          Menu: {
            darkItemBg: 'transparent',
            darkSubMenuItemBg: 'transparent',
            darkItemSelectedBg: 'rgba(96, 165, 250, 0.15)',
            darkItemHoverBg: 'rgba(255, 255, 255, 0.06)',
          },
          Layout: {
            siderBg: '#1a365d',
          },
        },
      }}
    >
      <BrowserRouter basename="/zhi-li-tong-v4">
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
            <Route element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />}>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard/zhice" element={<ZhiCe />} />
              <Route path="/dashboard/zhiguan" element={<ZhiGuan />} />
              <Route path="/dashboard/zhiban" element={<ZhiBan />} />
              <Route path="/dashboard/zhixun" element={<ZhiXun />} />
              <Route path="/dashboard/zhiping" element={<ZhiPing />} />
              <Route path="/dashboard/zhixun2" element={<ZhiXun2 />} />
              <Route path="/dashboard/skill-profile" element={<SkillProfile />} />
              <Route path="/repository/indicator" element={<Indicator />} />
              <Route path="/repository/knowledge" element={<Knowledge />} />
              <Route path="/repository/performance" element={<Performance />} />
              <Route path="/repository/case" element={<Case />} />
              <Route path="/repository/graph" element={<Graph />} />
              <Route path="/workflow" element={<WorkflowIndex />} />
              <Route path="/workflow/goal" element={<GoalSetting />} />
              <Route path="/workflow/report" element={<ReportGeneration />} />
              <Route path="/workflow/task-decompose" element={<TaskDecompose />} />
              <Route path="/workflow/:stage" element={<StageDetail />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/system/users" element={<SystemUsers />} />
              <Route path="/system/config" element={<SystemConfig />} />
              <Route path="/system/logs" element={<SystemLogs />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ConfigProvider>
  )
}
