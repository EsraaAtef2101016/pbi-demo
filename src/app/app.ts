import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  PowerbiReportComponent,
  type PowerbiEventPayload,
} from './components/powerbi-report/powerbi-report';
import { PowerbiReportIframe } from './components/powerbi-report-iframe/powerbi-report-iframe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PowerbiReportComponent,
    PowerbiReportIframe
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // Navigation State
  activeTab = signal<'sdk' | 'iframe'>('sdk');

  // Power BI Configuration Signals
 //  readonly reportId = signal('2221a3b9-ec28-46f2-a30f-a6070a2dfbf6');
  readonly reportId = signal('723562d2-18d1-405e-a2b6-5574e380ea8e');
  readonly groupId = signal('c399fe06-47a3-48f5-869c-1416854e7598');
  readonly ctid = signal('b74a3ff5-3dcb-4075-8703-f74a393618ec');
  readonly iframeUrl = signal<string>(`https://app.powerbi.com/reportEmbed?reportId=${this.reportId()}&groupId=${this.groupId()}&autoAuth=true`);
  // SDK Mode Signals & Variables
  tokenInput = '';
  readonly token = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  // IFrame Mode Signals & Variables
  // iframeUrlInput = `https://app.powerbi.com/reportEmbed?reportId=${this.reportId()}&groupId=${this.groupId()}&autoAuth=true`;
   reportIdInput = '';
  

  // Actions
  applyToken(): void {
    this.token.set(this.tokenInput.trim());
    this.errorMessage.set(null);
  }
 

applyreportId(): void {
  const newReportId = this.reportIdInput.trim();
  if (newReportId) {
    this.reportId.set(newReportId);

    // تفعيل وتحديث الرابط بناءً على הـ Report ID الجديد
    const newUrl = `https://app.powerbi.com/reportEmbed?reportId=${newReportId}&groupId=${this.groupId()}&autoAuth=true`;
    this.iframeUrl.set(newUrl);
  }
}
  // Event Handlers
  onReportEvent(event: PowerbiEventPayload): void {
    console.log('Power BI Event Received:', event);
  }

  onReportError(msg: string): void {
    this.errorMessage.set(msg);
  }
}