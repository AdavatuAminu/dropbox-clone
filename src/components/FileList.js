import React, { useState, useEffect } from 'react';
import { list, remove, getUrl } from '@aws-amplify/storage';
import './FileList.css';

function FileList({ refreshTrigger }) {
  const [files, setFiles] = useState([]);
  const [shareUrl, setShareUrl] = useState({});

  useEffect(() => {
    fetchFiles();
  }, [refreshTrigger]);

  const fetchFiles = async () => {
    try {
      const fileList = await list({
        path: 'public/',
      });
      console.log('Fetched files:', fileList.items);
      setFiles(fileList.items);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleDelete = async (path) => {
    try {
      const key = path.replace('public/', '');
      await remove({ key });
      fetchFiles();
      alert('File deleted successfully!');
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Deletion failed!');
    }
  };

  const handlePreview = async (path) => {
    try {
      const key = path.replace('public/', '');
      const { url } = await getUrl({ key });
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error generating preview URL:', error);
      alert('Preview failed!');
    }
  };

  const handleShare = async (path) => {
    try {
      const key = path.replace('public/', '');
      const { url } = await getUrl({
        key,
        options: { expiresIn: 604800 }
      });
      setShareUrl((prev) => ({ ...prev, [path]: url }));
    } catch (error) {
      console.error('Error generating share link:', error);
      alert('Share link generation failed!');
    }
  };

  const handleCopy = (path) => {
    navigator.clipboard.writeText(shareUrl[path]);
    alert('Link copied to clipboard!');
  };

  const clearShareUrl = (path) => {
    setShareUrl((prev) => {
      const newUrls = { ...prev };
      delete newUrls[path];
      return newUrls;
    });
  };

  return (
    <div className="file-list">
      <h2>Your Files</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th>Versions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.path}>
              <td>{file.path.replace('public/', '')}</td>
              <td>{file.size ? (file.size / 1024).toFixed(2) : 'N/A'} KB</td>
              <td>1</td>
              <td>
                <button onClick={() => handlePreview(file.path)}>Preview</button>
                <button onClick={() => handleShare(file.path)}>Share</button>
                {shareUrl[file.path] && (
                  <div className="share-container">
                    <input
                      type="text"
                      value={shareUrl[file.path]}
                      readOnly
                      className="share-url"
                    />
                    <button onClick={() => handleCopy(file.path)}>Copy</button>
                    <button onClick={() => clearShareUrl(file.path)}>X</button>
                  </div>
                )}
                <button onClick={() => handleDelete(file.path)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FileList;