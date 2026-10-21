import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin, Users, DollarSign, X, Check, Wand2, Compass } from 'lucide-react';
import { generateFullEventPlan } from '../services/geminiService';

const PRESET_VIBES = {
  wedding: [
    'Botanical garden whimsy with fairy lights, wildflower bouquets, and acoustic folk',
    'Modern minimalist black-tie rooftop gala with city skyline views and champagne tower',
    'Warm rustic barn celebration with eucalyptus garlands, wood-fired dining, and vintage decor',
    'Bohemian seaside sunset vow ceremony with tropical blooms and barefoot beach reception'
  ],
  birthday: [
    'Retro 80s synthwave arcade night with neon cocktails and retro video game tournaments',
    'Cozy Parisian speakeasy lounge with jazz trio, artisanal charcuterie, and candlelit ambiance',
    'Tropical pool villa day-party with floating tiki bar, DJ lounge beats, and citrus popsicles',
    'Glamorous Golden Age Hollywood red carpet milestone gala with velvet stanchions and paparazzi photos'
  ],
  community: [
    'Autumn harvest neighborhood festival with local food trucks, pie-baking contest, and 5K fun run',
    'Urban tech & creative community block party with interactive art walls and live electronic sets',
    'Summer lakeside eco-fest with kayak regatta, acoustic folk bands, and artisanal craft market',
    'Charity gala dinner & silent auction benefiting neighborhood public parks and arts'
  ]
};

export default function EventWizardModal({ isOpen, onClose, onEventCreated }) {
  const [eventType, setEventType] = useState('wedding');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState(80);
  const [budget, setBudget] = useState(18000);
  const [currency, setCurrency] = useState('$');
  const [vibe, setVibe] = useState(PRESET_VIBES.wedding[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  if (!isOpen) return null;

  const handleTypeChange = (type) => {
    setEventType(type);
    if (PRESET_VIBES[type]) {
      setVibe(PRESET_VIBES[type][0]);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setLoadingStep('Analyzing event parameters & aesthetic vision...');

    try {
      const stepTimer1 = setTimeout(() => {
        setLoadingStep('Designing customized color palette & signature food/drink menus...');
      }, 700);

      const stepTimer2 = setTimeout(() => {
        setLoadingStep('Allocating smart budget breakdown & milestone roadmap...');
      }, 1500);

      const generatedPlan = await generateFullEventPlan({
        type: eventType,
        title: title.trim(),
        location: location.trim(),
        guests: Number(guestCount),
        budget: Number(budget),
        vibe: vibe.trim(),
        currency
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      onEventCreated({
        ...generatedPlan,
        date
      });
      onClose();
    } catch (err) {
      alert(`Could not generate event: ${err.message}`);
    } finally {
      setIsGenerating(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-xl text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Create Celebration with GenAI</h3>
              <p className="text-xs text-slate-400">Personalized themes, smart budgets, timelines & vendor checklists</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleGenerate} className="p-6 space-y-5">
          {/* 1. Event Type Selectors */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Celebration Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: 'wedding', label: '💍 Wedding', desc: 'Ceremony, Reception & Romance' },
                { type: 'birthday', label: '🎂 Birthday', desc: 'Milestone, Kids or Gala' },
                { type: 'community', label: '🎪 Community Event', desc: 'Festivals, Galas & Charity' }
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => handleTypeChange(item.type)}
                  className={`p-3 text-left rounded-xl border transition-all ${
                    eventType === item.type
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="font-semibold text-sm">{item.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Title & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Event Title / Honoree
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  eventType === 'wedding' ? 'e.g., Clara & David’s Woodland Wedding' :
                  eventType === 'birthday' ? 'e.g., Maya’s 25th Sunset Soiree' :
                  'e.g., Riverdale Spring Arts & Music Fair'
                }
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* 3. Location, Guests & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Location / City
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Santa Barbara, CA"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Guest Count
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="5"
                  max="5000"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Total Budget ({currency})
              </label>
              <div className="flex gap-1.5">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="px-2 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none"
                >
                  <option value="$">$ USD</option>
                  <option value="€">€ EUR</option>
                  <option value="£">£ GBP</option>
                  <option value="₹">₹ INR</option>
                  <option value="C$">C$ CAD</option>
                  <option value="A$">A$ AUD</option>
                </select>
                <input
                  type="number"
                  min="200"
                  step="500"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* 4. Vibe & Aesthetic Inspiration */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Vibe, Theme & Aesthetic Vision
              </label>
              <span className="text-[11px] text-indigo-400">Choose a preset or type below</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {(PRESET_VIBES[eventType] || []).map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setVibe(preset)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all text-left truncate max-w-full ${
                    vibe === preset
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                  }`}
                >
                  {preset.slice(0, 48)}...
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              placeholder="Describe your dream mood, colors, music, food preferences, or special traditions..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          {/* Loading Animation during GenAI build */}
          {isGenerating && (
            <div className="p-4 bg-indigo-950/40 border border-indigo-700/50 rounded-xl flex items-center gap-3.5 animate-pulse">
              <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <div className="text-xs text-indigo-200 font-medium">
                {loadingStep}
              </div>
            </div>
          )}

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-400 hover:to-pink-400 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Wand2 className="w-4 h-4" />
              {isGenerating ? 'Synthesizing Plan...' : 'Generate Full Event with GenAI'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
