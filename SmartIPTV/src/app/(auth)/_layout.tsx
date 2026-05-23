// import { Stack } from "expo-router";

// export default function AuthLayout() {
//     return (
//       <Stack initialRouteName="index" screenOptions={{ headerShown: false }} />
//     );
// }

import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#080810" },
        animation: "fade",
      }}
    />
  );
}