import { t } from 'i18next';

export enum ProfileType {
  TRACER = 'TRACER',
  FUZZER = 'FUZZER',
}

export const getProfileTypeLabel = (profileType: ProfileType): string => {
  const labels = {
    [ProfileType.TRACER]: t('tracer'),
    [ProfileType.FUZZER]: t('fuzzer'),
  };

  return labels[profileType] || profileType;
};
