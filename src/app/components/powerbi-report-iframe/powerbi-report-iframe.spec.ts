import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PowerbiReportIframe } from './powerbi-report-iframe';

describe('PowerbiReportIframe', () => {
  let component: PowerbiReportIframe;
  let fixture: ComponentFixture<PowerbiReportIframe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowerbiReportIframe],
    }).compileComponents();

    fixture = TestBed.createComponent(PowerbiReportIframe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
