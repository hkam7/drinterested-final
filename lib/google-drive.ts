import { OAuth2Client } from "google-auth-library"

export type DriveItem = {
  id: string
  name: string
  mimeType: string
  isFolder: boolean
  webViewLink?: string
  /** True when Google has a preview image for this file. The actual image is fetched through
   *  /api/drive/thumbnail (auth-gated, like everything else here) — never Google's raw
   *  thumbnailLink, since that URL isn't reliably fetchable straight from the browser. */
  hasThumbnail: boolean
}

export type DriveFolderListing = {
  id: string
  name: string
  items: DriveItem[]
}

// Full `drive` scope (not `drive.readonly`) — required for creating folders/files, copying
// templates, and uploads. This is the ONE Google account (connected via OAuth — see
// app/api/drive/oauth/*) the whole portal shares, so every write capability that touches
// Drive MUST go through the functions in this file, and this file intentionally implements NO
// delete/trash function. Do not add one: the org's explicit requirement is that nothing
// reachable through the portal can delete a Drive file, and since members never hold this
// credential themselves (see lib/portal-auth.ts), omitting the function here is what actually
// enforces that, not the connected account's role.

// This uses a real, OAuth-connected Google account rather than a service account on purpose:
// service accounts have zero Drive storage quota of their own, so creating/copying/uploading
// a file — which makes the service account its owner — fails immediately with "storage quota
// exceeded" unless the folder lives in a Google Workspace Shared Drive. A regular account has
// real quota, so this only works at all when the connected account is a normal Gmail/Workspace
// user (ideally the one that already owns the shared folder, so no re-sharing is needed).
export const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive"
const DRIVE_API_BASE = "https://www.googleapis.com/drive/v3/files"
const DRIVE_UPLOAD_BASE = "https://www.googleapis.com/upload/drive/v3/files"
const FOLDER_MIME_TYPE = "application/vnd.google-apps.folder"
const ITEM_FIELDS = "id,name,mimeType,webViewLink,thumbnailLink"

// Google Workspace file types members can create blank from the toolbar.
export const CREATABLE_GOOGLE_TYPES = {
  document: "application/vnd.google-apps.document",
  spreadsheet: "application/vnd.google-apps.spreadsheet",
  presentation: "application/vnd.google-apps.presentation",
  form: "application/vnd.google-apps.form",
} as const
export type CreatableGoogleType = keyof typeof CREATABLE_GOOGLE_TYPES

// Stays safely under Vercel Serverless Functions' ~4.5MB request body ceiling — uploads route
// through our server (never a raw credential handed to the browser), so this is a hard cap.
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024

/** A Drive API error the route handler can safely turn into a user-facing message. */
export class DriveApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export function getOAuthClientCredentials() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new DriveApiError(500, "Missing Google OAuth client credentials.")
  }

  return { clientId, clientSecret }
}
