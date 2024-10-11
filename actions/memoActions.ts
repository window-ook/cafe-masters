'use server';

import { Database } from 'types_db';
import { createServerSupabaseClient } from 'utils/supabase/server';

export type MemoRow = Database['public']['Tables']['memo']['Row'];
export type MemoRowInsert = Database['public']['Tables']['memo']['Insert'];
export type MemoRowUpdate = Database['public']['Tables']['memo']['Update'];

function handleError(error) {
  console.error(error);
  throw new Error(error.message);
}

// GET ALL MEMO
export async function getAllMemo() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('memo')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) handleError(error);
  return data;
}

// GET
export async function getThisMemo({ id }) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('memo')
    .select('*')
    .like('id', id);

  if (error) handleError(error);
  return data;
}

// CREATE
export async function createMemo(memo: MemoRowInsert) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('memo').insert({
    ...memo,
    created_at: new Date().toISOString(),
  });

  if (error) handleError(error);
  return data;
}

// UPDATE
export async function updateMemo(memo: MemoRowUpdate) {
  const supabase = await createServerSupabaseClient();

  if (!memo.id) throw new Error('id가 필요합니다.');

  const { data, error } = await supabase
    .from('memo')
    .update({
      ...memo,
      updated_at: new Date().toISOString(),
    })
    .eq('id', memo.id);

  if (error) handleError(error);
  return data;
}
