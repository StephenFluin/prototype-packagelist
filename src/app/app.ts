import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col">
      <nav class="border-b border-border-color bg-bg-primary">
        <div class="container">
          <div class="flex items-center justify-between py-4">
            <div class="flex items-center gap-md">
              <a routerLink="/" class="text-xl font-bold text-primary-600">
                📦 Package List
              </a>
              <span class="text-text-muted">End-of-Life Report</span>
            </div>
            <div class="flex items-center gap-md">
              <a 
                href="https://herodevs.com" 
                target="_blank"
                class="text-text-secondary hover:text-fuchsia-500 transition-colors"
              >
                Powered by HeroDevs
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main class="flex-1">
        <router-outlet />
      </main>

      <footer class="bg-bg-dark text-text-inverse py-8">
        <div class="container text-center">
          <div class="mb-4">
            <a 
              href="https://herodevs.com" 
              target="_blank" 
              class="text-fuchsia-400 hover:text-fuchsia-500 font-semibold"
            >
              Need Extended Support?
            </a>
          </div>
          <p class="text-neutral-400">
            End-of-life packages can be supported through HeroDevs Never-Ending Support (NES)
          </p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `],
})
export class App {
  protected readonly title = signal('Package List - End-of-Life Report');
}
