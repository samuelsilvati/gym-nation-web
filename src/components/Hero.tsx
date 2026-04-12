import { ArrowRight, Dumbbell, Zap, Shield, Users } from 'lucide-react'
import Link from 'next/link'

const stats = [
  { icon: Users, value: '500+', label: 'Personal Trainers' },
  { icon: Zap, value: '10k+', label: 'Alunos Ativos' },
  { icon: Shield, value: '4.9★', label: 'Avaliação' },
]

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-16 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="bg-grid-slate-200/50 dark:bg-grid-slate-800/20 absolute inset-0 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,transparent,rgba(0,0,0,0.3))]"></div>

      <div className="absolute -right-64 -top-64 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10"></div>
      <div className="absolute -bottom-64 -left-64 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/10"></div>

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/80 px-4 py-2 text-sm font-medium text-blue-700 backdrop-blur-sm dark:border-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              Nova versão 2.0 disponível
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 md:text-5xl lg:text-6xl">
              Gerencie seus{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                treinos
              </span>
              <br />
              como um profissional
            </h1>

            <p className="mb-8 max-w-xl text-lg text-gray-600 dark:text-gray-400">
              A plataforma completa para personal trainers e academias. Crie
              treinos, acompanhe o progresso dos alunos e escale seu negócio.
            </p>

            <div className="mb-10 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Link
                href="/signin"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/30"
              >
                Login com Google
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/signin-credentials"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white/80 px-8 py-4 text-lg font-semibold text-gray-900 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:bg-white dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-100 dark:hover:border-gray-600 dark:hover:bg-gray-800"
              >
                Login com Email
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 lg:justify-start">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <stat.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                      {stat.value}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex-1">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 blur-xl dark:opacity-30"></div>
              <div className="relative rounded-3xl border border-gray-200/50 bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-900/80">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
                    <Dumbbell className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-50">
                      Treinos do Dia
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      5 alunos agendados
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    'Treino A - João',
                    'Treino B - Maria',
                    'Treino C - Pedro',
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/50"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {item.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-50">
                          {item}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          14:00 - 15:00
                        </div>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="flex h-24 flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gradient-to-br from-blue-50 to-blue-100 dark:border-gray-800 dark:from-blue-900/30 dark:to-indigo-900/30">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      12
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Treinos Hoje
                    </div>
                  </div>
                  <div className="flex h-24 flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:border-gray-800 dark:from-indigo-900/30 dark:to-purple-900/30">
                    <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                      89%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Conclusão
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
