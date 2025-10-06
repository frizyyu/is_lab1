import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TuiLoader } from '@taiga-ui/core';

@Component({
  selector: 'app-loader',
  imports: [TuiLoader],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  readonly showLoader = input<boolean>(true);
}
