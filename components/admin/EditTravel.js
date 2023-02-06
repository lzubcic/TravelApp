import {StyleSheet, View, Text} from 'react-native';
import {useEffect} from 'react';
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
  return (
    <View style={styles.container}>
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
          handleBlur,
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
              onBlur={handleBlur('travelName')}
              value={values.travelName}
              errorMessage={errors.travelName}
            />
            <Input
              label="Short Description"
              onChangeText={handleChange('shortDescription')}
              onBlur={handleBlur('shortDescription')}
              value={values.shortDescription}
              errorMessage={errors.shortDescription}
            />
            <Input
              label="Price"
              onChangeText={handleChange('price')}
              onBlur={handleBlur('price')}
              value={values.price}
              errorMessage={errors.price}
              //   keyboardType="numeric"
            />
            <Input
              label="Space Left"
              onChangeText={handleChange('spaceLeft')}
              onBlur={handleBlur('spaceLeft')}
              value={values.spaceLeft}
              errorMessage={errors.spaceLeft}
              keyboardType="numeric"
            />
            <View style={styles.transportation}>
              <Button
                title="Bus"
                type="clear"
                style={styles.transportationBtn}
                onPress={() => setFieldValue('transportation', 'BUS')}
              />
              <Button
                title="Train"
                type="clear"
                style={styles.transportationBtn}
                onPress={() => setFieldValue('transportation', 'TRAIN')}
              />
              <Button
                title="Plane"
                type="clear"
                style={styles.transportationBtn}
                onPress={() => setFieldValue('transportation', 'PLANE')}
              />
            </View>
            <Input
              label="Description"
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              value={values.description}
              errorMessage={errors.description}
              multiline={true}
            />
            <Input
              label="Image Url"
              onChangeText={handleChange('imageUrl')}
              onBlur={handleBlur('imageUrl')}
              value={values.imageUrl}
              errorMessage={errors.imageUrl}
            />
            <Button mode="contained" onPress={handleSubmit}>
              Save
            </Button>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
