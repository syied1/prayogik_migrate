# PrayogikLMS: Next.js 13

Key Features:

- Authentication with nextAuth
- Browse & Filter Courses
- Purchase Courses using aamarPay
- Mark Chapters as Completed or Uncompleted
- Progress Calculation of each Course
- Student Dashboard
- Teacher mode
- Create new Courses
- Create new Chapters
- Easily reorder chapter position with drag n’ drop
- Upload thumbnails, attachments and videos using UploadThing
- Rich text editor for chapter description
- ORM using Prisma
- MongoDB database

### Prerequisites

**Node version 18.x.x**

### Install packages

```shell
npm i
```

### Setup .env file

```js
DATABASE_URL =

UPLOADTHING_SECRET =
UPLOADTHING_APP_ID =

NEXT_PUBLIC_APP_URL =

VDOCIPHER_API_SECRET =
VDOCHIPER_HOOK_TOKEN =


AAMARPAY_URL =
AAMARPAY_MERCHANT_ID =
AAMARPAY_STORE_ID =
AAMARPAY_SIGNATURE_KEY =

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=

NEXTAUTH_SECRET=

JWT_SECRET_KEY=

SMTP_USERNAME=
SMTP_APP_PASS=
```

### Setup Prisma

Add MongoDB Database (I used PlanetScale)

```shell
npx prisma generate
npx prisma db push

```

### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command | description                              |
| :------ | :--------------------------------------- |
| `dev`   | Starts a development instance of the app |
