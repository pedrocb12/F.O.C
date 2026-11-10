import { StyleSheet, Text, View } from "react-native";

export default function Controles() {
  return (
    <View style={styles.tela}>
      <Text style={styles.titulo}>pagina nova yipiee</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181b1c",
  },
  titulo: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
});