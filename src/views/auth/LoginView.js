import React from 'react';
// import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Logo from 'src/components/Logo';
// import API from '../../api';
import {proxy} from '../../proxy';
import {loginApi} from '../../api';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Grid,
  
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import FacebookIcon from 'src/icons/Facebook';
import GoogleIcon from 'src/icons/Google';
import Page from 'src/components/Page';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.indigo,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(8)
  },
  inputTextColor: {
    color: 'white'
  },
  leftCardSection: {
    fontSize: '3vh',
    color: 'white',
    justifyContent: "center",
    alignItems: "center",
    display: "flex"
    }

}));

const LoginView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  // const [email] = useState('')
  // const [password] = useState('')

  return (
    <Page className={classes.root} title="Login">
      <Container maxWidth="md">
        <Box
          display="flex"
          flexDirection="column"
          height="400px"
          justifyContent="center"
          boxShadow={20}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box ml={4}>
                <Typography variant="h2" color="textSecondary">
                  {' '}
                  <Logo /> MatX Pro
                </Typography>
                <Typography variant="h4" color="textSecondary">
                  Admin Dashboard
                </Typography>
                <Container>
                <Box className={classes.leftCardSection} mt={5}>
                  <ul>
                    <li>JWT, FireBase & Auth0 Authentication</li>
                    <li>Clean & Organised code</li>
                    <li>Limitless Pages & Components</li>
                  </ul>
                </Box>
                </Container>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Formik
                initialValues={{
                  email: '',
                  password: ''
                }}
                validationSchema={Yup.object().shape({
                  email: Yup.string()
                    .email('Must be a valid email')
                    .max(255)
                    .required('Email is required'),
                  password: Yup.string()
                    .max(255)
                    .required('Password is required')
                })}
                onSubmit={(value) => {
                  
                  axios.post(`${proxy}/${loginApi}`, value).then(res => {
                    console.log(res.data)
                    if (res.data.success === true && res.data.token !== "") {
                      
                      
                      alert("Logged in successfully");
                      localStorage.setItem("Token", res.data.token);
                      navigate('/app/dashboard', { replace: true });
                      // props.history.push("/app/dashboard");
                    } else {
                      alert("Incurrect email or password");
                    }
                  })
                  
                }}
              >
                {({
                  errors,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  // isSubmitting,
                  touched,
                  values
                }) => (
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={12}>
                        <Button
                          color="primary"
                          fullWidth
                          startIcon={<FacebookIcon />}
                          onClick={handleSubmit}
                          size="large"
                          variant="contained"
                        >
                          Login with Facebook
                        </Button>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Button
                          fullWidth
                          startIcon={<GoogleIcon />}
                          onClick={handleSubmit}
                          size="large"
                          variant="contained"
                        >
                          Login with Google
                        </Button>
                      </Grid>
                    </Grid>
                    <Box mt={3} mb={1}>
                      <Typography
                        align="center"
                        color="textSecondary"
                        variant="body1"
                      >
                        or login with email address
                      </Typography>
                    </Box>
                    <Box mr={4} ml={2}>
                      <TextField
                        error={Boolean(touched.email && errors.email)}
                        fullWidth
                        helperText={touched.email && errors.email}
                        label="Email Address"
                        margin="normal"
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="email"
                        value={values.email}
                        variant="outlined"
                        size="small"
                        InputProps={{
                          className: classes.inputTextColor
                        }}
                      />
                      <TextField
                        error={Boolean(touched.password && errors.password)}
                        fullWidth
                        helperText={touched.password && errors.password}
                        label="Password"
                        margin="normal"
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="password"
                        value={values.password}
                        variant="outlined"
                        size="small"
                        InputProps={{
                          className: classes.inputTextColor
                        }}
                      />
                    </Box>
                    <Box mr={4} ml={2} mb={2}>
                      <Button
                        color="primary"
                        // disabled={isSubmitting}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                      >
                        Sign in now
                      </Button>
                    </Box>
                    {/* <Typography color="textSecondary" variant="body1">
                      Don&apos;t have an account?{' '}
                      <Link component={RouterLink} to="/register" variant="h6">
                        Sign up
                      </Link>
                    </Typography> */}
                  </form>
                )}
              </Formik>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
};

export default LoginView;
