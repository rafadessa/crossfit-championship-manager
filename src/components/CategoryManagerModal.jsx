import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { X, Plus, Trash2, Tag, Users, Dumbbell, AlertTriangle } from 'lucide-react';

export const CategoryManagerModal = ({ isOpen, onClose }) => {
  const { categories, addCategory, deleteCategory, athletes, wods } = useTournament();
  const [newCatName, setNewCatName] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName);
    setNewCatName('');
  };

  const handleDelete = (cat) => {
    const athleteCount = athletes.filter(a => a.category === cat.id).length;
    const wodCount = wods.filter(w => w.category === cat.id).length;

    let warningText = `Deseja realmente excluir a categoria "${cat.name}"?`;
    if (athleteCount > 0 || wodCount > 0) {
      warningText += `\n\nAtenção: Existem ${athleteCount} atleta(s) e ${wodCount} WOD(s) vinculados a esta categoria.`;
    }

    if (window.confirm(warningText)) {
      deleteCategory(cat.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="wod-card p-6 max-w-lg w-full space-y-5 border-[#D60036]/40 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#D60036]/20 border border-[#D60036]/40 flex items-center justify-center text-[#D60036]">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-black text-white">GERENCIAR CATEGORIAS</h2>
              <p className="text-xs text-slate-400">Adicione ou remova categorias do campeonato</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form: Add New Category */}
        <form onSubmit={handleAdd} className="space-y-2">
          <label className="text-xs font-heading font-extrabold text-slate-300 uppercase block">
            Nova Categoria
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Ex: Master 40+, Trio RX..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="flex-1 p-3 bg-[#0B0D12] border border-white/15 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-[#D60036]"
            />
            <button
              type="submit"
              className="btn-wod btn-wod-primary text-xs px-4 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Criar
            </button>
          </div>
        </form>

        {/* Existing Categories List */}
        <div className="space-y-2">
          <label className="text-xs font-heading font-extrabold text-slate-400 uppercase block">
            Categorias Cadastradas ({categories.length})
          </label>

          <div className="max-h-60 overflow-y-auto space-y-2 pr-1 no-scrollbar">
            {categories.map((cat) => {
              const athleteCount = athletes.filter((a) => a.category === cat.id).length;
              const wodCount = wods.filter((w) => w.category === cat.id).length;

              return (
                <div
                  key={cat.id}
                  className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between transition-colors hover:border-white/20"
                >
                  <div>
                    <span className="font-heading font-bold text-sm text-white">{cat.name}</span>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-0.5">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" /> {athleteCount} atleta(s)
                      </span>
                      <span className="flex items-center gap-1">
                        <Dumbbell className="w-3 h-3 text-slate-400" /> {wodCount} WOD(s)
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(cat)}
                    disabled={categories.length <= 1}
                    className={`p-2 rounded-xl transition-all ${
                      categories.length <= 1
                        ? 'text-slate-600 cursor-not-allowed'
                        : 'text-slate-400 hover:text-red-400 hover:bg-red-500/10'
                    }`}
                    title={categories.length <= 1 ? 'Mantenha ao menos 1 categoria' : 'Excluir Categoria'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-white/10 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="btn-wod btn-wod-secondary text-xs"
          >
            Concluir
          </button>
        </div>

      </div>
    </div>
  );
};
