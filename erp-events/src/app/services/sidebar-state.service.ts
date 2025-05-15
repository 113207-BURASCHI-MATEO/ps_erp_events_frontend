import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarStateService {
  private isExpandedSubject = new BehaviorSubject<boolean>(true);
  isExpanded$ = this.isExpandedSubject.asObservable();

  toggle(): void {
    this.isExpandedSubject.next(!this.isExpandedSubject.value);
  }

  expand(): void {
    this.isExpandedSubject.next(true);
  }

  collapse(): void {
    this.isExpandedSubject.next(false);
  }

  isExpanded(): boolean {
    return this.isExpandedSubject.value;
  }
}
