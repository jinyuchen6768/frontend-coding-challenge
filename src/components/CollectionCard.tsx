'use client'

import { useState } from 'react'
import { CollectionWithBids, User } from '@/types'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Edit, Trash2, Plus, Check, X } from 'lucide-react'
import { BidList } from './BidList'
import { CreateBidModal } from './CreateBidModal'
import { EditCollectionModal } from './EditCollectionModal'

interface CollectionCardProps {
  collection: CollectionWithBids
  currentUser: User
  onCollectionUpdate: () => void
  onCollectionDelete: (id: string) => void
  onBidCreate: () => void
  onBidAccept: (bidId: string) => void
}

export function CollectionCard({
  collection,
  currentUser,
  onCollectionUpdate,
  onCollectionDelete,
  onBidCreate,
  onBidAccept,
}: CollectionCardProps) {
  const [showBids, setShowBids] = useState(false)
  const [showCreateBid, setShowCreateBid] = useState(false)
  const [showEditCollection, setShowEditCollection] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isOwner = collection.owner_id === currentUser.id
  const userBid = collection.bids.find(bid => bid.user_id === currentUser.id)
  const acceptedBid = collection.bids.find(bid => bid.status === 'accepted')

  const highestBid = collection.bids.length > 0 
    ? Math.max(...collection.bids.map(bid => bid.price))
    : null

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this collection?')) return
    
    setIsDeleting(true)
    try {
      await onCollectionDelete(collection.id)
    } catch (error) {
      console.error('Error deleting collection:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleBidAccept = async (bidId: string) => {
    if (!confirm('Are you sure you want to accept this bid? This will reject all other pending bids.')) return
    
    try {
      await onBidAccept(bidId)
    } catch (error) {
      console.error('Error accepting bid:', error)
    }
  }

  return (
    <>
      <div className="border rounded-lg p-6 bg-card text-card-foreground">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">{collection.name}</h3>
            <p className="text-muted-foreground mb-2">{collection.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Owner: {collection.owner.name}</span>
              <span>Stock: {collection.stock}</span>
              <span>Price: {formatCurrency(collection.price)}</span>
              {highestBid && (
                <span className="text-green-600 font-medium">
                  Highest Bid: {formatCurrency(highestBid)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isOwner ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEditCollection(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                {!userBid && !acceptedBid && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setShowCreateBid(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Place Bid
                  </Button>
                )}
                {userBid && userBid.status === 'pending' && (
                  <span className="text-yellow-600 text-sm font-medium">
                    Bid Pending: {formatCurrency(userBid.price)}
                  </span>
                )}
                {userBid && userBid.status === 'accepted' && (
                  <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                    <Check className="h-4 w-4" />
                    Bid Accepted: {formatCurrency(userBid.price)}
                  </span>
                )}
                {userBid && userBid.status === 'rejected' && (
                  <span className="text-red-600 text-sm font-medium flex items-center gap-1">
                    <X className="h-4 w-4" />
                    Bid Rejected: {formatCurrency(userBid.price)}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {acceptedBid && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 font-medium">
              ✅ Accepted Bid: {formatCurrency(acceptedBid.price)} by {acceptedBid.user.name}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Created: {formatDate(collection.created_at)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBids(!showBids)}
          >
            {showBids ? 'Hide' : 'Show'} Bids ({collection.bids.length})
          </Button>
        </div>

        {showBids && (
          <div className="mt-4 border-t pt-4">
            <BidList
              bids={collection.bids}
              isOwner={isOwner}
              onBidAccept={handleBidAccept}
            />
          </div>
        )}
      </div>

      {showCreateBid && (
        <CreateBidModal
          collectionId={collection.id}
          currentUserId={currentUser.id}
          collectionPrice={collection.price}
          open={showCreateBid}
          onOpenChange={setShowCreateBid}
          onSuccess={() => {
            setShowCreateBid(false)
            onBidCreate()
          }}
        />
      )}

      {showEditCollection && (
        <EditCollectionModal
          collection={collection}
          open={showEditCollection}
          onOpenChange={setShowEditCollection}
          onSuccess={() => {
            setShowEditCollection(false)
            onCollectionUpdate()
          }}
        />
      )}
    </>
  )
}