## How to run Local

First, install requirements

```bash
npm install
```

Second, you must provide AWS credentials and Bucket Name in .env

```
AWS_ACCESS_KEY=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=
```

Then, run dev server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.
