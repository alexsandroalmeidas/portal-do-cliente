import { FormControl } from '@angular/forms';

export interface NotificationPermissionForm {
  enabled: FormControl<boolean | null>;
}
