'use client';
import React from 'react';
import { Eye, Edit3, Info, Trash2 } from 'lucide-react';

// Added onDelete to the props to fulfill the "Delete Image" requirement
export default function ImageCard({ image, onEdit, onViewDetails, onDelete }: any) {
  const imageUrl = `http://localhost:5186${image.fileUrl}`;

  // Quick confirmation logic for the "Delete" requirement
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents clicking the card background
    if (window.confirm("Are you sure you want to remove this entry?")) {
      onDelete(image.id);
    }
  };

  return (
    <div className="group relative bg-gray-800/40 border border-gray-700/50 rounded-[2.5rem] overflow-hidden hover:border-gray-600 transition-all duration-500 shadow-xl">
      
      {/* DELETE ACTION: Top-right icon for a clean look */}
      <button 
        onClick={handleDelete}
        className="absolute top-4 right-4 z-10 p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md border border-red-500/20"
        title="Delete Image"
      >
        <Trash2 size={16} />
      </button>

      {/* VISUAL AREA */}
      <div className="relative aspect-[4/5] overflow-hidden bg-black">
        <img 
          src={imageUrl} 
          alt={image.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90" />
      </div>

      {/* METADATA AREA */}
      <div className="p-7">
        <h3 className="text-xl font-bold text-white tracking-tight truncate">{image.title}</h3>
        <p className="text-xs text-gray-500 mt-2 line-clamp-2 min-h-[32px]">
          {image.description || "No description provided."}
        </p>

        {/* FUNCTIONAL BUTTONS */}
        <div className="space-y-2 mt-6">
          <div className="flex gap-2">
            {/* Show Action */}
            <button 
              onClick={() => window.open(imageUrl, '_blank')} 
              className="flex-[2] flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-3.5 rounded-2xl text-xs font-bold transition-all border border-gray-600/50"
            >
              <Eye size={14} /> Show
            </button>
            
            {/* Update Action (Edit Metadata/Overlay) */}
            <button 
              onClick={onEdit} 
              className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white py-3.5 rounded-2xl text-xs font-bold transition-all shadow-lg shadow-amber-900/20"
            >
              <Edit3 size={14} /> Update
            </button>
          </div>

          {/* View Details Action (Technical Metadata View) */}
          <button 
            onClick={onViewDetails}
            className="w-full flex items-center justify-center gap-2 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-blue-600/20"
          >
            <Info size={12} /> View Details
          </button>
        </div>
      </div>
    </div>
  );
}