<script>
  import { Router, Route } from "svelte-routing";
  import Home from "./views/Home.svelte";
  import Admin from "./layouts/Admin.svelte";
  import CliQSessionsCombiner from "./views/microservices/CliQSessionsCombiner.svelte";
  import CliQReconciliation from "./views/microservices/CliQReconciliation.svelte";
  
  export let url = "";

  console.log('App started with URL:', url);
</script>

<div class="app-wrapper">
  <Router {url}>
    <Route path="/" component={Home} />
    <Route path="/admin/*" component={Admin} />
    <Route path="/admin/microservices/cliq-sessions-combiner" component={CliQSessionsCombiner} />
    <Route path="/admin/microservices/cliq-reconciliation" component={CliQReconciliation} />
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
