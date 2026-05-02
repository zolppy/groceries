import z from "zod";
import { GroceryOut, GroceryIn, GroceryUpdate } from "@/schemas/grocery.schema";

type GroceryOut = z.infer<typeof GroceryOut>;

type GroceryIn = z.infer<typeof GroceryIn>;

type GroceryUpdate = z.infer<typeof GroceryUpdate>;

export type { GroceryOut, GroceryIn, GroceryUpdate };
