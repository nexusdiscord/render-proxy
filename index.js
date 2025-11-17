// Serverless Proxy for Render.com
// Allows proxying requests to any URL through your Render instance
// Usage: https://your-app.onrender.com/https://example.com

const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root endpoint - Hello World
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Proxy handler for all other routes
app.all('*', async (req, res) => {
  // Get the target URL from the path (everything after the first /)
  const targetUrl = req.path.slice(1) + (req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '');
  
  // Validate that the target URL is valid
  let targetURL;
  try {
    targetURL = new URL(targetUrl);
  } catch (error) {
    return res.status(400).json({
      error: 'Invalid URL',
      message: 'Please provide a valid URL to proxy',
      usage: req.protocol + '://' + req.get('host') + '/https://example.com',
    });
  }
  
  // Only allow http and https protocols
  if (!['http:', 'https:'].includes(targetURL.protocol)) {
    return res.status(400).json({
      error: 'Invalid Protocol',
      message: 'Only HTTP and HTTPS protocols are supported',
    });
  }
  
  try {
    // Prepare headers for the proxied request
    const proxyHeaders = { ...req.headers };
    
    // Remove headers that should not be forwarded
    delete proxyHeaders.host;
    delete proxyHeaders.connection;
    delete proxyHeaders['keep-alive'];
    delete proxyHeaders['content-length'];
    
    // Set the host header to the target host
    proxyHeaders.host = targetURL.host;
    
    // Make the proxied request
    const proxyResponse = await axios({
      method: req.method,
      url: targetURL.href,
      headers: proxyHeaders,
      data: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
      responseType: 'stream',
      validateStatus: () => true, // Accept all status codes
      maxRedirects: 5,
    });
    
    // Set response headers
    res.status(proxyResponse.status);
    
    // Copy response headers
    Object.keys(proxyResponse.headers).forEach(key => {
      res.setHeader(key, proxyResponse.headers[key]);
    });
    
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    
    // Add proxy information headers
    res.setHeader('X-Proxied-By', 'Render-Serverless-Proxy');
    res.setHeader('X-Target-URL', targetURL.href);
    
    // Pipe the response
    proxyResponse.data.pipe(res);
    
  } catch (error) {
    console.error('Proxy error:', error.message);
    
    res.status(502).json({
      error: 'Proxy Error',
      message: error.message || 'Failed to proxy request',
      target: targetURL.href,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log('🚀 Proxy server is running on port ' + PORT);
  console.log('📡 Ready to proxy requests!');
});
