"use client"

import { Iconify } from "../components/iconify"
import { Backdrop, Box, Typography, Modal, Button } from "@mui/material"
import { useEffect, useState } from "react"

type BackdropItem = {
  id: number
  title?: string
  description?: string
}

// Global Store Logic
const subscribers = new Set<(backdrops: BackdropItem[]) => void>()
let internalBackdrops: BackdropItem[] = []
let idCounter = 1

export const backdropper = {
  create: (t: Omit<BackdropItem, "id">) => {
    const id = idCounter++
    const backdrop: BackdropItem = { id, ...t }
    internalBackdrops = [...internalBackdrops, backdrop]
    subscribers.forEach((s) => s(internalBackdrops))
    return id
  },
  // Dismiss so the Modal actually removes the data when closed
  dismiss: (id?: number) => {
    if (typeof id === "number") {
      internalBackdrops = internalBackdrops.filter((t) => t.id !== id)
    } else {
      internalBackdrops = []
    }
    subscribers.forEach((s) => s(internalBackdrops))
  }
}

export function Backdropper() {
  const [backdrops, setBackdrops] = useState<BackdropItem[]>([])

  useEffect(() => {
    const sub = (ts: BackdropItem[]) => setBackdrops(ts)
    subscribers.add(sub)
    setBackdrops(internalBackdrops)
    return () => { subscribers.delete(sub) }
  }, [])

  return (
    <>
      {backdrops.map((b) => (
        <Modal
          key={b.id}
          open={true}
          onClose={() => backdropper.dismiss(b.id)}
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              sx: { backgroundColor: "rgba(0, 0, 0, 0.5)" } 
            }
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              minWidth: "400px",
              maxWidth: "700px",
              minHeight: "400px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              p: 4,
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              outline: 'none'
            }}
          >
            <Iconify icon="custom:verify-email" width={200}/>

            <Typography
              variant="h4"
              align="center"
              sx={{ my: 1.5, maxWidth: "420px", fontWeight: 'bold' }}
            >
              {b.title}
            </Typography>
            <Box sx={{ mb: "1em", textAlign: 'center' }}>
              {b.description}
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={() => backdropper.dismiss(b.id)} 
            >
              OK
            </Button>
          </Box>
        </Modal>
      ))}
    </>
  )
}

const useBackdrop = () => {
  const showSignupBackdrop = (title: string, description?: string) => {
    backdropper.create({ title, description })
  }

  return { showSignupBackdrop }
}

export default useBackdrop
