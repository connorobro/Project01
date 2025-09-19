// app/Home.tsx
import AsyncStorage from "@react-native-async-storage/async-storage"; // ⬅️ NEW
import { Link, useRouter } from "expo-router";
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Button, Menu, Provider } from "react-native-paper";
import { useAuth } from "../src/utils/AuthContext"; // ⬅️ already used below

const DropdownCategory = ({
  category,
  setCategory,
}: {
  category: string | null;
  setCategory: (category: string | null) => void;
}) => {
  const [value, setValue] = React.useState<string | null>(null);
  const [isFocus, setIsFocus] = React.useState(false);
  const [data, setData] = React.useState<{ label: string; value: string }[]>([]);

  React.useEffect(() => {
    fetch(
      `https://api.adzuna.com/v1/api/jobs/us/categories?app_id=${process.env.EXPO_PUBLIC_ADZUNA_APP_ID}&app_key=${process.env.EXPO_PUBLIC_ADZUNA_API_KEY}`
    )
      .then((r) => r.json())
      .then((json) => {
        const formatted = (json.results || []).map((item: { label: string; tag: string }) => ({
          label: item.label,
          value: item.tag,
        }));
        setData(formatted);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <View style={dropdownStyles.container}>
      <Dropdown
        style={[dropdownStyles.dropdown, isFocus && { borderColor: "blue" }]}
        placeholderStyle={dropdownStyles.placeholderStyle}
        selectedTextStyle={dropdownStyles.selectedTextStyle}
        inputSearchStyle={dropdownStyles.inputSearchStyle}
        iconStyle={dropdownStyles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Select item" : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
          setCategory(item.value);
        }}
      />
    </View>
  );
};

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [category, setCategory] = React.useState<string | null>(null);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const { logout, currentUserId } = useAuth();
  const router = useRouter();

  // ⬇️ NEW: show the username in the top-right button
  const [displayName, setDisplayName] = React.useState<string>("");

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      // try the fast path first (your Login/Register already save this)
      const cached = await AsyncStorage.getItem("currentUser");
      if (cached) {
        const u = JSON.parse(cached);
        if (!cancelled) setDisplayName(u?.username ?? "");
      }

      // source of truth: look up by id in "users" array
      if (currentUserId) {
        const raw = await AsyncStorage.getItem("users");
        const users = raw ? JSON.parse(raw) : [];
        const me = users.find((u: any) => String(u.id) === String(currentUserId));
        if (!cancelled) setDisplayName(me?.username ?? "");
      } else {
        if (!cancelled) setDisplayName("");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentUserId]);

  return (
    <Provider>
      <View style={styles.container}>
        {/* top bar */}
        <View style={styles.topBar}>
          <Link href="/savedJobs" style={styles.button}>
            Saved Jobs
          </Link>

          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <Button mode="contained" onPress={openMenu} style={styles.button}>
                {/* ⬇️ show username (fallback to “Menu” if not loaded yet) */}
                {displayName ? displayName : "Menu"}
              </Button>
            }
          >
            <Menu.Item
              onPress={async () => {
                closeMenu();
                await logout();
                router.replace("/Login");
              }}
              title="Logout"
            />
            <Menu.Item
              onPress={() => {
                closeMenu();
                router.push("/userProfile");
              }}
              title="User Profile"
            />
          </Menu>
        </View>

        {/* main content */}
        <View style={{ flexDirection: "row", marginTop: 80, justifyContent: "center" }}>
          <View style={{ width: 180, marginRight: 16, alignItems: "center" }}>
            <Text style={styles.text}>Choose Job Category</Text>
            <DropdownCategory category={category} setCategory={setCategory} />
          </View>
        </View>

        <View style={{ height: 40 }} />

        <Link href={{ pathname: "/jobs", params: { q: category ?? "" } }} style={styles.button}>
          Search Jobs
        </Link>
      </View>
    </Provider>
  );
}

const dropdownStyles = StyleSheet.create({
  container: { backgroundColor: "white", padding: 16, borderRadius: 10, marginTop: 10 },
  dropdown: { height: 60, minWidth: 160, borderColor: "gray", borderWidth: 0.5, borderRadius: 8, paddingHorizontal: 16, fontSize: 20 },
  placeholderStyle: { fontSize: 20 },
  selectedTextStyle: { fontSize: 20 },
  iconStyle: { width: 20, height: 20 },
  inputSearchStyle: { height: 40, fontSize: 16 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#25292e", justifyContent: "center", alignItems: "center" },
  topBar: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 40,
    zIndex: 10,
  },
  text: { color: "white" },
  button: { backgroundColor: "#4CAF50", padding: 12, borderRadius: 8, minWidth: 160, alignItems: "center" },
});

