import {Icon} from '@rneui/base';
import {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Header = () => {
  const [user, setUser] = useState(false);
  return (
    <View style={styles.header}>
      <Icon
        name={user ? 'person' : 'login'}
        size={32}
        type="material"
        color="#0275d8"
      />
      <Text style={styles.text}>Travel buddy</Text>
      <Icon name="filter" size={28} type="font-awesome" color="#a8a8a8" />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  text: {
    color: '#0275d8',
    fontSize: 28,
    textAlign: 'center',
    fontFamily: 'serif',
  },
});

export default Header;
