'use client';
import React, { useState } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { imageApi } from '@/lib/api';

export default function EditModal({ image, onClose, onSuccess }: any) {
  // RESTORED: Metadata state
  const [title, setTitle] = useState(image.title || '');
  const [description, setDescription] = useState(image.description || '');
  const [overlayText, setOverlayText] = useState(image.overlayText || '');
  const [loading, setLoading] = useState(false);

  const previewUrl = `http://localhost:5186${image.fileUrl}`;

  const handleUpdate = async () => {
    setLoading(true);
    try {
      // 1. Update ALL metadata (Title, Description, and Overlay)
      await imageApi.update(image.id, { 
        ...image, 
        title, 
        description, 
        overlayText 
      });
      
      // 2. Trigger the C# processor if there is overlay text
      if (overlayText.trim()) {
        await imageApi.generateOverlay(image.id);
      }
      
      onSuccess();
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update. Check if backend is running!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-gray-800 border border-gray-700 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Update Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 text-gray-400 hover:text-white rounded-full transition-all">
            <X size={20}/>
          </button>
        </div>

        <div className="space-y-6">
          {/* Visual Indicator */}
          <div className="h-32 rounded-2xl overflow-hidden bg-black relative">
            <img src={previewUrl} className="w-full h-full object-cover opacity-50" alt="Preview" />
          </div>

          {/* RESTORED: Title Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 focus:border-amber-500 rounded-xl p-3 text-sm outline-none text-white transition-all"
            />
          </div>

          {/* RESTORED: Description Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-gray-900 border border-gray-700 focus:border-amber-500 rounded-xl p-3 text-sm outline-none text-white transition-all resize-none"
            />
          </div>

          {/* Overlay Text Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Text Overlay</label>
            <input
              value={overlayText}
              onChange={(e) => setOverlayText(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 focus:border-amber-500 rounded-xl p-3 text-sm outline-none text-white transition-all"
              placeholder="E.g., Hello World"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleUpdate}
            disabled={loading || !title}
            className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:text-gray-500 text-white py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <><Check size={18}/> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}