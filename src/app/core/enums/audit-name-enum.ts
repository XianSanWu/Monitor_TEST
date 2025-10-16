// 📘 AuditNameEnum.ts
// 用於稽核紀錄、路由標識、或行為追蹤的名稱定義
export namespace AuditNameEnum {
  // 🏠 首頁
  export enum Home {
    Main = '首頁_主頁',
  }
  // 👤 稽核軌跡管理
  export enum Audit {
    Main = '稽核軌跡_主頁',
  }

  // 👤 權限管理
  export enum Permission {
    Main = '權限管理_主頁',
    Detail_Read = '權限管理_詳細頁_讀取',
    Detail_Create = '權限管理_詳細頁_新增 & 複製',
    Detail_Update = '權限管理_詳細頁_更新',
    Btn_Main_Create = '新增 & 複製 權限',
    Btn_Main_Update = '新增 & 複製',
    Btn_Enable = '啟用帳號',
    Btn_Disable = '停用帳號',
    Setting = '權限管理_設定_新增 & 修改功能',
    Btn_Setting = '新增 & 修改功能',
  }

  // 📬 Mail Hunter
  export enum MailHunter {
    Main = 'Mail Hunter 主頁',
  }

  // 💾 MSMQ
  export enum MSMQ {
    Main = 'MSMQ 主頁',
  }

  // 📊 CDP
  export enum CDP {
    Main = 'CDP 主頁',
  }

  // 🧪 測試頁
  export enum Test {
    Main = '測試頁 主頁',
  }
}
