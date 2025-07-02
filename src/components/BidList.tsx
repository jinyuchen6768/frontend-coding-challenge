'use client'

import { BidWithUser } from '@/types'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Check } from 'lucide-react'

interface BidListProps {
  bids: BidWithUser[]
  isOwner: boolean
  onBidAccept: (bidId: string) => void
}

export function BidList({ bids, isOwner, onBidAccept }: BidListProps) {
  if (bids.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No bids yet. Be the first to place a bid!
      </div>
    )
  }

  const sortedBids = [...bids].sort((a, b) => b.price - a.price)
  const pendingBids = sortedBids.filter(bid => bid.status === 'pending')
  const acceptedBids = sortedBids.filter(bid => bid.status === 'accepted')
  const rejectedBids = sortedBids.filter(bid => bid.status === 'rejected')

  const getBidStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const renderBidGroup = (bids: BidWithUser[], title: string) => {
    if (bids.length === 0) return null

    return (
      <div className="mb-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">{title}</h4>
        <div className="space-y-2">
          {bids.map((bid) => (
            <div
              key={bid.id}
              className={`p-3 rounded-md border ${getBidStatusColor(bid.status)}`}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{formatCurrency(bid.price)}</span>
                    <span className="text-sm">by {bid.user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(bid.created_at)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Status: {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                  </div>
                </div>
                
                {isOwner && bid.status === 'pending' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onBidAccept(bid.id)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Bids ({bids.length})</h3>
      
      {renderBidGroup(acceptedBids, 'Accepted')}
      {renderBidGroup(pendingBids, 'Pending')}
      {renderBidGroup(rejectedBids, 'Rejected')}
    </div>
  )
}