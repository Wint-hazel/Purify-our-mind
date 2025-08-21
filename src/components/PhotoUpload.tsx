import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Upload, X, Image as ImageIcon, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface UploadedPhoto {
  id: string;
  url: string;
  name: string;
  size: number;
}

interface PhotoUploadProps {
  date: string;
  onPhotosChange?: (photos: UploadedPhoto[]) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ date, onPhotosChange }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress image before upload
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (max 1200px width/height)
        const maxSize = 1200;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob!], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          0.8 // 80% quality
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadPhoto = async (file: File) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to upload photos",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Compress the image
      const compressedFile = await compressImage(file);
      
      // Create unique filename
      const fileExt = compressedFile.name.split('.').pop();
      const fileName = `${user.id}/${date}/${Date.now()}.${fileExt}`;

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('daily-photos')
        .upload(fileName, compressedFile, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('daily-photos')
        .getPublicUrl(data.path);

      const newPhoto: UploadedPhoto = {
        id: data.path,
        url: publicUrl,
        name: compressedFile.name,
        size: compressedFile.size
      };

      const updatedPhotos = [...photos, newPhoto];
      setPhotos(updatedPhotos);
      onPhotosChange?.(updatedPhotos);

      toast({
        title: "Success",
        description: "Photo uploaded successfully!",
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const deletePhoto = async (photo: UploadedPhoto) => {
    try {
      const { error } = await supabase.storage
        .from('daily-photos')
        .remove([photo.id]);

      if (error) throw error;

      const updatedPhotos = photos.filter(p => p.id !== photo.id);
      setPhotos(updatedPhotos);
      onPhotosChange?.(updatedPhotos);

      toast({
        title: "Success",
        description: "Photo deleted successfully",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        uploadPhoto(file);
      }
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-stone-800 mb-3 flex items-center">
        Daily Photos
        <span className="ml-2 text-2xl">📸</span>
      </h3>

      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-stone-300 hover:border-stone-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-8 text-center">
          {uploading ? (
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary animate-pulse" />
              </div>
              <div>
                <p className="text-sm text-stone-600 mb-2">Uploading photo...</p>
                <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                <p className="text-xs text-stone-500 mt-1">{uploadProgress}%</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-stone-100 rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-stone-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-stone-700 mb-2">
                  {photos.length === 0 ? 'Add Your Daily Photos' : 'Add More Photos'}
                </p>
                <p className="text-sm text-stone-500 mb-4">
                  Drag and drop photos here, or click to browse
                </p>
                <Button variant="outline" size="sm" className="pointer-events-none">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {/* Photo Gallery */}
      {photos.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-stone-700 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Today's Photos ({photos.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <Card className="overflow-hidden shadow-soft hover:shadow-card transition-shadow">
                  <div className="relative aspect-square">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {/* Delete button */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="w-8 h-8 p-0 rounded-full shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePhoto(photo);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    {/* Photo info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs font-medium truncate">
                        {photo.name}
                      </p>
                      <p className="text-white/80 text-xs">
                        {formatFileSize(photo.size)}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo Count & Storage Info */}
      {photos.length > 0 && (
        <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-200">
          <span>{photos.length} photo{photos.length !== 1 ? 's' : ''} uploaded</span>
          <span>
            Total: {formatFileSize(photos.reduce((sum, photo) => sum + photo.size, 0))}
          </span>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;