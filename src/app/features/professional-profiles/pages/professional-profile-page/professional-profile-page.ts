import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmptyState } from '../../../../shared/components/empty-state';

@Component({
  selector: 'app-professional-profile-page',
  imports: [RouterLink, EmptyState],
  templateUrl: './professional-profile-page.html',
  styleUrl: './professional-profile-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessionalProfilePage {
  readonly employeeId = input<string>();
  protected readonly activeTab = signal<'profile' | 'documents'>('profile');

  protected selectTab(tab: 'profile' | 'documents'): void {
    this.activeTab.set(tab);
  }
}
