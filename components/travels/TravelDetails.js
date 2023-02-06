import {Button, Icon} from '@rneui/base';
import {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, Alert} from 'react-native';
import {authenticationService} from '../../services/authentication.service';
import {travelService} from '../../services/travel.service';
import {userService} from '../../services/user.service';
import Loading from '../Loading';

const TravelDetails = ({navigation, route}) => {
  const {travelId, isAdmin} = route.params;
  const [travel, setTravel] = useState(null);
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const fetchedUser = await userService.getUser();
    const user = await fetchedUser;

    return user;
  };

  const fetchTravel = useCallback(async () => {
    const fetchedTravel = await fetch(
      `${authenticationService.apiUrl}/travel/${travelId}`,
    );
    const travel = await fetchedTravel.json();
    setTravel(travel);
  }, [travelId]);

  const bookTravel = async () => {
    const token = await authenticationService.getToken();
    if (!token) {
      navigation.navigate('Login');
    } else {
      await fetchUser()
        .then(
          async user => await userService.bookTravel(user.id, travel.id, token),
        )
        .then(() => navigation.navigate('Profile'));
    }
  };

  useEffect(() => {
    fetchTravel();
    fetchUser().then(user => setUser(user));
    isAdmin &&
      navigation.setOptions({
        headerRight: () => (
          <>
            <Icon
              name="delete"
              size={32}
              type="material"
              color="#0275d8"
              onPress={() => {
                Alert.alert(
                  'Are you sure?',
                  `Are you sure you want to delete ${travel?.travelName}?`,
                  [
                    {
                      text: 'Yes',
                      onPress: () => {
                        travelService.deleteTravel(travelId);
                        navigation.navigate('Travels');
                      },
                    },
                    {
                      text: 'No',
                    },
                  ],
                );
              }}
            />
            <Icon
              name="edit"
              size={32}
              type="material"
              color="#0275d8"
              onPress={() =>
                navigation.navigate('Update Travel', {travel: travel})
              }
            />
          </>
        ),
      });
  }, [fetchTravel, isAdmin, travel]);

  if (!travel) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Image style={styles.image} source={{uri: travel.imageUrl}} />
        <Text style={styles.title}>{travel.travelName}</Text>

        <View style={styles.dateAndTransport}>
          <Text>Space left: {travel.spaceLeft}</Text>
          <Text>Traveling by: {travel.transportation}</Text>
        </View>

        <Text style={styles.shortDesc}>{travel.shortDescription}</Text>
        <Text style={styles.desc}>{travel.description}</Text>

        <Text style={styles.price}>{travel.price}€</Text>

        <>
          {travel.id === 100 && travel.spaceLeft < 75 && !!user ? (
            <Button disabled={true}>Travel already booked</Button>
          ) : (
            <Button mode="contained" onPress={() => bookTravel()}>
              Book travel
            </Button>
          )}
        </>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    flex: 1,
  },
  scrollView: {
    flex: 1,
    marginBottom: 15,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dateAndTransport: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    height: 250,
    borderRadius: 50,
  },
  shortDesc: {
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
  desc: {
    marginBottom: 15,
    fontSize: 16,
  },
  price: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TravelDetails;
