/**
 * Cloudflare Pages Function: 获取 Twitter/X 帖子信息
 * 通过 api.fxtwitter.com 代理获取结构化数据
 */
export async function onRequest(context) {
  const { searchParams } = new URL(context.request.url);
  const tweetUrl = searchParams.get('url');

  if (!tweetUrl) {
    return new Response(JSON.stringify({ error: '缺少 url 参数' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 提取 Tweet ID
  const tweetIdMatch = tweetUrl.match(/\/status\/(\d+)/);
  if (!tweetIdMatch) {
    return new Response(JSON.stringify({ error: '无效的 Twitter 链接' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const tweetId = tweetIdMatch[1];
  const apiUrl = `https://api.fxtwitter.com/status/${tweetId}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`FxTwitter API 返回错误: ${response.status}`);
    }

    const data = await response.json();
    
    // 我们可以在这里对数据进行预处理，比如替换图片链接为代理链接（如果需要）
    // 目前先原样返回，由前端处理或直接使用
    
    return new Response(JSON.stringify(data), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // 缓存 1 小时
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '获取推文信息失败', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
