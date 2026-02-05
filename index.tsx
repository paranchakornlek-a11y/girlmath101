import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

// Simple SideDrawer implementation
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

const Logo = ({ className }: { className?: string }) => (
  <svg 
    className={className}
    viewBox="0 0 1500 1500" 
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <clipPath id="a7dca316bb"><path d="M 0 6.265625 L 1493.734375 6.265625 L 1493.734375 1500 L 0 1500 Z" /></clipPath>
      <clipPath id="31967748a5"><path d="M 120 6.265625 L 1373.734375 6.265625 C 1440.007812 6.265625 1493.734375 59.992188 1493.734375 126.265625 L 1493.734375 1380 C 1493.734375 1446.273438 1440.007812 1500 1373.734375 1500 L 120 1500 C 53.726562 1500 0 1446.273438 0 1380 L 0 126.265625 C 0 59.992188 53.726562 6.265625 120 6.265625 Z" /></clipPath>
    </defs>
    <g clipPath="url(#31967748a5)">
      <rect width="100%" height="100%" fill="#4d7b18" />
      <g fill="#ffa4ac">
        <g transform="translate(247, 1275)">
          <path d="M 335.4 -52.6 L 378.1 -440.6 C 379.6 -451.5 374.5 -457 362.8 -457 C 351.8 -457 345.6 -451.5 344.1 -440.6 L 302.5 -53.7 C 301.0 -42.7 304.7 -36.1 313.4 -33.9 C 318.5 -32.5 323.3 -33.6 327.7 -37.2 C 332.1 -40.9 334.6 -46.0 335.4 -52.6 Z M 723.4 -1000.7 L 723.4 -540.3 C 723.4 -526.4 716.4 -519.5 702.5 -519.5 L 417.6 -519.5 C 410.3 -519.5 403.5 -522.4 397.3 -528.3 C 391.1 -534.1 388.3 -540.7 389.1 -548.0 L 435.1 -976.6 C 436.6 -987.5 431.8 -993 420.9 -993 C 409.9 -993 403.7 -987.5 402.2 -976.6 L 351.8 -509.6 C 351.1 -503.8 352.5 -498.5 356.2 -493.7 C 359.8 -489 364.6 -486.6 370.4 -486.6 L 702.5 -486.6 C 716.4 -486.6 723.4 -479.7 723.4 -465.8 L 723.4 -20.8 C 723.4 -6.9 716.4 0 702.5 0 L 167.7 0 C 122.3 0 85.8 -13.8 58.0 -41.6 C 30.3 -69.4 16.4 -105.9 16.4 -151.2 L 16.4 -874.6 C 16.4 -919.9 30.3 -956.5 58.0 -984.2 C 85.8 -1012 122.3 -1025.9 167.7 -1025.9 L 698.2 -1025.9 C 715.0 -1025.9 723.4 -1017.5 723.4 -1000.7 Z" />
        </g>
        <g transform="translate(1094, 484)">
           <path d="M 59.6 -72.4 L 59.6 -122.7 L 9.8 -122.7 L 9.8 -178.5 L 59.6 -178.5 L 59.6 -228.2 L 115.3 -228.2 L 115.3 -178.5 L 165.6 -178.5 L 165.6 -122.7 L 115.3 -122.7 L 115.3 -72.4 Z" />
        </g>
        <g transform="translate(1105, 1200)">
           <path d="M 46.3 -235.2 L 46.3 -306.7 L 118.3 -306.7 L 118.3 -235.2 Z M 8.3 -153.8 L 8.3 -209.5 L 156.3 -209.5 L 156.3 -153.8 Z M 46.3 -57.2 L 46.3 -128.7 L 118.3 -128.7 L 118.3 -57.2 Z" />
        </g>
      </g>
    </g>
  </svg>
);

