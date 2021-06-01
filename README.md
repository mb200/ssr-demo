# Server Side Rendering (SSR) Demo

* [What is this?](#what-is-this)
* [Setup](#setup)
  + [Step 1. Run the Docker container](#step-1-run-the-docker-container)
  + [Step 2. Run the seed script](#step-2-run-the-seed-script)
  + [Step 3. Run the React app](#step-3-run-the-react-app)
* [Interesting things to try](#interesting-things-to-try)

## What is this?

This is a demo of basic SSR techniques using with React, NextJS, and React Server Components, an experimental React feature. The Notes app and UI were taken directly from the [ReactJS Team's React Server Components demo](https://github.com/reactjs/server-components-demo), and adapted to React and NextJS. 

**I strongly recommend looking at that [demo](https://github.com/reactjs/server-components-demo) and [watching the ReactJS team introducing Server Components](https://reactjs.org/server-components) before exploring this demo.** The talk includes a walkthrough of the demo code and highlights key points of how Server Components work and what features they provide.

## Setup

You will need to have Node >=14.9.0 and Docker in order to run this demo. [Node 14 LTS](https://nodejs.org/en/about/releases/) is a good choice!

### Step 1. Run the Docker Container

From root, run:

```
docker-compose up
```

This will start the postgres database and the API server. 

### Step 2. Run the seed script

From `/server`, run:

```
yarn        // Install deps.
yarn seed   // Seed the db.
```

### Step 3. Run the React app

Finally, you're ready to run one of the three apps. Choose an app to run, and `cd` into its directory.

1. `/react-spa`: ReactJS Single Page App (SPA)
2. `/next`: NextJS app
3. `/react-server-components`: React Server Components app

Then, from that directory, run:

```
yarn        // Install deps.
yarn dev    // Run the app in dev mode.
```

This should run the app at [http://localhost:3000](http://localhost:3000).

## Interesting things to try

- Expand note(s) by hovering over the note in the sidebar, and clicking the expand/collapse toggle. Next, create or delete a note. What happens to the expanded notes?
- Change a note's title while editing, and notice how editing an existing item animates in the sidebar. What happens if you edit a note in the middle of the list?
- Search for any title. With the search text still in the search input, create a new note with a title matching the search text. What happens?
- Search while on Slow 3G, observe the inline loading indicator.
- Switch between two notes back and forth. Observe we don't send new responses next time we switch them again.
- Uncomment the `fetch('http://localhost:3000/sleep/....')` call in `Note.server.js` or `NoteList.server.js` to introduce an artificial delay and trigger Suspense.
  - If you only uncomment it in `Note.server.js`, you'll see the fallback every time you open a note.
  - If you only uncomment it in `NoteList.server.js`, you'll see the list fallback on first page load.
  - If you uncomment it in both, it won't be very interesting because we have nothing new to show until they both respond.
- Add a new Server Component and place it above the search bar in `App.server.js`. Import `db` from `db.server` and use `db.query()` from it to get the number of notes. Oberserve what happens when you add or delete a note.

You can watch a [recorded walkthrough of all these demo points here](https://youtu.be/La4agIEgoNg?t=600) (with timestamps).


