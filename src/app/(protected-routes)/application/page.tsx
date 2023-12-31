import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '../../api/auth/[...nextauth]/route'
import { api } from '@/lib/api'
import CurrentDate from '@/components/currentDate'
import { Card } from '@/components/ui/card'
import ShowExerciseDetails from '@/components/exercise/showDetails'
import CheckedExercise from '@/components/exercise/checkedExercise'

interface ExerciseProps {
  id: string
  name: string
  reps: string
  sets: string
  description: string
  muscleGroupId: string
  dayOfWeekId: string
}

export default async function Home() {
  const session = await getServerSession(nextAuthOptions)

  const token = session?.user.token

  const date = new Date()
  const saoPauloTimeZone = 'America/Sao_Paulo'
  const options = { timeZone: saoPauloTimeZone }

  const currentDayOfWeek =
    new Date(date.toLocaleString('en-US', options)).getDay() + 1

  const response = await api.get(
    `/exercises-by-day-of-week/${currentDayOfWeek}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  const exercises: ExerciseProps[] = response.data

  return (
    <div className="flex min-h-screen">
      <div className="container mt-16 max-w-4xl px-2 pb-28 md:px-8 md:pb-0">
        <div>
          <div className="mb-3 w-full pt-3 text-center text-lg font-bold">
            <CurrentDate />
          </div>
          <p className="pb-2 text-center">Treino de Hoje:</p>
          {exercises.map((exercise: ExerciseProps) => (
            <Card
              key={exercise.id}
              className="mb-3 flex justify-between rounded-lg px-5 dark:text-slate-200"
            >
              <ShowExerciseDetails
                name={exercise.name}
                reps={exercise.reps}
                sets={exercise.sets}
                description={exercise.description}
              >
                <div className="flex h-16 items-center py-3">
                  <div className="flex flex-grow flex-col items-start ">
                    <p className="text-md font-bold md:text-lg">
                      {exercise.name}
                    </p>
                    <p>
                      {exercise.sets} séries x {exercise.reps} repetições
                    </p>
                  </div>
                </div>
              </ShowExerciseDetails>
              <div className="flex w-16 items-center justify-center">
                <div className="flex items-center p-2">
                  <CheckedExercise id={exercise.id} />
                </div>
              </div>
            </Card>
          ))}
          {exercises.length === 0 && (
            <div className=" mb-3 flex w-full items-center justify-center py-3 font-bold">
              Não existem atividades hoje!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
