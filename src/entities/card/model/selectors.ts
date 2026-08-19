import { Id } from "@/src/shared/types/normalized";
import { RootState } from "@/src/store";
import { cardsAdapter } from "@/src/store/slices/boardSlice";
import { createSelector } from "@reduxjs/toolkit";

const cardSelectors = cardsAdapter.getSelectors((state:RootState)=>state.board.cards)

export const selectCardById = cardSelectors.selectById
export const selectAllCards = cardSelectors.selectAll;

export const selectCardsByColumnId = createSelector(
  [
    (state: RootState) => state.board.columns.entities,
    (state: RootState) => state.board.cards.entities,
    (_state: RootState, columnId: Id) => columnId,
  ],
  (columnsEntities, cardsEntities, columnId) => {
    const column = columnsEntities[columnId]

    if(!column) return [];
    
    return column.cardIds
      .map((cardId) => cardsEntities[cardId])
      .filter((card): card is NonNullable<typeof card> => Boolean(card) && !card.isArchived);
  },
);
