import { Image, StyleSheet, Text, View } from "react-native";

type AppHeaderProps = {
  nome: string;
};

export function AppHeader({ nome }: AppHeaderProps) {
  return (
    <>
      <View style={styles.quadrado} />

      <View style={styles.quadradoesquerda}>
        <Text style={styles.logo}>   LOGO</Text>
      </View>

      <Text style={styles.texto2}>{nome}</Text>

      <View style={styles.quadradodireita}>
        <Image
          source={require("@/assets/images/1768630.png")}
          style={styles.imagemdadireita}
          resizeMode="contain"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  quadrado: {
    width: "100%",
    height: 80,
    backgroundColor: "#141617",
  },
  quadradoesquerda: {
    position: "absolute",
    top: 30,
    left: 12,
    width: "28%",
    height: 36,
    backgroundColor: "#3f4041",
    borderRadius: 12,
    justifyContent: "center",
    paddingLeft: 12,
  },
  quadradodireita: {
    position: "absolute",
    top: 30,
    right: 12,
    width: 36,
    height: 36,
    backgroundColor: "#3f4041",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  imagemdadireita: {
    width: 30,
    height: 30,
  },
  logo: {
    color: "#181818",
    fontWeight: "600",
    fontSize: 20,
  },
  texto2: {
    position: "absolute",
    top: 40,
    left: "75%",
    fontSize: 15,
    color: "#FFFFFF",
    textAlign: "left",
  },
});
