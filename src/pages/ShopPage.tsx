import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Plus,
  Coins,
  Package,
  Edit2,
  Trash2,
  UploadCloud,
  Search,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { DirectorService } from '../services/mockService';
import { Product } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

export const ShopPage: React.FC = () => {
  const { success, error } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; product: Product | null }>({
    isOpen: false,
    product: null
  });

  // Form State (Product name, Coin price, Image upload/preview, Stock, Description)
  const [formData, setFormData] = useState({
    name: '',
    coinPrice: 300,
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
    stock: 20,
    category: 'Kiyim',
    description: '',
    status: 'in_stock' as Product['status']
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await DirectorService.getProducts();
      setProducts(data);
    } catch {
      error('Xatolik', 'Do‘kon mahsulotlarini yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      coinPrice: 300,
      imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
      stock: 25,
      category: 'Kiyim',
      description: '',
      status: 'in_stock'
    });
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      coinPrice: prod.coinPrice,
      imageUrl: prod.imageUrl,
      stock: prod.stock,
      category: prod.category,
      description: prod.description,
      status: prod.status
    });
    setCreateModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      error('Xatolik', 'Mahsulot nomi kiritilishi shart');
      return;
    }

    const calculatedStatus: Product['status'] =
      formData.stock === 0 ? 'out_of_stock' : formData.stock <= 5 ? 'low_stock' : 'in_stock';

    try {
      if (editingProduct) {
        await DirectorService.updateProduct(editingProduct.id, {
          ...formData,
          status: calculatedStatus
        });
        success('Yangilandi', 'Mahsulot ma’lumotlari saqlandi');
      } else {
        await DirectorService.createProduct({
          ...formData,
          status: calculatedStatus
        });
        success('Muvaffaqiyatli', 'Yangi tovar do‘konga qo‘shildi');
      }
      setCreateModalOpen(false);
      loadProducts();
    } catch {
      error('Xatolik', 'Mahsulotni saqlashda xatolik yuz berdi');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await DirectorService.deleteProduct(id);
      setDeleteConfirm({ isOpen: false, product: null });
      loadProducts();
      success('O‘chirildi', 'Mahsulot muvaffaqiyatli o‘chirildi');
    } catch {
      error('Xatolik', 'O‘chirishda xatolik yuz berdi');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Avlod Coin Do‘koni (Shop)
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            O‘quvchilar dars va topshiriqlarda to‘plagan Avlod Coinlarini kiyim va texnik sovg‘alarga almashtirish do‘koni
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#5C42FD] hover:bg-[#4d33eb] text-white text-xs font-bold rounded-xl shadow-sm shadow-[#5C42FD]/30 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product (Mahsulot Qo‘shish)</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E9EAF3] flex items-center justify-between shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Mahsulot nomi yoki kategoriyasi..."
            className="w-full bg-[#F8F8FC] border border-[#E9EAF3] focus:border-[#5C42FD] focus:bg-white rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden"
          />
        </div>
        <span className="text-xs text-gray-500 font-semibold hidden sm:block">
          Jami tovarlar: <strong className="text-gray-900">{filteredProducts.length} xil</strong>
        </span>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          title="Mahsulotlar topilmadi"
          description="Do‘konda hali mahsulotlar mavjud emas."
          icon={ShoppingBag}
          actionText="Yangi mahsulot qo‘shish"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-[#E9EAF3] hover:border-[#5C42FD]/40 transition-all shadow-xs hover:shadow-md overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C42FD] bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg shadow-2xs">
                      {product.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={product.status} size="sm" />
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#5C42FD] transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    {/* Coin Price */}
                    <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl">
                      <Coins className="w-4 h-4" />
                      <span className="text-sm font-black">{product.coinPrice}</span>
                      <span className="text-[10px] font-bold">coin</span>
                    </div>

                    {/* Stock */}
                    <div className="text-xs text-gray-500 font-medium">
                      Omborda: <strong className="text-gray-900">{product.stock} dona</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Edit, Delete */}
              <div className="p-3 bg-[#FAF9FE] border-t border-gray-100 flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(product)}
                  className="p-1.5 text-gray-400 hover:text-[#5C42FD] hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title="Tahrirlash"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm({ isOpen: true, product })}
                  className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title="O‘chirish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL (with drag & drop upload preview) */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title={editingProduct ? 'Mahsulotni Tahrirlash' : 'Do‘konga Yangi Mahsulot Qo‘shish'}
        subtitle="Mahsulot narxi (coin), ombordagi soni va rasmini belgilang"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Mahsulot Nomi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Masalan: Avlod Ta'lim Premium Hoodie"
              className="w-full bg-white border border-gray-200 focus:border-[#5C42FD] focus:ring-2 focus:ring-[#5C42FD]/15 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 shadow-2xs focus:outline-hidden transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Coin Narxi <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Coins className="w-4 h-4 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  required
                  min="10"
                  value={formData.coinPrice}
                  onChange={e => setFormData({ ...formData, coinPrice: Number(e.target.value) })}
                  className="w-full bg-white border border-gray-200 focus:border-[#5C42FD] focus:ring-2 focus:ring-[#5C42FD]/15 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-gray-900 font-bold shadow-2xs focus:outline-hidden transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Ombordagi miqdor (Stock)
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full bg-white border border-gray-200 focus:border-[#5C42FD] focus:ring-2 focus:ring-[#5C42FD]/15 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-bold shadow-2xs focus:outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Image Upload Area with Preview (Drag & Drop Style) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Mahsulot Rasmi (Rasm yuklash yoki URL)
            </label>
            <div className="border-2 border-dashed border-gray-200 hover:border-[#5C42FD] rounded-2xl p-4 text-center transition-colors bg-white shadow-2xs">
              {formData.imageUrl ? (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                  />
                  <div className="flex-1 text-left space-y-1.5 w-full">
                    <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Rasm yuklandi (Preview mavjud)
                    </span>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 focus:border-[#5C42FD] focus:outline-hidden"
                    />
                    <p className="text-[10px] text-gray-400">Rasm URL manzilini tahrirlashingiz mumkin.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 py-3">
                  <UploadCloud className="w-8 h-8 text-[#5C42FD] mx-auto" />
                  <p className="text-xs font-bold text-gray-700">Rasm yuklash uchun bosing yoki sudrab keling</p>
                  <p className="text-[10px] text-gray-400">PNG, JPG yoki WebP (maksimal 2MB)</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Kategoriya
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-white border border-gray-200 focus:border-[#5C42FD] focus:ring-2 focus:ring-[#5C42FD]/15 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 shadow-2xs focus:outline-hidden transition-all cursor-pointer"
              >
                <option value="Kiyim">Kiyim (Hoodie, T-Shirt)</option>
                <option value="Aksessuarlar">Aksessuarlar (Backpack, Termos)</option>
                <option value="Gadjetlar">Gadjetlar (Klaviaturа, Sichqoncha)</option>
                <option value="Stikerlar">Stikerlar</option>
                <option value="Kantselyariya">Kantselyariya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Holati
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-white border border-gray-200 focus:border-[#5C42FD] focus:ring-2 focus:ring-[#5C42FD]/15 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 shadow-2xs focus:outline-hidden transition-all cursor-pointer"
              >
                <option value="in_stock">In Stock (Mavjud)</option>
                <option value="low_stock">Low Stock (Kam qolgan)</option>
                <option value="out_of_stock">Out of Stock (Tugagan)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Mahsulot Tavsifi
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mahsulot materiali, o‘lchami va xususiyatlari..."
              className="w-full bg-white border border-gray-200 focus:border-[#5C42FD] focus:ring-2 focus:ring-[#5C42FD]/15 rounded-xl p-3.5 text-xs text-gray-900 shadow-2xs focus:outline-hidden transition-all"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#5C42FD] hover:bg-[#4d33eb] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {editingProduct ? 'Saqlash' : 'Mahsulotni Yaratish'}
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE */}
      <ConfirmationModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, product: null })}
        onConfirm={() => {
          if (deleteConfirm.product) handleDelete(deleteConfirm.product.id);
        }}
        title="Mahsulotni o‘chirish"
        message={`${deleteConfirm.product?.name} tovari do‘kondan o‘chiriladi.`}
        confirmText="O‘chirish"
        variant="danger"
      />
    </div>
  );
};
