import React, { useState } from 'react';
import { Plus, Trash2, PieChart, Settings } from 'lucide-react';
import { useLocalStorage } from 'usehooks-ts';

const DEFAULT_CATEGORIAS = [
  // { id: '1', nombre: 'Ahorro obligatorio', porcentaje: 0.20 },
  // { id: '2', nombre: 'Ahorro Compra', porcentaje: 0.40 },
  // { id: '3', nombre: 'Ahorro emergencia', porcentaje: 0.10 },
  // { id: '4', nombre: 'Gasto libre', porcentaje: 0.30 },
];

const formatCurrency = (value) => {
  const num = parseFloat(value);
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

function DistribucionTab({ categorias, setCategorias }) {
  const [ingreso, setIngreso] = useState(0);

  const handleIngresoKeyDown = (e) => {
    e.preventDefault();
    if (e.key >= '0' && e.key <= '9') {
      if (ingreso > 999999999) return;
      const digit = parseInt(e.key, 10);
      setIngreso(current => (current * 10) + digit);
    } else if (e.key === 'Backspace') {
      setIngreso(current => Math.floor(current / 10));
    } else if (e.key === 'Escape') {
      setIngreso(0);
    }
  };

  const handlePorcentajeChange = (id, valor) => {
    if (valor === '' || /^\d*\.?\d*$/.test(valor)) {
      const nuevasCategorias = categorias.map(cat => {
        if (cat.id === id) {
          const decimal = valor === '' ? 0 : parseFloat(valor) / 100;
          return { ...cat, porcentaje: isNaN(decimal) ? 0 : decimal };
        }
        return cat;
      });
      setCategorias(nuevasCategorias);
    }
  };
  
  const ingresoNumerico = ingreso / 100;
  const totalPorcentaje = categorias.reduce((acc, cat) => acc + cat.porcentaje, 0);
  const displayIngreso = `$${ingresoNumerico.toFixed(2)}`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-600">
            Ingreso quincenal
          </label>
          <span className="text-xs text-gray-500 hidden sm:block">Usa teclas numéricas</span>
        </div>
        <div className="relative">
          <input
            className="w-full h-14 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right font-mono text-xl shadow-sm transition-all"
            value={displayIngreso}
            onKeyDown={handleIngresoKeyDown}
            readOnly
          />
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="text-gray-400 text-xl">$</span>
          </div>
        </div>
      </div>
      
      <div className="py-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
          <span className="text-sm font-medium text-gray-600">Distribución</span>
          <span className={`text-sm font-medium ${totalPorcentaje > 1 ? 'text-red-500' : 'text-gray-500'}`}>
            {(totalPorcentaje * 100).toFixed(2)}% asignado
            {totalPorcentaje > 1 && " ⚠️"}
          </span>
        </div>
        
        <div className="space-y-3">
          {categorias.map((cat) => (
            <div 
              key={cat.id} 
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col gap-4 sm:grid sm:grid-cols-12 sm:gap-4">
                <div className="sm:col-span-7">
                  <span className="font-medium text-gray-800">{cat.nombre}</span>
                </div>
                
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:col-span-5">
                  <div className="relative w-full">
                    <input
                      type="text"
                      inputMode="decimal"
                      className="w-full py-2 px-3 border border-gray-200 rounded-lg text-right pr-7 focus:ring-blue-500 focus:border-blue-500 transition"
                      value={cat.porcentaje > 0 ? (cat.porcentaje * 100).toString() : ''}
                      onChange={(e) => handlePorcentajeChange(cat.id, e.target.value)}
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                  </div>
                  
                  <div className="w-full font-mono text-gray-800 bg-zinc-100 p-2 rounded-lg text-right">
                    ${formatCurrency(ingresoNumerico * cat.porcentaje)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <span className="font-semibold text-gray-700">Total distribuido</span>
          <span className="font-mono text-lg sm:text-xl font-bold text-blue-600">
            ${formatCurrency(ingresoNumerico * totalPorcentaje)}
          </span>
        </div>
      </div>
    </div>
  );
}

function CategoriasTab({ categorias, setCategorias }) {
  const [nuevaCatNombre, setNuevaCatNombre] = useState('');

  const handleAddCategoria = () => {
    if (nuevaCatNombre.trim() === '') return;
    const nuevaCategoria = {
      id: crypto.randomUUID(),
      nombre: nuevaCatNombre.trim(),
      porcentaje: 0
    };
    setCategorias([...categorias, nuevaCategoria]);
    setNuevaCatNombre('');
  };

  const handleUpdateCategoria = (id, campo, valor) => {
    const nuevasCategorias = categorias.map(cat => {
      if (cat.id === id) {
        return { ...cat, [campo]: valor };
      }
      return cat;
    });
    setCategorias(nuevasCategorias);
  };

  const handleDeleteCategoria = (id) => {
    setCategorias(categorias.filter(cat => cat.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={nuevaCatNombre}
          onChange={(e) => setNuevaCatNombre(e.target.value)}
          placeholder="Nombre de nueva categoría"
          className="flex-grow px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition"
          onKeyPress={(e) => e.key === 'Enter' && handleAddCategoria()}
        />
        <button
          onClick={handleAddCategoria}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Agregar
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Categorías Existentes</h3>
        
        {categorias.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500">No hay categorías</p>
            <p className="text-sm text-gray-400 mt-1">Añade una para empezar</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            {categorias.map((cat) => (
              <div 
                key={cat.id} 
                className="p-3 bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    type="text"
                    value={cat.nombre}
                    onChange={(e) => handleUpdateCategoria(cat.id, 'nombre', e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                  <div className="flex sm:justify-start sm:mt-0">
                    <button
                      onClick={() => handleDeleteCategoria(cat.id)}
                      className="flex items-center gap-4 justify-start p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                      aria-label="Eliminar categoría"
                    >
                      <span>Borrar</span>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('distribucion');
  const [categorias, setCategorias] = useLocalStorage('cat',DEFAULT_CATEGORIAS);

  const TabButton = ({ tabName, icon, children }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 px-1 font-medium transition-all ${
        activeTab === tabName
          ? 'text-blue-600 border-b-2 border-blue-500'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {icon}
      <span className="text-xs sm:text-sm mt-1 sm:mt-0">{children}</span>
    </button>
  );

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex flex-col sm:flex-row">
              <TabButton tabName="distribucion" icon={<PieChart size={20}/>}>
                Distribución
              </TabButton>
              <TabButton tabName="categorias" icon={<Settings size={20}/>}>
                Categorías
              </TabButton>
            </div>
          </div>
          
          <div className="p-5">
            {activeTab === 'distribucion' ? (
              <DistribucionTab categorias={categorias} setCategorias={setCategorias} />
            ) : (
              <CategoriasTab categorias={categorias} setCategorias={setCategorias} />
            )}
          </div>
        </div>
        
        <footer className="text-center mt-6 text-xs text-gray-400">
          <p>Calculadora de presupuesto con pestañas</p>
        </footer>
      </div>
      
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default App;