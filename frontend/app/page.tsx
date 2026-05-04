'use client';
import React, { useEffect, useState } from 'react';
import { imageApi } from '@/lib/api';
import UploadForm from '@/components/UploadForm';
import ImageCard from '@/components/ImageCard';
import EditModal from '@/components/EditModal';
import DetailsModal from '@/components/DetailsModal'; // Functional Requirement: View Details
import { Undo2 } from 'lucide-react'; 

export default function Home() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingImage, setEditingImage] = useState<any>(null); // State for Metadata Edit
  const [viewingDetails, setViewingDetails] = useState<any>(null); // State for Technical Details

  // Load images from backend
  const fetchImages = async () => {
    try {
      const res = await imageApi.getAll();
      setImages(res.data);
    } catch (err) {
      console.error("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  // Functional Requirement: Delete Image
  const handleDelete = async (id: string) => {
    try {
      await imageApi.delete(id);
      fetchImages(); // Refresh gallery after deletion
    } catch (err) {
      console.error("Delete failed", err);
      alert("Could not delete image. Ensure backend is connected.");
    }
  };

  useEffect(() => { fetchImages(); }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-8 md:p-16">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-16">
        
        {/* BIGGER STICKY SIDEBAR */}
        <aside className="lg:w-[450px] shrink-0 relative">
          <div className="sticky top-16">
            <UploadForm onUploadSuccess={fetchImages} />
            
            {/* BOTTOM-LEFT POINTER */}
            <div className="absolute -bottom-16 -left-8 text-amber-500/40 hidden xl:block">
              <div className="flex flex-col items-center gap-2">
                <Undo2 size={90} className="rotate-[135deg]" />
                <span className="text-[10px] font-black uppercase tracking-widest">New Entry</span>
              </div>
            </div>
          </div>
        </aside>

        {/* 3-IN-A-LINE GALLERY */}
        <section className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-[4/5] bg-gray-800 animate-pulse rounded-[3rem]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {images.map((img: any) => (
                <ImageCard 
                  key={img.id} 
                  image={img} 
                  onEdit={() => setEditingImage(img)} // Metadata/Overlay edit
                  onViewDetails={() => setViewingDetails(img)} // View technical details
                  onDelete={handleDelete} // Remove image
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* MODAL: Edit Metadata (Title, Desc, Overlay) */}
      {editingImage && (
        <EditModal 
          image={editingImage} 
          onClose={() => setEditingImage(null)} 
          onSuccess={() => { setEditingImage(null); fetchImages(); }}
        />
      )}

      {/* MODAL: View Image Details (Format, Size, etc.) */}
      {viewingDetails && (
        <DetailsModal 
          image={viewingDetails} 
          onClose={() => setViewingDetails(null)} 
        />
      )}
    </main>
  );
}