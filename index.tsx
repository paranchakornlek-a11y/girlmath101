import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

// Simple SideDrawer implementation for internal use
const SideDrawer = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children?: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

interface Product {
  id: string;
  name: string;
  price: number | '';
  amount: number | '';
  unit: string;
}

interface UnitInfo {
  label: string;
  factor: number;
}

interface Category {
  label: string;
  internalBase: string;
  units: Record<string, UnitInfo>;
}

const CATEGORIES: Record<string, Category> = {
  weight: {
    label: 'Weight',
    internalBase: 'g',
    units: {
      'g': { label: 'Grams (g)', factor: 1 },
      'kg': { label: 'Kilograms (kg)', factor: 1000 },
      'oz': { label: 'Ounces (oz)', factor: 28.35 },
      'lb': { label: 'Pounds (lb)', factor: 453.59 },
    }
  },
  volume: {
    label: 'Volume',
    internalBase: 'ml',
    units: {
      'ml': { label: 'Milliliters (ml)', factor: 1 },
      'L': { label: 'Liters (L)', factor: 1000 },
      'fl oz': { label: 'Fluid Ounces (fl oz)', factor: 29.57 },
    }
  },
  count: {
    label: 'Count',
    internalBase: 'pcs',
    units: {
      'pcs': { label: 'Pieces (pcs)', factor: 1 },
      'dozen': { label: 'Dozen', factor: 12 },
    }
  },
  nutrition: {
    label: 'Nutrition',
    internalBase: 'g',
    units: {
      'g': { label: 'Grams (g)', factor: 1 },
      'mg': { label: 'Milligrams (mg)', factor: 0.001 },
      'kcal': { label: 'Calories (kcal)', factor: 1 },
    }
  }
};

const CURRENCY_OPTIONS = [
  { label: 'THB (฿)', value: '฿' },
  { label: 'USD ($)', value: '$' },
  { label: 'EUR (€)', value: '€' },
  { label: 'GBP (£)', value: '£' },
  { label: 'JPY (¥)', value: '¥' },
  { label: 'CNY (¥)', value: '¥' },
];

