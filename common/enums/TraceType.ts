import { t } from 'i18next';

export enum TraceType {
  JAVA = 'JAVA',
  EVP = 'EVP',
  LIBSSL = 'LIBSSL',
  PKCS11_FUZZING = 'PKCS11_FUZZING',
  PKCS11_USAGE = 'PKCS11_USAGE',
  DOTNET = 'DOTNET',
  HOST_SCANNER = 'HOST_SCANNER',
  NETWORK = 'NETWORK',
}

export const TRACE_TYPES_WITH_OPERATIONS: TraceType[] = [TraceType.DOTNET, TraceType.EVP, TraceType.JAVA, TraceType.PKCS11_USAGE];

export const APPLICATION_TRACE_TYPES: TraceType[] = [TraceType.DOTNET, TraceType.JAVA, TraceType.EVP, TraceType.LIBSSL, TraceType.PKCS11_USAGE];

export const getTraceTypeLabel = (traceType: TraceType): string => {
  const labels = {
    [TraceType.JAVA]: t('traceType.java'),
    [TraceType.EVP]: t('traceType.evp'),
    [TraceType.LIBSSL]: t('traceType.libssl'),
    [TraceType.PKCS11_FUZZING]: t('traceType.pkcsFuzzing'),
    [TraceType.PKCS11_USAGE]: t('traceType.pkcsUsage'),
    [TraceType.DOTNET]: t('traceType.dotNet'),
    [TraceType.HOST_SCANNER]: t('traceType.hostScanner'),
    [TraceType.NETWORK]: t('traceType.network'),
  };

  return labels[traceType] || traceType;
};
