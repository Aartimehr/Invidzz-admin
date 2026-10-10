import { localData } from "@/lib/data/local";
import type { DataSource } from "@/lib/data/source";

// The one place that decides where the admin's data lives.
// To connect Supabase: write lib/data/supabase.ts that satisfies DataSource, and export it here instead.
export const data: DataSource = localData;
