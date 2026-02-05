import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

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
  units: Record<string, UnitInfo>;
}

const CATEGORIES: Record<string, Category> = {
  weight: {
    label: 'Weight',
    units: {
      'g': { label: 'Grams (g)', factor: 1 },
      'kg': { label: 'Kilograms (kg)', factor: 1000 },
      'oz': { label: 'Ounces (oz)', factor: 28.35 },
      'lb': { label: 'Pounds (lb)', factor: 453.59 },
    }
  },
  volume: {
    label: 'Volume',
    units: {
      'ml': { label: 'Milliliters (ml)', factor: 1 },
      'L': { label: 'Liters (L)', factor: 1000 },
      'fl oz': { label: 'Fluid Ounces (fl oz)', factor: 29.57 },
    }
  },
  count: {
    label: 'Count',
    units: {
      'pcs': { label: 'Pieces (pcs)', factor: 1 },
      'dozen': { label: 'Dozen', factor: 12 },
    }
  },
  nutrition: {
    label: 'Nutrition',
    units: {
      'g': { label: 'Protein (g)', factor: 1 },
      'kcal': { label: 'Calories (kcal)', factor: 1 },
      'mg': { label: 'Milligrams (mg)', factor: 0.001 },
    }
  },
  custom: {
    label: 'Custom',
    units: {
      'unit': { label: 'User Defined Unit', factor: 1 },
    }
  }
};

const CURRENCIES: Record<string, string> = {
  '฿': 'THB (฿)',
  '$': 'USD ($)',
  '€': 'EUR (€)',
  '£': 'GBP (£)',
  '¥': 'JPY (¥)',
  '元': 'CNY (¥)',
};

const ChevronIcon = () => (
  <svg 
    className="w-4 h-4 text-slate-400 pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-200" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
  </svg>
);

