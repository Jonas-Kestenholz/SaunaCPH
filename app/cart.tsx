// app/cart.tsx
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
import { useShopifyCheckoutSheet } from "@shopify/checkout-sheet-kit";
import BottomBar from "@/src/components/common/BottomBar";
import { useEffect } from "react";
import LoadingScreen from "@/src/components/common/LoadingScreen";

export default function CartScreen() {
  const router = useRouter();
  const shopifyCheckout = useShopifyCheckoutSheet();
  const { data: cart, isLoading, isError, error, refetch } = useCart();
  const updateCartLineMutation = useUpdateCartLine();
  const removeCartLineMutation = useRemoveCartLine();

  const isUpdatingCart =
    updateCartLineMutation.isPending || removeCartLineMutation.isPending;

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

  async function handleCheckout() {
  try {
    console.log("Checkout Kit open attempt", {
      hasCheckoutUrl: Boolean(cart?.checkoutUrl),
      checkoutUrlStart: cart?.checkoutUrl?.slice(0, 80),
    });

    if (!cart?.checkoutUrl) {
      console.warn("Checkout mangler checkoutUrl");
      return;
    }

    await shopifyCheckout.present(cart.checkoutUrl);
  } catch (error) {
    console.log("Kunne ikke åbne checkout:", error);
  }
}

  if (isLoading) {
    return <LoadingScreen label="Loading cart..." backgroundColor="#f1f1f1" />;
  }

  if (isError) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: 16,
          }}
        >
          <Text
            style={{
              fontSize: 34,
              lineHeight: 36,
              fontFamily: "BarlowCondensed-SemiBold",
              textTransform: "uppercase",
              color: "#111",
              marginBottom: 8,
            }}
          >
            Kunne ikke hente kurv
          </Text>

          <Text
            style={{
              fontSize: 13,
              lineHeight: 20,
              fontFamily: "Inter_18pt-Regular",
              color: "#666",
              marginBottom: 24,
            }}
          >
            {error.message}
          </Text>

          <Pressable
            onPress={() => refetch()}
            style={{
              height: 52,
              backgroundColor: "#111",
              borderWidth: 1,
              borderColor: "#111",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontFamily: "BarlowCondensed-SemiBold",
                fontSize: 16,
                lineHeight: 18,
                textTransform: "uppercase",
              }}
            >
              Prøv igen
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 12,
          }}
        ></View>

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: 16,
          }}
        >
          <Text
            style={{
              fontSize: 34,
              lineHeight: 36,
              fontFamily: "BarlowCondensed-SemiBold",
              textTransform: "uppercase",
              color: "#111",
              marginBottom: 8,
            }}
          >
            Your cart is empty
          </Text>

          <Text
            style={{
              fontSize: 13,
              lineHeight: 20,
              fontFamily: "Inter_18pt-Regular",
              color: "#666",
              marginBottom: 24,
            }}
          >
            Add products to your cart before checkout.
          </Text>

          <Pressable
            onPress={() => router.push("/")}
            style={{
              height: 52,
              backgroundColor: "#111",
              borderWidth: 1,
              borderColor: "#111",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontFamily: "BarlowCondensed-SemiBold",
                fontSize: 16,
                lineHeight: 18,
                textTransform: "uppercase",
              }}
            >
              Shop now
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
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
        <Text
          style={{
            fontSize: 34,
            lineHeight: 36,
            fontFamily: "BarlowCondensed-SemiBold",
            textTransform: "uppercase",
            color: "#111",
          }}
        >
          Cart
        </Text>

        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 18,
          paddingBottom: 190,
        }}
        showsVerticalScrollIndicator={false}
      >
        {cart.lines.map((line) => (
          <View
            key={line.id}
            style={{
              flexDirection: "row",
              gap: 14,
              paddingBottom: 14,
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
                height: 108,
                backgroundColor: "#f3f3f3",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {line.imageUrl ? (
                <Image
                  source={{ uri: line.imageUrl }}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  resizeMode="contain"
                />
              ) : null}
            </Pressable>

            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 18,
                  lineHeight: 18,
                  fontFamily: "BarlowCondensed-SemiBold",
                  textTransform: "uppercase",
                  color: "#111",
                }}
              >
                {line.productTitle}
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 22,
                  fontFamily: "BarlowCondensed-SemiBold",
                  color: "#111",
                }}
              >
                {line.price}
              </Text>

              <Text
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  lineHeight: 18,
                  fontFamily: "Inter_18pt-Regular",
                  color: "#666",
                }}
              >
                Size: {line.variantTitle}
              </Text>

              <View
                style={{
                  marginTop: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
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
                    <Text
                      style={{
                        fontSize: 18,
                        lineHeight: 18,
                        fontFamily: "Inter_18pt-Regular",
                        color: "#111",
                      }}
                    >
                      −
                    </Text>
                  </Pressable>

                  <Text
                    style={{
                      minWidth: 24,
                      textAlign: "center",
                      fontSize: 13,
                      fontFamily: "Inter_18pt-Regular",
                      color: "#111",
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
                    <Text
                      style={{
                        fontSize: 18,
                        lineHeight: 18,
                        fontFamily: "Inter_18pt-Regular",
                        color: "#111",
                      }}
                    >
                      +
                    </Text>
                  </Pressable>
                </View>

                <Pressable
                  disabled={isUpdatingCart}
                  onPress={() => removeLine(line.id)}
                  style={{
                    height: 32,
                    justifyContent: "center",
                    opacity: isUpdatingCart ? 0.45 : 1,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      lineHeight: 16,
                      fontFamily: "Inter_18pt-Regular",
                      color: "#111",
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
          bottom: 10,
          backgroundColor: "#fff",
          paddingHorizontal: 16,
          paddingTop: 14,
          paddingBottom: 90,
          borderTopWidth: 1,
          borderTopColor: "#ececec",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              lineHeight: 22,
              fontFamily: "BarlowCondensed-SemiBold",
              textTransform: "uppercase",
              color: "#111",
            }}
          >
            Total
          </Text>

          <Text
            style={{
              fontSize: 20,
              lineHeight: 22,
              fontFamily: "BarlowCondensed-SemiBold",
              color: "#111",
            }}
          >
            {cart.total}
          </Text>
        </View>

        <Pressable
          onPress={handleCheckout}
          style={{
            height: 52,
            backgroundColor: "#111",
            borderWidth: 1,
            borderColor: "#111",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontFamily: "BarlowCondensed-SemiBold",
              fontSize: 16,
              lineHeight: 18,
              textTransform: "uppercase",
            }}
          >
            Checkout
          </Text>
        </Pressable>
      </View>

      {/* <BottomBar /> */}
    </SafeAreaView>
  );
}
