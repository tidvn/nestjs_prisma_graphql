export interface JwtDto {
  sub: string;
  email: string;
  session_id: string;
  iat: number;
  exp: number;
}
