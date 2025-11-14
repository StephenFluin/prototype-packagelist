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
              <a routerLink="/" class="text-xl font-bold text-primary-600"> HeroDevs Package DB </a>
            </div>
            <div class="flex items-center gap-md">
              <a
                href="https://herodevs.com"
                target="_blank"
                class="flex items-center gap-2 text-text-secondary hover:text-fuchsia-500 transition-colors no-underline-hover"
              >
                Powered by
                <img src="/herodevs-logo-dark.svg" alt="HeroDevs" class="h-5" />
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
          <div class="mb-6">
            <a
              href="https://herodevs.com"
              target="_blank"
              class="inline-block hover:opacity-80 transition-opacity no-underline-hover"
            >
              <img
                src="/herodevs-logo-dark.svg"
                alt="HeroDevs"
                class="h-16 filter invert mx-auto"
              />
            </a>
          </div>
          <div class="mb-4">
            <a
              href="https://herodevs.com"
              target="_blank"
              class="text-fuchsia-400 hover:text-fuchsia-500 font-semibold no-underline-hover"
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
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
      }
    `,
  ],
})
export class App {
  protected readonly title = signal('HeroDevs Package DB - End-of-Life Report');
}
