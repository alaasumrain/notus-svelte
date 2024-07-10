<script>
  import { link } from "svelte-routing";
  export let service;
  export let onClick;

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      onClick(service.id);
    }
  }

  let imageLoaded = true;
  function handleImageError(event) {
    console.error(`Failed to load image: ${event.target.src}`);
    imageLoaded = false;
  }

  $: logoUrl = service.logoUrl ? `/assets/logos/${service.logoUrl}` : null;
  $: if (logoUrl) console.log(`Attempting to load logo: ${logoUrl}`);
</script>

<a 
  use:link 
  href={service.route} 
  class="service-card-link"
  on:click={() => onClick(service.id)}
  on:keydown={handleKeyDown}
  tabindex="0"
>
  <div 
    class="service-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col text-center"
    role="button"
  >
    <div class="h-40 w-full rounded-t-lg overflow-hidden flex items-center justify-center p-4">
      {#if logoUrl && imageLoaded}
        <img 
          src={logoUrl} 
          alt={service.name} 
          class="max-h-full max-w-full object-contain"
          on:error={handleImageError}
        />
      {:else}
        <svg class="w-24 h-24 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 7H7V13H13V7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M17 11H11V17H17V11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      {/if}
    </div>
    <div class="flex-grow flex flex-col justify-start p-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-1 truncate">{service.name}</h3>
      <p class="text-sm text-gray-600 mb-2 truncate">{service.category}</p>
      <p class="text-sm text-gray-700 line-clamp-2 mb-2">{service.description}</p>
      <div class="mt-auto">
        <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
          {service.status}
        </span>
      </div>
    </div>
  </div>
</a>

<style>
  .service-card {
    height: 320px;
    transition: transform 0.2s ease-in-out;
  }
  .service-card:hover {
    transform: translateY(-4px);
  }
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  div:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  }
</style>
