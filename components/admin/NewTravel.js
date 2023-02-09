import {StyleSheet, View, Text, ScrollView} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Button, Input} from '@rneui/base';
import {travelService} from '../../services/travel.service';
import {useState} from 'react';

const registerSchema = Yup.object({
  travelName: Yup.string().required('Travel name is required'),
  shortDescription: Yup.string().required('Short description is required'),
  price: Yup.string().required('Price is required'),
  spaceLeft: Yup.string().required('Number of spaces left is required'),
  transportation: Yup.string().required('Transportation is required'),
  description: Yup.string().required('Description is required'),
  imageUrl: Yup.string().required('Image url is required'),
});

const NewTravel = ({navigation}) => {
  const [transport, setTransport] = useState('BUS');
  const checkTransport = t => t === transport;
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Formik
          initialValues={{
            travelName: '',
            shortDescription: '',
            price: '',
            spaceLeft: '',
            transportation: 'BUS',
            description: '',
            // set for easier travel creation
            imageUrl:
              'https://assets.wego.com/image/upload/v1611848131/country-pages/hr.jpg',
          }}
          validationSchema={registerSchema}
          onSubmit={(
            {
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
              .createTravel(
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
            handleBlur,
            setFieldValue,
            status,
            values,
            touched,
            errors,
          }) => (
            <>
              {status && <Text style={styles.errorText}>{status}</Text>}
              <Input
                label="Travel Name"
                onChangeText={handleChange('travelName')}
                onBlur={handleBlur('travelName')}
                value={values.travelName}
                errorMessage={touched.travelName && errors.travelName}
              />
              <Input
                label="Short Description"
                onChangeText={handleChange('shortDescription')}
                onBlur={handleBlur('shortDescription')}
                value={values.shortDescription}
                errorMessage={
                  touched.shortDescription && errors.shortDescription
                }
                multiline={true}
              />
              <Input
                label="Price"
                onChangeText={handleChange('price')}
                onBlur={handleBlur('price')}
                value={values.price}
                errorMessage={touched.price && errors.price}
                keyboardType="numeric"
              />
              <Input
                label="Space Left"
                onChangeText={handleChange('spaceLeft')}
                onBlur={handleBlur('spaceLeft')}
                value={values.spaceLeft}
                errorMessage={touched.spaceLeft && errors.spaceLeft}
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
                onBlur={handleBlur('description')}
                value={values.description}
                errorMessage={touched.description && errors.description}
                multiline={true}
              />
              <Input
                label="Image Url"
                onChangeText={handleChange('imageUrl')}
                onBlur={handleBlur('imageUrl')}
                value={values.imageUrl}
                errorMessage={touched.imageUrl && errors.imageUrl}
              />
              <Button mode="contained" onPress={handleSubmit}>
                Create
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

export default NewTravel;
