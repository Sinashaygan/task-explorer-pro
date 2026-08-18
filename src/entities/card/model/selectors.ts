import { RootState } from "@/src/store";
import { cardsAdapter } from "@/src/store/slices/boardSlice";

const cardSelectors = cardsAdapter.getSelectors((state:RootState)=>state.board.cards)