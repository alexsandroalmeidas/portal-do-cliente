export const environment = {
  production: false,
  debug: false,

  appName: 'Portal do Cliente',
  appI18nPrefix: '',
  appCheckForUpdateInterval: 100 * 60,

  medalliaJs: 'https://nebula-cdn.kampyle.com/eu/we/894107/onsite/embed.js',

  prepaymentLink: '//api.whatsapp.com/send?phone=5591991886012',

  proxyBaseUrl: 'https://api-minhaconta-dev.puntobrasil.com.br/portal-accounts',
  //proxyBaseUrl: 'https://localhost:61694',

  pushNotificationsPublicKey:
    'BFerYPugjaPx0npceUR99oXPjol2FkibVf40s6h94I_80PEJlk3rgwx6_rb-eCMs8Iq_8OQQJ_UgyPdzfeS2zrE',

  receivablesClickHere: 'https://puntobrasil.com.br',

  reportsSignalRUrl: 'https://api-minhaconta-dev.puntobrasil.com.br/signalr-reports',

  ssoRedirectUrl:
    'https://sso.sbx.edenred.io/connect/authorize?client_id=cd2957d9ef9340eeb53a4bb699e76152&acr_values=tenant:br-puntoo&scope=openid%20profile%20offline_access%20erbr-puntoo-portal-api&redirect_uri=http://localhost:4200&ui_locales=brp&response_type=code'
};
