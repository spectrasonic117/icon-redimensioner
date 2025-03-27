import React, { useState, useRef } from 'react';

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [size, setSize] = useState(64);
  const fileInputRef = useRef(null);

  // Función para cargar la imagen usando FileReader
  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Maneja el evento de soltar la imagen
  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  // Evita el comportamiento por defecto del drag
  const onDragOver = (e) => {
    e.preventDefault();
  };

  // Permite hacer clic en el área para subir la imagen
  const handleClickUpload = () => {
    fileInputRef.current.click();
  };

  // Procesa la imagen redimensionándola y descarga el resultado
  const handleDownload = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, size, size);
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resized_${size}x${size}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
  };

  // Se aplica padding solo cuando no hay imagen cargada
  const containerClasses = imageSrc
    ? "border-2 border-dashed border-green-400 rounded cursor-pointer text-center text-white flex items-center justify-center mx-auto"
    : "border-2 border-dashed border-green-400 p-10 rounded cursor-pointer text-center text-white flex items-center justify-center mx-auto";

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-green-400 mb-4 text-center">Image Resizer</h1>
        <div
          style={imageSrc ? { width: `${size}px`, height: `${size}px` } : {}}
          className={containerClasses}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onClick={handleClickUpload}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <p className="text-xl font-bold">Drag & drop an image to rezize</p>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="bg-gray-700 text-white p-2 rounded"
          >
            <option value={64}>64x64 - Server</option>
            <option value={96}>96x96 - Plugin</option>
          </select>
          <button
            onClick={handleDownload}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

