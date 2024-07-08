<script>
  export let title = "Reconciliation Services";
</script>

<header class="header-container">
  <div class="header-content">
    <h1 class="header-title">{title}</h1>
    <!-- Add any additional header elements here -->
  </div>
</header>

<style>
  .header-container {
    background-color: #015093;
    padding: 2rem 2rem;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
  
  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .header-title {
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
  }
  @media (min-width: 768px) {
    .header-container {
      left: 16rem; /* Adjust based on your sidebar width */
    }
  }
</style>