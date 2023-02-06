import {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Icon} from '@rneui/base/dist/Icon';
import {StyleSheet, View} from 'react-native';
import Home from './components/Home';
import Login from './components/Login';
import TravelDetails from './components/travels/TravelDetails';
import TravelList from './components/travels/TravelList';
import {authenticationService} from './services/authentication.service';
import Profile from './components/Profile';
import Register from './components/Register';
import NewTravel from './components/admin/NewTravel';
import jwtDecode from 'jwt-decode';
import EditTravel from './components/admin/EditTravel';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    authenticationService.currentUser.subscribe(() =>
      authenticationService.getToken().then(user => {
        user ? setCurrentUser(user) : setCurrentUser(null);
        if (user) {
          const userFromJwt = jwtDecode(user);
          userFromJwt.auth === 'ROLE_ADMIN'
            ? setIsAdmin(true)
            : setIsAdmin(false);
        }
      }),
    );
  }, [currentUser]);

  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Travels"
        screenOptions={({navigation}) => ({
          headerTitleStyle: {
            color: '#0275d8',
            fontSize: 28,
            fontFamily: 'serif',
          },
          headerRight: () => (
            <View style={styles.buttons}>
              {!!currentUser ? (
                <>
                  {isAdmin && (
                    <Icon
                      name="add"
                      size={32}
                      type="material"
                      onPress={() => navigation.navigate('Create Travel')}
                      style={styles.newTravelIcon}
                      color="#fff"
                    />
                  )}
                  <Icon
                    name="person"
                    size={32}
                    type="material"
                    color="#0275d8"
                    onPress={() => navigation.navigate('Profile')}
                  />
                </>
              ) : (
                <Icon
                  name={'login'}
                  size={32}
                  type="material"
                  color="#0275d8"
                  onPress={() => navigation.navigate('Login')}
                />
              )}
            </View>
          ),
        })}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Travels"
          component={TravelList}
          initialParams={{isAdmin: isAdmin}}
        />
        <Stack.Screen name="Details" component={TravelDetails} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Create Travel" component={NewTravel} />
        <Stack.Screen name="Update Travel" component={EditTravel} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  newTravelIcon: {
    backgroundColor: '#0275d8',
    borderRadius: 20,
    marginEnd: 10,
  },
});

export default App;
