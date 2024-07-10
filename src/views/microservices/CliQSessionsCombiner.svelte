<script>
  import Sidebar from "components/Sidebar.svelte";
  import Header from "components/Header.svelte";
  import Footer from "components/Footer.svelte";
  import { onMount, onDestroy } from 'svelte';

  export let location;
  let files = [];
  let processingStatus = "idle"; // idle, processing, complete, error
  let results = null;
  let progress = 0;
  let logs = [];
  let intervalId;
  let logBox;

  onMount(() => {
    intervalId = setInterval(checkProgress, 1000);
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });

  async function handleFolderSelect(event) {
    const selectedFiles = Array.from(event.target.files);
    files = selectedFiles.filter(file => file.name.endsWith('.zip'));
    results = null;
  }

  async function processFiles() {
    if (files.length === 0) {
      alert("Please select a folder containing ZIP files to process.");
      return;
    }

    processingStatus = "processing";
    progress = 0;
    logs = [];
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('http://localhost:8000/api/process_cliq_sessions_combiner/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Processing failed');

      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const filename = filenameMatch && filenameMatch[1] ? filenameMatch[1] : "_combined.xlsx";

      // Download the file using the extracted filename
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();

      processingStatus = "complete";
      results = "Files processed successfully!";
    } catch (error) {
      console.error('Error:', error);
      processingStatus = "error";
      results = "Error processing files.";
    }
  }

  async function checkProgress() {
    if (processingStatus === "processing") {
      const response = await fetch('http://localhost:8000/api/progress/');
      if (response.ok) {
        const data = await response.json();
        progress = data.progress;
        logs = data.logs;
        if (logBox) {
          logBox.scrollTop = logBox.scrollHeight;
        }
      }
    }
  }

  function addTimestampToLogs(logs) {
    return logs.map(log => {
      const timestamp = new Date().toLocaleTimeString();
      return `${timestamp} - ${log}`;
    });
  }
</script>

<div class="relative md:ml-64 bg-gray-100 min-h-screen">
  <Sidebar {location} />
  <div class="relative w-full">
    <Header title="CliQ Sessions Combiner" />
    <div class="px-8 py-6 mx-auto w-full max-w-7xl">
      <main class="main-content">
        <div class="bg-white shadow-lg rounded-lg p-8 mb-8">
          <h1 class="text-4xl font-bold mb-8 text-gray-800">CliQ Sessions Combiner</h1>
          
          <div class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-700">Select Folder</h2>
            <input 
              type="file" 
              webkitdirectory 
              directory 
              on:change={handleFolderSelect} 
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <button 
              on:click={processFiles}
              disabled={files.length === 0 || processingStatus === "processing"}
              class="w-full bg-blue-600 text-black py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 text-lg font-semibold text-left"
            >
              {processingStatus === "processing" ? "Processing..." : "Process Files"}
            </button>
          </div>

          {#if files.length > 0}
            <div class="mb-8">
              <h3 class="text-xl font-semibold mb-4 text-gray-700">Selected ZIP Files:</h3>
              <ul class="list-disc pl-5 text-gray-700">
                {#each files as file}
                  <li>{file.name}</li>
                {/each}
              </ul>
            </div>
          {/if}

          {#if processingStatus === "processing"}
            <div class="mb-8">
              <h3 class="text-xl font-semibold mb-4 text-gray-700">Processing Progress:</h3>
              <div class="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div class="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-in-out" style="width: {progress}%"></div>
              </div>
              <p class="text-gray-600 text-lg">{progress}% Complete</p>
            </div>
          {/if}

          <div class="mb-8">
            <h3 class="text-xl font-semibold mb-4 text-gray-700">Processing Logs:</h3>
            <div 
              bind:this={logBox}
              class="log-container"
            >
              {#each addTimestampToLogs(logs) as log}
                <p class="log-entry">{log}</p>
              {/each}
            </div>
          </div>

          {#if results}
            <div>
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
