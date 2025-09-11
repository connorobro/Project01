import { Link, useRouter } from "expo-router";
import * as React from "react";
import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import "react-native-dotenv";
import { Dropdown } from "react-native-element-dropdown";
import { Button, Menu, Provider } from "react-native-paper";
import { AuthContext } from "../context/AuthProvider";

const DropdownCategory = ({
  category,
  setCategory,
}: {
  category: string | null;
  setCategory: (category: string | null) => void;
}) => {
  const [value, setValue] = React.useState(null);
  const [isFocus, setIsFocus] = React.useState(false);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    fetch(
      `https://api.adzuna.com/v1/api/jobs/us/categories?app_id=${process.env.EXPO_PUBLIC_ADZUNA_APP_ID}&app_key=${process.env.EXPO_PUBLIC_ADZUNA_API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.results.map(
          (item: { label: string; value: string }) => ({
            label: item.label,
            value: item.value,
          })
        );
        setData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
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
        }}
      />
    </View>
  );
};

export default function HomeScreen() {
  // All hooks at the top
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [category, setCategory] = React.useState<string | null>(null);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  const { userToken, username, logout } = useContext(AuthContext);
  const router = useRouter();

  // Early return for unauthenticated users
  if (!userToken) {
    router.replace("/Login");
    return null;
  }

  // const [mounted, setMounted] = React.useState(false);

  // React.useEffect(() => {
  //   setMounted(true);
  // }, []);

  // React.useEffect(() => {
  //   if (mounted && !userToken) {
  //     router.replace("/Login");
  //   }
  // }, [mounted, userToken, router]);

  return (
    <Provider>
      <View style={styles.container}>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%",
            paddingHorizontal: 20,
            paddingTop: 40,
            zIndex: 10,
          }}
        >
          <Link href="/savedJobs" style={styles.button}>
            Saved Jobs
          </Link>

          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <Button mode="contained" onPress={openMenu} style={styles.button}>
                {username || "User"}
              </Button>
            }
          >
            <Menu.Item
              onPress={() => {
                closeMenu();
                // call logout function from context
                logout();
              }}
              title="Logout"
            />
            <Menu.Item
              onPress={() => {
                closeMenu();
                // router to go to user profile page
                router.push("/userProfile");
              }}
              title="User Profile"
            />
          </Menu>
        </View>

        {/* Main content */}
        <View
          style={{
            flexDirection: "row",
            marginTop: 80,
            justifyContent: "center",
          }}
        >
          <View style={{ width: 180, marginRight: 16, alignItems: "center" }}>
            <Text style={styles.text}>Choose Job Category</Text>
            <DropdownCategory category={category} setCategory={setCategory} />
          </View>
        </View>
        <br />
        <br />
        <br />
        <br />
        <br />
        <Link href="/jobs" style={styles.button}>
          Search Jobs
        </Link>
      </View>
    </Provider>
  );
}
const dropdownStyles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  dropdown: {
    height: 60,
    minWidth: 160,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 20,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 20,
  },
  selectedTextStyle: {
    fontSize: 20,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    minWidth: 160,
    alignItems: "center",
  },
});
