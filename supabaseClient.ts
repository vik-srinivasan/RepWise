import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yqsczhojpoebguwezaix.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlxc2N6aG9qcG9lYmd1d2V6YWl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwOTE5MzksImV4cCI6MjA0ODY2NzkzOX0.H6bbZl9DgZ6p_LqOfUScAjIStEkrlIP0cc0rrvgX5Sw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
