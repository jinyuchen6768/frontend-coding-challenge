import { NextRequest, NextResponse } from 'next/server'
import { mockData } from '@/data/mockData'
import { Collection, CreateCollectionRequest, CollectionWithBids } from '@/types'
import { generateId } from '@/lib/utils'

// In-memory storage (in a real app, this would be a database)
const collections: Collection[] = [...mockData.collections]
const bids = [...mockData.bids]
const users = [...mockData.users]

export async function GET() {
  try {
    // Create collections with bids and owner information
    const collectionsWithBids: CollectionWithBids[] = collections.map(collection => {
      const collectionBids = bids
        .filter(bid => bid.collection_id === collection.id)
        .map(bid => ({
          ...bid,
          user: users.find(user => user.id === bid.user_id)!
        }))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      
      const owner = users.find(user => user.id === collection.owner_id)!
      
      return {
        ...collection,
        bids: collectionBids,
        owner
      }
    })
    
    // Sort by created_at desc
    collectionsWithBids.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    
    return NextResponse.json({
      collections: collectionsWithBids,
      total: collectionsWithBids.length
    })
  } catch (error) {
    console.error('Error fetching collections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateCollectionRequest = await request.json()
    
    // Validate required fields
    if (!body.name || !body.description || !body.owner_id) {
      return NextResponse.json(
        { error: 'Name, description, and owner_id are required' },
        { status: 400 }
      )
    }
    
    // Validate owner exists
    const owner = users.find(user => user.id === body.owner_id)
    if (!owner) {
      return NextResponse.json(
        { error: 'Owner not found' },
        { status: 404 }
      )
    }
    
    // Create new collection
    const newCollection: Collection = {
      id: generateId(),
      name: body.name,
      description: body.description,
      stock: body.stock || 1,
      price: body.price || 0,
      owner_id: body.owner_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    collections.push(newCollection)
    
    // Return the collection with owner and empty bids array
    const collectionWithBids: CollectionWithBids = {
      ...newCollection,
      bids: [],
      owner
    }
    
    return NextResponse.json({
      collection: collectionWithBids,
      message: 'Collection created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating collection:', error)
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    )
  }
}