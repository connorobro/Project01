# Project 01 Retrospective and Overview  

[**GitHub Repo**](https://github.com/connorobro/Project01)  

---

## Overview  
Our group developed a **Job Listing Application** designed to help users search and manage job opportunities.  

The application supports:  
- User registration and login  
- Profile editing (username & password)  
- Job search by category  
- Saved jobs tied to individual users  
- View saved jobs for each profile  
- Database access for stored user/job data  

---

## Introduction  
- Our team used Slack to manage communication outside class.  
- Based on the project requirements, we initially outlined about 12–15 user stories/issues.  
- All major stories were completed, including registration, login, saved jobs, API integration, styling, and profile editing.  

---

## Team Retrospective  

### Achsah Jojo  
- **Pull Requests**: [#30](https://github.com/connorobro/Project01/pull/30), [#33](https://github.com/connorobro/Project01/pull/33), [#34](https://github.com/connorobro/Project01/pull/34), [#37](https://github.com/connorobro/Project01/pull/37), [#41](https://github.com/connorobro/Project01/pull/41), [#48](https://github.com/connorobro/Project01/pull/48), [#50](https://github.com/connorobro/Project01/pull/50), [#61](https://github.com/connorobro/Project01/pull/61), [#65](https://github.com/connorobro/Project01/pull/65)  
- **Issues**: [#17](https://github.com/connorobro/Project01/issues/17), [#22](https://github.com/connorobro/Project01/issues/22), [#11](https://github.com/connorobro/Project01/issues/11)  

**Role / Stories Worked On**  
I worked on the homepage, which included the Saved Jobs button, the user profile dropdown menu, and the interest selection dropdown menu. The Saved Jobs button leads the user to the saved jobs page. The user profile dropdown menu displays the logged-in user’s name and provides options to either update the profile or log out. Lastly, the interest selection dropdown menu is populated using our API, allowing users to choose a job category and click the search button, which then directs them to the job page.  

**Biggest Challenge**  
Testing was hands down the hardest part because Jest was frustrating to work with. It was tedious and difficult to get the tests to run on my computer, and it felt unnecessary to test whether elements were rendered correctly. Another challenge was integrating the API into our project without exposing it. I was unfamiliar with API keys, so figuring out how to securely use GitHub secrets and environment files was difficult.

**Resolution**  
I was able to get a few test cases to work by installing the correct dependencies, such as @testing-library/react-native, and using utilities like fireEvent, render, screen, and waitFor. For the API keys, I looked at an old project I had worked on and used it as inspiration. I first installed react-native-dotenv and then imported it into the page where I was calling the API. I created a .env.local file in the project’s root directory and added the keys like this:
- EXPO_PUBLIC_ADZUNA_API_KEY=...
- EXPO_PUBLIC_ADZUNA_APP_ID=...
  
Following the React Native Expo documentation, I then used them in my API URL as: https://api.adzuna.com/v1/api/jobs/us/categories?app_id=${process.env.EXPO_PUBLIC_ADZUNA_APP_ID}&app_key=${process.env.EXPO_PUBLIC_ADZUNA_API_KEY}

**Favorite Part**  
I enjoyed making the buttons, writing the code to make them functional, and building the overall layout. I also liked figuring out how to implement the API and creating the user profile page, where I debugged and tested different ideas such as when to allow users to edit, and how to handle password and username changes.

**Redo**  
If I could redo something, I would improve the testing to make it more robust. I would include more cases, such as checking edge cases in functions and ensuring proper element rendering.

**Lesson Learned**  
I learned that React Native does not handle website creation and database storage as easily as I initially thought. We wanted to use SQLite, but due to the configuration requirements, we decided to use AsyncStorage instead, which worked well since we primarily wanted to test the app on the web rather than on an emulator. I also learned how to work in an agile environment: doing everything through pull requests, conducting code reviews, merging, and participating in standups. These practices helped us stay aligned and understand where we were in the process.

---

### Connor O’Brien  
- **Pull Requests**: [https://github.com/connorobro/Project01/pulls?q=is%3Apr+is%3Aclosed+author%3Aconnorobro](https://github.com/connorobro/Project01/pulls?q=is%3Apr+is%3Aclosed+author%3Aconnorobro)
  
- **Issues**: [*(Insert Issue links)*  ](https://github.com/connorobro/Project01/issues?q=is%3Aissue%20state%3Aclosed%20assignee%3Aconnorobro)

**Role / Stories Worked On**  
My main tasks I focused on throughout the project was to createthe backend database for our entire project as well as tables for the user profiles, so most of my issues and pull requests were related to that. Some additional features I worked on were creating login and registration pages and making changes to routing to stop various edge cases that would crash or mess up the flow of the program
**Biggest Challenge** 
The biggest challenge for me was the initial setup and testing of the database. I initially started with SQLite becuase it was what I saw others using, but after days of getting many errors I found out in the end that SQLite wouldn't be compatible with other pieces of our project.

**Resolution**  
I ended up dropping SQLite and rebuilding the database using Async instead. After switching databases and building back up to having working profiles, I had a much easier time. Some later issues related to my database came up later becuase I didn't make any unit tests after setting in up to verify things were working but I was able to fix them over time.

**Favorite Part**  
My favorite part of the project was seeing all of the different pieces come together. Once the database, login system, and routing were stable, it was really satisfying to see users create accounts, log in, and interact with the application the way we envisioned. It felt like all the behind-the-scenes work finally paid off.

**Redo**  
I would go back and implement better testing earlier in the process. Writing unit tests alongside the database setup would have saved me time fixing bugs later on and given me more confidence that everything was working as expected.

**Lesson Learned**  
The most important lesson I learned from this project is to not cut corners when it comes to testing and planning. Also, making sure to choose the right tools early on and verifying functionality step by step makes development smoother and reduces stress later in the project.

---

### Kassandra Beas  
- **Pull Requests**: [#29](https://github.com/connorobro/Project01/pull/29), [#35](https://github.com/connorobro/Project01/pull/35), [#40](https://github.com/connorobro/Project01/pull/40), [#42](https://github.com/connorobro/Project01/pull/42), [#49](https://github.com/connorobro/Project01/pull/49), [#60](https://github.com/connorobro/Project01/pull/60), [#63](https://github.com/connorobro/Project01/pull/63)  
- **Issues**: [#58](https://github.com/connorobro/Project01/issues/58), [#28](https://github.com/connorobro/Project01/issues/28), [#27](https://github.com/connorobro/Project01/issues/27), [#23](https://github.com/connorobro/Project01/issues/23), [#19](https://github.com/connorobro/Project01/issues/19), [#13](https://github.com/connorobro/Project01/issues/13)  

**Role / Stories Worked On**  
I implemented the Jobs page, which dynamically populates with results based on the user’s selected job category. I also designed and built the Saved Jobs page, including the feature where clicking the heart icon on the Jobs page adds that job to the user’s Saved Jobs list for later reference.

**Biggest Challenge**  
The biggest challenge was ensuring that saved jobs persisted properly across app restarts and were saved uniquely per user. Initially, jobs were either lost on reload or shared across all users, which broke the intended functionality.

**Resolution**  
I restructured how jobs were stored and tied them to individual user sessions. I also updated the logic for local storage/database handling so that saved jobs were retained even after the application restarted.

**Favorite Part**  
My favorite part was designing  and styling the Jobs page and the Saved Jobs page was my favorite part. I enjoyed making them both visually appealing and functional, and it was especially rewarding to see them fully working together — users could search, save, and return later to review opportunities they liked.

**Redo**  
If I could do it again, I would set up persistence and per-user saved jobs earlier in development to avoid delays in testing and debugging. I would also enrich each job listing with more information so it matched our acceptance criteria—adding a short description preview, clearer company details, a posting date, and even a quick summary of application requirements on the job card, with a detailed screen to show the full description.

**Lesson Learned**  
I learned how React Native could be applied to create the features we wanted, and how to resolve merge conflicts in GitHub so code could be successfully integrated into the main branch. I also learned how to collaborate effectively in a group setting to build an end product, while improving my debugging skills and approach to designing user-friendly pages.

---

### Rene V.  
- **Pull Requests**: *(Insert PR links)*  
- **Issues**: *(Insert Issue links)*  

**Role / Stories Worked On**  
*(Fill in here)*  

**Biggest Challenge**  
*(Fill in here)*  

**Resolution**  
*(Fill in here)*  

**Favorite Part**  
*(Fill in here)*  

**Redo**  
*(Fill in here)*  

**Lesson Learned**  
*(Fill in here)*  

---

## Conclusion  
- **Project Success**: We achieved our goal of building a working Job Listing app with login, profile editing, job search, and saved jobs.  
- **Largest Victory**: Our biggest victory was achieving saved jobs persistence unique to each user and integrating job search smoothly, while also getting the register and login functionality working properly. In addition, we successfully implemented the API so that it populated the dropdown menu with categories, which then fed directly into the jobs page to display results for the user. 
- **Challenges**: GitHub collaboration was tricky at first (merge conflicts, PR reviews) but improved our workflow skills.  
- **Final Assessment**: The project was successful, and we gained valuable experience in teamwork, GitHub workflow, and full-stack development.  

