import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import HomeScreen from "../app/Home";

// Mock expo-router
const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
  Link: jest.fn(),
}));

// Mock AuthContext
const mockLogout = jest.fn();

// Mock react-native-element-dropdown
jest.mock("react-native-element-dropdown", () => ({
  Dropdown: jest.fn(),
}));

// Mock react-native-paper
jest.mock("react-native-paper", () => ({
  Provider: jest.fn(),
  Button: jest.fn(),
  Menu: jest.fn(),
  "Menu.Item": jest.fn(),
}));

// Mock useContext
const mockUseContext = jest.fn();
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: () => mockUseContext(),
}));

// Mock fetch for API calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("HomeScreen", () => {
  const mockRouter = { push: mockPush, replace: mockReplace };

  beforeEach(() => {
    // Setup mocks
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    mockUseContext.mockReturnValue({
      userToken: "mock-token",
      username: "TestUser",
      logout: mockLogout,
    });

    // Mock Link component
    const { Link } = require("expo-router");
    (Link as jest.Mock).mockImplementation(
      ({ children, href, style, ...props }) => (
        <TouchableOpacity
          style={style}
          {...props}
          testID={`link-${href.pathname || href}`}
        >
          {children}
        </TouchableOpacity>
      )
    );

    // Mock Provider
    const { Provider } = require("react-native-paper");
    (Provider as jest.Mock).mockImplementation(({ children }) => children);

    // Mock Button
    const { Button } = require("react-native-paper");
    (Button as jest.Mock).mockImplementation(
      ({ children, onPress, style, ...props }) => (
        <TouchableOpacity
          onPress={onPress}
          style={style}
          {...props}
          testID="paper-button"
        >
          <Text>{children}</Text>
        </TouchableOpacity>
      )
    );

    // Mock Menu
    const { Menu } = require("react-native-paper");
    (Menu as jest.Mock).mockImplementation(
      ({ children, visible, onDismiss, anchor }) => (
        <View testID="menu-container">
          {anchor}
          {visible && <View testID="menu-items">{children}</View>}
        </View>
      )
    );

    // Mock Menu.Item
    const MenuItem = require("react-native-paper")["Menu.Item"];
    (MenuItem as jest.Mock).mockImplementation(
      ({ title, onPress, ...props }) => (
        <TouchableOpacity
          onPress={onPress}
          testID={`menu-item-${title.toLowerCase().replace(" ", "-")}`}
          {...props}
        >
          <Text>{title}</Text>
        </TouchableOpacity>
      )
    );

    // Mock Dropdown
    const { Dropdown } = require("react-native-element-dropdown");
    (Dropdown as jest.Mock).mockImplementation(
      ({ data, onChange, value, placeholder, onFocus, onBlur, ...props }) => {
        const [isOpen, setIsOpen] = React.useState(false);
        const [searchText, setSearchText] = React.useState("");

        const filteredData =
          data?.filter((item: any) =>
            item.label.toLowerCase().includes(searchText.toLowerCase())
          ) || [];

        return (
          <View testID="dropdown-container" {...props}>
            <TouchableOpacity
              testID="dropdown-trigger"
              onPress={() => {
                setIsOpen(!isOpen);
                if (!isOpen) onFocus?.();
                else onBlur?.();
              }}
            >
              <Text testID="dropdown-selected-text">
                {value
                  ? data?.find((item: any) => item.value === value)?.label
                  : placeholder}
              </Text>
            </TouchableOpacity>

            {isOpen && (
              <View testID="dropdown-menu">
                <TextInput
                  testID="dropdown-search"
                  placeholder="Search..."
                  value={searchText}
                  onChangeText={setSearchText}
                />
                {filteredData.map((item: any) => (
                  <TouchableOpacity
                    key={item.value}
                    testID={`dropdown-option-${item.value}`}
                    onPress={() => {
                      onChange?.(item);
                      setIsOpen(false);
                      onBlur?.();
                    }}
                  >
                    <Text>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        );
      }
    );

    // Default successful API response
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          results: [
            { label: "IT Jobs", tag: "it-jobs" },
            { label: "Sales Jobs", tag: "sales-jobs" },
            { label: "Marketing Jobs", tag: "marketing-jobs" },
          ],
        }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders without crashing", () => {
      render(<HomeScreen />);
      expect(screen.getByText("Choose Job Category")).toBeTruthy();
    });

    it("displays username from context", () => {
      render(<HomeScreen />);
      expect(screen.getByText("TestUser")).toBeTruthy();
    });

    it("displays 'User' when username is not provided", () => {
      mockUseContext.mockReturnValue({
        userToken: "mock-token",
        username: null,
        logout: mockLogout,
      });

      render(<HomeScreen />);
      expect(screen.getByText("User")).toBeTruthy();
    });
  });

  describe("API Integration", () => {
    it("fetches categories from Adzuna API on mount", async () => {
      render(<HomeScreen />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining(
            "https://api.adzuna.com/v1/api/jobs/us/categories"
          )
        );
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("app_id=")
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("app_key=")
      );
    });

    it("handles successful API response and populates dropdown", async () => {
      render(<HomeScreen />);

      // Open dropdown to see options
      fireEvent.press(screen.getByTestId("dropdown-trigger"));

      await waitFor(() => {
        expect(screen.getByText("IT Jobs")).toBeTruthy();
        expect(screen.getByText("Sales Jobs")).toBeTruthy();
        expect(screen.getByText("Marketing Jobs")).toBeTruthy();
      });
    });

    it("handles API error gracefully", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      mockFetch.mockRejectedValue(new Error("Network error"));

      render(<HomeScreen />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          "Error fetching categories:",
          expect.any(Error)
        );
      });

      consoleSpy.mockRestore();
    });

    it("handles API response with no results", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ results: null }),
      });

      render(<HomeScreen />);

      // Open dropdown - should be empty
      fireEvent.press(screen.getByTestId("dropdown-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("dropdown-menu")).toBeTruthy();
      });

      // Should not crash and dropdown should be empty
      expect(screen.queryByText("IT Jobs")).toBeFalsy();
    });
  });

  describe("Dropdown Functionality", () => {
    beforeEach(async () => {
      render(<HomeScreen />);
      // Wait for API to load
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });

    it("opens dropdown when trigger is pressed", () => {
      fireEvent.press(screen.getByTestId("dropdown-trigger"));
      expect(screen.getByTestId("dropdown-menu")).toBeTruthy();
    });

    it("shows search functionality in dropdown", () => {
      fireEvent.press(screen.getByTestId("dropdown-trigger"));
      expect(screen.getByTestId("dropdown-search")).toBeTruthy();
      expect(screen.getByPlaceholderText("Search...")).toBeTruthy();
    });

    it("filters options when searching", async () => {
      fireEvent.press(screen.getByTestId("dropdown-trigger"));

      const searchInput = screen.getByTestId("dropdown-search");
      fireEvent.changeText(searchInput, "IT");

      await waitFor(() => {
        expect(screen.getByText("IT Jobs")).toBeTruthy();
        expect(screen.queryByText("Sales Jobs")).toBeFalsy();
      });
    });

    it("selects category when option is pressed", async () => {
      fireEvent.press(screen.getByTestId("dropdown-trigger"));

      await waitFor(() => {
        expect(screen.getByText("IT Jobs")).toBeTruthy();
      });

      fireEvent.press(screen.getByTestId("dropdown-option-it-jobs"));

      // Should close dropdown and show selected value
      expect(screen.queryByTestId("dropdown-menu")).toBeFalsy();
      expect(screen.getByText("IT Jobs")).toBeTruthy();
    });
  });

  describe("Authentication Context", () => {
    it("handles missing user token", () => {
      mockUseContext.mockReturnValue({
        userToken: null,
        username: "TestUser",
        logout: mockLogout,
      });

      render(<HomeScreen />);
      // Should still render (since auth redirect is commented out)
      expect(screen.getByText("Choose Job Category")).toBeTruthy();
    });

    it("uses context values correctly", () => {
      const customContext = {
        userToken: "custom-token",
        username: "CustomUser",
        logout: jest.fn(),
      };
      mockUseContext.mockReturnValue(customContext);

      render(<HomeScreen />);
      expect(screen.getByText("CustomUser")).toBeTruthy();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty API response gracefully", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      render(<HomeScreen />);

      // Should not crash
      fireEvent.press(screen.getByTestId("dropdown-trigger"));
      expect(screen.getByTestId("dropdown-menu")).toBeTruthy();
    });

    it("handles network timeout", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      mockFetch.mockImplementation(
        () =>
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timeout")), 100)
          )
      );

      render(<HomeScreen />);

      await waitFor(
        () => {
          expect(consoleSpy).toHaveBeenCalledWith(
            "Error fetching categories:",
            expect.any(Error)
          );
        },
        { timeout: 2000 }
      );

      consoleSpy.mockRestore();
    });
  });
});
