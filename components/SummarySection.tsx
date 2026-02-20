import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { billStyles } from "../styles/bill.styles";

interface SummarySectionProps {
  grandTotal: number;
  totalGST: number;
  gstIncluded: boolean;
  items: any[];
  isGenerating?: boolean;
  onGeneratePDF: () => void;
}

export const SummarySection = ({
  grandTotal,
  totalGST,
  gstIncluded,
  items,
  isGenerating = false,
  onGeneratePDF,
}: SummarySectionProps) => {
  return (
    <>
      {items.length > 0 && (
        <View style={billStyles.summarySection}>
          <View style={billStyles.summaryRow}>
            <Text style={billStyles.summaryLabel}>Subtotal:</Text>
            <Text style={billStyles.summaryValue}>Rs. {grandTotal.toFixed(2)}</Text>
          </View>
          {!gstIncluded && (
            <View style={billStyles.summaryRow}>
              <Text style={billStyles.summaryLabel}>GST (18%):</Text>
              <Text style={billStyles.summaryValue}>Rs. {totalGST.toFixed(2)}</Text>
            </View>
          )}
          <View style={billStyles.summaryDivider} />
          <View style={billStyles.totalRow}>
            <Text style={billStyles.totalLabel}>Grand Total:</Text>
            <Text style={billStyles.totalAmount}>
              Rs. {(grandTotal + totalGST).toFixed(2)}
            </Text>
          </View>
          <Text style={billStyles.gstNote}>
            {gstIncluded
              ? "GST @18% included in prices"
              : "GST @18% added separately"}
          </Text>
        </View>
      )}

      {items.length > 0 && (
        <TouchableOpacity
          style={[
            billStyles.generateButton,
            isGenerating && billStyles.generateButtonDisabled,
          ]}
          onPress={onGeneratePDF}
          disabled={isGenerating}
        >
          <Text style={billStyles.generateButtonText}>
            {isGenerating ? "Generating PDF..." : "Generate & Share PDF"}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};
