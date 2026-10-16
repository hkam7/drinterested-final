// This file replaces the previous Supabase admin client with a safe runtime
// stub. Any attempt to use the admin client will throw with a descriptive error.

const ERROR_MSG =
  "Supabase admin client has been removed from this repository. Restore the admin client or update server code to use another backend.";

function thrower(): never {
  throw new Error(ERROR_MSG);
}

export const supabaseAdmin: any = new Proxy({}, {
  get: () => thrower,
  apply: () => thrower,
});
