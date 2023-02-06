import {useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {Button, Input} from '@rneui/base';
import {authenticationService} from '../services/authentication.service';
import jwtDecode from 'jwt-decode';

const loginSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const Login = ({navigation}) => {
  useEffect(() => {
    navigation.setOptions({
      headerRight: null,
    });
  }, []);

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{username: '', password: ''}}
        validationSchema={loginSchema}
        onSubmit={({username, password}, {setStatus, setSubmitting}) => {
          authenticationService.login(username, password).then(
            () => {
              navigation.navigate('Travels');
            },
            error => {
              setSubmitting(false);
              setStatus(error);
            },
          );
        }}>
        {({handleChange, handleBlur, handleSubmit, status, values, errors}) => (
          <>
            {status && <Text style={styles.errorText}>{status}</Text>}
            <Input
              label="Username"
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
              errorMessage={errors.username}
            />
            <Input
              label="Password"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              // errorMessage={errors.password}
              secureTextEntry={true}
            />
            <Button mode="contained" onPress={handleSubmit}>
              Log In
            </Button>
            <View style={styles.register}>
              <Text>Don't have an account?</Text>
              <Button
                title="Register"
                type="clear"
                onPress={() => navigation.navigate('Register')}
              />
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
  register: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Login;
