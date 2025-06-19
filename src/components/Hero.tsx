import { ArrowRight, Dumbbell } from 'lucide-react'
import Link from 'next/link'

const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="bg-grid-slate-100 absolute inset-0 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
      <div className="container relative z-10 mx-auto mb-6 px-4">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-6 mt-3 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-900">
              <Dumbbell className="h-4 w-4" />
              Transforme seu treino hoje
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-6xl lg:text-7xl">
              Gerencie seus
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {' '}
                treinos
              </span>
              <br />
              como um pro
            </h1>
            <p className="mb-8 max-w-2xl text-xl text-gray-600">
              O app definitivo para personal trainers e academias gerenciarem
              treinos de alunos. Crie, acompanhe e evolua com nossa plataforma
              completa.
            </p>
            <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Link
                href="/signin"
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
              >
                Começar Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="text-center lg:text-left">
              <p className="mb-2 text-lg font-semibold text-blue-600">
                Junte-se à nossa comunidade saudável
              </p>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 lg:justify-start">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Personal Trainers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">10k+</div>
                <div className="text-sm text-gray-600">Alunos Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">4.8★</div>
                <div className="text-sm text-gray-600">Avaliação</div>
              </div>
            </div>
          </div>
          <div className="relative flex-1">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-400 to-indigo-400 opacity-20 blur-xl"></div>
              <div className="relative rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500">
                      <Dumbbell className="h-4 w-4 text-white" />
                    </div>
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 w-full rounded bg-gray-100"></div>
                    <div className="h-3 w-3/4 rounded bg-gray-100"></div>
                    <div className="h-3 w-1/2 rounded bg-gray-100"></div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="flex h-20 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                      <div className="font-semibold text-blue-600">
                        Treino A
                      </div>
                    </div>
                    <div className="flex h-20 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100">
                      <div className="font-semibold text-blue-600">
                        Treino B
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
