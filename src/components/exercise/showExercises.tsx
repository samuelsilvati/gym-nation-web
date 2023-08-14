'use client'
import DayOfWeek from '@/components/dayOfweek'
import { Card } from '@/components/ui/card'

import { ChevronLeft, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import UseSWR from 'swr'

import Link from 'next/link'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import axios from 'axios'
import CreateExercise from './createExercise'
import DeleteButton from './deleteButton'
import SkeletonExercises from './skeletonExercises'

interface ExerciseProps {
  id: number
  name: string
  reps: string
  sets: string
  description: string
  muscleGroupId: string
  dayOfWeekId: string
}

type PageProps = {
  slug: string
  id: string
}

function ShowExercises({ slug, id }: PageProps) {
  const { data: session } = useSession()
  const fetcher = (url: string) => axios.get(url).then((res) => res.data)

  const { data, error, isValidating } = UseSWR(`/api/exercises?id=${id}`, {
    fetcher,
  })

  if (!session?.user) return <SkeletonExercises />

  if (isValidating || !data) {
    return <SkeletonExercises />
  }

  if (error)
    return (
      <div className="flex min-h-screen w-screen items-center justify-center">
        <div className="mt-16 max-w-4xl px-2 md:px-8">
          <p>Erro ao carregar dados.</p>
        </div>
      </div>
    )

  return (
    <div className="container mt-16 max-w-4xl px-2 md:px-8">
      <div className="relative flex w-full items-center justify-center py-2 text-center text-lg font-bold">
        <Link href="/application/workout/" className="absolute left-0 p-2">
          <ChevronLeft size={30} />
        </Link>
        <DayOfWeek dayOfWeek={slug} />
      </div>
      <div className="pt-3">
        {data.length === 0 && (
          <div className=" mb-3 flex w-full items-center justify-center py-3 font-bold">
            Sem atividades nesse dia!
          </div>
        )}
        {data.map((exercise: ExerciseProps) => (
          <Card
            className="mb-3 flex justify-between rounded-lg px-5 dark:text-slate-200"
            key={exercise.id}
          >
            <button className="w-full">
              <div className="flex h-16 items-center py-3 pl-2">
                <div className="flex flex-grow flex-col items-start ">
                  <p className="text-md font-bold md:text-lg">
                    {exercise.name}
                  </p>
                  <p>
                    {exercise.sets} séries x {exercise.reps} repetições
                  </p>
                </div>
              </div>
            </button>
            <form className="flex justify-center">
              <Dialog>
                <DialogTrigger className="text-red-900 dark:text-red-200">
                  <Trash2 />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DeleteButton exerciseId={exercise.id} />
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </form>
          </Card>
        ))}
      </div>
      <div className="mx-auto pt-4 text-center">
        <CreateExercise dayOfWeek={id} />
      </div>
    </div>
  )
}

export default ShowExercises
