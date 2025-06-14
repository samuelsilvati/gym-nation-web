'use client'

import * as React from 'react'
import UseSWR from 'swr'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  VisibilityState,
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
import { useSession } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import CreateExerciseLib from '@/components/exerciseLib/createExerciseLib'
import EditExerciseLib from '@/components/exerciseLib/editExerciseLib'
import { Toaster } from '@/components/ui/toaster'
import axios from 'axios'

type ExerciseProps = {
  id: string
  name: string
  description: string
  muscleGroupId: string | number
}

export default function ExercisesLibraryTable() {
  const [exercises, setExercises] = React.useState<ExerciseProps[]>([])

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const { data: session } = useSession()
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [refreshKey, setRefreshKey] = React.useState(0)

  const fetcher = (url: string) =>
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => res.data)

  const { data, isValidating } = UseSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/exercisesLib?refresh=${refreshKey}`,
    {
      fetcher,
      revalidateOnFocus: false,
    },
  )

  React.useEffect(() => {
    if (data) {
      setExercises([...data])
    }
  }, [data])

  function handleRefresh() {
    setRefreshKey((prevKey) => prevKey + 1)
  }

  const groups = [
    { id: 1, name: 'Peito' },
    { id: 2, name: 'Costas' },
    { id: 3, name: 'Pernas' },
    { id: 4, name: 'Ombros' },
    { id: 5, name: 'Biceps' },
    { id: 6, name: 'Triceps' },
    { id: 7, name: 'Abdominais' },
    { id: 8, name: 'Outros' },
  ]
  const groupColors = {
    1: 'bg-red-500', // Peito
    2: 'bg-blue-500', // Costas
    3: 'bg-green-500', // Pernas
    4: 'bg-yellow-500', // Ombros
    5: 'bg-purple-500', // Biceps
    6: 'bg-pink-500', // Triceps
    7: 'bg-orange-500', // Abdominais
    8: 'bg-gray-500', // Outros
  } as const

  const getGroupName = (groupId: number) => {
    const group = groups.find((group) => group.id === groupId)
    return group ? group.name : 'Grupo não encontrado'
  }

  const getGroupColor = (groupId: number) => {
    return groupColors[groupId as keyof typeof groupColors] || 'bg-slate-500'
  }

  const columns: ColumnDef<ExerciseProps>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Exercício
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'muscleGroupId',
      // header: 'Grupo Muscular',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Grupo Muscular
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div
          className={`w-[100px] rounded border px-4 text-center text-xs font-semibold text-white ${getGroupColor(
            Number(row.getValue('muscleGroupId')),
          )}`}
        >
          {getGroupName(Number(row.getValue('muscleGroupId')))}
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Descrição',
      cell: ({ row }) => <div>{row.getValue('description')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const exercise = row.original

        return (
          <EditExerciseLib
            id={exercise.id}
            name={exercise.name}
            description={exercise.description}
            muscleGroupId={exercise.muscleGroupId}
            onSuccess={handleRefresh}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Editar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </EditExerciseLib>
        )
      },
    },
  ]

  const table = useReactTable({
    data: exercises,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="flex min-h-screen">
      <div className="container mt-16 max-w-7xl px-2 pb-28 md:px-8 md:pb-0">
        <div className="w-full">
          <div className="flex items-center py-4">
            <Toaster />
            <Input
              placeholder="Filtrar exercícios..."
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <div className="ml-3">
              <CreateExerciseLib onSuccess={handleRefresh} />
            </div>
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
                {isValidating || !data ? (
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
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} de{' '}
              {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
            </div>
            <div className="space-x-2"></div>
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
