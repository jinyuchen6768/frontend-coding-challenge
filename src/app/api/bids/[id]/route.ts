import { NextRequest, NextResponse } from 'next/server'
import { mockData } from '@/data/mockData'
import { Bid, UpdateBidRequest } from '@/types'

// In-memory storage (in a real app, this would be a database)
const bids: Bid[] = [...mockData.bids]
const users = [...mockData.users]

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    const bid = bids.find(b => b.id === params.id)
    
    if (!bid) {
      return NextResponse.json(
        { error: 'Bid not found' },
        { status: 404 }
      )
    }
    
    const user = users.find(u => u.id === bid.user_id)!
    
    return NextResponse.json({
      bid: {
        ...bid,
        user
      }
    })
  } catch (error) {
    console.error('Error fetching bid:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bid' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    const body: UpdateBidRequest = await request.json()
    
    const bidIndex = bids.findIndex(b => b.id === params.id)
    
    if (bidIndex === -1) {
      return NextResponse.json(
        { error: 'Bid not found' },
        { status: 404 }
      )
    }
    
    // Update bid
    const updatedBid = {
      ...bids[bidIndex],
      ...body,
      updated_at: new Date().toISOString(),
    }
    
    bids[bidIndex] = updatedBid
    
    const user = users.find(u => u.id === updatedBid.user_id)!
    
    return NextResponse.json({
      bid: {
        ...updatedBid,
        user
      },
      message: 'Bid updated successfully'
    })
  } catch (error) {
    console.error('Error updating bid:', error)
    return NextResponse.json(
      { error: 'Failed to update bid' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    const bidIndex = bids.findIndex(b => b.id === params.id)
    
    if (bidIndex === -1) {
      return NextResponse.json(
        { error: 'Bid not found' },
        { status: 404 }
      )
    }
    
    // Remove bid
    bids.splice(bidIndex, 1)
    
    return NextResponse.json({
      message: 'Bid deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting bid:', error)
    return NextResponse.json(
      { error: 'Failed to delete bid' },
      { status: 500 }
    )
  }
}