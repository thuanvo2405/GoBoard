CREATE TABLE tokens (
    hash bytea PRIMARY KEY,
    user_id bigint NOT NULL REFERENCES users ON DELETE CASCADE,
    expiry TIMESTAMP NOT NULL,
    scope TEXT NOT NULL
);
