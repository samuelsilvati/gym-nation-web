import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { ReactNode } from 'react'
import { Dumbbell, ImageIcon, Repeat } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'

type ShowExerciseProps = {
  name: string | undefined
  reps: string
  sets: string
  description: string | undefined
}

type ButtonProps = {
  children: ReactNode
}

function ShowExerciseDetails({
  name,
  reps,
  sets,
  description,
  children,
}: ShowExerciseProps & ButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full">{children}</button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center justify-center sm:max-w-[425px]">
        <h1 className="text-xl">{name}</h1>
        <Skeleton className="flex h-64 w-full items-center justify-center">
          <ImageIcon size={50} />
        </Skeleton>
        <div className="flex gap-5">
          <span className="flex items-center gap-2">
            <Dumbbell size={18} />
            {sets} Séries
          </span>
          <span className="flex items-center gap-2">
            <Repeat size={18} />
            {reps} Repetições
          </span>
        </div>
        <div>{description}</div>
      </DialogContent>
    </Dialog>
  )
}

export default ShowExerciseDetails
