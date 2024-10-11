'use server';

import { Database } from 'types_db';
import { createServerSupabaseClient } from 'utils/supabase/server';

export type CollectedRow = Database['public']['Tables']['collected']['Row'];
export type CollectedRowInsert =
  Database['public']['Tables']['collected']['Insert'];
export type CollectedRowUpdate =
  Database['public']['Tables']['collected']['Update'];

function handleError(error) {
  console.error(error);
  throw new Error(error.message);
}

// GET ALL COLLECTED (메인)
export async function getAllCollected() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('collected')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) handleError(error);
  return data;
}

// GET (서브)
export async function getCollected(id) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('collected')
    .select('*')
    .like('id', id);

  if (error) handleError(error);
  return data;
}

// CREATE
export async function createCollected(collected: CollectedRowInsert) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('collected').insert({
    ...collected,
    created_at: new Date().toISOString(),
  });

  if (error) handleError(error);
  return data;
}

// UPDATE
export async function updateCollected(collected: CollectedRowUpdate) {
  const supabase = await createServerSupabaseClient();

  if (!collected.id) throw new Error('id가 필요합니다.');

  const { data, error } = await supabase
    .from('collected')
    .update({
      ...collected,
      updated_at: new Date().toISOString(),
    })
    .eq('id', collected.id);

  if (error) handleError(error);
  return data;
}
