export const buildCacheKey = (req, prefix = '') => {
  const baseKey = `${req.baseUrl}${req.path}`;
  const queryKey = JSON.stringify(req.query || {});
  return `${prefix}:${baseKey}:${queryKey}`;
};
