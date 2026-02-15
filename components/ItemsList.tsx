import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { billStyles } from "../styles/bill.styles";
import { BillItem } from "../utils/calculations";

interface ItemsListProps {
  items: BillItem[];
  onRemoveItem: (id: string) => void;
}

export const ItemsList = ({ items, onRemoveItem }: ItemsListProps) => {
  const handleRemoveItem = (id: string) => {
    Alert.alert("Delete Item", "Are you sure you want to remove this item?", [
      { text: "Cancel", onPress: () => {}, style: "cancel" },
      {
        text: "Delete",
        onPress: () => onRemoveItem(id),
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={billStyles.itemsSection}>
      <View style={billStyles.sectionHeader}>
        <Text style={billStyles.sectionTitle}>📝 Items ({items.length})</Text>
      </View>

      {items.map((item, index) => (
        <View key={item.id} style={billStyles.itemCard}>
          <View style={billStyles.itemHeader}>
            <Text style={billStyles.itemNumber}>{index + 1}</Text>
            <View style={billStyles.itemInfo}>
              <Text style={billStyles.itemName}>{item.itemName}</Text>
              {item.vehicleBrand && (
                <Text style={billStyles.itemBrand}>🚗 {item.vehicleBrand}</Text>
              )}
            </View>
            <TouchableOpacity
              style={billStyles.deleteButton}
              onPress={() => handleRemoveItem(item.id)}
            >
              <Text style={billStyles.deleteButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>

          <View style={billStyles.itemDetails}>
            <View style={billStyles.detailRow}>
              <Text style={billStyles.detailLabel}>Qty:</Text>
              <Text style={billStyles.detailValue}>{item.quantity}</Text>
            </View>
            <View style={billStyles.detailRow}>
              <Text style={billStyles.detailLabel}>List Price:</Text>
              <Text style={billStyles.detailValue}>₹{item.listPrice.toFixed(2)}</Text>
            </View>
            {item.discountPercent > 0 && (
              <View style={[billStyles.detailRow, billStyles.discountRow]}>
                <Text style={billStyles.discountLabel}>Discount:</Text>
                <Text style={billStyles.discountValue}>-{item.discountPercent}%</Text>
              </View>
            )}
            <View style={billStyles.divider} />
            <View style={billStyles.detailRow}>
              <Text style={billStyles.detailLabel}>Net Price:</Text>
              <Text style={billStyles.detailValue}>₹{item.net.toFixed(2)}</Text>
            </View>
            <View style={[billStyles.detailRow, billStyles.amountRow]}>
              <Text style={billStyles.amountLabel}>Total Amount:</Text>
              <Text style={billStyles.amountValue}>₹{item.amount.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};
