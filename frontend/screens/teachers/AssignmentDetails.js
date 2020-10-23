import React, { useState } from "react";
import { StyleSheet, View, Modal, FlatList, Text } from "react-native";
import { Card, ListItem, Button, Icon } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import CreateAssignment from "./CreateAssignment";
import { get, post } from "../../api/fetch";
import CorrectAssignment from "./CorrectAssignment";

const AssignmentDetails = ({ navigation }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [studentUpload, setStudentUpload] = useState({});

  const studentData = navigation.getParam("student_based_data");
  const assignmentID = navigation.getParam("id");

  console.log(assignmentID);

  console.log(studentData);
  return (
    <View>
      <Modal visible={modalOpen} animationType="slide">
        <View style={styles.modalContent}>
          <MaterialIcons
            name="close"
            size={24}
            style={{ ...styles.modalToggle, ...styles.modalClose }}
            onPress={() => setModalOpen(false)}
          />
          <CorrectAssignment
            studentID={studentUpload.studentEmail}
            assignmentID={assignmentID}
          />
        </View>
      </Modal>

      <FlatList
        keyExtractor={(item) => item.studentEmail}
        data={studentData.submittedStudents}
        renderItem={({ item }) => (
          <Card containerStyle={{ borderRadius: 15, margin: 10 }}>
            <Card.Title>{item.studentName}</Card.Title>
            <Card.Divider />
            <Text style={{ fontSize: 14 }}>
              <Text style={{ fontWeight: "bold" }}>Submission Time</Text>:{"\n"}
              {item.time} {"\n"}
            </Text>
            <Text style={{ fontSize: 14 }}>
              <Text style={{ fontWeight: "bold" }}>Assignment Link</Text>:{"\n"}
              {item.link} {"\n"}
            </Text>
            <Text style={{ fontSize: 14 }}>
              <Text style={{ fontWeight: "bold" }}>Submission Time</Text>:{"\n"}
              {item.time} {"\n"}
            </Text>
            <Button
              icon={{
                name: "cloud-upload",
                size: 24,
                color: "white",
              }}
              title="Upload Correction"
              onPress={() => {
                setModalOpen(true);
                setStudentUpload(item);
              }}
            />
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  modalToggle: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  modalClose: {
    marginTop: 20,
    marginBottom: 15,
  },
  modalContent: {
    flex: 1,
  },
});

export default AssignmentDetails;
