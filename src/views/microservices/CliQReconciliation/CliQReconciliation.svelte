<script>
  import { onMount, onDestroy } from 'svelte';
  import Sidebar from "components/Sidebar.svelte";
  import Header from "components/Header.svelte";
  import Footer from "components/Footer.svelte";
  import {
    abFiles, cliqFiles, processingStatus, results, progress, logs,
    logBox, abPreview, cliqPreview, onMountHandler, onDestroyHandler,
    handleABFileSelect, handleCliQFileSelect, processFiles
  } from './CliQReconciliation.js';

  onMount(onMountHandler);
  onDestroy(onDestroyHandler);
</script>

<svelte:head>
  <link rel="stylesheet" href="./CliQReconciliation.css">
</svelte:head>

<div class="relative md:ml-64 bg-gray-100 min-h-screen">
  <Sidebar />
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
            </div>
            <div>
              <h2 class="text-2xl font-semibold mb-4 text-gray-700">Browse CliQ File</h2>
              <input 
                type="file" 
                on:change={handleCliQFileSelect} 
                class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
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
            <div 
              bind:this={$logBox}
              class="log-container"
            >
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
