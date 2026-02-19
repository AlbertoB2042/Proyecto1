/**
 * CloudFront Function - Security Headers
 *
 * Esta función agrega security headers a todas las respuestas del sitio.
 *
 * INSTRUCCIONES DE USO:
 * 1. En AWS Console, ir a CloudFront → Functions
 * 2. Create function → Nombre: "security-headers"
 * 3. Copiar y pegar este código
 * 4. Publish
 * 5. Associate to distribution (Viewer Response)
 *
 * Ver DEPLOY_AWS.md Paso 4 para instrucciones detalladas
 */

function handler(event) {
  var response = event.response;
  var headers = response.headers;

  // Strict Transport Security (HSTS) - Fuerza HTTPS
  headers['strict-transport-security'] = {
    value: 'max-age=31536000; includeSubDomains; preload'
  };

  // Previene MIME type sniffing
  headers['x-content-type-options'] = {
    value: 'nosniff'
  };

  // Previene clickjacking
  headers['x-frame-options'] = {
    value: 'DENY'
  };

  // XSS Protection (legacy, pero aún útil)
  headers['x-xss-protection'] = {
    value: '1; mode=block'
  };

  // Controla información de referrer
  headers['referrer-policy'] = {
    value: 'strict-origin-when-cross-origin'
  };

  // Controla permisos de APIs del navegador
  headers['permissions-policy'] = {
    value: 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()'
  };

  // Content Security Policy (CSP)
  // IMPORTANTE: Ajustar según tus necesidades
  headers['content-security-policy'] = {
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://unpkg.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://formspree.io https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com",
      "frame-ancestors 'none'",  // Previene embedding
      "base-uri 'self'",
      "form-action 'self' https://formspree.io"  // Permite envío a Formspree (ajustar si usas Lambda)
    ].join('; ')
  };

  return response;
}

/**
 * NOTAS:
 *
 * - Si usas AWS Lambda para el formulario en lugar de Formspree:
 *   Cambiar "https://formspree.io" por tu API Gateway endpoint
 *   Ejemplo: "https://abc123.execute-api.us-east-1.amazonaws.com"
 *
 * - Si necesitas agregar más orígenes permitidos (ej: analytics):
 *   Agregar a connect-src: "connect-src 'self' https://formspree.io https://analytics.example.com"
 *
 * - CloudFront Functions tiene límite de 10KB de código
 *
 * - Para debugging, usar CloudWatch Logs:
 *   CloudFront → Functions → Tu función → Monitoring
 */
