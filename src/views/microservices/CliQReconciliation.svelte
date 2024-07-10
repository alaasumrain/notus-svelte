<script>
  import { onMount, onDestroy } from 'svelte';
  import Sidebar from "components/Sidebar.svelte";
  import Header from "components/Header.svelte";
  import Footer from "components/Footer.svelte";

  console.log('Imports completed');

  export let location;
  console.log('Location prop:', location);

  let abFiles = [];
  let cliqFiles = [];
  let processingStatus = "idle"; // idle, processing, complete, error
  let results = null;
  let progress = 0;
  let logs = [];
  let intervalId;
  let logBox;
  let abPreview = null;
  let cliqPreview = null;

  onMount(() => {
    console.log('Component mounted');
    intervalId = setInterval(checkProgress, 1000);
    console.log('Progress check interval set');
  });

  onDestroy(() => {
    console.log('Component being destroyed');
    clearInterval(intervalId);
    console.log('Progress check interval cleared');
  });

  async function handleABFileSelect(event) {
    console.log('AB file selection started');
    try {
      const selectedFiles = Array.from(event.target.files);
      abFiles = selectedFiles.filter(file => file.name.endsWith('.csv') || file.name.endsWith('.xlsx'));
      console.log('AB files filtered:', abFiles);
      // You can add any preview logic if needed
      results = null;
    } catch (error) {
      console.error('Error in handleABFileSelect:', error);
    }
  }

  async function handleCliQFileSelect(event) {
    console.log('CliQ file selection started');
    try {
      const selectedFiles = Array.from(event.target.files);
      cliqFiles = selectedFiles.filter(file => file.name.endsWith('.csv') || file.name.endsWith('.xlsx'));
      console.log('CliQ files filtered:', cliqFiles);
      // You can add any preview logic if needed
      results = null;
    } catch (error) {
      console.error('Error in handleCliQFileSelect:', error);
    }
  }

  async function processFiles() {
    console.log('File processing started');
    if (abFiles.length === 0 || cliqFiles.length === 0) {
      console.log('No files selected');
      alert("Please select both AB File and CliQ File to process.");
      return;
    }

    processingStatus = "processing";
    progress = 0;
    logs = [];
    const formData = new FormData();
    abFiles.forEach((file, index) => {
      formData.append('ab_files', file);
      console.log(`Appended AB file: ${file.name}`);
    });
    cliqFiles.forEach((file, index) => {
      formData.append('cliq_files', file);
      console.log(`Appended CliQ file: ${file.name}`);
    });

    try {
      console.log('Sending fetch request...');
      const response = await fetch('http://localhost:8000/api/process_cliq_reconciliation/', {
        method: 'POST',
        body: formData,
      });

      console.log('Fetch response status:', response.status);
      if (!response.ok) throw new Error('Processing failed');

      const blob = await response.blob();
      console.log('Response blob received');
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "reconciliation_results.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      console.log('Download initiated');

      processingStatus = "complete";
      results = "Files reconciled successfully!";
      console.log('Processing completed successfully');
    } catch (error) {
      console.error('Error in processFiles:', error);
      processingStatus = "error";
      results = "Error processing files.";
    }
  }

  async function checkProgress() {
    if (processingStatus === "processing") {
      console.log('Checking progress...');
      try {
        const response = await fetch('http://localhost:8000/api/progress_reconciliation/');
        if (response.ok) {
          const data = await response.json();
          console.log('Progress data:', data);
          progress = data.progress;
          logs = data.logs;
          if (logBox) {
            logBox.scrollTop = logBox.scrollHeight;
          }
        } else {
          console.log('Progress check failed:', response.status);
        }
      } catch (error) {
        console.error('Error in checkProgress:', error);
      }
    }
  }

  console.log('CliQReconciliation component script completed');
</script>

<div class="relative md:ml-64 bg-gray-100 min-h-screen">
  <Sidebar {location} />
  <div class="relative w-full">
    <Header title="CliQ Reconciliation" />
    <div class="px-8 py-6 mx-auto w-full max-w-7xl">
      <main class="main-content">
        <div class="bg-white shadow-lg rounded-lg p-8 mb-8">
          <h1 class="text-4xl font-bold mb-8 text-gray-800">CliQ Reconciliation</h1>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 class="text-2xl font-semibold mb-4 text-gray-700">Browse AB File</h2>
              <input 
                type="file" 
                on:change={handleABFileSelect} 
                class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
              <!-- Add preview logic here if needed -->
            </div>
            <div>
              <h2 class="text-2xl font-semibold mb-4 text-gray-700">Browse CliQ File</h2>
              <input 
                type="file" 
                on:change={handleCliQFileSelect} 
                class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
              <!-- Add preview logic here if needed -->
            </div>
          </div>
          <div class="mt-8">
            <button 
              on:click={processFiles}
              disabled={abFiles.length === 0 || cliqFiles.length === 0 || processingStatus === "processing"}
              class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 text-lg font-semibold"
            >
              {processingStatus === "processing" ? "Processing..." : "Process Files"}
            </button>
          </div>

          {#if processingStatus === "processing"}
            <div class="mt-8">
              <h3 class="text-xl font-semibold mb-4 text-gray-700">Processing Progress:</h3>
              <div class="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div class="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-in-out" style="width: {progress}%"></div>
              </div>
              <p class="text-gray-600 text-lg">{progress}% Complete</p>
            </div>
          {/if}

          <div class="mt-8">
            <h3 class="text-xl font-semibold mb-4 text-gray-700">Processing Logs:</h3>
            <div 
              bind:this={logBox}
              class="log-container"
            >
              {#each logs as log}
                <p class="log-entry">{log}</p>
              {/each}
            </div>
          </div>

          {#if results}
            <div class="mt-8">
              <h3 class="text-xl font-semibold mb-4 text-gray-700">Results:</h3>
              <p class={`text-lg ${processingStatus === "complete" ? "text-green-600" : "text-red-600"}`}>{results}</p>
            </div>
          {/if}
        </div>
      </main>
    </div>
    <Footer />
  </div>
</div>

<style>
  .main-content {
    padding: 2rem 0;
    margin-top: 4rem;
    padding: 4rem 2rem;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
  }
  .log-container {
    background-color: #f7fafc;
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    height: 250px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  .log-entry {
    font-family: monospace;
    color: #4a5568;
    margin-bottom: 0.25rem;
  }
</style>
