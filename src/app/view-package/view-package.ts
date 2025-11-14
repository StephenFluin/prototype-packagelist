import { Component, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { DataService } from '../services/data.service';
import {
  SupportRequestPopupComponent,
  type SupportRequest,
} from '../components/support-request-popup.component';

@Component({
  selector: 'app-view-package',
  imports: [RouterLink, DatePipe, TitleCasePipe, SupportRequestPopupComponent],
  template: `
    <div class="container py-8">
      <!-- Header -->
      <div class="mb-8">
        <nav class="mb-4">
          <a [routerLink]="['/', ecosystemName()]" class="text-fuchsia-500 hover:text-fuchsia-600">
            ← Back to {{ ecosystemName() | titlecase }} Packages
          </a>
        </nav>

        @if (packageData()) {
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2">{{ packageData()!.name }}</h1>
            <div class="flex items-center gap-4 text-text-secondary">
              <span class="capitalize">{{ ecosystemName() }} Package</span>
              <span>•</span>
              <span>{{ packageData()!.versions.length }} version(s) tracked</span>
              @if (hasHeroDevsSupport()) {
              <span>•</span>
              <span class="flex items-center gap-1">
                <img src="/herodevs-logo-dark.svg" alt="HeroDevs" class="w-4 h-4" />
                NES Available
              </span>
              }
            </div>
          </div>
          <span class="text-4xl">{{ getEcosystemIcon(ecosystemName()) }}</span>
        </div>
        } @else {
        <div class="text-center py-12">
          <h1 class="text-3xl font-bold mb-2">Package Not Found</h1>
          <p class="text-text-secondary">
            The package "{{ packageName() }}" was not found in the {{ ecosystemName() }} ecosystem.
          </p>
        </div>
        }
      </div>

      @if (packageData()) {
      <!-- Package Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card">
          <div class="text-text-muted text-sm mb-1">Latest Version</div>
          <div class="text-2xl font-bold">{{ latestVersion()?.version || 'N/A' }}</div>
          <div class="text-text-muted text-sm">
            {{ latestVersion()?.releaseDate | date : 'mediumDate' }}
          </div>
        </div>

        <div class="card">
          <div class="text-text-muted text-sm mb-1">Status</div>
          <span [class]="getStatusBadgeClass(latestVersion()?.status || 'unknown')" class="text-sm">
            {{ latestVersion()?.status | titlecase }}
          </span>
        </div>

        <div class="card">
          <div class="text-text-muted text-sm mb-1">Total Vulnerabilities</div>
          <div class="text-2xl font-bold">{{ totalVulnerabilities() }}</div>
          @if (totalVulnerabilities() > 0) {
          <div class="flex gap-1 mt-2">
            @for (severity of ['critical', 'high', 'medium', 'low']; track severity) { @if
            (vulnerabilitiesBySeverity()[severity]) {
            <span
              [class]="getSeverityDotClass(severity)"
              class="w-2 h-2 rounded-full"
              [title]="severity + ': ' + vulnerabilitiesBySeverity()[severity]"
            ></span>
            } }
          </div>
          }
        </div>

        <div class="card">
          <div class="text-text-muted text-sm mb-1">EOL Versions</div>
          <div class="text-2xl font-bold text-error">{{ eolVersionCount() }}</div>
          @if (hasHeroDevsSupport()) {
          <div class="text-success text-sm mt-1">NES Available</div>
          }
        </div>
      </div>

      <!-- Versions Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-border-color">
          <h2 class="text-xl font-semibold">Version History</h2>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-bg-elevated">
              <tr>
                <th class="text-left py-3 px-6 font-semibold">Version</th>
                <th class="text-left py-3 px-6 font-semibold">Status</th>
                <th class="text-left py-3 px-6 font-semibold">Release Date</th>
                <th class="text-center py-3 px-6 font-semibold">Vulnerabilities</th>
                <th class="text-center py-3 px-6 font-semibold">Critical</th>
                <th class="text-center py-3 px-6 font-semibold">High</th>
                <th class="text-center py-3 px-6 font-semibold">Medium</th>
                <th class="text-center py-3 px-6 font-semibold">Low</th>
                <th class="text-center py-3 px-6 font-semibold">NES</th>
              </tr>
            </thead>
            <tbody>
              @for (version of packageData()!.versions; track version.version) {
              <tr class="border-t border-border-color hover:bg-bg-secondary">
                <td class="py-4 px-6">
                  <div class="font-mono font-medium">{{ version.version }}</div>
                </td>
                <td class="py-4 px-6">
                  <span [class]="getStatusBadgeClass(version.status)">
                    {{ version.status | titlecase }}
                  </span>
                </td>
                <td class="py-4 px-6">
                  {{ version.releaseDate | date : 'mediumDate' }}
                </td>
                <td class="py-4 px-6 text-center">
                  <div class="font-semibold">{{ version.vulnerabilities.length }}</div>
                </td>
                <td class="py-4 px-6 text-center">
                  {{ getVulnerabilityCountBySeverity(version.vulnerabilities, 'critical') }}
                </td>
                <td class="py-4 px-6 text-center">
                  {{ getVulnerabilityCountBySeverity(version.vulnerabilities, 'high') }}
                </td>
                <td class="py-4 px-6 text-center">
                  {{ getVulnerabilityCountBySeverity(version.vulnerabilities, 'medium') }}
                </td>
                <td class="py-4 px-6 text-center">
                  {{ getVulnerabilityCountBySeverity(version.vulnerabilities, 'low') }}
                </td>
                <td class="py-4 px-6 text-center">
                  @if (version.heroDevsSupported) {
                  <a href="https://herodevs.com" target="_blank" title="Supported by HeroDevs NES">
                    <img
                      src="/herodevs-logo-dark.svg"
                      alt="HeroDevs NES"
                      class="herodevs-logo mx-auto"
                    />
                  </a>
                  } @else {
                  <button
                    (click)="requestSupport(packageData()!.name)"
                    class="request-support-link mx-auto"
                    title="Request extended support for this package"
                  >
                    Request Support
                  </button>
                  }
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Vulnerabilities Detail -->
      @if (allVulnerabilities().length > 0) {
      <div class="mt-8 bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-border-color">
          <h2 class="text-xl font-semibold">Security Vulnerabilities</h2>
        </div>

        <div class="divide-y divide-border-color">
          @for (vuln of allVulnerabilities(); track vuln.cve + vuln.version) {
          <div class="px-6 py-4">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="font-mono font-semibold">{{ vuln.cve }}</span>
                  <span [class]="getSeverityBadgeClass(vuln.severity)">
                    {{ vuln.severity | titlecase }}
                  </span>
                  <span class="text-text-muted">CVSS: {{ vuln.score }}/10</span>
                </div>
                <div class="text-sm text-text-muted">
                  Affects version: <span class="font-mono">{{ vuln.version }}</span>
                </div>
              </div>
            </div>
          </div>
          }
        </div>
      </div>
      } }
    </div>

    <!-- Support Request Popup -->
    @if (showSupportPopup()) {
    <app-support-request-popup
      (submitRequest)="onSupportRequestSubmit($event)"
      (closePopup)="closeSupportPopup()"
    />
    }
  `,
  styles: [
    `
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }
      .py-8 {
        padding-top: 2rem;
        padding-bottom: 2rem;
      }
      .py-4 {
        padding-top: 1rem;
        padding-bottom: 1rem;
      }
      .py-3 {
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
      }
      .py-12 {
        padding-top: 3rem;
        padding-bottom: 3rem;
      }
      .px-6 {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
      }
      .mb-8 {
        margin-bottom: 2rem;
      }
      .mb-4 {
        margin-bottom: 1rem;
      }
      .mb-2 {
        margin-bottom: 0.5rem;
      }
      .mb-1 {
        margin-bottom: 0.25rem;
      }
      .mt-8 {
        margin-top: 2rem;
      }
      .mt-2 {
        margin-top: 0.5rem;
      }
      .mt-1 {
        margin-top: 0.25rem;
      }
      .mx-auto {
        margin-left: auto;
        margin-right: auto;
      }
      .text-3xl {
        font-size: 1.875rem;
        line-height: 2.25rem;
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
      .text-sm {
        font-size: 0.875rem;
        line-height: 1.25rem;
      }
      .font-bold {
        font-weight: 700;
      }
      .font-semibold {
        font-weight: 600;
      }
      .font-medium {
        font-weight: 500;
      }
      .font-mono {
        font-family: var(--font-mono);
      }
      .capitalize {
        text-transform: capitalize;
      }
      .text-left {
        text-align: left;
      }
      .text-center {
        text-align: center;
      }
      .flex {
        display: flex;
      }
      .grid {
        display: grid;
      }
      .items-center {
        align-items: center;
      }
      .items-start {
        align-items: flex-start;
      }
      .justify-between {
        justify-content: space-between;
      }
      .gap-6 {
        gap: 1.5rem;
      }
      .gap-4 {
        gap: 1rem;
      }
      .gap-3 {
        gap: 0.75rem;
      }
      .gap-1 {
        gap: 0.25rem;
      }
      .grid-cols-1 {
        grid-template-columns: repeat(1, minmax(0, 1fr));
      }
      .rounded-lg {
        border-radius: 0.5rem;
      }
      .rounded-full {
        border-radius: 9999px;
      }
      .shadow {
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
      }
      .overflow-hidden {
        overflow: hidden;
      }
      .overflow-x-auto {
        overflow-x: auto;
      }
      .border-b {
        border-bottom-width: 1px;
      }
      .border-t {
        border-top-width: 1px;
      }
      .divide-y > :not(:last-child) {
        border-bottom-width: 1px;
      }
      .w-full {
        width: 100%;
      }
      .w-4 {
        width: 1rem;
      }
      .w-2 {
        width: 0.5rem;
      }
      .h-4 {
        height: 1rem;
      }
      .h-2 {
        height: 0.5rem;
      }
      .flex-1 {
        flex: 1;
      }
      .hover\\:bg-bg-secondary:hover {
        background-color: var(--bg-secondary);
      }

      @media (min-width: 768px) {
        .md\\:grid-cols-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (min-width: 1024px) {
        .lg\\:grid-cols-4 {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
      }
    `,
  ],
})
export class ViewPackage {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);

  ecosystemName = toSignal(this.route.params.pipe(map((params) => params['ecosystem'])), {
    initialValue: '',
  });
  packageName = toSignal(this.route.params.pipe(map((params) => params['package'])), {
    initialValue: '',
  });

  packageData = computed(() => {
    const ecosystem = this.ecosystemName();
    const packageName = this.packageName();
    return ecosystem && packageName
      ? this.dataService.getPackage(ecosystem, packageName)()
      : undefined;
  });

  latestVersion = computed(() => {
    const pkg = this.packageData();
    return pkg?.versions[0]; // Assuming first version is latest
  });

  totalVulnerabilities = computed(() => {
    const pkg = this.packageData();
    return pkg?.versions.reduce((total, version) => total + version.vulnerabilities.length, 0) || 0;
  });

  eolVersionCount = computed(() => {
    const pkg = this.packageData();
    return pkg?.versions.filter((v) => v.status === 'end-of-life').length || 0;
  });

  hasHeroDevsSupport = computed(() => {
    const pkg = this.packageData();
    return pkg?.versions.some((v) => v.heroDevsSupported) || false;
  });

  vulnerabilitiesBySeverity = computed(() => {
    const pkg = this.packageData();
    if (!pkg) return {};

    const counts: Record<string, number> = {};
    pkg.versions.forEach((version) => {
      version.vulnerabilities.forEach((vuln) => {
        counts[vuln.severity] = (counts[vuln.severity] || 0) + 1;
      });
    });
    return counts;
  });

  allVulnerabilities = computed(() => {
    const pkg = this.packageData();
    if (!pkg) return [];

    const allVulns: Array<{ cve: string; severity: string; score: number; version: string }> = [];
    pkg.versions.forEach((version) => {
      version.vulnerabilities.forEach((vuln) => {
        allVulns.push({
          ...vuln,
          version: version.version,
        });
      });
    });

    // Sort by severity (critical first) then by score (highest first)
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return allVulns.sort((a, b) => {
      const severityDiff =
        (severityOrder[b.severity as keyof typeof severityOrder] || 0) -
        (severityOrder[a.severity as keyof typeof severityOrder] || 0);
      return severityDiff !== 0 ? severityDiff : b.score - a.score;
    });
  });

  getStatusBadgeClass(status: string): string {
    const baseClasses = 'px-2 py-1 rounded text-xs font-medium';
    switch (status) {
      case 'current':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'maintenance':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'end-of-life':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'deprecated':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  getSeverityBadgeClass(severity: string): string {
    const baseClasses = 'px-2 py-1 rounded text-xs font-medium';
    switch (severity) {
      case 'critical':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'high':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'medium':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'low':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  getSeverityDotClass(severity: string): string {
    switch (severity) {
      case 'critical':
        return 'bg-red-600';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  }

  getVulnerabilityCountBySeverity(vulnerabilities: any[], severity: string): number {
    return vulnerabilities.filter((v) => v.severity === severity).length;
  }

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

  // Support request functionality
  showSupportPopup = signal(false);

  requestSupport(packageName: string) {
    this.showSupportPopup.set(true);
  }

  closeSupportPopup() {
    this.showSupportPopup.set(false);
  }

  onSupportRequestSubmit(request: SupportRequest) {
    // Here you would typically send the request to your backend
    console.log('Support request submitted:', {
      ...request,
      ecosystem: this.ecosystemName(),
      packageName: this.packageName()
    });
    
    // Show success message (you could add a toast notification here)
    alert('Thank you! Your support request has been submitted. A HeroDevs representative will contact you shortly.');
    
    this.closeSupportPopup();
  }
}
