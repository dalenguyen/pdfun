/**
 * Check if a path is public path which belongs to public users
 *
 * @param documentPath string
 * @returns boolean
 */
export const isPublicUser = (documentPath: string) => {
  return documentPath.startsWith('public/')
}
