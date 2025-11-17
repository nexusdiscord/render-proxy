# Serverless Proxy

A serverless proxy for Render.com (or any Node.js platform) that allows you to proxy requests to any URL.

## 🚀 Deploy to Render.com

### Option 1: Deploy via Dashboard

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: your-proxy-name
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click "Create Web Service"

### Option 2: Deploy via render.yaml

This repository includes a `render.yaml` file for automatic deployment. Just push to GitHub and connect to Render.

### Other Platforms

This proxy can also be deployed to:
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repository
- **Vercel**: Deploy as Node.js project
- **Fly.io**: `fly launch`

## 📖 Usage

After deployment, you can access the proxy with this format:

```
https://your-app.onrender.com/[TARGET_URL]
```

### Usage Examples

**Proxy a website:**
```
https://your-app.onrender.com/https://example.com
```

**Proxy an API:**
```
https://your-app.onrender.com/https://api.github.com/users/github
```

**With query parameters:**
```
https://your-app.onrender.com/https://api.example.com/data?param=value&key=123
```

## ✨ Features

- ✅ Supports all HTTP methods (GET, POST, PUT, DELETE, etc.)
- ✅ Forwards headers and request body
- ✅ Supports query parameters
- ✅ CORS enabled by default
- ✅ Proper error handling
- ✅ Simple "Hello World" homepage
- ✅ Works on any Node.js platform

## 🧪 Local Testing

Run the server locally for testing:

```bash
# Install dependencies
npm install

# Run in development mode (with auto-reload)
npm run dev

# Or run in production mode
npm start
```

Then access:
```
http://localhost:3000/https://example.com
```

## 🔒 Security Notes

This proxy is open and can access any URL. For production use:

1. Consider adding authentication
2. Implement rate limiting
3. Create a whitelist of allowed domains
4. Monitor usage to prevent abuse
5. Use environment variables for sensitive data

## 📝 Example Requests with curl

**GET Request:**
```bash
curl https://your-app.onrender.com/https://api.github.com/zen
```

**POST Request:**
```bash
curl -X POST https://your-app.onrender.com/https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{\"key\":\"value\"}'
```

## 🛠️ Customization

You can modify `index.js` to:
- Add authentication middleware
- Restrict allowed domains
- Add caching with Redis
- Log requests to a database
- Implement rate limiting with express-rate-limit

## 📦 Dependencies

- **express** - Fast, unopinionated web framework
- **axios** - Promise-based HTTP client

## 🌍 Environment Variables

You can set these environment variables:

- `PORT` - Port to run the server (default: 3000)

## 📄 License

MIT
