interface ExerciseData {
  id: string
  name: string
  description: string
  muscleGroupId: number
}
export interface ExerciseProps {
  id: string
  name: string
  reps: string
  sets: string
  description: string
  muscleGroupId: number
  dayOfWeekId: string
  exercisesLibId?: string
  exercisesLib: ExerciseData | null
}
