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
import { useState } from 'react'
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

function CreateExerciseLib() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const createExerciseFormSchema = z.object({
    name: z.string().nonempty('Campo obrigatório'),
    description: z.string(),
    muscleGroupId: z
      .string()
      .nonempty('Campo obrigatório')
      .transform((value) => parseInt(value, 10)),
  })

  type CreateExerciseFormaData = z.infer<typeof createExerciseFormSchema>

  const {
    register,
    handleSubmit,
    control,
    // formState: { errors },
  } = useForm<CreateExerciseFormaData>({
    resolver: zodResolver(createExerciseFormSchema),
  })

  const { data: session } = useSession()

  async function createExercise(data: CreateExerciseFormaData) {
    setIsLoading(true)
    try {
      await api.post('/exercisesLib', data, {
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
        <form onSubmit={handleSubmit(createExercise, (e) => console.log(e))}>
          <DialogHeader>
            <DialogTitle>Adicionar exercício</DialogTitle>
            <DialogDescription>
              Adicione o exercício aqui. Clique em adicionar quando terminar.
            </DialogDescription>
          </DialogHeader>

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

            <Input
              placeholder="Nome do Exercício"
              className="col-span-3"
              {...register('name')}
              disabled={isLoading}
            />

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

export default CreateExerciseLib
