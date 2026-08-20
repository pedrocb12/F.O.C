import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
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

      <Text style={styles.titulo}>Bem vindo</Text>

      <Text style={styles.texto}>Bem vindo </Text>

      <Pressable
        style={styles.button}
        onPress={() => alert('Botão pressionado!')}>
        <Text style={styles.buttonText}></Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#181B1C',
  },

  backgroundGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  texto: {
    fontSize: 30,
    marginBottom: 30,
    color: '#FFFFFF',
  },

  button: {
    width: 144,
    minHeight: 48,
    marginTop: 'auto',
    backgroundColor: '#636363',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  quadrado: {
    width: 100,
    height: 100,
    backgroundColor: '#FF0000',
    marginBottom: 20,
    
  },
});