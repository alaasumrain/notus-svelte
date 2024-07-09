<script>
    import { link } from "svelte-routing";
    import Sidebar from "components/Sidebar.svelte";
    import Header from "components/Header.svelte";
    import Footer from "components/Footer.svelte";
    import axios from 'axios';
  
    export let location;
  
    let files = [];
    let processingStatus = "idle"; // idle, processing, complete, error
    let statusMessage = "";
    let downloadUrl = null;
    let logs = [];
  
    function handleFileUpload(event) {
      const uploadedFiles = event.target.files;
      files = [...uploadedFiles];
      addLog(`Selected ${files.length} file(s)`);
    }
  
    function handleFolderUpload(event) {
      const uploadedFiles = event.target.files;
      files = [...uploadedFiles];
      addLog(`Selected folder with ${files.length} file(s)`);
    }
  
    function addLog(message) {
      const timestamp = new Date().toLocaleTimeString();
      logs = [...logs, `[${timestamp}] ${message}`];
    }
  
    async function processFiles() {
      if (files.length === 0) {
        statusMessage = "Please select files to process.";
        addLog("Error: No files selected");
        return;
      }
  
      processingStatus = "processing";
      statusMessage = "Processing files...";
      downloadUrl = null;
      addLog("Starting file processing");
  
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
  
      try {
        const response = await axios.post('/api/extract/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          responseType: 'blob',
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            addLog(`Upload progress: ${percentCompleted}%`);
          }
        });
  
        const url = window.URL.createObjectURL(new Blob([response.data]));
        downloadUrl = url;
        processingStatus = "complete";
        statusMessage = "Files processed successfully. Click the download button to get the result.";
        addLog("File processing completed successfully");
      } catch (error) {
        processingStatus = "error";
        statusMessage = error.response?.data?.error || "An error occurred while processing the files.";
        addLog(`Error: ${statusMessage}`);
        console.error(error);
      }
    }
  </script>
  
  <div class="relative md:ml-64 bg-blueGray-100 min-h-screen">
    <Sidebar {location} />
    <div class="relative w-full">
      <Header title="CliQ Extraction Service" />
      <div class="px-4 md:px-10 mx-auto w-full">
        <main class="main-content">
          <div class="service-container bg-white rounded-lg shadow-lg p-6">
            <h1 class="service-title text-2xl font-bold mb-4">CliQ Extraction Service</h1>
            <hr class="separator mb-6" />
            
            <div class="file-upload-section mb-6">
              <h2 class="section-title text-xl font-semibold mb-2">Upload Files</h2>
              <div class="flex space-x-4">
                <div>
                  <label for="file-upload" class="btn bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
                    Select Files
                  </label>
                  <input id="file-upload" type="file" multiple on:change={handleFileUpload} accept=".zip,.xlsx" class="hidden" />
                </div>
                <div>
                  <label for="folder-upload" class="btn bg-green-500 text-white px-4 py-2 rounded cursor-pointer">
                    Select Folder
                  </label>
                  <input id="folder-upload" type="file" webkitdirectory directory multiple on:change={handleFolderUpload} class="hidden" />
                </div>
              </div>
            </div>
  
            {#if files.length > 0}
              <div class="file-list mb-4">
                <h3 class="text-lg font-semibold mb-2">Selected Files:</h3>
                <ul class="list-disc pl-5">
                  {#each files as file}
                    <li>{file.name}</li>
                  {/each}
                </ul>
              </div>
            {/if}
  
            <button on:click={processFiles} disabled={files.length === 0 || processingStatus === "processing"} 
                    class="bg-blue-500 text-white px-4 py-2 rounded mb-4 {files.length === 0 || processingStatus === "processing" ? 'opacity-50 cursor-not-allowed' : ''}">
              {processingStatus === "processing" ? "Processing..." : "Process Files"}
            </button>
  
            {#if statusMessage}
              <div class="status-message mb-4 p-2 rounded" class:bg-yellow-100={processingStatus === "processing"} class:bg-green-100={processingStatus === "complete"} class:bg-red-100={processingStatus === "error"}>
                {statusMessage}
              </div>
            {/if}
  
            {#if downloadUrl}
              <div class="download-section mb-4">
                <a href={downloadUrl} download="processed_files.xlsx" class="bg-green-500 text-white px-4 py-2 rounded">Download Processed Files</a>
              </div>
            {/if}
  
            <div class="log-section">
              <h3 class="text-lg font-semibold mb-2">Processing Logs:</h3>
              <div class="bg-gray-100 p-2 rounded h-40 overflow-y-auto">
                {#each logs as log}
                  <p class="text-sm">{log}</p>
                {/each}
              </div>
            </div>
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
    }
    .service-container {
      background-color: white;
      border-radius: 0.5rem;
      padding: 3rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .service-title {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }
    .separator {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 1rem 0 2rem;
    }
    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    .file-upload-section {
      margin-bottom: 2rem;
    }
    .file-list, .processing-status, .results {
      margin-top: 2rem
    }
  </style>
  