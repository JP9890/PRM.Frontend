import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Allocation, AllocationService } from '../../services/allocation.service';

@Component({
  selector: 'app-allocation-list',
  templateUrl: './allocation-list.component.html',
  styleUrls: ['./allocation-list.component.css']
})
export class AllocationListComponent implements OnInit {
  allocations: Allocation[] = [];
  isLoading = false;
  filterEmployeeId?: number;
  filterProjectId?: number;

  constructor(private allocationService: AllocationService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadAllocations();
  }

  loadAllocations(): void {
    this.isLoading = true;
    this.allocationService.getAll(this.filterEmployeeId, this.filterProjectId).subscribe({
      next: (data) => {
        this.allocations = data;
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to load allocations');
        this.isLoading = false;
      }
    });
  }
}
