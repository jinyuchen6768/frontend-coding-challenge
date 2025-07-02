'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/lib/utils'

const createBidSchema = z.object({
  price: z.number().min(0, 'Price must be positive'),
})

type CreateBidForm = z.infer<typeof createBidSchema>

interface CreateBidModalProps {
  collectionId: string
  currentUserId: string
  collectionPrice: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateBidModal({
  collectionId,
  currentUserId,
  collectionPrice,
  open,
  onOpenChange,
  onSuccess,
}: CreateBidModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,

  } = useForm<CreateBidForm>({
    resolver: zodResolver(createBidSchema),
    defaultValues: {
      price: collectionPrice,
    },
  })

  const onSubmit = async (data: CreateBidForm) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/bids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collection_id: collectionId,
          user_id: currentUserId,
          price: data.price,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create bid')
      }

      reset()
      onSuccess()
    } catch (error) {
      console.error('Error creating bid:', error)
      setError(error instanceof Error ? error.message : 'Failed to create bid')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset()
      setError(null)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Place a Bid</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="price">Bid Amount</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="Enter your bid amount"
              {...register('price', { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Current price: {formatCurrency(collectionPrice)}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}