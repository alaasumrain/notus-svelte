<script>
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
  
  <div 
    class="service-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col text-center"
    role="button"
    style="height: 320px;" 
    on:click={() => onClick(service.id)}
    on:keydown={handleKeyDown}
    tabindex="0"
  >
    <div class="h-48 w-full rounded-t-lg overflow-hidden flex items-center justify-center">
      <div class="w-full h-full flex items-center justify-center" style="max-width: 216px; max-height: 160px;">
        {#if logoUrl && imageLoaded}
          <img 
            src={logoUrl} 
            alt={service.name} 
            class="w-full h-full object-contain"
            on:error={handleImageError}
          />
        {:else}
          <svg class="w-full h-full text-gray-400" viewBox="0 0 863 639" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor">
            <rect width="863" height="639" fill="currentColor" opacity="0.2"/>
            <path d="M431.5 319.5m-100 0a100 100 0 1 0 200 0a100 100 0 1 0 -200 0" fill="currentColor"/>
            <path d="M431.5 249.5v140m-70-70h140" stroke="white" stroke-width="20"/>
          </svg>
        {/if}
      </div>
    </div>
    <div class="flex-grow flex flex-col justify-start pt-2 px-4">
      <h3 class="text-lg font-semibold text-blueGray-700 mb-1 truncate">{service.name}</h3>
      <p class="text-sm text-blueGray-500 mb-1 truncate">{service.category}</p>
      <p class="text-sm text-blueGray-600 line-clamp-2">{service.description}</p>
    </div>
  </div>
  
  <style>
    .service-card {
      background-color: white;
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
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.6); /* Tailwind CSS focus ring color */
    }
  </style>
  