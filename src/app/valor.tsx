import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { adicionarRegistro, type Registro } from "../storage/financeStorage";

export default function EscolherValor() {
  const { tipo } = useLocalSearchParams<{ tipo?: string }>();
  const [nome, setNome] = useState("");
  const [valorTexto, setValorTexto] = useState("");
  const [erro, setErro] = useState("");
  const [nomeTocado, setNomeTocado] = useState(false);
  const [valorTocado, setValorTocado] = useState(false);

  const valor = Number(valorTexto.replace(",", "."));
  const nomeValido = nome.trim().length > 0;
  const valorValido =
    valorTexto.trim().length > 0 && Number.isFinite(valor) && valor > 0;

  const mostrarErroNome = nomeTocado && !nomeValido;
  const mostrarErroValor = valorTocado && !valorValido;
  const podeConfirmar = nomeValido && valorValido;

  function cancelar() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/pg2");
  }

  async function confirmar() {
    setNomeTocado(true);
    setValorTocado(true);

    if (!nomeValido) {
      setErro(
        tipo === "divida"
          ? "Digite o nome do gasto antes de confirmar."
          : "Digite o nome do ganho antes de confirmar.",
      );
      return;
    }

    if (!valorValido) {
      setErro("Digite um valor maior que zero.");
      return;
    }

    const novoRegistro: Registro = {
      id: `${Date.now()}`,
      nome: nome.trim(),
      valor,
      tipo: tipo === "divida" ? "divida" : "entrada",
    };

    setErro("");
    await adicionarRegistro(novoRegistro);
    router.replace("/pg2");
  }

  return (
    <View style={styles.tela}>
      <Text style={styles.titulo}>Escolha a quantia</Text>
      <Text style={styles.subtitulo}>
        {tipo === "divida" ? "Quanto você deve?" : "Quanto você ganhou?"}
      </Text>

      <TextInput
        autoFocus
        style={[styles.campoNome, mostrarErroNome && styles.campoErro]}
        value={nome}
        onChangeText={(texto) => {
          setNome(texto);
          if (nomeTocado) setNomeTocado(true);
          if (erro) setErro("");
        }}
        onBlur={() => setNomeTocado(true)}
        placeholder={tipo === "divida" ? "Nome do gasto" : "Nome do ganho"}
        placeholderTextColor="#A8B4B8"
      />
      {mostrarErroNome ? (
        <Text style={styles.textoErro}>Nome obrigatório.</Text>
      ) : null}

      <TextInput
        style={[styles.campoValor, mostrarErroValor && styles.campoErro]}
        value={valorTexto}
        onChangeText={(texto) => {
          setValorTexto(texto);
          if (valorTocado) setValorTocado(true);
          if (erro) setErro("");
        }}
        onBlur={() => setValorTocado(true)}
        keyboardType="decimal-pad"
        placeholder="Digite o valor"
        placeholderTextColor="#A8B4B8"
      />
      {mostrarErroValor ? (
        <Text style={styles.textoErro}>Digite um valor maior que zero.</Text>
      ) : null}

      {erro ? <Text style={styles.textoErro}>{erro}</Text> : null}

      <Pressable
        style={[
          styles.botaoConfirmar,
          !podeConfirmar && styles.botaoDesativado,
        ]}
        onPress={confirmar}
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
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#181B1C",
  },
  titulo: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitulo: {
    color: "#C7D2D5",
    fontSize: 17,
    marginBottom: 24,
  },
  campoValor: {
    width: 220,
    height: 52,
    borderWidth: 2,
    borderColor: "#8AA5AD",
    borderRadius: 12,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    backgroundColor: "#202829",
    textAlign: "center",
    fontSize: 20,
    marginBottom: 18,
  },
  campoNome: {
    width: 220,
    height: 52,
    borderWidth: 2,
    borderColor: "#8AA5AD",
    borderRadius: 12,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    backgroundColor: "#202829",
    textAlign: "center",
    fontSize: 18,
    marginBottom: 8,
  },
  campoErro: {
    borderColor: "#FF6B6B",
  },
  botaoConfirmar: {
    width: 220,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#386679",
    marginBottom: 12,
  },
  botaoDesativado: {
    opacity: 0.45,
  },
  botaoCancelar: {
    width: 220,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#636363",
  },
  textoBotao: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  textoErro: {
    width: 220,
    color: "#FFB4B4",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 12,
  },
});
