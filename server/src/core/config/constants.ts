export const APP_CONFIG = {
  // all nodes envs
  NODE_ENVS: {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
  } as const,

  // all module related constants
  MODULE_CONFIG: {
    DIR_NAME: 'modules',
    CURRENT_VERSION: 'v1',
  } as const,

  // all winston related constants
  WINSTON_CONFIG: {
    TIMESTAMP_FORMAT: 'HH:mm:ss',
  } as const,
};
