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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '@/lib/api'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useToast } from '../ui/use-toast'

type DayOfWeekProps = {
  dayOfWeek: string
}

const createExerciseFormSchema = z.object({
  name: z.string().nonempty('Campo obrigatório'),
  description: z.string(),
  sets: z.string().nonempty('Campo obrigatório'),
  reps: z.string().nonempty('Campo obrigatório'),
  muscleGroupId: z
    .string()
    .nonempty('Campo obrigatório')
    .transform((value) => parseInt(value, 10)),
  dayOfWeekId: z.string().transform((value) => parseInt(value, 10)),
})

function CreateExercise({ dayOfWeek }: DayOfWeekProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  type CreateExerciseFormaData = z.infer<typeof createExerciseFormSchema>

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<CreateExerciseFormaData>({
    resolver: zodResolver(createExerciseFormSchema),
  })

  const { data: session } = useSession()

  async function createExercise(data: CreateExerciseFormaData) {
    setIsLoading(true)
    try {
      await api.post('/exercises', data, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      window.location.reload()
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
    <Dialog>
      <DialogTrigger asChild>
        <Button>Adicionar exercício</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(createExercise)}>
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
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <Input
                placeholder="Nome do Exercício"
                className="col-span-3"
                {...register('name')}
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <select
                id="muscleGroupId"
                className="col-span-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register('muscleGroupId')}
                disabled={isLoading}
              >
                <option value="" className="text-muted-foreground ">
                  Escolha um grupo
                </option>
                <option value="1" className="text-secondary-foreground">
                  Peito
                </option>
                <option value="2" className="text-secondary-foreground">
                  Costas
                </option>
                <option value="3" className="text-secondary-foreground">
                  Pernas
                </option>
                <option value="4" className="text-secondary-foreground">
                  Ombros
                </option>
                <option value="5" className="text-secondary-foreground">
                  Biceps
                </option>
                <option value="6" className="text-secondary-foreground">
                  Triceps
                </option>
                <option value="7" className="text-secondary-foreground">
                  Abdominais
                </option>
              </select>
            </div>

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
