CREATE TABLE IF NOT EXISTS list_card_orders (
    list_id bigint PRIMARY KEY REFERENCES lists ON DELETE CASCADE,
    card_ids bigint[] NOT NULL DEFAULT '{}'
);
