import z from "zod";

enum GroceryUnit {
  Un = "un",
  Kg = "kg",
  G = "g",
  L = "L",
  Ml = "ml",
  Pkg = "pct",
}

enum GroceryCategory {
  GrainsAndCereals = "Grãos e Cereais",
  Pulses = "Leguminosas",
  SeasoningsAndCondiments = "Temperos e Condimentos",
  FruitsVegetablesAndLegumes = "Frutas, Legumes e Verduras",
  Dairy = "Laticínios",
  Eggs = "Ovos",
  Beverages = "Bebidas",
  Oils = "Óleos",
  HygieneAndCleaning = "Higiene e Limpeza",
  Others = "Outros",
}

const GroceryIn = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  unit: z.enum(GroceryUnit).default(GroceryUnit.Un),
  quantity: z.number().positive(),
  inCart: z.boolean().default(false),
  category: z.enum(GroceryCategory),
  notes: z.string().max(200).optional(),
});

const GroceryUpdate = z
  .object({
    name: z.string(),
    price: z.number().positive(),
    unit: z.enum(GroceryUnit),
    quantity: z.number().positive(),
    inCart: z.boolean().default(false),
    category: z.enum(GroceryCategory),
    notes: z.string(),
  })
  .partial();

const GroceryOut = z.object({
  id: z.uuidv7(),
  name: z.string(),
  price: z.number().positive(),
  unit: z.enum(GroceryUnit),
  quantity: z.number().positive(),
  inCart: z.boolean(),
  category: z.enum(GroceryCategory),
  notes: z.string().max(200).optional(),
});

export { GroceryIn, GroceryUpdate, GroceryOut, GroceryUnit, GroceryCategory };
