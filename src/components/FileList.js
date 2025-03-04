import React, { useState, useEffect } from 'react';
import { list } from '@aws-amplify/storage';
import './FileList.css';

function FileList({ refreshTrigger }) {
  const [files, setFiles] = useState([]);

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

  return (
    <div className="file-list">
      <h2>Your Files</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th>Versions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.path}>
              <td>{file.path.replace('public/', '')}</td>
              <td>{file.size ? (file.size / 1024).toFixed(2) : 'N/A'} KB</td>
              <td>1</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FileList;