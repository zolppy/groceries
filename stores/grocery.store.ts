import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v7 as uuid, UUIDTypes } from "uuid";
import { GroceryOut, GroceryIn, GroceryUpdate } from "@/types/grocery.type";
import {
  GroceryOut as GroceryOutSchema,
  GroceryUpdate as GroceryUpdateSchema,
} from "@/schemas/grocery.schema";

type useGroceryStoreReturn = {
  groceries: GroceryOut[];
  addGrocery: (grocery: GroceryIn) => void;
  updateGrocery: (id: UUIDTypes, grocery: GroceryUpdate) => void;
  deleteGrocery: (id: UUIDTypes) => void;
};

const useGroceryStore = create<useGroceryStoreReturn>()(
  persist(
    (set) => ({
      groceries: [],
      addGrocery: (grocery: GroceryIn) => {
        set((state) => {
          const groceryToAdd = { ...grocery, id: uuid() };
          GroceryOutSchema.parse(groceryToAdd);
          return { groceries: [...state.groceries, groceryToAdd] };
        });
      },
      updateGrocery: (id: UUIDTypes, grocery: GroceryUpdate) => {
        set((state) => {
          const index = state.groceries.findIndex((g) => g.id === id);
          if (index === -1) {
            console.warn(`Grocery with id ${id} not found`);
            return state;
          }
          const existingGrocery = state.groceries[index];
          GroceryUpdateSchema.parse(grocery);
          const updatedGrocery = { ...existingGrocery, ...grocery };
          GroceryOutSchema.parse(updatedGrocery);
          const newGroceries = [...state.groceries];
          newGroceries[index] = updatedGrocery;
          return { groceries: newGroceries };
        });
      },
      deleteGrocery: (id: UUIDTypes) => {
        set((state) => ({
          groceries: state.groceries.filter((grocery) => grocery.id !== id),
        }));
      },
    }),
    { name: "grocery-storage" },
  ),
);

export { useGroceryStore };
