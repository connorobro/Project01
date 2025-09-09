import { Link, useRouter } from "expo-router";
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Button, Menu, Provider } from "react-native-paper";

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

  const APIKEY = "wong";
  const APPID = "0";

  React.useEffect(() => {
    fetch(
      `https://api.adzuna.com/v1/api/jobs/us/categories?app_id=${APPID}&app_key=${APIKEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.results.map(
          (item: { label: any; value: any }) => ({
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
const DropdownTopCompanies = ({ category }: { category: string | null }) => {
  const [value, setValue] = React.useState(null);
  const [isFocus, setIsFocus] = React.useState(false);
  const [data, setData] = React.useState([]);

  // React.useEffect(() => {
  //   // get the category from the selected value in DropdownCategory and use it in the fetch url to get the top companies in that category
  //   fetch(
  //     `https://api.adzuna.com/v1/api/jobs/us/top_companies?app_id=1d470760&app_key=6126fe3526d0313b67aab87e35cfb3aa&category=${category}`
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const formattedData = data.leaderboard.map(
  //         (item: { canonical_name: string; count: number }) => ({
  //           label: `${item.canonical_name} (${item.count})`,
  //           value: item.canonical_name,
  //         })
  //       );
  //       setData(formattedData);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, [category]);

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
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [category, setCategory] = React.useState<string | null>(null);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const router = useRouter();

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
                Username
              </Button>
            }
          >
            <Menu.Item
              onPress={() => {
                closeMenu();
                //handle logout logic here
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
          <View style={{ width: 180, alignItems: "center" }}>
            <Text style={styles.text}>Choose Level Category</Text>
            <DropdownTopCompanies category={category} />
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
