export const CommonUtil = {
  /**
   * 是否為空字串
   * isBlank(undefined), return true
   * isBlank(null), return true
   * isBlank(""), return true
   * isBlank(" "), return false
   */
  isBlank(str: string): boolean {
    if (str === undefined || str === null || String(str).trim() === '') {
      return true;
    }
    return false;
  },
  /** 是否不為空字串 */
  isNotBlank(str: string): boolean {
    return !this.isBlank(str);
  },
  /** 回傳加上樣式的 HTML span 字串 */
  getColoredLabel(value: string, color: string, label: string): string {
    return `<span style="color: ${color}; font-weight: bold;">${label}</span>`;
  }
}
