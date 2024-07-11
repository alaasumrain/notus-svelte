import { writable } from 'svelte/store';

console.log('Imports completed');

export const abFiles = writable([]);
export const cliqFiles = writable([]);
export const processingStatus = writable("idle");
export const results = writable(null);
export const progress = writable(0);
export const logs = writable([]);
export const logBox = writable(null);
export const abPreview = writable(null);
export const cliqPreview = writable(null);

let intervalId;

export function onMountHandler() {
  console.log('Component mounted');
  intervalId = setInterval(checkProgress, 1000);
  console.log('Progress check interval set');
}

export function onDestroyHandler() {
  console.log('Component being destroyed');
  clearInterval(intervalId);
  console.log('Progress check interval cleared');
}

export async function handleABFileSelect(event) {
  console.log('AB file selection started');
  try {
    const selectedFiles = Array.from(event.target.files);
    abFiles.set(selectedFiles.filter(file => file.name.endsWith('.csv') || file.name.endsWith('.xlsx')));
    console.log('AB files filtered:', selectedFiles);
    results.set(null);
  } catch (error) {
    console.error('Error in handleABFileSelect:', error);
  }
}

export async function handleCliQFileSelect(event) {
  console.log('CliQ file selection started');
  try {
    const selectedFiles = Array.from(event.target.files);
    cliqFiles.set(selectedFiles.filter(file => file.name.endsWith('.csv') || file.name.endsWith('.xlsx')));
    console.log('CliQ files filtered:', selectedFiles);
    results.set(null);
  } catch (error) {
    console.error('Error in handleCliQFileSelect:', error);
  }
}

export async function processFiles() {
  console.log('File processing started');
  let $abFiles, $cliqFiles;
  abFiles.subscribe(value => $abFiles = value)();
  cliqFiles.subscribe(value => $cliqFiles = value)();

  if ($abFiles.length === 0 || $cliqFiles.length === 0) {
    console.log('No files selected');
    alert("Please select both AB File and CliQ File to process.");
    return;
  }

  processingStatus.set("processing");
  progress.set(0);
  logs.set([]);
  const formData = new FormData();
  $abFiles.forEach((file, index) => {
    formData.append('ab_files', file);
    console.log(`Appended AB file: ${file.name}`);
  });
  $cliqFiles.forEach((file, index) => {
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

    processingStatus.set("complete");
    results.set("Files reconciled successfully!");
    console.log('Processing completed successfully');
  } catch (error) {
    console.error('Error in processFiles:', error);
    processingStatus.set("error");
    results.set("Error processing files.");
  }
}

export async function checkProgress() {
  let $processingStatus;
  processingStatus.subscribe(value => $processingStatus = value)();

  if ($processingStatus === "processing") {
    console.log('Checking progress...');
    try {
      const response = await fetch('http://localhost:8000/api/progress_reconciliation/');
      if (response.ok) {
        const data = await response.json();
        console.log('Progress data:', data);
        progress.set(data.progress);
        logs.set(data.logs);
        let $logBox;
        logBox.subscribe(value => $logBox = value)();
        if ($logBox) {
          $logBox.scrollTop = $logBox.scrollHeight;
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
