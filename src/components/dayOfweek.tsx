import React from 'react'

interface Props {
  dayOfWeek: string
}

function DayOfWeek({ dayOfWeek }: Props) {
  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  function getFirstWordBeforeDash(str: string) {
    const parts = str.split('-')
    return parts[0]
  }

  let capitalizedString = capitalizeFirstLetter(
    getFirstWordBeforeDash(dayOfWeek),
  )

  if (capitalizedString === 'Terca') {
    capitalizedString = 'Terça'
  }

  if (capitalizedString === 'Sabado') {
    capitalizedString = 'Sábado'
  }

  return <>{capitalizedString}</>
}

export default DayOfWeek
