import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import qs from 'qs';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import {
  Link,
  Stack,
  Alert,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
//
import { MIconButton } from '../../@material-extend';
import { useGoogleLogin } from '@react-oauth/google';

import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import Button from '@mui/material/Button';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
// ----------------------------------------------------------------------
type InitialValues = {
  email: string;
  password: string;
  remember: boolean;
  afterSubmit?: string;
};

export default function LoginForm() {
  const { login, loginGoogle, loginFacebook, loginGitHub } = useAuth();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
  });
  // handle on form
  const formik = useFormik<InitialValues>({
    initialValues: {
      email: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        await login(values.email, values.password);

        enqueueSnackbar('Login success', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } catch (error) {
        console.error(error);
        resetForm();
        if (isMountedRef.current) {
          setSubmitting(false);
          setErrors({ afterSubmit: error.message });
        }
      }
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  // handle OIDC to retrieve ID_TOKEN
  const handleLoginGoogle = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        if (!codeResponse.code) {
          return;
        }
        const config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        };
        console.log(codeResponse.code)
        const data = qs.stringify({
          code: codeResponse.code,
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          client_secret: process.env.REACT_APP_GOOGLE_SECRET_KEY,
          // redirect_uri: process.env.REACT_APP_REDIRECT_URL,

          redirect_uri: 'http://localhost:3000',
          grant_type: 'authorization_code'
        });

        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', data, config);
        await loginGoogle(tokenResponse.data.id_token);

        enqueueSnackbar('Login success', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      } catch (error) {
        console.error(error);
        if (isMountedRef.current) {
          // setErrors({ afterSubmit: error.message });
        }
      }
    },
    flow: 'auth-code'
  });
  const handleLoginGithubRedirect = async () => {
    window.location.assign(
      'https://github.com/login/oauth/authorize?client_id=' + process.env.REACT_APP_GITHUB_CLIENT_ID
    );
  };
  const handleLoginFacebook = async (response: any) => {
    try {
      await loginFacebook(response.accessToken);

      enqueueSnackbar('Login success', {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    } catch (error) {
      if (isMountedRef.current) {
        // setErrors({ afterSubmit: error.message });
      }
    }
  };
  useEffect(() => {
    handleLoginGithub();
  }, []);

  async function handleLoginGithub() {
    try {
      const code = new URLSearchParams(window.location.search).get('code');
      if (code && localStorage.getItem('accessToken') === null) {
        await loginGitHub(code);

        enqueueSnackbar('Login success', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      }
    } catch (error) {
      if (isMountedRef.current) {
        // setErrors({ afterSubmit: error.message });
      }
    }
  }

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />

          <Link component={RouterLink} variant="subtitle2" to={PATH_AUTH.resetPassword}>
            Forgot password?
          </Link>
        </Stack>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ my: 2 }}
          gap={1}
        >
          <LoadingButton
            sx={{ width: '150px' }}
            variant="outlined"
            size="large"
            onClick={() => handleLoginGoogle()}
            startIcon={<GoogleIcon />}
          >
            Google
          </LoadingButton>
          <LoadingButton
            sx={{ width: '150px' }}
            variant="outlined"
            size="large"
            onClick={() => handleLoginGithubRedirect()}
            startIcon={<GitHubIcon />}
          >
            Github
          </LoadingButton>

          <FacebookLogin
            appId="475688768116036"
            autoLoad={false}
            fields="name,email,picture"
            callback={handleLoginFacebook}
            textButton="HIHI"
            render={(renderProps) => (
              <Button
                onClick={renderProps.onClick}
                variant="outlined"
                size="large"
                startIcon={<FacebookIcon />}
              >
                Facebook
              </Button>
            )}
          />
        </Stack>
      </Form>
    </FormikProvider>
  );
}
