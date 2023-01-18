# Supr-Text

A very simple and easy to use text/code sharing application. With keyboard powers. Mobile friendly as well.

## Dev setup instructions

-   setup mysql locally
-   use `pnpm` (npm i -g pnpm)
-   just do `pnpm i` and then `pnpm dev` and you are good to go.
-   This repo follows commitizen commit guide lines, please do `pnpm commit` for commiting.

## ENV file

You need a `.env.development.local` for local dev setup and a `.env.production.local` for a docker setup. Both of these contain four keys:
|Key|Expected value|
|---|--------------|
|DATABASE_URL|URL of the `MySQL` database|
|CONTENT_KEY|16 Character Key containing only characters and numbers (generate using `pnpm keygen:dev`)|
|NEXT_PUBLIC_CONTENT_KEY|Same as above|
|NEXT_PUBLIC_URL|URL where this instance is running|

## Docker deployment

### With Self Hosted DB

run `bash docker.sh db`

### With remote hosted db

run `bash docker.sh`
