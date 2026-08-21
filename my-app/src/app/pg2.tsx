import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';

export default function Detalhe() {
  const [saldo, setSaldo] = useState(2000);
  const [devendo, setDevendo] = useState(600);
  const [registros, setRegistros] = useState<Registro[]>(registrosIniciais);
  const { registros: registrosParam } = useLocalSearchParams<{
    registros?: string;
  }>();

  useEffect(() => {
    if (registrosParam) {
      try {
        const registrosRecebidos = JSON.parse(registrosParam) as Registro[];
        setRegistros(registrosRecebidos);
        atualizarTotais(registrosRecebidos);
      } catch {
        setRegistros([]);
      }
    }
  }, [registrosParam]);

  function atualizarTotais(lista: Registro[]) {
    const entradas = lista
      .filter((registro) => registro.tipo === 'entrada')
      .reduce((total, registro) => total + registro.valor, 0);
    const dividas = lista
      .filter((registro) => registro.tipo === 'divida')
      .reduce((total, registro) => total + registro.valor, 0);

    setSaldo(entradas);
    setDevendo(dividas);
  }

  function voltar() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  }

  const listaVisivel = registros.length > 0 ? registros : [];

  return (
    <View style={styles.tela}>
     
      <LinearGradient
        colors={['#386679', '#181B1C']}
        locations={[0, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.backgroundGradient}
      />
       <View style={styles.quadrado} />
      <LinearGradient
        colors={['#282B2CAB', '#171A1B57']}
        locations={[0, 1]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.quadradobaixo2}
      />

      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.texto}>conta</Text>
        <Text style={styles.texto2}>{saldo} reais</Text>
        <Text style={styles.texto3}>-{devendo} reais</Text>

        <View style={styles.controles}>
          <Pressable
            style={styles.botao_de_mais}
            onPress={() => router.push({ pathname: '/valor', params: { tipo: 'entrada', registros: JSON.stringify(registros) } })}
          >
            <Text style={styles.textoControle}>+</Text>
          </Pressable>

          <Pressable
            style={styles.botao_de_menos}
            onPress={() => router.push({ pathname: '/valor', params: { tipo: 'divida', registros: JSON.stringify(registros) } })}
          >
            <Text style={styles.textoControle}>-</Text>
          </Pressable>
        </View>

        <Text style={styles.tituloLista}>Gastos e ganhos</Text>
        {listaVisivel.length === 0 ? (
          <Text style={styles.listaVazia}>Nenhum lançamento ainda.</Text>
        ) : (
          listaVisivel.map((registro) => (
            <View style={styles.registro} key={registro.id}>
              <View>
                <Text style={styles.nomeRegistro}>{registro.nome}</Text>
                <Text style={styles.tipoRegistro}>
                  {registro.tipo === 'entrada' ? 'Ganho' : 'Gasto'}
                </Text>
              </View>
              <Text style={styles.valorRegistro}>
                {registro.tipo === 'entrada' ? '+' : '-'} {registro.valor} reais
              </Text>
            </View>
          ))
        )}

        <Pressable style={styles.botao} onPress={voltar}>
          <Text style={styles.textoBotao}>Voltar</Text>
        </Pressable>
      </ScrollView>

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

  backgroundGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  texto: {
    color: '#FFFFFF',
    fontSize: 25,
    marginBottom: 30,
  },

  texto2: {
    color: '#FFFFFF',
    fontSize: 22,
    marginBottom: 12,
  },

  texto3: {
    color: '#FFFFFF',
    fontSize: 22,
    marginBottom: 24,
  },

  controles: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  botao_de_mais: {
    width: 52,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#386679',
    justifyContent: 'center',
    alignItems: 'center',
  },

  botao_de_menos: {
    width: 52,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#793843',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textoControle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
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

  quadrado: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 80,
    backgroundColor: '#141617',
  },

  quadradobaixo2: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 507,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },

  conteudo: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 32,
  },

  tituloLista: {
    width: '90%',
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  listaVazia: {
    color: '#C7D2D5',
    fontSize: 16,
    marginBottom: 24,
  },

  registro: {
    width: '90%',
    minHeight: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#202829',
  },

  nomeRegistro: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  tipoRegistro: {
    color: '#A8B4B8',
    fontSize: 13,
    marginTop: 3,
  },

  valorRegistro: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

type Registro = {
  id: string;
  nome: string;
  valor: number;
  tipo: 'entrada' | 'divida';
};

const registrosIniciais: Registro[] = [
  { id: 'salario', nome: 'Salário', valor: 2000, tipo: 'entrada' },
  { id: 'mercado', nome: 'Compras do mercado', valor: 400, tipo: 'divida' },
  { id: 'transporte', nome: 'Transporte', valor: 200, tipo: 'divida' },
];