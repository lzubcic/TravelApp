import {StyleSheet, View, Text, ScrollView} from 'react-native';
import {useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Button, Input} from '@rneui/base';
import {travelService} from '../../services/travel.service';

const registerSchema = Yup.object({
  travelName: Yup.string().required('Travel name is required'),
  shortDescription: Yup.string().required('Short description is required'),
  price: Yup.string().required('Price is required'),
  spaceLeft: Yup.number().required('Number of spaces left is required'),
  transportation: Yup.string().required('Transportation is required'),
  description: Yup.string().required('Description is required'),
  imageUrl: Yup.string().required('Image url is required'),
});

const EditTravel = ({navigation, route}) => {
  const {travel} = route.params;
  const [transport, setTransport] = useState(travel.transportation);
  const checkTransport = t => t === transport;
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Formik
          initialValues={{
            id: travel?.id,
            travelName: travel?.travelName,
            shortDescription: travel?.shortDescription,
            price: travel?.price.toString(),
            spaceLeft: travel?.spaceLeft.toString(),
            transportation: travel?.transportation,
            description: travel?.description,
            imageUrl: travel?.imageUrl,
          }}
          validationSchema={registerSchema}
          onSubmit={(
            {
              id,
              travelName,
              shortDescription,
              price,
              spaceLeft,
              transportation,
              description,
              imageUrl,
            },
            {setSubmitting, setStatus},
          ) => {
            travelService
              .editTravel(
                id,
                travelName,
                shortDescription,
                price,
                spaceLeft,
                transportation,
                description,
                imageUrl,
              )
              .then(
                () => {
                  setSubmitting(false);
                  navigation.navigate('Travels');
                },
                error => {
                  console.log(error);
                  setSubmitting(false);
                  setStatus(error);
                },
              );
          }}
          enableReinitialize>
          {({
            handleChange,
            handleSubmit,
            setFieldValue,
            status,
            values,
            errors,
          }) => (
            <>
              {status && <Text style={styles.errorText}>{status}</Text>}
              <Input
                label="Travel Name"
                onChangeText={handleChange('travelName')}
                value={values.travelName}
                errorMessage={errors.travelName}
              />
              <Input
                label="Short Description"
                onChangeText={handleChange('shortDescription')}
                value={values.shortDescription}
                errorMessage={errors.shortDescription}
                multiline={true}
              />
              <Input
                label="Price"
                onChangeText={handleChange('price')}
                value={values.price}
                errorMessage={errors.price}
              />
              <Input
                label="Space Left"
                onChangeText={handleChange('spaceLeft')}
                value={values.spaceLeft}
                errorMessage={errors.spaceLeft}
                keyboardType="numeric"
              />
              <View style={styles.transportation}>
                <Button
                  title="Bus"
                  type={checkTransport('BUS') ? 'solid' : 'clear'}
                  style={styles.transportationBtn}
                  onPress={() => {
                    setTransport('BUS');
                    setFieldValue('transportation', 'BUS');
                  }}
                />
                <Button
                  title="Train"
                  type={checkTransport('TRAIN') ? 'solid' : 'clear'}
                  style={styles.transportationBtn}
                  onPress={() => {
                    setTransport('TRAIN');
                    setFieldValue('transportation', 'TRAIN');
                  }}
                />
                <Button
                  title="Plane"
                  type={checkTransport('PLANE') ? 'solid' : 'clear'}
                  style={styles.transportationBtn}
                  onPress={() => {
                    setTransport('PLANE');
                    setFieldValue('transportation', 'PLANE');
                  }}
                />
              </View>
              <Input
                label="Description"
                onChangeText={handleChange('description')}
                value={values.description}
                errorMessage={errors.description}
                multiline={true}
              />
              <Input
                label="Image Url"
                onChangeText={handleChange('imageUrl')}
                value={values.imageUrl}
                errorMessage={errors.imageUrl}
              />
              <Button mode="contained" onPress={handleSubmit}>
                Save
              </Button>
            </>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    flex: 1,
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
  transportation: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  transportationBtn: {
    marginHorizontal: 5,
  },
});

export default EditTravel;
