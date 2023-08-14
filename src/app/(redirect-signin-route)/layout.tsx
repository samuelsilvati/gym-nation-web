import { getServerSession } from 'next-auth'
import { ReactNode } from 'react'
import { nextAuthOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export default async function PrivateLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await getServerSession(nextAuthOptions)

  if (session) {
    redirect('/application')
  }
  return (
    <div className="flex h-screen w-screen">
      <div className="hidden h-full w-[35%] bg-[url(/img/unsplash.jpg)] bg-cover xl:block">
        <div className="ml-9 mt-28">
          <p className="w-80 text-4xl font-bold text-black xl:text-white">
            Junte-se à nossa comunidade saudável
          </p>
        </div>
        <div className="absolute bottom-0 mb-9 ml-9 text-sm text-slate-300">
          <span>
            Foto de{' '}
            <a
              href="https://unsplash.com/@codioful?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
              target="_blank"
              className="underline"
              rel="noreferrer"
            >
              Codioful (Formerly Gradienta)
            </a>{' '}
            na{' '}
            <a
              href="https://unsplash.com/pt-br/fotografias/m_7p45JfXQo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
              target="_blank"
              className="underline"
              rel="noreferrer"
            >
              Unsplash
            </a>
          </span>
        </div>
      </div>
      <div className="flex h-full w-full items-center justify-center 2xl:w-[65%]">
        {children}
      </div>
    </div>
  )
}
