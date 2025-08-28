# Project01

Job Listing App
Testing
1.1 User Registration
TC001: Register with valid email and password
TC002: Register with invalid email format
TC003: Register with password too short/weak
TC004: Register with already existing email
TC005: Register with empty fields
TC006: Register with special characters in username
1.2 User Login
TC008: Login with valid credentials
TC009: Login with invalid email
TC010: Login with invalid password
TC011: Login with empty fields
TC012: Login after logout
TC013: Session persistence after app restart
TC014: Multiple failed login attempts
1.3 Session Management
TC018: Logout functionality clears session data
2. Profile & Interest Management
2.1 Interest Selection
TC019: Select single interest from dropdown
TC020: Select multiple interests
TC021: Save interests and verify persistence
TC022: Maximum interest selection limit 
TC023: Deselect previously selected interests

3. API Integration Test Cases
3.1 Job API Calls
TC037: Filter jobs by single skill
TC038: Filter jobs by multiple skills
TC039: API call with invalid parameters
3.2 Data Processing
TC040: Parse valid JSON response correctly
TC041: Handle malformed JSON response
TC042: Process empty job listings array
TC043: Handle missing required fields in job data
4. Local Database Test Cases
4.1 SQLite Operations
TC044: Create database tables on first launch
TC045: Insert user data successfully
TC046: Update existing user record
TC047: Delete user data
TC048: Database connection failure
TC049: Corrupted database recovery
TC050: Database migration between app versions
4.2 Saved Jobs Management
TC051: Save job ID to local database
TC052: Remove saved job from database
TC053: Load all saved jobs on app start
TC054: Save duplicate job ID (should prevent/handle)
TC055: Save job while offline
TC056: Database full/storage limit reached
TC057: Query saved jobs with filters
5. User Interface Test Cases
5.1 Navigation
TC058: Navigate between all app screens
TC059: Back button functionality
TC060: Deep linking to specific screens
TC061: Tab navigation works correctly
TC062: Navigation with saved state
5.2 Job Listings Display
TC063: Display job list with proper formatting
TC064: Scroll through long job list
TC065: Refresh job listings (pull to refresh)
TC066: Loading indicators during API calls
TC067: Error messages for failed API calls
TC068: Empty state when no jobs found
TC069: Job detail view functionality
5.3 Saved Jobs Interface
TC070: Display saved jobs list
TC071: Remove job from saved list
TC072: Empty state for no saved jobs
TC073: Saved job indicators in main job list

App Architecture
4.1 Screen Structure
├── Authentication
│   ├── Login Screen
│   ├── Registration Screen
│   └── Forgot Password (if applicable)
├── Onboarding
│   └── Interest Selection Screen
├── Main App
│   ├── Job Listings Screen
│   ├── Saved Jobs Screen
│   └── Profile/Settings Screen
4.2 Database Schema
Users Table:
- user_id (PRIMARY KEY)
- username
- email
- created_at
- last_login

User_Interests Table:
- interest_id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- skill/interest_name

Saved_Jobs Table:
- save_id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- job_api_id
- saved_at
5. Development Phases
Phase 1: Foundation
Set up React Native/Expo project
Implement SQLite database
Create basic authentication screens
Set up navigation structure
Phase 2: Core Functionality
Build user registration/login
Create interest selection interface
Implement profile management
Set up local data persistence
Phase 3: API Integration
Research and integrate job API
Build job listing interface
Implement job filtering by user interests
Add error handling and loading states
Phase 4: Job Management
Create save/unsave job functionality
Build saved jobs screen
Implement job ID storage in local DB
Add job loading on app startup
Phase 5: Polish & Testing
UI/UX improvements
Performance optimization
Testing and bug fixes
Prepare for OAuth integration (future)
6. Key Implementation Notes
Strict local storage requirement - no cloud databases
Focus on offline-first approach
Ensure smooth user experience with loading states
Implement proper error handling for API failures
Consider job API rate limits and caching strategies
Plan for OAuth integration in future iteration
7. Success Criteria (MVP)
✅ Users can register and log in
✅ Users see personalized content based on their profile
✅ App fetches data from external REST API
✅ Job preferences stored locally using SQLite
✅ Users can save jobs and view them later
✅ All data persists between app sessions



