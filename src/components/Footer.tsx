import { Instagram, Youtube, Facebook, Mail, Dumbbell } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 py-16 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-8 w-8 text-blue-500" />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-2xl font-bold text-transparent">
                FitManager
              </span>
            </div>
            <p className="text-gray-400">
              O app definitivo para gerenciamento de treinos e acompanhamento de
              alunos.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Produto</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Funcionalidades
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Preços
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  App Mobile
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Integrações
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Para Profissionais</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Personal Trainers
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Academias
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Nutricionistas
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Fisioterapeutas
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Suporte</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Tutoriais
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Contato
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Status
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row">
          <p className="text-sm text-gray-400">
            © 2024 FitManager. Todos os direitos reservados.
          </p>
          <div className="mt-4 flex gap-6 text-sm text-gray-400 md:mt-0">
            <a href="#" className="transition-colors hover:text-white">
              Política de Privacidade
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Termos de Uso
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
