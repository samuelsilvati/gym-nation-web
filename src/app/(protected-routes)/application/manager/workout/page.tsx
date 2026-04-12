'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Combobox } from '@/components/ui/combobox'
import { Card } from '@/components/ui/card'
import { api } from '@/lib/api'
import { useSession } from 'next-auth/react'
import { Loader2, Plus, Eye, Edit, Trash2 } from 'lucide-react'
import { ApiToken } from '@/interfaces/apiToken'
import decode from 'jwt-decode'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// Schema de validação
const workoutExerciseSchema = z.object({
  exerciseLibId: z.string().min(1, 'Exercício é obrigatório'),
  sets: z.number().min(1, 'Mínimo 1 série'),
  reps: z.string().min(1, 'Repetições são obrigatórias'),
  weight: z.number().optional(),
  restSeconds: z.number().optional(),
  notes: z.string().optional(),
  progressionType: z.string().optional(),
  progressionValue: z.number().optional(),
})

const workoutDaySchema = z.object({
  dayOfWeek: z.string().min(1, 'Dia da semana é obrigatório'),
  name: z.string().optional(),
  description: z.string().optional(),
  workoutExercises: z
    .array(workoutExerciseSchema)
    .min(1, 'Adicione pelo menos um exercício'),
})

const workoutFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  totalWeeks: z.number().min(1, 'Mínimo 1 semana').max(52, 'Máximo 52 semanas'),
  sessionsPerWeek: z
    .number()
    .min(1, 'Mínimo 1 sessão')
    .max(7, 'Máximo 7 sessões'),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  workoutType: z.enum(['STRENGTH', 'HYPERTROPHY', 'ENDURANCE']),
  workoutDays: z
    .array(workoutDaySchema)
    .min(1, 'Adicione pelo menos um dia de treino'),
})

type WorkoutFormData = z.infer<typeof workoutFormSchema>

export interface WorkoutExercise {
  id?: string
  workoutDayId: string
  exerciseLibId: string
  sets: number
  reps: string
  weight?: number
  restSeconds?: number
  notes?: string
  orderIndex: number
  progressionType?: string
  progressionValue?: number
  createdAt?: string
  updatedAt?: string | null
}

export interface WorkoutDay {
  id?: string
  workoutId: string
  dayOfWeek: string // Ex: 'Segunda', 'Terça', etc.
  name?: string
  description?: string
  orderIndex?: number
  workoutExercises: WorkoutExercise[]
  createdAt?: string
  updatedAt?: string | null
}

interface Workout {
  id?: string
  name: string
  description?: string
  isTemplate?: boolean
  isActive?: boolean
  createdById: string
  totalWeeks?: number
  sessionsPerWeek?: number
  difficulty?: string
  workoutType?: string
  workoutDays: WorkoutDay[]
  createdAt?: string
  updatedAt?: string | null
}

