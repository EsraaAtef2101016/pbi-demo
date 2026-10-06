import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  EventEmitter,
  SimpleChanges,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as pbi from 'powerbi-client';

export interface PowerbiEventPayload {
  type: string;
  detail: unknown;
}

@Component({
  imports: [],
  selector: 'app-powerbi-report',
  styleUrl: './powerbi-report.css',
  templateUrl: './powerbi-report.html',
})
export class PowerbiReportComponent implements OnChanges, OnDestroy {
  @Input() reportId: string | null = null;
  @Input() groupId: string | null = null;
  @Input() ctid: string | null = null;
  @Input() accessToken: string | null = null;
  @Input() tokenType: 'Aad' | 'Embed' = 'Aad';

  @Output() reportEvent = new EventEmitter<PowerbiEventPayload>();
  @Output() reportError = new EventEmitter<string>();

  @ViewChild('reportContainer', { static: true }) reportContainer!: ElementRef<HTMLDivElement>;

  private powerbi = new pbi.service.Service(
    pbi.factories.hpmFactory,
    pbi.factories.wpmpFactory,
    pbi.factories.routerFactory
  );
  private embeddedReport: pbi.Report | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['accessToken'] || changes['reportId']) {
      this.embedReport();
    }
  }

  ngOnDestroy(): void {
    this.resetReport();
  }

  private embedReport(): void {
    if (!this.reportId || !this.accessToken) {
      this.resetReport();
      return;
    }

    this.resetReport();

    const config: pbi.IReportEmbedConfiguration = {
      type: 'report',
      id: this.reportId,
      embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${this.reportId}${
        this.groupId ? `&groupId=${this.groupId}` : ''
      }${this.ctid ? `&ctid=${this.ctid}` : ''}`,
      tokenType: this.tokenType === 'Aad' ? pbi.models.TokenType.Aad : pbi.models.TokenType.Embed,
      accessToken: this.accessToken,
      settings: {
        panes: {
          filters: { visible: false },
          pageNavigation: { visible: true }
        },
        background: pbi.models.BackgroundType.Transparent
      }
    };

    try {
      this.embeddedReport = this.powerbi.embed(
        this.reportContainer.nativeElement,
        config
      ) as pbi.Report;

      // Listen to SDK events
      this.embeddedReport.on('loaded', (e) => this.reportEvent.emit({ type: 'loaded', detail: e.detail }));
      this.embeddedReport.on('rendered', (e) => this.reportEvent.emit({ type: 'rendered', detail: e.detail }));
      this.embeddedReport.on('dataSelected', (e) => this.reportEvent.emit({ type: 'dataSelected', detail: e.detail }));
      this.embeddedReport.on('error', (e) => {
        const msg = (e.detail as { message?: string })?.message ?? 'Power BI Embed Error';
        this.reportError.emit(msg);
      });
    } catch (err) {
      this.reportError.emit(err instanceof Error ? err.message : String(err));
    }
  }

  private resetReport(): void {
    if (this.reportContainer?.nativeElement) {
      this.powerbi.reset(this.reportContainer.nativeElement);
    }
    this.embeddedReport = null;
  }
}