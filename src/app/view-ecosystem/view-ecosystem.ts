import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-view-ecosystem',
  imports: [RouterLink, FormsModule, TitleCasePipe],
  template: `
    <div class="container py-8">
      <!-- Header -->
      <div class="mb-8">
        <nav class="mb-4">
          <a routerLink="/" class="text-fuchsia-500 hover:text-fuchsia-600">
            ← Back to Ecosystems
          </a>
        </nav>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold capitalize mb-2">
              {{ ecosystemName() }} Packages
            </h1>
            <p class="text-text-secondary">
              {{ packages().length }} packages found
              @if (filteredPackages().length !== packages().length) {
                <span> ({{ filteredPackages().length }} shown)</span>
              }
            </p>
          </div>
          <span class="text-4xl">{{ getEcosystemIcon(ecosystemName()) }}</span>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="mb-6 flex gap-4 items-center">
        <div class="flex-1">
          <input
            type="search"
            [(ngModel)]="searchTerm"
            placeholder="Search packages..."
            class="w-full px-4 py-2 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div class="flex gap-2">
          <button
            (click)="toggleSort('name')"
            [class]="getSortButtonClass('name')"
            class="px-3 py-2 text-sm rounded border transition-colors"
          >
            Name {{ getSortIndicator('name') }}
          </button>
          <button
            (click)="toggleSort('vulnerabilities')"
            [class]="getSortButtonClass('vulnerabilities')"
            class="px-3 py-2 text-sm rounded border transition-colors"
          >
            Vulnerabilities {{ getSortIndicator('vulnerabilities') }}
          </button>
          <button
            (click)="toggleSort('status')"
            [class]="getSortButtonClass('status')"
            class="px-3 py-2 text-sm rounded border transition-colors"
          >
            Status {{ getSortIndicator('status') }}
          </button>
        </div>
      </div>

      <!-- Packages Table -->
      @if (filteredPackages().length > 0) {
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="w-full">
            <thead class="bg-bg-elevated">
              <tr>
                <th class="text-left py-3 px-4 font-semibold">Package Name</th>
                <th class="text-left py-3 px-4 font-semibold">Latest Version</th>
                <th class="text-left py-3 px-4 font-semibold">Status</th>
                <th class="text-left py-3 px-4 font-semibold">EOL Versions</th>
                <th class="text-center py-3 px-4 font-semibold">Vulnerabilities</th>
                <th class="text-center py-3 px-4 font-semibold">HeroDevs NES</th>
              </tr>
            </thead>
            <tbody>
              @for (pkg of filteredPackages(); track pkg.name) {
                <tr class="border-t border-border-color hover:bg-bg-secondary">
                  <td class="py-3 px-4">
                    <a 
                      [routerLink]="[pkg.name]" 
                      class="font-medium text-primary-600 hover:text-primary-700 hover:underline"
                    >
                      {{ pkg.name }}
                    </a>
                  </td>
                  <td class="py-3 px-4 font-mono text-sm">
                    {{ pkg.latestVersion }}
                  </td>
                  <td class="py-3 px-4">
                    <span [class]="getStatusBadgeClass(pkg.status)">
                      {{ pkg.status | titlecase }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-center">
                    @if (pkg.eolVersionCount > 0) {
                      <span class="text-error font-semibold">{{ pkg.eolVersionCount }}</span>
                    } @else {
                      <span class="text-text-muted">0</span>
                    }
                  </td>
                  <td class="py-3 px-4">
                    @if (pkg.totalVulnerabilities > 0) {
                      <div class="text-center">
                        <div class="font-semibold">{{ pkg.totalVulnerabilities }}</div>
                        @if (pkg.vulnerabilitiesBySeverity) {
                          <div class="flex justify-center gap-1 mt-1">
                            @if (pkg.vulnerabilitiesBySeverity['critical']) {
                              <span class="w-2 h-2 bg-red-600 rounded-full" title="Critical"></span>
                            }
                            @if (pkg.vulnerabilitiesBySeverity['high']) {
                              <span class="w-2 h-2 bg-orange-500 rounded-full" title="High"></span>
                            }
                            @if (pkg.vulnerabilitiesBySeverity['medium']) {
                              <span class="w-2 h-2 bg-yellow-500 rounded-full" title="Medium"></span>
                            }
                            @if (pkg.vulnerabilitiesBySeverity['low']) {
                              <span class="w-2 h-2 bg-blue-500 rounded-full" title="Low"></span>
                            }
                          </div>
                        }
                      </div>
                    } @else {
                      <div class="text-center text-text-muted">0</div>
                    }
                  </td>
                  <td class="py-3 px-4 text-center">
                    @if (pkg.hasHeroDevsSupport) {
                      <a 
                        href="https://herodevs.com" 
                        target="_blank"
                        class="inline-block"
                        title="Supported by HeroDevs NES"
                      >
                        <img 
                          src="https://herodevs.com/images/hd-logo-icon.svg" 
                          alt="HeroDevs" 
                          class="herodevs-logo"
                        />
                      </a>
                    } @else {
                      <span class="text-text-muted text-sm">-</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <div class="text-center py-12">
          <div class="text-6xl mb-4">🔍</div>
          <h3 class="text-xl font-semibold mb-2">No packages found</h3>
          <p class="text-text-muted">
            @if (searchTerm()) {
              No packages match your search criteria.
            } @else {
              This ecosystem doesn't have any packages yet.
            }
          </p>
        </div>
      }
    </div>
  `,
  styles: [`
    .w-full { width: 100%; }
    .flex { display: flex; }
    .flex-1 { flex: 1; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    .justify-center { justify-content: center; }
    .gap-4 { gap: 1rem; }
    .gap-2 { gap: 0.5rem; }
    .gap-1 { gap: 0.25rem; }
    .mb-8 { margin-bottom: 2rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mt-1 { margin-top: 0.25rem; }
    .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
    .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
    .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
    .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
    .text-6xl { font-size: 3.75rem; line-height: 1; }
    .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
    .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
    .capitalize { text-transform: capitalize; }
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }
    .text-left { text-align: left; }
    .text-center { text-align: center; }
    .rounded-lg { border-radius: 0.5rem; }
    .rounded { border-radius: 0.25rem; }
    .rounded-full { border-radius: 9999px; }
    .border-t { border-top-width: 1px; }
    .border { border-width: 1px; }
    .overflow-hidden { overflow: hidden; }
    .shadow { box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1); }
    .transition-colors { transition-property: color, background-color, border-color; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
    .hover\\:underline:hover { text-decoration-line: underline; }
    .focus\\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
    .focus\\:ring-2:focus { --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); }
    .focus\\:ring-primary-500:focus { --tw-ring-color: var(--color-primary-500); }
    .focus\\:border-transparent:focus { border-color: transparent; }
    .w-2 { width: 0.5rem; }
    .h-2 { height: 0.5rem; }
    .bg-red-600 { background-color: #dc2626; }
    .bg-orange-500 { background-color: #f97316; }
    .bg-yellow-500 { background-color: #eab308; }
    .bg-blue-500 { background-color: #3b82f6; }
    .font-mono { font-family: var(--font-mono); }
    .inline-block { display: inline-block; }
  `],
})
export class ViewEcosystem {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  
  ecosystemName = toSignal(this.route.params.pipe(map(params => params['ecosystem'])), { initialValue: '' });
  
