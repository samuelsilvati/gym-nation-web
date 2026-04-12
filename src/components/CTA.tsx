import { Button } from '@/components/ui/button'
import { ArrowRight, Smartphone, MessageCircle } from 'lucide-react'

const CTA = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-24 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDR2LTJoMzJ2NXoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            Pronto para revolucionar seus treinos?
          </h2>
          <p className="mb-10 text-xl text-blue-100">
            Junte-se a milhares de profissionais que já transformaram sua forma
            de gerenciar treinos. Comece grátis hoje mesmo.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="group rounded-xl bg-white px-8 py-4 text-lg font-semibold text-indigo-600 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-gray-100 hover:shadow-2xl dark:text-indigo-700"
            >
              <Smartphone className="mr-2 h-5 w-5" />
              Baixar App Grátis
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="group rounded-xl border-2 border-white/50 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/20"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Falar com Vendas
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-100">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400"></span>
              Grátis por 14 dias
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400"></span>
              Sem cartão de crédito
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400"></span>
              Suporte 24/7
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA
