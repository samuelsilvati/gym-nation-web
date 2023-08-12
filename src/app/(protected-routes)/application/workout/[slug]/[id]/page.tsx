'use client'
import DayOfWeek from '@/components/dayOfweek'
import { Card } from '@/components/ui/card'
import { api } from '@/lib/api'

import { ChevronLeft, Trash2 } from 'lucide-react'
import { useSession as UseSession } from 'next-auth/react'
import UseSWR from 'swr'

import Link from 'next/link'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import SkeletonExercises from '@/components/skeletonExercises'

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

  if (!session?.user) return <SkeletonExercises />

  if (isValidating || !data) {
    return <SkeletonExercises />
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
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button type="submit" variant={'destructive'}>
                        Remove
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </form>
            </Card>
          ))}
        </div>

        <form className="mx-auto pt-4 text-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Novo exercício</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Novo exercício</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you{"'"}re
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4 bg-slate-400">
                  <Select onValueChange={(value) => console.log(value)}>
                    <SelectTrigger className="col-span-4">
                      <SelectValue placeholder="Selecione um grupo." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Grupos</SelectLabel>
                        <SelectItem value="1">Peito</SelectItem>
                        <SelectItem value="2">Costas</SelectItem>
                        <SelectItem value="3">Pernas</SelectItem>
                        <SelectItem value="4">Ombros</SelectItem>
                        <SelectItem value="5">Biceps</SelectItem>
                        <SelectItem value="6">Triceps</SelectItem>
                        <SelectItem value="7">Abdominais</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="name"
                    className="col-span-4"
                    placeholder="Nome do exercício"
                  />
                </div>
                <div className="grid w-full grid-cols-2 items-center gap-4">
                  <Input
                    id="sets"
                    className="col-span-1"
                    placeholder="Séries"
                  />
                  <Input
                    id="reps"
                    className="col-span-1"
                    placeholder="Repetições"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4 border">
                  <Textarea
                    id="description"
                    className="col-span-4 resize-none"
                    placeholder="Observações..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </form>
      </div>
    </div>
  )
}

export default page
