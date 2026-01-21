-- Soft Delete Migration for Tasks Table
-- Run this SQL in phpMyAdmin or MySQL client

ALTER TABLE tasks 
ADD COLUMN deleted TINYINT(1) NOT NULL DEFAULT 0;

-- This adds a new column to track soft deleted tasks
-- 0 = task is active (not deleted)
-- 1 = task is soft deleted
