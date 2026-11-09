import type { Board } from "@/types/Board";
import { mockBoard } from "./kanban";

// Fake seed data. Board 1 matches the existing lists and cards in kanban.ts.
// The other boards start empty and have no associated lists or cards.
export const mockBoards: Board[] = [
    {
        ...mockBoard,
    },
    {
        id: 2,
        user_id: 1,
        name: "Design workspace",
        created_at: "2026-10-20T08:00:00Z",
        is_public: false,
    },
    {
        id: 3,
        user_id: 1,
        name: "Marketing plan",
        created_at: "2026-10-21T08:00:00Z",
        is_public: false,
    },
    {
        id: 4,
        user_id: 1,
        name: "Team tasks",
        created_at: "2026-10-22T08:00:00Z",
        is_public: false,
    },
    {
        id: 5,
        user_id: 1,
        name: "Personal projects",
        created_at: "2026-10-23T08:00:00Z",
        is_public: false,
    },
];
