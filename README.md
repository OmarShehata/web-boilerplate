# Web Boilerplate - backend

### Setup

Clone this repo. Install node/pnpm (https://pnpm.io/installation).

1. `pnpm install` to intall node dependencies
1. Run `env.bat` to set environmant variables 
1. Initialize the DB by running `node scripts/reset_db.js`
1. `pnpm watch` to run the server with auto-reload

The individual pages are in `views/`. The server entry point is in `src/server.js`.

Any file in `public/` will be available publicly at the root url. For example, `public/image.png` will be served at `http://localhost:3000/image.png`. 

### Frontend libraries

to add a front-end library, download it, put it into public, then load it with <script> tag.

It'd be better if I could support npm on the front end too, and some basic bundling?

### TODO

- Add example for file upload?

#### Deploying to glitch

- get the glitch git URL
- Run in the glitch project's terminal

```
git config receive.denyCurrentBranch ignore
```

- Add it to your local repo:

```
git remote add glitch 
```

- Push with `git push glitch`
- You may need to run on Glitch's terminal `refresh`, and `git reset --hard`