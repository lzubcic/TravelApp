import {StyleSheet, View} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {Button, Input} from '@rneui/base';
import {userService} from '../services/user.service';

const registerSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
});

const Register = ({navigation}) => (
  <View style={styles.container}>
    <Formik
      initialValues={{username: '', password: '', firstName: '', lastName: ''}}
      validationSchema={registerSchema}
      onSubmit={(
        {username, password, firstName, lastName},
        {setStatus, setSubmitting},
      ) => {
        userService.addUser(username, password, firstName, lastName).then(
          () => {
            navigation.navigate('Login');
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
          <Input
            label="First name"
            onChangeText={handleChange('firstName')}
            onBlur={handleBlur('firstName')}
            value={values.firstName}
            errorMessage={errors.firstName}
          />
          <Input
            label="Last name"
            onChangeText={handleChange('lastName')}
            onBlur={handleBlur('lastName')}
            value={values.lastName}
            errorMessage={errors.lastName}
          />
          <Button mode="contained" onPress={handleSubmit}>
            Register
          </Button>
        </>
      )}
    </Formik>
  </View>
);

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
});

export default Register;
