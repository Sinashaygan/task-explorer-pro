import { selectCardsByColumnId } from "@/src/entities/card/model/selectors";
import { Column } from "@/src/shared/types/normalized";
import { useAppDispatch, useAppSelector } from "@/src/store/hook";

interface BoardColumnProps {
  column: Column;
}

export function BoardColumn({ column }: BoardColumnProps) {
    const dispatch = useAppDispatch()

    const cards = useAppSelector((state) =>
      selectCardsByColumnId(state, column.id),
    );
}
