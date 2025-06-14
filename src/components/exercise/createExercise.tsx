'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '../ui/textarea'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '@/lib/api'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useToast } from '../ui/use-toast'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { ExerciseProps } from '@/interfaces/exercise'

type DayOfWeekProps = {
  dayOfWeek: string
  onSuccess?: () => void
}

function CreateExercise({ dayOfWeek, onSuccess }: DayOfWeekProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const [associate, setAssociate] = useState(true)
  const [libraryExercises, setLibraryExercises] = useState<ExerciseProps[]>([])
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<
    string | undefined
  >(undefined)

  const createExerciseFormSchema = z.object({
    name: associate
      ? z.string().default('')
      : z.string().nonempty('Campo obrigatório'),
    description: z.string(),
    sets: z.string().nonempty('Campo obrigatório'),
    reps: z.string().nonempty('Campo obrigatório'),
    muscleGroupId: z
      .string()
      .nonempty('Campo obrigatório')
      .transform((value) => parseInt(value, 10)),
    dayOfWeekId: z.string().transform((value) => parseInt(value, 10)),
    exercisesLibId: z
      .union([z.string().nonempty(), z.undefined()])
      .transform((value) => (value !== undefined ? value : undefined)),
  })

  type CreateExerciseFormaData = z.infer<typeof createExerciseFormSchema>

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    // formState: { errors },
  } = useForm<CreateExerciseFormaData>({
    resolver: zodResolver(createExerciseFormSchema),
  })

  const { data: session } = useSession()

  // Buscar exercícios da biblioteca filtrados pelo muscleGroupId
  useEffect(() => {
    if (associate && selectedMuscleGroup) {
      setIsLoading(true)
      api
        .get(`/exercisesLib-by-group/${selectedMuscleGroup} `, {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        })
        .then((res) => {
          setLibraryExercises(res.data)
          setIsLoading(false)
        })
    }
  }, [associate, selectedMuscleGroup, session?.user.token])

  const muscleGroupId = watch('muscleGroupId')

  useEffect(() => {
    setSelectedMuscleGroup(muscleGroupId ? String(muscleGroupId) : undefined)
    // setValue('exercisesLibId', undefined)
    // console.log('muscleGroupId mudou:', muscleGroupId)
    // console.log('exercisesLibId após limpar:', watch('exercisesLibId'))
  }, [muscleGroupId, setValue, watch])

  async function createExercise(data: CreateExerciseFormaData) {
    setIsLoading(true)
    try {
      await api.post('/exercises', data, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      setIsLoading(false)
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      console.log(error)
      toast({
        title: 'Não foi possível salvar exercício',
        variant: 'destructive',
      })
      setIsLoading(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar exercício</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(createExercise, (e) => console.log(e))}>
          <Input
            value={dayOfWeek}
            className="invisible hidden"
            {...register('dayOfWeekId')}
            disabled={isLoading}
          />
          <DialogHeader>
            <DialogTitle>Adicionar exercício</DialogTitle>
            <DialogDescription>
              Adicione o exercício aqui. Clique em adicionar quando terminar.
            </DialogDescription>
          </DialogHeader>

          <div className="mb-2 mt-3 flex items-center gap-2">
            <Switch
              id="associate-switch"
              checked={associate}
              onCheckedChange={setAssociate}
              disabled={isLoading}
            />
            <Label htmlFor="associate-switch">
              {associate ? 'Associar da biblioteca' : 'Criar novo exercício'}
            </Label>
          </div>

          <div className="flex flex-col gap-4 py-4">
            <Controller
              name="muscleGroupId"
              control={control}
              render={({ field }) => (
                <Select
                  disabled={isLoading}
                  value={
                    field.value === undefined ? undefined : String(field.value)
                  }
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o grupo muscular" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="1">Peito</SelectItem>
                      <SelectItem value="2">Costas</SelectItem>
                      <SelectItem value="3">Pernas</SelectItem>
                      <SelectItem value="4">Ombros</SelectItem>
                      <SelectItem value="5">Biceps</SelectItem>
                      <SelectItem value="6">Triceps</SelectItem>
                      <SelectItem value="7">Abdominais</SelectItem>
                      <SelectItem value="9">Outros</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />

            {associate ? (
              <Controller
                name="exercisesLibId"
                control={control}
                render={({ field }) => (
                  <Select
                    disabled={isLoading || !selectedMuscleGroup}
                    value={
                      field.value === undefined
                        ? undefined
                        : String(field.value)
                    }
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className=" w-full">
                      <SelectValue placeholder="Selecione um exercício da biblioteca" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {libraryExercises.map((ex) => (
                          <SelectItem key={ex.id} value={ex.id}>
                            {ex.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            ) : (
              <Input
                placeholder="Nome do Exercício"
                className="col-span-3"
                {...register('name')}
                disabled={isLoading}
              />
            )}

            <div className="grid w-full grid-cols-4 items-center gap-4">
              <Input
                placeholder="Séries"
                className="col-span-2"
                {...register('sets')}
                disabled={isLoading}
              />
              <Input
                placeholder="Repetições"
                className="col-span-2"
                {...register('reps')}
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Textarea
                className="col-span-4 resize-none"
                placeholder="Observações..."
                {...register('description')}
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Adicionar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateExercise
