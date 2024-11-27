export const ContentTypes = {
  JPG: 'image/jpeg',
  JPEG: 'image/jpeg',
  PNG: 'image/png',
} as const;

export type contentType = typeof ContentTypes[keyof typeof ContentTypes];
