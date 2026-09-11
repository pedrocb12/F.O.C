import AsyncStorage from "@react-native-async-storage/async-storage";

export type RegistroTipo = "entrada" | "divida";

export type Registro = {
  id: string;
  nome: string;
  valor: number;
  tipo: RegistroTipo;
};

export const STORAGE_KEY = "@foc:registros";

export const registrosIniciais: Registro[] = [
  { id: "salario", nome: "Salário", valor: 2000, tipo: "entrada" },
  { id: "mercado", nome: "Compras do mercado", valor: 400, tipo: "divida" },
  { id: "transporte", nome: "Transporte", valor: 200, tipo: "divida" },
];

export async function carregarRegistros(): Promise<Registro[]> {
  try {
    const dados = await AsyncStorage.getItem(STORAGE_KEY);

    if (!dados) {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(registrosIniciais),
      );
      return registrosIniciais;
    }

    const parsed = JSON.parse(dados) as Registro[];

    if (!Array.isArray(parsed) || parsed.length === 0) {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(registrosIniciais),
      );
      return registrosIniciais;
    }

    return parsed;
  } catch {
    return registrosIniciais;
  }
}

export async function salvarRegistros(registros: Registro[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
}

export async function adicionarRegistro(registro: Registro) {
  const registrosAtuais = await carregarRegistros();
  const novaLista = [...registrosAtuais, registro];
  await salvarRegistros(novaLista);
  return novaLista;
}
