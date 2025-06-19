import { Star } from 'lucide-react'

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Carlos Silva',
      role: 'Personal Trainer',
      content:
        'Revolucionou minha forma de trabalhar! Agora consigo acompanhar todos os meus 50 alunos de forma organizada e eficiente.',
      rating: 5,
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
    },
    {
      name: 'Marina Santos',
      role: 'Proprietária de Academia',
      content:
        'O app transformou nossa academia. Os alunos estão mais engajados e conseguimos oferecer um atendimento muito mais personalizado.',
      rating: 5,
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=64&h=64&fit=crop&crop=face',
    },
    {
      name: 'João Oliveira',
      role: 'Aluno Premium',
      content:
        'Finalmente um app que me ajuda a manter o foco nos treinos. O acompanhamento do progresso é incrível e me motiva todos os dias!',
      rating: 5,
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
    },
  ]

  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            O que nossa comunidade diz
          </h2>
          <p className="text-xl text-gray-600">
            Histórias reais de transformação e sucesso
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-xl bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl"
            >
              <div className="mb-4 flex items-center gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-current text-yellow-400"
                  />
                ))}
              </div>
              <p className="mb-6 italic text-gray-700">{testimonial.content}</p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
