export type UserRole = "ADMIN" | "ORGANIZER" | "ATTENDEE";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type CategoryStatus = "ACTIVE" | "INACTIVE";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
export type CommissionType = "PERCENT" | "FIXED";
export type CommissionStatus = "ACTIVE" | "INACTIVE";
export type NotificationType = "SYSTEM" | "EVENT" | "PAYMENT" | "PROMOTION";

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  errorCode?: string | null;
  timeStamp?: string;
}

export interface UserRecord {
  userId: number;
  roleId?: number;
  roleName?: UserRole;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  status?: UserStatus;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export interface UserPayload {
  roleId: number;
  fullName: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  status?: UserStatus;
}

export interface CategoryRecord {
  categoryId: number;
  categoryName: string;
  description?: string;
  status?: CategoryStatus;
  createdAt?: string;
}

export interface CategoryPayload {
  categoryName: string;
  description?: string;
  status?: CategoryStatus;
}

export interface EventRecord {
  eventId: number;
  title: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  bannerUrl?: string;
  venueName?: string;
  venueAddress?: string;
  city?: string;
  startTime?: string;
  endTime?: string;
  registrationDeadline?: string;
  publishStatus?: string;
  approvalStatus?: ApprovalStatus;
  organizer?: { organizerId?: number; userId?: number; name?: string; fullName?: string; email?: string };
  category?: { categoryId?: number; categoryName?: string };
  ticketTypes?: Array<{ ticketTypeId?: number; name?: string; price?: number; quantity?: number }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommissionConfig {
  commissionId: number;
  commissionName: string;
  commissionType: CommissionType;
  commissionValue: number;
  status?: CommissionStatus;
  applyFrom?: string;
  applyTo?: string;
  createdAt?: string;
}

export interface CommissionPayload {
  commissionName: string;
  commissionType: CommissionType;
  commissionValue: number;
  status?: CommissionStatus;
  applyFrom?: string;
  applyTo?: string;
}

export interface NotificationRecord {
  notificationId: number;
  userId?: number;
  title: string;
  message: string;
  type?: NotificationType;
  targetRole?: UserRole | "ALL";
  isRead?: boolean;
  createdAt?: string;
}

export interface NotificationPayload {
  title: string;
  message: string;
  type?: NotificationType;
  targetRole?: UserRole | "ALL";
  userId?: number;
}

export interface SystemReport {
  totalUsers: number;
  totalOrganizers: number;
  totalEvents: number;
  approvedEvents: number;
  pendingEvents: number;
  totalRevenue: number;
  totalCommission: number;
}
