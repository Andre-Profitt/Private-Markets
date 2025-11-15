export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  userId: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  address?: Address;
  accreditationStatus?: AccreditationStatus;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface AccreditationStatus {
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  verifiedAt?: Date;
  expiresAt?: Date;
}
