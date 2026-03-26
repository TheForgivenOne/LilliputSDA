export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function openYouTubeVideo(videoId: string): boolean {
  if (typeof window === "undefined") return false;
  
  const isMobile = isMobileDevice();
  
  if (isMobile) {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const youtubeUrl = isIOS
      ? `youtube://www.youtube.com/watch?v=${videoId}`
      : `https://www.youtube.com/watch?v=${videoId}`;
    
    window.location.href = youtubeUrl;
    return true;
  }
  
  return false;
}

export function getYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
