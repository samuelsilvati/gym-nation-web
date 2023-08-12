'use client'
import DayOfWeek from '@/components/dayOfweek'
import { Card } from '@/components/ui/card'
import { api } from '@/lib/api'

import { ChevronLeft, Loader2, Trash2 } from 'lucide-react'
import { useSession as UseSession } from 'next-auth/react'
import UseSWR from 'swr'

import Link from 'next/link'

interface ExerciseProps {
  id: number
  name: string
  reps: string
  sets: string
  description: string
  muscleGroupId: string
  dayOfWeekId: string
}

function page({ params }: { params: { slug: string; id: string } }) {
  const { data: session } = UseSession()

  const fetcher = (url: string) =>
    api
      .get(url, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => res.data)
  const { data, error, isValidating } = UseSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/exercises-by-day-of-week/${params.id}`,
    { fetcher },
  )

  if (!session?.user)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mt-16 max-w-4xl px-2 md:px-8">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        </div>
      </div>
    )

  if (isValidating || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mt-16 max-w-4xl px-2 md:px-8">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        </div>
      </div>
    )
  }

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mt-16 max-w-4xl px-2 md:px-8">
          <p>Erro ao carregar dados.</p>
        </div>
      </div>
    )

  return (
    <div className="flex min-h-screen">
      <div className="container mt-16 max-w-4xl px-2 md:px-8">
        <div className="relative flex w-full items-center justify-center py-2 text-center text-lg font-bold">
          <Link href="/application/workout/" className="absolute left-0 p-2">
            <ChevronLeft size={30} />
          </Link>
          <DayOfWeek dayOfWeek={params.slug} />
        </div>
        <div className="pt-3">
          {data.length === 0 && (
            <div className=" mb-3 flex w-full items-center justify-center py-3 font-bold">
              Sem atividades nesse dia!
            </div>
          )}
          {data.map((exercise: ExerciseProps) => (
            <Card
              className="mb-3 flex justify-between rounded-lg border px-5 dark:text-slate-200"
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
              <div className="flex w-16 items-center justify-center">
                <button type="button" className="flex items-center p-2">
                  <Trash2 />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default page
