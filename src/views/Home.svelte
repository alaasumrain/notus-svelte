<script>
  import { link } from "svelte-routing";
  import Sidebar from "components/Sidebar.svelte";
  import Header from "components/Header.svelte";
  import Footer from "components/Footer.svelte";

  let sanctionsService = { 
    name: 'Sanctions Services', 
    description: 'Comprehensive sanctions screening and compliance solution',
    route: '/admin/dashboard'
  };

  export let location;
</script>

<div class="relative md:ml-64 bg-blueGray-100 min-h-screen">
  <Sidebar {location} />
  <div class="relative w-full">
    <Header title="Home" />
    <div class="px-4 md:px-10 mx-auto w-full">
      <main class="main-content">
        <div class="services-container">
          <h1 class="services-title">Our Microservices</h1>
          <hr class="separator" />
          <div class="services-grid">
            <a href={sanctionsService.route} use:link class="service-card-link">
              <div class="service-card">
                <h2 class="service-name">{sanctionsService.name}</h2>
                <p class="service-description">{sanctionsService.description}</p>
                <div class="service-footer">
                  <span class="status-badge live">Live</span>
                </div>
              </div>
            </a>
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
    display: flex;
    justify-content: center;
  }
  .service-card-link {
    text-decoration: none;
    color: inherit;
    width: 100%;
    max-width: 350px; /* Decreased from 400px */
  }
  .service-card {
    background-color: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease, transform 0.3s ease;
    height: 180px; /* Slightly decreased height */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .service-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-4px);
  }
  .service-name {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  .service-description {
    font-size: 1rem;
    color: #4a5568;
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .service-footer {
    display: flex;
    justify-content: flex-end; /* Aligned to the right */
    align-items: center;
    margin-top: 1rem;
  }
  .status-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  .status-badge.live {
    background-color: #C6F6D5;
    color: #22543D;
  }
</style>