import { useState, FormEvent, ChangeEvent, useRef } from 'react';
import axios from 'axios';

interface Toast {
  type: 'success' | 'error' | 'info';
  message: string;
}

const MovieForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addToast = (type: Toast['type'], message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t !== prev.find(t => prev.indexOf(t) === id)));
    }, 4000);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.startsWith('image/')) {
        addToast('error', 'Please select an image file (JPEG, PNG, GIF, WebP)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        addToast('error', 'File size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';

      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);

        const uploadResponse = await axios.post(
          'http://localhost:5000/api/upload',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        if (uploadResponse.data.success) {
          imageUrl = uploadResponse.data.imageUrl;
        } else {
          throw new Error(uploadResponse.data.message || 'Image upload failed');
        }
      }

      const movieData = { title, description, image: imageUrl };
      const movieResponse = await axios.post('http://localhost:5000/api/movies', movieData);

      if (movieResponse.data.success) {
        addToast('success', 'Movie added successfully! 🎉');
        setTitle('');
        setDescription('');
        setSelectedFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (err: any) {
      addToast('error', err.response?.data?.message || 'Failed to add movie. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Toast Notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {toasts.map((toast, index) => (
          <div
            key={index}
            className={`px-6 py-4 rounded-lg shadow-lg text-white font-medium animate-slideUp ${
              toast.type === 'success' ? 'bg-green-600' :
              toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            🎬 Add New Movie
          </h2>
          <p className="text-gray-400 mt-2">Fill in the details below to add a movie to your collection</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">Movie Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Enter movie title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              placeholder="Enter movie description"
              rows={4}
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">Movie Poster</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {preview ? (
                  <div className="space-y-4">
                    <img src={preview} alt="Preview" className="w-40 h-60 object-cover rounded-lg mx-auto shadow-lg" />
                    <p className="text-blue-400">Click to change image</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-4xl">📁</div>
                    <p className="text-gray-400">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <span>Uploading...</span>
              </span>
            ) : (
              '✨ Add Movie'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MovieForm;