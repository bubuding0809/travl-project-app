# Travl App

## How to run application?

1. Install dependencies
   ```
   > npm install
   ```
2. Create a copy of **.env.example** and rename it to **.env**
3. Populate **.env** with the respective API keys
4. Run in dev mode.
   ```
   > npm run dev
   ```
5. Visit http://localhost:3000 to view application

## How do I deploy this?

### Vercel

Recommend deploying to [Vercel](https://vercel.com/?utm_source=t3-oss&utm_campaign=oss). It makes it super easy to deploy NextJs apps.

- Push your code to a GitHub repository.
- Go to [Vercel](https://vercel.com/?utm_source=t3-oss&utm_campaign=oss) and sign up with GitHub.
- Create a Project and import the repository you pushed your code to.
- Add your environment variables.
- Click **Deploy**
- Now whenever you push a change to your repository, Vercel will automatically redeploy your website!
