import React from 'react';
import { Sparkles, CalendarDays, Key, Plus, Printer, Download, ChevronDown } from 'lucide-react';
import { getApiKey } from '../services/geminiService';

export default function Navbar({
  events,
  currentEventId,
  onSelectEvent,
  onOpenWizard,
  onOpenApiKeyModal,
  onOpenPrintModal,
  onExportJson
}) {
  const currentEvent = events.find((e) => e.id === currentEventId) || events[0];
  const hasKey = Boolean(getApiKey());

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500 p-0.5 shadow-lg shadow-purple-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-pink-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Festivo<span className="text-pink-400">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Celebration Planner
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">GenAI-Powered Weddings, Birthdays & Community Events</p>
          </div>
        </div>

        {/* Center Event Selector */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={currentEventId}
              onChange={(e) => onSelectEvent(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2 bg-slate-800 hover:bg-slate-750 text-slate-100 border border-slate-700 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-indigo-500 cursor-pointer max-w-[200px] sm:max-w-xs truncate"
            >
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.type === 'wedding' ? '💍 ' : evt.type === 'birthday' ? '🎂 ' : '🎪 '}
                  {evt.title}
                </option>
              ))}
            </select>
            <CalendarDays className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={onOpenWizard}
            title="Create new event using GenAI Wizard"
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden md:inline">AI Wizard</span>
          </button>
        </div>

        {/* Actions & API Key Indicator */}
        <div className="flex items-center gap-2">
          {/* API Key Status Pill */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              hasKey
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-700/50 hover:bg-emerald-900/40'
                : 'bg-amber-950/40 text-amber-300 border-amber-700/50 hover:bg-amber-900/40'
            }`}
            title={hasKey ? 'Gemini API Key active (Click to configure)' : 'Using offline GenAI engine. Click to add Gemini API key'}
          >
            <Key className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden lg:inline">
              {hasKey ? 'Gemini Live' : 'Offline AI (Add Key)'}
            </span>
          </button>

          {/* Print Run of Show */}
          <button
            onClick={onOpenPrintModal}
            title="Print Run-of-Show & Budget Summary"
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Export JSON */}
          <button
            onClick={onExportJson}
            title="Export Event JSON file"
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
