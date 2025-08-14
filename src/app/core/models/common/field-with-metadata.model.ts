import { MathSymbolEnum } from "../../enums/math-symbol-enum";

export class FieldWithMetadataModel {
  /** 欄位名稱 */
  Key: string = '';

  /** 數學符號 */
  MathSymbol: MathSymbolEnum = MathSymbolEnum.None; // 對應 MathSymbolEnum

  /** 值 */
  Value: any = '';
}
