import React, { useState, useEffect, useRef, useMemo } from 'react';
import { VscFile } from 'react-icons/vsc';
import { ideFiles } from '../../constants/ideFiles';

const FileSearchContent = ({ onClose, onSelectFile }) => {
    const [query, setQuery] = useState('');
    // Derived results instead of state to avoid useEffect updates
    const results = useMemo(() => {
        if (!query) return ideFiles;

        return ideFiles.filter(file => {
            const fileName = file.name.toLowerCase();
            const search = query.toLowerCase();

            // Simple fuzzy match: characters must appear in order
            let searchIdx = 0;
            for (let i = 0; i < fileName.length; i++) {
                if (fileName[i] === search[searchIdx]) {
                    searchIdx++;
                }
                if (searchIdx === search.length) return true;
            }
            return false;
        });
    }, [query]);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    // Focus input when modal opens (mounts)
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(prev => (prev + 1) % results.length);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (results[selectedIndex]) {
                        onSelectFile(results[selectedIndex].id);
                        onClose();
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    onClose();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [results, selectedIndex, onSelectFile, onClose]);

    // Scroll selected item into view
    useEffect(() => {
        if (listRef.current && listRef.current.children[selectedIndex]) {
            listRef.current.children[selectedIndex].scrollIntoView({
                block: 'nearest',
            });
        }
    }, [selectedIndex]);

    return (
        <div className="file-search-overlay" onClick={onClose}>
            <div className="file-search-container" onClick={e => e.stopPropagation()}>
                <div className="file-search-input-wrapper">
                    <input
                        ref={inputRef}
                        type="text"
                        className="file-search-input"
                        placeholder="Search files by name"
                        value={query}
                        onChange={e => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                    />
                </div>
                <div className="file-search-list" ref={listRef}>
                    {results.length > 0 ? (
                        results.map((file, index) => (
                            <div
                                key={file.id}
                                className={`file-search-item ${index === selectedIndex ? 'selected' : ''}`}
                                onClick={() => {
                                    onSelectFile(file.id);
                                    onClose();
                                }}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <span className="file-search-icon">{file.icon}</span>
                                <div className="file-search-details">
                                    <span className="file-search-name">
                                        {/* Highlight matching characters could go here, but keeping it simple for now */}
                                        {file.name}
                                    </span>
                                    <span className="file-search-path">src/components/IDE</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="file-search-empty">No matching files found</div>
                    )}
                </div>
            </div>
        </div>
    );
};

const FileSearchModal = ({ isOpen, onClose, onSelectFile }) => {
    if (!isOpen) return null;
    return <FileSearchContent onClose={onClose} onSelectFile={onSelectFile} />;
};

export default FileSearchModal;
