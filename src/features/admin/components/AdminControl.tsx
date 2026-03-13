import { decodeJwt } from 'jose'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Forbidden } from '../../errors/components/403'
import { DashboardContent } from '../../../components/layouts/dashboard'
import { Typography } from '@mui/material'
import useAuth from '../../../hooks/useAuth'

export default function AdminControl() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const { user } = useAuth()
  
  useEffect(() => {
    if (user) setIsAdmin(user.is_superuser)
  }, [user])

  if (isAdmin === null) return <></>
  if (isAdmin === false) return <Forbidden />

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4">Buenas, hacker maestro 🧑‍💻</Typography>
    </DashboardContent>
  )
}
