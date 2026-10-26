import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

type ArayaSurpresaProps = {
  onMusicaFinalizada: () => void;
};

const TAMANHO_PERSONAGEM = 128;
const QUANTIDADE_PERSONAGENS = 6;
const personagens = Array.from({ length: QUANTIDADE_PERSONAGENS }, (_, indice) => indice);
const tamanhoPersonagem = (indice: number) =>
  TAMANHO_PERSONAGEM * (0.65 + ((indice * 37) % 55) / 100);

export function ArayaSurpresa({ onMusicaFinalizada }: ArayaSurpresaProps) {
  const player = useAudioPlayer(require("../../assets/audio/araya-song.mp3"));
  const status = useAudioPlayerStatus(player);
  const { width, height } = useWindowDimensions();
  const tamanhos = useRef(personagens.map(tamanhoPersonagem)).current;
  const posicoes = useRef(
    personagens.map(() => new Animated.ValueXY({ x: -TAMANHO_PERSONAGEM, y: 0 })),
  ).current;

  useEffect(() => {
    let ativo = true;
    void setAudioModeAsync({ playsInSilentMode: true }).then(() => {
      if (ativo) player.play();
    });
    return () => {
      ativo = false;
      player.pause();
    };
  }, [player]);

  useEffect(() => {
    if (status.didJustFinish) onMusicaFinalizada();
  }, [status.didJustFinish, onMusicaFinalizada]);

  useEffect(() => {
    let ativo = true;
    const animacoes: Animated.CompositeAnimation[] = [];

    function passar(indice: number) {
      if (!ativo) return;

      const tamanho = tamanhos[indice];
      const esquerdaParaDireita = Math.random() < 0.5;
      const yInicial = Math.random() * Math.max(0, height - tamanho);
      const yFinal = Math.min(
        Math.max(0, yInicial + (Math.random() - 0.5) * 180),
        Math.max(0, height - tamanho),
      );
      const inicio = {
        x: esquerdaParaDireita ? -tamanho - 24 : width + 24,
        y: yInicial,
      };
      const fim = {
        x: esquerdaParaDireita ? width + 24 : -tamanho - 24,
        y: yFinal,
      };

      posicoes[indice].setValue(inicio);
      const animacao = Animated.sequence([
        Animated.delay(300 + Math.random() * 3200),
        Animated.timing(posicoes[indice], {
          toValue: fim,
          duration: 2600 + Math.random() * 4800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]);

      animacoes[indice] = animacao;
      animacao.start(({ finished }) => {
        if (finished && ativo) passar(indice);
      });
    }

    personagens.forEach((_, indice) => passar(indice));

    return () => {
      ativo = false;
      animacoes.forEach((animacao) => animacao?.stop());
    };
  }, [height, posicoes, tamanhos, width]);

  return (
    <ImageBackground
      source={require("../../assets/images/araya-background.png")}
      resizeMode="cover"
      style={styles.fundo}
    >
      <View style={styles.sombra} />
      <Text style={styles.mensagem}>ARAYA 67!</Text>
      <View style={styles.areaPersonagens} pointerEvents="none">
        {personagens.map((indice) => {
          const tamanho = tamanhos[indice];
          return (
            <Animated.View
              key={indice}
              style={[
                styles.personagemEmMovimento,
                {
                  width: tamanho,
                  height: tamanho,
                  transform: posicoes[indice].getTranslateTransform(),
                },
              ]}
            >
              <Image
                source={require("../../assets/images/araya-character.png")}
                resizeMode="contain"
                style={styles.personagem}
                accessibilityLabel="Araya atravessando a tela"
              />
            </Animated.View>
          );
        })}
      </View>
      {status.error ? (
        <Text style={styles.erroAudio}>
          Não foi possível tocar a música: {status.error}
        </Text>
      ) : null}
      {!status.playing && !status.didJustFinish ? (
        <Pressable style={styles.botaoTocar} onPress={() => player.play()}>
          <Text style={styles.textoBotao}>Tocar música</Text>
        </Pressable>
      ) : null}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    overflow: "hidden",
    justifyContent: "center",
  },
  sombra: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(5, 4, 18, 0.18)",
  },
  mensagem: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: 5,
    textAlign: "center",
    textShadowColor: "#3326a5",
    textShadowRadius: 18,
  },
  areaPersonagens: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    overflow: "hidden",
  },
  personagemEmMovimento: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  personagem: {
    width: "100%",
    height: "100%",
  },
  erroAudio: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 12,
    color: "#fff",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    padding: 10,
    borderRadius: 8,
  },
  botaoTocar: {
    position: "absolute",
    top: 28,
    alignSelf: "center",
    backgroundColor: "rgba(10, 8, 36, 0.75)",
    borderColor: "rgba(255, 255, 255, 0.6)",
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "700",
  },
});
