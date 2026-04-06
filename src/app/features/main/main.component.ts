import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  standalone: true,
  selector: 'app-main',
  imports: [NavbarComponent, SidebarComponent, SharedModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnDestroy {
  private $unsub = new Subject();

  get showMenu() {
    return !this.isPasswordRecovery;
  }

  get isPasswordRecovery() {
    return window.location.pathname === '/passwordrecovery';
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }
}
