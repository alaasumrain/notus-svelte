<script>
  import { link } from "svelte-routing";
  import Sidebar from "components/Sidebar.svelte";
  import Header from "components/Header.svelte";
  import Footer from "components/Footer.svelte";
  import ServiceCard from 'components/Cards/ServiceCard.svelte';

  let services = [
    { 
      id: 1, 
      name: 'CliQ - Files Merge to Excel', 
      category: 'Category A', 
      description: 'Merge various files into a single Excel sheet',
      logoUrl: 'extract.png',
      status: 'Finished',
      route: '/admin/microservices/files-merge'
    },
    { 
      id: 2, 
      name: 'CliQ - System Files Reconciliation', 
      category: 'Category B', 
      description: 'Reconcile system files for consistency and accuracy',
      logoUrl: 'reconcile.png',
      status: 'In progress',
      route: '/admin/microservices/files-reconciliation'
    },
    // ... add more services as needed
  ];

  export let location;

  function handleCardClick(serviceId) {
    console.log('Service clicked:', serviceId);
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
          <p class="text-center text-gray-600 mb-8">Explore our range of data processing and management tools</p>
          <div class="services-grid">
            {#each services as service}
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
    padding: 4rem 0; /* Increased padding for better spacing */
    margin-top: 6rem; /* Adjusted based on your header height */
    padding: 4rem 2rem; /* Additional padding for a richer feel */
  }
  .services-container {
    background-color: white;
    border-radius: 0.5rem;
    padding: 3rem; /* Increased padding */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .services-title {
    font-size: 2rem; /* Increased font size for title */
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
    gap: 2rem; /* Increased gap */
    justify-content: center;
  }
</style>