  packages = computed(() => {
    const ecosystemName = this.ecosystemName();
    return ecosystemName ? this.dataService.getEcosystemPackages(ecosystemName)() : [];
  });
  
  searchTerm = signal('');
  sortBy = signal('name');
  sortDirection = signal<'asc' | 'desc'>('asc');
  
  filteredPackages = computed(() => {
    let filtered = this.packages();
    
    // Apply search filter
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(pkg => 
        pkg.name.toLowerCase().includes(search)
      );
    }
    
    // Apply sorting
    const sortField = this.sortBy();
    const direction = this.sortDirection();
    
    filtered = [...filtered].sort((a, b) => {
      let valueA: any;
      let valueB: any;
      
      switch (sortField) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'vulnerabilities':
          valueA = a.totalVulnerabilities;
          valueB = b.totalVulnerabilities;
          break;
        case 'status':
          valueA = a.status;
          valueB = b.status;
          break;
        default:
          return 0;
      }
      
      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filtered;
  });
  
  toggleSort(field: string) {
    if (this.sortBy() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(field);
      this.sortDirection.set('asc');
    }
  }
  
  getSortButtonClass(field: string): string {
    const isActive = this.sortBy() === field;
    return isActive 
      ? 'border-primary-500 bg-primary-50 text-primary-700'
      : 'border-border-color bg-white text-text-secondary hover:bg-bg-secondary';
  }
  
  getSortIndicator(field: string): string {
    if (this.sortBy() !== field) return '';
    return this.sortDirection() === 'asc' ? '↑' : '↓';
  }
  
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
  
  getEcosystemIcon(ecosystem: string): string {
    const icons: Record<string, string> = {
      npm: '📦',
      maven: '☕',
      ruby: '💎',
      pip: '🐍',
      apt: '🐧',
      snapd: '📱',
      flatpak: '📱'
    };
    return icons[ecosystem] || '📦';
  }
}
