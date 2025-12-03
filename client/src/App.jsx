import React, { useState } from 'react';
import axios from 'axios';
import { FileCheck, Loader2, Download, X } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ConversionStatus from './components/ConversionStatus';
import './index.css';

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, selecting, converting, completed, error
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadName, setDownloadName] = useState('');
  const [error, setError] = useState(null);
  const [targetFormat, setTargetFormat] = useState('pdf');
  const [availableFormats, setAvailableFormats] = useState([]);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setError(null);

    const ext = selectedFile.name.split('.').pop().toLowerCase();

    if (ext === 'pdf') {
      setAvailableFormats(['docx', 'pptx']);
      setTargetFormat('docx');
      setStatus('selecting');
    } else if (ext === 'docx') {
      setAvailableFormats(['pdf']);
      setTargetFormat('pdf');
      // Auto-start for single option? Or let user confirm? 
      // Let's let user confirm/start to be consistent.
      setStatus('selecting');
    } else if (ext === 'pptx') {
      setAvailableFormats(['pdf']);
      setTargetFormat('pdf');
      setStatus('selecting');
    } else {
      setError('Unsupported file format');
      setStatus('error');
    }
  };

  const startConversion = async () => {
    setStatus('converting');
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', targetFormat);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const response = await axios.post('http://localhost:5001/api/convert', formData, {
        responseType: 'blob',
        onUploadProgress: (progressEvent) => {
          // We could track upload progress here
        }
      });

      clearInterval(progressInterval);
      setProgress(100);

      // Create download URL
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);

      // Set download filename
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
      setDownloadName(`${nameWithoutExt}.${targetFormat}`);

      setStatus('completed');

    } catch (err) {
      console.error(err);
      setStatus('error');
      setError('Conversion failed. Please try again.');
    }
  };

  const handleReset = () => {
    setFile(null);
    setStatus('idle');
    setProgress(0);
    setDownloadUrl(null);
    setDownloadName('');
    setError(null);
    setTargetFormat('pdf');
    setAvailableFormats([]);
  };

  return (
    <div className="app-container">
      <div className="background-gradient"></div>

      <div className="content-wrapper">
        <header className="app-header">
          <h1>Universal File Converter</h1>
          <p>Transform your documents with ease. Secure, fast, and lossless.</p>
        </header>

        <main className="main-card">
          {status === 'idle' && (
            <FileUpload onFileSelect={handleFileSelect} />
          )}

          {status === 'selecting' && (
            <div className="conversion-card">
              <div className="card-header">
                <h3 className="selection-title">Select Output Format</h3>
                <button onClick={handleReset} className="close-button"><X size={20} /></button>
              </div>
              <div className="selection-content">
                <p className="selection-text">Convert <strong>{file.name}</strong> to:</p>
                <div className="format-options">
                  {availableFormats.map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => setTargetFormat(fmt)}
                      className={`format-btn ${targetFormat === fmt ? 'active' : ''}`}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
                <button
                  onClick={startConversion}
                  className="start-conversion-btn"
                >
                  Start Conversion
                </button>
              </div>
            </div>
          )}

          {(status === 'converting' || status === 'completed' || status === 'error') && (
            <ConversionStatus
              file={file}
              status={status}
              progress={progress}
              downloadUrl={downloadUrl}
              downloadName={downloadName}
              onReset={handleReset}
              error={error}
            />
          )}
        </main>

        <footer className="app-footer">
          <p>&copy; 2025 SevenU Converter. All rights reserved.</p>
          <a href="https://ko-fi.com/breadrolljeo" target="_blank" rel="noopener noreferrer" className="kofi-button">
            <span className="kofi-icon">☕</span> Support the Developer
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;
