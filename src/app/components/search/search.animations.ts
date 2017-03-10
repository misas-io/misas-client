import { 
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';

export const SearchAnimations: Array<any> = [
  trigger('flyInUp', [
    state('in', style({transform: 'translateX(0)'})),
    transition('void => *', [
      style({transform: 'translateY(-200%)'}),
      animate('500ms ease-in')
    ]),
    transition('* => void', [
      animate('500ms ease-out', style({transform: 'translateY(-200%)'}))
    ])
  ]),
  trigger('flyInLeft', [
    state('in', style({transform: 'translateX(0)'})),
    transition('void => *', [
      style({transform: 'translateX(-100%)'}),
      animate('500ms ease-in')
    ]),
    transition('* => void', [
      animate('500ms ease-out', style({transform: 'translateX(-100%)'}))
    ])
  ]),
  trigger('appear', [
    //state('i' , style({ opacity: 1 })),
    //state('hidden', style({ opacity: 0 })),
    transition('void => *', [
      style({ opacity: 0 }),
      animate('1000ms', style({opacity:1})),
    ]),
    transition('* => void', [
      style({ opacity: 1 }),
      animate('100ms', style({opacity:0})),
    ]),
  ])
]
