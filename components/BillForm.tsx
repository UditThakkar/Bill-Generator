import React from "react";
import { Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/colors";
import { billStyles } from "../styles/bill.styles";
import { InventoryProduct } from "../utils/inventory";

interface BillFormProps {
  itemName: string;
  vehicleBrand: string;
  quantity: string;
  listPrice: string;
  discount: string;
  gstIncluded: boolean;
  showGstNumber: boolean;
  validationErrors: string;
  onItemNameChange: (value: string) => void;
  onVehicleBrandChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  onListPriceChange: (value: string) => void;
  onDiscountChange: (value: string) => void;
  onGstIncludedChange: (value: boolean) => void;
  onShowGstNumberChange: (value: boolean) => void;
  productSuggestions: InventoryProduct[];
  onSelectProductSuggestion: (product: InventoryProduct) => void;
  onAddItem: () => void;
}

export const BillForm = ({
  itemName,
  vehicleBrand,
  quantity,
  listPrice,
  discount,
  gstIncluded,
  showGstNumber,
  validationErrors,
  onItemNameChange,
  onVehicleBrandChange,
  onQuantityChange,
  onListPriceChange,
  onDiscountChange,
  onGstIncludedChange,
  onShowGstNumberChange,
  productSuggestions,
  onSelectProductSuggestion,
  onAddItem,
}: BillFormProps) => {
  return (
    <View style={billStyles.formSection}>
      <TouchableOpacity
        style={billStyles.checkboxRow}
        onPress={() => onShowGstNumberChange(!showGstNumber)}
        activeOpacity={0.8}
      >
        <View style={[billStyles.checkbox, showGstNumber && billStyles.checkboxChecked]}>
          {showGstNumber ? <Text style={billStyles.checkboxTick}>X</Text> : null}
        </View>
        <View style={billStyles.checkboxTextWrap}>
          <Text style={billStyles.checkboxLabel}>Show GST Number on Bill</Text>
          <Text style={billStyles.checkboxSubtext}>
            This only changes invoice display, not pricing.
          </Text>
        </View>
      </TouchableOpacity>

      <View style={billStyles.sectionHeader}>
        <Text style={billStyles.sectionTitle}>Add Items</Text>
      </View>

      <View style={billStyles.formGroup}>
        <Text style={billStyles.label}>Item Name *</Text>
        <TextInput
          placeholder="Enter item name"
          value={itemName}
          onChangeText={onItemNameChange}
          style={billStyles.input}
          placeholderTextColor={COLORS.textSecondary}
        />
        {productSuggestions.length > 0 ? (
          <View style={billStyles.suggestionsBox}>
            {productSuggestions.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={billStyles.suggestionItem}
                onPress={() => onSelectProductSuggestion(product)}
              >
                <Text style={billStyles.suggestionName}>{product.itemName}</Text>
                <Text style={billStyles.suggestionMeta}>
                  {product.vehicleBrand || "No brand"} | Rs. {product.listPrice.toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>

      <View style={billStyles.formGroup}>
        <Text style={billStyles.label}>Vehicle Brand</Text>
        <TextInput
          placeholder="e.g., Maruti, Honda, Bajaj"
          value={vehicleBrand}
          onChangeText={onVehicleBrandChange}
          style={billStyles.input}
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>

      <View style={billStyles.row}>
        <View style={[billStyles.formGroup, billStyles.flex1]}>
          <Text style={billStyles.label}>Quantity *</Text>
          <TextInput
            placeholder="0"
            keyboardType="decimal-pad"
            value={quantity}
            onChangeText={onQuantityChange}
            style={billStyles.input}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>
        <View style={[billStyles.formGroup, billStyles.flex1]}>
          <Text style={billStyles.label}>List Price (Rs.) *</Text>
          <TextInput
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={listPrice}
            onChangeText={onListPriceChange}
            style={billStyles.input}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>
      </View>

      <View style={billStyles.formGroup}>
        <Text style={billStyles.label}>Discount %</Text>
        <TextInput
          placeholder="0"
          keyboardType="decimal-pad"
          value={discount}
          onChangeText={onDiscountChange}
          style={billStyles.input}
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>

      {validationErrors ? (
        <View style={billStyles.errorBox}>
          <Text style={billStyles.errorText}>Warning: {validationErrors}</Text>
        </View>
      ) : null}

      <View style={billStyles.gstToggleSection}>
        <View>
          <Text style={billStyles.gstToggleLabel}>Is GST included in List Price?</Text>
          <Text style={billStyles.gstToggleSubtext}>
            {gstIncluded
              ? "GST is already included (18%)"
              : "GST will be added separately"}
          </Text>
        </View>
        <Switch
          value={gstIncluded}
          onValueChange={onGstIncludedChange}
          trackColor={{ false: "#ccc", true: "#81C784" }}
          thumbColor={gstIncluded ? COLORS.secondary : "#f4f3f4"}
        />
      </View>

      <TouchableOpacity style={billStyles.addButton} onPress={onAddItem}>
        <Text style={billStyles.addButtonText}>+ Add Item</Text>
      </TouchableOpacity>
    </View>
  );
};
