export interface Token {
  token_type: string;
  exp: number;
  jti: string;
  user_id: number;
  phone: string;
  name: string;
  id: number;
  email: string | null;
}
