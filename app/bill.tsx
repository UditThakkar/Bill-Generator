import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

import { BillForm } from "../components/BillForm";
import { ItemsList } from "../components/ItemsList";
import { SummarySection } from "../components/SummarySection";
import { billStyles } from "../styles/bill.styles";
import {
  BillItem,
  calculateTotals,
  createBillItem,
  validateItemInput,
} from "../utils/calculations";
import {
  addProductIfMissing,
  InventoryProduct,
  searchInventoryProducts,
} from "../utils/inventory";
import { generatePDF } from "../utils/pdf";

export default function BillScreen() {
  const { customerName } = useLocalSearchParams();

  // Form state
  const [itemName, setItemName] = useState("");
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [quantity, setQuantity] = useState("");
  const [listPrice, setListPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [productSuggestions, setProductSuggestions] = useState<InventoryProduct[]>(
    []
  );

  // App state
  const [items, setItems] = useState<BillItem[]>([]);
  const [validationErrors, setValidationErrors] = useState("");
  const [gstIncluded, setGstIncluded] = useState(true);
  const [showGstNumber, setShowGstNumber] = useState(true);

  // Calculate totals
  const { grandTotal, totalGST } = calculateTotals(items, gstIncluded);

  useEffect(() => {
    let cancelled = false;

    const runSearch = async () => {
      const query = itemName.trim();
      if (!query) {
        setProductSuggestions([]);
        return;
      }

      const matches = await searchInventoryProducts(query);
      if (!cancelled) {
        setProductSuggestions(matches);
      }
    };

    runSearch();

    return () => {
      cancelled = true;
    };
  }, [itemName]);

  const handleSelectProductSuggestion = (product: InventoryProduct) => {
    setItemName(product.itemName);
    setVehicleBrand(product.vehicleBrand);
    setListPrice(product.listPrice.toString());
    setProductSuggestions([]);
  };

  const handleAddItem = async () => {
    const validation = validateItemInput(itemName, quantity, listPrice, discount);

    if (validation.hasError) {
      setValidationErrors(validation.message);
      return;
    }

    const newItem = createBillItem(
      itemName,
      vehicleBrand,
      quantity,
      listPrice,
      discount
    );

    setItems([...items, newItem]);
    try {
      const { wasCreated } = await addProductIfMissing({
        itemName: newItem.itemName,
        vehicleBrand: newItem.vehicleBrand,
        listPrice: newItem.listPrice,
      });

      if (wasCreated) {
        Alert.alert("Inventory Updated", `${newItem.itemName} added to inventory.`);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not update inventory.";
      Alert.alert("Inventory Error", message);
    }

    // Reset form
    setItemName("");
    setVehicleBrand("");
    setQuantity("");
    setListPrice("");
    setDiscount("");
    setProductSuggestions([]);
    setValidationErrors("");
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleGeneratePDF = () => {
    generatePDF(
      items,
      customerName as string,
      grandTotal,
      totalGST,
      gstIncluded,
      showGstNumber
    );
  };

  return (
    <ScrollView 
      contentContainerStyle={billStyles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={billStyles.header}>
        <Text style={billStyles.title}>📋 Create Bill</Text>
        <Text style={billStyles.subtitle}>
          {customerName ? `For: ${customerName}` : "Enter customer details"}
        </Text>
      </View>

      {/* Form */}
      <BillForm
        itemName={itemName}
        vehicleBrand={vehicleBrand}
        quantity={quantity}
        listPrice={listPrice}
        discount={discount}
        gstIncluded={gstIncluded}
        showGstNumber={showGstNumber}
        validationErrors={validationErrors}
        onItemNameChange={setItemName}
        onVehicleBrandChange={setVehicleBrand}
        onQuantityChange={setQuantity}
        onListPriceChange={setListPrice}
        onDiscountChange={setDiscount}
        onGstIncludedChange={setGstIncluded}
        onShowGstNumberChange={setShowGstNumber}
        productSuggestions={productSuggestions}
        onSelectProductSuggestion={handleSelectProductSuggestion}
        onAddItem={handleAddItem}
      />

      {/* Items List */}
      {items.length > 0 && (
        <ItemsList items={items} onRemoveItem={handleRemoveItem} />
      )}

      {/* Summary & Actions */}
      <SummarySection
        grandTotal={grandTotal}
        totalGST={totalGST}
        gstIncluded={gstIncluded}
        items={items}
        onGeneratePDF={handleGeneratePDF}
      />

      <View style={billStyles.spacing} />
    </ScrollView>
  );
}


