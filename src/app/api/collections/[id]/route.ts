import { NextRequest, NextResponse } from 'next/server'
import { mockData } from '@/data/mockData'
import { Collection, UpdateCollectionRequest } from '@/types'

// In-memory storage (in a real app, this would be a database)
const collections: Collection[] = [...mockData.collections]
const users = [...mockData.users]

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    const collection = collections.find(c => c.id === params.id)
    
    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }
    
    const owner = users.find(user => user.id === collection.owner_id)!
    
    return NextResponse.json({
      collection: {
        ...collection,
        owner
      }
    })
  } catch (error) {
    console.error('Error fetching collection:', error)
    return NextResponse.json(
      { error: 'Failed to fetch collection' },
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
    const body: UpdateCollectionRequest = await request.json()
    
    const collectionIndex = collections.findIndex(c => c.id === params.id)
    
    if (collectionIndex === -1) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }
    
    // Update collection
    const updatedCollection = {
      ...collections[collectionIndex],
      ...body,
      updated_at: new Date().toISOString(),
    }
    
    collections[collectionIndex] = updatedCollection
    
    const owner = users.find(user => user.id === updatedCollection.owner_id)!
    
    return NextResponse.json({
      collection: {
        ...updatedCollection,
        owner
      },
      message: 'Collection updated successfully'
    })
  } catch (error) {
    console.error('Error updating collection:', error)
    return NextResponse.json(
      { error: 'Failed to update collection' },
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
    const collectionIndex = collections.findIndex(c => c.id === params.id)
    
    if (collectionIndex === -1) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }
    
    // Remove collection
    collections.splice(collectionIndex, 1)
    
    return NextResponse.json({
      message: 'Collection deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting collection:', error)
    return NextResponse.json(
      { error: 'Failed to delete collection' },
      { status: 500 }
    )
  }
}