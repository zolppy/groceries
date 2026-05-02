"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiCheck,
  FiShoppingCart,
  FiPackage,
  FiDollarSign,
  FiTag,
  FiHash,
  FiFileText,
} from "react-icons/fi";
import { useGroceryStore } from "@/stores/grocery.store";
import { GroceryCategory, GroceryUnit } from "@/schemas/grocery.schema";
import type {
  GroceryOut,
  GroceryIn,
  GroceryUpdate,
} from "@/types/grocery.type";

const emptyForm: GroceryIn = {
  name: "",
  price: 0,
  unit: GroceryUnit.Un,
  quantity: 1,
  inCart: false,
  category: GroceryCategory.Others,
  notes: "",
};

type CartFilter = "all" | "inCart" | "notInCart";

function Home() {
  const { groceries, addGrocery, updateGrocery, deleteGrocery } =
    useGroceryStore();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<GroceryIn>(emptyForm);
  const [search, setSearch] = useState("");
  const [cartFilter, setCartFilter] = useState<CartFilter>("all");

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleEdit = (item: GroceryOut) => {
    setEditingId(item.id);
    setIsAdding(false);
    setForm({
      name: item.name,
      price: item.price,
      unit: item.unit,
      quantity: item.quantity,
      inCart: item.inCart,
      category: item.category,
      notes: item.notes ?? "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (form.price <= 0) return;
    if (form.quantity <= 0) return;

    if (editingId) {
      const updatePayload: GroceryUpdate = { ...form };
      updateGrocery(editingId, updatePayload);
    } else {
      addGrocery(form);
    }
    resetForm();
  };

  const handleCancel = () => resetForm();

  const handleToggleCart = (id: string, current: boolean) => {
    updateGrocery(id, { inCart: !current });
  };

  const filteredGroceries = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return groceries.filter((item) => {
      const matchName = item.name.toLowerCase().includes(lowerSearch);
      const matchCart =
        cartFilter === "all" ||
        (cartFilter === "inCart" && item.inCart) ||
        (cartFilter === "notInCart" && !item.inCart);
      return matchName && matchCart;
    });
  }, [groceries, search, cartFilter]);

  const totalValue = useMemo(
    () => groceries.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [groceries],
  );

  const categories = Object.values(GroceryCategory);
  const units = Object.values(GroceryUnit);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Lista de Compras
          </h1>
          <p className="text-gray-400 mt-1">
            {groceries.length} {groceries.length === 1 ? "item" : "itens"} no
            total
          </p>
          <p className="text-emerald-400 font-semibold mt-1">
            Valor total: R$ {totalValue.toFixed(2)}
          </p>
        </div>
        {!isAdding && !editingId && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm font-semibold shadow-lg shadow-emerald-900/20 transition-colors self-start sm:self-auto"
          >
            <FiPlus size={18} />
            Novo item
          </motion.button>
        )}
      </header>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <FiX size={16} />
            </button>
          )}
        </div>
        <select
          value={cartFilter}
          onChange={(e) => setCartFilter(e.target.value as CartFilter)}
          className="w-full sm:w-auto bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer"
        >
          <option value="all">Todos</option>
          <option value="inCart">No carrinho</option>
          <option value="notInCart">Fora do carrinho</option>
        </select>
      </div>

      {(isAdding || editingId) && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-5 shadow-2xl"
        >
          <h2 className="text-lg font-semibold text-white">
            {editingId ? "Editar item" : "Adicionar novo item"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-400">Nome</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Arroz integral"
                className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-400">Preço</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={form.price || ""}
                onChange={(e) =>
                  setForm({ ...form, price: parseFloat(e.target.value) || 0 })
                }
                className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-400">
                Unidade
              </label>
              <select
                value={form.unit}
                onChange={(e) =>
                  setForm({ ...form, unit: e.target.value as GroceryUnit })
                }
                className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                {units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-400">
                Quantidade
              </label>
              <input
                type="number"
                min="0.01"
                step="any"
                value={form.quantity || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quantity: parseFloat(e.target.value) || 0,
                  })
                }
                className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-400">
                Categoria
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as GroceryCategory,
                  })
                }
                className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-400">
                Observações (opcional)
              </label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Marca, validade..."
                maxLength={200}
                className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm font-semibold shadow-lg shadow-emerald-900/20 transition-colors"
            >
              <FiCheck size={16} />
              {editingId ? "Salvar" : "Adicionar"}
            </motion.button>
          </div>
        </motion.form>
      )}

      <div className="flex-1">
        {filteredGroceries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-gray-500 gap-3"
          >
            <FiPackage size={48} strokeWidth={1} />
            <p className="text-lg font-medium">Nenhum item encontrado</p>
            <p className="text-sm">
              {search || cartFilter !== "all"
                ? "Tente alterar a busca ou limpar os filtros."
                : "Adicione seu primeiro item à lista."}
            </p>
          </motion.div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredGroceries.map((item) => (
                <motion.li
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.2 },
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`bg-gray-900 border rounded-2xl p-5 flex flex-col gap-4 transition-colors ${
                    item.inCart
                      ? "border-emerald-800/50 bg-emerald-950/20"
                      : "border-gray-800 hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <h3
                        className={`text-lg font-semibold ${
                          item.inCart
                            ? "text-emerald-300 line-through decoration-emerald-500/50"
                            : "text-white"
                        }`}
                      >
                        {item.name}
                      </h3>
                      <span className="text-xs font-medium text-gray-400 bg-gray-800 px-2 py-0.5 rounded-md w-fit">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggleCart(item.id, item.inCart)}
                        className={`p-2 rounded-xl transition-colors ${
                          item.inCart
                            ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                        title={
                          item.inCart
                            ? "Remover do carrinho"
                            : "Adicionar ao carrinho"
                        }
                      >
                        <FiShoppingCart size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(item)}
                        className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors"
                        title="Editar"
                      >
                        <FiEdit2 size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteGrocery(item.id)}
                        className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                        title="Excluir"
                      >
                        <FiTrash2 size={16} />
                      </motion.button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <FiDollarSign size={14} />
                      <span className="text-gray-200 font-medium">
                        R$ {item.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <FiHash size={14} />
                      <span className="text-gray-200 font-medium">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-800/50 rounded-xl p-2.5">
                      <FiFileText size={14} className="mt-0.5 shrink-0" />
                      <p className="line-clamp-2">{item.notes}</p>
                    </div>
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}

Home.displayName = "Home";
export default Home;
