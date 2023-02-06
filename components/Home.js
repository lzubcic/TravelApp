import {Text, View} from 'react-native';

const Home = () => {
  //const currentUser = localStorage.getItem("token");
  return (
    <View style={{textAlign: 'center'}}>
      <View
        style={{
          textAlign: 'center',
          backgroundImage:
            'url(https://www.candorblog.com/wp-content/uploads/2017/05/travel-022.jpg)',
          color: 'white',
        }}>
        <View>
          <Text>Welcome to Travel Buddy!</Text>
          {/* <Link to="/travels" className="btn btn-primary mx-3">
            Search for travels✈️
          </Link>
          <Link to="/login" className="btn btn-success mx-3">
            {currentUser ? "My profile" : "Log in"}👤
          </Link> */}
        </View>
      </View>
    </View>
  );
};

export default Home;
