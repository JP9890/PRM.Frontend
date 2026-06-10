import { Component, OnInit } from '@angular/core';
import { TimesheetService, Timesheet } from '../../timesheet.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-team-timesheets',
  templateUrl: './team-timesheets.component.html',
  styleUrls: ['./team-timesheets.component.css']
})
export class TeamTimesheetsComponent implements OnInit {
  timesheets: Timesheet[] = [];
  loading = false;
  error = '';
  weekStart: string = '';

  constructor(private timesheetService: TimesheetService, private authService: AuthService) {
    // default to current week's monday
    const today = new Date();
    const day = today.getDay() || 7; // Get current day number, converting Sun. to 7
    if (day !== 1) {
      today.setHours(-24 * (day - 1)); // Set to Monday
    }
    this.weekStart = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadTimesheets();
  }

  loadTimesheets(): void {
    const user = this.authService.currentUserValue;
    if (user && user.id) {
      this.loading = true;
      this.timesheetService.getTeamTimesheets(user.id, this.weekStart).subscribe({
        next: (data) => {
          this.timesheets = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load team timesheets.';
          this.loading = false;
        }
      });
    }
  }

  onWeekChange(): void {
    this.loadTimesheets();
  }
}
