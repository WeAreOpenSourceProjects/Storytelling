import { trigger, state, animate, style, transition } from '@angular/animations';

export function slideTransition() {
  return trigger('routerTransition', [
    state(
      'void',
      style({
        //position:'fixed',
        width: '100%'
      })
    ),
    state(
      '*',
      style({
        //position:'fixed',
        width: '100%'
      })
    ),

    transition('* => 1', [
      style({ transform: 'translateX(100%)' }),
      animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
    ]),
    transition('* => -1', [
      style({ transform: 'translateX(-100%)' }),
      animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
    ])
  ]);
}
