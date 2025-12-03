import React from 'react';
import { motion } from 'framer-motion';
import { FileCheck, Download, X } from 'lucide-react';

const ConversionStatus = ({ file, status, progress, downloadUrl, downloadName, onReset, error }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="conversion-card"
        >
            <div className="card-header">
                <div className="file-info">
                    <div className="file-icon">
                        <FileCheck size={24} />
                    </div>
                    <div className="file-details">
                        <h4 className="file-name">{file.name}</h4>
                        <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                </div>
                <button
                    onClick={onReset}
                    className="close-button"
                >
                    <X size={20} />
                </button>
            </div>

            {status === 'converting' && (
                <div className="progress-section">
                    <div className="progress-labels">
                        <span>Converting...</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="progress-bar-track">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="progress-bar-fill"
                        />
                    </div>
                </div>
            )}

            {status === 'completed' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="download-section"
                >
                    <a
                        href={downloadUrl}
                        download={downloadName}
                        className="download-button"
                    >
                        <Download size={20} />
                        Download Converted File
                    </a>
                </motion.div>
            )}

            {status === 'error' && (
                <div className="error-message">
                    {error || 'Something went wrong during conversion.'}
                </div>
            )}
        </motion.div>
    );
};

export default ConversionStatus;
