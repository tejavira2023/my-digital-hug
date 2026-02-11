// IndexedDB wrapper for persistent file storage
// Also supports direct file loading from mediaConfig

import { mediaConfig } from '@/config';

const DB_NAME = 'birthday-website-db';
const DB_VERSION = 1;
const STORE_NAME = 'files';
const USE_CONFIG = true; // Set to true to use mediaConfig instead of IndexedDB

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveFile(key: string, file: File): Promise<void> {
  const db = await openDB();
  const arrayBuffer = await file.arrayBuffer();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(
      { data: arrayBuffer, type: file.type, name: file.name },
      key
    );
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function saveFiles(key: string, files: File[]): Promise<void> {
  const db = await openDB();
  const items = await Promise.all(
    files.map(async (f) => ({
      data: await f.arrayBuffer(),
      type: f.type,
      name: f.name,
    }))
  );
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(items, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getFileURL(key: string): Promise<string | null> {
  if (USE_CONFIG) {
    const configKey = key as keyof typeof mediaConfig;
    const path = mediaConfig[configKey];
    if (path && typeof path === 'string') {
      return path;
    }
    return null;
  }
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => {
      if (!req.result) return resolve(null);
      const blob = new Blob([req.result.data], { type: req.result.type });
      resolve(URL.createObjectURL(blob));
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getFileURLs(key: string): Promise<string[]> {
  if (USE_CONFIG) {
    if (key === 'galleryPhotos') {
      return mediaConfig.galleryPhotos;
    }
    return [];
  }
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => {
      if (!req.result || !Array.isArray(req.result)) return resolve([]);
      const urls = req.result.map(
        (item: { data: ArrayBuffer; type: string }) =>
          URL.createObjectURL(new Blob([item.data], { type: item.type }))
      );
      resolve(urls);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function hasUploaded(): Promise<boolean> {
  if (USE_CONFIG) {
    // When using config, always return true (files are pre-configured)
    return true;
  }
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get('uploaded');
    req.onsuccess = () => resolve(!!req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function markUploaded(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(true, 'uploaded');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
