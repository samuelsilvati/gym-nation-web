'use client'
import { Card } from '@/components/ui/card'

import { GripVertical } from 'lucide-react'
import UseSWR from 'swr'

import axios from 'axios'
import CreateExercise from '../exercise/createExercise'
import SkeletonExercises from '../exercise/skeletonExercises'
import EditExercise from '../exercise/editExercise'

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd'
import { useEffect, useState } from 'react'
import { ExerciseProps } from '@/interfaces/exercise'
import CopyTraining from '../exercise/copyTraining'
import DeleteExercise from '../exercise/deleteExercise'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'

type PageProps = {
  traineeId?: string
  dayOfWeek: string
  id: string
  children?: React.ReactNode
}

function ShowTraineeExercises({
  traineeId,
  dayOfWeek,
  id,
  children,
}: PageProps) {
  const [open, setOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [orderedData, setOrderedData] = useState<ExerciseProps[]>([])
  const fetcher = (url: string) => axios.get(url).then((res) => res.data)

  const { data, error, isValidating } = UseSWR(
    `/api/exercises?id=${id}&refresh=${refreshKey}&traineeId=${traineeId}`,
    {
      fetcher,
      revalidateOnFocus: false,
    },
  )

  useEffect(() => {
    if (data) {
      setOrderedData([...data])
    }
  }, [data])

  if (isValidating || !data) {
    return <SkeletonExercises />
  }

  if (error)
    return (
      <div className="flex min-h-screen w-screen items-center justify-center">
        <div className="mt-16 max-w-4xl px-2 md:px-8">
          <p>Erro ao carregar dados.</p>
        </div>
      </div>
    )
  function handleRefresh() {
    setRefreshKey((prevKey) => prevKey + 1)
  }

  const handleDragDrop = async (results: DropResult) => {
    const { source, destination, type } = results
    if (!destination) return
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return
    if (type === 'group') {
      const reorderedExercises = [...orderedData]
      const sourceIndex = source.index
      const destinationIndex = destination.index
      const [removedExercise] = reorderedExercises.splice(sourceIndex, 1)
      reorderedExercises.splice(destinationIndex, 0, removedExercise)
      setOrderedData(reorderedExercises)
      const newOrder = reorderedExercises.map((exercise) => exercise.id)
      const data = {
        exerciseOrder: newOrder,
      }
      try {
        await axios.post('/api/exercises', data)
      } catch (error) {
        console.error('Erro ao salvar a ordem dos exercícios:', error)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full text-start">{children}</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        {dayOfWeek}
        <div className="pt-3">
          {data.length === 0 && (
            <div className=" mb-3 flex w-full flex-col items-center justify-center py-3 font-bold">
              Sem atividades nesse dia!
              <CopyTraining dayOfWeek={id} onSuccess={handleRefresh} />
            </div>
          )}

          <DragDropContext onDragEnd={handleDragDrop}>
            <Droppable droppableId="ROOT" type="group">
              {(provided) => (
                <div ref={provided.innerRef}>
                  {orderedData.map((exercise: ExerciseProps, index: number) => (
                    <Draggable
                      draggableId={exercise.id}
                      key={exercise.id}
                      index={index}
                    >
                      {(provided) => (
                        <Card
                          className="mb-3 flex items-center justify-between rounded-lg px-4 dark:text-slate-200"
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                        >
                          <div className="-ml-1 pr-1">
                            <GripVertical />
                          </div>
                          <EditExercise
                            id={exercise.id}
                            name={exercise.name}
                            reps={exercise.reps}
                            sets={exercise.sets}
                            description={exercise.description}
                            dayOfWeek={id}
                            muscleGroupId={String(exercise.muscleGroupId)}
                            exercisesLibId={exercise.exercisesLib?.id}
                            onSuccess={handleRefresh}
                          >
                            <div className="flex h-16 items-center py-3 pl-2">
                              <div className="flex flex-grow flex-col items-start ">
                                <p className="text-md font-bold md:text-lg">
                                  {exercise.name || exercise.exercisesLib?.name}
                                </p>
                                <p>
                                  {exercise.sets} séries x {exercise.reps}{' '}
                                  repetições
                                </p>
                              </div>
                            </div>
                          </EditExercise>

                          <DeleteExercise
                            exerciseId={exercise.id}
                            onSuccess={handleRefresh}
                          />
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div className="mx-auto pt-4 text-center">
          <CreateExercise dayOfWeek={id} onSuccess={handleRefresh} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShowTraineeExercises
