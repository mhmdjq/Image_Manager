'use client';
import React, { useState, useEffect } from 'react';
import { Sparkles, Image as ImageIcon, Loader2, CornerRightDown } from 'lucide-react';
import { imageApi } from '@/lib/api';

export default function UploadForm({ onUploadSuccess }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    try {
      await imageApi.upload(formData);
      setTitle(''); setFile(null);
      onUploadSuccess();
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/40 border border-gray-700/50 p-10 rounded-[3.5rem] shadow-2xl backdrop-blur-md">
      <div className="flex items-start justify-between mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={40} className="text-amber-500 fill-amber-500/20" />
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-white leading-none">
            Upload Your <br/> Picture
          </h2>
        </div>
        <div className="text-amber-500/60 pt-6">
          <CornerRightDown size={90} strokeWidth={1.5} className="animate-pulse" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TAB STOP 1: TITLE */}
        <input
          tabIndex={1}
          type="text"
          placeholder="Give your image a name..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-900/50 border border-gray-700 focus:border-amber-500 rounded-2xl p-5 text-sm outline-none transition-all text-white placeholder:text-gray-600 focus:ring-2 focus:ring-amber-500/20"
        />

        {/* TAB STOP 2: IMAGE SELECTION */}
        <label 
          tabIndex={2}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.click()}
          className="relative flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-gray-700 hover:border-amber-500/40 focus:border-amber-500 rounded-[2.5rem] cursor-pointer bg-gray-900/30 transition-all overflow-hidden group outline-none focus:ring-2 focus:ring-amber-500/20"
        >
          {preview ? (
            <img src={preview} className="w-full h-full object-cover" alt="Preview" />
          ) : (
            <div className="flex flex-col items-center">
              <ImageIcon size={40} className="text-gray-700 mb-4 group-hover:text-amber-500 transition-colors" />
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Drop Zone</span>
            </div>
          )}
          <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>

        {/* TAB STOP 3: PUBLISH BUTTON */}
        <button
          tabIndex={3}
          disabled={loading || !file || !title}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-20 flex items-center justify-center gap-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Publish"}
        </button>
      </form>
    </div>
  );
}