const App = () => {
  const [categoryKey, setCategoryKey] = useState<string>('weight');
  const [targetBaseUnit, setTargetBaseUnit] = useState<string>('g');
  const [currency, setCurrency] = useState('฿');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
      .filter(p => p.price !== '' && p.amount !== '' && p.amount > 0)
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
    <div className="min-h-screen bg-slate-50 py-16 px-4 flex flex-col items-center">
      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Manual Sync Helper">
        <div className="space-y-6 text-sm text-slate-600">
          <p>Because your automatic GitHub sync is failing, follow these steps:</p>
          <ol className="list-decimal pl-5 space-y-4">
            <li>Download the files manually from this editor.</li>
            <li>Go to your GitHub Repo: <strong>paranchakornlek-ally/girlmath101app</strong></li>
            <li>Upload the new <strong>index.html</strong>, <strong>index.tsx</strong>, and <strong>package.json</strong>.</li>
            <li>Commit the changes. Vercel will then auto-redeploy.</li>
          </ol>
        </div>
      </SideDrawer>

      <header className="w-full max-w-4xl mb-16 flex flex-col items-center relative">
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="absolute top-0 right-0 p-3 bg-white border border-slate-100 rounded-2xl text-[#ec4899] shadow-sm hover:shadow-md transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </button>

        <Logo className="h-20 w-20 mb-8 drop-shadow-xl" />
        <h1 className="text-5xl font-black text-slate-900 tracking-tight text-center">Girl Math 101</h1>
        <p className="text-[#ec4899] font-bold uppercase tracking-widest mt-4">Because if you save money, it's basically free.</p>
        
        <div className="w-full bg-white mt-12 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-400">Measurement</label>
            <select value={categoryKey} onChange={e => handleCategoryChange(e.target.value)} className="bg-slate-50 p-4 rounded-2xl font-bold outline-none border border-transparent focus:border-[#ec4899]/30">
              {Object.entries(CATEGORIES).map(([key, cat]) => <option key={key} value={key}>{cat.label}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-400">Unit To Compare</label>
            <select value={targetBaseUnit} onChange={e => setTargetBaseUnit(e.target.value)} className="bg-slate-50 p-4 rounded-2xl font-bold outline-none border border-transparent focus:border-[#ec4899]/30">
              {Object.entries(activeCategory.units).map(([key, info]) => <option key={key} value={key}>{info.label}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-400">Currency</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className="bg-slate-50 p-4 rounded-2xl font-bold outline-none border border-transparent focus:border-[#ec4899]/30">
              <option value="฿">THB (฿)</option>
              <option value="$">USD ($)</option>
              <option value="€">EUR (€)</option>
            </select>
          </div>
        </div>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {products.map(product => {
          const isWinner = calculations.bestId === product.id;
          const price = calculations.unitPrices[product.id];
          return (
            <div key={product.id} className={`bg-white rounded-[2.5rem] p-8 shadow-xl transition-all border-4 ${isWinner ? 'border-[#4d7b18] ring-8 ring-[#4d7b18]/5 scale-105' : 'border-transparent'}`}>
              <div className="flex justify-between items-center mb-6">
                <input 
                  className="text-xl font-black bg-transparent outline-none w-2/3" 
                  value={product.name} 
                  onChange={e => updateProduct(product.id, 'name', e.target.value)}
                />
                {isWinner && <span className="bg-[#4d7b18] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Basically Free</span>}
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">{currency}</span>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    className="w-full bg-slate-50 p-4 pl-10 rounded-2xl font-bold outline-none"
                    value={product.price}
                    onChange={e => updateProduct(product.id, 'price', e.target.value === '' ? '' : parseFloat(e.target.value))}
                  />
                </div>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Qty"
                    className="w-2/3 bg-slate-50 p-4 rounded-2xl font-bold outline-none"
                    value={product.amount}
                    onChange={e => updateProduct(product.id, 'amount', e.target.value === '' ? '' : parseFloat(e.target.value))}
                  />
                  <select 
                    value={product.unit} 
                    onChange={e => updateProduct(product.id, 'unit', e.target.value)}
                    className="w-1/3 bg-slate-100 rounded-2xl px-2 font-bold text-xs"
                  >
                    {Object.keys(activeCategory.units).map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col items-center">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Cost Per {targetBaseUnit}</span>
                <div className={`text-4xl font-black ${isWinner ? 'text-[#4d7b18]' : 'text-slate-900'}`}>
                  {price ? `${currency}${price.toFixed(2)}` : '--'}
                </div>
              </div>
            </div>
          );
        })}

        {products.length < 10 && (
          <button onClick={addProduct} className="border-4 border-dashed border-slate-200 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-slate-300 hover:border-[#ec4899]/30 hover:text-[#ec4899] transition-all group">
            <svg className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeWidth="3" strokeLinecap="round" /></svg>
            <span className="font-black uppercase tracking-widest text-sm">Add Choice</span>
          </button>
        )}
      </main>

      <footer className="mt-auto pb-12 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
        © 2026 girlmath101 · Vibing by Parancha5
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);