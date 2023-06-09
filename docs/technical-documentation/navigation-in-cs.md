# Navigation In CS

This specification document outlines the navigation logic for using a web component in the legacy CS code that renders the legacy markup inside a React wrapper with react-router as a routing solution.

## Overview

In order to be able to progressively migrate individual pages from the CS legacy code at a time, the approach taken has been to employ the use of web-components. This has been used in conjunction with react-router to be able to minimize the amount of work needed after switching out all routes from legacy code to newer react code.

Doing it this way has also allowed us to migrate the older pages to the new Navigation UX/UI.

## How it works

We have a separate application we are building where the new React components are defined and used. The build pipeline for this application creates two bundles: `main.js` and `webComponentRegistry.js`.

A top-level router (`WebComponentRouter`) is turned into a web-component via the `web-component-registry` file. This file is then pulled into the CS application via CDN and a feature toggle is used to do the following:

1. Determine whether the CDN should be loaded
2. Prevent rendering of legacy Navigation and footer
3. Renders the web-component

Once the web-component (`cc-main`) is mounted in the legacy application it takes the main content of a page, parses it into React markup and renders it as children on the `CSViewController`.

## Important things to know

### 1. Routing in legacy CS

The routing in the legacy CS app is not super intuitive nor does it follow REST conventions in a hierarchical. For example, the projects index page sits on `/organization/projects` where as an individual project sits on `/project/:projectId`. This has posed as a problem for how react-router determines active states on NavTabs and also for building out breadcrumbs. The solutions to these problems are as follows:

### **Breadcrumbs**

#### **Issue 1 - loading data**

Let's take the report view as an example. The route for a report is `/report/:reportId` but we still need to render the breadcrumbs with the following labels: `home/projects/{{projectName}}/slots/{{slotName}/reports/{{reportName}}`

Fetching the report record via reportId is easy but we are not provided the `slotId` or the `projectId` via the route params. This means we have to reverse the hierarchy and determine these ids from the report we fetch. To do this we actually query the slot and then the report as children on the report. Not ideal.

**Action item** - Remap these routes once migrated to something more meaningful so we can query these models properly. e.g. `/report/:reportId` should be `/projects/:projectId/slots/:slotId/reports/:reportId`

Asana Task - https://app.asana.com/0/1203451375641249/1204334300206525/f

#### **Issue 2 - breadcrumb loading states**

Navigating between legacy views cause a full page reload. A jarring side-effect of this for the new navigation was that the breadcrumbs and title would always show a loading state on each tab change when it shouldn't.

To solve this we needed to cache the results/records fetched. If a cached record is found then we render the breadcrumb instead of the loader. Note: The query still happens on each page reload in case and new data is available for these records.

**Action item** - This will not be an issue when we move to a truly SPA solution. Once fully migrated, we should remove the caching on these controllers.

Asana task 1 - https://app.asana.com/0/1203451375641249/1204334300206520/f
Asana task 2 - https://app.asana.com/0/1203451375641249/1204334300206523/f

#### **Issue 3 - Nav Tab active states**

Because of the weird hierarchy, determining active states for top-level navigation tabs has been difficult and hacky. For e.g. the path for Projects is `/organization/projects` but the path for an individual project is `/project/:projectId`. These paths are not relative to each other when they should be.

To solve this, the NavTab component tabs are configured with `nestedPaths`. Adding a "child" path to this array will match the route internally and assure that the tab that this is configured with will render as active.

**Action item** - Once proper hierarchy is achieved with routing, this configuration and the logic that determines can be removed and we can lean on react-router to determine the active state via relative paths.

Asana task - https://app.asana.com/0/1203451375641249/1204334300206531/f
