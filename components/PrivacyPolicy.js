import React, { Component } from "react";
import { Text, ScrollView, View, TouchableOpacity } from "react-native";

export class PrivacyPolicy extends Component {
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
          <TouchableOpacity onPress={this.props.closeModal2}>
            <Text style={{ color: "#4080FF", fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 16, color: "black", fontWeight: "600" }}>
            Politique de confidentialité
          </Text>
        </View>

        <ScrollView style={{ flex: 1, margin: 6 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20
            }}
          >
            Propriétaire et Responsable du traitement
          </Text>
          <Text style={{ fontSize: 18 }}>
            Antoine Salamitou - 9 bis Rue Boileau, Paris 75016 Courriel de
            contact du Propriétaire : antoine.salamitou@outlook.fr
          </Text>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20
            }}
          >
            Types de Données collectées
          </Text>
          <Text style={{ fontSize: 18 }}>
            Figurent parmi les types de Données personnelles que cette
            Application collecte directement ou en recourant à des tiers :
            données d'utilisation, adresse électronique, prénom, nom de famille,
            pays, sexe, date de naissance, coordonnées GPS. Les détails complets
            sur chaque type de Données personnelles collectées sont fournis dans
            les parties consacrées à la présente politique de confidentialité ou
            par des textes d’explication spécifiques publiés avant la collecte
            des Données. Les données personnelles peuvent être librement
            fournies par l’utilisateur, ou, en cas de données d’utilisation,
            collectées automatiquement lorsque vous utilisez le Service. Sauf
            indication contraire, toutes les données demandées par cette
            Application sont nécessaires au fonctionnement et leur absence peut
            rendre impossible la fourniture des services par le Service. Toute
            utilisation des Cookies – ou d’autres outils de suivi – par cette
            Application ou par les propriétaires de services tiers utilisés par
            cette Application vise à fournir le Service demandé par
            l’Utilisateur. Les Utilisateurs sont responsables de toute Donnée
            personnelle de tiers obtenue, publiée ou communiquée par
            l’intermédiaire de cette Application et confirment qu’ils obtiennent
            le consentement du tiers pour fournir les Données au Propriétaire
            via l’Application.
          </Text>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20
            }}
          >
            Mode et lieu de traitement des Données
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20
            }}
          >
            {" "}
            Méthodes de traitement
          </Text>
          <Text style={{ fontSize: 18 }}>
            Le Propriétaire prend les mesures de sécurité appropriées afin
            d’empêcher l’accès, la divulgation, la modification ou la
            destruction non autorisés des Données. Le traitement des Données est
            effectué à l’aide d’ordinateurs ou d’outils informatiques, en se
            restreignant aux procédures liés aux finalités indiquées. Outre le
            Propriétaire, les Données peuvent être accessibles, dans certains
            cas, à certaines catégories de personnes en charge du fonctionnement
            de cette Application (administration, marketing, administration du
            système) ou à des parties externes (telles que les fournisseurs
            tiers de services techniques, les fournisseurs d’hébergement, les
            services de communication) désignées, le cas échéant, comme
            Sous-traitantes par le Propriétaire. La liste mise à jour de ces
            parties peut être demandée à tout moment au Propriétaire.
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20
            }}
          >
            {" "}
            Base juridique du traitement
          </Text>
          <Text style={{ fontSize: 18 }}>
            Le Propriétaire peut traiter les Données personnelles relatives aux
            Utilisateurs si l'une des conditions suivantes s’applique :
          </Text>
          <Text style={{ fontSize: 18 }}>
            • les Utilisateurs ont donné leur consentement pour une ou plusieurs
            finalités spécifiques
          </Text>
          <Text style={{ fontSize: 18 }}>
            • les données sont nécessaires pour l'exécution d'un accord avec
            l'Utilisateur ou pour toute obligation précontractuelle de celui-ci
          </Text>
          <Text>
            • le traitement est nécessaire pour se conformer à une obligation
            légale à laquelle le Propriétaire est soumis
          </Text>
          <Text style={{ fontSize: 18 }}>
            • le traitement est lié à une tâche effectuée dans l'intérêt public
            ou dans l'exercice de l'autorité publique dévolue au Propriétaire
          </Text>
          <Text style={{ fontSize: 18 }}>
            • le traitement est nécessaire aux fins des intérêts légitimes
            poursuivis par le Propriétaire ou par un tiers.
          </Text>
          <Text style={{ fontSize: 18 }}>
            Vous pouvez à n’importe quel moment contacter le Propriétaire qui
            vous aidera à clarifier la base juridique spécifique qui s'applique
            au traitement de vos données.
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20
            }}
          >
            {" "}
            Lieu de traitement
          </Text>
          <Text style={{ fontSize: 18 }}>
            Les Données sont traitées au siège du Propriétaire et dans tous les
            autres lieux où sont situées les parties responsables du traitement.
            Selon la localisation de l’Utilisateur, les transferts de données
            peuvent entraîner le transfert des Données de ce dernier vers un
            pays autre que le sien. Pour en savoir plus sur le lieu de
            traitement de ces Données transférées, les Utilisateurs peuvent
            consulter la section qui contient des détails sur le traitement des
            Données personnelles. Les Utilisateurs ont également le droit de
            connaître la base juridique des transferts de Données vers un pays
            situé en dehors de l'Union européenne ou vers toute organisation
            internationale régie par le droit international public ou créée par
            deux pays ou plus, comme l'ONU, ainsi que les mesures de sécurité
            prises par le Propriétaire pour sauvegarder leurs Données. Si un tel
            transfert a lieu, les Utilisateurs peuvent en savoir plus en
            consultant les sections correspondantes du présent document ou se
            renseigner auprès du Propriétaire en utilisant les informations
            fournies dans la section de contact.
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20
            }}
          >
            {" "}
            Temps de conservation
          </Text>
          <Text style={{ fontSize: 18 }}>
            Les Données personnelles sont traitées et conservées aussi longtemps
            que requis pour la finalité pour laquelle elles ont été collectées.
            Par conséquent :
          </Text>
          <Text style={{ fontSize: 18 }}>
            • Les Données personnelles collectées à des fins liées à l'exécution
            d'un contrat entre le Propriétaire et l'Utilisateur doivent être
            conservées jusqu'à la pleine exécution du contrat.
          </Text>
          <Text style={{ fontSize: 18 }}>
            • Les Données personnelles collectées aux fins des intérêts
            légitimes du Propriétaire doivent être conservées aussi longtemps
            que nécessaire pour atteindre ces objectifs. Les Utilisateurs
            peuvent trouver des informations spécifiques concernant les intérêts
            légitimes poursuivis par le Propriétaire dans les sections
            correspondantes du présent document ou en contactant le
            Propriétaire.
          </Text>
          <Text style={{ fontSize: 18 }}>
            Le Propriétaire peut être autorisé à conserver des Données
            personnelles plus longtemps chaque fois que l’Utilisateur a donné
            son consentement à un tel traitement, tant que ce consentement n’est
            pas retiré. En outre, le Propriétaire peut être obligé de conserver
            des Données personnelles plus longtemps chaque fois que cela est
            requis pour l'exécution d'une obligation légale ou sur ordre d'une
            autorité.
          </Text>
          <Text style={{ fontSize: 18 }}>
            Une fois la période de conservation expirée, les Données
            personnelles seront supprimées. Par conséquent, le droit d'accès, le
            droit d'effacement, le droit de rectification et le droit à la
            portabilité des données ne peuvent être appliqués après l'expiration
            de la période de conservation.
          </Text>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20
            }}
          >
            Finalités du traitement
          </Text>
          <Text style={{ fontSize: 18 }}>
            Les Données relatives à l’Utilisateur sont collectées afin de
            permettre au Propriétaire de fournir le Service, ainsi que pour les
            finalités suivantes : Analyses, Accès aux comptes des services
            tiers, Contacter l'Utilisateur, Gestion de la base de données
            Utilisateurs, Gestion des contacts et envoi de messages,
            Géolocalisation pour identifier la page lycée associée.
          </Text>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20
            }}
          >
            Les permissions Facebook demandées par cette Application
          </Text>
          <Text style={{ fontSize: 18 }}>
            Pour utiliser le Service, l’Utilisateur doit donner à Facebook des
            permissions aux fins d'exécuter les actions sur le compte Facebook
            de l'Utilisateur et d'en extraire les informations, y compris les
            Données personnelles. Ce service permet à cette Application de se
            connecter au compte de l’Utilisateur sur le réseau social Facebook,
            fourni par Facebook Inc. Pour obtenir de plus amples informations au
            sujet des permissions suivantes, veuillez vous référer à la
            documentation sur les permissions Facebook et à la politique de
            confidentialité de Facebook. Les permission demandées sont les
            suivantes : Adresse électronique, Anniversaire, Email de contact,
            Informations de base et À mon sujet.
          </Text>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20
            }}
          >
            Informations détaillées sur le traitement des Données personnelles
          </Text>
          <Text style={{ fontSize: 18 }}>
            Les Données personnelles sont collectées pour les finalités
            suivantes à l'aide de plusieurs services :
          </Text>
          <Text style={{ fontSize: 18 }}>
            Accès aux comptes des services tiers : Ces types de services donnent
            à cette Application accès aux Données à partir des comptes des
            services tiers et lui permettent d’exécuter des actions avec elles.
            Ces services ne sont pas activés automatiquement mais requièrent
            l’autorisation expresse de l’Utilisateur.
          </Text>
          <Text style={{ fontSize: 18 }}>
            Accès au compte Facebook (Cette Application) :{" "}
          </Text>
          <Text style={{ fontSize: 18 }}>
 Ce service permet à cette Application de se connecter au compte de
            l’Utilisateur sur le réseau social Facebook, offert par Facebook,
            Inc. Autorisations demandées : Adresse électronique, Anniversaire,
            Email de contact et À mon sujet. Lieu de traitement : États-Unis –
            Politique de confidentialité.
          </Text>
          <Text style={{ fontSize: 18 }}>Analyses</Text>
          <Text style={{ fontSize: 18 }}>
 Les services contenus dans cette section permettent au Propriétaire
            de surveiller et d'analyser le trafic Web et de suivre l'évolution
            du comportement de l’Utilisateur.
          </Text>
          <Text style={{ fontSize: 18 }}>
            Facebook Analytics for Apps (Facebook, Inc.):{" "}
          </Text>
          <Text style={{ fontSize: 18 }}>
 Facebook Analytics for Apps est un service d'analyse fourni par
            Facebook, Inc. Données personnelles collectées : différents types de
            Données indiquées dans la politique de confidentialité du service et
            Données d'utilisation. Lieu de traitement : États-Unis – Politique
            de confidentialité.
          </Text>
          <Text style={{ fontSize: 18 }}>
            Google Analytics for Firebase (Google Inc.)
          </Text>
          <Text style={{ fontSize: 18 }}>
 Google Analytics pour Firebase ou Firebase Analytics est un service
            d’analyse fourni par Google Inc. Pour en savoir plus l’utilisation
            de Données par Google, consultez la politique de Google concernant
            ses partenaires. Firebase Analytics peut partager des Données avec
            d’autres outils fournis par Firebase, comme le rapport d’accidents,
            l’authentification, la configuration à distance ou les
            notifications. L’Utilisateur peut consulter la présente politique de
            confidentialité afin de trouver une explication détaillée sur les
            autres outils utilisés par le Propriétaire. Cette Application peut
            utiliser des identifiants pour les appareils mobiles (y compris
            l’identifiant publicitaire Android ou l’identifiant publicitaire
            pour iOS) et des technologies similaires aux cookies pour exécuter
            le service Firebase Analytics. Les Utilisateurs peuvent exclure
            certaines fonctionnalités de Firebase par les paramètres appropriés
            de leur appareil, tels que les paramètres publicitaires pour les
            téléphones mobiles, ou en suivant les instructions fournies sur
            d’autres pages liées à Firebase de la présente politique de
            confidentialité, le cas échéant. Données personnelles collectées :
            Cookies, Données d'utilisation et identification unique du
            dispositif pour la publicité (identifiant publicitaire Google ou
            IDFA, par exemple). Lieu de traitement : États-Unis – Politique de
            confidentialité.
          </Text>
          <Text style={{ fontSize: 18 }}>Contacter l’Utilisateur</Text>
          <Text style={{ fontSize: 18 }}>
 Liste de distribution ou Newsletter (Cette Application)
          </Text>
          <Text style={{ fontSize: 18 }}>
 L'inscription sur la liste de distribution ou à la Newsletter
            entraîne l'ajout de l'adresse électronique de l'utilisateur à la
            liste de contact des personnes qui peuvent recevoir des messages
            électroniques contenant des informations de nature commerciale ou
            promotionnelle au sujet de cette Application . Données personnelles
            collectées : adresse électronique, date de naissance, nom de
            famille, pays, prénom et sexe.
          </Text>
          <Text style={{ fontSize: 18 }}>
            Gestion de la base de données Utilisateurs
          </Text>
          <Text style={{ fontSize: 18 }}>
            Ce type de services permet au Propriétaire de créer des profils
            utilisateurs à partir d’une adresse électronique, d’un nom de
            personne ou d’autres informations fournies par l’Utilisateur à cette
            Application, et de suivre les activités de celui-ci par le biais de
            fonctionnalités analytiques. Ces Données personnelles peuvent
            également être comparées à des informations accessibles au public
            sur l’Utilisateur, telles que les profils des réseaux sociaux, et
            utilisées pour créer des profils privés que le Propriétaire peut
            afficher et utiliser pour améliorer cette Application. Certains de
            ces services peuvent également activer l’envoi de messages
            chronométrés à l’Utilisateur, tels que les courriels basés sur les
            actions spécifiques effectuées sur cette Application..
          </Text>
          <Text style={{ fontSize: 18 }}>   Mailjet (SAS Mailjet):</Text>
          <Text style={{ fontSize: 18 }}>
 Mailjet est un service de gestion d’adresses électroniques et
            d’envoi de messages fourni par SAS Mailjet. Données personnelles
            collectées : adresse électronique. ieu de traitement : France –
            Politique de confidentialité.
          </Text>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20
            }}
          >
            Droits des Utilisateurs
          </Text>
          <Text style={{ fontSize: 18 }}>
            Les Utilisateurs peuvent exercer certains droits concernant leurs
            Données traitées par le Propriétaire. En particulier, les
            Utilisateurs ont le droit de faire ce qui suit :
          </Text>
          <Text style={{ fontSize: 18 }}>
            • Retirer leur consentement à tout moment. Les Utilisateurs ont le
            droit de retirer leur consentement s'ils ont déjà donné leur
            consentement au traitement de leurs Données personnelles.{" "}
          </Text>
          <Text style={{ fontSize: 18 }}>
            • S'opposer au traitement de leurs Données. Les Utilisateurs ont le
            droit de s'opposer au traitement de leurs Données si le traitement
            est effectué sur une base juridique autre que le consentement. Des
            précisions sont ajoutées dans la section correspondante ci-dessous.
          </Text>
          <Text style={{ fontSize: 18 }}>
            • Accéder à leurs Données. Les Utilisateurs ont le droit de savoir
            si les Données sont traitées par le Propriétaire, d'obtenir des
            informations sur certains aspects du traitement et d'obtenir une
            copie des Données en cours de traitement.
          </Text>
          <Text style={{ fontSize: 18 }}>
            • Vérifier et obtenir une rectification. Les Utilisateurs ont le
            droit de vérifier l'exactitude de leurs Données et de demander
            qu'elles soient mises à jour ou corrigées.
          </Text>
          <Text style={{ fontSize: 18 }}>
            • Limiter le traitement de leurs Données. Les Utilisateurs ont le
            droit, sous certaines conditions, de limiter le traitement de leurs
            Données. Dans ce cas, le Propriétaire traitera leurs Données
            uniquement pour les stocker.
          </Text>
          <Text style={{ fontSize: 18 }}>
            • Faire supprimer ou effacer leurs Données personnelles. Les
            Utilisateurs ont le droit, sous certaines conditions, d'obtenir
            l'effacement de leurs Données auprès du Propriétaire.
          </Text>
          <Text style={{ fontSize: 18 }}>
            • Récupérer leurs Données et les transférer à un autre responsable
            du traitement. Les Utilisateurs ont le droit de récupérer leurs
            Données dans un format structuré, couramment utilisé et lisible par
            machine et, si cela est techniquement possible, de les transmettre à
            un autre responsable du traitement sans obstacle d'aucune sorte.
            Cette disposition s’applique, sous réserve que les Données soient
            traitées par des moyens automatisés et que le traitement repose sur
            le consentement de l'Utilisateur, sur un contrat auquel
            l'Utilisateur est partie ou sur des obligations précontractuelles.
          </Text>
          <Text style={{ fontSize: 18 }}>
            • Déposer plainte. Les Utilisateurs ont le droit de déposer une
            plainte auprès de leur autorité compétente en matière de protection
            des données.
          </Text>

          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20
            }}
          >
            {" "}
            Informations concernant le droit d'opposition au traitement
          </Text>
          <Text style={{ fontSize: 18 }}>
            Lorsque les Données personnelles sont traitées dans l'intérêt
            public, dans l'exercice d'une autorité officielle dévolue au
            Propriétaire ou aux fins des intérêts légitimes poursuivis par
            celui-ci, les Utilisateurs peuvent s'opposer à ce traitement en
            fournissant un motif lié à leur situation particulière devant
            justifier cette opposition. Les Utilisateurs doivent cependant
            savoir que si leurs Données personnelles sont traitées à des fins de
            marketing direct, ils peuvent s'opposer à ce traitement à tout
            moment sans aucune justification. Pour savoir si le Propriétaire
            traite des Données personnelles à des fins de marketing direct, les
            Utilisateurs peuvent se reporter aux sections correspondantes du
            présent document.
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20
            }}
          >
            {" "}
            Informations Comment exercer ces droits
          </Text>
          <Text style={{ fontSize: 18 }}>
            Toute demande d'exercice des droits de l'Utilisateur peut être
            adressée au Propriétaire grâce aux coordonnées fournies dans le
            présent document. Ces demandes peuvent être exercées gratuitement et
            seront étudiées par le Propriétaire le plus tôt possible et toujours
            dans un délai d'un mois.
          </Text>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20
            }}
          >
            Informations supplémentaires sur le traitement et la collecte des
            Données
          </Text>

          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20
            }}
          >
            {" "}
            Action en justice
          </Text>
          <Text style={{ fontSize: 18 }}>
            Les Données personnelles de l’Utilisateur peuvent être utilisées à
            des fins juridiques par le Propriétaire devant les tribunaux ou dans
            les étapes pouvant conduire à une action en justice résultant d’une
            utilisation inappropriée de cette Application ou des Services
            connexes. L’Utilisateur est conscient du fait que le Propriétaire
            peut être amené à révéler des Données personnelles à la demande des
            autorités publiques.
          </Text>

          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20
            }}
          >
            {" "}
            Informations non incluses dans la présente politique
          </Text>
          <Text style={{ fontSize: 18 }}>
            De plus amples renseignements concernant la collecte ou le
            traitement des Données personnelles peuvent à tout moment être
            demandés au Propriétaire. Veuillez consulter les coordonnées
            figurant au début du présent document.
          </Text>

          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20
            }}
          >
            {" "}
            Modifications de la présente politique de confidentialité
          </Text>
          <Text style={{ fontSize: 18 }}>
            Le Propriétaire se réserve le droit d'apporter des modifications à
            la présente politique de confidentialité, à tout moment, en
            informant ses Utilisateurs sur cette page et éventuellement dans
            cette Application ou – pour autant que cela soit techniquement et
            légalement possible – en envoyant une notification aux Utilisateurs
            par l'intermédiaire des coordonnées disponibles pour le
            Propriétaire. Il est fortement recommandé de consulter cette page
            fréquemment, en se référant à la date de la dernière modification
            indiquée en bas. Si les modifications influencent les activités de
            traitement effectuées sur la base du consentement de l'Utilisateur,
            le Propriétaire doit recueillir un nouveau consentement de
            l'Utilisateur lorsque nécessaire.
          </Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = {};
