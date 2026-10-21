import React, { useState } from 'react';
import {
  Users,
  Mail,
  Phone,
  DollarSign,
  FileText,
  CheckSquare,
  Square,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Check,
  HelpCircle,
  X,
  ExternalLink
} from 'lucide-react';
import { generateVendorInquiryEmail } from '../services/geminiService';

const VENDOR_QUESTIONS = {
  Venue: [
    'What is the exact curfew and sound ordinance cutoff?',
    'How many hours prior to the event are included for vendor setup and load-in?',
    'Are outside caterers and bartenders permitted, or is there an exclusive list?',
    'Is day-of event liability insurance required from the host?'
  ],
  'Catering & Bar': [
    'Does your per-person quote include barware, plates, silverware, and linens?',
    'What is the server-to-guest and bartender-to-guest ratio?',
    'How do you accommodate severe dietary allergies (celiac, vegan, nut-free)?',
    'Do you handle cleanup, breakdown, and trash haul-away at the end of the evening?'
  ],
  Photography: [
    'How many hours of active coverage are included, and is a second shooter present?',
    'What is your guaranteed delivery turnaround time for the digital gallery?',
    'Do we receive high-resolution files with full personal print and sharing rights?',
    'Have you shot at our chosen venue before, and do you conduct a prior walkthrough?'
  ],
  'Florals & Decor': [
    'Can ceremony floral arrangements be repurposed for the reception tables or sweetheart lounge?',
    'Do you handle same-night teardown and disposal after the event concludes?',
    'What seasonal local blooms will be at their peak on our event date?'
  ]
};

