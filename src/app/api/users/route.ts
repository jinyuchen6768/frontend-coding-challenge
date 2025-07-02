import { NextResponse } from 'next/server'
import { mockData } from '@/data/mockData'

const users = [...mockData.users]

export async function GET() {
  try {
    return NextResponse.json({
      users,
      total: users.length
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}