import { onMount, onDestroy } from 'svelte';
import { csv } from 'd3-fetch';
import { writable } from 'svelte/store';

const abFiles = writable([]);
const cliqFiles = writable([]);
const processingStatus = writable("idle"); // idle, processing, complete, error
const results = writable(null);
const progress = writable(0);
const logs = writable([]);
const abPreview = writable(null);
const cliqPreview = writable(null);

let intervalId;
let logBox;

onMount(() => {
  intervalId = setInterval(checkProgress, 1000);
});

onDestroy(() => {
  clearInterval(intervalId);
});

async function handleABFileSelect(event) {
  const selectedFiles = Array.from(event.target.files);
  abFiles.set(selectedFiles.filter(file => file.name.endsWith('.csv')));
  abPreview.set(await previewFile(selectedFiles[0]));
  results.set(null);
  console.log("AB Files Selected:", selectedFiles);
}

async function handleCliQFileSelect(event) {
  const selectedFiles = Array.from(event.target.files);
  cliqFiles.set(selectedFiles.filter(file => file.name.endsWith('.csv')));
  cliqPreview.set(await previewFile(selectedFiles[0]));
  results.set(null);
  console.log("CliQ Files Selected:", selectedFiles);
}

async function previewFile(file) {
  const text = await file.text();
  const data = await csv(text);
  console.log("Preview Data:", data.slice(0, 5));
  return data.slice(0, 5); // preview the first 5 rows
}

async function processFiles() {
  let $abFiles, $cliqFiles;
  abFiles.subscribe(value => $abFiles = value)();
  cliqFiles.subscribe(value => $cliqFiles = value)();

  if ($abFiles.length === 0 || $cliqFiles.length === 0) {
    alert("Please select both AB File and CliQ File to process.");
    return;
  }

  processingStatus.set("processing");
  progress.set(0);
  logs.set([]);
  const formData = new FormData();
  $abFiles.forEach((file, index) => {
    formData.append('ab_files', file);
  });
  $cliqFiles.forEach((file, index) => {
    formData.append('cliq_files', file);
  });

  console.log("FormData to be sent:", formData);

  try {
    const response = await fetch('http://localhost:8000/api/process_cliq_reconciliation/', {
      method: 'POST',
      body: formData,
    });

    console.log("Fetch Response Status:", response.status);

    if (!response.ok) throw new Error('Processing failed');

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = "reconciliation_results.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();

    processingStatus.set("complete");
    results.set("Files reconciled successfully!");
  } catch (error) {
    console.error('Error:', error);
    processingStatus.set("error");
    results.set("Error processing files.");
  }
}

async function checkProgress() {
  let $processingStatus;
  processingStatus.subscribe(value => $processingStatus = value)();

  if ($processingStatus === "processing") {
    const response = await fetch('http://localhost:8000/api/progress_reconciliation/');
    if (response.ok) {
      const data = await response.json();
      progress.set(data.progress);
      logs.set(data.logs);
      if (logBox) {
        logBox.scrollTop = logBox.scrollHeight;
      }
      console.log("Progress Data:", data);
    }
  }
}

// Export all necessary functions and variables
export {
  abFiles,
  cliqFiles,
  processingStatus,
  results,
  progress,
  logs,
  abPreview,
  cliqPreview,
  handleABFileSelect,
  handleCliQFileSelect,
  processFiles,
  checkProgress
};