import {
  Users,
  Calendar,
  BarChart3,
  Smartphone,
  Trophy,
  Heart,
  Sparkles,
} from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Gerenciamento de Alunos',
    description:
      'Organize todos os seus alunos em um só lugar com perfis completos e histórico de treinos.',
    badge: 'Popular',
  },
  {
    icon: Calendar,
    title: 'Agendamento Inteligente',
    description:
      'Crie e gerencie horários de treino com lembretes automáticos para alunos.',
  },
  {
    icon: BarChart3,
    title: 'Relatórios de Progresso',
    description:
      'Acompanhe a evolução dos alunos com gráficos detalhados e métricas de performance.',
    badge: 'Novo',
  },
  {
    icon: Smartphone,
    title: 'App Mobile Completo',
    description:
      'Acesse tudo pelo celular - criação de treinos, acompanhamento e comunicação.',
  },
  {
    icon: Trophy,
    title: 'Sistema de Metas',
    description:
      'Defina objetivos para seus alunos e celebre cada conquista alcançada.',
  },
  {
    icon: Heart,
    title: 'Comunidade Ativa',
    description:
      'Conecte alunos e trainers em uma rede social focada em fitness e bem-estar.',
  },
]

const Features = () => {
  return (
    <section id="features" className="bg-gray-50 py-24 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <Sparkles className="h-4 w-4" />
            Funcionalidades
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 md:text-4xl lg:text-5xl">
            Tudo que você precisa para{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              gerenciar treinos
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-400">
            Ferramentas profissionais para personal trainers e academias que
            querem elevar o nível do atendimento aos alunos.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:border-blue-200 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-blue-800/50"
            >
              {feature.badge && (
                <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-xs font-medium text-white">
                  {feature.badge}
                </span>
              )}
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/25">
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-50">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
