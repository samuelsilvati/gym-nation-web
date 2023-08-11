import React from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

dayjs.locale('pt-br')

function CurrentDate() {
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const getFirstWordBeforeDash = (str: string) => {
    const parts = str.split('-')
    return parts[0]
  }

  const currentDay = dayjs().format('dddd')
  const capitalizedCurrentDay = capitalizeFirstLetter(
    getFirstWordBeforeDash(currentDay),
  )

  const currentDayOfMonth = dayjs().format('D')
  const currentMonth = dayjs().format('MMMM')

  const formattedDate = `${capitalizedCurrentDay}, ${currentDayOfMonth} de ${currentMonth}`

  return <div>{formattedDate}</div>
}

export default CurrentDate
