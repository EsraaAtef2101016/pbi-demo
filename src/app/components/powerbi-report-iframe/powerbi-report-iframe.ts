import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  imports: [],
  selector: 'app-powerbi-report-iframe',
  styleUrl: './powerbi-report-iframe.css',
  templateUrl: './powerbi-report-iframe.html',
})
export class PowerbiReportIframe implements OnChanges {
  private sanitizer = inject(DomSanitizer);
  @Input() directEmbedUrl: string | null = null;
  @Input() embedUrl: string | null = null;
  @Input() reportId: string | null = null;
  @Input() groupId: string | null = null;

  safeEmbedUrl: SafeResourceUrl | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    this.updateUrl();
  }

  private updateUrl(): void {
    let url = '';

    const targetUrl = this.directEmbedUrl || this.embedUrl;

    if (targetUrl && targetUrl.trim() !== '') {
      url = targetUrl.trim();
    } else if (this.reportId) {
      url = `https://app.powerbi.com/reportEmbed?reportId=${this.reportId}${
        this.groupId ? `&groupId=${this.groupId}` : ''
      }&autoAuth=true`;
    }

    if (url) {
      this.safeEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      this.safeEmbedUrl = null;
    }
  }
}