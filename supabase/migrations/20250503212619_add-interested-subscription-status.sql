-- Add 'interested' to subscription_status enum
ALTER TYPE subscription_status ADD VALUE IF NOT EXISTS 'interested'; 