export interface User {
  displayName: string;
  email: string;
  avatar: string;
  timeZone: string;
}

export interface AuthData {
  status: string;
  user?: UserInfo;
  ssoToken?: SsoCreateTokenResponse;
  authToken: IdentityToken;
  authorizationCode: string;
  isAd: boolean;
}

export interface AuthDataRefreshing {
  authData?: AuthData;
  isRefreshing: boolean;
}

export interface IdentityToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  expiresIn: number;
  rowKey: string;
}

export interface IdentityTokenInfo {
  uid: string;
  name: string;
  email: string;
  isFirstAccess: boolean;
  forgotPassword: boolean;
  showRates: boolean;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  rowKey: string;
  profileGuid: string;
  allow: boolean;
  isFirstAccess: boolean;
  forgotPassword: boolean;
  eId: string;
  showRates: boolean;
  uid: string;
  isAd: boolean;
}

export interface AuthToken {
  access_token: string;
  created_at: string;
  expires_in: number; // segundos (OAuth)
  token_type: string;

  // frontend-only
  expires_at?: number; // timestamp absoluto em ms
}

export interface UserCustomer {
  usuarioId: number;
  clienteId: number;
  razaoSocial: string;
  nomeFantasia: string;
  numeroDocumento: string;
  email: string;
}

export interface BankingAccount {
  banco: string;
  tipo: string;
  agencia: string;
  conta: string;
  codigoAgente: string;
}

export interface PhoneNumber {
  tipo: number;
  pais: number;
  ddd: number;
  numero: number;
}

export interface ContactPerson {
  nome: string;
  numeroDocumento: string;
  tipoResponsavel: number;
  dataNascimento: string;
  genero: string;
  telefones: PhoneNumber[];
  email: string;
  nacionalidade: string;
  participacao: number;
  descricaoFuncao: string;
  documentoNome: string;
}

export interface InstallmentQuota {
  parcela: number;
  valor: number;
}

export interface Installment {
  valor: number;
  parcelas: InstallmentQuota[];
}

export interface BannerFee {
  valor: number;
  prazo: Installment;
}

export interface Fee {
  codigo: number;
  descricao: string;
  debito: BannerFee;
  creditoAVista: BannerFee;
  creditoParcelado2a6: BannerFee;
  creditoParcelado7a13: BannerFee;
  creditoParceladoEmissor: BannerFee;
}

export interface BannerWalletFee {
  valor: number;
  prazo: number;
}

export interface FeeWallet {
  codigo: number;
  descricao: string;
  debito: BannerWalletFee;
  aVista: BannerWalletFee;
  credito: BannerWalletFee;
}

export interface Customer {
  numeroDocumento: string;
  razaoSocial: string;
  nomeFantasia: string;
  ramoAtividade: string;
  clientType: string;
  hasAnticipation: boolean;
  taxas: Fee[];
  taxasWallet: FeeWallet[];
  contasBancarias: BankingAccount[];
  contacts: ContactPerson[];
}

export interface SsoCreateTokenResponse {
  scope: string;
  idToken: string;
  eId: string;
  accessToken: string;
  expiresIn: number;
  tokenType: string;
  refreshToken: string;
}

export interface SsoIntrospectTokenResponse {
  iss: string;
  nbf: number;
  exp: number;
  aud: [];
  client_id: string;
  sub: string;
  auth_time: number;
  idp: string;
  amr: string;
  tenant: string;
  username: string;
  sid: string;
  iat: number;
  active: boolean;
  scope: string;
}
