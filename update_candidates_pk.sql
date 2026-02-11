-- SQL script to update candidates table primary key to include email
-- Run this manually in your Neon database if Prisma db push fails

-- Step 1: Make email NOT NULL if it's currently nullable
ALTER TABLE candidates ALTER COLUMN email SET NOT NULL;

-- Step 2: Drop the foreign key constraint temporarily
ALTER TABLE roles DROP CONSTRAINT IF EXISTS role;

-- Step 3: Drop the existing primary key
ALTER TABLE candidates DROP CONSTRAINT IF EXISTS candidates_pkey;

-- Step 4: Add unique constraint on cid (for foreign key reference)
ALTER TABLE candidates ADD CONSTRAINT candidates_cid_unique UNIQUE (cid);

-- Step 5: Add composite primary key
ALTER TABLE candidates ADD CONSTRAINT candidates_pkey PRIMARY KEY (cid, email);

-- Step 6: Recreate the foreign key constraint
ALTER TABLE roles ADD CONSTRAINT role FOREIGN KEY (rid) REFERENCES candidates(cid) ON DELETE NO ACTION ON UPDATE NO ACTION;
