// This file is a deliberate runtime stub that replaces the previous Supabase
// client. Importing this module is safe — it does not throw at import time — but
// any attempt to call into the client will fail immediately with a clear error
// message explaining that the Supabase integration was removed.

const ERROR_MSG =
  "Supabase integration has been removed from this repository. Restore the Supabase client or implement an alternate data/auth provider before calling into data/auth APIs.";

function thrower(): never {
  throw new Error(ERROR_MSG);
}

// A permissive proxy that throws as soon as any property is accessed or any call
// is attempted. This preserves existing imports while failing fast and clearly
// at runtime.
export const supabase: any = new Proxy(() => {
  thrower();
}, {
  get: () => thrower,
  apply: () => thrower,
});