export default function WorkoutManager() {
  const { data: session } = useSession()
  const apiToken = session?.user.token
  console.log('API Token:', apiToken)
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [libraryExercises, setLibraryExercises] = useState<
    Array<{ id: string; name: string }>
  >([])
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('0')
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)
  const [viewMode, setViewMode] = useState<'create' | 'view' | 'edit'>('create')
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [exercisesOpen, setExercisesOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<{
    dayOfWeek: string
    name?: string
    description?: string
    workoutExercises?: Array<{
      exerciseLibId: string
      sets: number
      reps: string
      weight?: number
      restSeconds?: number
      notes?: string
    }>
  } | null>(null)

  // Decodificar token apenas quando disponível
  const decryptedToken: ApiToken | null = apiToken ? decode(apiToken) : null

  // Configuração do React Hook Form
  const form = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      name: '',
      description: '',
      totalWeeks: 4,
      sessionsPerWeek: 3,
      difficulty: 'BEGINNER',
      workoutType: 'STRENGTH',
      workoutDays: [],
    },
  })

  const {
    fields: workoutDaysFields,
    append: appendWorkoutDay,
    remove: removeWorkoutDay,
  } = useFieldArray({
    control: form.control,
    name: 'workoutDays',
  })

  useEffect(() => {
    if (!apiToken) return

    setLoading(true)
    api
      .get('/workouts', {
        headers: { Authorization: `Bearer ${apiToken}` },
      })
      .then((res) => {
        setWorkouts(res.data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [apiToken])

  useEffect(() => {
    if (!apiToken) return

    api
      .get('/exercisesLib', {
        headers: { Authorization: `Bearer ${apiToken}` },
      })
      .then((res) => setLibraryExercises(res.data))
      .catch(() => {
        // Handle error silently or show notification
      })
  }, [apiToken])

  function addDay() {
    const newIndex = workoutDaysFields.length
    appendWorkoutDay({
      dayOfWeek: '',
      name: '',
      description: '',
      workoutExercises: [],
    })
    // Automaticamente muda para a nova aba criada
    setActiveTab(newIndex.toString())
  }

  function nextStep() {
    // Validar apenas os campos do primeiro passo
    const basicFields = [
      'name',
      'description',
      'totalWeeks',
      'sessionsPerWeek',
      'difficulty',
      'workoutType',
    ] as const
    form.trigger(basicFields).then((isValid) => {
      if (isValid) {
        setCurrentStep(2)
      }
    })
  }

  function prevStep() {
    setCurrentStep(1)
  }

  function resetForm() {
    form.reset()
    setCurrentStep(1)
    setActiveTab('0')
    setSelectedWorkout(null)
    setViewMode('create')
  }

  function handleModalClose(isOpen: boolean) {
    setOpen(isOpen)
    if (!isOpen) {
      resetForm()
    }
  }

  function handleDetailsClose(isOpen: boolean) {
    setDetailsOpen(isOpen)
    if (!isOpen) {
      setSelectedWorkout(null)
      setViewMode('create')
    }
  }

  function openExercisesDialog(day: {
    dayOfWeek: string
    name?: string
    description?: string
    workoutExercises?: Array<{
      exerciseLibId: string
      sets: number
      reps: string
      weight?: number
      restSeconds?: number
      notes?: string
    }>
  }) {
    setSelectedDay(day)
    setExercisesOpen(true)
  }

  function openWorkoutDetails(workout: Workout) {
    setSelectedWorkout(workout)
    setViewMode('view')
    setDetailsOpen(true)
  }

  function editWorkout(workout: Workout) {
    setSelectedWorkout(workout)
    setViewMode('edit')

    // Preencher o formulário com os dados do treino
    form.reset({
      name: workout.name,
      description: workout.description || '',
      totalWeeks: workout.totalWeeks || 4,
      sessionsPerWeek: workout.sessionsPerWeek || 3,
      difficulty:
        (workout.difficulty as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED') ||
        'BEGINNER',
      workoutType:
        (workout.workoutType as 'STRENGTH' | 'HYPERTROPHY' | 'ENDURANCE') ||
        'STRENGTH',
      workoutDays: workout.workoutDays || [],
    })

    setCurrentStep(1)
    setActiveTab('0')
    setDetailsOpen(false)
    setOpen(true)
  }

  async function deleteWorkout(workoutId: string) {
    if (!confirm('Tem certeza que deseja excluir este treino?')) {
      return
    }

    try {
      await api.delete(`/workouts/${workoutId}`, {
        headers: { Authorization: `Bearer ${session?.user.token}` },
      })

      // Refetch workouts
      setLoading(true)
      const res = await api.get('/workouts', {
        headers: { Authorization: `Bearer ${session?.user.token}` },
      })
      setWorkouts(res.data)
      setLoading(false)
    } catch (err) {
      alert('Erro ao excluir treino')
    }
  }

  function addExercise(dayIndex: number) {
    const currentDay = form.getValues(`workoutDays.${dayIndex}`)
    const newExercises = [
      ...currentDay.workoutExercises,
      {
        exerciseLibId: '',
        sets: 3,
        reps: '',
        weight: undefined,
        restSeconds: undefined,
        notes: '',
        progressionType: '',
        progressionValue: undefined,
      },
    ]
    form.setValue(`workoutDays.${dayIndex}.workoutExercises`, newExercises)
  }

  function removeExercise(dayIndex: number, exerciseIndex: number) {
    const currentDay = form.getValues(`workoutDays.${dayIndex}`)
    const newExercises = currentDay.workoutExercises.filter(
      (_, index) => index !== exerciseIndex,
    )
    form.setValue(`workoutDays.${dayIndex}.workoutExercises`, newExercises)
  }

  async function onSubmit(data: WorkoutFormData) {
    if (!decryptedToken) {
      alert('Token não encontrado. Faça login novamente.')
      return
    }

    setSaving(true)
    try {
      if (viewMode === 'edit' && selectedWorkout) {
        // Atualizar treino existente
        await api.put(
          `/workouts/${selectedWorkout.id}`,
          {
            ...data,
            isTemplate: selectedWorkout.isTemplate || false,
            isActive: selectedWorkout.isActive !== false,
            createdById: decryptedToken.sub,
          },
          {
            headers: { Authorization: `Bearer ${session?.user.token}` },
          },
        )
      } else {
        // Criar novo treino
        await api.post(
          '/workouts',
          {
            ...data,
            isTemplate: false,
            isActive: true,
            createdById: decryptedToken.sub,
          },
          {
            headers: { Authorization: `Bearer ${session?.user.token}` },
          },
        )
      }

      setOpen(false)
      resetForm()
      setSaving(false)
      // Refetch
      setLoading(true)
      const res = await api.get('/workouts', {
        headers: { Authorization: `Bearer ${session?.user.token}` },
      })
      setWorkouts(res.data)
      setLoading(false)
    } catch (err) {
      setSaving(false)
      alert(
        viewMode === 'edit'
          ? 'Erro ao atualizar treino'
          : 'Erro ao criar treino',
      )
    }
  }

  return (
    <div className="mb-28 flex min-h-screen md:mb-0">
      <div className="container mt-16 max-w-4xl px-2 pb-28 md:px-8 md:pb-0">
        {!session?.user?.token ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Carregando sessão...</span>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gerenciador de Treinos</h1>
              <Dialog
                open={open}
                onOpenChange={(isOpen) => {
                  handleModalClose(isOpen)
                }}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" /> Novo treino
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="flex max-h-[95vh] max-w-7xl flex-col overflow-hidden"
                  onInteractOutside={(e) => {
                    // Permitir interação com popovers
                    const target = e.target as Element
                    if (target.closest('[data-radix-popper-content-wrapper]')) {
                      e.preventDefault()
                      return
                    }
                    e.preventDefault()
                  }}
                >
                  <DialogHeader>
                    <DialogTitle>
                      {viewMode === 'edit'
                        ? 'Editar treino'
                        : 'Criar novo treino'}
                    </DialogTitle>
                    {/* Indicador de progresso */}
                    <div className="flex items-center justify-center space-x-4 pt-4">
                      <div className="flex items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                            currentStep === 1
                              ? 'border-primary bg-primary text-primary-foreground'
                              : currentStep > 1
                              ? 'border-green-500 bg-green-500 text-white'
                              : 'border-gray-300 bg-white text-gray-500'
                          }`}
                        >
                          1
                        </div>
                        <span className="ml-2 text-sm font-medium">
                          Informações básicas
                        </span>
                      </div>
                      <div className="h-px w-16 bg-gray-300"></div>
                      <div className="flex items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                            currentStep === 2
                              ? 'border-primary bg-primary text-primary-foreground'
                              : currentStep > 2
                              ? 'border-green-500 bg-green-500 text-white'
                              : 'border-gray-300 bg-white text-gray-500'
                          }`}
                        >
                          2
                        </div>
                        <span className="ml-2 text-sm font-medium">
                          Dias e exercícios
                        </span>
                      </div>
                    </div>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto pr-2">
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                      >
                        {currentStep === 1 && (
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nome do treino</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Nome do treino"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Descrição</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Descrição"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="flex gap-2">
                              <FormField
                                control={form.control}
                                name="totalWeeks"
                                render={({ field }) => (
                                  <FormItem className="w-1/2">
                                    <FormLabel>Semanas</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        min={1}
                                        max={52}
                                        placeholder="Semanas"
                                        {...field}
                                        onChange={(e) =>
                                          field.onChange(Number(e.target.value))
                                        }
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="sessionsPerWeek"
                                render={({ field }) => (
                                  <FormItem className="w-1/2">
                                    <FormLabel>Sessões/semana</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        min={1}
                                        max={7}
                                        placeholder="Sessões/semana"
                                        {...field}
                                        onChange={(e) =>
                                          field.onChange(Number(e.target.value))
                                        }
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="flex gap-2">
                              <FormField
                                control={form.control}
                                name="difficulty"
                                render={({ field }) => (
                                  <FormItem className="w-1/2">
                                    <FormLabel>Dificuldade</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Dificuldade" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="BEGINNER">
                                          Iniciante
                                        </SelectItem>
                                        <SelectItem value="INTERMEDIATE">
                                          Intermediário
                                        </SelectItem>
                                        <SelectItem value="ADVANCED">
                                          Avançado
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="workoutType"
                                render={({ field }) => (
                                  <FormItem className="w-1/2">
                                    <FormLabel>Tipo</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Tipo" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="STRENGTH">
                                          Força
                                        </SelectItem>
                                        <SelectItem value="HYPERTROPHY">
                                          Hipertrofia
                                        </SelectItem>
                                        <SelectItem value="ENDURANCE">
                                          Resistência
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        )}

                        {currentStep === 2 && (
                          <div>
                            <div className="mb-4 flex items-center justify-between">
                              <span className="font-semibold">
                                Dias do treino
                              </span>
                              <Button type="button" size="sm" onClick={addDay}>
                                <Plus className="h-4 w-4" /> Adicionar dia
                              </Button>
                            </div>

                            {workoutDaysFields.length === 0 ? (
                              <div className="py-8 text-center text-gray-500">
                                Nenhum dia de treino adicionado ainda. Clique em
                                &quot;Adicionar dia&quot; para começar.
                              </div>
                            ) : (
                              <Tabs
                                value={activeTab}
                                onValueChange={setActiveTab}
                                className="w-full"
                              >
                                <TabsList className="flex w-full gap-3 overflow-x-auto">
                                  {workoutDaysFields.map((day, dayIdx) => {
                                    const dayName = form.watch(
                                      `workoutDays.${dayIdx}.dayOfWeek`,
                                    )
                                    const dayLabel = form.watch(
                                      `workoutDays.${dayIdx}.name`,
                                    )
                                    const displayName = dayName
                                      ? [
                                          'Domingo',
                                          'Segunda',
                                          'Terça',
                                          'Quarta',
                                          'Quinta',
                                          'Sexta',
                                          'Sábado',
                                        ][Number(dayName) - 1] ||
                                        `Dia ${dayIdx + 1}`
                                      : `Dia ${dayIdx + 1}`

                                    return (
                                      <TabsTrigger
                                        key={day.id}
                                        value={dayIdx.toString()}
                                        className="relative flex items-center gap-2"
                                      >
                                        {displayName}
                                        {dayLabel && (
                                          <span className="text-xs text-muted-foreground">
                                            ({dayLabel})
                                          </span>
                                        )}
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="ml-2 h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            removeWorkoutDay(dayIdx)
                                            // Ajustar aba ativa se necessário
                                            if (
                                              dayIdx.toString() === activeTab
                                            ) {
                                              setActiveTab(
                                                Math.max(
                                                  0,
                                                  dayIdx - 1,
                                                ).toString(),
                                              )
                                            }
                                          }}
                                        >
                                          <Plus className="h-3 w-3 rotate-45" />
                                        </Button>
                                      </TabsTrigger>
                                    )
                                  })}
                                </TabsList>

                                {workoutDaysFields.map((day, dayIdx) => (
                                  <TabsContent
                                    key={day.id}
                                    value={dayIdx.toString()}
                                  >
                                    <Card className="p-4">
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                          <FormField
                                            control={form.control}
                                            name={`workoutDays.${dayIdx}.dayOfWeek`}
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>
                                                  Dia da semana
                                                </FormLabel>
                                                <Select
                                                  onValueChange={field.onChange}
                                                  defaultValue={field.value}
                                                >
                                                  <FormControl>
                                                    <SelectTrigger>
                                                      <SelectValue placeholder="Selecione o dia" />
                                                    </SelectTrigger>
                                                  </FormControl>
                                                  <SelectContent>
                                                    {[
                                                      '1',
                                                      '2',
                                                      '3',
                                                      '4',
                                                      '5',
                                                      '6',
                                                      '7',
                                                    ].map((v) => (
                                                      <SelectItem
                                                        key={v}
                                                        value={v}
                                                      >
                                                        {
                                                          [
                                                            'Domingo',
                                                            'Segunda',
                                                            'Terça',
                                                            'Quarta',
                                                            'Quinta',
                                                            'Sexta',
                                                            'Sábado',
                                                          ][Number(v) - 1]
                                                        }
                                                      </SelectItem>
                                                    ))}
                                                  </SelectContent>
                                                </Select>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />

                                          <FormField
                                            control={form.control}
                                            name={`workoutDays.${dayIdx}.name`}
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>
                                                  Nome do dia
                                                </FormLabel>
                                                <FormControl>
                                                  <Input
                                                    placeholder="Ex: Peito e Tríceps"
                                                    {...field}
                                                  />
                                                </FormControl>
                                              </FormItem>
                                            )}
                                          />

                                          <FormField
                                            control={form.control}
                                            name={`workoutDays.${dayIdx}.description`}
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>Descrição</FormLabel>
                                                <FormControl>
                                                  <Input
                                                    placeholder="Descrição opcional"
                                                    {...field}
                                                  />
                                                </FormControl>
                                              </FormItem>
                                            )}
                                          />
                                        </div>

                                        <div>
                                          <div className="mb-4 flex items-center justify-between">
                                            <h4 className="text-sm font-medium">
                                              Exercícios
                                            </h4>
                                            <Button
                                              type="button"
                                              size="sm"
                                              onClick={() =>
                                                addExercise(dayIdx)
                                              }
                                            >
                                              <Plus className="h-4 w-4" />{' '}
                                              Adicionar exercício
                                            </Button>
                                          </div>

                                          <div className="space-y-3">
                                            {form
                                              .watch(
                                                `workoutDays.${dayIdx}.workoutExercises`,
                                              )
                                              ?.map((_, exIdx) => (
                                                <Card
                                                  key={exIdx}
                                                  className="bg-gray-100 p-3 dark:bg-gray-800"
                                                >
                                                  <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                                                    <div className="md:col-span-2 lg:col-span-1 xl:col-span-2">
                                                      <FormField
                                                        control={form.control}
                                                        name={`workoutDays.${dayIdx}.workoutExercises.${exIdx}.exerciseLibId`}
                                                        render={({ field }) => (
                                                          <FormItem>
                                                            <FormLabel className="text-xs">
                                                              Exercício
                                                            </FormLabel>
                                                            <FormControl>
                                                              <Combobox
                                                                value={
                                                                  field.value
                                                                }
                                                                onValueChange={
                                                                  field.onChange
                                                                }
                                                                options={libraryExercises.map(
                                                                  (lib) => ({
                                                                    value:
                                                                      lib.id,
                                                                    label:
                                                                      lib.name,
                                                                  }),
                                                                )}
                                                                placeholder="Selecione o exercício"
                                                                searchPlaceholder="Buscar exercício..."
                                                                emptyText="Nenhum exercício encontrado."
                                                              />
                                                            </FormControl>
                                                            <FormMessage />
                                                          </FormItem>
                                                        )}
                                                      />
                                                    </div>

                                                    <FormField
                                                      control={form.control}
                                                      name={`workoutDays.${dayIdx}.workoutExercises.${exIdx}.sets`}
                                                      render={({ field }) => (
                                                        <FormItem>
                                                          <FormLabel className="text-xs">
                                                            Séries
                                                          </FormLabel>
                                                          <FormControl>
                                                            <Input
                                                              type="number"
                                                              className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                              min={1}
                                                              placeholder="3"
                                                              {...field}
                                                              onChange={(e) =>
                                                                field.onChange(
                                                                  Number(
                                                                    e.target
                                                                      .value,
                                                                  ),
                                                                )
                                                              }
                                                            />
                                                          </FormControl>
                                                        </FormItem>
                                                      )}
                                                    />

                                                    <FormField
                                                      control={form.control}
                                                      name={`workoutDays.${dayIdx}.workoutExercises.${exIdx}.reps`}
                                                      render={({ field }) => (
                                                        <FormItem>
                                                          <FormLabel className="text-xs">
                                                            Repetições
                                                          </FormLabel>
                                                          <FormControl>
                                                            <Input
                                                              placeholder="12"
                                                              {...field}
                                                            />
                                                          </FormControl>
                                                        </FormItem>
                                                      )}
                                                    />

                                                    <FormField
                                                      control={form.control}
                                                      name={`workoutDays.${dayIdx}.workoutExercises.${exIdx}.weight`}
                                                      render={({ field }) => (
                                                        <FormItem>
                                                          <FormLabel className="text-xs">
                                                            Peso (kg)
                                                          </FormLabel>
                                                          <FormControl>
                                                            <Input
                                                              type="number"
                                                              className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                              placeholder="20"
                                                              {...field}
                                                              value={
                                                                field.value ??
                                                                ''
                                                              }
                                                              onChange={(e) =>
                                                                field.onChange(
                                                                  e.target.value
                                                                    ? Number(
                                                                        e.target
                                                                          .value,
                                                                      )
                                                                    : undefined,
                                                                )
                                                              }
                                                            />
                                                          </FormControl>
                                                        </FormItem>
                                                      )}
                                                    />

                                                    <FormField
                                                      control={form.control}
                                                      name={`workoutDays.${dayIdx}.workoutExercises.${exIdx}.restSeconds`}
                                                      render={({ field }) => (
                                                        <FormItem>
                                                          <FormLabel className="text-xs">
                                                            Descanso (s)
                                                          </FormLabel>
                                                          <FormControl>
                                                            <Input
                                                              type="number"
                                                              className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                              placeholder="60"
                                                              {...field}
                                                              value={
                                                                field.value ??
                                                                ''
                                                              }
                                                              onChange={(e) =>
                                                                field.onChange(
                                                                  e.target.value
                                                                    ? Number(
                                                                        e.target
                                                                          .value,
                                                                      )
                                                                    : undefined,
                                                                )
                                                              }
                                                            />
                                                          </FormControl>
                                                        </FormItem>
                                                      )}
                                                    />

                                                    <div className="col-span-6 flex items-end gap-2">
                                                      <FormField
                                                        control={form.control}
                                                        name={`workoutDays.${dayIdx}.workoutExercises.${exIdx}.notes`}
                                                        render={({ field }) => (
                                                          <FormItem className="flex-1">
                                                            <FormLabel className="text-xs">
                                                              Observações
                                                            </FormLabel>
                                                            <FormControl>
                                                              <Input
                                                                placeholder="Observações"
                                                                {...field}
                                                              />
                                                            </FormControl>
                                                          </FormItem>
                                                        )}
                                                      />

                                                      <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-10 w-10 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                                        onClick={() =>
                                                          removeExercise(
                                                            dayIdx,
                                                            exIdx,
                                                          )
                                                        }
                                                      >
                                                        <Plus className="h-4 w-4 rotate-45" />
                                                      </Button>
                                                    </div>
                                                  </div>
                                                </Card>
                                              ))}

                                            {(!form.watch(
                                              `workoutDays.${dayIdx}.workoutExercises`,
                                            ) ||
                                              form.watch(
                                                `workoutDays.${dayIdx}.workoutExercises`,
                                              ).length === 0) && (
                                              <div className="rounded-lg border-2 border-dashed border-gray-200 py-6 text-center text-gray-500">
                                                Nenhum exercício adicionado
                                                ainda. Clique em &quot;Adicionar
                                                exercício&quot; para começar.
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </Card>
                                  </TabsContent>
                                ))}
                              </Tabs>
                            )}
                          </div>
                        )}

                        <DialogFooter>
                          {currentStep === 1 ? (
                            <Button type="button" onClick={nextStep}>
                              Próximo
                            </Button>
                          ) : (
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                              >
                                Voltar
                              </Button>
                              <Button type="submit" disabled={saving}>
                                {saving ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : viewMode === 'edit' ? (
                                  'Atualizar treino'
                                ) : (
                                  'Criar treino'
                                )}
                              </Button>
                            </div>
                          )}
                        </DialogFooter>
                      </form>
                    </Form>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-4">
                {workouts.length === 0 && (
                  <div className="text-center text-gray-500">
                    Nenhum treino cadastrado ainda.
                  </div>
                )}
                {workouts.map((workout) => (
                  <Card
                    key={workout.id}
                    className="cursor-pointer p-4 transition-shadow hover:shadow-md"
                    onClick={() => openWorkoutDetails(workout)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-lg font-bold">{workout.name}</div>
                        <div className="text-sm text-gray-500">
                          {workout.description}
                        </div>
                      </div>
                      <div className="ml-4 flex items-center gap-2">
                        <div className="mr-2 text-xs text-gray-400">
                          {workout.totalWeeks} semanas •{' '}
                          {workout.sessionsPerWeek}
                          x/semana
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            openWorkoutDetails(workout)
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            editWorkout(workout)
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (workout.id) {
                              deleteWorkout(workout.id)
                            }
                          }}
                          className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">
                        {workout.difficulty === 'BEGINNER'
                          ? 'Iniciante'
                          : workout.difficulty === 'INTERMEDIATE'
                          ? 'Intermediário'
                          : 'Avançado'}
                      </span>
                      <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">
                        {workout.workoutType === 'STRENGTH'
                          ? 'Força'
                          : workout.workoutType === 'HYPERTROPHY'
                          ? 'Hipertrofia'
                          : 'Resistência'}
                      </span>
                      {workout.isActive && (
                        <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                          Ativo
                        </span>
                      )}
                    </div>
                    <div className="mt-4">
                      <div className="mb-1 text-sm font-semibold">
                        Dias do treino:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {workout.workoutDays &&
                        workout.workoutDays.length > 0 ? (
                          workout.workoutDays.map((day) => (
                            <div
                              key={day.id || day.dayOfWeek}
                              className="rounded border bg-slate-50 px-3 py-1 text-xs text-slate-700"
                            >
                              <span className="">
                                {[
                                  'Domingo',
                                  'Segunda',
                                  'Terça',
                                  'Quarta',
                                  'Quinta',
                                  'Sexta',
                                  'Sábado',
                                ][Number(day.dayOfWeek) - 1] || day.dayOfWeek}
                              </span>
                              {day.name && (
                                <span className="ml-2">{day.name}</span>
                              )}
                              <span className="ml-2 text-gray-500">
                                {day.description}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">
                            Nenhum dia cadastrado
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Modal de detalhes do treino */}
        <Dialog open={detailsOpen} onOpenChange={handleDetailsClose}>
          <DialogContent className="max-h-[95vh] max-w-4xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Treino</DialogTitle>
            </DialogHeader>

            {selectedWorkout && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedWorkout.name}
                  </h3>
                  <p className="text-gray-600">{selectedWorkout.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <Card className="rounded-md border bg-gray-50 px-3 py-2 dark:bg-gray-600">
                    <div className="text-sm text-gray-500">Duração</div>
                    <div className="font-semibold">
                      {selectedWorkout.totalWeeks} semanas
                    </div>
                  </Card>
                  <Card className="rounded-md border bg-gray-50 px-3 py-2 dark:bg-gray-600">
                    <div className="text-sm text-gray-500">Frequência</div>
                    <div className="font-semibold">
                      {selectedWorkout.sessionsPerWeek}x/semana
                    </div>
                  </Card>
                  <Card className="rounded-md border bg-gray-50 px-3 py-2 dark:bg-gray-600">
                    <div className="text-sm text-gray-500">Dificuldade</div>
                    <div className="font-semibold">
                      {selectedWorkout.difficulty === 'BEGINNER'
                        ? 'Iniciante'
                        : selectedWorkout.difficulty === 'INTERMEDIATE'
                        ? 'Intermediário'
                        : 'Avançado'}
                    </div>
                  </Card>
                  <Card className="rounded-md border bg-gray-50 px-3 py-2 dark:bg-gray-600">
                    <div className="text-sm text-gray-500">Tipo</div>
                    <div className="font-semibold">
                      {selectedWorkout.workoutType === 'STRENGTH'
                        ? 'Força'
                        : selectedWorkout.workoutType === 'HYPERTROPHY'
                        ? 'Hipertrofia'
                        : 'Resistência'}
                    </div>
                  </Card>
                </div>

                <div>
                  <h4 className="mb-4 text-lg font-semibold">Dias do Treino</h4>
                  {selectedWorkout.workoutDays &&
                  selectedWorkout.workoutDays.length > 0 ? (
                    <div className="space-y-4">
                      {selectedWorkout.workoutDays.map((day, dayIndex) => (
                        <Card key={day.id || dayIndex} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-semibold">
                                {[
                                  'Domingo',
                                  'Segunda',
                                  'Terça',
                                  'Quarta',
                                  'Quinta',
                                  'Sexta',
                                  'Sábado',
                                ][Number(day.dayOfWeek) - 1] || day.dayOfWeek}
                                {day.name && ` - ${day.name}`}
                              </h5>
                              {day.description && (
                                <p className="text-sm text-gray-600">
                                  {day.description}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openExercisesDialog(day)}
                              className="h-8"
                            >
                              Ver Exercícios
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Nenhum dia de treino cadastrado
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                Fechar
              </Button>
              {selectedWorkout && (
                <Button onClick={() => editWorkout(selectedWorkout)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Treino
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de exercícios do dia */}
        <Dialog open={exercisesOpen} onOpenChange={setExercisesOpen}>
          <DialogContent className="max-h-[95vh] max-w-4xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Exercícios do Dia -{' '}
                {selectedDay &&
                  ([
                    'Domingo',
                    'Segunda',
                    'Terça',
                    'Quarta',
                    'Quinta',
                    'Sexta',
                    'Sábado',
                  ][Number(selectedDay.dayOfWeek) - 1] ||
                    selectedDay.dayOfWeek)}
                {selectedDay?.name && ` - ${selectedDay.name}`}
              </DialogTitle>
            </DialogHeader>

            {selectedDay && (
              <div className="space-y-4">
                {selectedDay.description && (
                  <p className="text-gray-600">{selectedDay.description}</p>
                )}

                {selectedDay.workoutExercises &&
                selectedDay.workoutExercises.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDay.workoutExercises.map(
                      (
                        exercise: {
                          exerciseLibId: string
                          sets: number
                          reps: string
                          weight?: number
                          restSeconds?: number
                          notes?: string
                        },
                        index: number,
                      ) => {
                        const exerciseName = libraryExercises.find(
                          (lib) => lib.id === exercise.exerciseLibId,
                        )?.name
                        return (
                          <Card key={index} className="px-3 py-2">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h6 className="font-semibold">
                                  {exerciseName || 'Exercício não encontrado'}
                                </h6>
                                <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                                  <span>
                                    <strong>Séries:</strong> {exercise.sets}
                                  </span>
                                  <span>
                                    <strong>Repetições:</strong> {exercise.reps}
                                  </span>
                                  {exercise.weight && (
                                    <span>
                                      <strong>Peso:</strong> {exercise.weight}kg
                                    </span>
                                  )}
                                  {exercise.restSeconds && (
                                    <span>
                                      <strong>Descanso:</strong>{' '}
                                      {exercise.restSeconds}s
                                    </span>
                                  )}
                                </div>
                                {exercise.notes && (
                                  <div className="mt-2">
                                    <strong className="text-sm">
                                      Observações:
                                    </strong>
                                    <p className="text-sm text-gray-600">
                                      {exercise.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        )
                      },
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    Nenhum exercício cadastrado para este dia
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setExercisesOpen(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
