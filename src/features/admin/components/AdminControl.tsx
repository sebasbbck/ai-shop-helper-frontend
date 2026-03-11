import { decodeJwt } from 'jose'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function AdminControl() {
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const payload = decodeJwt(token) as any

    if (!payload.is_superuser) {
      router.replace('/') // TODO: render 403 Forbidden page
    } else {
      setIsAdmin(true)
    }
  }, [])

  if (!isAdmin) return null // Or a loading spinner
  return <h2>Buenas, hacker maestro 🧑‍💻</h2>
}
