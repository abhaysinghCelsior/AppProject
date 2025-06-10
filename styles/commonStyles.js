
import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  sectionStyle: {
    margin: 10,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  inputStyle: {
    height: 90,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
    width:250,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: "url('../Image/logo.png')",
    backgroundSize: "cover",   // Ensures the image covers the entire area
    backgroundPosition: "center", // Centers the image
    backgroundRepeat: "no-repeat", // Prevents tiling
  },
  inputContainer: {
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    height: 200,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
    width:150
  },
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#307ecc',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  SectionStyleTitle: {
    flexDirection: 'row',
    height: 1,
    marginLeft: 40,
  },
  buttonStyle: {
    backgroundColor: '#7DE24E',
    borderWidth: 1,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 10,
  },
  buttonStyle1: {
    backgroundColor: '#7DE24E',
    borderWidth: 1,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 10,
    width: '70%',
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
    alignSelf: 'center',
  },
  titleStyle: {
    color: 'blue',
    fontSize: 14,
    alignSelf: 'left',
  },
  registerTextStyle: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  ImgStyle:{
    width: '50%',
    height: 50,
    resizeMode: 'contain',
    margin: 30,
  },
  successTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    padding: 30,
  },
  tailorStyle:{
    fontSize: 10,
    textAlign: 'center',
    color: 'grey',
  }
});