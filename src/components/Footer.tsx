import { Instagram, Youtube, Facebook, Mail, Dumbbell } from 'lucide-react'
import Link from 'next/link'

const footerLinks = {
  produto: [
    { label: 'Funcionalidades', href: '#features' },
    { label: 'Preços', href: '#pricing' },
    { label: 'App Mobile', href: '#' },
    { label: 'Integrações', href: '#' },
  ],
  profissionais: [
    { label: 'Personal Trainers', href: '#' },
    { label: 'Academias', href: '#' },
    { label: 'Nutricionistas', href: '#' },
    { label: 'Fisioterapeutas', href: '#' },
  ],
  suporte: [
    { label: 'Central de Ajuda', href: '#' },
    { label: 'Tutoriais', href: '#' },
    { label: 'Contato', href: '#contact' },
    { label: 'Status', href: '#' },
  ],
}

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Mail, href: '#', label: 'Email' },
]

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white dark:bg-slate-950">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="mb-6 inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-3xl font-bold text-transparent">
                Gym Nation
              </span>
            </Link>
            <p className="mb-6 max-w-sm text-gray-400">
              A plataforma completa para personal trainers e academias
              gerenciarem treinos de alunos de forma eficiente.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-gray-400 transition-all duration-300 hover:bg-gray-700 hover:text-white"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Produto</h3>
            <ul className="space-y-3">
              {footerLinks.produto.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1 text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">
              Para Profissionais
            </h3>
            <ul className="space-y-3">
              {footerLinks.profissionais.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1 text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Suporte</h3>
            <ul className="space-y-3">
              {footerLinks.suporte.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1 text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 md:flex-row">
          <p className="text-sm text-gray-400">
            © 2024 Gym Nation. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              href="#"
              className="text-gray-400 transition-colors hover:text-white"
            >
              Política de Privacidade
            </Link>
            <Link
              href="/terms-of-service"
              className="text-gray-400 transition-colors hover:text-white"
            >
              Termos de Uso
            </Link>
            <Link
              href="#"
              className="text-gray-400 transition-colors hover:text-white"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
