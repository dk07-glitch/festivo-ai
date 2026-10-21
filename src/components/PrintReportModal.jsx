import React from 'react';
import { Printer, X, Calendar, MapPin, Users, DollarSign } from 'lucide-react';

export default function PrintReportModal({ isOpen, onClose, event }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalEstimated = (event.budgetItems || []).reduce((acc, i) => acc + (Number(i.estimated) || 0), 0);
  const totalActual = (event.budgetItems || []).reduce((acc, i) => acc + (Number(i.actual) || 0), 0);
  const totalPaid = (event.budgetItems || []).reduce((acc, i) => acc + (Number(i.paid) || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-8">
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base text-white">Event Dossier & Day-of Schedule (Print Preview)</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 space-y-8 bg-white text-slate-900 max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-5 flex justify-between items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 block mb-1">
                FESTIVO AI • EVENT EXECUTION DOSSIER
              </span>
              <h1 className="text-3xl font-black text-slate-950 tracking-tight">{event.title}</h1>
              <p className="text-xs text-slate-600 mt-1 max-w-xl italic">{event.vibe}</p>
            </div>
            <div className="text-right text-xs space-y-1 text-slate-700">
              <div className="font-bold text-slate-900">Date: {event.date}</div>
              <div>Location: {event.location}</div>
              <div>Guest Count: {event.guestCount} Guests</div>
              <div className="font-semibold text-emerald-700">
                Budget: {event.currency}{event.totalBudget.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Section 1: Day-Of Minute-by-Minute Run of Show */}
          <div>
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-2 mb-4">
              ⏰ Day-of Master Run of Show
            </h2>
            <table className="w-full text-left text-xs text-slate-800">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-900 font-bold uppercase">
                  <th className="py-2 w-28">Time</th>
                  <th className="py-2">Activity / Milestone</th>
                  <th className="py-2 w-48">Lead In Charge</th>
                  <th className="py-2 w-44">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(event.dayOfSchedule || []).map((s, idx) => (
                  <tr key={idx} className="py-2">
                    <td className="py-2.5 font-bold font-mono text-indigo-900">{s.time}</td>
                    <td className="py-2.5 font-semibold text-slate-950">{s.activity}</td>
                    <td className="py-2.5 text-slate-700">{s.lead}</td>
                    <td className="py-2.5 text-slate-700">{s.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 2: Key Vendor Directory */}
          <div>
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-2 mb-4">
              📋 Vendor Directory & Points of Contact
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              {(event.vendors || []).map((v, idx) => (
                <div key={idx} className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                  <div className="flex justify-between font-bold text-slate-950">
                    <span>{v.name}</span>
                    <span className="text-indigo-700 font-mono">{event.currency}{v.cost?.toLocaleString()}</span>
                  </div>
                  <div className="text-slate-600 text-[11px] font-semibold">{v.category}</div>
                  <div className="text-slate-700 mt-1">{v.contact}</div>
                  {v.notes && <div className="text-[10px] text-slate-500 mt-1">{v.notes}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Budget Summary */}
          <div>
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-2 mb-4">
              💰 Financial Summary
            </h2>
            <div className="grid grid-cols-4 gap-4 p-4 bg-slate-100 rounded-lg text-xs mb-4 text-center">
              <div>
                <div className="text-slate-500 font-semibold">Total Target</div>
                <div className="text-base font-bold text-slate-900">{event.currency}{event.totalBudget.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-slate-500 font-semibold">Estimated Allocation</div>
                <div className="text-base font-bold text-slate-900">{event.currency}{totalEstimated.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-slate-500 font-semibold">Actual Contracted</div>
                <div className="text-base font-bold text-slate-900">{event.currency}{totalActual.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-slate-500 font-semibold">Paid To Date</div>
                <div className="text-base font-bold text-emerald-700">{event.currency}{totalPaid.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-slate-300 text-center text-[10px] text-slate-500">
            Generated by Festivo AI • Celebration & Event Planner Assistant • Confidential Client Document
          </div>
        </div>
      </div>
    </div>
  );
}
