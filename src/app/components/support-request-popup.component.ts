import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface SupportRequest {
  name: string;
  companyName: string;
  phoneNumber: string;
  details: string;
  packageName?: string;
  ecosystem?: string;
}

@Component({
  selector: 'app-support-request-popup',
  imports: [FormsModule],
  template: `
    <div class="popup-overlay" (click)="onOverlayClick($event)">
      <div class="popup-content" (click)="$event.stopPropagation()">
        <div class="popup-header">
          <h2 class="text-xl font-semibold mb-2">Request Extended Support</h2>
          <p class="text-text-secondary text-sm">
            Get HeroDevs Never-Ending Support (NES) for this package to continue receiving 
            security updates and patches after end-of-life.
          </p>
        </div>

        <form (ngSubmit)="onSubmit()" #requestForm="ngForm" class="popup-body">
          <div class="form-group">
            <label for="name">Full Name *</label>
            <input 
              type="text" 
              id="name" 
              name="name"
              [ngModel]="name()"
              (ngModelChange)="name.set($event)"
              required
              placeholder="Enter your full name"
            />
          </div>

          <div class="form-group">
            <label for="companyName">Company Name *</label>
            <input 
              type="text" 
              id="companyName" 
              name="companyName"
              [ngModel]="companyName()"
              (ngModelChange)="companyName.set($event)"
              required
              placeholder="Enter your company name"
            />
          </div>

          <div class="form-group">
            <label for="phoneNumber">Phone Number *</label>
            <input 
              type="tel" 
              id="phoneNumber" 
              name="phoneNumber"
              [ngModel]="phoneNumber()"
              (ngModelChange)="phoneNumber.set($event)"
              required
              placeholder="Enter your phone number"
            />
          </div>

          <div class="form-group">
            <label for="details">Additional Details</label>
            <textarea 
              id="details" 
              name="details"
              [ngModel]="details()"
              (ngModelChange)="details.set($event)"
              placeholder="Tell us more about your use case, timeline, or specific requirements..."
              rows="4"
            ></textarea>
          </div>

          @if (packageInfo()) {
            <div class="bg-bg-secondary p-3 rounded-md text-sm">
              <strong>Package:</strong> {{ packageInfo()!.packageName }}<br>
              <strong>Ecosystem:</strong> {{ packageInfo()!.ecosystem }}
            </div>
          }
        </form>

        <div class="popup-footer">
          <button 
            type="button" 
            class="button-secondary"
            (click)="onCancel()"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
            [class.opacity-50]="!isFormValid()"
            [disabled]="!isFormValid()"
            (click)="onSubmit()"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
    .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }
    .mb-2 { margin-bottom: 0.5rem; }
    .p-3 { padding: 0.75rem; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .rounded-md { border-radius: 0.375rem; }
    .transition-colors { 
      transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 150ms;
    }
    .opacity-50 { opacity: 0.5; }
    .bg-fuchsia-500 { background-color: var(--color-fuchsia-500); }
    .bg-fuchsia-600 { background-color: var(--color-fuchsia-600); }
    .hover\\:bg-fuchsia-600:hover { background-color: var(--color-fuchsia-600); }
    .text-white { color: white; }

    button:disabled {
      cursor: not-allowed;
    }
  `]
})
export class SupportRequestPopupComponent {
  // Form data as individual signals for better reactivity
  name = signal('');
  companyName = signal('');
  phoneNumber = signal('');
  details = signal('');

  packageInfo = signal<{packageName: string; ecosystem: string} | null>(null);

  // Outputs
  submitRequest = output<SupportRequest>();
  closePopup = output<void>();

  setPackageInfo(packageName: string, ecosystem: string) {
    this.packageInfo.set({ packageName, ecosystem });
  }

  isFormValid(): boolean {
    return !!(this.name().trim() && this.companyName().trim() && this.phoneNumber().trim());
  }

  onSubmit() {
    if (this.isFormValid()) {
      const packageInfo = this.packageInfo();
      const request: SupportRequest = {
        name: this.name(),
        companyName: this.companyName(),
        phoneNumber: this.phoneNumber(),
        details: this.details(),
        packageName: packageInfo?.packageName,
        ecosystem: packageInfo?.ecosystem
      };
      this.submitRequest.emit(request);
    }
  }

  onCancel() {
    this.closePopup.emit();
  }

  onOverlayClick(event: MouseEvent) {
    // Close popup when clicking the overlay
    this.closePopup.emit();
  }
}
