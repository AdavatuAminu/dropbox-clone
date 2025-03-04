import React, { useState } from 'react';
import { uploadData } from '@aws-amplify/storage';
import './FileUpload.css';

function FileUpload({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await uploadData({
        key: file.name,
        data: file,
        options: {
          contentType: file.type,
        },
      }).result;
      setFile(null);
      alert('File uploaded successfully!');
      if (onUploadComplete) onUploadComplete();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Upload failed!');
    }
    setUploading(false);
  };

  return (
    <div className="file-upload">
      <input 
        type="file" 
        onChange={handleFileChange}
        disabled={uploading}
      />
      <button 
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}

export default FileUpload;