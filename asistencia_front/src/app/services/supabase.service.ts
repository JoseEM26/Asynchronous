import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private activitySubject = new Subject<any>();

  constructor() {
    // Reemplaza con tu URL y Anon Key reales
    const supabaseUrl = 'https://dfzsxkqkcwaeckzldswd.supabase.co';
    const supabaseKey = 'TU_SUPABASE_ANON_KEY'; // El usuario debe completar esto
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.listenToActivity();
  }

  private listenToActivity() {
    this.supabase
      .channel('public:logs_actividad')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'logs_actividad' }, payload => {
        console.log('Nueva actividad recibida!', payload);
        this.activitySubject.next(payload.new);
      })
      .subscribe();
  }

  getActivityFeed(): Observable<any> {
    return this.activitySubject.asObservable();
  }

  async getInitialLogs() {
    const { data, error } = await this.supabase
      .from('logs_actividad')
      .select('*')
      .order('creado_en', { ascending: false })
      .limit(10);
    return data || [];
  }
}
