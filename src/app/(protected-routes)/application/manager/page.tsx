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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Toaster } from '@/components/ui/toaster'
import axios from 'axios'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { User } from '@/interfaces/user'
import TraineeDetails from '@/components/manager/traineeDetails'
import { ScrollArea } from '@/components/ui/scroll-area'
import ShowTraineeExercises from '@/components/manager/showTraineeExercises'

export default function Manager() {
  const [trainee, setTrainee] = React.useState<User[]>([])
  const [traineeDetails, setTraineeDetails] = React.useState<User[]>([])

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
    `${process.env.NEXT_PUBLIC_API_URL}/users?refresh=${refreshKey}`,
    {
      fetcher,
      revalidateOnFocus: false,
    },
  )

  React.useEffect(() => {
    if (data) {
      setTrainee([...data])
    }
  }, [data])

  function handleRefresh() {
    setRefreshKey((prevKey) => prevKey + 1)
  }

  const dayOfWeek = [
    { id: 1, nome: 'Domingo' },
    { id: 2, nome: 'Segunda' },
    { id: 3, nome: 'Terça' },
    { id: 4, nome: 'Quarta' },
    { id: 5, nome: 'Quinta' },
    { id: 6, nome: 'Sexta' },
    { id: 7, nome: 'Sábado' },
  ]

  const columns: ColumnDef<User>[] = [
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
            Alunos
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div
          className="flex cursor-pointer items-center gap-4  space-x-2"
          onClick={() => setTraineeDetails([row.original])}
        >
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {row.getValue('name')}
        </div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const trainee = row.original

        return (
          <TraineeDetails
            name={trainee.name}
            email={trainee.email}
            className="flex justify-end"
            id={''}
            password={''}
            role={''}
            createdAt={trainee.createdAt || ''}
            updatedAt={''}
            exercise={[]}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TraineeDetails>
        )
      },
    },
  ]

  const table = useReactTable({
    data: trainee,
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
    <div className="flex max-h-[90vh] min-h-screen flex-col">
      <div className="mt-16 flex w-full gap-5 px-2 pb-28 md:px-8 md:pb-0">
        <div className="max-h-[90vh] w-full max-w-md overflow-y-auto">
          <div className="flex items-center py-4">
            <Toaster />
            <Input
              placeholder="Filtrar aluno..."
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
              className="w-full"
            />
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
        <div className="mt-4 h-[90vh] w-full">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dayOfWeek.map((dia) => {
              const exercisesForDay =
                traineeDetails[0]?.exercise?.filter(
                  (ex) => Number(ex.dayOfWeekId) === dia.id,
                ) || []

              const hasExercises = exercisesForDay.length > 0

              return (
                <ShowTraineeExercises
                  traineeId={traineeDetails[0]?.id || ''}
                  dayOfWeek={dia.nome}
                  id={String(dia.id)}
                  key={dia.id}
                >
                  <Card key={dia.id} className="h-full">
                    <CardHeader>
                      <CardTitle className="text-base">{dia.nome}</CardTitle>
                    </CardHeader>
                    <ScrollArea className={hasExercises ? 'h-[25vh]' : ''}>
                      <CardContent>
                        {hasExercises ? (
                          exercisesForDay.map((ex) => (
                            <div
                              key={ex.id}
                              className="mb-2 rounded bg-muted p-2"
                            >
                              <div className="font-semibold">
                                {ex.name || ex.exercisesLib?.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {ex.sets} séries x {ex.reps} repetições
                              </div>
                              <div className="text-xs">{ex.description}</div>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-muted-foreground">
                            Nenhum exercício
                          </div>
                        )}
                      </CardContent>
                    </ScrollArea>
                    <CardFooter className="flex justify-end"></CardFooter>
                  </Card>
                </ShowTraineeExercises>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
