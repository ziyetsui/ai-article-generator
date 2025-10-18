import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import styles from './InspirationPage.module.css';

const InspirationPage: React.FC = () => {
  const [inspiration, setInspiration] = useState<string>('');
  const [article, setArticle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const navigate = useNavigate();

  // Use a ref to hold the interval ID so it persists across re-renders
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up the interval when the component unmounts or when isLoading becomes false
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const pollJobStatus = (jobId: string) => {
    // Clear any existing interval before starting a new one
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(async () => {
      try {
        const result = await api.checkStatus(jobId);

        if (result.status === 'completed') {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setArticle(result.article || '');
          setIsLoading(false);
          setLoadingMessage('');
        } else if (result.status === 'failed') {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setError(result.error || '生成文章失败，请稍后重试。');
          setIsLoading(false);
          setLoadingMessage('');
        }
        // If status is 'pending', do nothing and let the interval continue polling.
        
      } catch (e: any) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setError(e.message);
        setIsLoading(false);
        setLoadingMessage('');
      }
    }, 5000); // Poll every 5 seconds
  };

  const handleGenerate = async () => {
    if (!inspiration.trim()) {
      setError('请输入一些灵感内容。');
      return;
    }
    setIsLoading(true);
    setArticle('');
    setError('');
    setLoadingMessage('任务已提交，AI 正在生成文章，这可能需要几分钟，请稍候...');

    try {
      // Start the job and get the job ID
      const result = await api.submitJob(inspiration);
      // Start polling for the result
      pollJobStatus(result.jobId);
    } catch (e: any) {
      setError(e.message);
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleOptimize = () => {
    if (article) {
      // Navigate to the OptimizePage and pass the article content
      navigate('/optimize', { state: { article } });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>AI 公众号文章生成器</h1>
      <p className={styles.subtitle}>第一步：输入灵感，生成文章</p>
      
      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <h2 className={styles.panelTitle}>你的灵感碎片...</h2>
          <textarea
            className={styles.inspirationInput}
            value={inspiration}
            onChange={(e) => setInspiration(e.target.value)}
            placeholder="例如：探讨一下远程工作对团队协作的影响，特别是沟通效率和企业文化方面。"
          />
          <button 
            className={styles.generateButton} 
            onClick={handleGenerate} 
            disabled={isLoading}
          >
            {isLoading ? '生成中...' : '生成文章'}
          </button>
        </div>
        
        <div className={styles.rightPanel}>
          <h2 className={styles.panelTitle}>生成的文章</h2>
          <div className={styles.articleOutput}>
            {isLoading && <div className={styles.loadingIndicator}>{loadingMessage}</div>}
            {error && <div className={styles.errorMessage}>{error}</div>}
            {article && <pre>{article}</pre>}
          </div>
          {article && !isLoading && (
            <button className={styles.optimizeButton} onClick={handleOptimize}>
              下一步：优化文章 &raquo;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InspirationPage;




