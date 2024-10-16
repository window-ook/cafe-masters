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

// GET ALL COLLECTED By userId (메인)
export async function getAllCollected(userId) {
  if (!userId) throw new Error('유효하지 않은 userId');

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('collected')
    .select('*')
    .eq('userId', userId)
    .order('created_at', { ascending: true });

  if (error) handleError(error);
  return data;
}

// GET COLLECTED By id, userId (서브)
export async function getCollected(id, userId) {
  if (!userId) throw new Error('유효하지 않은 userId');

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('collected')
    .select('*')
    .eq('userId', userId)
    .eq('id', id);

  if (error) handleError(error);
  return data;
}

// COUNT COLLECTED
export async function countCollected(userId) {
  const supabase = await createServerSupabaseClient();
  const { data, count, error } = await supabase
    .from('collected')
    .select('*', { count: 'exact' })
    .eq('userId', userId);

  if (error) handleError(error);
  return { data, count };
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
export async function updateCollected(collected: CollectedRowUpdate, userId) {
  const supabase = await createServerSupabaseClient();

  if (!collected.id) throw new Error('id가 필요합니다.');

  const { data, error } = await supabase
    .from('collected')
    .update({
      ...collected,
      updated_at: new Date().toISOString(),
    })
    .eq('id', collected.id)
    .eq('userId', userId);

  if (error) handleError(error);
  return data;
}
