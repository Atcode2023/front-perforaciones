export async function getApi() {
  const mod = await import('src/boot/axios');
  return mod.api;
}

export async function getImgUrl() {
  const mod = await import('src/boot/axios');
  return mod.imgUrl;
}

// Note: We intentionally use dynamic import to keep the module lazy and
// avoid mixing static and dynamic imports which causes Vite chunking warnings.
