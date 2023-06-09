import LoadingButton from '@mui/lab/LoadingButton';
import { Box, CircularProgress, Grid, styled } from '@mui/material';
import { t } from 'i18next';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useFormItem } from '../../common/hooks/use-form-item';
import { InputType } from '../../common/hooks/use-form-item/types';
import { and } from '../../common/hooks/use-form-item/validators/compositions';
import { required } from '../../common/hooks/use-form-item/validators/existential';
import { maxLength } from '../../common/hooks/use-form-item/validators/operational';

type Props = {
  errors: any;
  onSubmit: (loginCredentials: any) => void;
};

const FormWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : 'transparent',
  ...theme.typography.body2,
  padding: `${theme.spacing(1)} 0`,
  textAlign: 'left',
  color: theme.palette.text.secondary,
}));

export const LoginForm = (props: Props) => {
  const { errors = {}, onSubmit } = props;

  const [loading, setLoading] = useState(false);

  const [username, usernameComponent, isUsernameValid, , , setUsernameError] = useFormItem({
    type: InputType.TYPE_TEXT,
    label: t('usernameOrEmail'),
    value: '',
    validator: and(required(), maxLength(255)),
    inputOptions: {
      disabled: loading,
      variant: 'standard',
      autoFocus: true,
    },
  });
  const [password, passwordComponent, isPasswordValid, , , setPasswordError] = useFormItem({
    type: InputType.TYPE_PASSWORD,
    label: t('password'),
    value: '',
    validator: and(required(), maxLength(255)),
    inputOptions: {
      disabled: loading,
      variant: 'standard',
    },
  });

  useEffect(() => {
    for (let key in errors) {
      if (!errors.hasOwnProperty(key)) {
        continue;
      }

      const value = errors[key];
      switch (key) {
        case 'username':
          setUsernameError(value);
          break;
        case 'password':
          setPasswordError(value);
          break;
      }
    }
  }, [errors]); // eslint-disable-line

  const handleFormSubmission = async (e: SyntheticEvent) => {
    e.preventDefault();

    setLoading(true);
    await onSubmit({ username, password });
    setLoading(false);
  };

  const loadingIndicator = (
    <span>
      <CircularProgress color="inherit" size={16} style={{ verticalAlign: 'middle' }} /> <span style={{ verticalAlign: 'middle' }}>{t('signIn')}</span>
    </span>
  );

  const areAllValid = isUsernameValid && isPasswordValid;

  return (
    <form onSubmit={handleFormSubmission}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <FormWrapper>{usernameComponent}</FormWrapper>
        </Grid>

        <Grid item xs={12}>
          <FormWrapper>{passwordComponent}</FormWrapper>
        </Grid>

        <Grid item xs={12}>
          <FormWrapper sx={{ textAlign: 'center' }}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={loading}
              loadingIndicator={loadingIndicator}
              style={{ width: '100%' }}
              disabled={!areAllValid}
            >
              {t('signIn')}
            </LoadingButton>
          </FormWrapper>
        </Grid>
      </Grid>
    </form>
  );
};
