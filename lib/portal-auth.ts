import { DriveApiError } from "@/lib/google-drive"

/**
 * Supabase has been removed from this project. This helper previously returned a
 * Supabase client scoped to the calling user's token and verified the user's
 * membership/approval. It now fails-fast and explains the removal so callers can
 * be updated to an alternate auth path.
 */
export async function requireApprovedMember(): Promise<never> {
  throw new DriveApiError(
    500,
    "Supabase integration removed: member approval check is disabled. Restore Supabase or implement an alternate auth path."
  )
}
