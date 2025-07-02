import { NextRequest, NextResponse } from 'next/server'
import { mockData } from '@/data/mockData'
import { Bid, CreateBidRequest, BidWithUser } from '@/types'
import { generateId } from '@/lib/utils'

// In-memory storage (in a real app, this would be a database)
const bids: Bid[] = [...mockData.bids]
const users = [...mockData.users]
const collections = [...mockData.collections]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const collectionId = searchParams.get('collection_id')
    
    if (!collectionId) {
      return NextResponse.json(
        { error: 'collection_id parameter is required' },
        { status: 400 }
      )
    }
    
    // Filter bids by collection_id
    const collectionBids = bids
      .filter(bid => bid.collection_id === collectionId)
      .map(bid => ({
        ...bid,
        user: users.find(user => user.id === bid.user_id)!
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    
    return NextResponse.json({
      bids: collectionBids,
      total: collectionBids.length
    })
  } catch (error) {
    console.error('Error fetching bids:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bids' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateBidRequest = await request.json()
    
    // Validate required fields
    if (!body.collection_id || !body.user_id || body.price === undefined) {
      return NextResponse.json(
        { error: 'collection_id, user_id, and price are required' },
        { status: 400 }
      )
    }
    
    // Validate collection exists
    const collection = collections.find(c => c.id === body.collection_id)
    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }
    
    // Validate user exists
    const user = users.find(u => u.id === body.user_id)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Validate user is not the collection owner
    if (collection.owner_id === body.user_id) {
      return NextResponse.json(
        { error: 'Collection owner cannot bid on their own collection' },
        { status: 400 }
      )
    }
    
    // Check if user already has a pending bid for this collection
    const existingBid = bids.find(bid => 
      bid.collection_id === body.collection_id && 
      bid.user_id === body.user_id && 
      bid.status === 'pending'
    )
    
    if (existingBid) {
      return NextResponse.json(
        { error: 'You already have a pending bid for this collection' },
        { status: 400 }
      )
    }
    
    // Create new bid
    const newBid: Bid = {
      id: generateId(),
      collection_id: body.collection_id,
      price: body.price,
      user_id: body.user_id,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    bids.push(newBid)
    
    // Return the bid with user information
    const bidWithUser: BidWithUser = {
      ...newBid,
      user
    }
    
    return NextResponse.json({
      bid: bidWithUser,
      message: 'Bid created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating bid:', error)
    return NextResponse.json(
      { error: 'Failed to create bid' },
      { status: 500 }
    )
  }
}