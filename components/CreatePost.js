/**
 * Created by ggoma on 12/21/16.
 */
import React, { Component } from "react";
import {
  View,
  Image,
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  StyleSheet
} from "react-native";
import { connect } from "react-redux";
import ImagePicker from "react-native-image-picker";
import * as actions from "../actions";
import { Spinner } from "./Spinner";

const screenWidth = Dimensions.get("window").width;

class CreatePost extends Component {
  state = {
    imagePath: null,
    imageHeight: null,
    imageWidth: null,
    loading: false,
    color: "",
    textInput: ""
  };

  componentWillMount() {
    switch (this.props.color) {
      case "yellow":
        return this.setState({
          color: "rgba(255, 219, 107, 0.4)",
          textInput: "Lance un débat"
        });
      case "blue":
        return this.setState({
          color: "rgba(61, 191, 255, 0.23)",
          textInput: `Que se passe t'il en ce moment à ${this.props.nomExactLycee} ?`
        });
      case "green":
        return this.setState({
          color: "rgba(76, 228, 155, 0.28)",
          textInput: "Partage un secret"
        });
      case "red":
        return this.setState({
          color: "rgba(255, 109, 109, 0.23)",
          textInput: "Déclare ton crush"
        });
      default:
        this.setState({ color: "" });
    }
  }

  renderHeader() {
    return (
      <View
        style={{
          backgroundColor: "#F6F7F9",
          paddingTop: 36,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: "gray",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 16
        }}
      >
        <TouchableOpacity onPress={this.props.closeModal}>
          <Text style={{ color: "#4080FF", fontSize: 16 }}>Cancel</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 16, color: "black", fontWeight: "600" }}>
          Post en Anonyme
        </Text>
        <TouchableOpacity
          onPress={() =>
            this.props.createPost(
              this.props.text,
              this.props.group,
              this.props.oneSignalId,
              this.props.userId,
              this.state.imagePath,
              this.state.imageHeight,
              this.state.imageWidth,
              this.props.color
            )
          }
        >
          <Text style={{ color: "#4080FF", fontWeight: "700", fontSize: 16 }}>
            Post
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderAvatar() {
    return (
      <View style={styles.avatar}>
        <Image
          style={styles.avatar_img}
          source={require("../assets/images/avatar1.png")}
        />
        <Text style={styles.avatar_texte}>
          Voici ton avatar, le temps de ce post
        </Text>
      </View>
    );
  }

  renderText() {
    return (
      <View style={{ flex: 1, padding: 16, marginBottom: 10 }}>
        <TextInput
          multiline
          autoFocus
          style={{ height: 80, fontSize: 16, margin: 10 }}
          placeholderTextColor={"gray"}
          placeholder={this.state.textInput}
          value={this.props.text}
          onChangeText={text => this.props.createPostText(text)}
        />
      </View>
    );
  }

  renderImage() {
    const height =
      ((screenWidth - 40) * this.state.imageHeight) / this.state.imageWidth;
    return this.state.imagePath ? (
      <View style={{ flex: 1 }}>
        <Image
          source={{ uri: this.state.imagePath }}
          resizeMode="contain"
          style={{
            height,
            width: screenWidth - 40,
            alignSelf: "center",
            marginBottom: 10
          }}
        />
      </View>
    ) : null;
  }

  renderMenu() {
    return this.renderList();
  }

  renderList() {
    return !this.state.imagePath && !this.state.loading ? (
      <View style={{ flex: 1 }}>
        <View style={styles.list_view}>
          <TouchableOpacity
            style={{ flex: 1, padding: 10 }}
            onPress={this.takePicture}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              <Image
                style={styles.list_photo}
                source={require("../assets/icons/picture.png")}
              />
              <Text style={styles.list_text}>Add a photo</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    ) : null;
  }

  renderSpinner() {
    return this.state.loading ? <Spinner /> : null;
  }

  takePicture = () => {
    this.setState({ loading: true });

    const options = {
      title: "Select Image",
      quality: 0.05,
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };

    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);
      this.setState({ loading: false });
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        this.setState({
          imagePath: response.uri,
          imageHeight: response.height,
          imageWidth: response.width
        });
      }
    });
  };

  render() {
    return (
      <ScrollView style={{ backgroundColor: this.state.color }}>
        <StatusBar barStyle={"default"} animated />
        {this.renderHeader()}
        {this.renderAvatar()}
        {this.renderText()}
        {this.renderSpinner()}
        {this.renderImage()}
        {this.renderList()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  list_text: {
    color: "gray",
    fontSize: 20,
    fontWeight: "500",
    paddingLeft: 16,
    marginTop: 7
  },
  list_view: {
    flexDirection: "row",
    height: 56,
    alignItems: "center",
    paddingLeft: 16,
    flex: 1
  },
  list_photo: {
    height: 30,
    width: 30
  },
  avatar: {
    flexDirection: "row",
    marginBottom: 15
  },
  avatar_img: {
    height: 30,
    width: 30,
    marginLeft: 26,
    marginRight: 25,
    marginTop: 40,
    borderRadius: 10
  },
  avatar_texte: {
    marginTop: 50,
    fontSize: 14,
    color: "gray"
  },
  container: {
    flex: 1
  },

  img: {
    width: 40,
    height: 40
  },

  icon: {
    marginLeft: 10
  }
});

function mapStateToProps(state) {
  return {
    text: state.createPost.text,
    group: state.auth.group,
    oneSignalId: state.auth.oneSignalMyId,
    userId: state.auth.userId,
    color: state.createPost.color,
    nomExactLycee: state.auth.nomExactLycee
  };
}

export default connect(
  mapStateToProps,
  actions
)(CreatePost);
