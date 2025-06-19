import {
  Users,
  Calendar,
  BarChart3,
  Smartphone,
  Trophy,
  Heart,
} from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: Users,
      title: 'Gerenciamento de Alunos',
      description:
        'Organize todos os seus alunos em um só lugar com perfis completos e histórico de treinos.',
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

  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Tudo que você precisa para gerenciar treinos
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Ferramentas profissionais para personal trainers e academias que
            querem elevar o nível do atendimento aos alunos.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
