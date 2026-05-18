import { create } from 'zustand'

interface UserInfo {
  username: string
  role: string
  displayName: string
}

const ROLE_MAP: Record<string, UserInfo> = {
  admin: { username: 'admin', role: 'admin', displayName: '系统管理员' },
  pfm: { username: 'pfm', role: 'pfm', displayName: '绩效管理员' },
  pfl: { username: 'pfl', role: 'pfl', displayName: '绩效领导' },
}

const CREDENTIALS: Record<string, string> = {
  admin: 'admin123',
  pfm: 'pfm123',
  pfl: 'pfl123',
}

interface AppState {
  collapsed: boolean
  currentRole: string
  isAuthenticated: boolean
  currentUser: UserInfo | null
  chatMessages: Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: string
    actionCards?: Array<{
      type: string
      title: string
      description: string
      status?: string
    }>
  }>
  toggleCollapsed: () => void
  setCurrentRole: (role: string) => void
  addChatMessage: (msg: AppState['chatMessages'][0]) => void
  clearChat: () => void
  login: (username: string, password: string) => boolean
  logout: () => void
}

export const useAppStore = create<AppState>((set) => ({
  collapsed: false,
  currentRole: '集团领导',
  isAuthenticated: false,
  currentUser: null,
  chatMessages: [
    {
      id: '1',
      role: 'assistant',
      content: '张总，下午好！当前重点关注：3个红灯项目，2项临近节点。需要我为您汇报详情吗？',
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }
  ],
  toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),
  setCurrentRole: (role) => set({ currentRole: role }),
  addChatMessage: (msg) => set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
  clearChat: () => set({ chatMessages: [] }),
  login: (username, password) => {
    if (CREDENTIALS[username] && CREDENTIALS[username] === password) {
      const user = ROLE_MAP[username]
      set({ isAuthenticated: true, currentUser: user })
      return true
    }
    return false
  },
  logout: () => set({ isAuthenticated: false, currentUser: null }),
}))
