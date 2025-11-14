import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

export interface Vulnerability {
  cve: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  score: number;
}

export interface Version {
  version: string;
  status: 'current' | 'maintenance' | 'end-of-life' | 'deprecated';
  releaseDate: string;
  heroDevsSupported: boolean;
  vulnerabilities: Vulnerability[];
}

export interface Package {
  name: string;
  versions: Version[];
}

export interface Ecosystem {
  ecosystem: string;
  packages: Package[];
}

export type EcosystemData = Ecosystem[];

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http = inject(HttpClient);

  // Load data from JSON file
  private ecosystemData$ = this.http.get<EcosystemData>('/data.json');

  // Convert to signal
  data = toSignal(this.ecosystemData$, { initialValue: [] as EcosystemData });

  // Computed ecosystem summary with vulnerability counts
  ecosystemSummary = computed(() => {
    return this.data().map((ecosystem) => {
      const totalVulnerabilities = ecosystem.packages.reduce((total, pkg) => {
        return (
          total +
          pkg.versions.reduce((vTotal, version) => {
            return vTotal + version.vulnerabilities.length;
          }, 0)
        );
      }, 0);

      const vulnerabilitiesBySeverity = ecosystem.packages.reduce((counts, pkg) => {
        pkg.versions.forEach((version) => {
          version.vulnerabilities.forEach((vuln) => {
            counts[vuln.severity] = (counts[vuln.severity] || 0) + 1;
          });
        });
        return counts;
      }, {} as Record<string, number>);

      const packageCount = ecosystem.packages.length;
      const eolPackageCount = ecosystem.packages.filter((pkg) =>
        pkg.versions.some((version) => version.status === 'end-of-life')
      ).length;

      const heroDevsPackageCount = ecosystem.packages.filter((pkg) =>
        pkg.versions.some((version) => version.heroDevsSupported)
      ).length;

      return {
        ecosystem: ecosystem.ecosystem,
        packageCount,
        eolPackageCount,
        heroDevsPackageCount,
        totalVulnerabilities,
        vulnerabilitiesBySeverity,
      };
    });
  });

  // Get ecosystem by name
  getEcosystem(name: string) {
    return computed(() => this.data().find((eco) => eco.ecosystem === name));
  }

  // Get package by ecosystem and name
  getPackage(ecosystemName: string, packageName: string) {
    return computed(() => {
      const ecosystem = this.data().find((eco) => eco.ecosystem === ecosystemName);
      return ecosystem?.packages.find((pkg) => pkg.name === packageName);
    });
  }

  // Get packages for an ecosystem with computed summaries
  getEcosystemPackages(ecosystemName: string) {
    return computed(() => {
      const ecosystem = this.data().find((eco) => eco.ecosystem === ecosystemName);
      if (!ecosystem) return [];

      return ecosystem.packages.map((pkg) => {
        const latestVersion = pkg.versions[0]; // Assuming first is latest
        const eolVersions = pkg.versions.filter((v) => v.status === 'end-of-life');
        const hasHeroDevsSupport = pkg.versions.some((v) => v.heroDevsSupported);

        const totalVulnerabilities = pkg.versions.reduce((total, version) => {
          return total + version.vulnerabilities.length;
        }, 0);

        const maxSeverityScore = pkg.versions.reduce((max, version) => {
          const versionMax = version.vulnerabilities.reduce((vMax, vuln) => {
            return Math.max(vMax, vuln.score);
          }, 0);
          return Math.max(max, versionMax);
        }, 0);

        const vulnerabilitiesBySeverity = pkg.versions.reduce((counts, version) => {
          version.vulnerabilities.forEach((vuln) => {
            counts[vuln.severity] = (counts[vuln.severity] || 0) + 1;
          });
          return counts;
        }, {} as Record<string, number>);

        return {
          name: pkg.name,
          latestVersion: latestVersion?.version || 'Unknown',
          status: latestVersion?.status || 'unknown',
          eolVersionCount: eolVersions.length,
          hasHeroDevsSupport,
          totalVulnerabilities,
          maxSeverityScore,
          vulnerabilitiesBySeverity,
          versions: pkg.versions,
        };
      });
    });
  }
}
