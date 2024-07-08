<script>
  import { Router, Route } from "svelte-routing";
  import Home from "./views/Home.svelte"; // Import the new Home component
  import Admin from "./layouts/Admin.svelte"; // Import the Admin layout

  export let url = "";
</script>

<Router {url}>
  <!-- Home route -->
  <Route path="/" component={Home} />

  <!-- Admin layout -->
  <Route path="admin/*" component={Admin} />
</Router>
