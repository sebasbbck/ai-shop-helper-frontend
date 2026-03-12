import { decodeJwt } from 'jose'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Forbidden } from '../../errors/components/403'
import { DashboardContent } from '../../../components/layouts/dashboard'
import { Typography } from '@mui/material'

export default function AdminControl() {
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const payload = decodeJwt(token) as any

    setIsAdmin(payload.is_superuser)
  }, [])

  if (!isAdmin) return <Forbidden />

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4">Buenas, hacker maestro 🧑‍💻</Typography>
    </DashboardContent>
  )
}
