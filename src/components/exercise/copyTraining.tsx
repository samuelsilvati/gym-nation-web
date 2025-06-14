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
import { ExerciseProps } from '@/interfaces/exercise'
import { Card } from '@/components/ui/card'

type DayOfWeekProps = {
  dayOfWeek: string
  traineeId?: string
}
type CopyTrainingProps = DayOfWeekProps & {
  onSuccess?: () => void
}

function CopyTraining({ dayOfWeek, traineeId, onSuccess }: CopyTrainingProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const [training, setTraining] = useState<ExerciseProps[]>([])
  const [selectDayOfWeek, setSelectedDayOfWeek] = useState<string | undefined>(
    undefined,
  )
  const { data: session } = useSession()

  // Buscar exercícios do dia selecionado
  useEffect(() => {
    if (selectDayOfWeek) {
      setIsLoading(true)
      api
        .get(`/exercises-by-day-of-week/${selectDayOfWeek}`, {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        })
        .then((res) => {
          setTraining(res.data)
          setIsLoading(false)
        })
    }
  }, [selectDayOfWeek, session?.user.token])

  async function copyTrainingToCurrentDay() {
    if (!training.length) {
      toast({
        title: 'Selecione um treino para copiar!',
        variant: 'destructive',
      })
      return
    }
    setIsLoading(true)
    try {
      for (const exercise of training) {
        await api.post(
          `/exercises${traineeId ? `?traineeId=${traineeId}` : ''}`,
          {
            name: exercise.name,
            description: exercise.description,
            sets: exercise.sets,
            reps: exercise.reps,
            muscleGroupId: exercise.muscleGroupId,
            dayOfWeekId: Number(dayOfWeek),
            exercisesLibId: exercise.exercisesLibId,
          },
          {
            headers: {
              Authorization: `Bearer ${session?.user.token}`,
            },
          },
        )
      }
      setIsLoading(false)
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      console.log(error)
      toast({
        title: 'Não foi possível copiar o treino',
        variant: 'destructive',
      })
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link">Copiar Treino de ...</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Copiar Treino</DialogTitle>
          <DialogDescription>
            Selecione o dia do treino que deseja copiar. Clique em adicionar
            quando terminar.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Select
            disabled={isLoading}
            value={selectDayOfWeek}
            onValueChange={setSelectedDayOfWeek}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o dia do treino" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem disabled={dayOfWeek === '1'} value="1">
                  Domingo
                </SelectItem>
                <SelectItem disabled={dayOfWeek === '2'} value="2">
                  Segunda
                </SelectItem>
                <SelectItem disabled={dayOfWeek === '3'} value="3">
                  Terça
                </SelectItem>
                <SelectItem disabled={dayOfWeek === '4'} value="4">
                  Quarta
                </SelectItem>
                <SelectItem disabled={dayOfWeek === '5'} value="5">
                  Quinta
                </SelectItem>
                <SelectItem disabled={dayOfWeek === '6'} value="6">
                  Sexta
                </SelectItem>
                <SelectItem disabled={dayOfWeek === '7'} value="7">
                  Sábado
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="max-h-96 overflow-y-auto px-2">
            {training.map((exercise: ExerciseProps) => (
              <Card
                key={exercise.id}
                className="mb-3 flex justify-between rounded-lg px-5 dark:text-slate-200"
              >
                <div className="flex h-16 items-center py-3">
                  <div className="flex flex-grow flex-col items-start ">
                    <p className="text-md font-bold md:text-lg">
                      {exercise.name || exercise.exercisesLib?.name}
                    </p>
                    <p>
                      {exercise.sets} séries x {exercise.reps} repetições
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={copyTrainingToCurrentDay}
            disabled={isLoading || !training.length}
          >
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
      </DialogContent>
    </Dialog>
  )
}

export default CopyTraining
