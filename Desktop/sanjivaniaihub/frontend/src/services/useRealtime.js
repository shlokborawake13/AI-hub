import { useEffect } from 'react';
import { supabase } from '../services/supabase';

/**
 * Subscribe to Supabase realtime changes on a table.
 * Calls onInsert / onUpdate / onDelete when changes happen.
 * Automatically unsubscribes on unmount.
 */
export function useRealtime(table, { onInsert, onUpdate, onDelete } = {}) {
  useEffect(() => {
    const channel = supabase
      .channel(`realtime:${table}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table }, payload => {
        onInsert?.(payload.new);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table }, payload => {
        onUpdate?.(payload.new, payload.old);
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table }, payload => {
        onDelete?.(payload.old);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [table]);
}
