-- Create index for blogs sorted by created_at DESC to optimize sorting speed
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs (created_at DESC);
