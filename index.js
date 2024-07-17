import express from "express";
import morgan from "morgan";
import methodOverride from "method-override";
import ErrorHandler from "./ErrorHandler.js";

let userSession = false;
const app = express();

/* 
`app.set("views", "./views");` is setting the directory where the application will look for views
(templates) to render. In this case, it is setting the views directory to "./views", which means
that the application will look for view files in the "views" directory relative to the current
working directory. This is commonly used in Express applications to specify the location of the
views that will be rendered by the application. 
*/
app.set("views", "./views");
app.set("view engine", "ejs");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/**
 * The authMiddleware function checks if a user session is active and redirects to the login page if
 * not.
 * @param req - The `req` parameter in the `authMiddleware` function stands for the request object,
 * which contains information about the HTTP request made by the client, such as headers, parameters,
 * body, and more. It is typically used to access data sent by the client to the server.
 * @param res - The `res` parameter in the `authMiddleware` function is an object representing the HTTP
 * response that the server sends back to the client. It allows you to send data, set cookies, and
 * redirect the client to a different URL. In this case, the `res` object is used to redirect
 * @param next - The `next` parameter in the `authMiddleware` function is a callback function that is
 * used to pass control to the next middleware function in the stack. When called, it will pass the
 * control to the next middleware function in the chain. If there are no more middleware functions to
 * be executed, it
 */
const authMiddleware = (req, res, next) => {
  console.log(userSession);
  if (userSession == true) {
    next();
  }

  res.status(401);
  throw new ErrorHandler();
  // res.redirect("/login");
};

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/login", (req, res) => {
  /* The code block `if (userSession === true) { res.status(302).redirect("/admin"); }` is checking if
  the `userSession` variable is `true`. If the condition is met (meaning a user session is active),
  it sets the HTTP status code to 302 (Found) and redirects the user to the "/admin" route. This
  code snippet is used in the "/login" route to automatically redirect the user to the admin page if
  they are already logged in and have an active session. */
  if (userSession === true) {
    res.status(302).redirect("/admin");
  }
  res.render("login");
});

app.post("/login", (req, res) => {
  /* `const { username, password } = req.body;` is a destructuring assignment in JavaScript. In this
  line of code, it is extracting the `username` and `password` properties from the `req.body`
  object. */
  const { username, password } = req.body;

  /* This block of code is handling the login functionality in the Express application. It checks if
  the provided `username` and `password` match the values "admin" and "admin" respectively. If the
  condition `username === "admin" && password === "admin"` is true, it means that the login attempt
  is successful with the correct credentials. */
  if (username === "admin" && password === "admin") {
    /* `userSession = true;` is setting the `userSession` variable to `true`, indicating that a user
    session is active. This is typically done after a successful login attempt where the provided
    username and password match certain criteria (e.g., username is "admin" and password is "admin"
    in this case). By setting `userSession` to `true`, the application recognizes that the user is
    authenticated and can access restricted areas or perform authorized actions within the
    application. */
    userSession = true;
    res.redirect("/admin");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  userSession = false;
  res.redirect("/login");
});

/* The `app.get("/admin", authMiddleware, (req, res) => { res.send("Admin Page"); });` code snippet is
defining a route in the Express application for handling GET requests to the "/admin" endpoint.
Here's what it does: */
app.get("/admin", authMiddleware, (req, res) => {
  res.send("Admin Page");
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status || 500).send(message);
});

/* The `app.use((req, res, next) => { res.status(404).send("Page not found"); });` code snippet is
defining a middleware function in the Express application that will be executed for any request that
reaches this point in the middleware stack and has not been handled by any previous route. */
app.use((req, res, next) => {
  res.status(404).send("Page not found");
});

app.listen(3000, () => {
  console.log("Server is running on https://localhost:3000");
});
