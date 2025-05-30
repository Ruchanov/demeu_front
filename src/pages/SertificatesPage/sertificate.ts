export interface Certificate {
    user_id: number;
    user_name: string;
    level: 'gold' | 'silver' | 'bronze';
    certificate_url: string;
    achieved_at?: string;
}