import { Link } from "expo-router";
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Menu, Provider } from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

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
                User Profile
              </Button>
            }
          >
            <Menu.Item
              onPress={() => {
                closeMenu();
                // Handle logout logic here
              }}
              title="Logout"
            />
            <Menu.Item
              onPress={() => {
                closeMenu();
                // Handle update profile logic here
              }}
              title="Update Profile"
            />
          </Menu>
        </View>

        {/* Main content */}
        <View style={{ flexDirection: "row", marginTop: 80 }}>
          <View style={{ width: 150, marginRight: 16, alignItems: "center" }}>
            <Text style={styles.text}>Choose Job Category</Text>
            <RNPickerSelect
              onValueChange={(value) => console.log("Dropdown 1:", value)}
              items={[
                { label: "Option 1", value: "option1" },
                { label: "Option 2", value: "option2" },
                { label: "Option 3", value: "option3" },
              ]}
              placeholder={{ label: "Select an option...", value: null }}
            />
          </View>
          <View style={{ width: 150, alignItems: "center" }}>
            <Text style={styles.text}>Choose Level Category</Text>
            <RNPickerSelect
              onValueChange={(value) => console.log("Dropdown 2:", value)}
              items={[
                { label: "Option 1", value: "option1" },
                { label: "Option 2", value: "option2" },
                { label: "Option 3", value: "option3" },
              ]}
              placeholder={{ label: "Select an option...", value: null }}
            />
          </View>
        </View>
      </View>
    </Provider>
  );
}
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
