import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { Users, UserPlus, Search, Trash2, Edit, Shield } from 'lucide-react';

export const AthletesManager = () => {
  const { athletes, categories, addAthlete, updateAthlete, deleteAthlete } = useTournament();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState(null);

  const [formData, setFormData] = useState({
    bib: '',
    name: '',
    box: '',
    category: 'rx_male'
  });

  const filteredAthletes = athletes.filter(athlete => {
    const matchesCategory = selectedCategoryFilter === 'ALL' || athlete.category === selectedCategoryFilter;
    const matchesSearch = athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          athlete.bib.includes(searchTerm) ||
                          athlete.box.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingAthlete(null);
    setFormData({
      bib: String(athletes.length + 101),
      name: '',
      box: '',
      category: 'rx_male'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (athlete) => {
    setEditingAthlete(athlete);
    setFormData({
      bib: athlete.bib,
      name: athlete.name,
      box: athlete.box,
      category: athlete.category
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.bib.trim()) return;

    if (editingAthlete) {
      updateAthlete(editingAthlete.id, formData);
    } else {
      addAthlete(formData);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Header Controls */}
      <div className="wod-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-[#FF5500]" />
              <h1 className="font-heading text-2xl font-black text-white tracking-wide">CADASTRO DE ATLETAS</h1>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">
              Gerencie a lista de competidores, número de peito (bib) e categorias.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="btn-wod btn-wod-primary text-xs self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" /> Novo Atleta
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 pt-3">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            <button
              onClick={() => setSelectedCategoryFilter('ALL')}
              className={`px-3 py-1 rounded-xl text-xs font-heading font-black transition-all whitespace-nowrap ${
                selectedCategoryFilter === 'ALL'
                  ? 'bg-slate-800 text-white border border-white/20'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Todas ({athletes.length})
            </button>

            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`px-3 py-1 rounded-xl text-xs font-heading font-black transition-all whitespace-nowrap ${
                  selectedCategoryFilter === cat.id
                    ? 'bg-slate-800 text-white border border-white/20'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar atleta, bib ou box..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#0A0E17] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF5500]"
            />
          </div>

        </div>
      </div>

      {/* MOBILE CARDS VIEW */}
      <div className="block md:hidden space-y-2.5">
        {filteredAthletes.length === 0 ? (
          <div className="wod-card p-6 text-center text-slate-500 text-xs">
            Nenhum atleta encontrado.
          </div>
        ) : (
          filteredAthletes.map(athlete => {
            const catObj = categories.find(c => c.id === athlete.category);
            return (
              <div key={athlete.id} className="wod-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-black text-[#D4FF00] bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                    #{athlete.bib}
                  </span>
                  <div>
                    <h4 className="font-heading font-black text-white text-sm">{athlete.name}</h4>
                    <p className="text-[10px] text-slate-400">{athlete.box || 'Independente'} • {catObj?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(athlete)}
                    className="p-2 text-slate-400 hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Excluir ${athlete.name}?`)) deleteAthlete(athlete.id);
                    }}
                    className="p-2 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block wod-card overflow-hidden">
        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th className="w-20 text-center">BIB</th>
                <th>ATLETA / EQUIPE</th>
                <th>BOX / AFILIADA</th>
                <th>CATEGORIA</th>
                <th className="text-right pr-6">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filteredAthletes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500">
                    Nenhum atleta cadastrado com os filtros atuais.
                  </td>
                </tr>
              ) : (
                filteredAthletes.map(athlete => {
                  const catObj = categories.find(c => c.id === athlete.category);
                  return (
                    <tr key={athlete.id}>
                      <td className="text-center font-mono text-sm font-bold text-[#D4FF00]">
                        #{athlete.bib}
                      </td>

                      <td className="font-heading font-bold text-white text-sm">
                        {athlete.name}
                      </td>

                      <td className="text-slate-300 text-xs">
                        <span className="flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-slate-500" /> {athlete.box || 'Independente'}
                        </span>
                      </td>

                      <td>
                        <span className="wod-chip bg-[#D4FF00]/15 text-[#D4FF00] border border-[#D4FF00]/30 text-[9px]">
                          {catObj ? catObj.name : athlete.category}
                        </span>
                      </td>

                      <td className="text-right pr-6 space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(athlete)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                          title="Editar Atleta"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Excluir o atleta "${athlete.name}"?`)) {
                              deleteAthlete(athlete.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          title="Excluir Atleta"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Athlete Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="wod-card p-6 max-w-md w-full space-y-4 border-[#FF5500]/40">
            <h2 className="font-heading text-2xl font-black text-white flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-[#FF5500]" />
              {editingAthlete ? 'Editar Atleta' : 'Novo Atleta'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1 col-span-1">
                  <label className="text-xs font-heading font-extrabold text-slate-300 uppercase">BIB (#)</label>
                  <input
                    type="text"
                    required
                    placeholder="101"
                    value={formData.bib}
                    onChange={e => setFormData({ ...formData, bib: e.target.value })}
                    className="w-full p-3 bg-[#0A0E17] border border-white/15 rounded-xl text-white text-xs font-mono font-bold focus:border-[#FF5500]"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-heading font-extrabold text-slate-300 uppercase">Nome Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Nome do atleta"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 bg-[#0A0E17] border border-white/15 rounded-xl text-white text-xs font-bold focus:border-[#FF5500]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-heading font-extrabold text-slate-300 uppercase">Box / CT</label>
                <input
                  type="text"
                  placeholder="Ex: CrossFit IronBox"
                  value={formData.box}
                  onChange={e => setFormData({ ...formData, box: e.target.value })}
                  className="w-full p-3 bg-[#0A0E17] border border-white/15 rounded-xl text-white text-xs focus:border-[#FF5500]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-heading font-extrabold text-slate-300 uppercase">Categoria</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 bg-[#0A0E17] border border-white/15 rounded-xl text-white text-xs font-bold focus:border-[#FF5500]"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-wod btn-wod-secondary text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-wod btn-wod-primary text-xs"
                >
                  {editingAthlete ? 'Atualizar Atleta' : 'Salvar Atleta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
