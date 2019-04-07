# APImage

### Why the name ?

Well, it's an API for images.

## Installation

First, install dependancies:

```bash
yarn install
```

Then you can run the required containers from `docker-compose.yml`:

```bash
docker-compose up
```

## Usage

For developement you have to run both `tsc` for typescript and the application itself:

```bash
yarn build -- --watch
```

And then the server

```bash
yarn start:watch
```
