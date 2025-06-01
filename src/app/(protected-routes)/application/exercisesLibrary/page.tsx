'use client'

import * as React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/lib/api'
import { useSession } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

type ExerciseProps = {
  id: string
  name: string
  description: string
  muscleGroupId: number
}

const groups = [
  { id: 1, name: 'Peito' },
  { id: 2, name: 'Costas' },
  { id: 3, name: 'Pernas' },
  { id: 4, name: 'Ombros' },
  { id: 5, name: 'Biceps' },
  { id: 6, name: 'Triceps' },
  { id: 7, name: 'Abdominais' },
  { id: 9, name: 'Outros' },
]

const getGroupName = (groupId: number) => {
  const group = groups.find((group) => group.id === groupId)
  return group ? group.name : 'Grupo não encontrado'
}

const columns: ColumnDef<ExerciseProps>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'description',
    header: 'Descrição',
    cell: ({ row }) => <div>{row.getValue('description')}</div>,
  },
  {
    accessorKey: 'muscleGroupId',
    header: 'Grupo Muscular',
    cell: ({ row }) => (
      <div>{getGroupName(Number(row.getValue('muscleGroupId')))}</div>
    ),
  },
]

export default function ExercisesLibraryTable() {
  const [exercises, setExercises] = React.useState<ExerciseProps[]>([])
  const [loading, setLoading] = React.useState(true)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')
  const { data: session } = useSession()

  React.useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true)
      // getServerSession is only available on the server, so you need to handle auth differently on the client.
      // If you need the token, consider passing it as a prop or using a client-side auth solution.
      // For now, we'll assume the API is accessible without the session token.
      try {
        const response = await api.get('/exercisesLib', {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        })
        setExercises(response.data)
      } catch (error) {
        setExercises([])
      } finally {
        setLoading(false)
      }
    }
    fetchExercises()
  }, [])

  const table = useReactTable({
    data: exercises,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      // Filtro simples por nome ou descrição
      const value = row.getValue(columnId)
      return String(value).toLowerCase().includes(filterValue.toLowerCase())
    },
  })

  return (
    <div className="flex min-h-screen">
      <div className="container mt-16 max-w-4xl px-2 pb-28 md:px-8 md:pb-0">
        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filtrar exercícios..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Nenhum resultado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Próxima
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
