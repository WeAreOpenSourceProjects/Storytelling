import { MenuItem } from '@labdat/data-models';

interface PresentationsConfiguration {
  core: { sidenav: Array<MenuItem> };
}

export const presentationsConfiguration: PresentationsConfiguration = {
  core: {
    sidenav: [{
      order: 4,
      link: '/presentations',
      name: 'Presentations',
      icon: 'hardware:ic_desktop_mac_24px'
    }]
  }
}
