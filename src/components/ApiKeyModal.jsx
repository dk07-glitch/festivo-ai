import React, { useState } from 'react';
import { Key, ShieldCheck, ExternalLink, X, CheckCircle, AlertCircle } from 'lucide-react';
import { getApiKey, setApiKey } from '../services/geminiService';

export default function ApiKeyModal({ isOpen, onClose, onKeySaved }) {
  const [keyInput, setKeyInput] = useState(getApiKey());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(keyInput.trim());
    if (onKeySaved) onKeySaved(keyInput.trim());
    onClose();
  };

  const handleTestKey = async () => {
    if (!keyInput.trim()) {
      setTestResult({ success: false, message: 'Please enter an API key first.' });
      return;
    }
    setTesting(true);
    setTestResult(null);

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keyInput.trim()}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Respond with the single word: Connected' }] }]
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Status code ${res.status}`);
      }

      setTestResult({ success: true, message: 'Gemini API connection verified successfully!' });
      setApiKey(keyInput.trim());
      if (onKeySaved) onKeySaved(keyInput.trim());
    } catch (err) {
      setTestResult({
        success: false,
        message: `Connection failed: ${err.message}`
      });
    } finally {
      setTesting(false);
    }
  };

  const handleClear = () => {
    setKeyInput('');
    setApiKey('');
    setTestResult(null);
    if (onKeySaved) onKeySaved('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-lg text-white">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Google Gemini API Key</h3>
              <p className="text-xs text-slate-400">Unlock live generative intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-blue-950/40 border border-blue-800/40 rounded-xl text-xs text-blue-200 leading-relaxed flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong>100% Client-Side Privacy:</strong> Your Gemini API key is stored strictly in your browser’s local storage. It is never sent to external servers or logged.
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Gemini API Key
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-mono"
            />
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2.5 ${
                testResult.success
                  ? 'bg-emerald-950/60 border border-emerald-700/60 text-emerald-300'
                  : 'bg-rose-950/60 border border-rose-700/60 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="text-xs text-slate-400 space-y-1">
            <p className="flex items-center gap-1.5">
              <span>Don't have a Gemini API key?</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 underline"
              >
                Get one free at Google AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </p>
            <p className="text-slate-400">
              <span className="text-amber-400 font-medium">⚡ Tip:</span> Festivo AI includes high-quality built-in intelligent generators, so the entire app works seamlessly even without an API key!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-t border-slate-800">
          <button
            onClick={handleClear}
            className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 transition-colors"
          >
            Clear Key
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTestKey}
              disabled={testing || !keyInput.trim()}
              className="px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-xl transition-colors"
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              Save Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
