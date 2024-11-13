// src/main/resources/db/migration/V2__Add_user_details.sql
ALTER TABLE users
ADD COLUMN first_name VARCHAR(50),
ADD COLUMN last_name VARCHAR(50),
ADD COLUMN active BOOLEAN DEFAULT true;