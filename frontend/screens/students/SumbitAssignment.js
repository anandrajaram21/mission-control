import React, { Component,useState } from "react";
import { get, post } from "../../api/fetch";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  Image,
  Alert,
} from "react-native";
import { Button,Icon } from "react-native-elements";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import { Formik } from "formik";
import * as yup from "yup";

const AssignmentSchema = yup.object({
  assignmentLink: yup.string().required().min(5),
});
const SubmitAssignment =({navigation})=> {
  var id= navigation.getParam('id')
  console.log(id)
        return(
          <View style={{alignItems:'center',marginTop:heightPercentageToDP('40%')}}>
          <Formik
            initialValues={{
              assignmentLink: "",
            }}
            validationSchema={AssignmentSchema}
            onSubmit={async (values) => {
              var params = {
                assignmentID:id,
                assignmentLink: values.assignmentLink,
              };
              var formBody = [];
              for (var property in params) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(params[property]);
                formBody.push(encodedKey + "=" + encodedValue);
              }
              formBody = formBody.join("&");
              let res = await post(
                "/api/student/assignment/submitAssignment",
                formBody
              );
              console.log(res);
              if(res.status==200){
                Alert.alert("Success!", 'You uploaded the assignment successfully', [
                  { text: "Okay" },
                ]);
              }
              else{
                Alert.alert("Sorry", "Unable to upload the assignment.", [
                  { text: "Okay" },
                ]);
              }
            }}
          >
            {(props) => (
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Assignment Link"
                  onChangeText={props.handleChange("assignmentLink")}
                  value={props.values.assignmentLink}
                  onBlur={props.handleBlur("assignmentLink")}
                />
    
                <Text style={styles.errorText}>
                  {props.touched.assignmentLink && props.errors.assignmentLink}
                </Text>
                <LinearGradient
              colors={["#434343", "#434343"]}
              start={[0.1, 0.1]}
              style={styles.linearGradient}
            >    
                <Button
                  icon={
                    <Icon
                      reverse
                      name="ios-cloud-upload"
                      type='ionicon'
                      size={widthPercentageToDP('5%')}
                      reverseColor="white"
                      color='black'
                    />
                  }
                  title=" SUMBIT ASSIGNMENT"
                  onPress={props.handleSubmit}
                  buttonStyle={{ borderRadius: widthPercentageToDP('5%'), marginHorizontal: 5 ,backgroundColor:'#ffffff00',textAlign:'center',fontWeight:'100'}}
                                  />
                      </LinearGradient>
              </View>
            )}
          </Formik>
     
          </View>
         ) 
  
}
const styles = StyleSheet.create({
    heading: {
      fontWeight: "bold",
      color: "#25252a",
      fontSize: wp("8%"),
      fontFamily: "sans-serif",
      alignSelf: "center",
    },
    input: {
      borderWidth: 1,
      borderColor: "#ddd",
      padding: 10,
      fontSize: 18,
      borderRadius: widthPercentageToDP('10%'),
      marginHorizontal: 5,
    },
    errorText: {
      color: "crimson",
      fontWeight: "bold",
      marginBottom: 10,
      marginTop: 6,
      textAlign: "center",
    },
    content: {
      fontWeight: "100",
      color: "#bab9b6",
      fontSize: wp("4%"),
      fontFamily: "sans-serif",
      maxWidth: wp("80%"),
      flexShrink: 1,
      alignSelf: "center",
    },
    touchableopacity2: {
      borderRadius: wp("5%"),
      width: wp("80%"),
      height:hp('30%'),
      alignSelf: "center",
      position: "absolute",
      marginTop: hp("40%"),
      textAlign: "center"
    },
    imgrow: {
      flex: 1,
      flexDirection: "row",
    },
    linearGradient: {
      borderRadius: wp("5%"),
    },
  });

export default SubmitAssignment;