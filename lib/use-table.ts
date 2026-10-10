"use client";

import { useCallback, useEffect, useState } from "react";
import type { Table } from "@/lib/data/source";

function message(error: unknown) {
  return error instanceof Error && error.message ? error.message : "Something went wrong with storage.";
}

// Loads one table and keeps the page in step with it after every change.
export function useTable<Row extends { id: string }>(table: Table<Row>) {
  // null until the first load finishes.
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    try {
      setRows(await table.list());
      setError("");
    } catch (caught) {
      setError(message(caught));
    }
  }, [table]);

  useEffect(() => {
    let current = true;
    table.list().then(
      (loaded) => current && setRows(loaded),
      (caught) => current && setError(message(caught)),
    );
    return () => {
      current = false;
    };
  }, [table]);

  const save = useCallback(
    async (row: Row) => {
      await table.save(row);
      await reload();
    },
    [table, reload],
  );

  const remove = useCallback(
    async (id: string) => {
      await table.remove(id);
      await reload();
    },
    [table, reload],
  );

  return { rows, error, save, remove };
}
