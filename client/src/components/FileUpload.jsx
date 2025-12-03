import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileType } from 'lucide-react';
import { motion } from 'framer-motion';

const FileUpload = ({ onFileSelect }) => {
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles?.length > 0) {
            onFileSelect(acceptedFiles[0]);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
        }
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            {...getRootProps()}
            className={`file-upload-zone ${isDragActive ? 'active' : ''}`}
        >
            <input {...getInputProps()} />
            <div className="upload-content">
                <div className={`icon-wrapper ${isDragActive ? 'active' : ''}`}>
                    {isDragActive ? <FileType size={48} /> : <Upload size={48} />}
                </div>
                <div className="text-wrapper">
                    <h3>
                        {isDragActive ? 'Drop your file here' : 'Drag & Drop your file'}
                    </h3>
                    <p>
                        Supports PDF, DOCX, PPTX
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default FileUpload;
