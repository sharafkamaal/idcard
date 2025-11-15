import { z } from 'zod';

export const schoolSchema = z.object({
  schoolType: z.enum(['single', 'multiBranch']),
  schoolName: z.string().min(1, 'School name is required'),
  phoneNo: z.string().min(1, 'Phone number is required'),
  altPhoneNo: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pinCode: z.string().min(1, 'Pin code is required'),
  schoolPointOfContact: z.string().optional(),
  pointOfContactPhone: z.string().optional(),
  status: z.string().min(1, 'Status is required'),
  verified: z.boolean(),
  logoUrl: z.string().optional(),
  idCardDesignUrl: z.string().optional(),
  selectLayoutOfIdCard: z.enum(['vertical_id', 'horizontal_id']),
  sessionDisplayOnCard: z.boolean(),
  pdfDownloadAccess: z.boolean(),
  idCardsNoType: z.enum(['Roll No', 'Admission No']),
  session: z.string().optional(),
});
