'use client'

import { User } from '@/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface UserSelectorProps {
  users: User[]
  currentUser: User
  onUserChange: (userId: string) => void
}

export function UserSelector({ users, currentUser, onUserChange }: UserSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="user-select">Current User (Mock Authentication)</Label>
      <Select value={currentUser.id} onValueChange={onUserChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a user" />
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.name} ({user.email})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}