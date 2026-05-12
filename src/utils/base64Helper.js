/**
 * Base64 编解码工具函数
 * 支持中文字符的 Base64 编码与解码
 */

/**
 * 将普通文本编码为 Base64 字符串
 * 使用 encodeURIComponent 处理中文等非 ASCII 字符，避免乱码
 *
 * @param {string} text - 要编码的原始文本
 * @returns {string} Base64 编码后的字符串
 * @throws {Error} 编码失败时抛出异常
 */
export function encodeBase64 (text) {
  // 先用 encodeURIComponent 将中文转为 %XX 格式
  // 再将 %XX 转回单字节字符，最后进行 btoa 编码
  return btoa(
    encodeURIComponent(text).replace(
      /%([0-9A-F]{2})/g,
      (_, p1) => String.fromCharCode('0x' + p1)
    )
  )
}

/**
 * 将 Base64 字符串解码为普通文本
 * 对应编码时的逆操作，支持中文字符正确还原
 *
 * @param {string} base64Text - Base64 编码的字符串
 * @returns {string} 解码后的原始文本
 * @throws {Error} 解码失败时抛出异常
 */
export function decodeBase64 (base64Text) {
  try {
    // 先 atob 解码，再将每个字节转为 %XX 格式，最后 decodeURIComponent 还原中文
    return decodeURIComponent(
      atob(base64Text)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
  } catch {
    // 降级方案：如果 UTF-8 解码失败，尝试直接 atob（兼容纯 ASCII 内容）
    return atob(base64Text)
  }
}
