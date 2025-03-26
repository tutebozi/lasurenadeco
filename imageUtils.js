// Función para cargar imagen fragmentada desde localStorage
function cargarImagenFragmentada(imagenId) {
    try {
        // Obtener información de la imagen
        const infoStr = localStorage.getItem(`${imagenId}_info`);
        if (!infoStr) return null;
        
        const info = JSON.parse(infoStr);
        
        // Reconstruir la imagen a partir de los fragmentos
        let imagenCompleta = '';
        for (let i = 0; i < info.totalFragmentos; i++) {
            const fragmento = localStorage.getItem(`${imagenId}_frag_${i}`);
            if (fragmento) {
                imagenCompleta += fragmento;
            } else {
                console.error(`Fragmento ${i} de imagen ${imagenId} no encontrado`);
                return null;
            }
        }
        
        // Verificar que la imagen se reconstruyó correctamente
        if (imagenCompleta.length === info.tamanoTotal) {
            return imagenCompleta;
        } else {
            console.error(`Error al reconstruir imagen ${imagenId}: longitud incorrecta`);
            return null;
        }
    } catch (error) {
        console.error(`Error al cargar imagen fragmentada ${imagenId}:`, error);
        return null;
    }
}

// Función para guardar imagen fragmentada en localStorage
function guardarImagenFragmentada(imagenId, imagenBase64) {
    // Tamaño máximo de cada fragmento (aproximadamente 50KB)
    const tamanoFragmento = 50000;
    
    // Dividir la imagen en fragmentos
    const totalFragmentos = Math.ceil(imagenBase64.length / tamanoFragmento);
    
    // Guardar información sobre la imagen
    localStorage.setItem(`${imagenId}_info`, JSON.stringify({
        totalFragmentos: totalFragmentos,
        tamanoTotal: imagenBase64.length
    }));
    
    // Guardar cada fragmento
    for (let i = 0; i < totalFragmentos; i++) {
        const inicio = i * tamanoFragmento;
        const fin = Math.min((i + 1) * tamanoFragmento, imagenBase64.length);
        const fragmento = imagenBase64.substring(inicio, fin);
        
        localStorage.setItem(`${imagenId}_frag_${i}`, fragmento);
    }
} 