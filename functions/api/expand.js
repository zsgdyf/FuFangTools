/**
 * Cloudflare Pages Function: 处理短链接解析
 * 该接口通过模拟 HTTP 请求跟随重定向，获取短链接对应的原始长链接
 */
export async function onRequest(context) {
  const { searchParams } = new URL(context.request.url);
  const shortUrl = searchParams.get('url');

  // 检查是否提供了 url 参数
  if (!shortUrl) {
    return new Response(JSON.stringify({ error: '缺少 url 参数' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 首先尝试使用 HEAD 请求，这比 GET 更轻量，且足以获取重定向后的最终 URL
    const response = await fetch(shortUrl, {
      method: 'HEAD',
      redirect: 'follow',
    });

    return new Response(JSON.stringify({ longUrl: response.url }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    try {
      // 降级方案：某些服务可能禁用 HEAD 请求，尝试使用 GET 请求
      const response = await fetch(shortUrl, {
        method: 'GET',
        redirect: 'follow',
      });
      return new Response(JSON.stringify({ longUrl: response.url }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (innerError) {
      // 解析彻底失败
      return new Response(JSON.stringify({ error: '解析链接失败', details: innerError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
}
