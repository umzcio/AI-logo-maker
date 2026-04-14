/**
 * Encodes multiple PNG buffers into a single ICO file.
 * ICO format: header (6 bytes) + directory entries (16 bytes each) + image data.
 */
export function encodeIco(pngBuffers: ArrayBuffer[], sizes: number[]): ArrayBuffer {
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = dirEntrySize * pngBuffers.length;
  let dataOffset = headerSize + dirSize;

  const totalSize = dataOffset + pngBuffers.reduce((sum, buf) => sum + buf.byteLength, 0);
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);

  // ICO header
  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type: 1 = ICO
  view.setUint16(4, pngBuffers.length, true); // image count

  // Directory entries
  for (let i = 0; i < pngBuffers.length; i++) {
    const offset = headerSize + i * dirEntrySize;
    const size = sizes[i] >= 256 ? 0 : sizes[i]; // 0 means 256

    view.setUint8(offset, size);      // width
    view.setUint8(offset + 1, size);  // height
    view.setUint8(offset + 2, 0);     // color palette
    view.setUint8(offset + 3, 0);     // reserved
    view.setUint16(offset + 4, 1, true);  // color planes
    view.setUint16(offset + 6, 32, true); // bits per pixel
    view.setUint32(offset + 8, pngBuffers[i].byteLength, true); // image size
    view.setUint32(offset + 12, dataOffset, true); // image offset

    dataOffset += pngBuffers[i].byteLength;
  }

  // Image data
  let writeOffset = headerSize + dirSize;
  for (const pngBuffer of pngBuffers) {
    new Uint8Array(buffer, writeOffset).set(new Uint8Array(pngBuffer));
    writeOffset += pngBuffer.byteLength;
  }

  return buffer;
}
