const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// For local development, load .env from the backend directory
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });
}

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// DeepSeek API Helper
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
const DEEPSEEK_MODEL_NAME = process.env.DEEPSEEK_MODEL_NAME || 'deepseek-chat';

async function generateWithDeepseek(prompt) {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY is not set in the environment variables.');
  }

  const url = `${DEEPSEEK_BASE_URL}/v1/chat/completions`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL_NAME,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ],
        stream: false
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`DeepSeek API request failed with status ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error('Invalid response structure from DeepSeek:', data);
      throw new Error('Invalid response structure from DeepSeek endpoint');
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling DeepSeek endpoint:', error);
    throw error;
  }
}


// Article Generation Prompt (Liu Run Style)
const ARTICLE_GENERATION_PROMPT = `# Role: 公众号爆款文章生成器 (刘润风格)
## Profile
author: Gemini
version: 1.0
language: 中文
description: 一个模拟顶尖商业作家刘润写作风格的AI，能将用户的零散灵感，转化为结构清晰、逻辑严谨、可读性强的"爆款"公众号文章。

## Background
我是一个深度学习了刘润老师写作心法的AI模型。我的核心世界观是：写作的本质是构建"逻辑势能"，用结构和逻辑的力量抓住稍纵即逝的读者注意力。

## Workflows
1.  **问询**: 表明身份，请用户提供"灵感碎片"。
2.  **建议**: 分析输入，建议最合适的写作结构（如"5商派"模型）并征求同意。
3.  **起草与交付**: 同意后，按结构起草并交付文章初稿。

## Initialization
你好，我是公众号爆款文章生成器。我深度学习了刘润老师的写作心法，擅长将零散的灵感构筑成具备"逻辑势能"的爆款文章。请把你的**【灵感碎片】或【核心观点】**告诉我，我将为你选择最合适的结构并生成一篇逻辑清晰、引人入胜的公众号文章初稿。

现在，请根据以下灵感生成一篇完整的公众号文章：`;

// Catchy Title Generation Prompt
const TITLE_GENERATION_PROMPT = `# Role: 顶级文案大师与增长黑客
## Profile
- author: Gemini
- version: 1.0
- language: 中文
- description: 一个专注于生成"爆款标题"的AI专家，深谙用户痛点、增长逻辑和文案心理学。

## Background
我的创作严格遵循"**关注率 = 价值 x 预期 x 稀缺性**"的黄金法则。

## Goals
1.  接收用户提供的核心主题。
2.  创作10个具备爆款潜质的标题。
3.  严格按照【输出格式】要求，提供分类、解析和最终推荐。

## Constrains
- 我的输出必须且只能遵循【输出格式】。
- 每一个标题都必须有明确的价值承诺。

## Workflows
1.  **解构需求**: 分析核心主题，提炼用户痛点。
2.  **公式拆解**: 围绕痛点，从价值、预期、稀缺性三维度进行头脑风暴。
3.  **分类创作**: 在"痛点前置型"、"好奇心驱动型"、"价值承诺型"、"稀缺性/颠覆认知型"四类别下创作。
4.  **解析与评审**: 为每个标题撰写解析，并最后给出综合推荐。

## Output Format
好的，收到您的需求。作为您的顶级文案大师，我将围绕"<用户输入的核心痛点>"，并运用"关注率 = 价值 x 预期 x 稀缺性"的黄金公式，为您创作10个具备爆款潜质的标题。

#### 一、痛点前置型
1.  **标题：** [生成的标题1]
    * **【创作思路解析】**：[解析内容]
2.  **标题：** [生成的标题2]
    * **【创作思路解析】**：[解析内容]

#### 二、好奇心驱动型
3.  **标题：** [生成的标题3]
    * **【创作思路解析】**：[解析内容]
4.  **标题：** [生成的标题4]
    * **【创作思路解析】**：[解析内容]

#### 三、价值承诺型
5.  **标题：** [生成的标题5]
    * **【创作思路解析】**：[解析内容]
6.  **标题：** [生成的标题6]
    * **【创作思路解析】**：[解析内容]

#### 四、稀缺性/颠覆认知型
7.  **标题：** [生成的标题7]
    * **【创作思路解析】**：[解析内容]
8.  **标题：** [生成的标题8]
    * **【创作思路解析】**：[解析内容]
9.  **标题：** [生成的标题9]
    * **【创作思路解析】**：[解析内容]
10. **标题：** [生成的标题10]
    * **【创作思路解析】**：[解析内容]

#### **【综合推荐】**
我首推标题 X：[最佳标题内容]
**理由**：[详细的推荐理由]

现在，请为以下文章核心主题生成10个爆款标题：`;

// AI Formatting Prompt (徐子叶 Style)
const FORMATTING_PROMPT = `# Role: 公众号文章排版师 (徐子叶风格)
## Profile
description: 一个专门为"徐子叶"公众号服务的资深文章排版师，将纯文本草稿，严格按照预设的CSS样式和HTML模板，转换成格式精美的HTML代码。

## Goals
- 接收文章草稿（包含上一篇文章编号、标题、正文）。
- 自动计算并更新文章编号（如001 -> 002）。
- 将内容与固定的"文章前"和"文章后"HTML模板无缝拼接。
- 输出一个单一、完整的HTML代码块。

## Constrains
- 唯一输出必须是纯粹的HTML代码。
- 必须严格使用定义的CSS样式和HTML模板。

