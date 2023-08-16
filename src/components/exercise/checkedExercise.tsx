'use client'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { Switch } from '../ui/switch'
import { Skeleton } from '../ui/skeleton'

type IdProps = {
  id: string
}

function CheckedExercise({ id }: IdProps) {
  const cookieKey = `exercise_${id}_checked`
  const [isChecked, setIsChecked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedValue = Cookies.get(cookieKey)
    if (storedValue !== undefined) {
      setIsChecked(JSON.parse(storedValue))
    }
    setIsLoading(false)
  }, [cookieKey])

  const handleCheckboxChange = (value: boolean) => {
    setIsChecked(value)
    Cookies.set(cookieKey, JSON.stringify(value), { expires: 1 })
  }
  if (isLoading) return <Skeleton className="h-6 w-10" />

  return (
    <Switch defaultChecked={isChecked} onCheckedChange={handleCheckboxChange} />
  )
}

export default CheckedExercise
