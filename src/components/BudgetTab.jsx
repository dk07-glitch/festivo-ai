import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ArrowDownRight,
  Sliders,
  Check,
  X
} from 'lucide-react';
import { optimizeBudgetAI } from '../services/geminiService';

export default function BudgetTab({ event, onUpdateEvent }) {
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAiOptimizerOpen, setIsAiOptimizerOpen] = useState(false);
  const [targetSavings, setTargetSavings] = useState(15);
  const [aiReport, setAiReport] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // New item form state
  const [newItemCategory, setNewItemCategory] = useState('Venue');
  const [newItemName, setNewItemName] = useState('');
  const [newItemEstimated, setNewItemEstimated] = useState('');
  const [newItemActual, setNewItemActual] = useState('');

  const items = event.budgetItems || [];

  // Metrics
  const totalBudget = Number(event.totalBudget) || 0;
  const totalEstimated = items.reduce((acc, curr) => acc + (Number(curr.estimated) || 0), 0);
  const totalActual = items.reduce((acc, curr) => acc + (Number(curr.actual) || 0), 0);
  const totalPaid = items.reduce((acc, curr) => acc + (Number(curr.paid) || 0), 0);
  const balanceDue = Math.max(0, totalActual > 0 ? totalActual - totalPaid : totalEstimated - totalPaid);
  const variance = totalBudget - (totalActual > 0 ? totalActual : totalEstimated);
  const isOverBudget = variance < 0;

  // Categories list
  const categories = Array.from(new Set(items.map((i) => i.category)));

  // Category totals
  const categoryBreakdown = categories.map((cat) => {
    const catItems = items.filter((i) => i.category === cat);
    const catTotal = catItems.reduce((acc, i) => acc + (Number(i.actual) || Number(i.estimated) || 0), 0);
    const pct = totalBudget > 0 ? Math.round((catTotal / totalBudget) * 100) : 0;
    return { name: cat, total: catTotal, pct };
  }).sort((a, b) => b.total - a.total);

  const filteredItems = items.filter((item) => {
    if (filterCategory !== 'ALL' && item.category !== filterCategory) return false;
    if (filterStatus !== 'ALL' && item.status !== filterStatus) return false;
    return true;
  });

  const handleUpdateItem = (id, field, value) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const up = { ...item, [field]: value };
        // Auto update status if paid matches actual
        if (field === 'paid' || field === 'actual') {
          const actualVal = field === 'actual' ? Number(value) : Number(item.actual);
          const paidVal = field === 'paid' ? Number(value) : Number(item.paid);
          if (actualVal > 0 && paidVal >= actualVal) {
            up.status = 'paid';
          } else if (paidVal > 0) {
            up.status = 'partial';
          } else {
            up.status = 'pending';
          }
        }
        return up;
      }
      return item;
    });
    onUpdateEvent({ ...event, budgetItems: updated });
  };

  const handleDeleteItem = (id) => {
    const updated = items.filter((item) => item.id !== id);
    onUpdateEvent({ ...event, budgetItems: updated });
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem = {
      id: `b-${Date.now()}`,
      category: newItemCategory,
      name: newItemName.trim(),
      estimated: Number(newItemEstimated) || 0,
      actual: Number(newItemActual) || 0,
      paid: 0,
      status: 'pending'
    };

    onUpdateEvent({
      ...event,
      budgetItems: [...items, newItem]
    });

    setNewItemName('');
    setNewItemEstimated('');
    setNewItemActual('');
    setIsAddOpen(false);
  };

  const runAiOptimizer = async () => {
    setIsOptimizing(true);
    setAiReport(null);
    try {
      const res = await optimizeBudgetAI({
        currentBudget: totalBudget,
        budgetItems: items,
        eventType: event.type,
        targetSavings
      });
      setAiReport(res);
    } catch (err) {
      alert(`Optimization error: ${err.message}`);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Metric Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Target</div>
          <div className="text-xl sm:text-2xl font-bold text-white">
            {event.currency}{totalBudget.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Cap for all categories</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Estimated</div>
          <div className="text-xl sm:text-2xl font-bold text-indigo-300">
            {event.currency}{totalEstimated.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {totalBudget > 0 ? Math.round((totalEstimated / totalBudget) * 100) : 0}% of target
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Actual Contracted</div>
          <div className="text-xl sm:text-2xl font-bold text-slate-100">
            {event.currency}{totalActual.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Confirmed line items</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Paid So Far</div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400">
            {event.currency}{totalPaid.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {event.currency}{balanceDue.toLocaleString()} remaining due
          </div>
        </div>

        <div
          className={`col-span-2 lg:col-span-1 p-4 rounded-2xl shadow-lg border ${
            isOverBudget
              ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
              : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
          }`}
        >
          <div className="text-xs font-semibold uppercase tracking-wider mb-1">
            {isOverBudget ? 'Budget Alert' : 'Under Budget Reserve'}
          </div>
          <div className="text-xl sm:text-2xl font-bold">
            {isOverBudget ? '-' : '+'}{event.currency}{Math.abs(variance).toLocaleString()}
          </div>
          <div className="text-[11px] opacity-80 mt-1">
            {isOverBudget ? 'Action needed to balance' : 'Available buffer reserve'}
          </div>
        </div>
      </div>

      {/* 2. Visual Progress Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-300 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Budget Absorption
          </span>
          <span className="text-slate-400">
            Paid: {event.currency}{totalPaid.toLocaleString()} / Allocated: {event.currency}{totalEstimated.toLocaleString()}
          </span>
        </div>
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${Math.min(100, totalBudget > 0 ? (totalPaid / totalBudget) * 100 : 0)}%` }}
            title="Paid"
          />
          <div
            className="h-full bg-indigo-500 transition-all duration-500"
            style={{
              width: `${Math.min(
                100,
                totalBudget > 0 ? (Math.max(0, totalActual - totalPaid) / totalBudget) * 100 : 0
              )}%`
            }}
            title="Remaining Actual"
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Paid ({Math.round(totalBudget > 0 ? (totalPaid / totalBudget) * 100 : 0)}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Committed / Unpaid
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" /> Remaining Cap
          </span>
        </div>
      </div>

      {/* 3. Category Distribution Badges & AI Optimizer Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterCategory === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Categories ({items.length})
          </button>
          {categoryBreakdown.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setFilterCategory(cat.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterCategory === cat.name
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat.name} ({cat.pct}%)
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setIsAiOptimizerOpen(true);
              if (!aiReport) runAiOptimizer();
            }}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Budget Optimizer
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Expense
          </button>
        </div>
      </div>

      {/* 4. Budget Items Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Category & Item Name</th>
                <th className="px-4 py-3.5">Estimated</th>
                <th className="px-4 py-3.5">Actual Contracted</th>
                <th className="px-4 py-3.5">Paid</th>
                <th className="px-4 py-3.5">Payment Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-normal">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500 text-xs">
                    No budget items match the selected category filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-100">{item.name}</div>
                      <div className="text-[11px] text-indigo-400 mt-0.5">{item.category}</div>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-300">
                      <div className="flex items-center gap-1">
                        <span>{event.currency}</span>
                        <input
                          type="number"
                          value={item.estimated}
                          onChange={(e) => handleUpdateItem(item.id, 'estimated', Number(e.target.value))}
                          className="w-24 bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-none px-1 text-slate-200"
                        />
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-100">
                      <div className="flex items-center gap-1">
                        <span>{event.currency}</span>
                        <input
                          type="number"
                          value={item.actual}
                          onChange={(e) => handleUpdateItem(item.id, 'actual', Number(e.target.value))}
                          className="w-24 bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-none px-1 text-white font-semibold"
                        />
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-emerald-400">
                      <div className="flex items-center gap-1">
                        <span>{event.currency}</span>
                        <input
                          type="number"
                          value={item.paid}
                          onChange={(e) => handleUpdateItem(item.id, 'paid', Number(e.target.value))}
                          className="w-24 bg-transparent border-b border-transparent hover:border-slate-700 focus:border-emerald-500 focus:outline-none px-1 text-emerald-300 font-semibold"
                        />
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateItem(item.id, 'status', e.target.value)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium bg-slate-950 focus:outline-none cursor-pointer ${
                          item.status === 'paid'
                            ? 'text-emerald-400 border-emerald-800'
                            : item.status === 'partial'
                            ? 'text-amber-400 border-amber-800'
                            : 'text-slate-400 border-slate-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="partial">Partial Deposit</option>
                        <option value="paid">Paid in Full</option>
                      </select>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-800"
                        title="Delete expense"
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

      {/* Modal: Add Expense */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Add Budget Expense</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Category</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Venue">Venue</option>
                  <option value="Catering & Bar">Catering & Bar</option>
                  <option value="Photography & Video">Photography & Video</option>
                  <option value="Florals & Decor">Florals & Decor</option>
                  <option value="Music & Entertainment">Music & Entertainment</option>
                  <option value="Attire & Beauty">Attire & Beauty</option>
                  <option value="Rentals & Facilities">Rentals & Facilities</option>
                  <option value="Stationery & Favors">Stationery & Favors</option>
                  <option value="Contingency & Reserve">Contingency & Reserve</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Item Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Drone Videographer or Dessert Bar"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Estimated Cost</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newItemEstimated}
                    onChange={(e) => setNewItemEstimated(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Actual / Quote</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newItemActual}
                    onChange={(e) => setNewItemActual(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
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
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: AI Smart Budget Optimizer */}
      {isAiOptimizerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-xl text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">AI Budget Optimizer & Cost Reducer</h3>
                  <p className="text-xs text-slate-400">Tactical negotiation scripts & strategic alternatives</p>
                </div>
              </div>
              <button onClick={() => setIsAiOptimizerOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Savings Slider */}
            <div className="py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Target Savings Goal: <span className="text-amber-400 font-bold">{targetSavings}%</span> (~{event.currency}{Math.round(totalBudget * (targetSavings / 100)).toLocaleString()})
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="5"
                  value={targetSavings}
                  onChange={(e) => setTargetSavings(Number(e.target.value))}
                  className="w-48 sm:w-64 accent-amber-500 cursor-pointer mt-1.5"
                />
              </div>

              <button
                onClick={runAiOptimizer}
                disabled={isOptimizing}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 self-start sm:self-auto cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isOptimizing ? 'Analyzing Budget...' : 'Re-Analyze with AI'}
              </button>
            </div>

            {/* Report Content */}
            <div className="pt-4 max-h-[60vh] overflow-y-auto pr-2 space-y-4">
              {isOptimizing ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-slate-400 font-medium">
                    Scanning line items, industry markup standards & negotiation leverage...
                  </p>
                </div>
              ) : aiReport ? (
                <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950/60 p-5 rounded-xl border border-slate-800">
                  {aiReport}
                </div>
              ) : null}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800 mt-4">
              <button
                onClick={() => setIsAiOptimizerOpen(false)}
                className="px-5 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl"
              >
                Close Optimizer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
