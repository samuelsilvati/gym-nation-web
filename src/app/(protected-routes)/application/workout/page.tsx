import { Card } from '@/components/ui/card'
import Link from 'next/link'

async function Workout() {
  return (
    <div className="flex min-h-screen">
      <div className="container mt-16 max-w-4xl px-8">
        <div>
          <div className="relative w-full py-2 text-center text-lg font-bold">
            Editar Treino
          </div>

          <div className="pt-3">
            <Card className="mb-3 flex justify-between rounded-lg px-5 dark:text-slate-200">
              <Link href="/application/workout/domingo/1" className="w-full">
                <div className="flex h-16 items-center py-3">
                  <div className="flex flex-grow flex-col items-center">
                    <p className="text-md font-bold">Domingo</p>
                  </div>
                </div>
              </Link>
            </Card>
            <Card className="mb-3 flex justify-between rounded-lg px-5 dark:text-slate-200">
              <Link href="/application/workout/segunda/2" className="w-full">
                <div className="flex h-16 items-center py-3">
                  <div className="flex flex-grow flex-col items-center">
                    <p className="text-md font-bold">Segunda</p>
                  </div>
                </div>
              </Link>
            </Card>
            <Card className="mb-3 flex justify-between rounded-lg px-5 dark:text-slate-200">
              <Link href="/application/workout/terca/3" className="w-full">
                <div className="flex h-16 items-center py-3">
                  <div className="flex flex-grow flex-col items-center">
                    <p className="text-md font-bold">Terça</p>
                  </div>
                </div>
              </Link>
            </Card>
            <Card className="mb-3 flex justify-between rounded-lg px-5 dark:text-slate-200">
              <Link href="/application/workout/quarta/4" className="w-full">
                <div className="flex h-16 items-center py-3">
                  <div className="flex flex-grow flex-col items-center">
                    <p className="text-md font-bold">Quarta</p>
                  </div>
                </div>
              </Link>
            </Card>
            <Card className="mb-3 flex justify-between rounded-lg px-5 dark:text-slate-200">
              <Link href="/application/workout/quinta/5" className="w-full">
                <div className="flex h-16 items-center py-3">
                  <div className="flex flex-grow flex-col items-center">
                    <p className="text-md font-bold">Quinta</p>
                  </div>
                </div>
              </Link>
            </Card>
            <Card className="mb-3 flex justify-between rounded-lg px-5 dark:text-slate-200">
              <Link href="/application/workout/sexta/6" className="w-full">
                <div className="flex h-16 items-center py-3">
                  <div className="flex flex-grow flex-col items-center">
                    <p className="text-md font-bold">Sexta</p>
                  </div>
                </div>
              </Link>
            </Card>
            <Card className="mb-3 flex justify-between rounded-lg px-5 dark:text-slate-200">
              <Link href="/application/workout/sabado/7" className="w-full">
                <div className="flex h-16 items-center py-3">
                  <div className="flex flex-grow flex-col items-center">
                    <p className="text-md font-bold">Sábado</p>
                  </div>
                </div>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Workout
