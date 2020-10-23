import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { ListItem, Icon, Button } from "react-native-elements";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import { post } from "./../../api/fetch";
const showAllAssignments = ({ navigation }) => {
  const Assignments = navigation.getParam("other");
  const token = navigation.getParam("data");
  const id = navigation.getParam("id");
  const [validExtension, setValidExtension] = useState(false);
  console.log(id);
  async function pressHandler(_id) {
    var params = {
      duration: id,
      assignmentID: _id,
    };

    var formBody = encodeData(params);
    console.log(formBody);
    let response = await post(
      "/api/assignments/student/requestExtension",
      formBody
    );
    console.log(typeof response.status);
    if (response.status == 200) {
      Alert.alert("Success", `You extended the assignment by ${id} days`, [
        { text: "Okay" },
      ]);
    } else {
      Alert.alert(
        "Sorry",
        "Unable to extend the  assignment. You may have insufficient credits or you have already purchased an extension for this assignment. ",
        [{ text: "Okay" }]
      );
    }
  }
  function encodeData(params) {
    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return formBody;
  }

  return (
    <View style={{ margin: 15 }}>
      <FlatList
        keyExtractor={(item) => item._id}
        data={Assignments}
        renderItem={({ item }) => (
          <ListItem
            key={item.key}
            linearGradientProps={{
              colors: ["#9796f0", "#764ba2"],
              start: { x: 1, y: 0 },
              end: { x: 0.3, y: 0 },
            }}
            ViewComponent={LinearGradient}
            containerStyle={{ margin: 5, borderRadius: 35 }}
          >
            <ListItem.Content>
              <ListItem.Title style={{ color: "white", fontWeight: "bold" }}>
                {item.assignment_data.assignmentName}
              </ListItem.Title>
              <ListItem.Subtitle style={{ color: "white" }}>
                {`${item.formattedDate}`}
              </ListItem.Subtitle>
            </ListItem.Content>
            <Icon
              raised
              reverse
              raised
              type="ionicon"
              name="ios-add"
              color="#ffffff66"
              reverseColor="black"
              onPress={() => pressHandler(item._id)}
            />
          </ListItem>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    width: widthPercentageToDP("100%"),
    backgroundColor: "#ffffff03",
    marginTop: widthPercentageToDP("7%"),
    marginBottom: widthPercentageToDP("7%"),
    padding: widthPercentageToDP("3%"),
    marginHorizontal: 16,
    borderRadius: widthPercentageToDP("5%"),
  },
  linearGradient: {
    width: widthPercentageToDP("70%"),
    marginTop: widthPercentageToDP("2%"),
    marginBottom: widthPercentageToDP("2%"),
    alignSelf: "center",
    borderRadius: widthPercentageToDP("5%"),
  },
});
export default showAllAssignments;
