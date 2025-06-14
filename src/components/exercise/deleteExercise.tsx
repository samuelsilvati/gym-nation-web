'use client'
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
import { Loader2, Trash2 } from 'lucide-react'
import axios from 'axios'
import { useToast } from '../ui/use-toast'
import { Toaster } from '../ui/toaster'
import { useState } from 'react'

type DeleteExerciseProps = {
  exerciseId: string
  onSuccess?: () => void
}

function DeleteExercise({ exerciseId, onSuccess }: DeleteExerciseProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  async function handleDelete() {
    setIsLoading(true)
    try {
      await axios.delete(`/api/exercises?id=${exerciseId}`)
      setIsLoading(false)
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      setIsLoading(false)
      toast({
        title: `Não foi possível remover`,
        variant: 'destructive',
      })
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Toaster />
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
          <Button
            onClick={handleDelete}
            variant={'destructive'}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Aguarde
              </>
            ) : (
              'Remover'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteExercise
