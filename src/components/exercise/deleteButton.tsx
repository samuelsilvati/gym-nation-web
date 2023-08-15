'use client'
import { api } from '@/lib/api'
import { useSession } from 'next-auth/react'
import { Button } from '../ui/button'

type DeleteButtonProps = {
  exerciseId: string
}

function DeleteButton({ exerciseId }: DeleteButtonProps) {
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
    <Button onClick={handleDelete} variant={'destructive'}>
      Remove
    </Button>
  )
}

export default DeleteButton
