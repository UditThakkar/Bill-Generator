import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";

export interface InventoryProduct {
  id: string;
  itemName: string;
  vehicleBrand: string;
  listPrice: number;
  createdAt: string;
  updatedAt: string;
}

interface AddInventoryProductInput {
  itemName: string;
  vehicleBrand?: string;
  listPrice: number;
}

interface AddInventoryProductResult {
  wasCreated: boolean;
  product: InventoryProduct;
}

const normalize = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();
const normalizeNameKey = (value: string) => normalize(value).replace(/\s+/g, "");

const DB_NAME = "inventory.db";

let dbPromise: Promise<SQLiteDatabase> | null = null;

const getDb = async () => {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await openDatabaseAsync(DB_NAME);
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS inventory_products (
          id TEXT PRIMARY KEY NOT NULL,
          item_name TEXT NOT NULL,
          vehicle_brand TEXT NOT NULL DEFAULT '',
          list_price REAL NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
      `);
      await db.execAsync(`
        DELETE FROM inventory_products
        WHERE rowid NOT IN (
          SELECT MIN(rowid)
          FROM inventory_products
          GROUP BY lower(replace(trim(item_name), ' ', ''))
        );
      `);
      await db.execAsync(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_inventory_item_name_unique
        ON inventory_products (lower(replace(trim(item_name), ' ', '')));
      `);

      return db;
    })();
  }

  return dbPromise;
};

const mapRowToProduct = (row: {
  id: string;
  item_name: string;
  vehicle_brand: string;
  list_price: number;
  created_at: string;
  updated_at: string;
}): InventoryProduct => ({
  id: row.id,
  itemName: row.item_name,
  vehicleBrand: row.vehicle_brand,
  listPrice: row.list_price,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const loadInventory = async (): Promise<InventoryProduct[]> => {
  const db = await getDb();
  const rows = await db.getAllAsync<{
    id: string;
    item_name: string;
    vehicle_brand: string;
    list_price: number;
    created_at: string;
    updated_at: string;
  }>(
    `SELECT id, item_name, vehicle_brand, list_price, created_at, updated_at
     FROM inventory_products
     ORDER BY datetime(created_at) DESC`
  );

  return rows.map(mapRowToProduct);
};

export const searchInventoryProducts = async (
  searchText: string,
  limit = 6
): Promise<InventoryProduct[]> => {
  const query = searchText.trim();
  if (!query) {
    return [];
  }

  const db = await getDb();
  const rows = await db.getAllAsync<{
    id: string;
    item_name: string;
    vehicle_brand: string;
    list_price: number;
    created_at: string;
    updated_at: string;
  }>(
    `SELECT id, item_name, vehicle_brand, list_price, created_at, updated_at
     FROM inventory_products
     WHERE lower(item_name) LIKE ?
     ORDER BY item_name ASC
     LIMIT ?`,
    `%${normalize(query)}%`,
    limit
  );

  return rows.map(mapRowToProduct);
};

export const addProductIfMissing = async ({
  itemName,
  vehicleBrand = "",
  listPrice,
}: AddInventoryProductInput): Promise<AddInventoryProductResult> => {
  const trimmedItemName = itemName.trim();
  const trimmedVehicleBrand = vehicleBrand.trim();

  if (!trimmedItemName) {
    throw new Error("Item name is required to save inventory.");
  }

  const db = await getDb();
  const normalizedItemNameKey = normalizeNameKey(trimmedItemName);

  const existingProduct = await db.getFirstAsync<{
    id: string;
    item_name: string;
    vehicle_brand: string;
    list_price: number;
    created_at: string;
    updated_at: string;
  }>(
    `SELECT id, item_name, vehicle_brand, list_price, created_at, updated_at
     FROM inventory_products
     WHERE lower(replace(trim(item_name), ' ', '')) = ?
     LIMIT 1`,
    normalizedItemNameKey
  );

  if (existingProduct) {
    return {
      wasCreated: false,
      product: mapRowToProduct(existingProduct),
    };
  }

  const timestamp = new Date().toISOString();
  const newProduct: InventoryProduct = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    itemName: trimmedItemName,
    vehicleBrand: trimmedVehicleBrand,
    listPrice,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await db.runAsync(
    `INSERT INTO inventory_products (id, item_name, vehicle_brand, list_price, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    newProduct.id,
    newProduct.itemName,
    newProduct.vehicleBrand,
    newProduct.listPrice,
    newProduct.createdAt,
    newProduct.updatedAt
  );

  return { wasCreated: true, product: newProduct };
};
