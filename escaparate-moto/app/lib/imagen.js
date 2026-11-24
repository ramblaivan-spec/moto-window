// Reduce la foto a 1600 px como máximo para ahorrar espacio y cargar rápido.
export function reducir(archivo, max = 1600) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(archivo);
    const img = new Image();
    img.onload = () => {
      const escala = Math.min(1, max / Math.max(img.width, img.height));
      const ancho = Math.round(img.width * escala);
      const alto = Math.round(img.height * escala);
      const lienzo = document.createElement("canvas");
      lienzo.width = ancho;
      lienzo.height = alto;
      lienzo.getContext("2d").drawImage(img, 0, 0, ancho, alto);
      lienzo.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) resolve({ blob, ancho, alto });
          else reject(new Error("No se pudo procesar la imagen"));
        },
        "image/jpeg",
        0.85
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Imagen no válida"));
    };
    img.src = url;
  });
}
