// Use relative URL for production (Vercel), localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5001');

export interface GenerateArticleResponse {
  status: string;
  article: string;
  message?: string;
}

export interface GenerateTitlesResponse {
  status: string;
  titles: string[];
  rawResponse: string;
  message?: string;
}

export interface FormatArticleResponse {
  status: string;
  formattedHtml: string;
  message?: string;
}

export interface PublishResponse {
  status: string;
  publishUrl?: string;
  message?: string;
}

export const api = {
  async generateArticle(inspiration: string): Promise<GenerateArticleResponse> {
    const response = await fetch(`${API_BASE_URL}/api/generate/article`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inspiration }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '生成文章失败');
    }

    return response.json();
  },

  async generateTitles(articleSummary: string): Promise<GenerateTitlesResponse> {
    const response = await fetch(`${API_BASE_URL}/api/generate/titles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ articleSummary }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '生成标题失败');
    }

    return response.json();
  },

  async formatArticle(
    title: string,
    content: string,
    previousNumber: string = '000'
  ): Promise<FormatArticleResponse> {
    const response = await fetch(`${API_BASE_URL}/api/format/article`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, previousNumber }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '文章排版失败');
    }

    return response.json();
  },

  async publishToWeChat(
    title: string,
    content_html: string,
    author: string = '徐子叶',
    access_token: string = ''
  ): Promise<PublishResponse> {
    const response = await fetch(`${API_BASE_URL}/api/wechat/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content_html, author, access_token }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '发布失败');
    }

    return response.json();
  },
};

