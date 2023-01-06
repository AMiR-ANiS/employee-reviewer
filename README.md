## Employee Reviewer Node JS Application

An application for managing and reviewing employee's performance and give feedbacks to reviews.

### Features

- Users can Login/Signup as admin or employee
- Admins can:
  - Add employees
  - View employees
  - Remove employees
    ( removing an employee will also remove his/her performance review and all feedbacks associated with that review/employee! )
  - Update employees
  - Make an employee an admin
    ( making an employee admin will remove his/her performance review and all feedbacks associated with that review/employee! )
  - Give performance review to an employee ( only employees can get performance reviews, not admins! )
  - Update performance reviews of employees
  - Assign employees to participate in some employee's performance review ( assigning an employee to give feedback for a review )
- An employee can:
  - View list of performance reviews requiring feedback
  - Submit a feedback for a review
- A user can:
  - Update their profile ( name/password ) by visiting their profile page from the top ( email cannot be updated! )
  - Delete their account from their profile page
  - Log out session

### Guide to setup the project on local system

#### Prerequisites for running the application on local system

The system should have the following things installed:

- git
- NodeJS
- npm
- MongoDB

Open the terminal and type these commands to check if these are installed:

- `git --version`
- `node --version`
- `npm --version`
- `mongo --version`

##### Proceed to the below steps if these are installed

- Open an empty directory where the project is to be cloned, then open the terminal in that directory and type `git clone https://github.com/AMiR-ANiS/employee-reviewer.git`
- After cloning the project, go to the project directory by typing `cd directory_name`, where directory_name is the name of the project folder.
- Then run `npm install`. It will install all the dependencies necessary to run the application
- Then create a **_.env_** file in the project directory and define these variables:
  - APP_MODE="development"
  - APP_ASSET_PATH="/assets"
  - APP_SESSION_COOKIE_NAME="_TYPE ANY COOKIE NAME OF YOUR CHOICE_"
  - APP_SESSION_COOKIE_SECRET="_TYPE ANY COOKIE SECRET OF YOUR CHOICE_"
- Open **_config/mongoose.js_** file
- Change the `uri` variable to `mongodb://localhost/reviewer_db` or `mongodb://127.0.0.1/reviewer_db`
- Then in the project directory terminal type `npm start` or `node index.js`
- Open the browser and go to the link `localhost:3000` or `127.0.0.1:3000` to start the application
