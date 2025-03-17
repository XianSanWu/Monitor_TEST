import { RegExpUtil } from "./reg-exp-util";

export const ValidateUtil = {
  /** 日期是否合法 */
  isValidDate: (value: string): boolean => {
    const result = ValidateUtil.getDateObject(value);
    if (result) {
      const date = new Date(+result.year, +result.month - 1, +result.date);
      // 驗證日期合法，且年月日相同
      if (!/invalid/i.test(date.toString()) &&
        date.getFullYear() === +result.year &&
        (date.getMonth() + 1) === +result.month &&
        date.getDate() === +result.date) {
        return true;
      }
    }
    return false;
  },
  isValidateDateYYYYMMDDFormat: (date: string): boolean => {
    const regex = RegExpUtil.dateDashAD;
    if (!regex.test(date)) {
      return false;
    }
    const [year, month, day] = date.split('-').map(Number);
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return false;
    }
    return true;
  },
   /**
   * 如格式符合: YYYY/(M)M/(D)D YYYY(M)M(D)D\
   * 會回傳物件:{ year: string, month: string, date: string }
   */
   getDateObject: (value: string): { year: string, month: string, date: string } | null => {
    const regExp = /^(\d{4})\/?(\d{1,2})\/?(\d{1,2})$/;
    if (regExp.test(value)) {
      const list = value.replace(regExp, '$1/$2/$3').split('/');
      return { year: list[0], month: list[1], date: list[2] };
    }
    return null;
  },
  /**
   * email檢查
   * Email 主要由三部分組成： 「郵件帳號」+「@」+「郵件網域」\
   * 郵件帳號可由以下字元組成：a-z、A-Z、0-9、底線 (_) 和單點 (.)\
   * 郵件網域只可由下列字元組成：a-z、A-Z、0-9、減號(-) 和單點 (.)
   */
  checkEmail: (str: string): boolean => {
    let result = false;
    const res = /^[a-z0-9_.]+@[a-z0-9-.]+$/i;
    if (str && res.test(str)) {
      result = true;
    }
    return result;
  },

}
