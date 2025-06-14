import { ExerciseProps } from './exercise'

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: 'ADMIN' | 'USER' | string
  createdAt: string
  updatedAt: string
  exercise: ExerciseProps[]
}
