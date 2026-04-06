import { Component, Input } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";

@Component({
  selector: 'app-check-marked',
  templateUrl: './check-marked.component.html',
  styleUrls: ['./check-marked.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class CheckMarkedComponent {
  @Input() backgroundColor: 'white' | 'gray' = "white";
  @Input() checkboxId: string = '';

}