import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Forbidden } from '../../errors/components/403'
import { DashboardContent } from '../../../components/layouts/dashboard'
import {
  Box,
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
  IconButton,
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import useAuth from '../../../hooks/useAuth'
import { RolePublic } from '../../../../api/model'
import { useGetRoles } from '../../../../api/roles/roles' // Adjust path as needed
import { usePopover } from 'minimal-shared/hooks'
import { CustomPopover } from '../../../components/custom-popover'
import { Iconify } from '../../../components/iconify'
import AddRole from './AddRole'
import DeleteRole from './DeleteRole'
import EditRole from './EditRole'

// NOTE: You'll need to create these components later, similar to EditUser/DeleteUser
// import EditRole from './EditRole'
// import DeleteRole from './DeleteRole'

function RolesTable() {
  const [selectedRole, setSelectedRole] = useState<RolePublic | null>(null)
  const router = useRouter()
  const { user: authUser } = useAuth()

  const page = Number(router.query.page) || 1
  const [perPage, setPerPage] = useState(10)

  // 1. Use the Roles hook instead of Users
  const { data, isLoading, isPlaceholderData } = useGetRoles(
    {
      offset: (page - 1) * perPage,
      limit: perPage,
    },
    {
      query: {
        enabled: !!authUser,
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
      { shallow: true },
    )
  }

  const roles = data?.items ?? []
  const count = data?.total ?? 0
  const totalPages = Math.ceil(count / perPage)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isTyping =
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement

      if (isTyping) return

      if (event.key === 'ArrowRight' && page < totalPages) {
        setPage(page + 1)
      } else if (event.key === 'ArrowLeft' && page > 1) {
        setPage(page - 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [page, totalPages])

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage + 1)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPerPage(parseInt(event.target.value, 10))
    setPage(1)
  }

  const menuActions = usePopover()

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    role: RolePublic,
  ) => {
    setSelectedRole(role)
    menuActions.onOpen(event)
  }

  const renderMenuActions = (role: RolePublic | null) => {
    if (!role) return null
    return (
      <CustomPopover
        open={menuActions.open}
        anchorEl={menuActions.anchorEl}
        onClose={menuActions.onClose}
        disablePortal
        slotProps={{
          paper: { onClick: (e) => e.stopPropagation() },
        }}
      >
        <MenuList>
          <Box sx={{ p: 0.5 }}>
            <EditRole role={role} closeParent={menuActions.onClose} />
            <DeleteRole role={role} closeParent={menuActions.onClose} />
          </Box>
        </MenuList>
      </CustomPopover>
    )
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
      {roles.length === 0 ? (
        <Box mt={8} textAlign="center">
          <Typography variant="subtitle1">No se encontraron roles.</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="medium">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'action.hover' }}>
                <TableCell width="25%">Nombre del rol</TableCell>
                <TableCell width="50%">Descripción</TableCell>
                <TableCell width="15%">Nivel de acceso</TableCell>
                <TableCell width="10%" align="right">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role: RolePublic) => (
                <TableRow
                  key={role.id}
                  sx={{ opacity: isPlaceholderData ? 0.5 : 1 }}
                >
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description || 'Sin descripción'}</TableCell>
                  <TableCell>{role.access_level}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleOpenMenu(e, role)}>
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
          />
        </TableContainer>
      )}

      {renderMenuActions(selectedRole)}
    </>
  )
}

export default function AdminRolesPage() {
  const { user } = useAuth()
  const isAdmin = user?.is_superuser ?? false

  if (user && !isAdmin) return <Forbidden />
  if (!user) return null

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Gestión de roles</Typography>
        <AddRole />
      </Box>
      <RolesTable />
    </DashboardContent>
  )
}
