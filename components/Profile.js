import {Icon} from '@rneui/base';
import {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Alert} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {Button, Input} from '@rneui/base';
import {authenticationService} from '../services/authentication.service';
import {userService} from '../services/user.service';
import Loading from './Loading';
import TravelItem from './travels/TravelItem';

const Profile = ({navigation}) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
    navigation.setOptions({
      headerRight: () => (
        <Icon
          name="logout"
          size={32}
          type="material"
          color="#0275d8"
          onPress={async () => {
            await authenticationService.logout();
            navigation.navigate('Travels', {isAdmin: false});
          }}
        />
      ),
    });
  }, []);

  const fetchUser = async () => {
    const fetchedUser = await userService.getUser();
    const user = await fetchedUser;
    setUser(user);
  };

  const getToken = async () => {
    const token = await authenticationService.getToken();
    return token;
  };

  const handleCancel = async travelId => {
    Alert.alert(
      'Are you sure?',
      'Are you sure you want to cancel your travel?',
      [
        {
          text: 'Yes',
          onPress: async () =>
            await getToken().then(async token => {
              await userService.cancelTravel(travelId, token);
              navigation.navigate('Travels');
            }),
        },
        {
          text: 'No',
        },
      ],
    );
  };

  if (!user) {
    return <Loading />;
  } else if (user.travel) {
    user.travel.imageUrl = user.travel.imageURL;
  }

  return (
    <View>
      <Text>
        Welcome to your profile, {user?.firstName} {user?.lastName}!
      </Text>

      <Text>Your personal information</Text>

      <View style={styles.container}>
        <Formik
          initialValues={{
            username: user?.username || '',
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
          }}
          validationSchema={yup.object({
            username: yup.string().required('Username is required'),
            firstName: yup.string().required('First name is required'),
            lastName: yup.string().required('Last name is required'),
          })}
          onSubmit={(
            {username, firstName, lastName},
            {setStatus, setSubmitting},
          ) => {
            userService
              .updateUser(user.id, username, 'hack', firstName, lastName)
              .then(
                user => {
                  setSubmitting(false);
                  setUser(user);
                },
                error => {
                  setSubmitting(false);
                  setStatus(error);
                },
              );
          }}
          enableReinitialize>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            status,
            values,
            errors,
          }) => (
            <>
              {status && <Text style={styles.errorText}>{status}</Text>}
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
                Update
              </Button>
            </>
          )}
        </Formik>
      </View>
      {user.travel ? (
        <TravelItem
          travel={user.travel}
          handlePress={handleCancel}
          cancel={true}
        />
      ) : (
        <View>
          <Text>You currently don't have any travels.</Text>
          <Button
            title="Search travels"
            onPress={() => navigation.navigate('Travels')}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
});

export default Profile;
