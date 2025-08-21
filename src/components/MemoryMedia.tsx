import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Upload, Eye, Trash2, Plus, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface MediaFile {
  id: string;
  file_name: string;
  file_path: string;
  caption: string | null;
  created_at: string;
  upload_date: string;
}

interface MemoryMediaProps {
  selectedDate?: string;
}

const MemoryMedia = ({ selectedDate }: MemoryMediaProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [editCaption, setEditCaption] = useState('');

  const today = new Date();
  const displayDate = selectedDate ? new Date(selectedDate) : today;
  const dateString = displayDate.toISOString().split('T')[0];

  useEffect(() => {
    if (user) {
      fetchMediaFiles();
    }
  }, [user, selectedDate]);

  const fetchMediaFiles = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('diary_media')
        .select('*')
        .eq('user_id', user.id)
        .eq('upload_date', dateString)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMediaFiles(data || []);
    } catch (error) {
      console.error('Error fetching media files:', error);
      toast({
        title: "Error",
        description: "Failed to load media files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !user) return;

    // Check if user already has 20 photos for this date
    if (mediaFiles.length >= 20) {
      toast({
        title: "Limit Reached",
        description: "You can only upload up to 20 photos per day",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${dateString}/${Date.now()}.${fileExt}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('daily-photos')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('diary_media')
        .insert({
          user_id: user.id,
          file_name: selectedFile.name,
          file_path: fileName,
          file_size: selectedFile.size,
          mime_type: selectedFile.type,
          caption: caption.trim() || null,
          upload_date: dateString
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Photo uploaded successfully",
      });

      // Reset form and refresh
      setSelectedFile(null);
      setCaption('');
      setIsUploadDialogOpen(false);
      fetchMediaFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload photo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteMedia = async (media: MediaFile) => {
    if (!user) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('daily-photos')
        .remove([media.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('diary_media')
        .delete()
        .eq('id', media.id);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Photo deleted successfully",
      });

      fetchMediaFiles();
      setIsViewDialogOpen(false);
    } catch (error) {
      console.error('Error deleting media:', error);
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive",
      });
    }
  };

  const updateCaption = async (media: MediaFile) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('diary_media')
        .update({ caption: editCaption.trim() || null })
        .eq('id', media.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Caption updated successfully",
      });

      fetchMediaFiles();
      setIsViewDialogOpen(false);
    } catch (error) {
      console.error('Error updating caption:', error);
      toast({
        title: "Error",
        description: "Failed to update caption",
        variant: "destructive",
      });
    }
  };

  const openViewDialog = (media: MediaFile) => {
    setSelectedMedia(media);
    setEditCaption(media.caption || '');
    setIsViewDialogOpen(true);
  };

  const getImageUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('daily-photos')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-stone-800 flex items-center">
          Memory
          <span className="ml-2 text-2xl">📸</span>
        </h3>
        <Button
          onClick={() => setIsUploadDialogOpen(true)}
          size="sm"
          className="bg-stone-600 hover:bg-stone-700 text-white"
          disabled={mediaFiles.length >= 20}
        >
          <Camera className="w-4 h-4 mr-2" />
          Add Photo
        </Button>
      </div>

      {/* Photo Grid */}
      <div className="bg-stone-50 rounded-xl border border-stone-200 p-4">
        {loading ? (
          <div className="text-center py-8 text-stone-600">Loading photos...</div>
        ) : mediaFiles.length === 0 ? (
          <div className="text-center py-8">
            <Camera className="w-12 h-12 mx-auto text-stone-400 mb-2" />
            <p className="text-stone-600">No photos uploaded yet</p>
            <p className="text-xs text-stone-500 mt-1">Upload up to 20 photos for today</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-3">
              {mediaFiles.map((media) => (
                <Card
                  key={media.id}
                  className="cursor-pointer hover:shadow-md transition-shadow bg-white border-stone-200"
                  onClick={() => openViewDialog(media)}
                >
                  <CardContent className="p-1">
                    <div className="aspect-square relative overflow-hidden rounded-md">
                      <img
                        src={getImageUrl(media.file_path)}
                        alt={media.caption || 'Memory photo'}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                        <Eye className="w-4 h-4 text-white opacity-0 hover:opacity-100" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-xs text-stone-500 text-center">
              {mediaFiles.length}/20 photos uploaded
            </p>
          </>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="photo">Select Photo</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </div>
            <div>
              <Label htmlFor="caption">Caption (Optional)</Label>
              <Input
                id="caption"
                placeholder="Add a caption for your photo..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
            {selectedFile && (
              <div className="border rounded-lg p-2">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded"
                />
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleFileUpload}
                disabled={!selectedFile || uploading}
              >
                {uploading ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View/Edit Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Memory Photo</DialogTitle>
          </DialogHeader>
          {selectedMedia && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={getImageUrl(selectedMedia.file_path)}
                  alt={selectedMedia.caption || 'Memory photo'}
                  className="w-full max-h-96 object-contain rounded-lg"
                />
              </div>
              
              <div>
                <Label htmlFor="editCaption">Caption</Label>
                <Input
                  id="editCaption"
                  placeholder="Add or edit caption..."
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                />
              </div>

              <div className="flex justify-between">
                <Button
                  variant="destructive"
                  onClick={() => deleteMedia(selectedMedia)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={() => updateCaption(selectedMedia)}>
                    Save Caption
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemoryMedia;