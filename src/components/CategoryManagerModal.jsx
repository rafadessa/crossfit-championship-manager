import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { X, Plus, Trash2, Tag, Users, Dumbbell, Edit3, Check } from 'lucide-react';

export const CategoryManagerModal = ({ isOpen, onClose }) => {
  const { categories, addCategory, updateCategory, deleteCategory, athletes, wods } = useTournament();
  const [newCatName, setNewCatName] = useState('');
  const [editingCatId, setEditingCatId] = useState(null);
  const [editingCatName, setEditingCatName] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName);
    setNewCatName('');
  };

  const handleStartEdit = (cat) => {
    setEditingCatId(cat.id);
    setEditingCatName(cat.name);
  };

  const handleSaveEdit = (catId) => {
    if (!editingCatName.trim()) return;
    updateCategory(catId, editingCatName);
    setEditingCatId(null);
  };

  const handleDelete = (cat) => {
    const athleteCount = athletes.filter(a => a.category === cat.id).length;
    const wodCount = wods.filter(w => w.category === cat.id).length;

    let warningText = `Deseja realmente excluir a categoria "${cat.name}"?`;
    if (athleteCount > 0 || wodCount > 0) {
      warningText += `\n\nAtenção: Existem ${athleteCount} dupla(s) e ${wodCount} WOD(s) vinculados a esta categoria.`;
    }

    if (window.confirm(warningText)) {
      deleteCategory(cat.id);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/85 backdrop-blur-md p-4 flex min-h-full items-center justify-center animate-fade-in">
      
      <div className="wod-card p-6 max-w-lg w-full space-y-5 border-2 border-[#D60036]/50 bg-[#0E1118] shadow-2xl relative rounded-2xl my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D60036]/20 border border-[#D60036]/40 flex items-center justify-center text-[#D60036]">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-black text-white">GERENCIAR CATEGORIAS</h2>
              <p className="text-xs text-slate-400">Adicione, edite ou remova categorias</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form: Add New Category */}
        <form onSubmit={handleAdd} className="space-y-2 shrink-0">
          <label className="text-xs font-heading font-black text-slate-200 uppercase tracking-wider block">
            Nova Categoria
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Ex: Dupla RX, Dupla Scaled..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="flex-1 h-12 px-4 bg-[#0B0D12] border border-white/20 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-[#D60036]"
            />
            <button
              type="submit"
              className="h-12 px-5 bg-[#D60036] hover:brightness-110 text-white text-xs font-heading font-black rounded-xl flex items-center gap-1.5 shrink-0 shadow-lg shadow-[#D60036]/20"
            >
              <Plus className="w-4 h-4" /> Criar
            </button>
          </div>
        </form>

        {/* Existing Categories List */}
        <div className="space-y-2 flex-1 overflow-hidden flex flex-col min-h-0">
          <label className="text-xs font-heading font-black text-slate-400 uppercase tracking-wider block shrink-0">
            Categorias Cadastradas ({categories.length})
          </label>

          <div className="space-y-2 flex-1 overflow-y-auto pr-1">
            {categories.map((cat) => {
              const athleteCount = athletes.filter((a) => a.category === cat.id).length;
              const wodCount = wods.filter((w) => w.category === cat.id).length;
              const isEditing = editingCatId === cat.id;

              return (
                <div
                  key={cat.id}
                  className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between transition-colors hover:border-white/20"
                >
                  <div className="flex-1 mr-3">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingCatName}
                          onChange={(e) => setEditingCatName(e.target.value)}
                          className="h-10 px-3 bg-[#0B0D12] border border-[#D60036] rounded-xl text-white text-xs font-bold w-full"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(cat.id)}
                          className="h-10 px-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 font-bold text-xs flex items-center gap-1 shrink-0"
                        >
                          <Check className="w-4 h-4" /> Salvar
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="font-heading font-bold text-sm text-white">{cat.name}</span>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-0.5">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-slate-400" /> {athleteCount} dupla(s)
                          </span>
                          <span className="flex items-center gap-1">
                            <Dumbbell className="w-3 h-3 text-slate-400" /> {wodCount} WOD(s)
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(cat)}
                        className="p-2.5 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                        title="Editar Nome da Categoria"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
                        disabled={categories.length <= 1}
                        className={`p-2.5 rounded-xl transition-all ${
                          categories.length <= 1
                            ? 'text-slate-600 cursor-not-allowed bg-white/5'
                            : 'text-slate-400 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20'
                        }`}
                        title={categories.length <= 1 ? 'Mantenha ao menos 1 categoria' : 'Excluir Categoria'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-white/10 pt-4 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto h-12 px-6 rounded-xl bg-white/10 text-white font-heading font-bold text-xs hover:bg-white/20"
          >
            Concluir
          </button>
        </div>

      </div>
    </div>
  );
};
