<script>
  import { Router, Route } from "svelte-routing";
  import Home from "./views/Home.svelte";
  import Admin from "./layouts/Admin.svelte";
  import ExtractionService from "./views/microservices/ExtractionService.svelte";
  export let url = "";
</script>

<div class="app-wrapper">
  <Router {url}>
    <Route path="/" component={Home} />
    <Route path="/admin/*" component={Admin} />
    <Route path="/admin/microservices/extraction" component={ExtractionService} />
  </Router>
</div>

<style>
  :global(html, body) {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  :global(body) {
    transform: scale(0.85);
    transform-origin: top left;
    width: 117.65%; /* 100 / 0.85 */
    height: 117.65%; /* 100 / 0.85 */
  }

  :global(#svelte) {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .app-wrapper {
    min-height: 100%;
  }
</style>
