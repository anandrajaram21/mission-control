import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Button } from "react-native-elements";
const FirstScreen = ({ navigation }) => {
  // const [state, setState] = useState({
  //     Name:'',
  //     Email:'',
  //   })

  const print = () => {
    // console.log(state.Email)
    // if(state.Email){
    navigation.navigate("Signup");
    // }
  };

  return (
    //  <Untitled></Untitled>
    <View style={styles.container}>
      <Image
        source={{ uri: "https://i.imgur.com/420l6CL.jpg" }}
        style={{
          width: wp("80%"),
          height: wp("80%"),
          resizeMode: "cover",
          alignSelf: "center",
          borderRadius: wp("80%") / 2,
          overflow: "hidden",
          marginTop: wp("10%"),
        }}
      />
      <Text>{"\n"}</Text>
      <Text>{"\n"}</Text>
      <Text style={styles.text}>Welcome</Text>


      <Button title="Continue" buttonStyle={styles.button} onPress={print}/>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fafafa",
    resizeMode: "cover",
    flex: 1,
  },
  text: {
    fontSize: wp("10%"),
    textAlign: "center",
    fontFamily: "sans-serif",
    fontWeight: "100",
  },
  button: {
    marginTop: wp("15%"),
    width: wp("60%"),
    fontSize: wp("20%"),
    alignSelf: "center",
    textAlign: "center",
    paddingTop: wp("3%"),
    height: wp("10%"),
    backgroundColor: "#9370DB",
    color: "white",
    borderRadius: wp("20%"),
    marginLeft: wp("0%"),
  },
});

export default FirstScreen;
