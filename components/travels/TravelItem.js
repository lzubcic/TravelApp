import {Card, Text} from '@rneui/base';
import {Button} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';

const TravelItem = ({travel, handlePress, cancel}) => {
  return (
    <Card>
      <Card.Title style={styles.title}>{travel?.travelName}</Card.Title>
      <Card.Divider />
      <Card.Image
        style={{padding: 0}}
        source={{
          uri: travel.imageUrl,
        }}
      />
      <Text style={styles.shortDescription}>{travel?.shortDescription}</Text>
      <View style={styles.footer}>
        <View style={styles.priceAndTransport}>
          <Text style={{fontSize: 14}}>{travel.price}€</Text>
          <Text style={styles.transport}>
            {travel.transportation === 'BUS' && '  🚌'}
            {travel.transportation === 'PLANE' && '  ✈️'}
            {travel.transportation === 'TRAIN' && '  🚂'}
          </Text>
        </View>
        {cancel ? (
          <Button
            title="Cancel"
            size="md"
            color="error"
            containerStyle={styles.detailsBtn}
            onPress={handlePress}
          />
        ) : (
          <Button
            title="Details"
            size="md"
            containerStyle={styles.detailsBtn}
            onPress={() => handlePress(travel.id)}
          />
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
  },
  shortDescription: {
    paddingTop: 10,
  },
  footer: {
    paddingTop: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transport: {
    fontSize: 18,
  },
  priceAndTransport: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsBtn: {
    borderRadius: 10,
  },
});

export default TravelItem;
