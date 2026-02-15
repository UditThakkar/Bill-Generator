import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");

  const goToBill = () => {
    if (!customerName) return;
    router.push({
      pathname: "/bill",
      params: { customerName },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start New Bill</Text>

      <TextInput
        placeholder="Enter Customer Name"
        value={customerName}
        onChangeText={setCustomerName}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={goToBill}>
        <Text style={styles.buttonText}>Create Bill</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20,
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
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
