/**
 * 對應 supabase/migrations/0001_init.sql 的手動定義 schema。
 * Phase 3 之後若 schema 變多,改用 `pnpm db:types` 從 supabase CLI 自動產出。
 */
export type Database = {
  public: {
    Tables: {
      tools: {
        Row: {
          id: string;
          slug: string;
          name: string;
          tagline: string;
          description: string | null;
          github_repo: string | null;
          homepage_url: string | null;
          language: string | null;
          category: string | null;
          cover_image: string | null;
          status: 'active' | 'beta' | 'coming-soon' | 'archived';
          featured: boolean;
          sort_order: number;
          install: string | null;
          problem_statement: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          tagline: string;
          description?: string | null;
          github_repo?: string | null;
          homepage_url?: string | null;
          language?: string | null;
          category?: string | null;
          cover_image?: string | null;
          status?: 'active' | 'beta' | 'coming-soon' | 'archived';
          featured?: boolean;
          sort_order?: number;
          install?: string | null;
          problem_statement?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['tools']['Insert']>;
        Relationships: [];
      };
      news: {
        Row: {
          id: string;
          slug: string;
          title: string;
          summary: string | null;
          content: string | null;
          source_url: string | null;
          source_name: string | null;
          category: string | null;
          tags: string[];
          cover_image: string | null;
          published_at: string;
          created_at: string;
          ingest_source: string | null;
          external_id: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          summary?: string | null;
          content?: string | null;
          source_url?: string | null;
          source_name?: string | null;
          category?: string | null;
          tags?: string[];
          cover_image?: string | null;
          published_at?: string;
          created_at?: string;
          ingest_source?: string | null;
          external_id?: string | null;
        };
        Update: Partial<Database['public']['Tables']['news']['Insert']>;
        Relationships: [];
      };
      subscribers: {
        Row: {
          id: string;
          email: string;
          status: 'pending' | 'active' | 'unsubscribed';
          channels: string[];
          topics: string[];
          confirm_token: string | null;
          confirmed_at: string | null;
          source: string | null;
          created_at: string;
          unsubscribed_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          status?: 'pending' | 'active' | 'unsubscribed';
          channels?: string[];
          topics?: string[];
          confirm_token?: string | null;
          confirmed_at?: string | null;
          source?: string | null;
          created_at?: string;
          unsubscribed_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['subscribers']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
