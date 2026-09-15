// 1. Transformar peticiones de YouTube
if (targetUrl.includes('youtube.com') || targetUrl.includes('youtu.be')) {
  const videoMatch = targetUrl.match(/(?:v=|\/)([\w-]{11})/);
  
  if (videoMatch && videoMatch[1]) {
    // Si es un video específico
    targetUrl = `https://www.youtube-nocookie.com/embed/${videoMatch[1]}?autoplay=1&enablejsapi=1`;
  } else {
    // SI NO HAY VIDEO (Ej: entraron a youtube.com a secas), forzamos la interfaz embebible de TV o buscador
    targetUrl = `https://youtube.com`; 
    // O alternativamente: targetUrl = `https://youtube.com`;
  }
}
