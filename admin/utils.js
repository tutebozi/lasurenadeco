// Función para comprimir imagen
async function comprimirImagen(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Calcular nuevas dimensiones manteniendo proporción
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 800;
                
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convertir a JPEG con calidad reducida
                canvas.toBlob((blob) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                }, 'image/jpeg', 0.7);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Función para manejar la vista previa de imágenes
function handleImagePreview(file, previewElement) {
    if (!file || !previewElement) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        previewElement.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
}

// Función para manejar múltiples imágenes
function handleMultipleImagePreview(files, previewElement) {
    if (!files || !previewElement) return;
    
    if (files.length > 6) {
        alert('Solo se permiten 6 imágenes adicionales');
        return;
    }
    
    previewElement.innerHTML = '';
    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const div = document.createElement('div');
            div.className = 'imagen-preview-item';
            div.innerHTML = `
                <img src="${e.target.result}" alt="Preview ${index + 1}">
                <button type="button" class="eliminar-imagen" onclick="eliminarImagenPreview(this)">×</button>
            `;
            previewElement.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}

// Función para eliminar vista previa de imagen
function eliminarImagenPreview(button) {
    button.closest('.imagen-preview-item').remove();
}

// Exportar funciones
window.comprimirImagen = comprimirImagen;
window.handleImagePreview = handleImagePreview;
window.handleMultipleImagePreview = handleMultipleImagePreview;
window.eliminarImagenPreview = eliminarImagenPreview; 