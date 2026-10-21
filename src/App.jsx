import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OverviewTab from './components/OverviewTab';
import BudgetTab from './components/BudgetTab';
import TimelineTab from './components/TimelineTab';
import VendorsTab from './components/VendorsTab';
import GuestsTab from './components/GuestsTab';
import CopilotDrawer from './components/CopilotDrawer';
import EventWizardModal from './components/EventWizardModal';
import ApiKeyModal from './components/ApiKeyModal';
import PrintReportModal from './components/PrintReportModal';
import { sampleEvents } from './data/mockEvents';
import {
  Sparkles,
  Bot,
  LayoutDashboard,
  DollarSign,
  Calendar,
  Users2,
  ClipboardList
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'festivo_ai_events_data_v1';

export default function App() {
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load saved events from localStorage', e);
    }
    return sampleEvents;
  });

  const [currentEventId, setCurrentEventId] = useState(() => {
    return events[0]?.id || 'evt-wedding-1';
  });

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'budget' | 'timeline' | 'vendors' | 'guests'

  // Modals & Drawers
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotPrompt, setCopilotPrompt] = useState('');

  // Persist events to localStorage whenever modified
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.error('Failed to save events to localStorage', e);
    }
  }, [events]);

  const currentEvent = events.find((e) => e.id === currentEventId) || events[0];

  const handleUpdateCurrentEvent = (updatedEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
  };

  const handleEventCreated = (newEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
    setCurrentEventId(newEvent.id);
    setActiveTab('overview');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentEvent, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${currentEvent.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_plan.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleOpenCopilotWithPrompt = (promptText) => {
    setCopilotPrompt(promptText);
    setIsCopilotOpen(true);
  };

  const navTabs = [
    { id: 'overview', label: 'Overview & AI Ideas', icon: LayoutDashboard },
    { id: 'budget', label: 'Smart Budget', icon: DollarSign },
    { id: 'timeline', label: 'Timeline & Run of Show', icon: Calendar },
    { id: 'vendors', label: 'Vendors & RFPs', icon: ClipboardList },
    { id: 'guests', label: 'Guests & RSVPs', icon: Users2 }
  ];

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        events={events}
        currentEventId={currentEventId}
        onSelectEvent={setCurrentEventId}
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onExportJson={handleExportJson}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto no-scrollbar shadow-lg">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content View */}
        <div className="animate-fade-in">
          {activeTab === 'overview' && (
            <OverviewTab
              event={currentEvent}
              onSwitchTab={setActiveTab}
              onOpenCopilotWithPrompt={handleOpenCopilotWithPrompt}
            />
          )}

          {activeTab === 'budget' && (
            <BudgetTab
              event={currentEvent}
              onUpdateEvent={handleUpdateCurrentEvent}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineTab
              event={currentEvent}
              onUpdateEvent={handleUpdateCurrentEvent}
              onOpenPrintModal={() => setIsPrintModalOpen(true)}
            />
          )}

          {activeTab === 'vendors' && (
            <VendorsTab
              event={currentEvent}
              onUpdateEvent={handleUpdateCurrentEvent}
            />
          )}

          {activeTab === 'guests' && (
            <GuestsTab
              event={currentEvent}
              onUpdateEvent={handleUpdateCurrentEvent}
              onOpenCopilotWithPrompt={handleOpenCopilotWithPrompt}
            />
          )}
        </div>
      </main>

      {/* Floating Copilot Toggle Button (Sticky Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            setCopilotPrompt('');
            setIsCopilotOpen((prev) => !prev);
          }}
          className="group relative p-3.5 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white rounded-2xl shadow-2xl shadow-purple-600/40 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <div className="relative">
            <Bot className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
          </div>
          <span className="text-xs font-bold hidden sm:inline">Ask Copilot</span>
          <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] uppercase font-bold tracking-wider">
            AI
          </span>
        </button>
      </div>

      {/* Modals & Copilot Drawer */}
      <EventWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onEventCreated={handleEventCreated}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={() => {}}
      />

      <PrintReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        event={currentEvent}
      />

      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => {
          setIsCopilotOpen(false);
          setCopilotPrompt('');
        }}
        currentEvent={currentEvent}
        initialPrompt={copilotPrompt}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>
          Festivo AI • GenAI Celebration & Event Planner Assistant • Built with React, Tailwind CSS & Google Gemini
        </p>
      </footer>
    </div>
  );
}
