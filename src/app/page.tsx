'use client'

import { useState, useEffect } from 'react'
import { CollectionWithBids, User } from '@/types'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCw } from 'lucide-react'
import { CollectionCard } from '@/components/CollectionCard'
import { CreateCollectionModal } from '@/components/CreateCollectionModal'
import { UserSelector } from '@/components/UserSelector'

export default function Home() {
  const [collections, setCollections] = useState<CollectionWithBids[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateCollection, setShowCreateCollection] = useState(false)

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        if (data.users.length > 0 && !currentUser) {
          setCurrentUser(data.users[0])
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  // Fetch collections
  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections')
      if (response.ok) {
        const data = await response.json()
        setCollections(data.collections)
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initial data load
  useEffect(() => {
    Promise.all([fetchUsers(), fetchCollections()])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle user change
  const handleUserChange = (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      setCurrentUser(user)
    }
  }

  // Handle collection deletion
  const handleCollectionDelete = async (collectionId: string) => {
    try {
      const response = await fetch(`/api/collections/${collectionId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        await fetchCollections() // Refresh collections
      } else {
        throw new Error('Failed to delete collection')
      }
    } catch (error) {
      console.error('Error deleting collection:', error)
      alert('Failed to delete collection')
    }
  }

  // Handle bid acceptance
  const handleBidAccept = async (bidId: string) => {
    try {
      const response = await fetch(`/api/bids/${bidId}/accept`, {
        method: 'POST',
      })
      
      if (response.ok) {
        await fetchCollections() // Refresh collections to show updated bid statuses
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to accept bid')
      }
    } catch (error) {
      console.error('Error accepting bid:', error)
      alert(error instanceof Error ? error.message : 'Failed to accept bid')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading bidding system...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No users available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Luxor Bidding System</h1>
            <p className="text-muted-foreground">
              Place bids on collections and manage your items
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={fetchCollections}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              onClick={() => setShowCreateCollection(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Collection
            </Button>
          </div>
        </div>

        {/* User Selector */}
        <div className="mb-8 max-w-md">
          <UserSelector
            users={users}
            currentUser={currentUser}
            onUserChange={handleUserChange}
          />
        </div>

        {/* Collections */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
              Collections ({collections.length})
            </h2>
          </div>
          
          {collections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No collections available</p>
              <Button onClick={() => setShowCreateCollection(true)}>
                Create your first collection
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {collections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  currentUser={currentUser}
                  onCollectionUpdate={fetchCollections}
                  onCollectionDelete={handleCollectionDelete}
                  onBidCreate={fetchCollections}
                  onBidAccept={handleBidAccept}
                />
              ))}
            </div>
          )}
        </div>

        {/* Create Collection Modal */}
        {showCreateCollection && (
          <CreateCollectionModal
            currentUserId={currentUser.id}
            open={showCreateCollection}
            onOpenChange={setShowCreateCollection}
            onSuccess={() => {
              setShowCreateCollection(false)
              fetchCollections()
            }}
          />
        )}
      </div>
    </div>
  )
}
