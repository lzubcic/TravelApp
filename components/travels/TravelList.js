import {useIsFocused} from '@react-navigation/native';
import {Icon} from '@rneui/base';
import {useCallback, useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, SafeAreaView} from 'react-native';
import {authenticationService} from '../../services/authentication.service';
import {userService} from '../../services/user.service';
import Loading from '../Loading';
import FilterModal from './FilterModal';
import TravelItem from './TravelItem';

const TravelList = ({navigation, route}) => {
  const {routeIsAdmin, currentUser} = route.params;
  const [isAdmin, setIsAdmin] = useState(routeIsAdmin);
  const [travels, setTravels] = useState(null);
  const [user, setUser] = useState(currentUser);
  const [modalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();

  const fetchUser = useCallback(async () => {
    const currentUser = await userService.getUser();
    const isAdmin = currentUser?.authorities.some(
      auth => auth === 'ROLE_ADMIN',
    );
    setIsAdmin(isAdmin);
    setUser(currentUser);
  }, [routeIsAdmin]);

  const fetchTravels = useCallback(async () => {
    const fetchedTravels = await fetch(
      `${authenticationService.apiUrl}/travel`,
    );
    const travels = await fetchedTravels.json();
    setTravels(travels);
  }, []);

  useEffect(() => {
    fetchTravels();
    fetchUser();
  }, [isFocused, fetchTravels, fetchUser]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.buttons}>
          {!!user ? (
            <>
              <Icon
                name="filter-alt"
                size={34}
                type="material"
                color="#0275d8"
                style={styles.filterIcon}
                onPress={() => setModalVisible(!modalVisible)}
              />
              {isAdmin && (
                <Icon
                  name="add"
                  size={30}
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
            <View style={styles.buttons}>
              <Icon
                name="filter-alt"
                size={32}
                type="material"
                color="#0275d8"
                style={styles.filterIcon}
                onPress={() => setModalVisible(!modalVisible)}
              />
              <Icon
                name={'login'}
                size={32}
                type="material"
                color="#0275d8"
                onPress={() => navigation.navigate('Login')}
              />
            </View>
          )}
        </View>
      ),
    });
  }, [user, isAdmin]);

  const toDetails = travelId =>
    navigation.navigate('Details', {travelId: travelId, isAdmin: isAdmin});

  if (!travels) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.scrollView}>
        <FlatList
          data={travels}
          renderItem={({item}) => (
            <TravelItem travel={item} handlePress={toDetails} />
          )}
        />
      </SafeAreaView>

      <FilterModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setTravels={setTravels}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    marginBottom: 15,
  },
  filter: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'flex-start',
  },
  filterIcon: {
    marginRight: 5,
  },
  newTravelIcon: {
    backgroundColor: '#0275d8',
    borderRadius: 20,
    marginEnd: 10,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default TravelList;
