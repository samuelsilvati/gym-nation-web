import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/route'
import { ModeToggle } from '@/components/themerModeToggle'
import { getServerSession } from 'next-auth'
import Link from 'next/link'

import { redirect } from 'next/navigation'

export default async function TermsOfService() {
  const session = await getServerSession(nextAuthOptions)
  if (session) {
    redirect('/application')
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-background p-12 md:p-24">
      <div className="flex w-full items-center justify-between">
        <Link href="/signin" className="mr-2">
          Voltar
        </Link>
        <ModeToggle />
      </div>
      <div className="flex max-w-lg flex-col items-center justify-center">
        <h1 className="pb-4 text-justify text-2xl text-gray-800 dark:text-gray-300">
          Termos de Uso
        </h1>
        <p className=" pb-3 text-justify text-sm text-gray-800 dark:text-gray-300">
          1. Aceitação dos Termos Ao criar uma conta e utilizar este aplicativo,
          o usuário concorda com os presentes Termos de Uso. Se o usuário não
          concordar com quaisquer termos aqui descritos, não deverá utilizar o
          aplicativo.
        </p>
        <p className=" pb-3 text-justify text-sm text-gray-800 dark:text-gray-300">
          2. Cadastro e Acesso à Conta Para utilizar o aplicativo, o usuário
          deverá fornecer seu nome completo e endereço de e-mail válidos. Essas
          informações serão utilizadas exclusivamente para permitir o acesso à
          conta e identificar o usuário de forma segura.
        </p>
        <p className=" pb-3 text-justify text-sm text-gray-800 dark:text-gray-300">
          3. Armazenamento de Dados As informações fornecidas pelo usuário (nome
          e e-mail) serão armazenadas com segurança em nosso banco de dados.
          Esses dados serão utilizados apenas para fins de autenticação e acesso
          ao sistema, além de possibilitar suporte técnico, caso necessário
        </p>
        <p className=" pb-3 text-justify text-sm text-gray-800 dark:text-gray-300">
          4. Privacidade Comprometemo-nos a proteger a privacidade dos usuários.
          As informações coletadas não serão compartilhadas com terceiros sem o
          consentimento expresso do usuário, exceto quando exigido por lei. Para
          mais detalhes, consulte nossa Política de Privacidade.
        </p>
        <p className=" pb-3 text-justify text-sm text-gray-800 dark:text-gray-300">
          5. Responsabilidades do Usuário O usuário se compromete a fornecer
          informações verdadeiras e a manter a confidencialidade de suas
          credenciais de acesso. O uso indevido do aplicativo ou tentativa de
          acesso não autorizado a outras contas poderá resultar na suspensão ou
          encerramento da conta.
        </p>
        <p className=" pb-3 text-justify text-sm text-gray-800 dark:text-gray-300">
          6. Alterações nos Termos Reservamo-nos o direito de alterar os Termos
          de Uso a qualquer momento, mediante aviso prévio ao usuário. O uso
          contínuo do aplicativo após tais alterações constitui aceitação dos
          novos termos.
        </p>

        <p className=" pb-3 text-justify text-sm text-gray-800 dark:text-gray-300">
          7. Contato Em caso de dúvidas ou solicitações, o usuário pode entrar
          em contato através do e-mail [seu-email@dominio.com].
        </p>
      </div>
    </div>
  )
}
