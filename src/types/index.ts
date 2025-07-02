export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  stock: number;
  price: number;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface Bid {
  id: string;
  collection_id: string;
  price: number;
  user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface CollectionWithBids extends Collection {
  bids: BidWithUser[];
  owner: User;
}

export interface BidWithUser extends Bid {
  user: User;
}

export interface CreateCollectionRequest {
  name: string;
  description: string;
  stock: number;
  price: number;
  owner_id: string;
}

export interface UpdateCollectionRequest {
  name?: string;
  description?: string;
  stock?: number;
  price?: number;
}

export interface CreateBidRequest {
  collection_id: string;
  price: number;
  user_id: string;
}

export interface UpdateBidRequest {
  price?: number;
  status?: 'pending' | 'accepted' | 'rejected';
}

export interface AcceptBidRequest {
  collection_id: string;
  bid_id: string;
}