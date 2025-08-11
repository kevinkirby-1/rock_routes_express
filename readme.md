# Rock Routes (Backend) 🧗‍♀️

### A full-stack Progressive Web Application for rock climbers to track and visualize their progress.

**Live Demo:** https://rock-routes-react.onrender.com

**Frontend Repository:** https://github.com/kevinkirby-1/rock_routes_react

***

## Project Overview

Rock Routes is a web application built to address a common need in the climbing community: effective progress tracking and visualization. Developed as a **Progressive Web Application (PWA)**, this platform allows users to log the rock climbing routes they are working on, add attempts, mark them as completed, and gain insights into their performance through intuitive data visualization. Users can also organize their routes by adding climbing gyms and uploading photos to their logs, providing a seamless and responsive user experience while handling complex data management and presentation, with the added benefit of being installable and accessible offline.

***

## Screenshots

![Screenshots of Rock Routes](/public/demo_grid.png)
***

## Technical Stack

This project was developed as a full-stack application using a modern and robust technology stack.

### Frontend
* **React & TypeScript:** The user interface is built with React, leveraging TypeScript to ensure code quality, type safety, and a maintainable codebase.
* **SCSS:** Component styling is handled with SCSS, utilizing features like variables and nesting for a clean and scalable style architecture.
* **Recharts:** A key feature of the application is its data visualization. Recharts was used to create dynamic and interactive graphs that effectively communicate a user's climbing progress over time.

### Backend
* **Node.js & Express:** The RESTful API is built with Node.js and the Express framework, providing a high-performance and scalable backend.
* **TypeScript:** The backend is also written in TypeScript, which helps maintain a consistent development experience and prevents common runtime errors.
* **MongoDB:** A NoSQL database was chosen to store user and route data, providing flexibility and scalability for the application's evolving data model.
* **Mongoose:** The database is managed using Mongoose, an object data modeling (ODM) library that simplifies data interaction and validation.
* **Cloudinary:** This service is used for efficient cloud-based storage and management of all user-uploaded images.

### Deployment
Both the frontend and backend are deployed on **Render**. This showcases an understanding of modern deployment practices and containerization principles.

***

## Key Features

* **Comprehensive Route & Gym Tracking:** Users can log and edit detailed information about climbing routes, as well as add climbing gyms to effectively sort and organize their progress.
* **Secure Authentication:** The application uses **OAuth**, as well as traditional email and password, for login, providing a simple and secure method for user authentication.
* **Image Uploads:** Users can upload images to their route logs, which are then stored and managed securely using Cloudinary.
* **Data Visualization:** Interactive graphs and charts provide a clear and engaging visual representation of a user's climbing progress, route completion rates, and historical data.
* **Progressive Web App (PWA):** The application is installable on users' devices, providing a native app-like experience with an icon on the home screen. This also enables offline functionality, allowing users to access core features even without an internet connection.
* **RESTful API:** A well-structured API allows for seamless communication between the frontend and a MongoDB database, ensuring efficient data retrieval and storage.
* **Responsive Design:** The application is fully responsive, providing an optimal user experience across various devices and screen sizes.

***

## Project Highlights

Developing Rock Routes presented opportunities to demonstrate proficiency in several key areas:

* **Full-Stack Integration:** Successfully integrating a React-based frontend with a Node.js/Express REST API, including managing user authentication with **OAuth** and handling file uploads to **Cloudinary**.
* **PWA Development:** Implementing a service worker and manifest file to enable offline access and installability, showcasing an understanding of modern web app capabilities.
* **Complex State Management:** Handling application-wide state for user data, routes, and gyms to ensure a smooth, reactive user experience.
* **Data Visualization Implementation:** Selecting and implementing Recharts to transform raw climbing data into meaningful, user-friendly graphs.
* **Deployment and DevOps:** Configuring and deploying both frontend and backend services on a cloud platform (Render), demonstrating practical experience with CI/CD and production environments.

***

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).