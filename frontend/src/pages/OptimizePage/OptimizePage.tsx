import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import styles from './OptimizePage.module.css';

interface LocationState {
  article: string;
  originalInspiration: string;
}

const OptimizePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  const [article, setArticle] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [titles, setTitles] = useState<string[]>([]);
  const [formattedHtml, setFormattedHtml] = useState('');
  
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [error, setError] = useState('');
  const [previousNumber, setPreviousNumber] = useState('000');

  useEffect(() => {
    if (!state?.article) {
      navigate('/');
      return;
    }
    setArticle(state.article);
  }, [state, navigate]);

  const handleGenerateTitles = async () => {
    setIsGeneratingTitles(true);
    setError('');

    try {
      // Use first 500 characters of article as summary
      const summary = article.substring(0, 500);
      const response = await api.generateTitles(summary);

      if (response.status === 'success' && response.titles.length > 0) {
        setTitles(response.titles);
      } else {
        setError('生成标题失败，请重试');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成标题失败');
    } finally {
      setIsGeneratingTitles(false);
    }
  };

  const handleTitleSelect = (title: string) => {
    setSelectedTitle(title);
  };

  const handleFormatArticle = async () => {
    if (!selectedTitle) {
      setError('请先选择一个标题');
      return;
    }

    setIsFormatting(true);
    setError('');

    try {
      const response = await api.formatArticle(
        selectedTitle,
        article,
        previousNumber
      );

      if (response.status === 'success') {
        setFormattedHtml(response.formattedHtml);
      } else {
        setError(response.message || '排版失败，请重试');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '排版失败');
    } finally {
      setIsFormatting(false);
    }
  };

  const handlePublish = async () => {
    if (!formattedHtml || !selectedTitle) {
      setError('请先完成文章排版');
      return;
    }

    setIsPublishing(true);
    setError('');

    try {
      const response = await api.publishToWeChat(
        selectedTitle,
        formattedHtml,
        '徐子叶'
      );

      if (response.status === 'success' && response.publishUrl) {
        // Open URL in new tab
        window.open(response.publishUrl, '_blank');
        
        // Show success message
        alert('文章已发布！正在打开公众号管理页面...');
      } else {
        setError(response.message || '发布失败，请重试');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '发布失败');
    } finally {
      setIsPublishing(false);
    }
  };

  const displayContent = formattedHtml || article;
  const isHtmlContent = !!formattedHtml;

  return (
    <div className={styles.container}>
      {/* Left Column - Toolbar (30%) */}
      <div className={styles.leftColumn}>
        <div className={styles.toolbar}>
          <div className={styles.toolbarHeader}>
            <h1 className={styles.title}>文章优化</h1>
            <button 
              className={styles.backButton}
              onClick={() => navigate('/')}
            >
              ← 返回
            </button>
          </div>

          {/* Step 1: Generate Titles */}
          <div className={styles.toolbarSection}>
            <div className={styles.stepHeader}>
              <span className={styles.stepNumber}>1</span>
              <h3 className={styles.stepTitle}>生成标题</h3>
            </div>

            {titles.length === 0 ? (
              <button
                className={styles.actionButton}
                onClick={handleGenerateTitles}
                disabled={isGeneratingTitles}
              >
                {isGeneratingTitles ? '生成中...' : '生成标题'}
              </button>
            ) : (
              <div className={styles.titlesContainer}>
                {titles.map((title, index) => (
                  <div
                    key={index}
                    className={`${styles.titleCard} ${
                      selectedTitle === title ? styles.titleCardSelected : ''
                    }`}
                    onClick={() => handleTitleSelect(title)}
                  >
                    <div className={styles.titleNumber}>{index + 1}</div>
                    <div className={styles.titleText}>{title}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Format Article */}
          <div className={styles.toolbarSection}>
            <div className={styles.stepHeader}>
              <span className={styles.stepNumber}>2</span>
              <h3 className={styles.stepTitle}>一键排版</h3>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="previousNumber" className={styles.label}>
                上一篇文章编号
              </label>
              <input
                id="previousNumber"
                type="text"
                className={styles.input}
                value={previousNumber}
                onChange={(e) => setPreviousNumber(e.target.value)}
                placeholder="000"
                maxLength={3}
              />
            </div>

            <button
              className={styles.actionButton}
              onClick={handleFormatArticle}
              disabled={!selectedTitle || isFormatting}
            >
              {isFormatting ? '排版中...' : '一键排版'}
            </button>
          </div>

          {/* Step 3: Publish */}
          <div className={styles.toolbarSection}>
            <div className={styles.stepHeader}>
              <span className={styles.stepNumber}>3</span>
              <h3 className={styles.stepTitle}>发布公众号</h3>
            </div>

            <button
              className={`${styles.actionButton} ${styles.publishButton}`}
              onClick={handlePublish}
              disabled={!formattedHtml || isPublishing}
            >
              {isPublishing ? '发布中...' : '发布至公众号'}
            </button>
          </div>

          {error && (
            <div className={styles.error}>{error}</div>
          )}

          <div className={styles.tips}>
            <p className={styles.tipsTitle}>💡 操作流程：</p>
            <ul className={styles.tipsList}>
              <li>先生成并选择一个标题</li>
              <li>点击"一键排版"格式化文章</li>
              <li>最后点击"发布至公众号"</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Column - Preview (70%) */}
      <div className={styles.rightColumn}>
        <div className={styles.previewSection}>
          <div className={styles.previewHeader}>
            <h2>文章预览</h2>
            {selectedTitle && (
              <span className={styles.selectedTitleBadge}>
                已选标题: {selectedTitle}
              </span>
            )}
          </div>

          <div className={styles.previewContent}>
            {isHtmlContent ? (
              <div 
                className={styles.htmlPreview}
                dangerouslySetInnerHTML={{ __html: displayContent }}
              />
            ) : (
              <div className={styles.textPreview}>
                {selectedTitle && (
                  <h2 className={styles.previewTitle}>{selectedTitle}</h2>
                )}
                <div className={styles.articleText}>
                  {displayContent.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index}>{paragraph}</p>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizePage;






