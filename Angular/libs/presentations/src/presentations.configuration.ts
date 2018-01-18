import { MenuItem } from '@labdat/data-models';

interface PresentationsConfiguration {
  core: MenuItem[];
}

export const presentationsConfiguration: PresentationsConfiguration = {
  core: [
    {
      order: 4,
      link: '/presentations',
      name: 'Presentations',
      icon: 'hardware:ic_desktop_mac_24px'
    }
  ]
};
