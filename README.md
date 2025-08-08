# CV Generator

A modern web application to create, manage, and share professional-looking Curriculum Vitae (CVs).

## Features

- **User Management:** Secure user registration and login with JWT-based authentication. Users can change their password and delete their account.
- **CV Creation and Management:** Easily create and manage multiple CVs.
- **Structured CV Content:** The CVs are structured into different sections like Biography, Skills, Education, Projects, and Work Experience.
- **Rich Text Editor:** A user-friendly rich text editor (TinyMCE) is integrated for editing the biography section.
- **PDF Generation:** Download your CVs as professional-looking PDFs.
- **Sharable Public Links:** Generate unique, public links for your CVs to share with others.
- **CV Analytics:** Track the number of views for your public CVs.
- **Modern UI:** A beautiful, modern UI with a "glassmorphism" design.
- **LinkedIn Profile Import (Partial):** The application is ready to import basic profile data from LinkedIn (name, headline, photo). This feature requires a Client ID and Client Secret from the LinkedIn Developer Portal to be fully functional.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** SQLite (for development), Prisma (ORM)
- **Authentication:** JWT, bcrypt, Passport.js
- **Frontend:** EJS (templating), CSS3
- **PDF Generation:** Puppeteer
- **Rich Text Editor:** TinyMCE

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14 or later)
- npm

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/juicyjules/cv-generator.git
    cd cv-generator
    ```
2.  Install the dependencies:
    ```sh
    npm install
    ```
3.  Set up the database:
    ```sh
    npx prisma db push
    ```
    This will create the SQLite database file and the necessary tables.

4.  Set up the environment variables. Create a `.env` file in the root of the project and add the following variables:
    ```
    LINKEDIN_CLIENT_ID=YOUR_CLIENT_ID
    LINKEDIN_CLIENT_SECRET=YOUR_CLIENT_SECRET
    SESSION_SECRET=a_very_secret_session_secret
    ```
    Replace `YOUR_CLIENT_ID` and `YOUR_CLIENT_SECRET` with your actual LinkedIn API credentials if you want to test the LinkedIn integration.

### Running the Application

To run the application in a development environment, use the following command:

```sh
npm start
```

This will start the server with `nodemon`, which will automatically restart the server on file changes. The application will be available at `http://localhost:3000`.

## LinkedIn Integration

To enable the LinkedIn profile import feature, you need to create an application on the [LinkedIn Developer Portal](https://www.linkedin.com/developers/).

1.  Go to the LinkedIn Developer Portal and create a new application.
2.  In your application settings, go to the "Products" tab and add the "Sign In with LinkedIn using OpenID Connect" product. This will give you access to the `profile` and `email` scopes.
3.  In the "Auth" tab, add `http://localhost:3000/auth/linkedin/callback` as a redirect URL.
4.  Copy your Client ID and Client Secret and add them to your `.env` file.
