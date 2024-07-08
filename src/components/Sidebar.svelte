<script>
  import { onMount } from 'svelte';
  import { link } from "svelte-routing";
  export let location;

  let openCategories = {};

  function toggleCategory(category) {
    openCategories[category] = !openCategories[category];
  }

  function isLinkActive(path) {
    return location.pathname === path;
  }

  let categories = [
    {
      name: "Microservices",
      icon: "fas fa-server",
      items: [
        { name: "Sanctions Services", path: "/admin/dashboard" },
        // Add more microservices here
      ]
    },
    {
      name: "Department A",
      icon: "fas fa-building",
      items: [
        { name: "Service 1", path: "/admin/dept-a/service-1" },
        { name: "Service 2", path: "/admin/dept-a/service-2" },
      ]
    },
    // Add more categories/departments here
  ];

  onMount(() => {
    categories.forEach(category => {
      if (category.items.some(item => location.pathname.startsWith(item.path))) {
        openCategories[category.name] = true;
      }
    });
  });
</script>

<nav class="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto shadow-xl bg-white flex flex-col items-start justify-start w-64 z-10 py-4 px-6">
  <div class="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-col items-start justify-start w-full mx-auto">
    <a use:link class="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm font-bold p-4 px-0" href="/">
      Reconciliation Services
    </a>
    <div class="md:flex-col md:min-w-full flex flex-col list-none">
      <a use:link 
         href="/"
         class="sidebar-link {isLinkActive('/') ? 'active' : ''}">
        <i class="fas fa-home mr-2 text-sm"></i>
        Home
      </a>
      {#each categories as category}
        <div class="relative">
          <button 
            class="sidebar-link flex items-center w-full text-left" 
            on:click={() => toggleCategory(category.name)}
          >
            <i class="{category.icon} mr-2 text-sm"></i>
            {category.name}
            <i class="fas fa-chevron-{openCategories[category.name] ? 'up' : 'down'} ml-auto"></i>
          </button>
          {#if openCategories[category.name]}
            <div class="ml-4">
              {#each category.items as item}
                <a use:link 
                   href={item.path}
                   class="sidebar-link {isLinkActive(item.path) ? 'active active-microservice' : ''}">
                  <i class="fas fa-circle-notch mr-2 text-xs"></i>
                  {item.name}
                </a>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</nav>


<style>
  nav {
    width: 16rem; /* Fixed width for the sidebar */
  }
  .relative .ml-4 {
    margin-left: 1rem;
  }
  .sidebar-link {
    display: flex;
    align-items: center;
    padding: 0.75rem 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: #4a5568;
    transition: color 0.2s ease-in-out;
  }
  .sidebar-link:hover {
    color: #2d3748;
  }
  .sidebar-link.active {
    color: #e53e3e;
  }
  .active-microservice {
    background-color: rgba(59, 130, 246, 0.1);
    border-left: 3px solid #3b82f6;
    padding-left: 0.5rem;
  }
  button.sidebar-link {
    background: none;
    border: none;
    cursor: pointer;
    width: 100%;
    text-align: left;
  }
</style>