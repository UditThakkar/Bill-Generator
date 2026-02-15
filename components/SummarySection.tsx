import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { billStyles } from "../styles/bill.styles";

interface SummarySectionProps {
  grandTotal: number;
  totalGST: number;
  gstIncluded: boolean;
  items: any[];
  onGeneratePDF: () => void;
}

export const SummarySection = ({
  grandTotal,
  totalGST,
  gstIncluded,
  items,
  onGeneratePDF,
}: SummarySectionProps) => {
  return (
    <>
      {items.length > 0 && (
        <View style={billStyles.summarySection}>
          <View style={billStyles.summaryRow}>
            <Text style={billStyles.summaryLabel}>Subtotal:</Text>
            <Text style={billStyles.summaryValue}>₹{grandTotal.toFixed(2)}</Text>
          </View>
          {!gstIncluded && (
            <View style={billStyles.summaryRow}>
              <Text style={billStyles.summaryLabel}>GST (18%):</Text>
              <Text style={billStyles.summaryValue}>₹{totalGST.toFixed(2)}</Text>
            </View>
          )}
          <View style={billStyles.summaryDivider} />
          <View style={billStyles.totalRow}>
            <Text style={billStyles.totalLabel}>Grand Total:</Text>
            <Text style={billStyles.totalAmount}>
              ₹{(grandTotal + totalGST).toFixed(2)}
            </Text>
          </View>
          <Text style={billStyles.gstNote}>
            {gstIncluded
              ? "💡 GST @18% included in prices"
              : "💡 GST @18% added separately"}
          </Text>
        </View>
      )}

      {items.length > 0 && (
        <TouchableOpacity 
          style={billStyles.generateButton} 
          onPress={onGeneratePDF}
        >
          <Text style={billStyles.generateButtonText}>📄 Generate & Share PDF</Text>
        </TouchableOpacity>
      )}
    </>
  );
};
