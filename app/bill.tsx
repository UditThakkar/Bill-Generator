import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
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
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [quantity, setQuantity] = useState("");
  const [listPrice, setListPrice] = useState(""); // price with GST
  const [discount, setDiscount] = useState("");
  const { customerName } = useLocalSearchParams();

  const [items, setItems] = useState<any[]>([]);

  const addItem = () => {
    const qty = parseFloat(quantity);
    const list = parseFloat(listPrice);
    const discountPercent = parseFloat(discount) || 0;

    if (!itemName || !qty || !list) return;

    const discountAmount = list * (discountPercent / 100);
    const net = list - discountAmount;
    const amount = net * qty;

    const newItem = {
      id: Date.now().toString(),
      itemName,
      vehicleBrand,
      quantity: qty,
      listPrice: list,
      discountPercent,
      discountAmount,
      net,
      amount,
    };

    setItems([...items, newItem]);

    setItemName("");
    setVehicleBrand("");
    setQuantity("");
    setListPrice("");
    setDiscount("");
  };

  const grandTotal = items.reduce((acc, item) => acc + item.amount, 0);

  const generatePDF = async () => {
  if (items.length === 0) return;

  const today = new Date().toLocaleDateString();

  const rows = items
    .map(
      (item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${item.itemName}</td>
        <td>${item.vehicleBrand || "-"}</td>
        <td>${item.quantity}</td>
        <td>${item.listPrice}</td>
        <td>${item.discountPercent}%</td>
        <td>${item.net.toFixed(2)}</td>
        <td>${item.amount.toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  const html = `
<html>
<head>
<meta charset="UTF-8" />
<style>
  body {
    font-family: Arial;
    padding: 25px;
  }

  .top-section {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .left {
    width: 50%;
    font-size: 14px;
  }

  .right {
    width: 50%;
    text-align: right;
    font-size: 14px;
  }

  .shop-hindi {
    font-weight: bold;
    font-size: 18px;
  }

  .shop-english {
    font-weight: bold;
    font-size: 18px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    border: 1px solid black;
    padding: 6px;
    font-size: 12px;
    text-align: center;
  }

  th {
    background: #f2f2f2;
  }

  .total {
    margin-top: 20px;
    text-align: right;
    font-weight: bold;
    font-size: 16px;
  }
</style>
</head>

<body>

<div class="top-section">

  <div class="left">
    <strong>Customer Name:</strong><br/>
    ${customerName || ""}
  </div>

  <div class="right">
    <div class="shop-hindi">जय भवानी ऑटो पार्ट्स</div>
    <div class="shop-english">Jai Bhavani Auto Parts</div>
    <div>मालिक: सुनील लोनारे</div>
    <div>Mobile: 9893916497</div>
    <div>पुलसुद रोड, राजपुर</div>
    <div>GSTIN: 23DCOPK7549M1ZV</div>
    <div>Date: ${today}</div>
  </div>

</div>

<table>
  <thead>
    <tr>
      <th>S.No</th>
      <th>Item Name</th>
      <th>Vehicle Brand</th>
      <th>Qty</th>
      <th>List</th>
      <th>Discount</th>
      <th>Net</th>
      <th>Amount</th>
    </tr>
  </thead>
  <tbody>
    ${rows}
  </tbody>
</table>

<div class="total">
  Grand Total: ₹${grandTotal.toFixed(2)}
</div>

</body>
</html>
  `;

  const { uri } = await Print.printToFileAsync({
  html,
});

  const pdfName = `Bill_${Date.now()}.pdf`;

  // Correct modern path
  const destination = new FileSystem.File(
    FileSystem.Paths.document,
    pdfName
  );

  // Move generated file to document directory
  const tempFile = new FileSystem.File(uri);
  await tempFile.move(destination);

  await Sharing.shareAsync(destination.uri);
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Bill</Text>

      <TextInput
        placeholder="Item Name"
        value={itemName}
        onChangeText={setItemName}
        style={styles.input}
      />

      <TextInput
        placeholder="Vehicle Brand (Optional)"
        value={vehicleBrand}
        onChangeText={setVehicleBrand}
        style={styles.input}
      />

      <TextInput
        placeholder="Quantity"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
        style={styles.input}
      />

      <TextInput
        placeholder="List Price (Rate with GST)"
        keyboardType="numeric"
        value={listPrice}
        onChangeText={setListPrice}
        style={styles.input}
      />

      <TextInput
        placeholder="Discount % (Optional)"
        keyboardType="numeric"
        value={discount}
        onChangeText={setDiscount}
        style={styles.input}
      />

      <TouchableOpacity style={styles.addButton} onPress={addItem}>
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>

      <View style={styles.itemsContainer}>
        {items.map((item, index) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.bold}>
              {index + 1}. {item.itemName}
            </Text>
            <Text>Brand: {item.vehicleBrand || "-"}</Text>
            <Text>Qty: {item.quantity}</Text>
            <Text>List: ₹{item.listPrice}</Text>
            <Text>Discount: {item.discountPercent}%</Text>
            <Text>Net: ₹{item.net.toFixed(2)}</Text>
            <Text>Amount: ₹{item.amount.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.total}>
        Grand Total: ₹{grandTotal.toFixed(2)}
      </Text>

      <TouchableOpacity style={styles.generateButton} onPress={generatePDF}>
        <Text style={styles.buttonText}>Generate Bill PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  generateButton: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  itemsContainer: {
    marginTop: 20,
  },
  card: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
  },
});
