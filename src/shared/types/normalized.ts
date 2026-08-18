// types/normalized.ts

export type Id = string | number;

export interface Card {
  id: Id;
  columnId: Id;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  order: number; // جهت حفظ ترتیب کارت‌ها در دیتابیس آینده
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: Id;
  title: string;
  cardIds: Id[]; // منبع اصلی ترتیب کارت‌ها (Order Source of Truth) در سطح UI
  color?: string;
  isCollapsed?: boolean;
}

export interface Board {
  id: Id;
  title: string;
  columnIds: Id[]; // ترتیب ستون‌ها روی برد
}
