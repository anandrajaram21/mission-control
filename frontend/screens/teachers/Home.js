import React from "react";
import { View, Text, Image } from "react-native";
import { Card, Button } from "react-native-elements";
import { FontAwesome5 } from "@expo/vector-icons";
import { widthPercentageToDP } from "react-native-responsive-screen";

const Home = ({ navigation }) => {
  const views = [
    {
      title: "Reward Your Students",
      imgSrc: "../assets/image1.jpeg",
      route: "Rewards",
      key: "1",
    },
    {
      title: "Upload and Correct Assignments",
      imgSrc: "../assets/image1.jpeg",
      route: "Assignments",
      key: "2",
    },
  ];

  return (
    <View>
      <Card  containerStyle={{borderRadius:widthPercentageToDP('10%') }}>
        <Card.Title>{views[0].title}</Card.Title>
        <Card.Divider />
        <Image
          source={{
            uri: "https://img.icons8.com/cute-clipart/128/000000/trophy.png",
          }}
          style={{
            width: 128,
            height: 128,
            alignSelf: "center",
          }}
        />
        <Text style={{ marginVertical: 15 }}>
          Reward your students with points for their interactivity in class
        </Text>
        <Button 
          icon={<FontAwesome5 name="arrow-right" size={30} color="white" />}
          onPress={() => navigation.navigate("Rewards")}
          buttonStyle={{ borderRadius: 50,backgroundColor:"#9370DB" }}
        />
      </Card>
      <Card containerStyle={{borderRadius:widthPercentageToDP('10%') }}>
        <Card.Title>{views[1].title}</Card.Title>
        <Card.Divider />
        <Image
          source={{
            uri: "https://img.icons8.com/clouds/150/000000/book.png",
          }}
          style={{
            width: 150,
            height: 150,
            alignSelf: "center",
          }}
        />
        <Text style={{ marginVertical: 15 }}>
          Give your students assignments to complete
        </Text>
        <Button 
          icon={<FontAwesome5 name="arrow-right" size={30} color="white" />}
          onPress={() => navigation.navigate("Assignments")}
          buttonStyle={{ borderRadius: 50, backgroundColor:"#9370DB"}}
        />
      </Card>
    </View>
  );
};

export default Home;
