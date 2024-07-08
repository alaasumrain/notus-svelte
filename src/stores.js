import { writable } from 'svelte/store';

export const services = writable([
  { 
    id: 1, 
    name: 'CliQ - Files Merge to Excel', 
    category: 'Category A', 
    description: 'Merge various files into a single Excel sheet',
    logoUrl: 'extract.png',
    status: 'Live',
    route: '/admin/microservices/files-merge',
    tags: ['excel', 'merge', 'files']
  },
  { 
    id: 2, 
    name: 'CliQ - System Files Reconciliation', 
    category: 'Category B', 
    description: 'Reconcile system files for consistency and accuracy',
    logoUrl: 'reconcile.png',
    status: 'Live',
    route: '/admin/microservices/files-reconciliation',
    tags: ['reconciliation', 'files', 'system']
  },
]);

export const pageTitle = writable('Sanctions Services');

export function updatePageTitle(title) {
  pageTitle.set(title);
}

export function filterServices(searchTerm) {
  return services.update(svcs => 
    svcs.filter(service => 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );
}