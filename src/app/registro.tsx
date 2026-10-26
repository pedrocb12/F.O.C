import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  buscarRegistro,
  removerRegistro,
  type Registro,
} from "../storage/financeStorage";

const moeda = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function TelaRegistro() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [registro, setRegistro] = useState<Registro | null>(null);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    if (!id) {
      setErro("Identificador do lançamento ausente.");
      return;
    }

    try {
      const resultado = await buscarRegistro(id);
      setRegistro(resultado);
      setErro(resultado ? "" : "Este lançamento não foi encontrado.");
    } catch (falha) {
      setErro(
        falha instanceof Error
          ? falha.message
          : "Não foi possível carregar o lançamento.",
      );
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void carregar();
    }, [carregar]),
  );

  function excluir() {
    if (!registro) return;

    Alert.alert(
      "Excluir lançamento",
      `Deseja excluir "${registro.nome}"? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            void removerRegistro(registro.id)
              .then(() => router.replace("/pg2"))
              .catch((falha: unknown) => {
                setErro(
                  falha instanceof Error
                    ? falha.message
                    : "Não foi possível excluir o lançamento.",
                );
              });
          },
        },
      ],
    );
  }

  return (
    <View style={styles.tela}>
      <LinearGradient
        colors={["#26383e", "#181b1c"]}
        locations={[0, 0.55]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.cartao}>
        <Text style={styles.rotulo}>DETALHE DO LANÇAMENTO</Text>
        {registro ? (
          <>
            <Text style={styles.nome}>{registro.nome}</Text>
            <Text
              style={[
                styles.valor,
                registro.tipo === "entrada" ? styles.entrada : styles.divida,
              ]}
            >
              {registro.tipo === "entrada" ? "+" : "-"}
              {moeda(registro.valor)}
            </Text>
            <Text style={styles.tipo}>
              {registro.tipo === "entrada" ? "Entrada" : "Gasto / conta"}
            </Text>
          </>
        ) : (
          <Text style={styles.erro}>
            {erro || "Carregando lançamento..."}
          </Text>
        )}
        {erro && registro ? <Text style={styles.erro}>{erro}</Text> : null}
        {registro ? (
          <View style={styles.acoes}>
            <Pressable
              style={[styles.botao, styles.botaoEditar]}
              onPress={() =>
                router.push({
                  pathname: "/valor",
                  params: { id: registro.id, tipo: registro.tipo },
                })
              }
            >
              <Text style={styles.textoBotao}>Editar</Text>
            </Pressable>
            <Pressable
              style={[styles.botao, styles.botaoExcluir]}
              onPress={excluir}
            >
              <Text style={styles.textoBotao}>Excluir</Text>
            </Pressable>
          </View>
        ) : null}
        <Pressable
          style={[styles.botao, styles.botaoVoltar]}
          onPress={() => router.replace("/pg2")}
        >
          <Text style={styles.textoBotao}>Voltar ao painel</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#181b1c",
  },
  cartao: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: "#101415",
  },
  rotulo: {
    color: "#91aabd",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
  },
  nome: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    marginTop: 24,
  },
  valor: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 14,
  },
  entrada: {
    color: "#21c34a",
  },
  divida: {
    color: "#db1118",
  },
  tipo: {
    color: "#aab5b8",
    fontSize: 15,
    marginTop: 8,
  },
  erro: {
    color: "#ff9b9b",
    marginTop: 20,
  },
  acoes: {
    flexDirection: "row",
    gap: 12,
    marginTop: 30,
  },
  botao: {
    minHeight: 46,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    borderRadius: 11,
  },
  botaoEditar: {
    flex: 1,
    backgroundColor: "#007b9e",
  },
  botaoExcluir: {
    flex: 1,
    backgroundColor: "#610506",
  },
  botaoVoltar: {
    marginTop: 12,
    backgroundColor: "#394448",
  },
  textoBotao: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
