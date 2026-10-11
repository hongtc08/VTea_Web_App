"use client";

import React, { useState } from "react";
import { Search, Folder, Layers, Plus, ArrowLeft } from "lucide-react";
import AddMenuItemModal from "../../components/menu/AddMenuItemModal";
import MenuItemCard, { MenuItem } from "../../components/menu/MenuItemCard";
import CategoryManagerModal, { Category } from "../../components/menu/CategoryManagerModal";


const INITIAL_MOCK_ITEMS: MenuItem[] = [
  { id: 1, name: "Cà phê Đen đá", category: "Cà phê", price: 25000, image: "" },
  { id: 2, name: "Cà phê Sữa đá", category: "Cà phê", price: 29000, image: "" },
  { id: 3, name: "Bạc xỉu", category: "Cà phê", price: 35000, image: "" },
  { id: 4, name: "Espresso", category: "Cà phê", price: 40000, image: "" },
  { id: 5, name: "Cà phê muối", category: "Cà phê", price: 38000, image: "" },
  { id: 6, name: "Latte", category: "Cà phê", price: 45000, image: "" },
  { id: 7, name: "Cà phê trứng", category: "Cà phê", price: 45000, image: "" },
  { id: 8, name: "Trà đào cam sả", category: "Trà", price: 45000, image: "" },
];

const INITIAL_MOCK_TOPPINGS: MenuItem[] = [
  { id: 101, name: "Trân châu đen", category: "Topping", price: 10000, image: "" },
  { id: 102, name: "Trân châu trắng", category: "Topping", price: 10000, image: "" },
  { id: 103, name: "Thạch phô mai", category: "Topping", price: 15000, image: "" },
  { id: 104, name: "Kem cheese", category: "Topping", price: 15000, image: "" },
];

export default function MenuPage() {
  const [currentView, setCurrentView] = useState<'menu' | 'topping'>('menu');
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<MenuItem | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Cà phê", status: "Đang bán" },
    { id: 2, name: "Trà", status: "Đang bán" },
    { id: 3, name: "Sinh tố", status: "Đang bán" },
    { id: 4, name: "Nước Ép", status: "Đang bán" },
    { id: 5, name: "Đá xay", status: "Đang bán" },
    { id: 6, name: "Trà sữa", status: "Đang bán" }
  ]);

  const [items, setItems] = useState<MenuItem[]>(INITIAL_MOCK_ITEMS);
  const [toppings, setToppings] = useState<MenuItem[]>(INITIAL_MOCK_TOPPINGS);

  const isToppingView = currentView === 'topping';
  const categoryTabs = ["Tất cả", ...categories.map(c => c.name)];
  const displayData = isToppingView ? toppings : items;

  const filteredItems = displayData.filter(item => {
    const matchesCategory = isToppingView || activeCategory === "Tất cả" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSaveItem = (savedItem: MenuItem) => {
    if (itemToEdit) {
      if (isToppingView) {
        setToppings(toppings.map(t => t.id === savedItem.id ? savedItem : t));
      } else {
        setItems(items.map(i => i.id === savedItem.id ? savedItem : i));
      }
    } else {
      if (isToppingView) {
        setToppings([{ ...savedItem, category: 'Topping' }, ...toppings]);
      } else {
        setItems([savedItem, ...items]);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {isToppingView ? "Quản lý topping" : "Quản lý thực đơn"}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {isToppingView ? (
              <button
                onClick={() => {
                  setCurrentView('menu');
                  setSearchQuery("");
                }}
                className="flex items-center gap-2 px-4 py-1.5 bg-background border border-border rounded-[var(--radius-control)] text-sm font-medium text-muted hover:bg-surface transition-colors"
              >
                <ArrowLeft size={16} className="text-muted" />
                Quay lại thực đơn
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-1.5 bg-background border border-border rounded-[var(--radius-control)] text-sm font-medium text-muted hover:bg-surface transition-colors"
                >
                  <Folder size={16} className="text-muted" />
                  Quản lý danh mục
                </button>
                <button
                  onClick={() => {
                    setCurrentView('topping');
                    setSearchQuery("");
                  }}
                  className="flex items-center gap-2 px-4 py-1.5 bg-background border border-border rounded-[var(--radius-control)] text-sm font-medium text-muted hover:bg-surface transition-colors"
                >
                  <Layers size={16} className="text-muted" />
                  Quản lý topping
                </button>
              </>
            )}
            <button
              onClick={() => {
                setItemToEdit(null);
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-accent rounded-[var(--radius-control)] text-sm font-bold hover:bg-primary-hover transition-colors shadow-soft"
            >
              <Plus size={18} />
              {isToppingView ? "Thêm topping" : "Thêm món"}
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-6">
          <div className="relative max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-muted" />
            </div>
            <input
              type="text"
              placeholder={isToppingView ? "Tìm kiếm tên topping..." : "Tìm kiếm tên món ăn..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-[var(--radius-control)] focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {!isToppingView && (
            <div className="flex items-center gap-2 flex-wrap">
              {categoryTabs.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-1.5 rounded-[var(--radius-control)] text-sm font-medium transition-colors ${activeCategory === category
                    ? 'bg-primary text-accent border border-primary'
                    : 'bg-background text-muted hover:bg-surface border border-border'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Item Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredItems.map(item => (
            <MenuItemCard
              key={item.id}
              item={item}
              showActions={true}
              onEdit={(editedItem) => {
                setItemToEdit(editedItem);
                setIsAddModalOpen(true);
              }}
              onDelete={(deletedItem) => console.log('Delete item:', deletedItem)}
            />
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-full py-16 text-center text-muted font-medium">
              Không tìm thấy {isToppingView ? "topping" : "món ăn"} nào phù hợp.
            </div>
          )}
        </div>
      </div>

      <AddMenuItemModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setItemToEdit(null);
        }}
        onSave={handleSaveItem}
        mode={currentView}
        categories={categories.map(c => c.name)}
        itemToEdit={itemToEdit}
      />

      <CategoryManagerModal 
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onAdd={(name) => {
          setCategories([...categories, { id: Date.now(), name, status: "Đang bán" }]);
        }}
        onUpdate={(id, name) => {
          setCategories(categories.map(c => c.id === id ? { ...c, name } : c));
        }}
        onDelete={(id) => {
          setCategories(categories.filter(c => c.id !== id));
        }}
      />
    </div>
  );
}
