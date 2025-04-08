export class Base64Util {
  /**
   * 將字串轉為 Base64 編碼
   * @param plainText 要編碼的字串
   * @returns 編碼後的 Base64 字串
   */
  static encode(plainText: string): string {
    if (!plainText) {
      return '';
    }
    const encoder = new TextEncoder();
    const bytes = encoder.encode(plainText);
    return btoa(String.fromCharCode(...bytes));
  }

  /**
   * 將 Base64 字串解碼回原本字串
   * @param base64Encoded 要解碼的 Base64 字串
   * @returns 解碼後的原本字串
   */
  static decode(base64Encoded: string): string {
    if (!base64Encoded) {
      return '';
    }
    const decodedBytes = atob(base64Encoded).split('').map(c => c.charCodeAt(0));
    const decoder = new TextDecoder();
    return decoder.decode(new Uint8Array(decodedBytes));
  }
}
