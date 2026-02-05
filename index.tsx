import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

interface Product {
  id: string;
  name: string;
  price: number | '';
  amount: number | '';
  unit: string;
}

interface Category {
  label: string;
  units: Record<string, { label: string; factor: number }>;
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
  }
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
      <clipPath id="a7dca316bb"><path d="M 0 6.265625 L 1493.734375 6.265625 L 1493.734375 1500 L 0 1500 Z M 0 6.265625 " clipRule="nonzero"/></clipPath>
      <clipPath id="31967748a5"><path d="M 120 6.265625 L 1373.734375 6.265625 C 1440.007812 6.265625 1493.734375 59.992188 1493.734375 126.265625 L 1493.734375 1380 C 1493.734375 1446.273438 1440.007812 1500 1373.734375 1500 L 120 1500 C 53.726562 1500 0 1446.273438 0 1380 L 0 126.265625 C 0 59.992188 53.726562 6.265625 120 6.265625 Z M 120 6.265625 " clipRule="nonzero"/></clipPath>
      <clipPath id="ec356d4c24"><path d="M 0 0.265625 L 1493.734375 0.265625 L 1493.734375 1494 L 0 1494 Z M 0 0.265625 " clipRule="nonzero"/></clipPath>
      <clipPath id="f84c03aac4"><path d="M 120 0.265625 L 1373.734375 0.265625 C 1440.007812 0.265625 1493.734375 53.992188 1493.734375 120.265625 L 1493.734375 1374 C 1493.734375 1440.273438 1440.007812 1494 1373.734375 1494 L 120 1494 C 53.726562 1494 0 1440.273438 0 1374 L 0 120.265625 C 0 53.992188 53.726562 0.265625 120 0.265625 Z M 120 0.265625 " clipRule="nonzero"/></clipPath>
    </defs>
    <g transform="matrix(1, 0, 0, 1, 0, 0)">
      <g clipPath="url(#a7dca316bb)">
        <g clipPath="url(#31967748a5)">
          <g transform="matrix(1, 0, 0, 1, 0, 6)">
            <g clipPath="url(#f84c03aac4)">
              <path fill="#4d7b18" d="M 0 0.265625 L 1493.734375 0.265625 L 1493.734375 1494 L 0 1494 Z M 0 0.265625 " fillOpacity="1" fillRule="nonzero"/>
            </g>
          </g>
        </g>
      </g>
      <g fill="#ffa4ac" fillOpacity="1">
        <g transform="translate(247.277797, 1275.084069)">
          <path d="M 335.40625 -52.609375 L 378.15625 -440.625 C 379.613281 -451.59375 374.5 -457.078125 362.8125 -457.078125 C 351.84375 -457.078125 345.628906 -451.59375 344.171875 -440.625 L 302.515625 -53.703125 C 301.054688 -42.742188 304.710938 -36.171875 313.484375 -33.984375 C 318.597656 -32.515625 323.347656 -33.609375 327.734375 -37.265625 C 332.117188 -40.921875 334.675781 -46.035156 335.40625 -52.609375 Z M 723.421875 -1000.734375 L 723.421875 -540.375 C 723.421875 -526.488281 716.476562 -519.546875 702.59375 -519.546875 L 417.609375 -519.546875 C 410.304688 -519.546875 403.546875 -522.46875 397.328125 -528.3125 C 391.117188 -534.15625 388.378906 -540.734375 389.109375 -548.046875 L 435.15625 -976.625 C 436.613281 -987.582031 431.863281 -993.0625 420.90625 -993.0625 C 409.9375 -993.0625 403.722656 -987.582031 402.265625 -976.625 L 351.84375 -509.6875 C 351.113281 -503.84375 352.570312 -498.546875 356.21875 -493.796875 C 359.875 -489.046875 364.628906 -486.671875 370.484375 -486.671875 L 702.59375 -486.671875 C 716.476562 -486.671875 723.421875 -479.726562 723.421875 -465.84375 L 723.421875 -20.828125 C 723.421875 -6.941406 716.476562 0 702.59375 0 L 167.703125 0 C 122.398438 0 85.863281 -13.878906 58.09375 -41.640625 C 30.320312 -69.410156 16.4375 -105.953125 16.4375 -151.265625 L 16.4375 -874.6875 C 16.4375 -919.988281 30.320312 -956.519531 58.09375 -984.28125 C 85.863281 -1012.050781 122.398438 -1025.9375 167.703125 -1025.9375 L 698.21875 -1025.9375 C 715.019531 -1025.9375 723.421875 -1017.535156 723.421875 -1000.734375 Z" fillRule="nonzero"/>
        </g>
        <g transform="translate(1094, 0)">
          <path d="M 59.671875 -72.484375 L 59.671875 -122.78125 L 9.859375 -122.78125 L 9.859375 -178.5 L 59.671875 -178.5 L 59.671875 -228.296875 L 115.390625 -228.296875 L 115.390625 -178.5 L 165.671875 -178.5 L 165.671875 -122.78125 L 115.390625 -122.78125 L 115.390625 -72.484375 Z" transform="translate(0, 484.23)" fillRule="nonzero"/>
          <path d="M 14.296875 -122.78125 L 14.296875 -178.5 L 138.5625 -178.5 L 138.5625 -122.78125 Z" transform="translate(11.29, 730.77)" fillRule="nonzero"/>
          <path d="M 50.296875 -75.4375 L 10.359375 -114.890625 L 45.859375 -150.390625 L 10.359375 -185.890625 L 50.296875 -225.34375 L 85.3125 -189.84375 L 120.8125 -225.34375 L 160.25 -185.890625 L 124.75 -150.390625 L 160.25 -114.890625 L 120.8125 -75.4375 L 85.3125 -110.953125 Z" transform="translate(2.42, 977.32)" fillRule="nonzero"/>
        </g>
        <g transform="translate(1105, 762)">
          <path d="M 46.34375 -235.203125 L 46.34375 -306.703125 L 118.34375 -306.703125 L 118.34375 -235.203125 Z M 8.375 -153.84375 L 8.375 -209.5625 L 156.3125 -209.5625 L 156.3125 -153.84375 Z M 46.34375 -57.203125 L 46.34375 -128.703125 L 118.34375 -128.703125 L 118.34375 -57.203125 Z" transform="translate(0.37, 561.74)" fillRule="nonzero"/>
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
    setTargetBaseUnit(units[0]);
    setProducts(products.map(p => ({ ...p, unit: units[0] })));
  };

  const addProduct = () => {
    if (products.length >= 10) return;
    setProducts([
      ...products,
      { id: Date.now().toString(), name: `Product ${products.length + 1}`, price: '', amount: '', unit: Object.keys(activeCategory.units)[0] },
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
    const targetUnitFactor = activeCategory.units[targetBaseUnit]?.factor || 1;
    const analyzed = products
      .filter(p => p.price !== '' && p.amount !== '' && (p.amount as number) > 0)
      .map(p => {
        const inputFactor = activeCategory.units[p.unit]?.factor || 1;
        const pricePerBase = (p.price as number) / ((p.amount as number) * inputFactor);
        return { id: p.id, unitPrice: pricePerBase * targetUnitFactor };
      });

    if (analyzed.length === 0) return { bestId: null, unitPrices: {} };
    const sorted = [...analyzed].sort((a, b) => a.unitPrice - b.unitPrice);
    const pricesMap = analyzed.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.unitPrice }), {} as any);
    return { bestId: sorted[0].id, unitPrices: pricesMap };
  }, [products, activeCategory, targetBaseUnit]);

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-16 px-4 flex flex-col items-center antialiased transition-all duration-300">
      <header className="w-full max-w-4xl mb-6 sm:mb-16 flex flex-col items-center">
        <Logo className="h-16 w-16 sm:h-20 sm:w-20 mb-3 sm:mb-8 drop-shadow-[0_10px_15px_rgba(77,123,24,0.15)] transition-all" />
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight text-center leading-tight">Girl Math 101</h1>
        <p className="text-[#ec4899] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-2 sm:mt-4 text-center text-[10px] sm:text-sm opacity-80">Because if you save money, it's basically free.</p>
        
        <div className="w-full bg-white mt-8 sm:mt-12 p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
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
            <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Unit</label>
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
                <option value="฿">THB (฿)</option>
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
              </select>
              <ChevronIcon />
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-10 mb-20 px-2 sm:px-4">
        {products.map(product => {
          const isWinner = calculations.bestId === product.id;
          const unitPrice = calculations.unitPrices[product.id];
          return (
            <div key={product.id} className={`bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-xl transition-all duration-500 relative border-2 ${isWinner ? 'border-[#4d7b18] ring-[8px] sm:ring-[12px] ring-[#4d7b18]/5 sm:scale-105 z-10' : 'border-transparent opacity-90'}`}>
              {isWinner && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4d7b18] text-white text-[10px] sm:text-[11px] font-black px-4 sm:px-6 py-1.5 sm:py-2 rounded-full uppercase tracking-widest shadow-lg shadow-[#4d7b18]/30 z-20">
                  Basically Free
                </div>
              )}
              
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <input 
                  className="text-lg sm:text-2xl font-black bg-transparent outline-none w-3/4 border-b-2 border-transparent focus:border-slate-100 transition-all" 
                  value={product.name} 
                  onChange={e => updateProduct(product.id, 'name', e.target.value)}
                />
                {products.length > 2 && (
                  <button onClick={() => removeProduct(product.id)} className="text-slate-200 hover:text-rose-500 transition-colors p-1">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="relative">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 block mb-1.5 sm:mb-2 ml-1">Price</label>
                  <div className="relative">
                    <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-lg sm:text-xl font-bold text-slate-400">{currency}</span>
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
                <span className="text-[10px] sm:text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-2 sm:mb-3 text-center">Cost Per {targetBaseUnit}</span>
                <div className={`text-3xl sm:text-5xl font-black tabular-nums transition-all ${isWinner ? 'text-[#4d7b18]' : 'text-slate-900'}`}>
                  {unitPrice ? `${currency}${unitPrice.toFixed(2)}` : '--'}
                </div>
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

      <footer className="mt-auto pb-12 sm:pb-16 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] text-slate-300 border-t border-slate-100 w-full text-center pt-8 sm:pt-12">
        © 2026 girlmath101 · Vibing by Parancha5
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);