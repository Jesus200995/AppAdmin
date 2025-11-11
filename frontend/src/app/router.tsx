import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../ui/AppLayout'
import LoginPage from '../features/auth/LoginPage'
import DashboardPage from '../ui/DashboardPage'
import MapaPage from '../features/mapa/MapaPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'mapa', element: <MapaPage /> },
    ],
  },
  { path: '/login', element: <LoginPage /> },
])
