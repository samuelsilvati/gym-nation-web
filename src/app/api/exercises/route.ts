import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { nextAuthOptions } from '../auth/[...nextauth]/route'

export async function GET(request: Request) {
  const session = await getServerSession(nextAuthOptions)
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const traineeId = searchParams.get('traineeId')
  let url = `${process.env.API_URL}/exercises-by-day-of-week/${id}`
  if (traineeId) {
    url += `?traineeId=${traineeId}`
  }
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user.token}`,
    },
  })
  const exercises = await res.json()

  return NextResponse.json(exercises)
}

export async function POST(request: Request) {
  const data = await request.json()
  const session = await getServerSession(nextAuthOptions)
  const res = await fetch(`${process.env.API_URL}/exercise-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user.token}`,
    },
    body: JSON.stringify(data),
  })

  const response = await res.json()
  return NextResponse.json(response)
}

export async function DELETE(request: Request) {
  const session = await getServerSession(nextAuthOptions)
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const res = await fetch(`${process.env.API_URL}/exercise/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user.token}`,
    },
  })
  if (!res.ok) {
    return NextResponse.error()
  }
  const exercises = await res.json()

  return NextResponse.json(exercises)
}
