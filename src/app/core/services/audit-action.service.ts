import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuditActionService {
  private key = 'lastUserAction';
  private currentAction: string | null = null; // <-- 暫存 action

  constructor() {
    // 頁面初始化時，從 sessionStorage 讀一次（可選 TTL 檢查）
    if (typeof window !== 'undefined') {
      try {
        const raw = sessionStorage.getItem(this.key);
        if (raw) {
          const rec = JSON.parse(raw);
          const ttl = 5000; // TTL，存取5秒，5秒後消除
          if (Date.now() - rec.ts <= ttl) {
            this.currentAction = rec.actionName;
          } else {
            this.clear();
          }
        }
      } catch {
        this.clear();
      }
    }
  }

  // 設定 action（點按鈕時呼叫）
  set(actionName: string) {
    this.currentAction = actionName; // 暫存
    const rec = { actionName, url: window.location.href, ts: Date.now() };
    try {
      sessionStorage.setItem(this.key, JSON.stringify(rec));
    } catch {}
  }

  // 取得 action（多個 API 都可以拿）
  get(): string | null {
    return this.currentAction;
  }

  // 清除 action
  clear() {
    this.currentAction = null;
    try {
      sessionStorage.removeItem(this.key);
    } catch {}
  }
}
