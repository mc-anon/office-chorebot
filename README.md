# Office Chorebot

Office Chorebot is an app for managing and sharing out chores amongst a team of office workers (e.g - Making coffee, emptying the bins, cleaning surfaces etc). Office Chorebot has a front-end where an Admin user has the ability to create, update and delete chores. Other users can sign in to simply read all the chores. Everyday at 9am (time configurable), the app checks if any chores need to be carried out, and sends a Slack message to a public channel tagging the person whose turn it is. The next time round, the next person in line gets the message. This ensures that chores are shared out equally amongst the team.

The app was initially created as an internal tool for the office of a Berlin-based digital agency. The project was managed on JIRA using the Agile Scrum framework with weekly sprints and sprint reviews.

![](assets/chorebot-frontend.gif)

<p>&nbsp;</p>

![](assets/chorebot-slack.gif)

# Tech Stack

- React (Create React App)
- Firebase
- ASP.NET Core (3.1.8)
- Hangfire (https://www.hangfire.io/)

The React JS library was used for the front-end where users can manage the chores. Firebase was used for authentication and database storage. The business logic of the app resides in an ASP.NET Core project - this is responsible for fetching the Slack users and the chores for the day, and pinging the correct user with the message.

_NOTE: This is essentially 2 separate applications talking to 1 database, but they are both housed in the same folder structure_

# Requirements & Setup

In order to use Office Chorebot, you will require a Slack workspace and a Firebase project set up (for auth and DB).

## Slack

We need the following from Slack to configure the app:

1. Webhook Url
2. Bot User OAuth Access Token
3. Channel ID

Please follow the steps at https://api.slack.com/ to create an app. Make sure to activate it with 'Incoming Webhooks' and create a Webhook Url. This should also auto-enable 'Bots' and 'Permissions' functionality, however you'll also need to go to 'OAuth & Permissions' and add the OAuth Scope 'channels:read', you can then copy the Access Token from here. Now you have permission to retrieve the users on a Slack channel, and also post messages to it. You can retrieve the Channel ID for the Slack channel you want to use via the web app for your workspace - it will be the last part of the url.

## Firebase

We need the following from Firebase to configure the app:

1. Project ID (Firestore)
2. Collection Name (Firestore)
3. Service Account Private Key
4. Firebase SDK Snippet
5. Admin user's UID

Please follow the steps at https://firebase.google.com/ to create a Firebase project. You need to enable email/password for the authentication sign-in method, and create a user (this will be your Admin). Any other users created will have read-only access to the chores. Create a Firestore database for the project and add a Collection. You will be asked to add one document to the collection, but make sure to **delete** this document. From the project settings you can find the Project ID. You will also need to add a web app and this will give you the Firebase SDK snippet. Generate a new private key from inside "Service accounts" - this is what will go in the serviceAccount.json file.

Finally, we need to specify security rules for the database. Inside 'Cloud Firestore' and 'Rules' you can add the following (making sure to specify YOUR_COLLECTION_NAME and YOUR_ADMIN_UID):

```
service cloud.firestore {
    match /databases/{database}/documents {
        match /<YOUR_COLLECTION_NAME>/{document=**} {
          function isSignedIn() {
            return request.auth != null;
          }

          function isAdmin() {
            // Determine if the user is admin
            return isSignedIn() && request.auth.uid == "<YOUR_ADMIN_UID>";
          }

          // Owners can read, write, and delete stories
          allow write: if isAdmin();
          allow read: if isSignedIn();
          }
    }
}
```

# To Run Locally

After cloning the repo, you need to configure the following files with the information we created in the 'Requirements & Setup' step:

1. appsettings.json
2. serviceAccount.json
3. react-app/.env

You can also change the JobFrequency cron expression in appsettings.json to whatever suits. By default, the app is set to run at 9am on weekdays.

_NOTE: .env and serviceAccount.json files are included in this repo, although it is usually recommended to keep these out of source control for security reasons._

## ASP.NET Core Service App

Assuming you have `.NET Core 3.1` installed you can `dotnet run` from inside the project directory, or run from the Visual Studio IDE

## Front End React App

Assuming you have `node` and `npm` installed, in the react-app/ directory you can run:

### `npm install`

Installs the required packages

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />

# To Deploy

You can deploy the ASP.NET Core project to Azure from inside Visual Studio -> Build -> Publish to Azure...
The React app can be easily deployed to Firebase Hosting. You can deploy via the Firebase CLI from the react-app/ directory. Here is a good step-by-step video to follow: https://www.youtube.com/watch?v=IDHfvpsYShs

# Reflections

The purpose of the project was to leverage recently learnt knowledge of C# and .NET Core into a real-world application. The client however also expressed interest in a React-based frontend with Firebase authentication and storage - therefore I had to quickly learn the basics of React and Firebase in order to satisfy this.

The Office Chorebot works as expected, and was a good exercise in utilising my C#/.NET knowledge, as well as learning new technologies quickly. However, it seems unusual and unnecessary to have 2 applications hosted separately for such a small project. I initially configured the project locally in Visual Studio as a React/ASP.Net template type, but unfortunately was unable to successfully deploy the whole thing to Azure. This is something that I will need to research more thoroughly.

If I was to re-do the project, I think the .NET background job could be much more easily implemented with Firebase Cloud Functions. I think this would remove a lot of unnecessary complexity from the project and allow the whole app to be housed in one Firebase project.

The frontend is functional but not very visually compelling. For non-admin users, the components are simply disabled which I think makes for an ugly UI. The form itself could be more compact as well.

Some of the main challenges included implementing authentication and conditional rendering of compenents based on user roles. This very useful tutorial came in handy for auth: https://www.youtube.com/watch?v=unr4s3jd9qA
I also had to customise the MUIDataTable component from https://material-ui.com/ to add a confirmation modal when deleting a chore. The execution of the recurring job to fetch and post chores was made easy with https://www.hangfire.io/ - a framework for handling background processes in .NET.

# Possible future iterations

The app's functionality could be extended in several ways:

- The admin could have the ability to assign admin rights to other users.
- The time when each message is sent to Slack could be configurable.
- The Slack users assigned to each chore could be configurable instead of including everyone on the specified channel.
- A timespan could be specified for each chore i.e - every 2 weeks instead of every week.
- Integrate with a shared Google Calendar which checks if a team member is on holiday - thus passing the chore to the next person in line.
