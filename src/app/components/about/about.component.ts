import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'about',
  styles: [`
  `],
  template: `
	<div class="mdl-grid">
		<div class="mdl-cell mdl-cell--10-col mdl-cell--1-offset">
			<h1>Quienes somos</h1>
			<div>
				<p>
				Que tal? Somos un par de programadores interesados en muchisimas cosas como todos. Queremos con esta pagina dar mejores recomendaciones de parroquias a las cuales atender. Ahorita tomamos solamente en cuenta horarios de misas, pero en el futuro queremos hacer recomendaciones de confessiones, kermeses, y otros eventos catholicos. Si quieren contactarnos favor de mandar un correo a <strong>administrator@misas.io</strong>
				</p>
			</div>
		</div>
	</div>
  `
})
export class AboutComponent {
  localState: any;
  constructor(public route: ActivatedRoute) {

  }
  ngOnInit() {}
}
