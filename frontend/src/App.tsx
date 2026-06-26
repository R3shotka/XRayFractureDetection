import React, { useState, useRef } from 'react';
import { AnalysisResponse } from './types/analysis';
import { analyzeImage } from './services/analysisApi';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import './App.css';

type Page = 'home' | 'analysis';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartScan = () => fileInputRef.current?.click();

  const handleFile = async (file: File) => {
    setSelectedFile(file);
    setResult(null);
    setError(null);
    setIsLoading(true);
    setPage('analysis');

    try {
      const response = await analyzeImage(file);
      setResult(response);
    } catch {
      setError('Помилка під час аналізу. Спробуйте ще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleFile(file);
    e.target.value = '';
  };

  const handleGoHome = () => {
    setPage('home');
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <>
      {/* Прихований інпут — спільний для обох сторінок */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/bmp"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {page === 'home' && (
        <HomePage onStartScan={handleStartScan} onFileDrop={handleFile} />
      )}

      {page === 'analysis' && (
        <AnalysisPage
          selectedFile={selectedFile}
          result={result}
          isLoading={isLoading}
          error={error}
          onNewScan={handleStartScan}
          onGoHome={handleGoHome}
        />
      )}
    </>
  );
}
