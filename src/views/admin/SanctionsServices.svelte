<script>
  import { link } from "svelte-routing";
  import Sidebar from "components/Sidebar.svelte";
  import Header from "components/Header.svelte";
  import Footer from "components/Footer.svelte";
  import ServiceCard from 'components/Cards/ServiceCard.svelte';
  import SearchBar from 'components/SearchBar.svelte';

  let services = [
    { 
      id: 1, 
      name: 'CliQ Sessions Combiner', 
      category: 'Category A', 
      description: 'Merge various files into a single Excel sheet',
      logoUrl: 'extract.png',
      status: 'Live',
      route: '/admin/microservices/extraction',
      tags: ['excel', 'merge', 'files']
    },
    { 
      id: 2, 
      name: 'System Files Reconciliation', 
      category: 'Category B', 
      description: 'Reconcile system files for consistency and accuracy',
      logoUrl: 'reconcile.png',
      status: 'Live',
      route: '/admin/microservices/reconciliation',
      tags: ['reconciliation', 'files', 'system']
    },
    // ... add more services as needed
  ];

  export let location;

  function handleCardClick(serviceId) {
    console.log('Service clicked:', serviceId);
    // Add navigation logic here
  }

  function handleSearch(event) {
    const searchTerm = event.detail.toLowerCase();
    services = services.filter(service => 
      service.name.toLowerCase().includes(searchTerm) ||
      service.description.toLowerCase().includes(searchTerm) ||
      service.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
</script>

<div class="relative md:ml-64 bg-blueGray-100 min-h-screen">
  <Sidebar {location} />
  <div class="relative w-full">
    <Header title="Sanctions Services" />
    <div class="px-4 md:px-10 mx-auto w-full">
      <main class="main-content">
        <div class="services-container">
          <h1 class="services-title">Our Microservices</h1>
          <hr class="separator" />
          <div class="mb-6">
            <SearchBar on:search={handleSearch} />
          </div>
          <div class="services-grid">
            {#each services as service (service.id)}
              <ServiceCard {service} on:click={() => handleCardClick(service.id)} />
            {/each}
          </div>
        </div>
      </main>
    </div>
    <Footer />
  </div>
</div>

<style>
  .main-content {
    padding: 2rem 0;
    margin-top: 4rem;
    padding: 4rem 2rem;
  }
  .services-container {
    background-color: white;
    border-radius: 0.5rem;
    padding: 3rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .services-title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  .separator {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 1rem 0 2rem;
  }
  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    justify-content: center;
  }
</style>
