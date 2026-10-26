import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AppHeader } from "@/components/app-header";
import { carregarRegistros, type Registro } from "../storage/financeStorage";

const moeda = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Detalhe() {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      setRegistros(await carregarRegistros());
    } catch (falha) {
      setErro(
        falha instanceof Error
          ? falha.message
          : "Não foi possível carregar os lançamentos.",
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void carregarDados();
    }, [carregarDados]),
  );

  const entradas = registros
    .filter((registro) => registro.tipo === "entrada")
    .reduce((total, registro) => total + registro.valor, 0);
  const dividas = registros
    .filter((registro) => registro.tipo === "divida")
    .reduce((total, registro) => total + registro.valor, 0);
  const saldo = entradas - dividas;
  const historico = registros.slice(0, 4);
  const contas = registros.filter((registro) => registro.tipo === "divida");

  function abrirRegistro(registro: Registro) {
    router.push({ pathname: "/registro", params: { id: registro.id } });
  }

  return (
    <View style={styles.tela}>
      <LinearGradient
        colors={["#26383e", "#181b1c"]}
        locations={[0, 0.55]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.fundo}
      />
      <AppHeader nome="José" />

      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resumo}>
          <Text style={styles.rotuloConta}>conta</Text>
          <Text style={styles.saldo}>{moeda(saldo)}</Text>
          <Text style={styles.totalDividas}>- {moeda(dividas)}</Text>
        </View>

        <View style={styles.colunas}>
          <View style={styles.acoesColuna}>
            <Text style={styles.tituloSecao}>controles</Text>
            <Pressable
              accessibilityRole="button"
              style={[styles.acao, styles.acaoEntrada]}
              onPress={() => router.push("/valor?tipo=entrada")}
            >
              <Text style={styles.textoAcao}>+</Text>
              <Text style={styles.rotuloAcao}>entrada</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={[styles.acao, styles.acaoDivida]}
              onPress={() => router.push("/valor?tipo=divida")}
            >
              <Text style={styles.textoAcao}>−</Text>
              <Text style={styles.rotuloAcao}>gasto</Text>
            </Pressable>
            <View style={styles.cartaoAnalise}>
              <Text style={styles.tituloAnalise}>análise</Text>
              <Text style={styles.valorAnalise}>{registros.length}</Text>
              <Text style={styles.subtituloAnalise}>lançamentos</Text>
              <Text style={styles.valorAnalise}>{moeda(saldo)}</Text>
              <Text style={styles.subtituloAnalise}>saldo atual</Text>
            </View>
          </View>

          <View style={styles.historicoColuna}>
            <Text style={styles.tituloHistorico}>Histórico</Text>
            {carregando ? (
              <ActivityIndicator color="#9ab4c5" />
            ) : erro ? (
              <Text style={styles.textoErro}>{erro}</Text>
            ) : historico.length === 0 ? (
              <Text style={styles.listaVazia}>Nenhum lançamento ainda.</Text>
            ) : (
              historico.map((registro) => (
                <Pressable
                  key={registro.id}
                  style={styles.itemHistorico}
                  onPress={() => abrirRegistro(registro)}
                >
                  <View style={styles.dadosHistorico}>
                    <Text numberOfLines={1} style={styles.nomeRegistro}>
                      {registro.nome}
                    </Text>
                    <Text style={styles.tipoRegistro}>
                      {registro.tipo === "entrada" ? "entrada" : "gasto"}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.valorRegistro,
                      registro.tipo === "entrada"
                        ? styles.valorEntrada
                        : styles.valorDivida,
                    ]}
                  >
                    {registro.tipo === "entrada" ? "+" : "-"}
                    {moeda(registro.valor)}
                  </Text>
                </Pressable>
              ))
            )}
            {!carregando && registros.length > historico.length ? (
              <Text style={styles.dicaHistorico}>
                Toque em um lançamento para ver todos.
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.contas}>
          <Text style={styles.tituloContas}>contas</Text>
          {contas.length === 0 ? (
            <Text style={styles.listaVazia}>Nenhuma conta pendente.</Text>
          ) : (
            contas.map((conta, indice) => (
              <Pressable
                key={conta.id}
                style={styles.itemConta}
                onPress={() => abrirRegistro(conta)}
              >
                <Text numberOfLines={1} style={styles.nomeConta}>
                  {indice + 1}- {conta.nome}
                </Text>
                <Text style={styles.valorDivida}>
                  -{moeda(conta.valor)}
                </Text>
              </Pressable>
            ))
          )}
        </View>

        <Pressable style={styles.botaoVoltar} onPress={() => router.replace("/")}>
          <Text style={styles.textoVoltar}>Voltar</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#181b1c",
  },
  fundo: {
    ...StyleSheet.absoluteFillObject,
  },
  conteudo: {
    paddingHorizontal: 12,
    paddingTop: 96,
    paddingBottom: 30,
  },
  resumo: {
    minHeight: 128,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  rotuloConta: {
    alignSelf: "flex-start",
    color: "#89979b",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 14,
    marginBottom: 6,
  },
  saldo: {
    color: "#f7f8f9",
    fontSize: 30,
    fontWeight: "700",
  },
  totalDividas: {
    color: "#d32028",
    fontSize: 14,
    marginTop: 8,
  },
  colunas: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  acoesColuna: {
    width: "43%",
    gap: 10,
  },
  tituloSecao: {
    color: "#91aabd",
    backgroundColor: "#080b0c",
    borderRadius: 8,
    paddingVertical: 9,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    textTransform: "lowercase",
  },
  acao: {
    minHeight: 52,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  acaoEntrada: {
    backgroundColor: "#007b9e",
  },
  acaoDivida: {
    backgroundColor: "#610506",
  },
  textoAcao: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  rotuloAcao: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  cartaoAnalise: {
    minHeight: 132,
    borderRadius: 12,
    backgroundColor: "#090c0d",
    padding: 12,
  },
  tituloAnalise: {
    color: "#91aabd",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 7,
  },
  valorAnalise: {
    color: "#f5f5f5",
    fontWeight: "700",
    fontSize: 14,
    marginTop: 4,
  },
  subtituloAnalise: {
    color: "#99a2a4",
    fontSize: 11,
  },
  historicoColuna: {
    flex: 1,
    minHeight: 170,
    borderRadius: 14,
    backgroundColor: "#0b0e0f",
    padding: 10,
  },
  tituloHistorico: {
    color: "#a7a9aa",
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "700",
    marginBottom: 7,
  },
  itemHistorico: {
    minHeight: 43,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 5,
    paddingHorizontal: 9,
    marginBottom: 5,
    borderRadius: 12,
    backgroundColor: "#15191a",
  },
  dadosHistorico: {
    flex: 1,
  },
  nomeRegistro: {
    color: "#f1f2f2",
    fontSize: 13,
    fontWeight: "700",
  },
  tipoRegistro: {
    color: "#9ea9ac",
    fontSize: 10,
  },
  valorRegistro: {
    fontSize: 10,
    fontWeight: "700",
  },
  valorEntrada: {
    color: "#21c34a",
  },
  valorDivida: {
    color: "#db1118",
  },
  dicaHistorico: {
    color: "#9ea9ac",
    fontSize: 10,
    textAlign: "center",
    marginTop: 3,
  },
  contas: {
    marginTop: 22,
    padding: 11,
    borderRadius: 16,
    backgroundColor: "#101314",
  },
  tituloContas: {
    color: "#a7a9aa",
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  itemConta: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingHorizontal: 12,
    marginBottom: 7,
    borderRadius: 13,
    backgroundColor: "#050809",
  },
  nomeConta: {
    flex: 1,
    color: "#f1f2f2",
    fontSize: 12,
    fontWeight: "600",
  },
  listaVazia: {
    color: "#9ea9ac",
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 10,
  },
  textoErro: {
    color: "#ff9b9b",
    fontSize: 12,
  },
  botaoVoltar: {
    alignSelf: "center",
    marginTop: 18,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#3b4649",
  },
  textoVoltar: {
    color: "#fff",
    fontWeight: "700",
  },
});
