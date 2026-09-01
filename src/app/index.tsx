import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export default function App() {
  const router = useRouter();

 
  const posicaoY = useSharedValue(0);

  
  const gesto = Gesture.Pan()
    .onUpdate((evento) => {
     
      if (evento.translationY < 0) {
        posicaoY.value = evento.translationY;
      }
    })
    .onEnd(() => {
     
      if (posicaoY.value < -100) {
        router.push('/pg2');

        
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

  return (
    <View style={styles.container}>

      <LinearGradient
        colors={['#386679', '#181B1C']}
        locations={[0, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.backgroundGradient}
      />

   
      <View style={styles.quadrado} />

 
      <View style={styles.conteudo}>
        <Text style={styles.texto}>
          Bem vindo
        </Text>
      </View>

    
      <View style={styles.areaBaixo}>

        <View style={styles.quadradobaixo} />

        
        <GestureDetector gesture={gesto}>
          <Animated.View
            style={[
              styles.button,
              estiloBotao,
            ]}
          >
            
          </Animated.View>
        </GestureDetector>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#181B1C',
  },

  backgroundGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  quadrado: {
    width: '100%',
    height: 80,
    backgroundColor: '#141617',
  },

  conteudo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  texto: {
    fontSize: 30,
    marginBottom: 30,
    color: '#FFFFFF',
    textAlign: 'center',
  },

  areaBaixo: {
    width: '100%',
    height: 80,
    position: 'relative',
  },

  quadradobaixo: {
    width: '100%',
    height: 80,
    backgroundColor: '#131415',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },

  button: {
    position: 'absolute',
    width: 144,
    height: 50,
    backgroundColor: '#636363',
    borderRadius: 16,
    left: '50%',
    marginLeft: -72,
    top: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 28,
  },
});