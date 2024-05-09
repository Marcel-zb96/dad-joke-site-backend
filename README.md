<p align="center">
    <h1 align="center">MAD-JOKE-SITE-BACKEND</h1>
</p>
<p>
<p align="center">
		<em>Developed with the software and tools below.</em>
</p>
<p align="center">
	<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
	<img src="https://img.shields.io/badge/Express-000000.svg?style=flat&logo=Express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/Mongoose-880000?style=flat&logo=mongoose&logoColor=green" alt="MongooseJs">
	<img src="https://img.shields.io/badge/Nodemon-76D04B.svg?style=flat&logo=Nodemon&logoColor=white" alt="Nodemon">
	<img src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white" alt="JSON">
</p>
<p align="center">
		<em>Developed by Marcell Biró</em>
</p>
<hr>

##  Quick Links
> - [ Overview](#-overview)
> - [ Features](#-features)
> - [ Repository Structure](#-repository-structure)
> - [ Modules](#-modules)
> - [ Getting Started](#-getting-started)
>   - [ Installation](#-installation)
>   - [ Running dad-joke-site-backend](#-running-dad-joke-site-backend)

---

##  Overview

  This project was created for learning purposes with the following tecnologies: NodeJs, ExpressJs, MongooseJs. 
  It's created for handleing requests made to the api/jokes and api/users endpoints.

##  Features

  - Authentication: user authentication with bcrypt and jwt token.
  - Joke serving: based on authorization serving parsed jokes with or without puchline.
  - Signing: user sign up and logging in.
  - Database: storing users and jokes in MongoDb using MongooseJs library.

##  Repository Structure

```sh
└── dad-joke-site-backend/
    ├── controller
    │   ├── jokeController.js
    │   └── userController.js
    ├── repository
    │   ├── jokes.model.js
    │   ├── populate
    │   │   ├── Jokes.json
    │   │   └── populate.js
    │   └── user.model.js
    ├── security
    │   └── authentication.js
    └── util
        └── util.js
    ├── server.js
    ├── package-lock.json
    ├── package.json
    ├── README.md
```

---

##  Modules

<details closed><summary>util</summary>

| File                                                                                     | Summary                                  |
| ---                                                                                      | ---                                      |
| [util.js](https://github.com/Marcel-zb96/dad-joke-site-backend/blob/master/util/util.js) | Utility functions mainly for parsing data `util/util.js` |

</details>

<details closed><summary>repository</summary>

| File                                                                                                         | Summary                                               |
| ---                                                                                                          | ---                                                   |
| [user.model.js](https://github.com/Marcel-zb96/dad-joke-site-backend/blob/master/repository/user.model.js)   | MongoDb schema for storing users `repository/user.model.js`  |
| [jokes.model.js](https://github.com/Marcel-zb96/dad-joke-site-backend/blob/master/repository/jokes.model.js) | MongoDb schema for storing jokes `repository/jokes.model.js` |

</details>

<details closed><summary>repository.populate</summary>

| File                                                                                                            | Summary                                                     |
| ---                                                                                                             | ---                                                         |
| [populate.js](https://github.com/Marcel-zb96/dad-joke-site-backend/blob/master/repository/populate/populate.js) | Prepopulate jokes database for development and testing purposes `repository/populate/populate.js` |
| [Jokes.json](https://github.com/Marcel-zb96/dad-joke-site-backend/blob/master/repository/populate/Jokes.json)   | Prepopulate users database with one user 'anonymus' for development and testing purposes `repository/populate/Jokes.json`  |

</details>

<details closed><summary>controller</summary>

| File                                                                                                               | Summary                                                  |
| ---                                                                                                                | ---                                                      |
| [jokeController.js](https://github.com/Marcel-zb96/dad-joke-site-backend/blob/master/controller/jokeController.js) | Controller file with for managing request made for /api/jokes endpoint `controller/jokeController.js` |
| [userController.js](https://github.com/Marcel-zb96/dad-joke-site-backend/blob/master/controller/userController.js) | Controller file for managing request made for /api/users endpoint `controller/userController.js` |

</details>

<details closed><summary>security</summary>

| File                                                                                                             | Summary                                                |
| ---                                                                                                              | ---                                                    |
| [authentication.js](https://github.com/Marcel-zb96/dad-joke-site-backend/blob/master/security/authentication.js) | Package for web security, implementing authentication `security/authentication.js` |

</details>

---

##  Getting Started

***Requirements***

Ensure you have the following dependencies installed on your system:

* **NodeJs**: `v18.16.0`
* **MongoDb** 

###  Installation

1. Clone the dad-joke-site-backend repository:

```sh
git clone git@github.com:Marcel-zb96/dad-joke-site-backend.git
```

2. Change to the project directory:

```sh
cd dad-joke-site-backend
```

3. Install the dependencies:

```sh
npm install
```
4. Set environment variables:

  - Rename the `.sample.env` file to `.env` in the root directory and fill in the variables:
  ```
    MONGO_URL=<Your connection string to mongo db>
    TOKEN_SECRET=<Your token secret for JWT>
  ```

  - Rename the `.sample.env` file to `.env` in the `repository/populate` directory and fill in the variable values:
  ```
    MONGO_URL=<Your connection string to mongo db>
    TOKEN_SECRET=<Your token secret for JWT>
  ```

6. Prepolulate MongoDB:

```sh
In the root directory run the following command:

node repository/populate/populate.js
```

###  Running dad-joke-site-backend

Use the following command to run dad-joke-site-backend with nodemon:

```sh
npm start
```
