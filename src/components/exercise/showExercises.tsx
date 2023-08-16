'use client'
import DayOfWeek from '@/components/dayOfweek'
import { Card } from '@/components/ui/card'

import { ChevronLeft, GripVertical } from 'lucide-react'
import UseSWR from 'swr'

import Link from 'next/link'

import axios from 'axios'
import CreateExercise from './createExercise'
import SkeletonExercises from './skeletonExercises'
import EditExercise from './editExercise'

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd'
import { useEffect, useState } from 'react'
import DeleteExercise from './deleteExercise'

interface ExerciseProps {
  id: string
  name: string
  reps: string
  sets: string
  description: string
  muscleGroupId: string
  dayOfWeekId: string
}

type PageProps = {
  slug: string
  id: string
}

function ShowExercises({ slug, id }: PageProps) {
  const [orderedData, setOrderedData] = useState<ExerciseProps[]>([])
  const fetcher = (url: string) => axios.get(url).then((res) => res.data)

  const { data, error, isValidating } = UseSWR(`/api/exercises?id=${id}`, {
    fetcher,
  })

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
    <div className="container mt-16 max-w-4xl px-2 md:px-8">
      <div className="relative flex w-full items-center justify-center py-2 text-center text-lg font-bold">
        <Link href="/application/workout/" className="absolute left-0 p-2">
          <ChevronLeft size={30} />
        </Link>
        <DayOfWeek dayOfWeek={slug} />
      </div>
      <div className="pt-3">
        {data.length === 0 && (
          <div className=" mb-3 flex w-full items-center justify-center py-3 font-bold">
            Sem atividades nesse dia!
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
                          muscleGroupId={exercise.muscleGroupId}
                        >
                          <div className="flex h-16 items-center py-3 pl-2">
                            <div className="flex flex-grow flex-col items-start ">
                              <p className="text-md font-bold md:text-lg">
                                {exercise.name}
                              </p>
                              <p>
                                {exercise.sets} séries x {exercise.reps}{' '}
                                repetições
                              </p>
                            </div>
                          </div>
                        </EditExercise>

                        <DeleteExercise exerciseId={exercise.id} />
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
        <CreateExercise dayOfWeek={id} />
      </div>
    </div>
  )
}

export default ShowExercises
