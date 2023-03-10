import {Modal, View, StyleSheet, Alert} from 'react-native';
import {Formik} from 'formik';
import {Button, Input} from '@rneui/base';
import {travelService} from '../../services/travel.service';
import {useState} from 'react';

const FilterModal = ({modalVisible, setModalVisible, setTravels}) => {
  const [transport, setTransport] = useState(null);
  const checkTransport = t => t === transport;
  const setFilter = (t, setFieldValue) => {
    if (t === transport) {
      setTransport(null);
      setFieldValue('transportation', null);
    } else {
      setTransport(t);
      setFieldValue('transportation', t);
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Formik
            initialValues={{
              text: '',
              price: '',
              transportation: '',
            }}
            onSubmit={({text, price, transportation}, {setSubmitting}) =>
              travelService.filterTravels(text, price, transportation).then(
                travels => {
                  setTravels(travels);
                  setSubmitting(false);
                  setTransport(null);
                  setModalVisible(!modalVisible);
                },
                error => {
                  Alert.alert('Error ocurred while filtering travels: ', error);
                  setSubmitting(false);
                  setModalVisible(!modalVisible);
                },
              )
            }>
            {({handleChange, handleSubmit, setFieldValue, values, errors}) => (
              <>
                <Input
                  value={values.text}
                  onChangeText={handleChange('text')}
                  errorMessage={errors.text}
                  label="What are you looking for?"
                  leftIcon={{type: 'material', name: 'search'}}
                />
                <Input
                  value={values.price}
                  onChangeText={handleChange('price')}
                  errorMessage={errors.price}
                  label="Enter your budget"
                  leftIcon={{type: 'material', name: 'euro'}}
                />
                <View style={styles.transportation}>
                  <Button
                    title="Bus"
                    type={checkTransport('BUS') ? 'solid' : 'clear'}
                    style={styles.transportationBtn}
                    onPress={() => setFilter('BUS', setFieldValue)}
                  />
                  <Button
                    title="Train"
                    type={checkTransport('TRAIN') ? 'solid' : 'clear'}
                    style={styles.transportationBtn}
                    onPress={() => setFilter('TRAIN', setFieldValue)}
                  />
                  <Button
                    title="Plane"
                    type={checkTransport('PLANE') ? 'solid' : 'clear'}
                    style={styles.transportationBtn}
                    onPress={() => setFilter('PLANE', setFieldValue)}
                  />
                </View>
                <Button onPress={handleSubmit}>Search</Button>
              </>
            )}
          </Formik>
          <Button
            title="Close"
            type="clear"
            onPress={() => setModalVisible(!modalVisible)}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  transportation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  transportationBtn: {
    marginHorizontal: 5,
  },
});

export default FilterModal;
