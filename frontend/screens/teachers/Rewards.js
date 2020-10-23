import React, { useState, useEffect } from "react";
import { View, FlatList, Alert } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { get, post } from "../../api/fetch";

const Rewards = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    async function getData() {
      let res = await get("/api/interaction/getStudents");
      console.log(res.data);
      setStudents(res.data);
    }
    getData();
  }, []);

  const pressHandler = async (item) => {
    var params = {
      student_id: item.emailID,
    };
    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    let res = await post("/api/interaction/addPoints", formBody);
    console.log(res);
    Alert.alert("Success", "You gave " + item.student_name + " 2 points", [
      { text: "Okay" },
    ]);
  };

  return (
    <View style={{ margin: 15 }}>
      <FlatList
        keyExtractor={(item) => item._id}
        data={students.object}
        renderItem={({ item }) => (
          <ListItem
            key={item.key}
            linearGradientProps={{
              colors: ["#6DD5FA", "#2980B9"],
              start: { x: 1, y: 0 },
              end: { x: 0.2, y: 0 },
            }}
            ViewComponent={LinearGradient}
            containerStyle={{ margin: 5, borderRadius: 35 }}
          >
            <ListItem.Content>
              <ListItem.Title style={{ color: "white", fontWeight: "bold" }}>
                {item.student_name}
              </ListItem.Title>
              <ListItem.Subtitle style={{ color: "white" }}>
                {`${item.student_class} ${item.student_section}`}
              </ListItem.Subtitle>
            </ListItem.Content>
            <Icon
              raised
              name="exposure-plus-2"
              color="black"
              onPress={() => pressHandler(item)}
            />
          </ListItem>
        )}
      />
    </View>
  );
};

export default Rewards;
