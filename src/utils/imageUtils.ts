/**
 * Reads a File and resizes it to a reasonable maximum dimension (1600px)
 * to keep base64 payloads fast, responsive, and reliable.
 */
export async function processImageFile(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image for processing'));
      img.onload = () => {
        const MAX_DIM = 1600;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve({ base64: reader.result as string, mimeType: file.type || 'image/jpeg' });
        }

        ctx.drawImage(img, 0, 0, width, height);
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const compressedBase64 = canvas.toDataURL(mimeType, 0.88);
        resolve({ base64: compressedBase64, mimeType });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Downloads a data URL as a file with a given filename
 */
export function triggerDownload(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Captures an HTML element to a canvas and triggers a PNG download
 * Uses native SVG foreignObject drawing for crisp vector + font fidelity.
 */
export async function downloadElementAsImage(
  element: HTMLElement,
  filename: string,
  scale = 2
): Promise<void> {
  const rect = element.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  // Clone element with inline styles to accurately capture
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.width = `${width}px`;
  clone.style.height = `${height}px`;
  clone.style.transform = 'none';
  clone.style.margin = '0';
  clone.style.position = 'static';

  // Create an XML serializer
  const wrapper = document.createElement('div');
  wrapper.appendChild(clone);
  
  // Embed stylesheets into the svg so web fonts and styles render
  const styleElements = document.querySelectorAll('style, link[rel="stylesheet"]');
  let styles = '';
  styleElements.forEach((el) => {
    if (el.tagName === 'STYLE') {
      styles += el.innerHTML;
    }
  });

  const svgData = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width * scale}" height="${height * scale}" viewBox="0 0 ${width} ${height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width:${width}px; height:${height}px;">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Courier+Prime:ital,wght@0,400;0,700&family=Playfair+Display:ital,wght@0,400;0,700&family=Plus+Jakarta+Sans:wght@400;600;700&family=Marcellus&display=swap');
            ${styles}
          </style>
          ${wrapper.innerHTML}
        </div>
      </foreignObject>
    </svg>
  `;

  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL('image/png');
        triggerDownload(pngUrl, filename);
        URL.revokeObjectURL(blobURL);
        resolve();
      }
    };

    img.onerror = () => {
      // Fallback: If foreignObject security fails on external images, trigger fallback drawing
      fallbackCanvasExport(element, filename, scale)
        .then(resolve)
        .catch(() => resolve());
    };

    img.src = blobURL;
  });
}

/**
 * Robust fallback image export
 */
async function fallbackCanvasExport(element: HTMLElement, filename: string, scale = 2): Promise<void> {
  const rect = element.getBoundingClientRect();
  const canvas = document.createElement('canvas');
  canvas.width = rect.width * scale;
  canvas.height = rect.height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(scale, scale);
  ctx.fillStyle = '#fdfbf7';
  ctx.fillRect(0, 0, rect.width, rect.height);

  // Try to find image inside element
  const imgElement = element.querySelector('img') as HTMLImageElement | null;
  if (imgElement && imgElement.complete) {
    const imgRect = imgElement.getBoundingClientRect();
    const relX = imgRect.left - rect.left;
    const relY = imgRect.top - rect.top;
    try {
      ctx.drawImage(imgElement, relX, relY, imgRect.width, imgRect.height);
    } catch (e) {
      console.warn('Canvas image draw error:', e);
    }
  }

  // Draw border
  ctx.strokeStyle = '#e2ded5';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, rect.width, rect.height);

  const pngUrl = canvas.toDataURL('image/png');
  triggerDownload(pngUrl, filename);
}
