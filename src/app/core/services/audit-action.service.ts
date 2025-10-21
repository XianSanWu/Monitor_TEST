import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuditActionService {
  private key = 'lastUserAction';
  private currentAction: { name: string; uuid: string; ts: number } | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const raw = sessionStorage.getItem(this.key);
        if (raw) {
          const rec = JSON.parse(raw);
          const ttl = 5000; // 5 秒內有效
          if (Date.now() - rec.ts <= ttl) {
            this.currentAction = rec;
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
    const uuid =
      crypto.randomUUID?.() ?? Math.random().toString(36).substring(2); // 產生唯一批次ID
    this.currentAction = { name: actionName, uuid, ts: Date.now() };
    try {
      sessionStorage.setItem(this.key, JSON.stringify(this.currentAction));
    } catch {}
  }

  // 取得 action 批次
  get(): { name: string; uuid: string } | null {
    return this.currentAction
      ? { name: this.currentAction.name, uuid: this.currentAction.uuid }
      : null;
  }

  clear() {
    this.currentAction = null;
    try {
      sessionStorage.removeItem(this.key);
    } catch {}
  }
}
