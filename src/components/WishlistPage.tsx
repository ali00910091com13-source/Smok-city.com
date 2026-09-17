import React from 'react';
import { Product } from '../types';
import { formatPrice } from '../data/products';
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  Star, 
  ArrowLeft, 
  Sparkles 
} from 'lucide-react';

interface WishlistPageProps {
  products: Product[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onAddToCart: (p: Product) => void;
  onSelectProduct: (p: Product) => void;
  onNavigateShop: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  products,
  favorites,
  onToggleFavorite,
  onAddToCart,
  onSelectProduct,
  onNavigateShop
}) => {
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div className="bg-slate-50 py-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-right">
            <div className="flex items-center gap-2 text-rose-500 font-bold text-xs mb-1">
              <Heart className="w-4 h-4 fill-rose-500" />
              <span>لیست علاقه‌مندی‌های شخصی</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              کالاهای نشان شده شما ({favoriteProducts.length})
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              کالاهای ذخیره شده در اینجا نگهداری می‌شوند تا هر زمان مایل بودید به سبد خرید اضافه فرمایید.
            </p>
          </div>

          {favoriteProducts.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  favoriteProducts.forEach(p => onAddToCart(p));
                }}
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>افزودن همه به سبد خرید</span>
              </button>
            </div>
          )}
        </div>

        {/* List of Favorite Items */}
        {favoriteProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto border border-rose-200">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-800">لیست علاقه‌مندی‌های شما خالی است</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              با کلیک روی آیکون قلب در کنار هر کالا، می‌توانید آن را به این لیست اضافه نموده و در خریدهای بعدی سریع‌تر دسترسی داشته باشید.
            </p>
            <button
              onClick={onNavigateShop}
              className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md"
            >
              مشاهده محصولات و افزودن به لیست
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-amber-400 p-5 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                      {product.brand}
                    </span>
                    <button
                      onClick={() => onToggleFavorite(product.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                      title="حذف از لیست"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectProduct(product)}
                    className="w-full flex items-center justify-center py-6 bg-slate-50 rounded-2xl mb-4 group-hover:bg-amber-50/40 transition-colors"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="h-40 object-contain group-hover:scale-105 transition-transform"
                    />
                  </button>

                  <div className="flex items-center gap-1 text-amber-500 text-xs mb-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span className="font-bold text-slate-800">{product.rating}</span>
                  </div>

                  <button
                    onClick={() => onSelectProduct(product)}
                    className="font-bold text-slate-900 text-sm hover:text-amber-600 transition-colors text-right block line-clamp-1 w-full"
                  >
                    {product.name}
                  </button>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{product.nameEn}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-right">
                    {product.originalPrice > product.price && (
                      <span className="block text-xs text-slate-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    <span className="text-base font-black text-slate-900">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => onAddToCart(product)}
                    className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>خرید</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
