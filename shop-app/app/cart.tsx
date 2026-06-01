import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useCart,
  useRemoveCartLine,
  useUpdateCartLine,
} from "@/src/features/cart/hooks";
import BottomBar from "@/src/components/common/BottomBar";
//import { useShopifyCheckoutSheet } from "@shopify/checkout-sheet-kit";
import { useEffect } from "react";

export default function CartScreen() {
  const router = useRouter();
  //const checkoutSheet = useShopifyCheckoutSheet();
  const { data: cart, isLoading, isError, error, refetch } = useCart();
  const updateCartLineMutation = useUpdateCartLine();
  const removeCartLineMutation = useRemoveCartLine();

  const isUpdatingCart =
    updateCartLineMutation.isPending || removeCartLineMutation.isPending;

  //useEffect(() => {
  if (cart?.checkoutUrl) {
    //checkoutSheet.preload(cart.checkoutUrl);
  }
  //}, [cart?.checkoutUrl, checkoutSheet]);

  function increaseQuantity(lineId: string, currentQuantity: number) {
    updateCartLineMutation.mutate({
      lineId,
      quantity: currentQuantity + 1,
    });
  }

  function decreaseQuantity(lineId: string, currentQuantity: number) {
    if (currentQuantity <= 1) {
      removeCartLineMutation.mutate({ lineId });
      return;
    }

    updateCartLineMutation.mutate({
      lineId,
      quantity: currentQuantity - 1,
    });
  }

  function removeLine(lineId: string) {
    removeCartLineMutation.mutate({ lineId });
  }

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 12 }}>Henter kurv...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            gap: 12,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "800" }}>
            Kunne ikke hente kurv
          </Text>

          <Text style={{ textAlign: "center" }}>{error.message}</Text>

          <Pressable
            onPress={() => refetch()}
            style={{
              backgroundColor: "#111",
              paddingHorizontal: 18,
              paddingVertical: 14,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "800" }}>PRØV IGEN</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          <Pressable onPress={() => router.back()}>
            <Text style={{ fontSize: 28 }}>×</Text>
          </Pressable>
        </View>

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "900",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Your bag is empty
          </Text>

          <Text style={{ textAlign: "center", color: "#555" }}>
            Add products to your bag before checkout.
          </Text>

          <Pressable
            onPress={() => router.push("/")}
            style={{
              marginTop: 24,
              backgroundColor: "#111",
              paddingHorizontal: 20,
              paddingVertical: 14,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "800" }}>SHOP NOW</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  async function handleCheckout() {
    if (!cart?.checkoutUrl) {
      return;
    }

    try {
      //await checkoutSheet.present(cart.checkoutUrl);
    } catch (error) {
      console.log("Kunne ikke åbne checkout:", error);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#ececec",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Text style={{ fontSize: 28 }}>×</Text>
        </Pressable>

        <Text style={{ fontSize: 22, fontWeight: "900" }}>BAG</Text>

        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 18,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {cart.lines.map((line) => (
          <View
            key={line.id}
            style={{
              flexDirection: "row",
              gap: 14,
              paddingBottom: 18,
              marginBottom: 18,
              borderBottomWidth: 1,
              borderBottomColor: "#ececec",
            }}
          >
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/product/[id]",
                  params: { id: line.productId },
                })
              }
              style={{
                width: 92,
                height: 112,
                backgroundColor: "#f3f3f3",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {line.imageUrl ? (
                <Image
                  source={{ uri: line.imageUrl }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              ) : null}
            </Pressable>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "800",
                  textTransform: "uppercase",
                }}
              >
                {line.productTitle}
              </Text>

              <Text style={{ marginTop: 6, color: "#555" }}>
                Size: {line.variantTitle}
              </Text>

              <View
                style={{
                  marginTop: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Pressable
                  disabled={isUpdatingCart}
                  onPress={() => decreaseQuantity(line.id, line.quantity)}
                  style={{
                    width: 32,
                    height: 32,
                    borderWidth: 1,
                    borderColor: "#111",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: isUpdatingCart ? 0.45 : 1,
                  }}
                >
                  <Text style={{ fontSize: 18, fontWeight: "800" }}>−</Text>
                </Pressable>

                <Text
                  style={{
                    minWidth: 24,
                    textAlign: "center",
                    fontWeight: "700",
                  }}
                >
                  {line.quantity}
                </Text>

                <Pressable
                  disabled={isUpdatingCart}
                  onPress={() => increaseQuantity(line.id, line.quantity)}
                  style={{
                    width: 32,
                    height: 32,
                    borderWidth: 1,
                    borderColor: "#111",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: isUpdatingCart ? 0.45 : 1,
                  }}
                >
                  <Text style={{ fontSize: 18, fontWeight: "800" }}>+</Text>
                </Pressable>
              </View>

              <View
                style={{
                  marginTop: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "800",
                  }}
                >
                  {line.price}
                </Text>

                <Pressable
                  disabled={isUpdatingCart}
                  onPress={() => removeLine(line.id)}
                  style={{ opacity: isUpdatingCart ? 0.45 : 1 }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "800",
                      textDecorationLine: "underline",
                    }}
                  >
                    REMOVE
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#fff",
          paddingHorizontal: 16,
          paddingTop: 14,
          paddingBottom: 28,
          borderTopWidth: 1,
          borderTopColor: "#ececec",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "800" }}>TOTAL</Text>
          <Text style={{ fontSize: 18, fontWeight: "800" }}>{cart.total}</Text>
        </View>

        <Pressable
          onPress={handleCheckout}
          style={{
            backgroundColor: "#111",
            paddingVertical: 16,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "900" }}>CHECKOUT</Text>
        </Pressable>
      </View>
      <BottomBar />
    </SafeAreaView>
  );
}
