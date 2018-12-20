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
  Alert
} from "react-native";
import axios from "axios";
import _ from "lodash";
import { Button } from "react-native-elements";
import { Confirm } from "../components/Confirm";
import { firebaseApp } from "../firebase";
import { connect } from "react-redux";
import * as actions from "../actions";

class GroupScreen extends Component {
  state = {
    lycees: [],
    text: "",
    longitude: "",
    latitude: "",
    showModal: false,
    lyceeSelectionne: "",
    marginTopHeader: 0
  };

  componentDidMount = async () => {
    const test = await this.props.isIphoneXorAbove()
    if (test === true) {
      this.setState({ marginTopHeader: 20 });
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        axios
          .get(
            `https://places.cit.api.here.com/places/v1/autosuggest?at=${
              position.coords.latitude
            },${
              position.coords.longitude
            }&q=lycee&app_id=FRy0L6yOZ0CSS4Z9LuYi&app_code=I7RHYVWlWyWP6APt9GJQjw`
          )
          .then(response => {
            const array = [];
            response.data.results.forEach(element => {
              if (element.category === "education-facility") {
                const n = element.vicinity.split(" ");
                if (n[n.length - 1].includes("<br/>")) {
                  const m = n[n.length - 1]
                    .replace(/<br\s*[\/]?>/gi, " ")
                    .split(" ");
                  array.unshift(
                    element.title.replace("Collège", "Lycée") + " " + m[0]
                  );
                } else {
                  array.unshift(
                    element.title.replace("Collège", "Lycée") +
                      " " +
                      n[n.length - 1]
                  );
                }
              }
            });
            this.setState({
              lycees: array,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          });
      },
      error => {
        console.log(error);
        if (error.message === "Location services disabled.") {
          Alert.alert(
            "Active ta localisation pour avoir accès aux lycées prêt de chez toi."
          );
        }
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  onDecline = () => {
    this.setState({ showModal: false });
  };

  searchLycee = () => {
    const array = [];
    const text = this.state.text
      .split(" ")
      .join("+")
      .replace(/[\u0300-\u036f]/g, "");
    if (this.state.latitude && this.state.longitude) {
      if (this.state.text.length === 0) {
        axios
          .get(
            `https://places.cit.api.here.com/places/v1/autosuggest?at=${
              this.state.latitude
            },${
              this.state.longitude
            }&q=lycee&app_id=FRy0L6yOZ0CSS4Z9LuYi&app_code=I7RHYVWlWyWP6APt9GJQjw`
          )
          .then(response => {
            const array2 = [];
            response.data.results.forEach(element => {
              if (element.category === "education-facility") {
                const n = element.vicinity.split(" ");
                if (n[n.length - 1].includes("<br/>")) {
                  const m = n[n.length - 1]
                    .replace(/<br\s*[\/]?>/gi, " ")
                    .split(" ");
                  array2.unshift(
                    element.title.replace("Collège", "Lycée") + " " + m[0]
                  );
                } else {
                  array2.unshift(
                    element.title.replace("Collège", "Lycée") +
                      " " +
                      n[n.length - 1]
                  );
                }
              }
            });
            this.setState({
              lycees: array2
            });
          });
      }
      //gerer cas br
      axios
        .get(
          `https://places.cit.api.here.com/places/v1/autosuggest?at=${
            this.state.latitude
          },${
            this.state.longitude
          }&q=${text}&app_id=FRy0L6yOZ0CSS4Z9LuYi&app_code=I7RHYVWlWyWP6APt9GJQjw`
        )
        .then(response => {
          response.data.results.forEach(element => {
            if (element.category === "education-facility") {
              const n = element.vicinity.split(" ");
              if (n[n.length - 1].includes("<br/>")) {
                const m = n[n.length - 1]
                  .replace(/<br\s*[\/]?>/gi, " ")
                  .split(" ");
                array.unshift(
                  element.title.replace("Collège", "Lycée") + " " + m[0]
                );
              } else {
                array.unshift(
                  element.title.replace("Collège", "Lycée") +
                    " " +
                    n[n.length - 1]
                );
              }
            }
          });
          this.setState({
            lycees: array
          });
        });
    } else {
      //gerer cas br
      navigator.geolocation.getCurrentPosition(
        position => {
          axios
            .get(
              `https://places.cit.api.here.com/places/v1/autosuggest?at=${
                position.coords.latitude
              },${
                position.coords.longitude
              }&q=lycee&app_id=FRy0L6yOZ0CSS4Z9LuYi&app_code=I7RHYVWlWyWP6APt9GJQjw`
            )
            .then(async response => {
              response.data.results.forEach(element => {
                if (element.category === "education-facility") {
                  const n = element.vicinity.split(" ");
                  if (n[n.length - 1].includes("<br/>")) {
                    const m = n[n.length - 1]
                      .replace(/<br\s*[\/]?>/gi, " ")
                      .split(" ");
                    array.unshift(
                      element.title.replace("Collège", "Lycée") + " " + m[0]
                    );
                  } else {
                    array.unshift(
                      element.title.replace("Collège", "Lycée") +
                        " " +
                        n[n.length - 1]
                    );
                  }
                }
              });
              this.setState({
                lycees: array,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
            });
        },
        error => {
          console.log(error);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );

      axios
        .get(
          `https://places.cit.api.here.com/places/v1/autosuggest?at=0,0&q=${text}+lycee&app_id=FRy0L6yOZ0CSS4Z9LuYi&app_code=I7RHYVWlWyWP6APt9GJQjw`
        )
        .then(response => {
          response.data.results.forEach(element => {
            if (element.category === "education-facility") {
              const n = element.vicinity.split(" ");
              if (n[n.length - 1].includes("<br/>")) {
                const m = n[n.length - 1]
                  .replace(/<br\s*[\/]?>/gi, " ")
                  .split(" ");
                array.unshift(
                  element.title.replace("Collège", "Lycée") + " " + m[0]
                );
              } else {
                array.unshift(
                  element.title.replace("Collège", "Lycée") +
                    " " +
                    n[n.length - 1]
                );
              }
            }
          });
          this.setState({
            lycees: array
          });
        });
    }
  };

  choisirLycee = async element => {
    await this.setState({ lyceeSelectionne: element });
    this.setState({ showModal: true });
  };

  onAccept = async () => {
    await this.setState({ showModal: false });
    const n = this.state.lyceeSelectionne.split(" ");
    let nomLyceeGroupe = n[n.length - 2] + n[n.length - 1];
    let nomExact = "";
    if (
      n[1] === "Professionnel" ||
      n[1] === "Prive" ||
      n[1] === "Privé" ||
      n[1] === "Public" ||
      n[1] === "Prof." ||
      n[1] === "Public" ||
      n[1] === "Polyvalent"
    ) {
      nomExact = n.slice(2, -1).join(" ");
    } else if (n[1] === "Gén." && n[2] === "et" && n[3] === "Techno.") {
      nomExact = n.slice(4, -1).join(" ");
    } else {
      nomExact = n.slice(1, -1).join(" ");
    }
    nomLyceeGroupe = nomLyceeGroupe.replace(".", " ");
    nomExact = nomExact.replace(".", " ");
    console.log();
    await AsyncStorage.setItem("group", nomLyceeGroupe);
    firebaseApp
      .database()
      .ref(`/users/${this.props.userId}`)
      .update({
        group: nomLyceeGroupe,
        nom_exact_lycee: nomExact
      });
    await this.props.setGroup(nomLyceeGroupe);
    await this.props.setNomExact(nomExact);
    await this.props.navigation.navigate("politique");
  };

  render() {
    let i = 0;
    const ListeLycees = this.state.lycees.map(element => {
      i += 1;
      return (
        <TouchableOpacity
          key={i}
          style={{
            marginLeft: 10,
            marginRight: 10,
            borderWidth: 0.5,
            borderRadius: 20,
            marginTop: 7,
            padding: 5
          }}
          onPress={() => this.choisirLycee(element)}
        >
          <Text style={{ fontSize: 16, color: "white" }}>{element}</Text>
        </TouchableOpacity>
      );
    });
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: "rgb(230, 34, 32)"
          }}
        >
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Image
              style={{ width: 100, height: 100, marginTop: this.state.marginTopHeader }}
              source={require("../assets/images/logo_mask.png")}
            />
          </View>
          <View style={{ margin: 10 }}>
            <Text style={{ fontSize: 20, color: "white" }}>
              {" "}
              Bienvenue sur Mask. Pour commencer selectionne ton lycée
            </Text>
            <Text style={{ fontSize: 12, color: "white", marginTop: 10 }}>
              PS: attention une fois ton lycée choisi tu ne pourras plus revenir
              en arrière
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                marginBottom: 30,
                marginTop: 10
              }}
            >
              <TextInput
                multiline
                style={styles.textInput}
                placeholderTextColor={"white"}
                value={this.state.text}
                autoCorrect={false}
                onChangeText={text => this.setState({ text: text })}
                placeholder={"Cherche ton lycée avec la ville"}
              />
              <TouchableOpacity
                onPress={() => {
                  this.searchLycee();
                }}
              >
                <Image
                  style={styles.list_photo}
                  source={require("../assets/icons/send2.png")}
                />
              </TouchableOpacity>
            </View>

            {ListeLycees}
            <Confirm
              visible={this.state.showModal}
              onAccept={this.onAccept}
              onDecline={this.onDecline}
            >
              Voulez vous choisir le {this.state.lyceeSelectionne} ?
            </Confirm>
          </View>
        </ScrollView>
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
    userId: state.auth.userId,
    auth: state.auth
  };
}

export default connect(
  mapStateToProps,
  actions
)(GroupScreen);
