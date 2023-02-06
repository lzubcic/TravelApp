import {useIsFocused} from '@react-navigation/native';
import {Icon} from '@rneui/base';
import {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, SafeAreaView} from 'react-native';
import Loading from '../Loading';
import FilterModal from './FilterModal';
import TravelItem from './TravelItem';

const TravelList = ({navigation, route}) => {
  const [travels, setTravels] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();
  const {isAdmin} = route.params;

  useEffect(() => {
    fetchTravels();
    console.log(isAdmin);
  }, [isFocused, isAdmin]);

  const fetchTravels = async () => {
    const fetchedTravels = await fetch('http://10.0.2.2:8080/travel');
    const travels = await fetchedTravels.json();

    setTravels(travels);
  };

  const toDetails = travelId =>
    navigation.navigate('Details', {travelId: travelId, isAdmin: isAdmin});

  if (travels) {
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
        {/* TODO: figure out where to put filter button */}
        <View style={styles.filter}>
          <Icon
            name="filter-alt"
            size={34}
            type="material"
            color="#0275d8"
            style={styles.filterIcon}
            onPress={() => setModalVisible(!modalVisible)}
          />
        </View>

        <FilterModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          setTravels={setTravels}
        />
      </View>
    );
  } else {
    return <Loading />;
  }
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
    marginLeft: 5,
    marginBottom: 5,
    borderWidth: 2,
    borderColor: '#0275d8',
    borderRadius: 12,
  },
  newTravelIcon: {
    backgroundColor: '#0275d8',
    borderRadius: 20,
    marginEnd: 10,
  },
});

export default TravelList;
