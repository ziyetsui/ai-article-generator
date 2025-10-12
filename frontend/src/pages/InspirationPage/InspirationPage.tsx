import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import styles from './InspirationPage.module.css';

const InspirationPage: React.FC = () => {
  const [inspiration, setInspiration] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!inspiration.trim()) {
      setError('请输入您的灵感或想法');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.generateArticle(inspiration);
      
      if (response.status === 'success') {
        // Navigate to optimize page with generated article
        navigate('/optimize', { 
          state: { 
            article: response.article,
            originalInspiration: inspiration
          } 
        });
      } else {
        setError(response.message || '生成失败，请重试');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请检查网络连接');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Left Column - Input Section (25%) */}
      <div className={styles.leftColumn}>
        <div className={styles.inputSection}>
          <h1 className={styles.title}>AI公众号文章生成器</h1>
          <p className={styles.subtitle}>灵感输入</p>
          
          <textarea
            className={styles.textarea}
            placeholder="请输入您的灵感碎片或核心观点...&#10;&#10;例如：&#10;- 关于产品思维的一些想法&#10;- 今天遇到的一个商业案例&#10;- 对某个热点事件的看法"
            value={inspiration}
            onChange={(e) => setInspiration(e.target.value)}
            disabled={isLoading}
          />

          {error && <div className={styles.error}>{error}</div>}

          <button
            className={styles.generateButton}
            onClick={handleGenerate}
            disabled={isLoading || !inspiration.trim()}
          >
            {isLoading ? '生成中...' : '生成'}
          </button>

          <div className={styles.tips}>
            <p className={styles.tipsTitle}>💡 使用提示：</p>
            <ul className={styles.tipsList}>
              <li>输入您的灵感或想法，越详细越好</li>
              <li>AI将模拟刘润老师的写作风格生成文章</li>
              <li>生成后可进行标题优化和排版</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Column - Preview Section (75%) */}
      <div className={styles.rightColumn}>
        <div className={styles.previewSection}>
          <div className={styles.previewHeader}>
            <h2>预览区域</h2>
          </div>
          
          <div className={styles.previewContent}>
            {isLoading ? (
              <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <p>AI正在创作中，请稍候...</p>
                <p className={styles.loadingSubtext}>这可能需要30-60秒</p>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📝</div>
                <p>在左侧输入您的灵感，点击"生成"开始创作</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspirationPage;




