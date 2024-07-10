<script>
  import Sidebar from "components/Sidebar.svelte";
  import Header from "components/Header.svelte";
  import Footer from "components/Footer.svelte";
  import {
    abFiles, cliqFiles, processingStatus, results, progress, logs,
    abPreview, cliqPreview,
    handleABFileSelect, handleCliQFileSelect, processFiles, checkProgress
  } from './CliQReconciliation.js';
  import './CliQReconciliation.css';

  let logBox;
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
              {#if $abPreview}
                <div class="file-preview">
                  <h3 class="text-lg font-semibold mb-2">AB File Preview</h3>
                  <table class="min-w-full bg-white">
                    <thead>
                      <tr>
                        {#each Object.keys($abPreview[0]) as key}
                          <th class="py-2">{key}</th>
                        {/each}
                      </tr>
                    </thead>
                    <tbody>
                      {#each $abPreview as row}
                        <tr>
                          {#each Object.values(row) as value}
                            <td class="border px-4 py-2">{value}</td>
                          {/each}
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              {/if}
            </div>
            <div>
              <h2 class="text-2xl font-semibold mb-4 text-gray-700">Browse CliQ File</h2>
              <input 
                type="file" 
                on:change={handleCliQFileSelect} 
                class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
              {#if $cliqPreview}
                <div class="file-preview">
                  <h3 class="text-lg font-semibold mb-2">CliQ File Preview</h3>
                  <table class="min-w-full bg-white">
                    <thead>
                      <tr>
                        {#each Object.keys($cliqPreview[0]) as key}
                          <th class="py-2">{key}</th>
                        {/each}
                      </tr>
                    </thead>
                    <tbody>
                      {#each $cliqPreview as row}
                        <tr>
                          {#each Object.values(row) as value}
                            <td class="border px-4 py-2">{value}</td>
                          {/each}
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              {/if}
            </div>
          </div>
          <div class="mt-8">
            <button 
              on:click={processFiles}
              disabled={$abFiles.length === 0 || $cliqFiles.length === 0 || $processingStatus === "processing"}
              class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 text-lg font-semibold"
            >
              {$processingStatus === "processing" ? "Processing..." : "Process Files"}
            </button>
          </div>

          {#if $processingStatus === "processing"}
            <div class="mt-8">
              <h3 class="text-xl font-semibold mb-4 text-gray-700">Processing Progress:</h3>
              <div class="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div class="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-in-out" style="width: {$progress}%"></div>
              </div>
              <p class="text-gray-600 text-lg">{$progress}% Complete</p>
            </div>
          {/if}

          <div class="mt-8">
            <h3 class="text-xl font-semibold mb-4 text-gray-700">Processing Logs:</h3>
            <div bind:this={logBox} class="log-container">
              {#each $logs as log}
                <p class="log-entry">{log}</p>
              {/each}
            </div>
          </div>

          {#if $results}
            <div class="mt-8">
              <h3 class="text-xl font-semibold mb-4 text-gray-700">Results:</h3>
              <p class={`text-lg ${$processingStatus === "complete" ? "text-green-600" : "text-red-600"}`}>{$results}</p>
            </div>
          {/if}
        </div>
      </main>
    </div>
    <Footer />
  </div>
</div>
