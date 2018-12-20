import React, { Component } from "react";
import { Text, ScrollView, View, TouchableOpacity } from "react-native";

export class Confidentialite extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: "#F6F7F9",
            paddingTop: 36,
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
            Conditions générales
          </Text>
        </View>

        <ScrollView style={{ flex: 1, margin: 6 }}>
          <Text style={{ fontSize: 18 }}>
            Les conditions générales d’utilisation suivantes s’appliquent à
            l’accès et à l’utilisation de l’application Mask Nous vous prions de
            bien vouloir lire attentivement les termes suivants. En
            téléchargeant ou en utilisant l’application Mask vous acceptez les
            conditions d’utilisation suivantes. Le cas contraire merci de ne pas
            utiliser, ni télécharger notre application.
          </Text>

          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20
            }}
          >
            1. Description du service
          </Text>
          <Text style={{ fontSize: 18 }}>
            Mask est une application mobile qui vous permet de participer
            activement et anonymement à la vie de communauté de votre lycée.
            Vous pouvez partager de manière anonyme des photos, des messages
            avec les autres personnes appartenant à la communauté de votre
            lycée. Vous pouvez également réagir, et interagir avec les auteurs
            de posts ou de commentaires dans une conversation privée où vous
            avez le choix de révéler votre véritable identité. Cette identité
            est celle renseignée par le profil Facebook ou Instagram via lequel
            vous avez fait votre inscription à notre service lors de votre
            inscription.
          </Text>

          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20
            }}
          >
            2. Coût
          </Text>
          <Text style={{ fontSize: 18 }}>
            Mask est un service gratuit. Afin de financer ce service nous nous
            octroyons le droit d’intégrer des services payants ou des
            publicités.
          </Text>

          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20
            }}
          >
            3. Conditions pour créer un compte
          </Text>
          <Text style={{ fontSize: 18 }}>
            Afin d’utiliser le service Mask vous devez donner votre accord pour
            que nous puissions accéder à votre compte Facebook ou Instagram. Par
            ailleurs vous devez avoir 13 ans révolus pour télécharger ou
            utiliser nos services. En utilisant Mask, vous déclarez que : • Vous
            avez la capacité de conclure un contrat ayant force obligatoire avec
            Mask • Vous respecterez ces Conditions et toutes lois, règles et
            règlements applicables, au niveau local, régional, national ou
            international. Vous vous engagez à rejoindre la page Mask
            correspondant au lycée dans lequel vous êtes entrain de faire vos
            études.
          </Text>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20
            }}
          >
            4. Notifications Push
          </Text>
          <Text style={{ fontSize: 18 }}>
            Après avoir téléchargé Mask nous demanderons votre permission pour
            communiquer avec vous électriquement via les notifications push. Si
            vous acceptez vous recevrez des notifications push sur votre mobile.
            Ces notifications peuvent être envoyées si un utilisateur répond,
            réagi à un de vos posts ou commentaires. Elles peuvent également
            être envoyées lorsque vous recevez une réponse privée dans votre
            Mask chat. Nous pouvons également vous envoyer des pushs
            notifications pour vous informer des nouveautés du service Mask.
          </Text>

          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20
            }}
          >
            5. Comportement sur l’application
          </Text>
          <Text style={{ fontSize: 18 }}>
            {" "}
            En téléchargeant et en utilisant l’application Mask vous acceptez
            les prescriptions comportementales suivantes qui peuvent être
            modifiées à tout moment. Il est entre autre interdit de partager :
            du contenu illégal du contenu contenant des données sur des parties
            tiers du contenu ou des données à caractère raciste, pornographique,
            violent, incitant à la haine, au harcèlement, qui puissent en
            n’importe quelle manière avoir une influence indésirable sur le
            développement moral d’un tiers. des publicités qui ne sont pas
            approuvées par Mask des spams Ces prescriptions sont valables à la
            fois pour le fil d’actualité public Mask feed et pour les
            conversation privées initiées dans le Mask chat.
          </Text>

          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20
            }}
          >
            6. Contenu publié par des tiers
          </Text>
          <Text style={{ fontSize: 18 }}>
            {" "}
            La plus grande partie du contenu présent sur Mask est produite par
            des utilisateurs et d'autres tiers. Ce contenu, qu'il soit publié
            publiquement sur le Mask feed. ou envoyé de manière privée dans le
            Mask chat relève de la responsabilité exclusive de la personne ou du
            tiers l’ayant publié. Mask se réserve le droit d’examiner, de
            filtrer ou de supprimer l'intégralité du contenu présent dans le
            Service. Cependant la vérification du contenu dans son intégralité
            ne peut être systématique. En cela nous ne pouvons pas prendre la
            responsabilité de contenu publié par un tiers sur le Service. Par
            ailleurs les présentes Conditions Générales d’Utilisation et plus
            précisément le point 5. Comportement sur l’application détaille
            explicitement les usages exclus lors de l’utilisation du Service.
          </Text>

          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20
            }}
          >
            7. Sécurité
          </Text>
          <Text style={{ fontSize: 18 }}>
            En utilisant Mask vous acceptez de : Ne pas essayer d’accéder au
            service ou d’extraire des données en utilisant des robots ou autre
            machine, outil technique ou autre machine. Ne pas utiliser les
            comptes d’autres utilisateurs sans leur autorisation ou leur
            permission Ne pas demander les identifiants de connexion d'un autre
            utilisateur. Ne pas essayer d’outre passer les techniques de
            filtrage de contenu que nous avons mis en place Ne pas télécharger
            de virus ou autres codes malveillants, ou compromettre de toute
            autre façon la sécurité des Services. Ne pas utiliser les Services
            d'une manière qui pourrait déranger, perturber,
            affecter négativement d'autres utilisateurs ou les empêcher de
            profiter pleinement des Services, ou qui pourrait endommager,
            désactiver, surcharger les Services ou nuire à leur fonctionnement.
            Ces prescriptions sont valables à la fois pour le fil d’actualité
            public Mask feed et pour les conversation privées initiées dans le
            Mask chat.
          </Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = {};
