import React from "react";
import { Text, View, Modal } from "react-native";
import { CardSection } from "./CardSection";
import { Button } from "./Button";

const PopUpMenu = ({
  visible,
  onPressButon1,
  onPressButon2,
  onDecline,
  Button1Text,
  Button2Text,
  Button3Text,
  onPressButon3,
}) => {
  const { containerStyle, textStyle, cardSectionStyle } = styles;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => {}}
    >
      <View style={containerStyle}>
        <CardSection>
          <Button onPress={onPressButon1}>{Button1Text}</Button>
        </CardSection>
        <CardSection>
          <Button onPress={onPressButon2}>{Button2Text}</Button>
        </CardSection>
        <CardSection>
          <Button onPress={onPressButon3}>{Button3Text}</Button>
        </CardSection>
        <CardSection>
          <Button onPress={onDecline}>Retour</Button>
        </CardSection>
      </View>
    </Modal>
  );
};

const styles = {
  cardSectionStyle: {
    justifyContent: "center"
  },
  textStyle: {
    flex: 1,
    fontSize: 18,
    textAlign: "center",
    lineHeight: 40
  },
  containerStyle: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    position: "relative",
    flex: 1,
    justifyContent: "center"
  }
};

export { PopUpMenu };