export default function VendorsTab({ event, onUpdateEvent }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [isRfpModalOpen, setIsRfpModalOpen] = useState(false);
  const [activeVendorForRfp, setActiveVendorForRfp] = useState(null);
  const [generatedRfpText, setGeneratedRfpText] = useState('');
  const [isGeneratingRfp, setIsGeneratingRfp] = useState(false);
  const [copiedRfp, setCopiedRfp] = useState(false);
  const [rfpNotes, setRfpNotes] = useState('');
  const [activeCheatSheetCat, setActiveCheatSheetCat] = useState('Venue');

  // New vendor form state
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorCategory, setNewVendorCategory] = useState('Venue');
  const [newVendorContact, setNewVendorContact] = useState('');
  const [newVendorCost, setNewVendorCost] = useState('');
  const [newVendorNotes, setNewVendorNotes] = useState('');

  const vendors = event.vendors || [];
  const categories = Array.from(new Set(vendors.map((v) => v.category)));

  const filteredVendors = vendors.filter((v) => {
    if (selectedCategory !== 'ALL' && v.category !== selectedCategory) return false;
    return true;
  });

  const handleToggleCheckItem = (vendorId, itemIndex) => {
    const updated = vendors.map((v) => {
      if (v.id === vendorId) {
        const checks = [...(v.checkItems || [])];
        const doneSet = new Set(v.completedCheckItems || []);
        if (doneSet.has(itemIndex)) {
          doneSet.delete(itemIndex);
        } else {
          doneSet.add(itemIndex);
        }
        return { ...v, completedCheckItems: Array.from(doneSet) };
      }
      return v;
    });
    onUpdateEvent({ ...event, vendors: updated });
  };

  const handleUpdateStatus = (vendorId, newStatus) => {
    const updated = vendors.map((v) => (v.id === vendorId ? { ...v, status: newStatus } : v));
    onUpdateEvent({ ...event, vendors: updated });
  };

  const handleDeleteVendor = (vendorId) => {
    const updated = vendors.filter((v) => v.id !== vendorId);
    onUpdateEvent({ ...event, vendors: updated });
  };

  const handleAddVendor = (e) => {
    e.preventDefault();
    if (!newVendorName.trim()) return;

    const newV = {
      id: `v-${Date.now()}`,
      name: newVendorName.trim(),
      category: newVendorCategory,
      contact: newVendorContact.trim() || 'info@partner.com',
      cost: Number(newVendorCost) || 0,
      status: 'Researching',
      notes: newVendorNotes.trim(),
      checkItems: ['Request quote & packages', 'Schedule discovery consultation', 'Review agreement terms']
    };

    onUpdateEvent({
      ...event,
      vendors: [...vendors, newV]
    });

    setNewVendorName('');
    setNewVendorContact('');
    setNewVendorCost('');
    setNewVendorNotes('');
    setIsAddVendorOpen(false);
  };

  const openRfpModal = async (vendor) => {
    setActiveVendorForRfp(vendor);
    setIsRfpModalOpen(true);
    setIsGeneratingRfp(true);
    setGeneratedRfpText('');
    setCopiedRfp(false);

    try {
      const email = await generateVendorInquiryEmail({
        vendorType: vendor.category,
        vendorName: vendor.name,
        eventDetails: event,
        specialRequirements: {
          budget: vendor.cost || 'Allocated budget',
          notes: vendor.notes || rfpNotes
        }
      });
      setGeneratedRfpText(email);
    } catch (err) {
      alert(`RFP generation failed: ${err.message}`);
    } finally {
      setIsGeneratingRfp(false);
    }
  };

  const copyRfpToClipboard = () => {
    navigator.clipboard.writeText(generatedRfpText);
    setCopiedRfp(true);
    setTimeout(() => setCopiedRfp(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Category Filter & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Vendors ({vendors.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsAddVendorOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Vendor Partner
        </button>
      </div>

      {/* 2. Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredVendors.map((vendor) => {
          const completedSet = new Set(vendor.completedCheckItems || []);
          return (
            <div
              key={vendor.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div className="space-y-3.5">
                {/* Header info */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {vendor.category}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">{vendor.name}</h3>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-500" />
                      <span>{vendor.contact}</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-mono font-bold text-slate-100">
                      {event.currency}{vendor.cost?.toLocaleString() || 'Quote TBD'}
                    </div>
                    <select
                      value={vendor.status}
                      onChange={(e) => handleUpdateStatus(vendor.id, e.target.value)}
                      className="mt-1.5 text-[11px] px-2 py-1 rounded-lg border font-medium bg-slate-950 focus:outline-none cursor-pointer border-slate-700 text-slate-300"
                    >
                      <option value="Researching">Researching</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Proposal Review">Proposal Review</option>
                      <option value="Confirmed & Deposit Paid">Deposit Paid</option>
                      <option value="Contract Signed">Contract Signed</option>
                      <option value="Paid in Full">Paid in Full</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                {vendor.notes && (
                  <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                    {vendor.notes}
                  </p>
                )}

                {/* Checklist items */}
                {vendor.checkItems && vendor.checkItems.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Action Checklist
                    </div>
                    {vendor.checkItems.map((chk, idx) => {
                      const isDone = completedSet.has(idx);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleToggleCheckItem(vendor.id, idx)}
                          className="w-full flex items-center gap-2 text-left text-xs p-1 rounded hover:bg-slate-850 transition-colors"
                        >
                          {isDone ? (
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                          )}
                          <span className={isDone ? 'line-through text-slate-500' : 'text-slate-300'}>
                            {chk}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-4">
                <button
                  onClick={() => openRfpModal(vendor)}
                  className="px-3 py-1.5 bg-gradient-to-r from-pink-500/20 to-indigo-500/20 hover:from-pink-500/30 hover:to-indigo-500/30 text-pink-300 border border-pink-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-pink-400" />
                  Draft AI RFP Inquiry
                </button>

                <button
                  onClick={() => handleDeleteVendor(vendor.id)}
                  className="p-1.5 text-slate-600 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Remove vendor"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Vendor Interview & Negotiation Cheat Sheet */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-sm sm:text-base text-slate-100">
              Vendor Interview Cheat Sheet (Crucial Questions to Ask)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">Essential due diligence questions</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {Object.keys(VENDOR_QUESTIONS).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCheatSheetCat(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                activeCheatSheetCat === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <ul className="space-y-2">
            {(VENDOR_QUESTIONS[activeCheatSheetCat] || []).map((q, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5">
                <span className="text-indigo-400 font-bold">Q{idx + 1}:</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal: Add Vendor */}
      {isAddVendorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Add Vendor Partner</h3>
              <button onClick={() => setIsAddVendorOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVendor} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Company / Vendor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Golden Lens Visuals"
                  value={newVendorName}
                  onChange={(e) => setNewVendorName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Category</label>
                  <select
                    value={newVendorCategory}
                    onChange={(e) => setNewVendorCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none"
                  >
                    <option value="Venue">Venue</option>
                    <option value="Catering & Bar">Catering & Bar</option>
                    <option value="Photography">Photography</option>
                    <option value="Florals & Decor">Florals & Decor</option>
                    <option value="Music & Entertainment">Music & Entertainment</option>
                    <option value="Cake & Desserts">Cake & Desserts</option>
                    <option value="Rentals & Facilities">Rentals & Facilities</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Estimated Cost</label>
                  <input
                    type="number"
                    placeholder="2500"
                    value={newVendorCost}
                    onChange={(e) => setNewVendorCost(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Email / Phone / Website</label>
                <input
                  type="text"
                  placeholder="hello@vendor.com | (555) 123-4567"
                  value={newVendorContact}
                  onChange={(e) => setNewVendorContact(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Notes & Scope</label>
                <textarea
                  rows={2}
                  placeholder="Details, hours, inclusions..."
                  value={newVendorNotes}
                  onChange={(e) => setNewVendorNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddVendorOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: AI Vendor RFP Inquiry Drafter */}
      {isRfpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-tr from-pink-500 to-indigo-500 rounded-xl text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">AI Vendor Inquiry (RFP) Drafter</h3>
                  <p className="text-xs text-slate-400">Tailored to {activeVendorForRfp?.name || 'Vendor'}</p>
                </div>
              </div>
              <button onClick={() => setIsRfpModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="pt-4 space-y-4">
              {isGeneratingRfp ? (
                <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-pink-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-slate-400 font-medium">
                    Synthesizing professional proposal inquiry with date, headcount & aesthetic scope...
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <textarea
                    rows={12}
                    value={generatedRfpText}
                    onChange={(e) => setGeneratedRfpText(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 font-sans leading-relaxed focus:outline-none focus:border-indigo-500 resize-none"
                  />
                  <button
                    onClick={copyRfpToClipboard}
                    className="absolute top-3 right-3 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedRfp ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedRfp ? 'Copied!' : 'Copy to Clipboard'}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-4">
              <span className="text-xs text-slate-500">
                You can edit the draft directly before copying.
              </span>
              <button
                onClick={() => setIsRfpModalOpen(false)}
                className="px-5 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
