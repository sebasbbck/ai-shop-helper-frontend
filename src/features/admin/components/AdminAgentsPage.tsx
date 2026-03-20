import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Forbidden } from '../../errors/components/403'
import { DashboardContent } from '../../../components/layouts/dashboard'
import {
  Box,
  Chip,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  CircularProgress,
  MenuList,
  MenuItem,
  IconButton,
  Button,
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
// import AddUser from "/components/Admin/AddUser"
import useAuth from '../../../hooks/useAuth'
import { AgentPublic, UserPublic } from '../../../../api/model'
import EditUser from './EditUser'
import { usePopover } from 'minimal-shared/hooks'
import { CustomPopover } from '../../../components/custom-popover'
import { Iconify } from '../../../components/iconify'
import DeleteUser from './DeleteUser'
import { useGetAgents } from '../../../../api/agents/agents'
import AddAgent from './AddAgent'
import DeleteAgent from './DeleteAgent'
import EditAgent from './EditAgent'

function AgentsTable() {
  const queryClient = useQueryClient()
  const { user: currentUser } = useAuth()
  const [selectedAgent, setSelectedAgent] = useState<AgentPublic | null>(null)
  const router = useRouter()

  const page = Number(router.query.page) || 1
  const [perPage, setPerPage] = useState(10)

  const { data, isLoading, isPlaceholderData } = useGetAgents(
    {
      offset: (page - 1) * perPage,
      limit: perPage,
    },
    {
      query: {
        enabled: router.isReady,
        placeholderData: (prevData) => prevData,
      },
    },
  )

  const setPage = (newPage: number) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, page: newPage },
      },
      undefined,
      { shallow: true }, // Prevents full page refresh
    )
  }

  const agents = data?.items ?? []
  const count = data?.total ?? 0
  const totalPages = Math.ceil(count / perPage)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent switching pages if the user is typing in an input or textarea
      const isTyping =
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement

      if (isTyping) return

      if (event.key === 'ArrowRight') {
        if (page < totalPages) {
          setPage(page + 1)
        }
      } else if (event.key === 'ArrowLeft') {
        if (page > 1) {
          setPage(page - 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // Cleanup the listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [page, totalPages, setPage])

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    // MUI TablePagination is 0-indexed, but our router state is 1-indexed
    setPage(newPage + 1)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPerPage(parseInt(event.target.value, 10))
    setPage(1)
  }

  const menuActions = usePopover()
  const renderMenuActions = (agent: AgentPublic) => {
    return (
      <CustomPopover
        open={menuActions.open}
        anchorEl={menuActions.anchorEl}
        onClose={menuActions.onClose}
        disablePortal
        slotProps={{
          paper: {
            onClick: (e: { stopPropagation: () => any }) => e.stopPropagation(),
          },
        }}
        disableEnforceFocus
        disableRestoreFocus
      >
        <MenuList>
          <Box style={{ marginBottom: '4px' }}>
            <EditAgent agent={agent} closeParent={menuActions.onClose} />
            <DeleteAgent agent={agent} closeParent={menuActions.onClose} />
          </Box>
        </MenuList>
      </CustomPopover>
    )
  }

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    agent: AgentPublic,
  ) => {
    setSelectedAgent(agent)
    menuActions.onOpen(event)
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      {agents.length === 0 ? (
        <Box mt={8} mb={4} width="100%" textAlign="center">
          <Typography variant="subtitle1" fontWeight="bold">
            No se encontraron agentes.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="medium">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'action.hover' }}>
                <TableCell width="30%">Nombre</TableCell>
                <TableCell width="45%">Descripción</TableCell>
                <TableCell width="15%">Última actualización</TableCell>
                <TableCell width="10%" align="right">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agents.map((agent: AgentPublic) => (
                <TableRow
                  key={agent.id}
                  sx={{ opacity: isPlaceholderData ? 0.5 : 1 }}
                >
                  <TableCell>{agent.name}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 200,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {agent.description}
                  </TableCell>
                  <TableCell>
                    {new Date(agent.updated_at).toLocaleString('es-ES', {
                      timeZone: 'Europe/Madrid',
                    })}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleOpenMenu(e, agent)}>
                      <Iconify icon="custom:menu-duotone" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={count}
            page={page - 1}
            onPageChange={handleChangePage}
            rowsPerPage={perPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 20, 50, 100]}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
            }
          />
        </TableContainer>
      )}

      {renderMenuActions(selectedAgent)}
    </>
  )
}

export default function AdminAgentsPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) setIsAdmin(user.is_superuser)
  }, [user])

  if (isAdmin === null) return <></>
  if (isAdmin === false) return <Forbidden />

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Gestión de agentes</Typography>
        <AddAgent />
      </Box>
      <AgentsTable />
    </DashboardContent>
  )
}
