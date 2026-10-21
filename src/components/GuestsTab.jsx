import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Utensils,
  Plus,
  Trash2,
  Layers,
  Sparkles,
  X
} from 'lucide-react';

export default function GuestsTab({ event, onUpdateEvent, onOpenCopilotWithPrompt }) {
  const [filterRsvp, setFilterRsvp] = useState('ALL');
  const [filterTable, setFilterTable] = useState('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New guest state
  const [newName, setNewName] = useState('');
  const [newRsvp, setNewRsvp] = useState('Attending');
  const [newMeal, setNewMeal] = useState('Standard Plated');
  const [newDiet, setNewDiet] = useState('None');
  const [newTable, setNewTable] = useState('1');
  const [newPlusOne, setNewPlusOne] = useState(false);

  const guests = event.guests || [];

  // Metrics
  const totalInvited = guests.length;
  const attendingCount = guests.filter((g) => g.rsvp === 'Attending').length;
  const declinedCount = guests.filter((g) => g.rsvp === 'Declined').length;
  const pendingCount = guests.filter((g) => g.rsvp === 'Pending').length;

  // Dietary counts
  const dietaryRestrictions = guests.filter((g) => g.diet && g.diet !== 'None' && g.diet !== 'N/A');
  const dietarySummary = dietaryRestrictions.reduce((acc, curr) => {
    acc[curr.diet] = (acc[curr.diet] || 0) + 1;
    return acc;
  }, {});

  // Table lists
  const tableNumbers = Array.from(
    new Set(guests.map((g) => (g.table !== null ? String(g.table) : 'Unassigned')))
  ).filter(Boolean);

  const filteredGuests = guests.filter((g) => {
    if (filterRsvp !== 'ALL' && g.rsvp !== filterRsvp) return false;
    if (filterTable !== 'ALL') {
      const gTable = g.table !== null ? String(g.table) : 'Unassigned';
      if (gTable !== filterTable) return false;
    }
    return true;
  });

  const handleUpdateGuest = (id, field, value) => {
    const updated = guests.map((g) => (g.id === id ? { ...g, [field]: value } : g));
    onUpdateEvent({ ...event, guests: updated });
  };

  const handleDeleteGuest = (id) => {
    const updated = guests.filter((g) => g.id !== id);
    onUpdateEvent({ ...event, guests: updated });
  };

  const handleAddGuest = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newG = {
      id: `g-${Date.now()}`,
      name: newName.trim(),
      rsvp: newRsvp,
      meal: newMeal.trim(),
      diet: newDiet.trim(),
      table: newTable ? (isNaN(Number(newTable)) ? newTable : Number(newTable)) : null,
      plusOne: Boolean(newPlusOne)
    };

    onUpdateEvent({
      ...event,
      guests: [...guests, newG]
    });

    setNewName('');
    setNewPlusOne(false);
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total List</div>
          <div className="text-2xl font-bold text-white">{totalInvited}</div>
          <div className="text-[11px] text-slate-500 mt-1">Invited attendees</div>
        </div>

        <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-2xl shadow-lg">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
          </div>
          <div className="text-2xl font-bold text-emerald-300">{attendingCount}</div>
          <div className="text-[11px] text-emerald-400/80 mt-1">
            {totalInvited > 0 ? Math.round((attendingCount / totalInvited) * 100) : 0}% acceptance rate
          </div>
        </div>

        <div className="p-4 bg-amber-950/30 border border-amber-800/40 rounded-2xl shadow-lg">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Pending
          </div>
          <div className="text-2xl font-bold text-amber-300">{pendingCount}</div>
          <div className="text-[11px] text-amber-400/80 mt-1">Awaiting response</div>
        </div>

        <div className="p-4 bg-rose-950/30 border border-rose-800/40 rounded-2xl shadow-lg">
          <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" /> Declined
          </div>
          <div className="text-2xl font-bold text-rose-300">{declinedCount}</div>
          <div className="text-[11px] text-rose-400/80 mt-1">Unable to attend</div>
        </div>
      </div>

      {/* 2. Dietary Requirements Summary Banner */}
      {Object.keys(dietarySummary).length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Dietary Requirements for Caterer:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(dietarySummary).map(([diet, count]) => (
              <span
                key={diet}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-pink-300"
              >
                {diet}: <strong className="text-white">{count}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 3. Action bar & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'Attending', 'Pending', 'Declined'].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRsvp(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterRsvp === r
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {r === 'ALL' ? 'All RSVPs' : r}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenCopilotWithPrompt(`Draft a polite, warm text message reminder for guests who haven't RSVP'd yet for "${event.title}".`)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-indigo-300 text-xs font-semibold rounded-xl border border-indigo-500/20 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI RSVP Reminder Drafter
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Guest
          </button>
        </div>
      </div>

      {/* 4. Guest Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Guest Name</th>
                <th className="px-4 py-3.5">RSVP Status</th>
                <th className="px-4 py-3.5">Meal Selection</th>
                <th className="px-4 py-3.5">Dietary Allergy</th>
                <th className="px-4 py-3.5">Table Assignment</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500 text-xs">
                    No guests match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-100 flex items-center gap-2">
                        <span>{guest.name}</span>
                        {guest.plusOne && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-normal">
                            +1
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <select
                        value={guest.rsvp}
                        onChange={(e) => handleUpdateGuest(guest.id, 'rsvp', e.target.value)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium bg-slate-950 focus:outline-none cursor-pointer ${
                          guest.rsvp === 'Attending'
                            ? 'text-emerald-400 border-emerald-800'
                            : guest.rsvp === 'Declined'
                            ? 'text-rose-400 border-rose-800'
                            : 'text-amber-400 border-amber-800'
                        }`}
                      >
                        <option value="Attending">Attending</option>
                        <option value="Pending">Pending</option>
                        <option value="Declined">Declined</option>
                      </select>
                    </td>

                    <td className="px-4 py-3.5 text-xs text-slate-300">
                      <input
                        type="text"
                        value={guest.meal || ''}
                        onChange={(e) => handleUpdateGuest(guest.id, 'meal', e.target.value)}
                        className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-none w-36 text-slate-200"
                      />
                    </td>

                    <td className="px-4 py-3.5 text-xs">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] ${
                          guest.diet && guest.diet !== 'None' && guest.diet !== 'N/A'
                            ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                            : 'text-slate-500'
                        }`}
                      >
                        {guest.diet || 'None'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-xs font-semibold text-indigo-300">
                      <input
                        type="text"
                        value={guest.table !== null ? String(guest.table) : ''}
                        placeholder="Unassigned"
                        onChange={(e) => handleUpdateGuest(guest.id, 'table', e.target.value)}
                        className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-none w-24 text-indigo-300"
                      />
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteGuest(guest.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Guest */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Add Guest to List</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGuest} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Guest Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Olivia Vance"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">RSVP Status</label>
                  <select
                    value={newRsvp}
                    onChange={(e) => setNewRsvp(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none"
                  >
                    <option value="Attending">Attending</option>
                    <option value="Pending">Pending</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Table #</label>
                  <input
                    type="text"
                    placeholder="1, 2, or VIP"
                    value={newTable}
                    onChange={(e) => setNewTable(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Meal Choice</label>
                  <input
                    type="text"
                    placeholder="Salmon / Beef / Vegan"
                    value={newMeal}
                    onChange={(e) => setNewMeal(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Dietary / Allergy</label>
                  <input
                    type="text"
                    placeholder="Gluten-Free, Nut, None"
                    value={newDiet}
                    onChange={(e) => setNewDiet(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="plusOneCheck"
                  checked={newPlusOne}
                  onChange={(e) => setNewPlusOne(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="plusOneCheck" className="text-xs text-slate-300 cursor-pointer">
                  Includes Plus-One (+1) Guest
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  Save Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
