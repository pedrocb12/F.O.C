import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function App() {
  const router = useRouter();

  const posicaoY = useSharedValue(0);

  // pedro e eu lembremsse dessa alteraçao que fizemos no codigo do app, para que o quadrado de baixo nao suba infinitamente, e sim ate um certo ponto, e que o botao volte para a posicao inicial caso nao seja arrastado o suficiente para cima.
  const mudancamaxima = -600;
  const gesto = Gesture.Pan()
    .onUpdate((evento) => {
      if (evento.translationY < 0) {
        posicaoY.value = Math.max(evento.translationY, mudancamaxima);
      }
    })
    .onEnd(() => {
      if (posicaoY.value < -100) {
        router.push("/pg2");

        posicaoY.value = 0;
      } else {
        posicaoY.value = withSpring(0);
      }
    });

  const estiloBotao = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: posicaoY.value,
        },
      ],
    };
  });

  const estiloQuadradoBaixo = useAnimatedStyle(() => {
    const ContMovimento = Math.max(posicaoY.value, -800);
    return {
      transform: [
        {
          translateY: ContMovimento,
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#386679", "#181B1C"]}
        locations={[0, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.backgroundGradient}
      />

      <View style={styles.quadrado} />

      <View style={styles.quadradoesquerda}>
        <Text style={styles.logo}>   LOGO</Text>
      </View>

      <Text style={styles.texto2}>José</Text>

      <View style={styles.quadradodireita}>
        <Image
          source={require("@/assets/images/1768630.png")}
          style={styles.imagemdadireita}
          resizeMode="contain"
        />
      </View>

      <View style={styles.conteudo}>
        <Text style={styles.texto}>Bem vindo</Text>
      </View>


      <View style={styles.areaBaixo}>
        <Animated.View style={[styles.quadradobaixo, estiloQuadradoBaixo]} />

        <GestureDetector gesture={gesto}>
          <Animated.View style={[styles.button, estiloBotao]}></Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181B1C",
  },

  backgroundGradient: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  quadrado: {
    width: "100%",
    height: 80,
    backgroundColor: "#141617",
  },

  conteudo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  texto: {
    fontSize: 30,
    marginBottom: 30,
    color: "#FFFFFF",
    textAlign: "center",
  },

  texto2: {
    position: "absolute",
    top: 40,
    left: "75%",
    fontSize: 15,
    color: "#FFFFFF",
    textAlign: "left",
  },

  areaBaixo: {
    width: "100%",
    height: 80,
    position: "relative",
  },

  quadradobaixo: {
    width: "100%",
    height: 1000,
    backgroundColor: "#131415",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },

  button: {
    position: "absolute",
    width: 144,
    height: 10,
    backgroundColor: "#636363",
    borderRadius: 16,
    left: "50%",
    marginLeft: -72,
    top: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 28,
  },
  quadradocima: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: 80,
    backgroundColor: "#131415",
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
  quadradoesquerda: {
    position: "absolute",
    top: 30,
    left: 12,
    width: "28%",
    height: 36,
    backgroundColor: "#3f4041",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
    fontWeight: 600,
    fontSize: 20,
  },
});
