'use server';

import { Database } from 'types_db';
import { createServerSupabaseClient } from 'utils/supabase/server';

export type BookmarkRow = Database['public']['Tables']['bookmark']['Row'];
export type BookmarkRowInsert =
  Database['public']['Tables']['bookmark']['Insert'];

function handleError(error) {
  console.error(error);
  throw new Error(error.message);
}

// GET ALL BOOKMARKED (메인)
export async function getAllBookmarked() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('bookmark')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) handleError(error);
  return data;
}

// GET BOOKMARKED BY ID (서브)
export async function getBookmarked(id) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('bookmark')
    .select('*')
    .eq('id', id);

  if (error) handleError(error);
  return data;
}

// CREATE
export async function createBookmarked(bookmarked: BookmarkRowInsert) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('bookmark').insert({
    ...bookmarked,
    created_at: new Date().toISOString(),
  });

  if (error) handleError(error);
  return data;
}

// DELETE
export async function deleteBookmarked(id) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('bookmark').delete().eq('id', id);

  if (error) handleError(error);
  return data;
}
