import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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

interface BillDraft {
  id: string;
  customerName: string;
  itemName: string;
  vehicleBrand: string;
  quantity: string;
  listPrice: string;
  discount: string;
  productSuggestions: InventoryProduct[];
  items: BillItem[];
  validationErrors: string;
  gstIncluded: boolean;
  showGstNumber: boolean;
}

const createDraft = (customerName?: string): BillDraft => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  customerName: customerName?.trim() || "New Customer",
  itemName: "",
  vehicleBrand: "",
  quantity: "",
  listPrice: "",
  discount: "",
  productSuggestions: [],
  items: [],
  validationErrors: "",
  gstIncluded: true,
  showGstNumber: true,
});

export default function BillScreen() {
  const { customerName } = useLocalSearchParams();

  const initialCustomerName =
    typeof customerName === "string" ? customerName.trim() : "";

  const [drafts, setDrafts] = useState<BillDraft[]>([
    createDraft(initialCustomerName || undefined),
  ]);
  const [activeDraftId, setActiveDraftId] = useState(drafts[0].id);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [generatingDraftId, setGeneratingDraftId] = useState<string | null>(null);

  const activeDraft = useMemo(
    () => drafts.find((draft) => draft.id === activeDraftId) || drafts[0],
    [drafts, activeDraftId]
  );

  const { grandTotal, totalGST } = calculateTotals(
    activeDraft.items,
    activeDraft.gstIncluded
  );

  const updateDraft = (
    draftId: string,
    updater: (draft: BillDraft) => BillDraft
  ) => {
    setDrafts((currentDrafts) =>
      currentDrafts.map((draft) =>
        draft.id === draftId ? updater(draft) : draft
      )
    );
  };

  const updateActiveDraft = (updater: (draft: BillDraft) => BillDraft) => {
    updateDraft(activeDraft.id, updater);
  };

  const addDraft = () => {
    const trimmedName = newCustomerName.trim();
    const draft = createDraft(trimmedName || undefined);
    setDrafts((currentDrafts) => [...currentDrafts, draft]);
    setActiveDraftId(draft.id);
    setNewCustomerName("");
  };

  const removeDraft = (draftId: string) => {
    if (drafts.length === 1) {
      Alert.alert("Cannot Delete", "At least one bill draft must stay open.");
      return;
    }

    const draftToRemove = drafts.find((draft) => draft.id === draftId);
    const draftName = draftToRemove?.customerName || "this draft";

    Alert.alert("Close Draft", `Close ${draftName}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Close",
        style: "destructive",
        onPress: () => {
          setDrafts((currentDrafts) =>
            currentDrafts.filter((draft) => draft.id !== draftId)
          );

          if (activeDraftId === draftId) {
            const nextDraft = drafts.find((draft) => draft.id !== draftId);
            if (nextDraft) {
              setActiveDraftId(nextDraft.id);
            }
          }
        },
      },
    ]);
  };

  useEffect(() => {
    let cancelled = false;
    const draftId = activeDraft.id;

    const runSearch = async () => {
      const query = activeDraft.itemName.trim();
      if (!query) {
        if (!cancelled) {
          updateDraft(draftId, (draft) => ({ ...draft, productSuggestions: [] }));
        }
        return;
      }

      const matches = await searchInventoryProducts(query);
      if (!cancelled) {
        updateDraft(draftId, (draft) => ({ ...draft, productSuggestions: matches }));
      }
    };

    runSearch();

    return () => {
      cancelled = true;
    };
  }, [activeDraft.id, activeDraft.itemName]);

  const handleSelectProductSuggestion = (product: InventoryProduct) => {
    updateActiveDraft((draft) => ({
      ...draft,
      itemName: product.itemName,
      vehicleBrand: product.vehicleBrand,
      listPrice: product.listPrice.toString(),
      productSuggestions: [],
    }));
  };

  const handleAddItem = async () => {
    const validation = validateItemInput(
      activeDraft.itemName,
      activeDraft.quantity,
      activeDraft.listPrice,
      activeDraft.discount
    );

    if (validation.hasError) {
      updateActiveDraft((draft) => ({
        ...draft,
        validationErrors: validation.message,
      }));
      return;
    }

    const newItem = createBillItem(
      activeDraft.itemName,
      activeDraft.vehicleBrand,
      activeDraft.quantity,
      activeDraft.listPrice,
      activeDraft.discount
    );

    updateActiveDraft((draft) => ({
      ...draft,
      items: [...draft.items, newItem],
      itemName: "",
      vehicleBrand: "",
      quantity: "",
      listPrice: "",
      discount: "",
      productSuggestions: [],
      validationErrors: "",
    }));

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
  };

  const handleRemoveItem = (id: string) => {
    updateActiveDraft((draft) => ({
      ...draft,
      items: draft.items.filter((item) => item.id !== id),
    }));
  };

  const handleGeneratePDF = async () => {
    if (activeDraft.items.length === 0) return;

    setGeneratingDraftId(activeDraft.id);
    try {
      await generatePDF(
        activeDraft.items,
        activeDraft.customerName,
        grandTotal,
        totalGST,
        activeDraft.gstIncluded,
        activeDraft.showGstNumber
      );
    } finally {
      setGeneratingDraftId(null);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={billStyles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={billStyles.header}>
        <Text style={billStyles.title}>Create Bill</Text>
        <Text style={billStyles.subtitle}>
          {activeDraft.customerName
            ? `For: ${activeDraft.customerName}`
            : "Enter customer details"}
        </Text>
      </View>

      <View style={billStyles.draftCreator}>
        <TextInput
          placeholder="Customer name for new draft"
          value={newCustomerName}
          onChangeText={setNewCustomerName}
          style={billStyles.draftInput}
        />
        <TouchableOpacity style={billStyles.draftAddButton} onPress={addDraft}>
          <Text style={billStyles.draftAddButtonText}>Add Draft</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={billStyles.draftTabs}
      >
        {drafts.map((draft) => {
          const isActive = draft.id === activeDraft.id;
          return (
            <View
              key={draft.id}
              style={[billStyles.draftChip, isActive && billStyles.draftChipActive]}
            >
              <TouchableOpacity
                style={billStyles.draftChipMain}
                onPress={() => setActiveDraftId(draft.id)}
              >
                <Text
                  style={[
                    billStyles.draftChipText,
                    isActive && billStyles.draftChipTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {draft.customerName}
                </Text>
                <Text
                  style={[
                    billStyles.draftChipCount,
                    isActive && billStyles.draftChipCountActive,
                  ]}
                >
                  {draft.items.length} items
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={billStyles.draftChipClose}
                onPress={() => removeDraft(draft.id)}
              >
                <Text
                  style={[
                    billStyles.draftChipCloseText,
                    isActive && billStyles.draftChipCloseTextActive,
                  ]}
                >
                  x
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <BillForm
        itemName={activeDraft.itemName}
        vehicleBrand={activeDraft.vehicleBrand}
        quantity={activeDraft.quantity}
        listPrice={activeDraft.listPrice}
        discount={activeDraft.discount}
        gstIncluded={activeDraft.gstIncluded}
        showGstNumber={activeDraft.showGstNumber}
        validationErrors={activeDraft.validationErrors}
        onItemNameChange={(value) =>
          updateActiveDraft((draft) => ({ ...draft, itemName: value }))
        }
        onVehicleBrandChange={(value) =>
          updateActiveDraft((draft) => ({ ...draft, vehicleBrand: value }))
        }
        onQuantityChange={(value) =>
          updateActiveDraft((draft) => ({ ...draft, quantity: value }))
        }
        onListPriceChange={(value) =>
          updateActiveDraft((draft) => ({ ...draft, listPrice: value }))
        }
        onDiscountChange={(value) =>
          updateActiveDraft((draft) => ({ ...draft, discount: value }))
        }
        onGstIncludedChange={(value) =>
          updateActiveDraft((draft) => ({ ...draft, gstIncluded: value }))
        }
        onShowGstNumberChange={(value) =>
          updateActiveDraft((draft) => ({ ...draft, showGstNumber: value }))
        }
        productSuggestions={activeDraft.productSuggestions}
        onSelectProductSuggestion={handleSelectProductSuggestion}
        onAddItem={handleAddItem}
      />

      {activeDraft.items.length > 0 && (
        <ItemsList items={activeDraft.items} onRemoveItem={handleRemoveItem} />
      )}

      <SummarySection
        grandTotal={grandTotal}
        totalGST={totalGST}
        gstIncluded={activeDraft.gstIncluded}
        items={activeDraft.items}
        isGenerating={generatingDraftId === activeDraft.id}
        onGeneratePDF={handleGeneratePDF}
      />

      <View style={billStyles.spacing} />
    </ScrollView>
  );
}
