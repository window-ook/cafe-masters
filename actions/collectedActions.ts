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

/**
 * GET ALL COLLECTED By userId (메인)
 */
export async function getAllCollected(userId) {
  if (!userId) {
    console.error('유효하지 않은 userId');
    return;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('collected')
    .select('*')
    .eq('userId', userId)
    .order('created_at', { ascending: true });

  if (error) handleError(error);
  return data;
}

/**
 * GET COLLECTED By id, userId (서브)
 */
export async function getCollected(id, userId) {
  if (!userId) {
    console.error('유효하지 않은 userId');
    return;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('collected')
    .select('*')
    .eq('userId', userId)
    .eq('id', id);

  if (error) handleError(error);
  return data;
}

/**
 * COUNT COLLECTED
 */
export async function countCollected(userId) {
  if (!userId) {
    console.error('유효하지 않은 userId');
    return;
  }

  const supabase = await createServerSupabaseClient();
  const { data, count, error } = await supabase
    .from('collected')
    .select('*', { count: 'exact' })
    .eq('userId', userId);

  if (error) handleError(error);
  return { data, count };
}

/**
 * CREATE COLLECTED
 */
export async function createCollected(collected: CollectedRowInsert) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('collected').insert({
    ...collected,
    created_at: new Date().toISOString(),
  });

  if (error) handleError(error);
  return data;
}

/**
 * UPDATE COLLECTED
 */
export async function updateCollected(
  collected: CollectedRowUpdate,
  id,
  userId
) {
  if (!userId || !id) {
    console.error('유효하지 않은 userId or id');
    return;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('collected')
    .update({
      ...collected,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('userId', userId);

  if (error) handleError(error);
  return data;
}
