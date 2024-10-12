'use server';

import { Database } from 'types_db';
import { createServerSupabaseClient } from 'utils/supabase/server';

export type BookmarkedRow = Database['public']['Tables']['bookmarked']['Row'];
export type BookmarkedRowInsert =
  Database['public']['Tables']['bookmarked']['Insert'];

function handleError(error) {
  console.error(error);
  throw new Error(error.message);
}

// GET ALL BOOKMARKED By userId (메인)
export async function getAllBookmarked(userId) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('bookmarked')
    .select('*')
    .eq('userId', userId)
    .order('created_at', { ascending: true });

  if (error) handleError(error);
  return data;
}

// GET BOOKMARKED By id (서브)
export async function getBookmarked(id) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('bookmarked')
    .select('*')
    .eq('id', id);

  if (error) handleError(error);
  return data;
}

// CREATE
export async function createBookmarked(bookmarked: BookmarkedRowInsert) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('bookmarked').insert({
    ...bookmarked,
    created_at: new Date().toISOString(),
  });

  if (error) handleError(error);
  return data;
}

// DELETE
export async function deleteBookmarked(id) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('bookmarked')
    .delete()
    .eq('id', id);

  if (error) handleError(error);
  return data;
}
