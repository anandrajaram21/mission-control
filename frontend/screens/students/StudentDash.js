import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from "react-native";
import { Button, Icon } from "react-native-elements";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { get } from "./../../api/fetch";
import jwt_decode from "jwt-decode";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const StudentDash = ({ navigation }) => {
  const [Assignments, setAssignments] = useState([]);
  const [Points, setPoints] = useState(0);
  const [multiplier, setMultiplier] = useState(0);
  var token = navigation.getParam("data");
  useEffect(() => {
    async function getAssignments() {
      let response = await get("/api/student/assignment/getAssignments");
      console.log(response);
      setAssignments(response.data.object);
    }

    getAssignments();
  }, []);

  for (var j in Assignments) {
    var date = new Date(Assignments[j].assignment_data.dueDate * 1000);
    var formattedTime =
      date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
    Assignments[j].formattedDate = formattedTime;
  }
  useEffect(() => {
    async function getPoints() {
      let response = await get("/api/student/getPoints");
      console.log(response.data);
      setPoints(response.data.points);
      setMultiplier(response.data.multiplier)
    }

    getPoints();
  }, []);
  console.log("You have", Points);

  var DATA1 = [];
  var DATA2 = [];
  var DATA3 = [];
  for (var i in Assignments) {
    console.log(Assignments[i].assignment_data);
    DATA1 = DATA1.concat([Assignments[i].assignment_data.assignmentName]);
    DATA2 = DATA2.concat([Assignments[i].formattedDate]);
    DATA3 = DATA3.concat([Assignments[i]._id]);
  }
  console.log(DATA1);

  console.log(Assignments);
  const DATA = [
    {
      id: DATA3[0],
      title: DATA1[0],
      color1: "#9795EF",
      color2: "#F9C5D1",
      duedate: DATA2[0],
    },
    {
      id: DATA3[1],
      title: DATA1[1],
      color1: "#fbc2eb",
      color2: "#a6c1ee",
      duedate: DATA2[1],
    },
    {
      id: DATA3[2],
      title: DATA1[2],
      color1: "#F39FDC",
      color2: "#9AB5E1",
      duedate: DATA2[2],
    },
  ];

  var decoded = jwt_decode(token);
  const goToShop = () => {
    navigation.navigate("ShopScreen", { data: token, other: Assignments });
  };
  const submitAssignment = (id) => {
    console.log("ID RECEIVED is", id);
    navigation.navigate("SubmitAssignment", { id: id });
  };
  return (
    <View style={{ position: "absolute", alignSelf: "center" }}>
      <Text>{"\n"}</Text>
      <Text>{"\n"}</Text>
      <Text style={styles.greeting}>Hi, {decoded.name}</Text>
      <Text style={{ textAlign: "center", color: "#C0C0C0" }}>
        You currently have {Points} points
      </Text>
  {!!multiplier && <Text style={{ color: '#C0C0C0',textAlign: "center", }}>Interact everyday to keep your streak and get 2X points</Text>}
  {!multiplier && <Text style={{ color: '#C0C0C0',textAlign: "center", }}>Start a streak by interacting now!</Text>}
  {!multiplier && <Text style={{ color: '#9370DB',textAlign: "center", }}> Gain upto 2X points by interacting daily</Text>}
 
     <Button
                icon={
                  <Icon
                    reverse
                    name="shopping-bag"
                    type="font-awesome"
                    size={widthPercentageToDP("5%")}
                    reverseColor="white"
                    color="black"
                  />
                }
                onPress={goToShop}
                buttonStyle={{
                  borderRadius: widthPercentageToDP("5%"),
                  marginHorizontal: 5,
                  backgroundColor: "#ffffff00",
                  alignItems: "center",
                  fontWeight: "100",

                }}
              />
      <SafeAreaView style={styles.container}>
        <FlatList
        keyExtractor={(item) => item.id}
          data={DATA}
          renderItem={({ item }) => (
            <LinearGradient
              colors={[item.color1, item.color2]}
              start={[0.1, 0.1]}
              style={styles.linearGradient}
            >
              <TouchableOpacity
                disabled={true}
                style={styles.item}
              ></TouchableOpacity>
              <Text style={styles.title}>{item.title}</Text>
              <Icon
                raised
                reverse
                type="ionicon"
                name="ios-checkmark-circle-outline"
                color="#ffffff66"
                reverseColor="black"
                containerStyle={{ position: "absolute", right: 0 }}
                onPress={() =>{
                  console.log('OTEM',item)
                  navigation.navigate("SubmitAssignment", { id: item.id })
                }
                }
              />
              <Text style={styles.duedate}>{item.duedate}</Text>
              {/* </TouchableOpacity> */}
            </LinearGradient>
          )}
        />
      </SafeAreaView>
    </View>
  );
};
const styles = StyleSheet.create({
  greeting: {
    fontWeight: "bold",
    fontSize: widthPercentageToDP("6%"),
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  content: {
    textAlign: "center",
    color: "#C0C0C0",
  },
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    width: widthPercentageToDP("80%"),
    backgroundColor: "transparent",
    marginVertical: heightPercentageToDP("5%"),
    borderColor: "transparent",
    textAlign: "center",
    borderWidth: 0,
    marginBottom: widthPercentageToDP("2%"),
    opacity: 0,
  },
  title: {
    fontSize: widthPercentageToDP("4%"),
    color: "#ffffff8f",
    textAlign: "center",
    alignItems: "center",
    position: "relative",
    marginTop: widthPercentageToDP("-5%"),
  },
  duedate: {
    fontSize: widthPercentageToDP("5%"),
    fontWeight: "200",
    color: "white",
    alignItems: "center",
    // position: "relative",
    marginTop: widthPercentageToDP("2%"),
  },
  linearGradient: {
    width: widthPercentageToDP("70%"),
    marginTop: widthPercentageToDP("3%"),
    alignItems: "center",
    borderRadius: widthPercentageToDP("5%"),
    textAlign: "center",
    padding: widthPercentageToDP("3%"),
  },
  imgrow: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
  },
});
export default StudentDash;
