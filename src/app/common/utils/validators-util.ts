import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Option } from '../../core/models/common/base.model';
import { CommonUtil } from './common-util';
import { RegExpUtil } from './reg-exp-util';
import { ValidateUtil } from './validate-util';

export const ValidatorsUtil = {
  /** 日期區間 */
  dateRangeValidator: (ctl: AbstractControl): ValidationErrors | null => {
    const startCtl = ctl.get('startDate');
    const endCtl = ctl.get('endDate');

    if (!startCtl || !endCtl) {
      return null; // 不存在，不進行驗證
    }

    const startDate = startCtl.value ? new Date(startCtl.value) : null;
    const endDate = endCtl.value ? new Date(endCtl.value) : null;
    if (startDate && endDate) {
      // 確保日期格式正確，並比對日期大小
      if (endDate < startDate) {
        startCtl.setErrors(null);
        endCtl.setErrors(null);

        startCtl.setErrors({ dateErrMsg: '結束日期不得早於起始日期' });
        endCtl.setErrors({ dateErrMsg: '結束日期不得早於起始日期' });
        return { dateErrMsg: '結束日期不得早於起始日期' };
      } else {
        // 若驗證通過，清除 `Ctl` 的錯誤
        if (startCtl.hasError('dateErrMsg')) {
          startCtl.setErrors(null);
        }
        if (endCtl.hasError('dateErrMsg')) {
          endCtl.setErrors(null);
        }
      }
    }

    return null;
  },
  /** 手輸日期檢查 */
  dateFmt: (ctl: AbstractControl) => {
    const v = ctl.value;
    if (v instanceof Date) {
      return null;
    } else if ((ctl.dirty || ctl.touched) && !RegExpUtil.dateFmt1.test(v)) {
      return { format: '日期格式錯誤，請輸入有效的日期格式' };
    } else {
      return null;
    }
  },
  dateNotBeforeToday: (ctl: AbstractControl) => {
    const endDate = new Date(ctl.value);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if ((ctl.dirty || ctl.touched) && endDate < today) {
      return { dateBeforeToday: '不可小於今日' };
    }
    return null;
  },
  /** 搜尋區的身份證字號檢核 */
  searchCustId: (ctl: AbstractControl) => {
    const v = ctl.value;
    if (v && (ctl.dirty || ctl.touched) && !/^[a-zA-Z0-9]*$/.test(v)) {
      return { searchCustId: '請輸入有效客戶ID，英文字母或數字' };
    }
    return null;
  },
  /** 檢查:正整數格式 */
  number: (ctl: AbstractControl) => {
    const v = ctl.value;
    if (v && (ctl.dirty || ctl.touched) && !/^\d+$/i.test(v)) {
      return { number: '請輸入數字' };
    }
    return null;
  },
  /** 檢查:正負整數格式 */
  intNumber: (ctl: AbstractControl) => {
    const v = ctl.value;
    if (v && (ctl.dirty || ctl.touched) && !RegExpUtil.isNumeric.test(v)) {
      return { intNumber: '請輸入整數' };
    }
    return null;
  },
  /** 檢查:英文、數字、符號格式 */
  intSymbolsEnglishNumbers: (ctl: AbstractControl) => {
    const v = ctl.value;
    if (
      v &&
      (ctl.dirty || ctl.touched) &&
      !RegExpUtil.regexSymbolsEnglishNumbers.test(v)
    ) {
      return { intNumber: '請輸入英文、數字、符號' };
    }
    return null;
  },
  /** 正數驗證器 */
  positiveNumberValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;
      if (value !== null && value <= 0) {
        return { positiveNumber: '請輸入正整數' };
      }
      return null;
    };
  },
  /** 檢查:電話號碼09開頭 */
  phoneNumber: (ctl: AbstractControl) => {
    const v = ctl.value;
    if (v && (ctl.dirty || ctl.touched) && !/^09$|^09\d+$/i.test(v)) {
      return { phoneNumber: '請輸入以 "09" 開頭的數字' };
    }
    return null;
  },
  /** 檢查:手機格式 */
  mobile: (ctl: AbstractControl) => {
    const v = ctl.value;
    if (v && (ctl.dirty || ctl.touched) && !/^09\d{8}$/i.test(v)) {
      return { mobile: '手機號碼有誤' };
    }
    return null;
  },
  /** 檢查電話碼數*/
  tel: (ctl: AbstractControl) => {
    const v = ctl.value;
    if (v && (ctl.dirty || ctl.touched) && !/^\d{7,8}$/i.test(v)) {
      return { 'creditLoan.invalid.msg.tel': true };
    }
    return null;
  },
  /** 檢查:金額或數字範圍 */
  numberRange: (min: number, max: number, i18ErrKey: string): ValidatorFn => {
    return (ctl: AbstractControl) => {
      const v = ctl.value;
      if (v && (ctl.dirty || ctl.touched) && (+v < min || +v > max)) {
        return { [i18ErrKey]: true };
      }
      return null;
    };
  },
  /** 檢查:email格式 */
  email: (ctl: AbstractControl) => {
    const v = ctl.value;
    const exp =
      /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    if (
      v &&
      (ctl.dirty || ctl.touched) &&
      !ValidateUtil.checkEmail(ctl.value) &&
      !exp.test(v)
    ) {
      return { email: '電子郵件輸入錯誤' };
    }
    return null;
  },
  /** 檢查地址 */
  address: (ctl: AbstractControl) => {
    const v = ctl.value;
    if (v && (ctl.dirty || ctl.touched) && !/^[\u4e00-\u9fa50-9\-]+$/.test(v)) {
      return { address: '地址格式有誤' };
    }
    return null;
  },
  /** 客製標籤名稱檢核 */
  tagName: (ctl: AbstractControl) => {
    const v = ctl.value;
    const exp = RegExpUtil.regexChineseEnglishNumbers;
    if (
      v &&
      (ctl.dirty || ctl.touched) &&
      !ValidateUtil.checkEmail(ctl.value) &&
      !exp.test(v)
    ) {
      return { tagName: '標籤名稱輸入錯誤' };
    }
    return null;
  },
  /** 名單條件設定->預覽名單->名單上限必填*/
  listLimitRequired: (ctl: AbstractControl) => {
    if (!ctl.value || +ctl.value <= 0) {
      return { listLimit: '請先於表單輸入名單上限，在進行查詢' };
    }
    return null;
  },
  /** 檢查數字不為0 */
  notZero: (ctl: AbstractControl) => {
    if (
      (ctl.dirty || ctl.touched) &&
      !CommonUtil.isBlank(ctl.value) &&
      +ctl.value === 0
    ) {
      return { zero: '不可為0' };
    }
    return null;
  },
  /** 是否為空 */
  blank: (ctl: AbstractControl) => {
    const v: string = ctl.value;
    if (v && (ctl.dirty || ctl.touched) && (v || '').trim().length === 0) {
      return { blank: '不可為空' };
    }
    return null;
  },
  /** 至少要幾個FormControl為true (用於checkbox-group) */
  // atLeast: (num: number): ValidatorFn => {
  //   return (fg: FormGroup) => {
  //     if (!!fg.controls && (fg.dirty || fg.touched) && Object.keys(fg.controls).filter(ctl => fg.get(ctl).value == true).length < num) {
  //       return { 'least': `至少選取 ${num} 個` };
  //     }
  //     return null;
  //   };
  // },
  isRepeat: (ctl: AbstractControl) => {
    const v: string = ctl.value;
    if (ctl.parent?.value) {
      const valueList = Object.values(ctl.parent.value);
      const uniqueList = Array.from(new Set(valueList).values());
      let repeatList = new Set();
      valueList
        .filter((val, i, arr) => ValidatorsUtil.countInArray(arr, val) > 1)
        .forEach((val) => repeatList.add(val));
      if (uniqueList.length !== valueList.length && repeatList.has(v)) {
        return { repeat: '不可重複' };
      } else {
        return null;
      }
    } else {
      return null;
    }
  },
  countInArray<T>(array: T[], target: T) {
    var count = 0;
    array.filter((v, i, arr) => arr[i] === target).forEach(() => count++);
    return count;
  },
  checkOptionValue(options: Option[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const v: string = control.value;
      if (!v?.trim()) {
        return { blank: '不可為空' };
      }
      const option = options.find(
        (o) => o.value?.toLowerCase() === v?.toLowerCase()
      );
      return option ? null : { noOption: '查無資料' };
    };
  },
  /** 至少有一個欄位為必填 */
  requireAtLeastOneField(fields: string[]) {
    return (group: FormGroup): { [key: string]: boolean } | null => {
      let atLeastOneFieldFilled = false;

      for (const field of fields) {
        const fieldValue = group.get(field)?.value;
        if (fieldValue) {
          atLeastOneFieldFilled = true;
          break;
        }
      }

      if (!atLeastOneFieldFilled) {
        return { required: true };
      }

      return null;
    };
  },
};
