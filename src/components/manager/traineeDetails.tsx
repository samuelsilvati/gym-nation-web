import { User } from '@/interfaces/user'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

type TraineeDetailsProps = User & {
  children?: React.ReactNode
  className?: string
}
const data = new Date()

export default function TraineeDetails({
  name,
  email,
  children,
}: TraineeDetailsProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full text-start">{children}</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes do cadastro do Aluno</DialogTitle>
          <DialogDescription>
            <div className="mt-6 flex cursor-pointer items-center gap-4 space-x-2">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              {name} - {email}
              <div>
                <div>Cadastrado em: </div>
                <span>
                  {format(data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </span>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
