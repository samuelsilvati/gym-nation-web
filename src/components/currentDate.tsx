import React from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.locale('pt-br')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Sao_Paulo')

export function getCurrentDayInBrazil() {
  return dayjs().tz('America/Sao_Paulo').day() + 1
}

function CurrentDate() {
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const getFirstWordBeforeDash = (str: string) => {
    const parts = str.split('-')
    return parts[0]
  }

  const date = dayjs().tz('America/Sao_Paulo')

  const currentDay = date.format('dddd')
  const capitalizedCurrentDay = capitalizeFirstLetter(
    getFirstWordBeforeDash(currentDay),
  )

  const currentDayOfMonth = date.format('D')
  const currentMonth = date.format('MMMM')

  const formattedDate = `${capitalizedCurrentDay}, ${currentDayOfMonth} de ${currentMonth}`

  return <div>{formattedDate}</div>
}

export default CurrentDate