const Logo = ({ className }: { className?: string }) => (
  <svg 
    className={className}
    viewBox="0 0 1500 1500" 
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <clipPath id="a7dca316bb"><path d="M 0 6.265625 L 1493.734375 6.265625 L 1493.734375 1500 L 0 1500 Z M 0 6.265625 " clipRule="nonzero"/></clipPath>
      <clipPath id="31967748a5"><path d="M 120 6.265625 L 1373.734375 6.265625 C 1440.007812 6.265625 1493.734375 59.992188 1493.734375 126.265625 L 1493.734375 1380 C 1493.734375 1446.273438 1440.007812 1500 1373.734375 1500 L 120 1500 C 53.726562 1500 0 1446.273438 0 1380 L 0 126.265625 C 0 59.992188 53.726562 6.265625 120 6.265625 Z M 120 6.265625 " clipRule="nonzero"/></clipPath>
      <clipPath id="ec356d4c24"><path d="M 0 0.265625 L 1493.734375 0.265625 L 1493.734375 1494 L 0 1494 Z M 0 0.265625 " clipRule="nonzero"/></clipPath>
      <clipPath id="f84c03aac4"><path d="M 120 0.265625 L 1373.734375 0.265625 C 1440.007812 0.265625 1493.734375 53.992188 1493.734375 120.265625 L 1493.734375 1374 C 1493.734375 1440.273438 1440.007812 1494 1373.734375 1494 L 120 1494 C 53.726562 1494 0 1440.273438 0 1374 L 0 120.265625 C 0 53.992188 53.726562 0.265625 120 0.265625 Z M 120 0.265625 " clipRule="nonzero"/></clipPath>
      <clipPath id="7baeafc24b"><rect x="0" width="1494" y="0" height="1494"/></clipPath>
      <clipPath id="0793cb5d04"><rect x="0" width="1494" y="0" height="1500"/></clipPath>
      <clipPath id="6eda7c8e2b"><rect x="0" width="177" y="0" height="1140"/></clipPath>
      <clipPath id="66b6376ffa"><rect x="0" width="166" y="0" height="725"/></clipPath>
    </defs>
    <g clipPath="url(#0793cb5d04)">
      <g clipPath="url(#a7dca316bb)">
        <g clipPath="url(#31967748a5)">
          <g transform="matrix(1, 0, 0, 1, 0, 6)">
            <g clipPath="url(#7baeafc24b)">
              <g clipPath="url(#ec356d4c24)">
                <g clipPath="url(#f84c03aac4)">
                  <path fill="#4d7b18" d="M 0 0.265625 L 1493.734375 0.265625 L 1493.734375 1494 L 0 1494 Z M 0 0.265625 " fillOpacity="1" fillRule="nonzero"/>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
      <g fill="#ffa4ac">
        <g transform="translate(247.277797, 1275.084069)">
          <path d="M 335.40625 -52.609375 L 378.15625 -440.625 C 379.613281 -451.59375 374.5 -457.078125 362.8125 -457.078125 C 351.84375 -457.078125 345.628906 -451.59375 344.171875 -440.625 L 302.515625 -53.703125 C 301.054688 -42.742188 304.710938 -36.171875 313.484375 -33.984375 C 318.597656 -32.515625 323.347656 -33.609375 327.734375 -37.265625 C 332.117188 -40.921875 334.675781 -46.035156 335.40625 -52.609375 Z M 723.421875 -1000.734375 L 723.421875 -540.375 C 723.421875 -526.488281 716.476562 -519.546875 702.59375 -519.546875 L 417.609375 -519.546875 C 410.304688 -519.546875 403.546875 -522.46875 397.328125 -528.3125 C 391.117188 -534.15625 388.378906 -540.734375 389.109375 -548.046875 L 435.15625 -976.625 C 436.613281 -987.582031 431.863281 -993.0625 420.90625 -993.0625 C 409.9375 -993.0625 403.722656 -987.582031 402.265625 -976.625 L 351.84375 -509.6875 C 351.113281 -503.84375 352.570312 -498.546875 356.21875 -493.796875 C 359.875 -489.046875 364.628906 -486.671875 370.484375 -486.671875 L 702.59375 -486.671875 C 716.476562 -486.671875 723.421875 -479.726562 723.421875 -465.84375 L 723.421875 -20.828125 C 723.421875 -6.941406 716.476562 0 702.59375 0 L 167.703125 0 C 122.398438 0 85.863281 -13.878906 58.09375 -41.640625 C 30.320312 -69.410156 16.4375 -105.953125 16.4375 -151.265625 L 16.4375 -874.6875 C 16.4375 -919.988281 30.320312 -956.519531 58.09375 -984.28125 C 85.863281 -1012.050781 122.398438 -1025.9375 167.703125 -1025.9375 L 698.21875 -1025.9375 C 715.019531 -1025.9375 723.421875 -1017.535156 723.421875 -1000.734375 Z "/>
        </g>
      </g>
      <g transform="translate(1094, 0)">
        <g clipPath="url(#6eda7c8e2b)">
          <g fill="#ffa4ac">
            <g transform="translate(0.4474, 484.235683)">
              <path d="M 59.671875 -72.484375 L 59.671875 -122.78125 L 9.859375 -122.78125 L 9.859375 -178.5 L 59.671875 -178.5 L 59.671875 -228.296875 L 115.390625 -228.296875 L 115.390625 -178.5 L 165.671875 -178.5 L 165.671875 -122.78125 L 115.390625 -122.78125 L 115.390625 -72.484375 Z "/>
            </g>
            <g transform="translate(11.297863, 730.778753)">
              <path d="M 14.296875 -122.78125 L 14.296875 -178.5 L 138.5625 -178.5 L 138.5625 -122.78125 Z "/>
            </g>
            <g transform="translate(2.421671, 977.321823)">
              <path d="M 50.296875 -75.4375 L 10.359375 -114.890625 L 45.859375 -150.390625 L 10.359375 -185.890625 L 50.296875 -225.34375 L 85.3125 -189.84375 L 120.8125 -225.34375 L 160.25 -185.890625 L 124.75 -150.390625 L 160.25 -114.890625 L 120.8125 -75.4375 L 85.3125 -110.953125 Z "/>
            </g>
          </g>
        </g>
      </g>
      <g transform="translate(1105, 762)">
        <g clipPath="url(#66b6376ffa)">
          <g fill="#ffa4ac">
            <g transform="translate(0.379938, 561.743261)">
              <path d="M 46.34375 -235.203125 L 46.34375 -306.703125 L 118.34375 -306.703125 L 118.34375 -235.203125 Z M 8.375 -153.84375 L 8.375 -209.5625 L 156.3125 -209.5625 L 156.3125 -153.84375 Z M 46.34375 -57.203125 L 46.34375 -128.703125 L 118.34375 -128.703125 L 118.34375 -57.203125 Z "/>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

const App = () => {
  const [categoryKey, setCategoryKey] = useState<string>('weight');
  const [targetBaseUnit, setTargetBaseUnit] = useState<string>('g');
  const [currency, setCurrency] = useState('฿');
  const [productCounter, setProductCounter] = useState(2);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Product 1', price: '', amount: '', unit: 'g' },
    { id: '2', name: 'Product 2', price: '', amount: '', unit: 'kg' },
  ]);

  const activeCategory = CATEGORIES[categoryKey];

  const handleCategoryChange = (newCat: string) => {
    setCategoryKey(newCat);
    const units = Object.keys(CATEGORIES[newCat].units);
    const firstUnit = units[0];
    setTargetBaseUnit(firstUnit);
    setProducts(products.map(p => ({ ...p, unit: firstUnit })));
  };

  const addProduct = () => {
    if (products.length >= 10) return;
    const nextNum = productCounter + 1;
    setProductCounter(nextNum);
    setProducts([
      ...products,
      { 
        id: Date.now().toString(), 
        name: `Product ${nextNum}`, 
        price: '', 
        amount: '', 
        unit: Object.keys(activeCategory.units)[0] 
      },
    ]);
  };

  const removeProduct = (id: string) => {
    if (products.length <= 2) return;
    setProducts(products.filter((p) => p.id !== id));
  };

  const updateProduct = (id: string, field: keyof Product, value: any) => {
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          if (field === 'price' || field === 'amount') {
            const num = value === '' ? '' : parseFloat(value as string);
            return { ...p, [field]: num };
          }
          return { ...p, [field]: value };
        }
        return p;
      })
    );
  };

  const calculations = useMemo(() => {
    const validProducts = products.filter(
      (p) => typeof p.price === 'number' && typeof p.amount === 'number' && p.amount > 0
    );

    const targetUnitFactor = activeCategory.units[targetBaseUnit]?.factor || 1;

    const analyzed = validProducts.map((p) => {
      const inputUnitFactor = activeCategory.units[p.unit]?.factor || 1;
      const pricePerInternalBase = (p.price as number) / ((p.amount as number) * inputUnitFactor);
      const pricePerTargetUnit = pricePerInternalBase * targetUnitFactor;
      return { ...p, unitPrice: pricePerTargetUnit };
    });

    if (analyzed.length === 0) return { bestId: null, rankings: {}, unitPrices: {}, savings: {} };

    const sorted = [...analyzed].sort((a, b) => a.unitPrice - b.unitPrice);
    
    const rankings: Record<string, number> = {};
    const unitPrices: Record<string, number> = {};
    const savings: Record<string, number> = {};

    let currentRank = 1;
    sorted.forEach((p, i) => {
      if (i > 0 && p.unitPrice > sorted[i - 1].unitPrice) {
        currentRank = i + 1;
      }
      rankings[p.id] = currentRank;
      unitPrices[p.id] = p.unitPrice;
      
      if (currentRank > 1) {
        savings[p.id] = ((p.unitPrice - sorted[0].unitPrice) / sorted[0].unitPrice) * 100;
      }
    });

    return { bestId: sorted[0].id, rankings, unitPrices, savings };
  }, [products, activeCategory, targetBaseUnit]);

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 md:px-12 max-w-7xl mx-auto flex flex-col items-center antialiased">
      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Deployment Assistant">
        <div className="space-y-8">
          <section>
            <h3 className="text-sm font-black text-[#ec4899] uppercase tracking-widest mb-4">Manual GitHub Upload</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              If the automatic sync is failing, follow these steps to deploy manually:
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400 shrink-0">1</div>
                <p className="text-sm text-slate-600">Open your GitHub repository in your browser.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400 shrink-0">2</div>
                <p className="text-sm text-slate-600">Drag and drop the files from this IDE directly into the browser window.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400 shrink-0">3</div>
                <p className="text-sm text-slate-600">Click "Commit changes" and Vercel will auto-build the new version.</p>
              </div>
            </div>
          </section>
          
          <button 
            onClick={() => setIsDrawerOpen(false)}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
          >
            Got it, thanks!
          </button>
        </div>
      </SideDrawer>

      <header className="w-full mb-16 flex flex-col items-center relative">
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="absolute top-0 right-0 p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-[#ec4899] hover:border-[#ec4899]/30 transition-all shadow-sm hover:shadow-lg group"
          title="Deployment Help"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
        </button>

        <Logo className="h-20 w-20 md:h-24 md:w-24 mb-8 drop-shadow-[0_10px_15px_rgba(77,123,24,0.15)] hover:scale-105 transition-transform duration-300" />
        <h1 className="text-6xl font-black text-slate-900 tracking-tight leading-none text-center">Girl Math 101</h1>
        <p className="text-sm font-bold text-[#ec4899] uppercase tracking-[0.3em] mt-5 text-center opacity-80">Because if you save money, it's basically free.</p>
        
        <div className="w-full max-w-4xl bg-white mt-12 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Measurement</label>
              <select 
                value={categoryKey} 
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-[#ec4899]/5 hover:bg-white transition-all appearance-none cursor-pointer"
              >
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <option key={key} value={key}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Unit</label>
              <select 
                value={targetBaseUnit} 
                onChange={(e) => setTargetBaseUnit(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-[#ec4899]/5 hover:bg-white transition-all appearance-none cursor-pointer"
              >
                {Object.entries(activeCategory.units).map(([uKey, uInfo]) => (
                  <option key={uKey} value={uKey}>{uInfo.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Currency</label>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-[#ec4899]/5 hover:bg-white transition-all appearance-none cursor-pointer"
              >
                {CURRENCY_OPTIONS.map(opt => (
                  <option key={opt.label} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-20">
        {products.map((product) => {
          const rank = calculations.rankings[product.id];
          const isWinner = rank === 1;
          const unitPrice = calculations.unitPrices[product.id];
          const saving = calculations.savings?.[product.id];
          
          return (
            <div 
              key={product.id}
              className={`product-card group relative bg-white rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 flex flex-col ${
                isWinner 
                  ? 'ring-[6px] ring-[#4d7b18]/10 bg-emerald-50/20 border-[#4d7b18]/20 shadow-2xl shadow-emerald-900/10' 
                  : 'shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/60'
              }`}
            >
              {rank && (
                <div className={`absolute -top-5 left-1/2 -translate-x-1/2 z-20 px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                  isWinner 
                    ? 'bg-[#4d7b18] text-white shadow-xl shadow-[#4d7b18]/40 winner-pulse' 
                    : 'bg-[#ec4899] text-white shadow-xl shadow-[#ec4899]/30'
                }`}>
                  #{rank} {isWinner ? 'Best Value' : 'Selection'}
                </div>
              )}

              <div className="flex justify-between items-center mb-8 gap-2">
                <input 
                  type="text"
                  value={product.name}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                  className={`text-2xl font-black text-slate-900 bg-transparent border-b-2 border-transparent focus:border-slate-100 outline-none w-full transition-all px-1 py-1 placeholder:text-slate-200 focus:ring-4 ${isWinner ? 'focus:ring-[#4d7b18]/5' : 'focus:ring-[#ec4899]/5'} rounded-xl`}
                />
                {products.length > 2 && (
                  <button 
                    onClick={() => removeProduct(product.id)}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all bg-slate-50 p-3 rounded-2xl hover:bg-rose-50"
                    title="Remove item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                )}
              </div>

              <div className="space-y-6 flex-grow">
                <div className="relative">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Price</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-6 text-xl font-bold text-slate-400">{currency}</span>
                    <input 
                      type="number"
                      inputMode="decimal"
                      value={product.price}
                      onChange={(e) => updateProduct(product.id, 'price', e.target.value)}
                      className={`w-full bg-slate-50/60 border border-slate-100 rounded-3xl pl-12 pr-8 py-5 text-3xl font-black text-slate-800 outline-none focus:bg-white focus:ring-4 transition-all ${isWinner ? 'focus:ring-[#4d7b18]/10' : 'focus:ring-[#ec4899]/10'}`}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-3">
                  <div className="col-span-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Quantity</label>
                    <input 
                      type="number"
                      inputMode="decimal"
                      value={product.amount}
                      onChange={(e) => updateProduct(product.id, 'amount', e.target.value)}
                      className={`w-full bg-slate-50/60 border border-slate-100 rounded-3xl px-6 py-5 text-2xl font-black text-slate-800 outline-none focus:bg-white focus:ring-4 transition-all ${isWinner ? 'focus:ring-[#4d7b18]/10' : 'focus:ring-[#ec4899]/10'}`}
                      placeholder="0"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Unit</label>
                    <select 
                      value={product.unit} 
                      onChange={(e) => updateProduct(product.id, 'unit', e.target.value)}
                      className="w-full h-[66px] bg-slate-100 border border-transparent rounded-3xl px-3 text-sm font-bold text-slate-600 outline-none transition-all cursor-pointer appearance-none text-center hover:bg-slate-200"
                    >
                      {Object.entries(activeCategory.units).map(([uKey]) => (
                        <option key={uKey} value={uKey}>{uKey}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-slate-50 flex flex-col items-center">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-3 italic">Girl Math Cost</span>
                <div className={`text-5xl font-black tabular-nums transition-all duration-700 ${isWinner ? 'text-[#4d7b18] scale-105' : 'text-slate-800'}`}>
                  {unitPrice !== undefined && !isNaN(unitPrice) ? `${currency}${unitPrice.toFixed(2)}` : '--'}
                </div>
                <div className="text-[11px] font-bold text-slate-400 mt-1">per {targetBaseUnit}</div>
                
                <div className="h-12 mt-8 w-full flex items-center justify-center">
                  {isWinner && Object.keys(calculations.rankings).length > 1 ? (
                    <div className="px-6 py-2.5 bg-emerald-100/50 text-[#4d7b18] rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2 border border-[#4d7b18]/10 shadow-sm shadow-[#4d7b18]/10">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                      Basically Free
                    </div>
                  ) : !isWinner && saving !== undefined ? (
                    <div className="px-6 py-2.5 bg-rose-50 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-wider border border-rose-100">
                      +{saving.toFixed(2)}% Markup
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}

        {products.length < 10 && (
          <button 
            onClick={addProduct}
            className="group relative flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-white/50 hover:bg-white hover:border-[#ec4899]/30 transition-all duration-500 min-h-[500px] shadow-sm hover:shadow-xl hover:shadow-slate-200/40"
          >
            <div className="w-20 h-20 rounded-full bg-slate-50 group-hover:bg-[#ec4899] group-hover:text-white flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 shadow-sm group-hover:shadow-xl group-hover:shadow-[#ec4899]/20 text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </div>
            <span className="font-bold text-slate-400 group-hover:text-slate-600 transition-colors uppercase tracking-[0.2em] text-sm">Add Item</span>
            <span className="text-[9px] text-slate-300 mt-2 font-black uppercase tracking-widest">Available: {10 - products.length} Slots</span>
          </button>
        )}
      </main>

      <footer className="w-full text-center text-slate-300 text-[10px] font-bold uppercase tracking-[0.5em] pt-12 pb-20 border-t border-slate-100">
        &copy; 2026 girlmath101 &middot; Vibing by Parancha5
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);