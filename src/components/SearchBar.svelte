<script>
    import { createEventDispatcher } from 'svelte';
    import { debounce } from 'lodash-es';
  
    const dispatch = createEventDispatcher();
    let searchTerm = '';
  
    const debouncedSearch = debounce((term) => {
      dispatch('search', term);
    }, 300);
  
    function handleSearch() {
      if (searchTerm.trim() === '') {
        dispatch('search', '');
      } else {
        debouncedSearch(searchTerm);
      }
    }
  
    function handleClear() {
      searchTerm = '';
      dispatch('search', '');
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
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
      </svg>
    </div>
    {#if searchTerm}
      <button
        type="button"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
        on:click={handleClear}
      >
        <svg class="h-5 w-5 text-gray-400 hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    {/if}
  </div>