const Logo = ({ className }: { className?: string }) => (
  <svg 
    className={className}
    viewBox="0 0 1500 1500" 
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
    version="1.0"
  >
    <defs>
      <clipPath id="logo-a"><path d="M 0 6.26 L 1493.73 6.26 L 1493.73 1500 L 0 1500 Z" /></clipPath>
      <clipPath id="logo-b"><path d="M 120 6.26 L 1373.73 6.26 C 1440 6.26 1493.73 60 1493.73 126.26 L 1493.73 1380 C 1493.73 1446.27 1440 1500 1373.73 1500 L 120 1500 C 53.72 1500 0 1446.27 0 1380 L 0 126.26 C 0 60 53.72 6.26 120 6.26 Z" /></clipPath>
      <clipPath id="logo-c"><path d="M 0 0.26 L 1493.73 0.26 L 1493.73 1494 L 0 1494 Z" /></clipPath>
      <clipPath id="logo-d"><path d="M 120 0.26 L 1373.73 0.26 C 1440 0.26 1493.73 54 1493.73 120.26 L 1493.73 1374 C 1493.73 1440.27 1440 1494 1373.73 1494 L 120 1494 C 53.72 1494 0 1440.27 0 1374 L 0 120.26 C 0 54 53.72 0.26 120 0.26 Z" /></clipPath>
    </defs>
    <g transform="matrix(1, 0, 0, 1, 0, 0)">
      <g clipPath="url(#logo-a)">
        <g clipPath="url(#logo-b)">
          <g transform="matrix(1, 0, 0, 1, 0, 6)">
            <g clipPath="url(#logo-d)">
              <path fill="#4d7b18" d="M 0 0.26 L 1493.73 0.26 L 1493.73 1494 L 0 1494 Z" />
            </g>
          </g>
        </g>
      </g>
      <g fill="#ffa4ac">
        <g transform="translate(247.27, 1275.08)">
          <path d="M 335.4 -52.6 L 378.1 -440.6 C 379.6 -451.5 374.5 -457 362.8 -457 C 351.8 -457 345.6 -451.5 344.1 -440.6 L 302.5 -53.7 C 301 -42.7 304.7 -36.1 313.4 -33.9 C 318.5 -32.5 323.3 -33.6 327.7 -37.2 C 332.1 -40.9 334.6 -46 335.4 -52.6 Z M 723.4 -1000.7 L 723.4 -540.3 C 723.4 -526.4 716.4 -519.5 702.5 -519.5 L 417.6 -519.5 C 410.3 -519.5 403.5 -522.4 397.3 -528.3 C 391.1 -534.1 388.3 -540.7 389.1 -548 L 435.1 -976.6 C 436.6 -987.5 431.8 -993 420.9 -993 C 409.9 -993 403.7 -987.5 402.2 -976.6 L 351.8 -509.6 C 351.1 -503.8 352.5 -498.5 356.2 -493.7 C 359.8 -489 364.6 -486.6 370.4 -486.6 L 702.5 -486.6 C 716.4 -486.6 723.4 -479.7 723.4 -465.8 L 723.4 -20.8 C 723.4 -6.9 716.4 0 702.5 0 L 167.7 0 C 122.3 0 85.8 -13.8 58 -41.6 C 30.3 -69.4 16.4 -105.9 16.4 -151.2 L 16.4 -874.6 C 16.4 -919.9 30.3 -956.5 58 -984.2 C 85.8 -1012 122.3 -1025.9 167.7 -1025.9 L 698.2 -1025.9 C 715 -1025.9 723.4 -1017.5 723.4 -1000.7 Z" />
        </g>
        <g transform="translate(1094, 0)">
          <path d="M 59.67 -72.48 L 59.67 -122.78 L 9.85 -122.78 L 9.85 -178.5 L 59.67 -178.5 L 59.67 -228.29 L 115.39 -228.29 L 115.39 -178.5 L 165.67 -178.5 L 165.67 -122.78 L 115.39 -122.78 L 115.39 -72.48 Z" transform="translate(0, 484.23)" />
          <path d="M 14.29 -122.78 L 14.29 -178.5 L 138.56 -178.5 L 138.56 -122.78 Z" transform="translate(11.29, 730.77)" />
          <path d="M 50.29 -75.43 L 10.35 -114.89 L 45.85 -150.39 L 10.35 -185.89 L 50.29 -225.34 L 85.31 -189.84 L 120.81 -225.34 L 160.25 -185.89 L 124.75 -150.39 L 160.25 -114.89 L 120.81 -75.43 L 85.31 -110.95 Z" transform="translate(2.42, 977.32)" />
        </g>
        <g transform="translate(1105, 762)">
          <path d="M 46.34 -235.2 L 46.34 -306.7 L 118.34 -306.7 L 118.34 -235.2 Z M 8.37 -153.84 L 8.37 -209.56 L 156.31 -209.56 L 156.31 -153.84 Z M 46.34 -57.2 L 46.34 -128.7 L 118.34 -128.7 L 118.34 -57.2 Z" transform="translate(0.37, 561.74)" />
        </g>
      </g>
    </g>
  </svg>
);

