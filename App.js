import React, { Component } from "react";
import {
  createBottomTabNavigator,
  createStackNavigator
} from "react-navigation";
import { Provider } from "react-redux";
import codePush from "react-native-code-push";
import { PersistGate } from "redux-persist/integration/react";
import { Icon } from "react-native-elements";
import { Image } from "react-native";
import firebase from "firebase";

import store from "./store";
import AuthScreen from "./screens/AuthScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import GroupScreen from "./screens/GroupScreen";
import PolitiqueScreen from "./screens/PolitiqueScreen";
import MapScreen from "./screens/MapScreen";
import ProfileScreen from "./screens/ProfileScreen";
import conversationsScreen from "./screens/ConversationsScreen";
import messagesScreen from "./screens/MessagesScreen";
import CommentScreen from "./screens/CommentScreen";
import ProfileTabIcon from "./components/ProfileTabIcon";
import ConversationTabIcon from "./components/ConversationTabIcon";
import "core-js/fn/symbol/iterator";
import "core-js/fn/map";
import "core-js/fn/set";
import "core-js/fn/array/find";

class App extends Component {
  render() {
    const MainNavigator = createBottomTabNavigator(
      {
        welcome: { screen: WelcomeScreen },
        auth: { screen: AuthScreen },
        group: { screen: GroupScreen },
        politique: { screen: PolitiqueScreen },
        main: {
          screen: createBottomTabNavigator(
            {
              map: {
                screen: createStackNavigator({
                  map: {
                    screen: MapScreen,
                    navigationOptions: {
                      header: null
                    }
                  },
                  comment: {
                    screen: CommentScreen,
                    navigationOptions: {
                      headerStyle: {
                        backgroundColor: "white"
                      }
                    }
                  }
                }),
                navigationOptions: {
                  title: "Posts",
                  tabBarIcon: ({ tintColor }) => (
                    <Image
                      source={require("./assets/icons/home.png")}
                      style={{ width: 37, height: 37, tintColor }}
                    />
                  )
                }
              },
              profile: {
                screen: ProfileScreen,
                navigationOptions: {
                  title: "Notifications",
                  tabBarIcon: ({ tintColor }) => (
                    <ProfileTabIcon
                      iconName="face"
                      size={30}
                      color={tintColor}
                    />
                  )
                }
              },
              conversation: {
                screen: createStackNavigator({
                  conversations: {
                    screen: conversationsScreen,
                  },
                  messages: {
                    screen: messagesScreen /*,
                navigationOptions: {
                  headerTitle: 'Messages',
                  headerTitleStyle: {
                    color: 'white'
                  },
                  headerStyle: {
                    backgroundColor: 'rgb(73, 40, 146)'
                  }
                }*/
                  }
                }),
                navigationOptions: {
                  tabBarIcon: ({ tintColor }) => (
                    <ConversationTabIcon
                      iconName="message"
                      size={30}
                      color={tintColor}
                    />
                  )
                }
              }
            },
            {
              lazy: false,
              tabBarPosition: "bottom",
              order: ["profile", "map", "conversation"],
              tabBarOptions: {
                labelStyle: { fontSize: 12 },
                activeBackgroundColor: "white",
                inactiveBackgroundColor: "white",
                showLabel: false,
                activeTintColor: "#FF1744",
                style: {
                  borderTopWidth: 1,
                  borderTopColor: "#FF1744",
                  height: 50
                }
              }
            }
          )
        }
      },
      {
        navigationOptions: {
          tabBarVisible: false
        }
      }
    );

    return (
      /*<Provider store={store}>
        <PersistGate loading={null} persistor={store.persistor}>
          <MainNavigator />
        </PersistGate>
      </Provider>*/

      <Provider store={store}>
          <MainNavigator />
      </Provider>
    );
  }
}

const codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };
App = codePush(codePushOptions)(App);
export default App;
