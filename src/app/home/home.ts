import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <div class="container py-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-4">Browse Package Ecosystems</h1>
        <p class="text-text-secondary text-lg max-w-2xl mx-auto">
          Monitor package ecosystems for end-of-life components and security vulnerabilities. Get
          extended support through HeroDevs NES.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (ecosystem of ecosystemSummary(); track ecosystem.ecosystem) {
        <div class="card hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <a
              [routerLink]="[ecosystem.ecosystem]"
              class="text-xl font-semibold capitalize hover:text-primary-600 transition-colors no-underline-hover"
            >
              {{ ecosystem.ecosystem }}
            </a>
            <span class="text-2xl">{{ getEcosystemIcon(ecosystem.ecosystem) }}</span>
          </div>

          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div class="text-text-muted">Packages</div>
              <div class="text-lg font-semibold">{{ ecosystem.packageCount }}</div>
            </div>
            <div>
              <div class="text-text-muted">End-of-Life</div>
              <div class="text-lg font-semibold text-error">{{ ecosystem.eolPackageCount }}</div>
            </div>
            <div>
              <div class="text-text-muted">Total Vulnerabilities</div>
              <div class="text-lg font-semibold">{{ ecosystem.totalVulnerabilities }}</div>
            </div>
            <div>
              <div class="text-text-muted">NES Available</div>
              <div class="text-lg font-semibold text-success">
                {{ ecosystem.heroDevsPackageCount }}
              </div>
            </div>
          </div>

          @if (ecosystem.vulnerabilitiesBySeverity &&
          Object.keys(ecosystem.vulnerabilitiesBySeverity).length > 0) {
          <div class="mt-4 pt-4 border-t border-border-color">
            <div class="text-text-muted text-sm mb-2">Vulnerabilities by Severity</div>
            <div class="flex gap-2 flex-wrap">
              @if (ecosystem.vulnerabilitiesBySeverity['critical']) {
              <span class="inline-flex items-center px-2 py-1 rounded text-xs bg-error text-white">
                Critical: {{ ecosystem.vulnerabilitiesBySeverity['critical'] }}
              </span>
              } @if (ecosystem.vulnerabilitiesBySeverity['high']) {
              <span
                class="inline-flex items-center px-2 py-1 rounded text-xs bg-orange-500 text-white"
              >
                High: {{ ecosystem.vulnerabilitiesBySeverity['high'] }}
              </span>
              } @if (ecosystem.vulnerabilitiesBySeverity['medium']) {
              <span
                class="inline-flex items-center px-2 py-1 rounded text-xs bg-warning text-neutral-900"
              >
                Medium: {{ ecosystem.vulnerabilitiesBySeverity['medium'] }}
              </span>
              } @if (ecosystem.vulnerabilitiesBySeverity['low']) {
              <span
                class="inline-flex items-center px-2 py-1 rounded text-xs bg-neutral-400 text-white"
              >
                Low: {{ ecosystem.vulnerabilitiesBySeverity['low'] }}
              </span>
              }
            </div>
          </div>
          }

          <div class="mt-6 pt-4 border-t border-border-color text-right">
            <a
              [routerLink]="[ecosystem.ecosystem]"
              class="inline-flex items-center gap-2 border-2 border-fuchsia-500 hover:bg-fuchsia-500 text-fuchsia-500 hover:text-white px-6 py-3 rounded-lg font-medium transition-all text-sm shadow-sm hover:shadow-md"
            >
              View Packages
              <span>→</span>
            </a>
          </div>
        </div>
        }
      </div>

      @if (ecosystemSummary().length === 0) {
      <div class="text-center py-12">
        <div class="text-6xl mb-4">📦</div>
        <h3 class="text-xl font-semibold mb-2">Loading ecosystem data...</h3>
        <p class="text-text-muted">Please wait while we load the package information.</p>
      </div>
      }

      <div class="mt-12 text-center">
        <div class="card max-w-2xl mx-auto">
          <h2 class="text-2xl font-semibold mb-4">Need Extended Support?</h2>
          <p class="text-text-secondary mb-6">
            HeroDevs Never-Ending Support (NES) provides security patches and support for
            end-of-life packages, keeping your applications secure and compliant.
          </p>
          <a
            href="https://herodevs.com/support"
            target="_blank"
            class="inline-flex items-center gap-2 bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Learn More about NES
            <span>→</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .grid {
        display: grid;
      }

      .grid-cols-1 {
        grid-template-columns: repeat(1, minmax(0, 1fr));
      }

      .gap-6 {
        gap: 1.5rem;
      }

      .gap-4 {
        gap: 1rem;
      }

      .gap-2 {
        gap: 0.5rem;
      }

      .max-w-2xl {
        max-width: 42rem;
      }

      .mx-auto {
        margin-left: auto;
        margin-right: auto;
      }

      .py-8 {
        padding-top: 2rem;
        padding-bottom: 2rem;
      }

      .py-12 {
        padding-top: 3rem;
        padding-bottom: 3rem;
      }

      .px-6 {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
      }

      .py-3 {
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
      }

      .px-2 {
        padding-left: 0.5rem;
        padding-right: 0.5rem;
      }

      .py-1 {
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
      }

      .text-4xl {
        font-size: 2.25rem;
        line-height: 2.5rem;
      }

      .text-2xl {
        font-size: 1.5rem;
        line-height: 2rem;
      }

      .text-xl {
        font-size: 1.25rem;
        line-height: 1.75rem;
      }

      .text-lg {
        font-size: 1.125rem;
        line-height: 1.75rem;
      }

      .text-6xl {
        font-size: 3.75rem;
        line-height: 1;
      }

      .text-xs {
        font-size: 0.75rem;
        line-height: 1rem;
      }

      .capitalize {
        text-transform: capitalize;
      }

      .rounded {
        border-radius: 0.25rem;
      }

      .rounded-lg {
        border-radius: 0.5rem;
      }

      .transition-colors {
        transition-property: color, background-color, border-color, text-decoration-color, fill,
          stroke;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
      }

      .transition-shadow {
        transition-property: box-shadow;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
      }

      .hover\\:shadow-lg:hover {
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
      }

      .border-t {
        border-top-width: 1px;
      }

      .flex-wrap {
        flex-wrap: wrap;
      }

      .bg-orange-500 {
        background-color: #f97316;
      }

      @media (min-width: 768px) {
        .md\\:grid-cols-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (min-width: 1024px) {
        .lg\\:grid-cols-3 {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
    `,
  ],
})
export class Home {
  private dataService = inject(DataService);

  ecosystemSummary = this.dataService.ecosystemSummary;

  // Expose Object for template use
  protected readonly Object = Object;

  getEcosystemIcon(ecosystem: string): string {
    const icons: Record<string, string> = {
      npm: '📦',
      maven: '☕',
      ruby: '💎',
      pip: '🐍',
      apt: '🐧',
      snapd: '📱',
      flatpak: '📱',
    };
    return icons[ecosystem] || '📦';
  }
}
