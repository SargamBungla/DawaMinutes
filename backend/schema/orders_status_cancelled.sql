-- If `orders.status` is ENUM, add Cancelled (example — adjust to match your ENUM list):
-- ALTER TABLE orders MODIFY COLUMN status ENUM('Pending','Packed','Out for Delivery','Delivered','Cancelled') NOT NULL DEFAULT 'Pending';

-- Or use VARCHAR so any status is allowed:
-- ALTER TABLE orders MODIFY COLUMN status VARCHAR(32) NOT NULL DEFAULT 'Pending';
