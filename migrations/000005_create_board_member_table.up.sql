CREATE TABLE IF NOT EXISTS board_members (
	board_id INT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
	user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	PRIMARY KEY (board_id, user_id)
);