## Skills
- **核心排版样式库:**
  - <h2>: style="margin: 25px 0px; text-align: center; font-weight: bold; color: rgb(255, 104, 39); font-size: 20px;"
  - <p>: style="margin: 1em 0.5em; text-align: justify; font-size: 15px; line-height: 1.75em; color: rgb(51, 51, 51);"
  - <strong>: style="color: rgb(255, 76, 0); font-weight: bold;"

## Workflows
1.  **解析输入**: 识别上一篇文章编号、标题、正文。
2.  **计算新编号**: 编号+1并格式化为三位数。
3.  **转换内容**: 将标题、正文、强调部分转换为带内联样式的HTML标签。
4.  **组装代码**: 按"文章前"->"转换后内容"->"文章后"的顺序拼接。
5.  **审查输出**: 检查代码完整性并输出。

请将以下内容转换为格式精美的HTML代码：

上一篇文章编号：{previousNumber}
标题：{title}
正文：
{content}

请直接输出完整的HTML代码，不要有任何其他说明文字。`;

// Helper function to parse titles from Gemini response
function parseTitles(text) {
  const titles = [];
  const titleRegex = /\*\*标题：\*\*\s*(.+?)(?=\n|$)/g;
  let match;
  
  while ((match = titleRegex.exec(text)) !== null) {
    titles.push(match[1].trim());
  }

  // If regex parsing fails, try to extract any meaningful titles
  if (titles.length === 0) {
    const lines = text.split('\n');
    lines.forEach(line => {
      if (line.includes('标题') && line.includes('：')) {
        const title = line.split('：')[1]?.trim();
        if (title && title.length > 0) {
          titles.push(title);
        }
      }
    });
  }

  return titles;
}

// API Routes

// POST /api/generate/article - Generate article using Deepseek
app.post('/api/generate/article', async (req, res) => {
  try {
    const { inspiration } = req.body;

    if (!inspiration) {
      return res.status(400).json({ 
        status: 'error', 
        message: '请提供灵感内容' 
      });
    }

    const prompt = ARTICLE_GENERATION_PROMPT + '\n\n' + inspiration;
    const article = await generateWithDeepseek(prompt);

    res.json({
      status: 'success',
      article: article
    });

  } catch (error) {
    console.error('Error generating article:', error);
    res.status(500).json({
      status: 'error',
      message: '生成文章失败: ' + error.message
    });
  }
});

// POST /api/generate/titles - Generate catchy titles using Deepseek
app.post('/api/generate/titles', async (req, res) => {
  try {
    const { articleSummary } = req.body;

    if (!articleSummary) {
      return res.status(400).json({ 
        status: 'error', 
        message: '请提供文章摘要或核心主题' 
      });
    }

    const prompt = TITLE_GENERATION_PROMPT + '\n\n' + articleSummary;
    const titlesText = await generateWithDeepseek(prompt);

    // Parse titles from the response
    const titles = parseTitles(titlesText);

    res.json({
      status: 'success',
      titles: titles,
      rawResponse: titlesText
    });

  } catch (error) {
    console.error('Error generating titles:', error);
    res.status(500).json({
      status: 'error',
      message: '生成标题失败: ' + error.message
    });
  }
});

// POST /api/format/article - Format article with HTML styling using Deepseek
app.post('/api/format/article', async (req, res) => {
  try {
    const { title, content, previousNumber } = req.body;

    if (!title || !content) {
      return res.status(400).json({ 
        status: 'error', 
        message: '请提供标题和正文内容' 
      });
    }

    const prevNum = previousNumber || '000';
    
    const prompt = FORMATTING_PROMPT
      .replace('{previousNumber}', prevNum)
      .replace('{title}', title)
      .replace('{content}', content);

    const formattedHtml = await generateWithDeepseek(prompt);

    // Clean up the response to extract only HTML
    let cleanedHtml = formattedHtml;
    if (formattedHtml.includes('```html')) {
      cleanedHtml = formattedHtml.split('```html')[1].split('```')[0].trim();
    } else if (formattedHtml.includes('```')) {
      cleanedHtml = formattedHtml.split('```')[1].split('```')[0].trim();
    }

    res.json({
      status: 'success',
      formattedHtml: cleanedHtml
    });

  } catch (error) {
    console.error('Error formatting article:', error);
    res.status(500).json({
      status: 'error',
      message: '文章排版失败: ' + error.message
    });
  }
});

// POST /api/wechat/publish - Publish to WeChat (Placeholder implementation)
app.post('/api/wechat/publish', async (req, res) => {
  try {
    const { title, content_html, author, access_token } = req.body;

    if (!title || !content_html) {
      return res.status(400).json({ 
        status: 'error', 
        message: '请提供标题和内容' 
      });
    }

    // TODO: Implement actual WeChat API integration
    // This is a placeholder implementation
    // In production, you would call the WeChat Official Accounts Platform API here
    
    // For now, return a mock success response
    console.log('Publishing to WeChat:', { title, author });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock response - replace with actual WeChat API call
    res.json({
      status: 'success',
      publishUrl: 'https://mp.weixin.qq.com/s/mock-article-url-' + Date.now(),
      message: '发布成功（模拟）'
    });

  } catch (error) {
    console.error('Error publishing to WeChat:', error);
    res.status(500).json({
      status: 'error',
      message: '发布失败: ' + error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// For Vercel serverless functions
module.exports = app;

