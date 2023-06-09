# Foundation

We created a Control Center React SPA which redirects to Cryptosense pages until they can be migrated to the Control Center React app.

## Initial Phase

Create a Control Center React SPA which redirects to Cryptosense pages. The only user visible changes are the navigational components and the login page.

Steps:

- Created a Single-Page Application (SPA) using React for the Control Center front end
- Added authentication and redirection to Cryptosense pages, read more in the [authentication](authentication.md) page.
- Switch out the Cryptosense navigation components to instead use a new React navigation web component
- The React web component will be used for both the React App + Cryptosense legacy platform
- This will allow us to maintain the same navigation across both apps, for a less jarring experience when going from the old Cryptosense platform to the new Control Center app.
- Minor adjustments to CSS styling of the current Cryptosense front-end to match Material UI style

## Intermediary Phase

In this phase, we start migrating full pages to React and deprecating the corresponding legacy route.

- Progressively migrate Cryptosense pages to React
- Once a page is fully migrated, change the routing in the Control Center React App to point to the new React page.

## Completed Migration Phase

Once all the pages are migrated, we can clean up the dependencies to the Cryptosense front-end platorm to make the Control Center a stand alone front end.

This will require some clean up in some implementations including authentication, routing, deployment of the app etc.

## Implementation Context

The Cryptosense (CS) frontend has been built with python and Jinja. It is server side rendered and uses Jinja as a templating engine. We need to modernize the frontend to create a more scalable product and a better developer and customer experience. Since we have client deliverables, we needed the ability to deploy the legacy code base and slowly migrate components from Jinja/python to React.

The current Control Center implementation allows us to deliver in production all the current functionality of the CAP platform in a short period of time by redirecting users to the old implementation; whilst still allowing the us to set up a independent and strong foundation for the Control Center platform using a React SPA and migrating pages progressively.
