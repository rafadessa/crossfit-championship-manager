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
    <div className="space-y-6 fade-in">
      
      {/* Header Controls */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-7 h-7 text-cyan-400" />
              <h1 className="font-display text-3xl font-black text-white tracking-wide">CADASTRO DE ATLETAS E TIMES</h1>
            </div>
            <p className="text-slate-400 text-xs mt-1">
              Gerencie a lista de competidores, numeração de peito (bibs) e atribuição de categorias.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="btn btn-primary self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" /> Cadastrar Atleta / Time
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-4">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategoryFilter === 'ALL'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Todas ({athletes.length})
            </button>

            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategoryFilter === cat.id
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
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
              className="input-control pl-9 py-1.5 text-xs bg-slate-900"
            />
          </div>

        </div>
      </div>

      {/* Athletes Table */}
      <div className="glass-panel overflow-hidden">
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
                      {/* Bib */}
                      <td className="text-center font-mono text-sm font-bold text-[#ccff00]">
                        #{athlete.bib}
                      </td>

                      {/* Name */}
                      <td className="font-bold text-white">
                        {athlete.name}
                      </td>

                      {/* Box */}
                      <td className="text-slate-300 text-xs">
                        <span className="flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-slate-500" /> {athlete.box || 'Independente'}
                        </span>
                      </td>

                      {/* Category */}
                      <td>
                        <span className="badge badge-cyan">
                          {catObj ? catObj.name : athlete.category}
                        </span>
                      </td>

                      {/* Actions */}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm fade-in">
          <div className="glass-panel p-6 max-w-md w-full space-y-4 border-cyan-500/30">
            <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-cyan-400" />
              {editingAthlete ? 'Editar Atleta' : 'Novo Atleta'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="form-group col-span-1">
                  <label className="form-label">BIB (#)</label>
                  <input
                    type="text"
                    required
                    placeholder="101"
                    value={formData.bib}
                    onChange={e => setFormData({ ...formData, bib: e.target.value })}
                    className="input-control font-mono"
                  />
                </div>

                <div className="form-group col-span-2">
                  <label className="form-label">Nome Completo / Time</label>
                  <input
                    type="text"
                    required
                    placeholder="Nome do atleta"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="input-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Box / Centro de Treinamento</label>
                <input
                  type="text"
                  placeholder="Ex: CrossFit IronBox"
                  value={formData.box}
                  onChange={e => setFormData({ ...formData, box: e.target.value })}
                  className="input-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Categoria de Disputa</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="select-control"
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
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editingAthlete ? 'Atualizar Atleta' : 'Cadastrar Atleta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
