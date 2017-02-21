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
      animate('150ms ease-in')
    ]),
    transition('* => void', [
      animate('150ms ease-out', style({transform: 'translateY(-200%)'}))
    ])
  ]),
  trigger('flyInLeft', [
    state('in', style({transform: 'translateX(0)'})),
    transition('void => *', [
      style({transform: 'translateX(-100%)'}),
      animate('150ms ease-in')
    ]),
    transition('* => void', [
      animate('150ms ease-out', style({transform: 'translateX(-100%)'}))
    ])
  ])
]
