import { NextRequest, NextResponse } from 'next/server'
import { mockData } from '@/data/mockData'
import { Bid } from '@/types'

// In-memory storage (in a real app, this would be a database)
const bids: Bid[] = [...mockData.bids]
const users = [...mockData.users]

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    const bidToAccept = bids.find(b => b.id === params.id)
    
    if (!bidToAccept) {
      return NextResponse.json(
        { error: 'Bid not found' },
        { status: 404 }
      )
    }
    
    if (bidToAccept.status !== 'pending') {
      return NextResponse.json(
        { error: 'Only pending bids can be accepted' },
        { status: 400 }
      )
    }
    
    // Accept the selected bid
    const acceptedBidIndex = bids.findIndex(b => b.id === params.id)
    bids[acceptedBidIndex] = {
      ...bidToAccept,
      status: 'accepted',
      updated_at: new Date().toISOString(),
    }
    
    // Reject all other pending bids for the same collection
    bids.forEach((bid, index) => {
      if (
        bid.collection_id === bidToAccept.collection_id &&
        bid.id !== params.id &&
        bid.status === 'pending'
      ) {
        bids[index] = {
          ...bid,
          status: 'rejected',
          updated_at: new Date().toISOString(),
        }
      }
    })
    
    const user = users.find(u => u.id === bids[acceptedBidIndex].user_id)!
    
    return NextResponse.json({
      bid: {
        ...bids[acceptedBidIndex],
        user
      },
      message: 'Bid accepted successfully. Other pending bids have been rejected.'
    })
  } catch (error) {
    console.error('Error accepting bid:', error)
    return NextResponse.json(
      { error: 'Failed to accept bid' },
      { status: 500 }
    )
  }
}