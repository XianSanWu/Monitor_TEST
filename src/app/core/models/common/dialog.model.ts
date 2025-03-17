export class ConfirmDialogOption {
  title?: string;
  contentTitle?: string;
  contentTitle_1?: string;
  contentTitle_2?: string;
  content?: string;
  contentArrayStr?: Array<string>;
  dialogSize?: string = 'small';
  leftButtonName?: string;
  midButtonName?: string;
  rightButtonName?: string;
  leftCallback?: () => void;
  midCallback?: () => void;
  rightCallback?: () => void;
  isCloseBtn?: boolean;
}
