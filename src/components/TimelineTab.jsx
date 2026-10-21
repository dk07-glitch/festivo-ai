import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Sparkles,
  AlertTriangle,
  Printer,
  ShieldAlert,
  ArrowRight,
  User,
  MapPin,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateContingencyPlan } from '../services/geminiService';

export default function TimelineTab({ event, onUpdateEvent, onOpenPrintModal }) {
  const [activeView, setActiveView] = useState('roadmap'); // 'roadmap' | 'dayOf'
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);

  // New milestone form
  const [newTimeframe, setNewTimeframe] = useState('1 Month Out');
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newPriority, setNewPriority] = useState('high');

  // New day-of form
  const [newTime, setNewTime] = useState('02:00 PM');
  const [newActivity, setNewActivity] = useState('');
  const [newLead, setNewLead] = useState('');
  const [newLocation, setNewLocation] = useState('');

  // AI Contingency Modal
  const [isContingencyOpen, setIsContingencyOpen] = useState(false);
  const [scenarioInput, setScenarioInput] = useState('Sudden rainstorm during outdoor ceremony / gathering');
  const [contingencyPlan, setContingencyPlan] = useState(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const timeline = event.timeline || [];
  const dayOfSchedule = event.dayOfSchedule || [];

  const handleToggleMilestone = (id) => {
    const updated = timeline.map((m) => {
      if (m.id === id) {
        const nextDone = !m.done;
        if (nextDone) {
          confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.7 }
          });
        }
        return { ...m, done: nextDone };
      }
      return m;
    });
    onUpdateEvent({ ...event, timeline: updated });
  };

  const handleDeleteMilestone = (id) => {
    const updated = timeline.filter((m) => m.id !== id);
    onUpdateEvent({ ...event, timeline: updated });
  };

  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;

    const newM = {
      id: `t-${Date.now()}`,
      timeframe: newTimeframe,
      title: newMilestoneTitle.trim(),
      done: false,
      priority: newPriority
    };

    onUpdateEvent({
      ...event,
      timeline: [...timeline, newM]
    });

    setNewMilestoneTitle('');
    setIsAddMilestoneOpen(false);
  };

  const handleAddSchedule = (e) => {
    e.preventDefault();
    if (!newActivity.trim()) return;

    const newS = {
      id: `d-${Date.now()}`,
      time: newTime.trim(),
      activity: newActivity.trim(),
      lead: newLead.trim() || 'Event Team',
      location: newLocation.trim() || 'Main Venue'
    };

    onUpdateEvent({
      ...event,
      dayOfSchedule: [...dayOfSchedule, newS]
    });

    setNewActivity('');
    setNewLead('');
    setNewLocation('');
    setIsAddScheduleOpen(false);
  };

  const handleDeleteSchedule = (id) => {
    const updated = dayOfSchedule.filter((s) => s.id !== id);
    onUpdateEvent({ ...event, dayOfSchedule: updated });
  };

  const handleRunContingency = async (scenario) => {
    const sc = scenario || scenarioInput;
    setScenarioInput(sc);
    setIsContingencyOpen(true);
    setIsGeneratingPlan(true);
    setContingencyPlan(null);

    try {
      const plan = await generateContingencyPlan({ scenario: sc, currentEvent: event });
      setContingencyPlan(plan);
    } catch (err) {
      alert(`Contingency error: ${err.message}`);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const filteredTimeline = timeline.filter((item) => {
    if (priorityFilter === 'ALL') return true;
    return item.priority === priorityFilter;
  });

  const completedCount = timeline.filter((m) => m.done).length;
  const progressPct = timeline.length > 0 ? Math.round((completedCount / timeline.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 1. Header Navigation & Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
          <button
            onClick={() => setActiveView('roadmap')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeView === 'roadmap'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Milestone Roadmap ({completedCount}/{timeline.length})
          </button>
          <button
            onClick={() => setActiveView('dayOf')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeView === 'dayOf'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            Day-Of Run of Show ({dayOfSchedule.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRunContingency('Sudden rainstorm during outdoor ceremony / gathering')}
            className="px-3.5 py-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            AI Weather & Delay Contingency
          </button>

          <button
            onClick={onOpenPrintModal}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Schedule
          </button>
        </div>
      </div>

      {/* 2. VIEW A: Milestone Roadmap */}
      {activeView === 'roadmap' && (
        <div className="space-y-4">
          {/* Progress Strip */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-slate-200">Milestone Readiness</span>
              <span className="text-indigo-400">{progressPct}% Complete ({completedCount} of {timeline.length} items)</span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {['ALL', 'high', 'medium'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium capitalize transition-colors ${
                    priorityFilter === p
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {p === 'ALL' ? 'All Priorities' : `${p} Priority`}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAddMilestoneOpen(true)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Milestone
            </button>
          </div>

          {/* Milestones List */}
          <div className="space-y-3">
            {filteredTimeline.map((m) => (
              <div
                key={m.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  m.done
                    ? 'bg-slate-900/40 border-slate-850 opacity-60'
                    : 'bg-slate-900 border-slate-800 shadow-md hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <button
                    onClick={() => handleToggleMilestone(m.id)}
                    className="flex-shrink-0 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    {m.done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <div
                      className={`text-sm font-semibold truncate ${
                        m.done ? 'line-through text-slate-400' : 'text-slate-100'
                      }`}
                    >
                      {m.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span className="font-medium text-indigo-400">{m.timeframe}</span>
                      <span>•</span>
                      <span
                        className={`capitalize font-semibold ${
                          m.priority === 'high' ? 'text-rose-400' : 'text-amber-400'
                        }`}
                      >
                        {m.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteMilestone(m.id)}
                  className="p-1.5 text-slate-600 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. VIEW B: Day-Of Minute-by-Minute Run of Show */}
      {activeView === 'dayOf' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Precise, minute-by-minute execution schedule for day-of coordinators, MCs, and vendors.
            </p>
            <button
              onClick={() => setIsAddScheduleOpen(true)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Time Slot
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="divide-y divide-slate-800">
              {dayOfSchedule.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 hover:bg-slate-850/40 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    <div className="px-3 py-1.5 bg-indigo-950/70 border border-indigo-800/50 rounded-xl text-indigo-300 font-mono text-xs sm:text-sm font-bold flex-shrink-0">
                      {item.time}
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-100">{item.activity}</div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1 text-slate-300">
                          <User className="w-3.5 h-3.5 text-pink-400" />
                          Lead: {item.lead}
                        </span>
                        <span className="flex items-center gap-1 text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          Location: {item.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteSchedule(item.id)}
                    className="self-end sm:self-auto p-1.5 text-slate-600 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Milestone */}
      {isAddMilestoneOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Add Milestone Task</h3>
              <button onClick={() => setIsAddMilestoneOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMilestone} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Timeframe</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 3 Months Out or 2 Weeks Out"
                  value={newTimeframe}
                  onChange={(e) => setNewTimeframe(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Milestone Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Finalize floral centerpieces and table runners"
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddMilestoneOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Day-of Schedule Slot */}
      {isAddScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Add Day-Of Schedule Slot</h3>
              <button onClick={() => setIsAddScheduleOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSchedule} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 03:30 PM"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g., Rose Veranda"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Activity / Event</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Cocktail Hour & Passed Canapés"
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Lead in Charge</label>
                <input
                  type="text"
                  placeholder="e.g., Lead Caterer & Acoustic Duo"
                  value={newLead}
                  onChange={(e) => setNewLead(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddScheduleOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: AI Contingency Plan */}
      {isContingencyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-tr from-rose-500 to-amber-500 rounded-xl text-white">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">AI Emergency & Delay Contingency Planner</h3>
                  <p className="text-xs text-slate-400">Immediate action checklist & schedule realignment</p>
                </div>
              </div>
              <button onClick={() => setIsContingencyOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scenario Buttons */}
            <div className="py-4 border-b border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Select or Describe Disruption Scenario:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Sudden rainstorm during outdoor ceremony',
                  'Catering food truck delayed 45 minutes',
                  'Power / sound system failure on main stage',
                  'Keynote speaker / VIP delayed in traffic'
                ].map((sc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleRunContingency(sc)}
                    className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition-colors"
                  >
                    {sc}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={scenarioInput}
                  onChange={(e) => setScenarioInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none"
                />
                <button
                  onClick={() => handleRunContingency(scenarioInput)}
                  disabled={isGeneratingPlan}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex-shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingPlan ? 'Analyzing...' : 'Generate Plan'}
                </button>
              </div>
            </div>

            {/* Results Content */}
            <div className="pt-4 max-h-[60vh] overflow-y-auto pr-2">
              {isGeneratingPlan ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-slate-400 font-medium">
                    Structuring crisis management protocol, vendor alerts, and creative pivots...
                  </p>
                </div>
              ) : contingencyPlan ? (
                <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950/60 p-5 rounded-xl border border-slate-800">
                  {contingencyPlan}
                </div>
              ) : null}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800 mt-4">
              <button
                onClick={() => setIsContingencyOpen(false)}
                className="px-5 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl"
              >
                Close Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
