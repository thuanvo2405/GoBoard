import type { Board } from "./Board";

export type WorkspaceContext = {
    boards: Board[];
    onBoardCreated: (board: Board) => void;
};
