import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
  decimal,
} from 'drizzle-orm/mysql-core';

// ── MARATHAX Registrations ────────────────────────────────────────────────────
// status flow: pending → paid | failed | cancelled
// A registration row is created when the Razorpay order is created.
// It moves to 'paid' only when the webhook fires with a verified signature.

export const marathaxRegistrations = mysqlTable('marathax_registrations', {
  id:              int('id').primaryKey().autoincrement(),

  // Athlete info
  fullName:        varchar('full_name',    { length: 255 }).notNull(),
  email:           varchar('email',        { length: 255 }).notNull(),
  phone:           varchar('phone',        { length: 20  }).notNull(),
  age:             varchar('age',          { length: 10  }).notNull().default(''),
  gender:          varchar('gender',       { length: 20  }).notNull().default(''),
  bloodGroup:      varchar('blood_group',  { length: 10  }).notNull().default(''),
  category:        varchar('category',     { length: 100 }).notNull(),

  // Payment
  feePaise:        int('fee_paise').notNull(),          // locked at order creation
  razorpayOrderId: varchar('razorpay_order_id', { length: 100 }).notNull().unique(),
  razorpayPaymentId: varchar('razorpay_payment_id', { length: 100 }).default(''),
  razorpaySignature: text('razorpay_signature').default(''),
  amountPaidPaise: int('amount_paid_paise').default(0), // from webhook

  // Extended athlete info
  dob:             varchar('dob',             { length: 20  }).notNull().default(''),
  whatsapp:        varchar('whatsapp',        { length: 20  }).notNull().default(''),
  city:            varchar('city',            { length: 100 }).notNull().default(''),
  state:           varchar('state',           { length: 100 }).notNull().default(''),
  address:         text('address').notNull().default(''),
  emergencyContact: varchar('emergency_contact', { length: 255 }).notNull().default(''),
  emergencyPhone:  varchar('emergency_phone', { length: 20  }).notNull().default(''),

  // Guardian (under 18)
  guardianName:    varchar('guardian_name',   { length: 255 }).default(''),
  guardianPhone:   varchar('guardian_phone',  { length: 20  }).default(''),
  guardianConsent: varchar('guardian_consent',{ length: 5   }).default(''),

  // Health & medical
  medicalCondition: varchar('medical_condition', { length: 5 }).notNull().default('no'),
  medicalDetails:  text('medical_details').default(''),

  // Declarations
  photoConsent:    varchar('photo_consent',   { length: 5   }).notNull().default('no'),
  rulesAccepted:   varchar('rules_accepted',  { length: 5   }).notNull().default('no'),
  digitalSignature: varchar('digital_signature', { length: 255 }).notNull().default(''),

  // Payment confirmation
  utrNumber:       varchar('utr_number',      { length: 100 }).notNull().default(''),
  paymentDate:     varchar('payment_date',    { length: 20  }).notNull().default(''),
  paymentAmount:   varchar('payment_amount',  { length: 20  }).notNull().default(''),
  screenshotPath:  varchar('screenshot_path', { length: 500 }).default(''),

  // Registration
  status:          varchar('status', { length: 20 }).notNull().default('pending_upi'),
  // pending_upi | confirmed | failed
  regCode:         varchar('reg_code',  { length: 30 }).default(''),
  passRefId:       varchar('pass_ref_id', { length: 40 }).default(''),
  emailSentAt:     timestamp('email_sent_at'),

  createdAt:       timestamp('created_at').defaultNow().notNull(),
  updatedAt:       timestamp('updated_at').defaultNow().onUpdateNow().notNull(),

  // Decimal for display — mirrors feePaise / 100
  feeDisplay:      decimal('fee_display', { precision: 10, scale: 2 }).notNull().default('0.00'),
});
