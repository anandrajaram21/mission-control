import React from "react";
import { Text, TextInput, StyleSheet } from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";
const CustomInput = (props) => {
  const {
    field: { name, onBlur, onChange, value },
    form: { errors, touched, setFieldTouched },
    ...inputProps
  } = props;

  const hasError = errors[name] && touched[name];

  return (
    <>
      <TextInput
        style={[styles.textInput, hasError && styles.errorInput]}
        value={value}
        onChangeText={(text) => onChange(name)(text)}
        onBlur={() => {
          setFieldTouched(name);
          onBlur(name);
        }}
        {...inputProps}
      />
      {hasError && <Text style={styles.errorText}>{errors[name]}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  textInput: {
    paddingLeft: 10,
    height: widthPercentageToDP("10%"),
    width: widthPercentageToDP("90%"),
    borderColor: "#4B0082",
    borderRadius: widthPercentageToDP("5%"),
    borderWidth: 1,
    marginTop: 20,
    backgroundColor: "#f6f6f6",
  },
  errorText: {
    fontSize: 10,
    color: "red",
  },
  errorInput: {
    borderColor: "red",
  },
});

export default CustomInput;
