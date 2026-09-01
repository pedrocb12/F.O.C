import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function EscolherValor() {
  const { tipo, registros: registrosParam } = useLocalSearchParams<{
    tipo?: string;
    registros?: string;
  }>();
  const [nome, setNome] = useState('');
  const [valorTexto, setValorTexto] = useState('');
  const valor = Number(valorTexto.replace(',', '.'));
  const podeConfirmar = nome.trim().length > 0 && Number.isFinite(valor) && valor > 0;

  function cancelar() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/pg2');
  }

  function confirmar() {
    if (!podeConfirmar) {
      return;
    }

    const registrosAtuais = registrosParam ? JSON.parse(registrosParam) : [];
    const novoRegistro = {
      id: `${Date.now()}`,
      nome: nome.trim(),
      valor,
      tipo: tipo === 'divida' ? 'divida' : 'entrada',
    };

    router.replace({
      pathname: '/pg2',
      params: { registros: JSON.stringify([...registrosAtuais, novoRegistro]) },
    });
  }

  return (
    <View style={styles.tela}>
      <Text style={styles.titulo}>Escolha a quantia</Text>
      <Text style={styles.subtitulo}>
        {tipo === 'divida' ? 'Quanto você deve?' : 'Quanto você ganhou?'}
      </Text>

      <TextInput
        autoFocus
        style={styles.campoNome}
        value={nome}
        onChangeText={setNome}
        placeholder={tipo === 'divida' ? 'Nome do gasto' : 'Nome do ganho'}
        placeholderTextColor="#A8B4B8"
      />

      <TextInput
        style={styles.campoValor}
        value={valorTexto}
        onChangeText={setValorTexto}
        keyboardType="decimal-pad"
        placeholder="Digite o valor"
        placeholderTextColor="#A8B4B8"
      />

      <Pressable
        style={[styles.botaoConfirmar, !podeConfirmar && styles.botaoDesativado]}
        onPress={confirmar}
        disabled={!podeConfirmar}
      >
        <Text style={styles.textoBotao}>Confirmar</Text>
      </Pressable>

      <Pressable style={styles.botaoCancelar} onPress={cancelar}>
        <Text style={styles.textoBotao}>Cancelar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#181B1C',
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitulo: {
    color: '#C7D2D5',
    fontSize: 17,
    marginBottom: 24,
  },
  campoValor: {
    width: 220,
    height: 52,
    borderWidth: 2,
    borderColor: '#8AA5AD',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    backgroundColor: '#202829',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 18,
  },
  campoNome: {
    width: 220,
    height: 52,
    borderWidth: 2,
    borderColor: '#8AA5AD',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    backgroundColor: '#202829',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 12,
  },
  botaoConfirmar: {
    width: 220,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#386679',
    marginBottom: 12,
  },
  botaoDesativado: {
    opacity: 0.45,
  },
  botaoCancelar: {
    width: 220,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#636363',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});