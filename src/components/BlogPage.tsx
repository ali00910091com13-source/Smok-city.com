import React, { useState } from 'react';
import { ARTICLES } from '../data/extraData';
import { Article } from '../types';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  User, 
  ArrowLeft, 
  Sparkles, 
  X, 
  Share2, 
  CheckCircle2, 
  Tag 
} from 'lucide-react';

interface BlogPageProps {
  onSelectProduct?: (p: any) => void;
  articles?: Article[];
}

export const BlogPage: React.FC<BlogPageProps> = ({ articles = ARTICLES }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const categories = [
    { id: 'all', label: 'همه مقالات' },
    { id: 'راهنمای خرید', label: 'راهنمای خرید' },
    { id: 'نگهداری و آموزش', label: 'نگهداری و آموزش' },
    { id: 'نقد و بررسی', label: 'نقد و بررسی' }
  ];

  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles.filter(a => a.category === selectedCategory);

  return (
    <div className="bg-slate-50 py-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 border border-amber-300 px-4 py-1.5 rounded-full text-xs font-black">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>مجله تخصصی و آکادمی ویپینگ اسموک سیتی</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            آموزش‌ها، راهنمای انتخاب سالت و مقایسه پادها
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            مطالب معتبر و علمی تهیه شده توسط کارشناسان برای ارتقای تجربه ویپینگ، افزایش طول عمر کویل‌ها و تسهیل فرآیند ترک سیگار سنتی.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map(article => (
            <article
              key={article.id}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-amber-400 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[11px] font-black px-3 py-1 rounded-xl">
                    {article.category}
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 text-right space-y-3">
                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {article.date}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 leading-snug group-hover:text-amber-600 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="p-6 pt-0 text-right">
                <button
                  onClick={() => setActiveArticle(article)}
                  className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-800 font-black text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>مطالعه کامل مقاله</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

            </article>
          ))}
        </div>

      </div>

      {/* Full Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 text-right shadow-2xl relative">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-6 left-6 p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="space-y-3 pr-2">
              <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full border border-amber-300">
                {activeArticle.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {activeArticle.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1 border-b border-slate-100 pb-4">
                <span className="flex items-center gap-1 text-slate-600">
                  <User className="w-4 h-4 text-amber-500" />
                  نویسنده: {activeArticle.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {activeArticle.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {activeArticle.readTime}
                </span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="h-64 rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Paragraphs */}
            <div className="space-y-4 text-sm text-slate-700 leading-loose">
              {activeArticle.content.map((p, idx) => (
                <p key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {p}
                </p>
              ))}
            </div>

            {/* Tags */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                برچسب‌ها:
              </span>
              {activeArticle.tags.map(t => (
                <span key={t} className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-lg">
                  #{t}
                </span>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs"
              >
                بستن و بازگشت به مقالات
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
