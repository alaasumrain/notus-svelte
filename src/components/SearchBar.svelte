<script>
    import { createEventDispatcher } from 'svelte';
  
    const dispatch = createEventDispatcher();
    let searchTerm = '';
  
    function handleSearch() {
      dispatch('search', searchTerm);
    }
  </script>
  
  <div class="relative">
    <input
      type="text"
      placeholder="Search services..."
      class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      bind:value={searchTerm}
      on:input={handleSearch}
    />
    <div class="absolute left-3 top-2.5">
      <i class="fas fa-search text-gray-400"></i>
    </div>
  </div>