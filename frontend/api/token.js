import AsyncStorage from "@react-native-community/async-storage";

export const getToken = async function (token) {
  return new Promise(async (resolve, reject) => {
    try {
      const value = await AsyncStorage.getItem("@auth_token");
      resolve(value);
    } catch (e) {
      resolve(false);
    }
    // } catch (e) {
    //   return null;
    // }
  });
};

// export const setToken = async (token) => {
//   try {
//     await AsyncStorage.setItem('@auth_token', token);
//     console.log('SET TOKEN')
//   } catch (e) {
//     return null;
//   }
// };
export const setToken = async function (token) {
  return new Promise(async (resolve, reject) => {
    try {
      AsyncStorage.setItem("@auth_token", token);
      console.log("Token is set");
      resolve(true);
    } catch (e) {
      //important that we do not reject here
      resolve(false);
    }
  });
};
