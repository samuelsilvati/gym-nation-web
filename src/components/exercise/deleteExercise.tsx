'use client'
import { api } from '@/lib/api'
import { useSession } from 'next-auth/react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Trash2 } from 'lucide-react'

type DeleteExerciseProps = {
  exerciseId: string
}

function DeleteExercise({ exerciseId }: DeleteExerciseProps) {
  const { data: session } = useSession()

  function handleDelete() {
    try {
      api.delete(`/exercise/${exerciseId}`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Dialog>
      <DialogTrigger className="text-red-900 dark:text-red-200">
        <Trash2 />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Você tem certeza absoluta?</DialogTitle>
          <DialogDescription>
            Essa ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleDelete} variant={'destructive'}>
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteExercise
