import { User, Collection, Bid } from '@/types'

const USERS: User[] = [
  { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 'user-2', name: 'Bob Smith', email: 'bob@example.com' },
  { id: 'user-3', name: 'Carol Davis', email: 'carol@example.com' },
  { id: 'user-4', name: 'David Wilson', email: 'david@example.com' },
  { id: 'user-5', name: 'Emma Brown', email: 'emma@example.com' },
  { id: 'user-6', name: 'Frank Miller', email: 'frank@example.com' },
  { id: 'user-7', name: 'Grace Taylor', email: 'grace@example.com' },
  { id: 'user-8', name: 'Henry Anderson', email: 'henry@example.com' },
  { id: 'user-9', name: 'Isabel Thomas', email: 'isabel@example.com' },
  { id: 'user-10', name: 'Jack Robinson', email: 'jack@example.com' },
  { id: 'user-11', name: 'Karen White', email: 'karen@example.com' },
  { id: 'user-12', name: 'Leo Martinez', email: 'leo@example.com' },
]

const COLLECTION_CATEGORIES = [
  'Art',
  'Photography',
  'Digital Art',
  'Vintage Collectibles',
  'Sports Memorabilia',
  'Comic Books',
  'Trading Cards',
  'Antiques',
  'Rare Books',
  'Jewelry',
  'Watches',
  'Coins',
  'Stamps',
  'Music Memorabilia',
  'Movie Props',
]

const COLLECTION_ADJECTIVES = [
  'Rare',
  'Vintage',
  'Limited Edition',
  'Authentic',
  'Premium',
  'Exclusive',
  'Collectible',
  'Historic',
  'Unique',
  'Original',
  'Certified',
  'Pristine',
  'Classic',
  'Legendary',
  'Iconic',
]

function generateRandomCollection(id: string): Collection {
  const category = COLLECTION_CATEGORIES[Math.floor(Math.random() * COLLECTION_CATEGORIES.length)]
  const adjective = COLLECTION_ADJECTIVES[Math.floor(Math.random() * COLLECTION_ADJECTIVES.length)]
  const number = Math.floor(Math.random() * 1000) + 1
  
  const name = `${adjective} ${category} #${number}`
  const basePrice = Math.floor(Math.random() * 10000) + 100
  const stock = Math.floor(Math.random() * 50) + 1
  const ownerId = USERS[Math.floor(Math.random() * USERS.length)].id
  
  const createdAt = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
  
  return {
    id,
    name,
    description: `A beautiful ${adjective.toLowerCase()} ${category.toLowerCase()} piece from a private collection. This item is in excellent condition and comes with authenticity verification.`,
    stock,
    price: basePrice,
    owner_id: ownerId,
    created_at: createdAt,
    updated_at: createdAt,
  }
}

function generateRandomBid(id: string, collectionId: string, collectionPrice: number): Bid {
  const userId = USERS[Math.floor(Math.random() * USERS.length)].id
  const bidPrice = Math.floor(collectionPrice * (0.7 + Math.random() * 0.6)) // 70-130% of collection price
  const statuses: Bid['status'][] = ['pending', 'pending', 'pending', 'pending', 'rejected'] // Most bids are pending
  const status = statuses[Math.floor(Math.random() * statuses.length)]
  
  const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
  
  return {
    id,
    collection_id: collectionId,
    price: bidPrice,
    user_id: userId,
    status,
    created_at: createdAt,
    updated_at: createdAt,
  }
}

export function generateMockData() {
  const collections: Collection[] = []
  const bids: Bid[] = []
  
  // Generate 120 collections
  for (let i = 1; i <= 120; i++) {
    const collection = generateRandomCollection(`collection-${i}`)
    collections.push(collection)
    
    // Generate 10-15 bids per collection
    const bidCount = Math.floor(Math.random() * 6) + 10
    for (let j = 1; j <= bidCount; j++) {
      const bid = generateRandomBid(`bid-${i}-${j}`, collection.id, collection.price)
      bids.push(bid)
    }
  }
  
  return {
    users: USERS,
    collections,
    bids,
  }
}

// Export static data
export const mockData = generateMockData()