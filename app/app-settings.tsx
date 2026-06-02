import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import BackButton from "../src/components/common/BackButton";



function SettingsSection({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: "#ececec",
        paddingTop: 18,
        paddingBottom: 18,
      }}
    >
      <Text
        style={{
          fontSize: 22,
          lineHeight: 24,
          fontFamily: "BarlowCondensed-SemiBold",
          textTransform: "uppercase",
          color: "#111",
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          fontSize: 13,
          lineHeight: 20,
          fontFamily: "Inter_18pt-Regular",
          color: "#666",
          marginTop: 8,
        }}
      >
        {description}
      </Text>
    </View>
  );
}

export default function AppSettingsScreen() {
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 70,
        paddingBottom: 140,
      }}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          width: 44,
          height: 44,
          alignItems: "flex-start",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
       <BackButton />
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 34,
          lineHeight: 36,
          fontFamily: "BarlowCondensed-SemiBold",
          textTransform: "uppercase",
          color: "#111",
        }}
      >
        App settings
      </Text>

      <Text
        style={{
          fontSize: 13,
          lineHeight: 19,
          fontFamily: "Inter_18pt-Regular",
          color: "#666",
          marginTop: 6,
          marginBottom: 28,
        }}
      >
        Manage app preferences, notifications and future tracking settings.
      </Text>

      <SettingsSection
        title="Notifications"
        description="Restock alerts, shipping updates and product notifications can be managed here later."
      />

      <SettingsSection
        title="Shipping updates"
        description="Choose how you want to receive shipping and delivery updates when this becomes available."
      />

      <SettingsSection
        title="Language"
        description="Language preferences can be added here later if the app supports multiple languages."
      />

      <SettingsSection
        title="Preferences"
        description="App display, product feed and personalization preferences can live here later."
      />
    </ScrollView>
  );
}
