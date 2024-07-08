<script>
  import { onMount } from 'svelte';

  onMount(() => {
    document.getElementById('year').textContent = new Date().getFullYear();
  });
</script>

<footer class="bg-gray-100 py-3 absolute bottom-0 left-0 right-0">
  <div class="container mx-auto px-4">
    <hr class="mb-3 border-gray-300" />
    <div class="flex flex-wrap items-center md:justify-between justify-center">
      <div class="w-full md:w-4/12 px-4 mx-auto text-center">
        <div class="text-sm text-gray-600 font-semibold py-1">
          Copyright © <span id="year"></span> AI & Data Science Team
        </div>
      </div>
      <div class="w-full md:w-8/12 px-4 mx-auto">
        <ul class="flex flex-wrap list-none md:justify-end justify-center">
          <li>
            <a href="#report-problem" class="text-gray-600 hover:text-gray-800 text-sm font-semibold block py-1 px-3">Report a problem</a>
          </li>
          <li>
            <a href="#provide-suggestion" class="text-gray-600 hover:text-gray-800 text-sm font-semibold block py-1 px-3">Provide a suggestion</a>
          </li>
          <li>
            <a href="#contact-us" class="text-gray-600 hover:text-gray-800 text-sm font-semibold block py-1 px-3">Contact Us</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</footer>

<style>
  footer {
    height: 60px; /* Adjust this value if needed */
  }
</style>