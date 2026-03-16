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
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
// import AddUser from "/components/Admin/AddUser"
import useAuth from '../../../hooks/useAuth'
import { UserPublic } from '../../../../api/model'
import { useGetUsers } from '../../../../api/users/users'
import EditUser from './EditUser'
import { usePopover } from 'minimal-shared/hooks'
import { CustomPopover } from '../../../components/custom-popover'
import { Iconify } from '../../../components/iconify'

function UsersTable() {
  const queryClient = useQueryClient()
  const { user: currentUser } = useAuth()
  const [selectedUser, setSelectedUser] = useState<UserPublic | null>(null)
  const router = useRouter()

  const page = Number(router.query.page) || 1
  const [perPage, setPerPage] = useState(10)

  const { data, isLoading, isPlaceholderData } = useGetUsers(
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

  const users = data?.items ?? []
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
  const renderMenuActions = (user: UserPublic) => {
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
            <EditUser user={user} closeParent={menuActions.onClose} />
          </Box>
        </MenuList>
      </CustomPopover>
    )
  }

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    user: UserPublic,
  ) => {
    setSelectedUser(user)
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
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
        {/* <AddUser /> */}
      </Box>

      {users.length === 0 ? (
        <Box mt={8} mb={4} width="100%" textAlign="center">
          <Typography variant="subtitle1" fontWeight="bold">
            No se encontraron usuarios.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="medium">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'action.hover' }}>
                <TableCell width="30%">Nombre</TableCell>
                <TableCell width="30%">Email</TableCell>
                <TableCell width="15%">Rol</TableCell>
                <TableCell width="15%">Estado</TableCell>
                <TableCell width="10%" align="right">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user: UserPublic) => (
                <TableRow
                  key={user.id}
                  sx={{ opacity: isPlaceholderData ? 0.5 : 1 }}
                >
                  <TableCell
                    sx={{ color: !user.name ? 'text.secondary' : 'inherit' }}
                  >
                    {user.name || 'N/A'}
                    {currentUser?.id === user.id && (
                      <Chip
                        label="Tú"
                        size="small"
                        color="primary"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 200,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {user.email}
                  </TableCell>
                  <TableCell>
                    {user.is_superuser ? 'Admin' : 'Usuario'}
                  </TableCell>
                  <TableCell>
                    {user.is_active ? 'Activo' : 'Inactivo'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleOpenMenu(e, user)}>
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

      {renderMenuActions(selectedUser)}
    </>
  )
}

export default function AdminUsersPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) setIsAdmin(user.is_superuser)
  }, [user])

  if (isAdmin === null) return <></>
  if (isAdmin === false) return <Forbidden />

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4">Gestión de usuarios</Typography>

      <UsersTable />
    </DashboardContent>
  )
}
