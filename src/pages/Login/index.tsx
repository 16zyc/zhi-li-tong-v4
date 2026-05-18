import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Shield } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

const ROLES_TIP = [
  { label: '系统管理员', account: 'admin / admin123' },
  { label: '绩效管理员', account: 'pfm / pfm123' },
  { label: '绩效领导', account: 'pfl / pfl123' },
]

export default function Login() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const login = useAppStore((s) => s.login)

  const onFinish = (values: { username: string; password: string }) => {
    setLoading(true)
    setTimeout(() => {
      const ok = login(values.username, values.password)
      if (ok) {
        message.success('登录成功')
        navigate('/')
      } else {
        message.error('用户名或密码错误')
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <div style={{
        width: '60%',
        background: 'linear-gradient(135deg, #0f172a 0%, #1a365d 50%, #1e3a5f 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 70%, rgba(212,168,83,0.08) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(96,165,250,0.06) 0%, transparent 50%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{
            width: 88,
            height: 88,
            margin: '0 auto 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(212,168,83,0.12)',
            borderRadius: 24,
            border: '1px solid rgba(212,168,83,0.2)',
          }}>
            <Shield size={48} color="#d4a853" strokeWidth={1.5} />
          </div>
          <h1 style={{
            fontSize: 36,
            fontWeight: 700,
            color: '#f1f5f9',
            margin: '0 0 8px',
            letterSpacing: 6,
          }}>
            集团·智理通
          </h1>
          <div style={{
            fontSize: 18,
            fontWeight: 400,
            color: '#d4a853',
            margin: '0 0 24px',
            letterSpacing: 8,
          }}>
            V4.0
          </div>
          <p style={{
            fontSize: 16,
            color: 'rgba(241,245,249,0.6)',
            margin: 0,
            letterSpacing: 6,
          }}>
            多智能体协同的效能军团
          </p>
        </div>
      </div>

      <div style={{
        width: '40%',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 64px',
      }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <h2 style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#1a365d',
            margin: '0 0 8px',
          }}>
            欢迎回来
          </h2>
          <p style={{
            fontSize: 15,
            color: '#94a3b8',
            margin: '0 0 40px',
          }}>
            请登录您的账号
          </p>

          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
                placeholder="请输入用户名"
                style={{ height: 48, borderRadius: 8 }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
                placeholder="请输入密码"
                style={{ height: 48, borderRadius: 8 }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: 32 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  height: 48,
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600,
                  background: '#1a365d',
                  border: 'none',
                  letterSpacing: 4,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#d4a853'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#1a365d'
                  e.currentTarget.style.color = undefined
                }}
              >
                登 录
              </Button>
            </Form.Item>
          </Form>

          <div style={{
            marginTop: 36,
            paddingTop: 24,
            borderTop: '1px solid #f1f5f9',
          }}>
            <div style={{
              fontSize: 13,
              color: '#94a3b8',
              marginBottom: 12,
            }}>
              快捷登录账号
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ROLES_TIP.map((r) => (
                <div key={r.label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: '#f8fafc',
                  borderRadius: 6,
                  fontSize: 13,
                }}>
                  <span style={{ color: '#1a365d', fontWeight: 500 }}>{r.label}</span>
                  <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>{r.account}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
