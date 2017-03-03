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

  ngOnInit() {
    this.route
      .data
      .subscribe((data: any) => {
        // your resolved data from route
        this.localState = data.yourData;
      });

    console.log('hello `About` component');
    // static data that is bundled
    // var mockData = require('assets/mock-data/mock-data.json');
    // console.log('mockData', mockData);
    // if you're working with mock data you can also use http.get('assets/mock-data/mock-data.json')
    this.asyncDataWithWebpack();
  }
  asyncDataWithWebpack() {
    // you can also async load mock data with 'es6-promise-loader'
    // you would do this if you don't want the mock-data bundled
    // remember that 'es6-promise-loader' is a promise
    setTimeout(() => {

      System.import('../../../assets/mock-data/mock-data.json')
        .then(json => {
          console.log('async mockData', json);
          this.localState = json;
        });

    });
  }

}
