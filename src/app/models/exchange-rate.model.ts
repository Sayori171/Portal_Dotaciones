/** Respuesta de la API pública https://open.er-api.com/v6/latest/USD */
export interface ExchangeRateResponse {
  result: string;
  base_code: string;
  rates: Record<string, number>;
}
