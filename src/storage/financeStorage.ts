import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";

export type RegistroTipo = "entrada" | "divida";

export type Registro = {
  id: string;
  nome: string;
  valor: number;
  tipo: RegistroTipo;
};

export const STORAGE_KEY = "@foc:registros";
const DATABASE_NAME = "foc.db";

export const registrosIniciais: Registro[] = [
  { id: "salario", nome: "Salário", valor: 2000, tipo: "entrada" },
  { id: "mercado", nome: "Compras do mercado", valor: 400, tipo: "divida" },
  { id: "transporte", nome: "Transporte", valor: 200, tipo: "divida" },
];

let databasePromise: Promise<SQLite.SQLiteDatabase> | undefined;

function validarRegistros(valor: unknown): Registro[] {
  if (!Array.isArray(valor)) {
    throw new Error("Os dados financeiros salvos não estão em um formato válido.");
  }

  return valor.map((item: unknown) => {
    if (
      typeof item !== "object" ||
      item === null ||
      !("id" in item) ||
      !("nome" in item) ||
      !("valor" in item) ||
      !("tipo" in item) ||
      typeof item.id !== "string" ||
      typeof item.nome !== "string" ||
      typeof item.valor !== "number" ||
      !Number.isFinite(item.valor) ||
      (item.tipo !== "entrada" && item.tipo !== "divida")
    ) {
      throw new Error("Um lançamento salvo contém dados inválidos.");
    }

    return {
      id: item.id,
      nome: item.nome,
      valor: item.valor,
      tipo: item.tipo,
    };
  });
}

async function inicializarBanco(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS registros (
      id TEXT PRIMARY KEY NOT NULL,
      nome TEXT NOT NULL,
      valor REAL NOT NULL CHECK (valor > 0),
      tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'divida'))
    );
  `);

  const total = await db.getFirstAsync<{ total: number }>(
    "SELECT COUNT(*) AS total FROM registros",
  );

  if (total?.total === 0) {
    const dadosAntigos = await AsyncStorage.getItem(STORAGE_KEY);
    const registrosParaImportar = dadosAntigos
      ? validarRegistros(JSON.parse(dadosAntigos))
      : registrosIniciais;

    await db.withTransactionAsync(async () => {
      for (const registro of registrosParaImportar) {
        await db.runAsync(
          "INSERT INTO registros (id, nome, valor, tipo) VALUES (?, ?, ?, ?)",
          registro.id,
          registro.nome,
          registro.valor,
          registro.tipo,
        );
      }
    });
  }

  return db;
}

async function obterBanco(): Promise<SQLite.SQLiteDatabase> {
  databasePromise ??= inicializarBanco().catch((erro: unknown) => {
    databasePromise = undefined;
    throw erro;
  });
  return databasePromise;
}

export async function carregarRegistros(): Promise<Registro[]> {
  const db = await obterBanco();
  return db.getAllAsync<Registro>(
    "SELECT id, nome, valor, tipo FROM registros ORDER BY rowid DESC",
  );
}

export async function buscarRegistro(id: string): Promise<Registro | null> {
  const db = await obterBanco();
  return db.getFirstAsync<Registro>(
    "SELECT id, nome, valor, tipo FROM registros WHERE id = ?",
    id,
  );
}

export async function adicionarRegistro(registro: Registro): Promise<void> {
  const db = await obterBanco();
  await db.runAsync(
    "INSERT INTO registros (id, nome, valor, tipo) VALUES (?, ?, ?, ?)",
    registro.id,
    registro.nome,
    registro.valor,
    registro.tipo,
  );
}

export async function atualizarRegistro(registro: Registro): Promise<void> {
  const db = await obterBanco();
  const resultado = await db.runAsync(
    "UPDATE registros SET nome = ?, valor = ?, tipo = ? WHERE id = ?",
    registro.nome,
    registro.valor,
    registro.tipo,
    registro.id,
  );

  if (resultado.changes === 0) {
    throw new Error("O lançamento que você tentou editar não foi encontrado.");
  }
}

export async function removerRegistro(id: string): Promise<void> {
  const db = await obterBanco();
  const resultado = await db.runAsync(
    "DELETE FROM registros WHERE id = ?",
    id,
  );

  if (resultado.changes === 0) {
    throw new Error("O lançamento que você tentou excluir não foi encontrado.");
  }
}

export async function salvarRegistros(registros: Registro[]): Promise<void> {
  const db = await obterBanco();
  const registrosValidados = validarRegistros(registros);

  await db.withTransactionAsync(async () => {
    await db.runAsync("DELETE FROM registros");
    for (const registro of registrosValidados) {
      await db.runAsync(
        "INSERT INTO registros (id, nome, valor, tipo) VALUES (?, ?, ?, ?)",
        registro.id,
        registro.nome,
        registro.valor,
        registro.tipo,
      );
    }
  });

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(registrosValidados),
  );
}
