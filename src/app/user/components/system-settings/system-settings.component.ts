import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SettingsService, SystemSettings } from '../../services/settings.service';

@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.css']
})
export class SystemSettingsComponent implements OnInit {
  settings: SystemSettings | null = null;
  isLoading = false;
  newApiKey = '';
  selectedProvider = 'Gemini';
  schedulerHours = 4;
  maxWeeklyHours = 40;

  constructor(private settingsService: SettingsService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.isLoading = true;
    this.settingsService.getSettings().subscribe({
      next: (s) => {
        this.settings = s;
        this.selectedProvider = s.llmProvider;
        this.schedulerHours = s.schedulerIntervalHours;
        this.maxWeeklyHours = s.maxWeeklyHours;
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to load settings');
        this.isLoading = false;
      }
    });
  }

  saveApiKey(): void {
    this.settingsService.updateLlmApiKey(this.newApiKey).subscribe({
      next: () => {
        this.toastr.success('API key updated');
        this.newApiKey = '';
        this.loadSettings();
      },
      error: (err) => this.toastr.error(err.error?.message || 'Update failed')
    });
  }

  saveProvider(): void {
    this.settingsService.updateLlmProvider(this.selectedProvider).subscribe({
      next: () => {
        this.toastr.success('Provider updated');
        this.loadSettings();
      },
      error: (err) => this.toastr.error(err.error?.message || 'Update failed')
    });
  }

  saveScheduler(): void {
    this.settingsService.updateSchedulerInterval(this.schedulerHours).subscribe({
      next: () => {
        this.toastr.success('Scheduler interval updated');
        this.loadSettings();
      },
      error: (err) => this.toastr.error(err.error?.message || 'Update failed')
    });
  }

  saveMaxHours(): void {
    this.settingsService.updateMaxWeeklyHours(this.maxWeeklyHours).subscribe({
      next: () => {
        this.toastr.success('Max weekly hours updated');
        this.loadSettings();
      },
      error: (err) => this.toastr.error(err.error?.message || 'Update failed')
    });
  }
}
