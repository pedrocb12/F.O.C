import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function Detalhe() {
  return (
    <View style={styles.tela}>

      <Text style={styles.texto}>
       pg2
      </Text>

      <Pressable
        style={styles.botao}
        onPress={() => router.back()}
      >
        <Text style={styles.textoBotao}>
          Voltar
        </Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181B1C',
  },

  texto: {
    color: '#FFFFFF',
    fontSize: 25,
    marginBottom: 30,
  },

  botao: {
    width: 120,
    height: 45,
    backgroundColor: '#636363',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textoBotao: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});