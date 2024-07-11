<script>
  import { onMount } from 'svelte';
  import { link } from 'svelte-routing';

  let openCategories = {};
  let selectedItem = '';
  let currentPath = '';

  function toggleCategory(category) {
    openCategories[category] = !openCategories[category];
    // Ensure only one category is open at a time
    for (const key in openCategories) {
      if (key !== category) {
        openCategories[key] = false;
      }
    }
  }

  let categories = [
    {
      name: "Home",
      icon: "fas fa-home",
      path: "/",
    },
    {
      name: "Microservices",
      icon: "fas fa-server",
      items: [
        { name: "CliQ Sessions Combiner", path: "/admin/microservices/cliq-sessions-combiner" },
        { name: "CliQ Reconciliation", path: "/admin/microservices/cliq-reconciliation" },
      ]
    },
    {
      name: "Departments",
      icon: "fas fa-building",
      items: [
        { name: "Sanctions Services", path: "/admin/dashboard" },
      ]
    },
  ];

  onMount(() => {
    currentPath = window.location.pathname;
    updateSelectedItem(currentPath);
  });

  function updateSelectedItem(path) {
    selectedItem = path;
    categories.forEach(category => {
      if (category.items) {
        if (category.items.some(item => item.path === path)) {
          openCategories[category.name] = true;
        }
      }
    });
  }

  function isActive(path) {
    if (path === '/') {
      return currentPath === '/' || currentPath === '';
    }
    return currentPath.startsWith(path);
  }

  $: {
    if (typeof window !== 'undefined') {
      currentPath = window.location.pathname;
      updateSelectedItem(currentPath);
    }
  }
</script>

<nav class="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto shadow-xl bg-white flex flex-col items-start justify-start w-64 z-10 py-4 px-6">
  <div class="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-col items-start justify-start w-full mx-auto">
    <a use:link class="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm font-bold p-4 px-0" href="/">
      Reconciliation Services
    </a>
    <div class="md:flex-col md:min-w-full flex flex-col list-none">
      {#each categories as category}
        <div class="relative">
          {#if !category.items}
            <a use:link
               href={category.path}
               class="sidebar-link {isActive(category.path) ? 'active' : ''}">
              <i class="{category.icon} mr-2 text-sm"></i>
              {category.name}
            </a>
          {:else}
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
                     class="sidebar-link {isActive(item.path) ? 'active' : ''}">
                    <i class="fas fa-circle-notch mr-2 text-xs"></i>
                    {item.name}
                  </a>
                {/each}
              </div>
            {/if}
          {/if}
        </div>
      {/each}
    </div>
  </div>
</nav>

<style>
  nav {
    width: 16rem;
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
    transition: all 0.2s ease-in-out;
  }
  .sidebar-link:hover {
    color: #2d3748;
    background-color: rgba(59, 130, 246, 0.1);
  }
  .sidebar-link.active {
    color: #3b82f6;
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