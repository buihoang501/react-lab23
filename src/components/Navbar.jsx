import React, { Fragment } from "react";
import { NavLink, useRouteLoaderData, Form } from "react-router-dom";
import classes from "./Navbar.module.css";

const Navbar = () => {
  const token = useRouteLoaderData("root");

  return (
    <header className={classes.header}>
      <nav>
        <li>
          <NavLink className={classes["nav-logo"]} to="/">
            MessageNode
          </NavLink>
        </li>
        <ul>
          {!token && (
            <Fragment>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? `${classes["nav-link"]} ${classes.active}`
                      : `${classes["nav-link"]}`
                  }
                  to="/login"
                >
                  Login
                </NavLink>
              </li>

              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? `${classes["nav-link"]} ${classes.active}`
                      : `${classes["nav-link"]}`
                  }
                  to="/signup"
                >
                  Signup
                </NavLink>
              </li>
            </Fragment>
          )}

          {token && (
            <Fragment>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? `${classes["nav-link"]} ${classes.active}`
                      : `${classes["nav-link"]}`
                  }
                  to="/feed"
                >
                  Feed
                </NavLink>
              </li>
              <li>
                <Form action="/logout" method="post">
                  <button>Logout</button>
                </Form>
              </li>
            </Fragment>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
