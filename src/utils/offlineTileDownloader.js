// Conversión de Coordenadas Lat/Lng a coordenadas de Tile X/Y (Mercator EPSG:3857)
function long2tile(lon, zoom) {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
}

function lat2tile(lat, zoom) {
  return Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      Math.pow(2, zoom)
  );
}

// Bounding box ampliado de la Etapa 4 (Betanzos → Hospital de Bruma)
const STAGE_BOUNDS = {
  minLat: 43.0800, // Ampliado hacia el Sur
  maxLat: 43.3200, // Ampliado hacia el Norte
  minLng: -8.4200, // Ampliado hacia el Oeste
  maxLng: -8.1500, // Ampliado hacia el Este
};

// Ampliado de 12-15 a 11-17 para cubrir todos los niveles de zoom de Leaflet
const ZOOM_LEVELS = [11, 12, 13, 14, 15, 16, 17]; 
const TILE_CACHE_NAME = 'camino-tiles-v1';

/**
 * Descarga y almacena en caché las teselas del mapa correspondientes a la Etapa 4
 * @param {Function} onProgress - Callback con los valores (porcentaje, descargados, total)
 */
export async function downloadStageTiles(onProgress) {
  if (!('caches' in window)) {
    throw new Error('El navegador no soporta el almacenamiento en Caché API.');
  }

  const cache = await caches.open(TILE_CACHE_NAME);
  const urlsToFetch = [];

  // 1. Calcular la malla de X e Y para cada nivel de Zoom
  ZOOM_LEVELS.forEach((z) => {
    const xMin = long2tile(STAGE_BOUNDS.minLng, z);
    const xMax = long2tile(STAGE_BOUNDS.maxLng, z);
    const yMin = lat2tile(STAGE_BOUNDS.maxLat, z); // En mapas Y crece hacia el sur
    const yMax = lat2tile(STAGE_BOUNDS.minLat, z);

    for (let x = Math.min(xMin, xMax); x <= Math.max(xMin, xMax); x++) {
      for (let y = Math.min(yMin, yMax); y <= Math.max(yMin, yMax); y++) {
        // Peticiones distribuidas sobre el servidor estándar de OpenStreetMap
        const sub = ['a', 'b', 'c'][Math.floor(Math.random() * 3)];
        urlsToFetch.push(`https://${sub}.tile.openstreetmap.org/${z}/${x}/${y}.png`);
      }
    }
  });

  const total = urlsToFetch.length;
  let completed = 0;

  // 2. Descarga por lotes (batching de 8 en 8) para máxima velocidad
  const batchSize = 8;
  for (let i = 0; i < urlsToFetch.length; i += batchSize) {
    const batch = urlsToFetch.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (url) => {
        try {
          const match = await cache.match(url);
          if (!match) {
            const response = await fetch(url, { mode: 'cors' });
            if (response.ok) {
              await cache.put(url, response);
            }
          }
        } catch (err) {
          console.warn(`Error al descargar tile: ${url}`, err);
        } finally {
          completed++;
          if (onProgress) {
            onProgress(Math.round((completed / total) * 100), completed, total);
          }
        }
      })
    );
  }

  return true;
}

/**
 * Comprueba si la etapa ya tiene suficientes teselas almacenadas
 */
export async function checkTilesDownloaded() {
  if (!('caches' in window)) return false;
  try {
    const cache = await caches.open(TILE_CACHE_NAME);
    const keys = await cache.keys();
    // Umbral ajustado al nuevo volumen de teselas
    return keys.length > 200;
  } catch (error) {
    return false;
  }
}