import React, { Component } from "react";
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Button
} from "react-native";
import { firebaseApp } from "../firebase";
import { connect } from "react-redux";
import * as actions from "../actions";

class PolitiqueScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "rgb(230, 34, 32)" }}>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Image
            style={{ width: 100, height: 100 }}
            source={require("../assets/images/logo_mask.png")}
          />

          <View style={{ margin: 10, marginBottom: 20 }}>
            <Text style={{ fontSize: 30, color: "white" }}>
              {" "}
              Félicitations !
            </Text>
            <Text style={{ fontSize: 20, color: "white", marginTop: 10 }}>
              Tu as choisi de rejoindre le lycée {this.props.nomExactLycee}
            </Text>
            <Text style={{ fontSize: 20, color: "white", marginTop: 20 }}>
              En continuant sur Mask. tu t'engages à respecter les points
              suivants :
            </Text>
            <Text style={{ fontSize: 20, color: "white", marginTop: 20 }}>
              - Ne pas publier d'informations personelles (numéro...).
            </Text>
            <Text style={{ fontSize: 20, color: "white", marginTop: 20 }}>
              - Ne pas publier de contenu offensant.
            </Text>
            <Text style={{ fontSize: 20, color: "white", marginTop: 20 }}>
              - Rester positif.
            </Text>
            <Text style={{ fontSize: 20, color: "white", marginTop: 20 }}>
              - Rester vigilant en signalant et dislikant les contenus déplacés.
            </Text>
          </View>
          <Button
            onPress={() => this.props.navigation.navigate("map")}
            title="Confirmer et continuer"
            color="white"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 50
  },
  boldText: {
    fontSize: 30,
    color: "red"
  },
  textInput: {
    fontSize: 16,
    borderWidth: 0.5,
    borderRadius: 20,
    height: 45,
    margin: 2,
    width: 85 + "%",
    padding: 10
  },
  list_photo: {
    height: 20,
    width: 20,
    marginTop: 9,
    marginRight: 20,
    marginLeft: 8
  }
});

function mapStateToProps(state) {
  return {
    nomExactLycee: state.auth.nomExactLycee
  };
}

export default connect(
  mapStateToProps,
  actions
)(PolitiqueScreen);
