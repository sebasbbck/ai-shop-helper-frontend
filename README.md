# AI Shop Helper Frontend

Frontend for AI Shop Helper application.

# Install bun

```sh
curl -fsSL https://bun.sh/install | bash
```

## Using Docker

1. [Install Docker](https://docs.docker.com/get-docker/) on your machine.

2. Build your container:

    ```bash
    # For npm, pnpm or yarn
    docker build -t nextjs-docker .
    
    # For bun
    docker build -f Dockerfile.bun -t nextjs-docker .
    ```

3. Run your container: `docker run -p 3000:3000 nextjs-docker`.

You can view your images created with `docker images`.

## Running Locally

First, run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.
