# EasyCTF Platform

This is a genericized version of EasyCTF 2014, and can be used as a backend for hosting CTF competitions. This was based on [picoCTF 2013's CTF-Platform](https://github.com/picoCTF/CTF-Platform).

## Getting Started

1. Clone the repo and run `npm install` to install dependencies.
2. Modify the options in `api/common.js`.
3. Navigate to the directory using some kind of shell and run `node app` to start the server.
4. The server will listen on port 3000 by default unless you specify a different port in the environmental variables.

## Requirements

This platform is written in Node.js. Therefore, it is quite obvious that you need to have Node.js installed on your system in order to run this server. The node dependencies are all included in the repo, but if you have any trouble with those, simply run `npm install --save` inside the directory, since all of the packages should be listed in `package.json`.

I'd recommend using a Unix-based computer (that includes you, Macs :smile: ) to run this, however using Windows is perfectly acceptable. In fact, this platform was written and tested more on a Windows computer than on Linux.

### AJAX API

Like picoCTF's platform, this server consists of many static HTML files that make AJAX (asynchronous) requests to an API. The API does not need to be launched separately; it is built into the server.

### Database

This platform requires a MongoDB server. MongoDB has many advantages to SQL, and if you want a full list of those, Google it. The following collections exist in the database:

- accounts (store user information)
- problems (store problem information)
- reset_password (password reset requests)
- shell_accounts (for if you want to have a shell)
- submissions (store submission information)

Sample problem information can be found in the `docs` folder in this repo (TODO).

## Hosting
It is strongly recommended that you use Heroku. Heroku is simple to set up, runs on Git, and has many partners that will give you exclusive deals on their products (such as email servers, DNS servers, etc.). This platform is ready to push to Heroku directly.

```sh
$ (git add, git commit)
$ heroku create
$ git push heroku master
$ heroku ps:scale web=1 # Ensure at least one web process is running
```
