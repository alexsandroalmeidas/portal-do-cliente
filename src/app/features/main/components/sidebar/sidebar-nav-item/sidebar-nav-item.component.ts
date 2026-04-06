import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { filter, map, Subject, takeUntil } from 'rxjs';
import { NavigationItem } from './../../../../../shared/models/main.models';
import { SharedModule } from './../../../../../shared/shared.module';

@Component({
  selector: 'app-sidebar-nav-item',
  templateUrl: './sidebar-nav-item.component.html',
  styleUrls: ['./sidebar-nav-item.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class SidebarItemComponent implements OnInit, OnDestroy {

  bsModalRef!: BsModalRef;

  private $destroy = new Subject<void>();

  expanded = false;

  @Input() item?: NavigationItem;
  @Output() expand = new EventEmitter<NavigationItem>();

  get path() {
    return this.item?.path;
  }

  get hasPermission() {
    return this.item?.hasPermission;
  }

  get icon() {
    return this.item?.icon;
  }

  get label() {
    return this.item?.label;
  }

  get children() {
    return (this.item?.children || []);
  }

  constructor(
    private router: Router,
    private modalService: BsModalService) {

    router.events
      .pipe(
        takeUntil(this.$destroy),
        filter(event => event instanceof NavigationEnd),
        map(event => event as NavigationEnd)
      )
      .subscribe((event) => {
        this.expanded = this.children.some(c => c.hasPermission && !!c.path && event.url.includes(c.path));
      });

  }

  ngOnInit(): void {
    this.expanded = this.children.some(c => c.hasPermission && !!c.path && this.router.url.includes(c.path));
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

  toggleExpanded() {
    this.expanded = !this.expanded;

    if (this.expanded) {
      this.expand.emit(this.item);
    }
  }

  hasChildren() {
    return this.children?.length;
  }
}
