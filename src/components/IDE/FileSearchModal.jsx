import React, { useState, useEffect, useRef } from 'react';
import { VscFile } from 'react-icons/vsc';
import { ideFiles } from '../../constants/ideFiles';

const FileSearchModal = ({ isOpen, onClose, onSelectFile }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(ideFiles);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            setQuery('');
            setResults(ideFiles);
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Fuzzy search logic
    useEffect(() => {
        if (!query) {
            setResults(ideFiles);
            return;
        }

        const filtered = ideFiles.filter(file => {
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

        setResults(filtered);
        setSelectedIndex(0);
    }, [query]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;

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
    }, [isOpen, results, selectedIndex, onSelectFile, onClose]);

    // Scroll selected item into view
    useEffect(() => {
        if (listRef.current && listRef.current.children[selectedIndex]) {
            listRef.current.children[selectedIndex].scrollIntoView({
                block: 'nearest',
            });
        }
    }, [selectedIndex]);

    if (!isOpen) return null;

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
                        onChange={e => setQuery(e.target.value)}
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

export default FileSearchModal;
