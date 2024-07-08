<script>
  import { Router, Route } from "svelte-routing";
  import Sidebar from "components/Sidebar.svelte";
  import AdminNavbar from "components/Navbars/AdminNavbar.svelte";
  import Footer from "components/Footer.svelte";
  import Header from "components/Header.svelte";
  import Dashboard from "views/admin/Dashboard.svelte";

  export let location;
</script>

<div class="relative flex min-h-screen bg-blueGray-100">
  <Sidebar {location} />
  <div class="flex-1 flex flex-col">
    <AdminNavbar />
    <Header title="Dashboard" />
    <div class="px-4 md:px-10 mx-auto w-full flex-grow">
      <Router>
        <Route path="/dashboard" component={Dashboard} />
        <!-- Add other admin routes here if needed -->
      </Router>
    </div>
    <Footer />
  </div>
</div>

<style>
  .main-content-wrapper {
    background-color: #F7FAFC; /* Ensure this matches your desired background color */
  }
</style>
