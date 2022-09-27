# Svelte-browser

Basic web based file browser with nodeJS and giving a try on Svelte. 

## Get started

To give a first try, locate on path (in Windows with gitbash):

```bash
npm run tryon
```

*Note that you will need to have [Node.js](https://nodejs.org) installed.*

A little messy, but it will install all front/back dependencies, generate front build and start server.

Navigate to [localhost:4000](http://localhost:4000). You should see the app running. 

## New execution

After first execution and with no new changes, only running follow command will work:

```bash
npm start
```

## Deploying to the web

### With [Vercel](https://vercel.com)

Install `vercel` if you haven't already:

```bash
npm install -g vercel
```

Then, from within your project folder:

```bash
cd public
vercel deploy --name my-project
```

### With [surge](https://surge.sh/)

Install `surge` if you haven't already:

```bash
npm install -g surge
```

Then, from within your project folder:

```bash
npm run build
surge public my-project.surge.sh
```
