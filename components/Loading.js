import {View, Text, StyleSheet} from 'react-native';

const Loading = () => (
  <View style={styles.loading}>
    <Text>Loading...</Text>
  </View>
);

const styles = StyleSheet.create({
  loading: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;
