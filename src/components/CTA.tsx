import { Button } from '@/components/ui/button'
import { ArrowRight, Smartphone } from 'lucide-react'

const CTA = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-24">
      <div className="container mx-auto px-4 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
            Pronto para transformar seus treinos?
          </h2>
          <p className="mb-8 text-xl text-blue-100">
            Junte-se à nossa comunidade saudável e descubra como gerenciar
            treinos pode ser simples e eficiente. Comece seu teste grátis hoje
            mesmo!
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="rounded-lg bg-white px-8 py-3 font-semibold text-indigo-600 shadow-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-xl"
            >
              <Smartphone className="mr-2 h-5 w-5" />
              Baixar App Grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-blue-600"
            >
              Falar com Vendas
            </Button>
          </div>
          <p className="mt-6 text-sm text-orange-100">
            Grátis por 14 dias • Sem cartão de crédito • Suporte completo
          </p>
        </div>
      </div>
    </section>
  )
}

export default CTA