const App = () => {
  const [categoryKey, setCategoryKey] = useState<string>('weight');
  const [targetBaseUnit, setTargetBaseUnit] = useState<string>('g');
  const [currency, setCurrency] = useState('฿');
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Product 1', price: '', amount: '', unit: 'g' },
    { id: '2', name: 'Product 2', price: '', amount: '', unit: 'kg' },
  ]);

  const activeCategory = CATEGORIES[categoryKey];

  const handleCategoryChange = (newCat: string) => {
    setCategoryKey(newCat);
    const units = Object.keys(CATEGORIES[newCat].units);
    const newBase = units[0];
    setTargetBaseUnit(newBase);
    setProducts(products.map(p => ({ ...p, unit: newBase })));
  };

  const addProduct = () => {
    if (products.length >= 10) return;
    setProducts([
      ...products,
      { 
        id: Date.now().toString(), 
        name: `Product ${products.length + 1}`, 
        price: '', 
        amount: '', 
        unit: Object.keys(activeCategory.units)[0] 
      },
    ]);
  };

  const removeProduct = (id: string) => {
    if (products.length <= 2) return;
    setProducts(products.filter(p => p.id !== id));
  };

  const updateProduct = (id: string, field: keyof Product, value: any) => {
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const calculations = useMemo(() => {
    const targetUnitInfo = activeCategory.units[targetBaseUnit];
    const targetFactor = targetUnitInfo?.factor || 1;

    const analyzed = products
      .filter(p => p.price !== '' && p.amount !== '' && (p.amount as number) > 0)
      .map(p => {
        const productUnitInfo = activeCategory.units[p.unit];
        const productFactor = productUnitInfo?.factor || 1;
        
        // Convert quantity to standard base unit first
        const quantityInStandardBase = (p.amount as number) * productFactor;
        
        // Price per 1 standard base unit
        const pricePerStandardBase = (p.price as number) / quantityInStandardBase;
        
        // Price per target base unit
        const unitPrice = pricePerStandardBase * targetFactor;
        
        return { id: p.id, unitPrice };
      });

    if (analyzed.length === 0) return { bestId: null, unitPrices: {} };
    
    const sorted = [...analyzed].sort((a, b) => a.unitPrice - b.unitPrice);
    const pricesMap = analyzed.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.unitPrice }), {} as Record<string, number>);
    
    return { bestId: sorted[0].id, unitPrices: pricesMap };
  }, [products, activeCategory, targetBaseUnit]);

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-12 px-4 flex flex-col items-center antialiased transition-all duration-300">
      <header className="w-full max-w-4xl mb-6 sm:mb-12 flex flex-col items-center">
        <Logo className="h-12 w-12 sm:h-20 sm:w-20 mb-2 sm:mb-6 drop-shadow-[0_10px_15px_rgba(77,123,24,0.15)] transition-all" />
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight text-center leading-tight">Girl Math 101</h1>
        <p className="text-[#ec4899] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-1 sm:mt-3 text-center text-[10px] sm:text-sm opacity-80">Because if you save money, it's basically free.</p>
        
        <div className="w-full bg-white mt-6 sm:mt-10 p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
          <div className="flex flex-col gap-1 sm:gap-2">
            <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Measurement</label>
            <div className="relative group">
              <select 
                value={categoryKey} 
                onChange={e => handleCategoryChange(e.target.value)} 
                className="appearance-none w-full bg-slate-50 p-3 sm:p-4 pr-12 rounded-xl sm:rounded-2xl font-bold outline-none cursor-pointer border border-slate-100 focus:border-[#4d7b18] focus:ring-4 focus:ring-[#4d7b18]/5 transition-all text-sm sm:text-base text-slate-700"
              >
                {Object.entries(CATEGORIES).map(([key, cat]) => <option key={key} value={key}>{cat.label}</option>)}
              </select>
              <ChevronIcon />
            </div>
          </div>
          <div className="flex flex-col gap-1 sm:gap-2">
            <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Unit (Base for Compare)</label>
            <div className="relative group">
              <select 
                value={targetBaseUnit} 
                onChange={e => setTargetBaseUnit(e.target.value)} 
                className="appearance-none w-full bg-slate-50 p-3 sm:p-4 pr-12 rounded-xl sm:rounded-2xl font-bold outline-none cursor-pointer border border-slate-100 focus:border-[#4d7b18] focus:ring-4 focus:ring-[#4d7b18]/5 transition-all text-sm sm:text-base text-slate-700"
              >
                {Object.entries(activeCategory.units).map(([key, info]) => <option key={key} value={key}>{info.label}</option>)}
              </select>
              <ChevronIcon />
            </div>
          </div>
          <div className="flex flex-col gap-1 sm:gap-2">
            <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Currency</label>
            <div className="relative group">
              <select 
                value={currency} 
                onChange={e => setCurrency(e.target.value)} 
                className="appearance-none w-full bg-slate-50 p-3 sm:p-4 pr-12 rounded-xl sm:rounded-2xl font-bold outline-none cursor-pointer border border-slate-100 focus:border-[#4d7b18] focus:ring-4 focus:ring-[#4d7b18]/5 transition-all text-sm sm:text-base text-slate-700"
              >
                {Object.entries(CURRENCIES).map(([sym, name]) => <option key={sym} value={sym}>{name}</option>)}
              </select>
              <ChevronIcon />
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-10 mb-20 px-2 sm:px-4">
        {products.map((product, idx) => {
          const isWinner = calculations.bestId === product.id;
          const unitPrice = calculations.unitPrices[product.id];
          return (
            <div key={product.id} className={`product-card bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-xl transition-all duration-500 relative border-2 ${isWinner ? 'border-[#4d7b18] ring-[8px] sm:ring-[12px] ring-[#4d7b18]/5 sm:scale-105 z-10' : 'border-transparent opacity-95'}`}>
              {isWinner && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4d7b18] text-white text-[10px] sm:text-[11px] font-black px-4 sm:px-6 py-1.5 sm:py-2 rounded-full uppercase tracking-widest shadow-lg shadow-[#4d7b18]/30 z-20 whitespace-nowrap">
                  Basically Free
                </div>
              )}
              
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <input 
                  className="text-lg sm:text-2xl font-black bg-transparent outline-none w-3/4 border-b-2 border-transparent focus:border-slate-100 transition-all placeholder-slate-200" 
                  value={product.name} 
                  placeholder={`Product ${idx + 1}`}
                  onChange={e => updateProduct(product.id, 'name', e.target.value)}
                />
                {products.length > 2 && (
                  <button onClick={() => removeProduct(product.id)} className="text-slate-200 hover:text-[#ec4899] transition-colors p-1">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="relative">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 block mb-1.5 sm:mb-2 ml-1">Price</label>
                  <div className="relative">
                    <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-lg sm:text-xl font-bold text-slate-300">{currency}</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full bg-slate-50 p-4 sm:p-5 pl-10 sm:pl-12 rounded-2xl sm:rounded-3xl text-xl sm:text-2xl font-black outline-none focus:bg-white focus:ring-4 focus:ring-[#4d7b18]/5 transition-all border border-slate-100"
                      value={product.price}
                      onChange={e => updateProduct(product.id, 'price', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 block mb-1.5 sm:mb-2 ml-1">Quantity</label>
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-full bg-slate-50 p-4 sm:p-5 rounded-2xl sm:rounded-3xl text-xl sm:text-2xl font-black outline-none focus:bg-white focus:ring-4 focus:ring-[#4d7b18]/5 transition-all border border-slate-100"
                      value={product.amount}
                      onChange={e => updateProduct(product.id, 'amount', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="relative">
                    <label className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 block mb-1.5 sm:mb-2 ml-1">Unit</label>
                    <div className="relative">
                      <select 
                        value={product.unit} 
                        onChange={e => updateProduct(product.id, 'unit', e.target.value)}
                        className="appearance-none w-full bg-slate-100 h-[60px] sm:h-[68px] rounded-2xl sm:rounded-3xl px-4 pr-10 font-black text-slate-600 outline-none cursor-pointer hover:bg-slate-200 transition-colors text-center text-sm sm:text-base border border-transparent focus:border-slate-200"
                      >
                        {Object.keys(activeCategory.units).map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                      <ChevronIcon />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 sm:mt-10 pt-8 sm:pt-10 border-t border-slate-50 flex flex-col items-center">
                <span className="text-[10px] sm:text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-2 sm:mb-3 text-center">Cost Efficiency</span>
                <div className={`text-3xl sm:text-5xl font-black tabular-nums transition-all ${isWinner ? 'text-[#4d7b18]' : 'text-slate-900'}`}>
                  {unitPrice ? `${currency}${unitPrice.toFixed(2)}` : '--'}
                </div>
                <div className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase mt-1 tracking-tighter">per {targetBaseUnit}</div>
              </div>
            </div>
          );
        })}

        {products.length < 10 && (
          <button onClick={addProduct} className="border-4 border-dashed border-slate-200 rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center justify-center text-slate-300 hover:border-[#ec4899]/30 hover:text-[#ec4899] transition-all group min-h-[300px] sm:min-h-[400px]">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-50 group-hover:bg-[#ec4899] group-hover:text-white flex items-center justify-center mb-4 sm:mb-6 transition-all shadow-sm">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeWidth="3" strokeLinecap="round" /></svg>
            </div>
            <span className="font-black uppercase tracking-[0.2em] text-xs sm:text-sm">Add Choice</span>
          </button>
        )}
      </main>

      <footer className="mt-auto pb-8 sm:pb-12 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] text-slate-300 border-t border-slate-100 w-full text-center pt-8 sm:pt-12">
        © 2026 girlmath101 · Vibing by Parancha5
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);