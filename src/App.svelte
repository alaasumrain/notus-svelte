<script>
  import { Router, Route } from "svelte-routing";
  import Home from "./views/Home.svelte";
  import Admin from "./layouts/Admin.svelte";

  export let url = "";
</script>

<Router {url}>
  <Route path="/" component={Home} />
  <Route path="admin/*" component={Admin} />
</Router>