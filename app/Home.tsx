import { Link, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import "./Home.css";

const DropdownCategory = ({
  category,
  setCategory,
}: {
  category: string | null;
  setCategory: (category: string | null) => void;
}) => {
  const [value, setValue] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<{ label: string; value: string }[]>([]);

  // fetching Adzuna categories
  useEffect(() => {
    fetch(
      `https://api.adzuna.com/v1/api/jobs/us/categories?app_id=${process.env.EXPO_PUBLIC_ADZUNA_APP_ID}&app_key=${process.env.EXPO_PUBLIC_ADZUNA_API_KEY}`
    )
      .then((response) => response.json())
      .then((json) => {
        const formatted = (json.results || []).map(
          (item: { label: string; tag: string }) => ({
            label: item.label,
            value: item.tag,
          })
        );
        setData(formatted);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const selectedItem = data.find((item) => item.value === value);

  return (
    <div className="dropdown-container">
      <div className="dropdown">
        <button
          className="dropdown-toggle"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          <span>
            {selectedItem ? selectedItem.label : "Select Job Category"}
          </span>
          <span className={`chevron ${isOpen ? "rotate" : ""}`}>▼</span>
        </button>
        {isOpen && (
          <div className="dropdown-menu">
            {data.map((item) => (
              <button
                key={item.value}
                className={`dropdown-item ${
                  value === item.value ? "active" : ""
                }`}
                onClick={() => {
                  setValue(item.value);
                  setCategory(item.value);
                  setIsOpen(false);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [category, setCategory] = useState<string | null>(null);

  const { logout, username } = useContext(AuthContext);
  const router = useRouter();

  return (
    <div className="home-container">
      <header className="header">
        <div className="header-left">
          <Link href="/savedJobs" className="nav-button saved-jobs-btn">
            Saved Jobs
          </Link>
        </div>

        <div className="header-right">
          <div style={{ position: "relative" }}>
            <button
              className="nav-button user-profile-btn"
              onClick={() => setMenuVisible(!menuVisible)}
            >
              <span className="nav-icon">👤</span>
              {username || "User Profile"}
            </button>
            {menuVisible && (
              <div className="user-menu">
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setMenuVisible(false);
                    router.push("/userProfile");
                  }}
                >
                  User Profile
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setMenuVisible(false);
                    logout();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="search-section">
          <p className="text">Choose Job Category</p>
          <DropdownCategory category={category} setCategory={setCategory} />

          <Link
            href={{ pathname: "/jobs", params: { q: category ?? "" } }}
            className="button"
          >
            Search Jobs
          </Link>
        </div>
      </main>
    </div>
  );
}
