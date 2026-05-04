'use client';
import React from 'react';
import { X, Maximize, HardDrive, FileType, FileCode, Tag, AlignLeft, Type } from 'lucide-react';

export default function DetailsModal({ image, onClose }: any) {
  
  // Professional byte formatter
  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const fileExt = image.fileUrl?.split('.').pop()?.toUpperCase() || 'IMG';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-gray-800 border border-gray-700 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Image Details</h2>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em] mt-1">System Inspector</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full text-gray-500 transition-colors">
            <X size={20}/>
          </button>
        </div>

        <div className="space-y-6">
          {/* Visual Preview */}
          <div className="aspect-video rounded-[2rem] overflow-hidden bg-black border border-gray-700 shadow-inner">
            <img 
              src={`http://localhost:5186${image.fileUrl}`} 
              className="w-full h-full object-cover" 
              alt="Inspector Preview" 
            />
          </div>

          {/* Technical Grid (Resolution, Size, Format) */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-700/30 text-center">
              <Maximize size={14} className="text-emerald-500 mx-auto mb-2" />
              <p className="text-[9px] font-bold text-gray-500 uppercase">Resolution</p>
              <p className="text-xs font-bold text-white mt-1">{image.width || 0}×{image.height || 0}</p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-700/30 text-center">
              <HardDrive size={14} className="text-amber-500 mx-auto mb-2" />
              <p className="text-[9px] font-bold text-gray-500 uppercase">Size</p>
              <p className="text-xs font-bold text-white mt-1">{formatBytes(image.fileSize)}</p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-700/30 text-center">
              <FileType size={14} className="text-blue-500 mx-auto mb-2" />
              <p className="text-[9px] font-bold text-gray-500 uppercase">Format</p>
              <p className="text-xs font-bold text-white mt-1">{fileExt}</p>
            </div>
          </div>

          {/* Detailed Information List */}
          <div className="space-y-4 bg-gray-900/30 p-6 rounded-[2rem] border border-gray-700/20 max-h-[300px] overflow-y-auto custom-scrollbar">
            {/* File Name */}
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gray-800 rounded-lg text-gray-400">
                <FileCode size={16} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">System Filename</p>
                <p className="text-sm font-medium text-gray-200 truncate">{image.fileName || "N/A"}</p>
              </div>
            </div>

            {/* Title */}
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gray-800 rounded-lg text-gray-400">
                <Tag size={16} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Display Title</p>
                <p className="text-sm font-medium text-gray-200">{image.title}</p>
              </div>
            </div>

            {/* Description */}
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gray-800 rounded-lg text-gray-400">
                <AlignLeft size={16} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Description</p>
                <p className="text-xs text-gray-400 leading-relaxed mt-1">
                  {image.description || "No description provided."}
                </p>
              </div>
            </div>

            {/* NEW: Overlay Text Section */}
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gray-800 rounded-lg text-amber-500">
                <Type size={16} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Overlay</p>
                <p className="text-sm font-medium text-amber-500 italic mt-1 leading-tight">
                  {image.overlayText ? `"${image.overlayText}"` : "No active overlay text."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="w-full mt-8 bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98]"
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
}