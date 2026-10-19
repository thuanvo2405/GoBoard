CREATE TABLE IF NOT EXISTS lists (
    id bigserial PRIMARY KEY,
    board_id bigint NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    position INTEGER NOT NULL
);
