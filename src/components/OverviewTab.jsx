import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Palette,
  GlassWater,
  Sparkles,
  Check,
  Copy,
  Hash,
  PartyPopper,
  Flame,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OverviewTab({ event, onSwitchTab, onOpenCopilotWithPrompt }) {
  const [copiedHex, setCopiedHex] = useState(null);
  const [copiedTag, setCopiedTag] = useState(null);

  // Calculate days remaining
  const eventDate = new Date(event.date);
  const today = new Date();
  const diffTime = eventDate.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const copyToClipboard = (text, type, val) => {
    navigator.clipboard.writeText(text);
    if (type === 'hex') {
      setCopiedHex(val);
      setTimeout(() => setCopiedHex(null), 2000);
    } else {
      setCopiedTag(val);
      setTimeout(() => setCopiedTag(null), 2000);
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Hero Event Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-purple-950/40 border border-slate-700/80 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center gap-1.5">
                <PartyPopper className="w-3.5 h-3.5" />
                {event.type}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                {event.date}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {event.title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {event.vibe}
            </p>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs sm:text-sm text-slate-400 pt-2">
              <div className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-4 h-4 text-pink-400" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>{event.guestCount} Expected Guests</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Budget: {event.currency}{event.totalBudget.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Countdown Card */}
          <div className="flex-shrink-0 bg-slate-900/80 border border-indigo-500/30 p-5 rounded-2xl flex flex-col items-center justify-center text-center min-w-[200px] shadow-lg">
            <div className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-300">
              {daysRemaining}
            </div>
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400 mt-1">
              Days Remaining
            </div>
            <button
              onClick={triggerCelebration}
              className="mt-4 px-3.5 py-1.5 text-xs font-semibold bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Celebrate!
            </button>
          </div>
        </div>
      </div>

      {/* 2. Color Palette Swatches */}
      {event.colorPalette && event.colorPalette.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-400" />
              <h2 className="font-bold text-sm sm:text-base text-slate-100">
                Curated Color Palette & Aesthetics
              </h2>
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline">Click swatch to copy HEX</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {event.colorPalette.map((color, idx) => (
              <button
                key={idx}
                onClick={() => copyToClipboard(color.hex, 'hex', color.hex)}
                className="group p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-600 transition-all text-left flex flex-col gap-2 relative overflow-hidden"
              >
                <div
                  className="w-full h-12 rounded-lg shadow-inner border border-white/10 transition-transform group-hover:scale-102"
                  style={{ backgroundColor: color.hex }}
                />
                <div>
                  <div className="text-xs font-semibold text-slate-200 truncate">{color.name}</div>
                  <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between mt-0.5">
                    <span>{color.hex}</span>
                    {copiedHex === color.hex ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Grid: Signature Food & Drinks + Decor Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Signature Cocktails / Drinks */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-pink-500/20 text-pink-400 rounded-lg">
                <GlassWater className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-100">Signature Drinks & Mocktails</h3>
            </div>

            <div className="space-y-3">
              {event.ideas?.signatureDrinks?.map((drink, idx) => (
                <div key={idx} className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <div className="font-semibold text-sm text-pink-300 flex items-center gap-1.5">
                    <span>🍹</span> {drink.name}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    <strong className="text-slate-300">Ingredients:</strong> {drink.ingredients}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onOpenCopilotWithPrompt(`Suggest 3 more seasonal cocktail and mocktail recipes that match our theme: "${event.vibe}"`)}
            className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-750 text-indigo-300 text-xs font-semibold rounded-xl border border-indigo-500/20 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Drink Recipe Enhancer
          </button>
        </div>

        {/* Decor & Atmosphere Highlights */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-100">Decor & Atmosphere Concepts</h3>
            </div>

            <ul className="space-y-2.5">
              {event.ideas?.decorHighlights?.map((item, idx) => (
                <li key={idx} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-300 flex items-start gap-2.5">
                  <span className="text-indigo-400 mt-0.5">•</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => onOpenCopilotWithPrompt(`Suggest 4 budget-friendly DIY decor elements for our ${event.type}: "${event.vibe}"`)}
            className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-750 text-indigo-300 text-xs font-semibold rounded-xl border border-indigo-500/20 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Decor & Lighting Ideas
          </button>
        </div>
      </div>

      {/* 4. Guest Engagement & Social Hashtags */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Guest Engagement / Activities */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-100">Guest Engagement & Entertainment</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {event.ideas?.guestEngagement?.map((activity, idx) => (
              <div key={idx} className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col justify-between">
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {activity}
                </p>
                <div className="text-[10px] text-indigo-400 mt-3 font-semibold uppercase tracking-wider">
                  Idea #{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Hashtags */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg">
                <Hash className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-100">Social Hashtags</h3>
            </div>

            <div className="space-y-2">
              {event.ideas?.hashtags?.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => copyToClipboard(tag, 'tag', tag)}
                  className="w-full p-2.5 bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-mono text-purple-300 flex items-center justify-between transition-colors text-left"
                >
                  <span className="truncate">{tag}</span>
                  {copiedTag === tag ? (
                    <span className="text-[10px] text-emerald-400 font-sans font-bold">Copied!</span>
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onOpenCopilotWithPrompt(`Generate 6 catchy, playful wedding / celebration hashtags for: "${event.title}"`)}
            className="mt-3 text-xs text-purple-400 hover:text-purple-300 flex items-center justify-center gap-1 font-semibold py-1.5"
          >
            <Sparkles className="w-3 h-3" /> More Hashtag Ideas
          </button>
        </div>
      </div>

      {/* 5. Quick Workflow Launchers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <button
          onClick={() => onSwitchTab('budget')}
          className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-900/40 hover:border-emerald-600/50 transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold">💰 Smart Budget</span>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="text-xs text-slate-300">
            {event.currency}{event.totalBudget.toLocaleString()} Total • Track expenses & optimize with AI
          </div>
        </button>

        <button
          onClick={() => onSwitchTab('timeline')}
          className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/30 border border-indigo-900/40 hover:border-indigo-600/50 transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 font-bold">⏳ Timeline & Run of Show</span>
            <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="text-xs text-slate-300">
            {event.timeline?.length || 0} Milestones • {event.dayOfSchedule?.length || 0} Day-of schedule slots
          </div>
        </button>

        <button
          onClick={() => onSwitchTab('vendors')}
          className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-pink-950/30 border border-pink-900/40 hover:border-pink-600/50 transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-xl bg-pink-500/20 text-pink-400 font-bold">📋 Vendors & RFPs</span>
            <ArrowRight className="w-4 h-4 text-pink-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="text-xs text-slate-300">
            {event.vendors?.length || 0} Key partners • Draft 1-click RFPs with AI
          </div>
        </button>
      </div>
    </div>
  );
}
