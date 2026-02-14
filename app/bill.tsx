import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const GST_RATE = 0.18;

export default function BillScreen() {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [gstType, setGstType] = useState<"EXCLUDED" | "INCLUDED">("EXCLUDED");
  const [items, setItems] = useState<any[]>([]);

  const calculateItem = (price: string, quantity: string, gstType: string) => {
    const p = parseFloat(price);
    const q = parseFloat(quantity);
    if (isNaN(p) || isNaN(q)) return null;

    let base = 0;
    let gst = 0;
    let total = 0;

    if (gstType === "EXCLUDED") {
      base = p * q;
      gst = base * GST_RATE;
      total = base + gst;
    } else {
      total = p * q;
      base = total / (1 + GST_RATE);
      gst = total - base;
    }

    return {
      base: Number(base.toFixed(2)),
      gst: Number(gst.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  };

  const addItem = () => {
    if (!itemName || !price || !quantity) return;

    const calc = calculateItem(price, quantity, gstType);
    if (!calc) return;

    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: itemName,
        ...calc,
      },
    ]);

    setItemName("");
    setPrice("");
    setQuantity("");
  };

  const totals = items.reduce(
    (acc, item) => {
      acc.base += item.base;
      acc.gst += item.gst;
      acc.total += item.total;
      return acc;
    },
    { base: 0, gst: 0, total: 0 }
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Bill</Text>

      <TextInput
        placeholder="Item Name"
        placeholderTextColor="#666"
        value={itemName}
        onChangeText={setItemName}
        style={styles.input}
      />

      <TextInput
        placeholder="Price"
        placeholderTextColor="#666"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Quantity"
        placeholderTextColor="#666"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            gstType === "EXCLUDED" && styles.activeToggle,
          ]}
          onPress={() => setGstType("EXCLUDED")}
        >
          <Text style={styles.toggleText}>GST Excluded</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            gstType === "INCLUDED" && styles.activeToggle,
          ]}
          onPress={() => setGstType("INCLUDED")}
        >
          <Text style={styles.toggleText}>GST Included</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={addItem}>
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>

      {/* Rectangle Chips */}
      <View style={styles.chipContainer}>
        {items.map((item) => (
          <View key={item.id} style={styles.chip}>
            <Text style={styles.chipText}>
              {item.name} - ₹{item.total}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.summary}>
        <Text>Subtotal: ₹{totals.base.toFixed(2)}</Text>
        <Text>GST: ₹{totals.gst.toFixed(2)}</Text>
        <Text style={styles.grand}>
          Grand Total: ₹{totals.total.toFixed(2)}
        </Text>
      </View>

      <TouchableOpacity style={styles.generateButton}>
        <Text style={styles.buttonText}>Generate Bill PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    color: "#000",
    backgroundColor: "#fff",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  toggleButton: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  activeToggle: {
    backgroundColor: "#4CAF50",
  },
  toggleText: {
    fontWeight: "600",
    color: "#000",
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  generateButton: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 15,
  },
  chip: {
    backgroundColor: "#e0e0e0",
    padding: 8,
    borderRadius: 6,
    margin: 5,
  },
  chipText: {
    color: "#000",
  },
  summary: {
    marginTop: 20,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  grand: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 5,
  },
});
