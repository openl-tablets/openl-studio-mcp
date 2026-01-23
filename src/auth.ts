/**
 * Authentication module for OpenL Tablets MCP Server
 *
 * Supports multiple authentication methods:
 * - Basic Authentication (username/password)
 * - Personal Access Token (PAT)
 */

import { createHash } from "node:crypto";
import { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import type * as Types from "./types.js";
import { HEADERS } from "./constants.js";
import { hashFingerprint, extractApiErrorInfo, sanitizeJson } from "./utils.js";

/**
 * Check if debug logging is enabled (via environment variable)
 */
const DEBUG_AUTH = process.env.DEBUG_AUTH === "true" || process.env.DEBUG === "true";

/**
 * Safely log auth header information without exposing tokens
 * @param authHeader - Full auth header value
 * @returns Safe representation of auth header (scheme only or redacted)
 */
function safeAuthHeaderLog(authHeader: string | undefined): string {
  if (!authHeader || authHeader === "none") {
    return "none";
  }

  // Extract scheme (Bearer, Basic, etc.)
  const schemeMatch = authHeader.match(/^(\w+)\s+/);
  if (schemeMatch) {
    const scheme = schemeMatch[1];
    if (DEBUG_AUTH) {
      // In debug mode, log a hash fingerprint instead of actual token
      const hash = createHash("sha256").update(authHeader).digest("hex").substring(0, 8);
      return `${scheme} [${hash}...]`;
    }
    return `${scheme} [redacted]`;
  }

  // If no scheme found, return redacted
  return "[redacted]";
}

/**
 * Authentication manager for OpenL Tablets API
 *
 * Handles:
 * - Token lifecycle management
 * - Automatic token refresh
 * - Request/response interceptors
 * - Multiple authentication methods
 */
export class AuthenticationManager {
  private config: Types.OpenLConfig;
  private configuredInstances: WeakSet<AxiosInstance> = new WeakSet();

  constructor(config: Types.OpenLConfig) {
    this.config = config;
  }

  /**
   * Configure authentication interceptors for an Axios instance
   *
   * @param axiosInstance - The Axios instance to configure
   */
  public setupInterceptors(axiosInstance: AxiosInstance): void {
    // Prevent duplicate interceptor registration for the same instance
    if (this.configuredInstances.has(axiosInstance)) {
      return;
    }
    this.configuredInstances.add(axiosInstance);
    
    // Clear any existing interceptors to prevent duplication
    // Note: We check configuredInstances first to avoid clearing interceptors from other managers
    axiosInstance.interceptors.request.clear();
    axiosInstance.interceptors.response.clear();
    
    // Request interceptor: Add authentication headers
    axiosInstance.interceptors.request.use(
      async (config) => {
        // Early return if this config has already been processed
        // This prevents duplicate processing if interceptor is called multiple times
        if ((config as any)._authHeadersAdded) {
          return config;
        }
        
        const authConfig = await this.addAuthHeaders(config);
        
        // Log request to OpenL API (compact format) - only once per request
        // Use a flag to prevent duplicate logging if interceptor is called multiple times
        if (!(authConfig as any)._logged) {
          const fullUrl = `${authConfig.baseURL || ''}${authConfig.url || ''}`;
          const method = authConfig.method?.toUpperCase() || 'UNKNOWN';
          console.error(`[OpenL API] ${method} ${fullUrl}`);
          
          // Mark as logged to prevent duplicate logging
          (authConfig as any)._logged = true;
          
          // Additional details only in debug mode
          if (DEBUG_AUTH) {
            const authHeader = (authConfig.headers && authConfig.headers[HEADERS.AUTHORIZATION]) || undefined;
            console.error(`[Auth] Auth: ${authHeader ? safeAuthHeaderLog(authHeader as string) : 'none'}`);
          }
        }
        
        return authConfig;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: Handle 401 errors with token refresh
    axiosInstance.interceptors.response.use(
      (response) => {
        // Log successful responses (compact format) - only once per response
        // Use a flag to prevent duplicate logging if interceptor is called multiple times
        if (response.config && !(response.config as any)._responseLogged) {
          const fullUrl = `${response.config.baseURL || ''}${response.config.url || ''}`;
          const method = response.config.method?.toUpperCase() || 'UNKNOWN';
          console.error(`[OpenL API] ${method} ${fullUrl} - ${response.status} OK`);
          // Mark as logged to prevent duplicate logging
          (response.config as any)._responseLogged = true;
        }
        return response;
      },
      async (error) => {
        // Original request config available if needed for debugging
        void error.config;

        // Enhanced 401 error handling with API error extraction
        if (error.response && error.response.status === 401) {
          const fullUrl = `${(error.config && error.config.baseURL) || ''}${(error.config && error.config.url) || ''}`;
          const authMethod = this.getAuthMethod();
          const authHeader = error.config?.headers?.[HEADERS.AUTHORIZATION] as string | undefined;
          const responseData = error.response.data;
          
          // Extract API error information if available
          const apiErrorInfo = extractApiErrorInfo(responseData, 401);
          
          console.error(`[Auth] ========================================`);
          console.error(`[Auth] ❌ 401 Unauthorized Error:`);
          console.error(`[Auth]   Method: ${error.config && error.config.method ? error.config.method.toUpperCase() : 'UNKNOWN'}`);
          console.error(`[Auth]   URL: ${fullUrl}`);
          console.error(`[Auth]   Auth method: ${authMethod}`);
          console.error(`[Auth]   Authorization header sent: ${authHeader ? safeAuthHeaderLog(authHeader as string) : 'NOT SET'}`);
          if (authHeader && DEBUG_AUTH) {
            const headerStr = authHeader as string;
            // Never log actual token content, even in debug mode - only log format validation
            console.error(`[Auth]   Header format check: ${headerStr.startsWith('Token ') ? 'Token ✓' : headerStr.startsWith('Bearer ') ? 'Bearer ✓' : 'UNKNOWN FORMAT'}`);
            console.error(`[Auth]   Header length: ${headerStr.length} characters`);
          }
          console.error(`[Auth]   Response status: ${error.response.status}`);
          
          // Log structured error information if available
          if (apiErrorInfo.code || apiErrorInfo.message) {
            console.error(`[Auth]   API Error Code: ${apiErrorInfo.code || 'N/A'}`);
            console.error(`[Auth]   API Error Message: ${apiErrorInfo.message || 'N/A'}`);
          }
          if (apiErrorInfo.rawResponse) {
            // Log raw response if structure doesn't match expected format (sanitized to prevent sensitive data exposure)
            const sanitized = sanitizeJson(apiErrorInfo.rawResponse);
            console.error(`[Auth]   Response data: ${JSON.stringify(sanitized).substring(0, 300)}`);
          } else {
            // Sanitize response data before logging to prevent sensitive data exposure
            const sanitized = sanitizeJson(responseData || {});
            console.error(`[Auth]   Response data: ${JSON.stringify(sanitized).substring(0, 300)}`);
          }
          
          // Provide helpful suggestions based on auth method
          if (authMethod === "Personal Access Token") {
            console.error(`[Auth]   💡 Troubleshooting:`);
            console.error(`[Auth]      - Verify PAT is valid and not expired`);
            console.error(`[Auth]      - Check PAT format: should start with 'openl_pat_'`);
            console.error(`[Auth]      - Ensure PAT has required permissions`);
          } else if (authMethod === "Basic Auth" || authMethod === "Incomplete Basic Auth") {
            console.error(`[Auth]   💡 Troubleshooting:`);
            console.error(`[Auth]      - Verify username and password are correct`);
            console.error(`[Auth]      - Check if account is locked or disabled`);
            console.error(`[Auth]      - Ensure user has required permissions`);
            if (authMethod === "Incomplete Basic Auth") {
              console.error(`[Auth]      - Both OPENL_USERNAME and OPENL_PASSWORD must be set`);
            }
          } else {
            console.error(`[Auth]   💡 Troubleshooting:`);
            console.error(`[Auth]      - Configure authentication: set OPENL_USERNAME/OPENL_PASSWORD or OPENL_PERSONAL_ACCESS_TOKEN`);
          }
          
          console.error(`[Auth] ========================================`);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Add authentication headers to a request
   *
   * @param config - Axios request configuration
   * @returns Modified request configuration with auth headers
   */
  private async addAuthHeaders(
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> {
    // Check if this config has already been processed (to avoid duplicate logging)
    // Use a flag in the config object itself to track processing
    if ((config as any)._authHeadersAdded) {
      return config;
    }
    
    if (!config.headers) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      config.headers = {} as any;
    }

    // Add Client Document ID if configured
    if (this.config.clientDocumentId) {
      config.headers[HEADERS.CLIENT_DOCUMENT_ID] = this.config.clientDocumentId;
    }

    // Check if auth headers are already set (to avoid duplicate logging)
    const authHeaderAlreadySet = config.headers[HEADERS.AUTHORIZATION];

    // Add authentication based on method priority:
    // 1. Personal Access Token
    // 2. Basic Auth
    if (this.config.personalAccessToken) {
      // Build authorization header
      const pat = this.config.personalAccessToken;
      const authHeaderValue = `Token ${pat}`;
      config.headers[HEADERS.AUTHORIZATION] = authHeaderValue;
      
      // Log only if auth header was not already set (to avoid duplicate logging)
      if (!authHeaderAlreadySet) {
        console.error(`[Auth] ========================================`);
        console.error(`[Auth] 🔐 Personal Access Token Authentication`);
        console.error(`[Auth] ========================================`);
        
        // Validate PAT format
        const isValidFormat = pat.startsWith('openl_pat_');
        
        console.error(`[Auth] PAT Configuration:`);
        console.error(`[Auth]   - PAT present: ${!!pat}`);
        console.error(`[Auth]   - PAT length: ${pat?.length || 0} characters`);
        console.error(`[Auth]   - PAT format valid: ${isValidFormat ? '✓' : '✗'}`);
        // Never log actual PAT content - only log hash fingerprint in debug mode
        if (DEBUG_AUTH && pat) {
          console.error(`[Auth]   - PAT fingerprint: ${hashFingerprint(pat)} (debug only)`);
        }
        
        if (!isValidFormat) {
          console.error(`[Auth]   ⚠️  WARNING: PAT should start with 'openl_pat_'`);
        }
        
        console.error(`[Auth] Authorization Header:`);
        console.error(`[Auth]   - Header name: ${HEADERS.AUTHORIZATION}`);
        console.error(`[Auth]   - Header value format: Token <PAT>`);
        console.error(`[Auth]   - Header value (safe): ${safeAuthHeaderLog(authHeaderValue)}`);
        console.error(`[Auth]   - Header set in config: ${!!config.headers[HEADERS.AUTHORIZATION]}`);
        
        // Verify header was set correctly
        const actualHeader = config.headers[HEADERS.AUTHORIZATION];
        const headerStartsWithToken = typeof actualHeader === 'string' && actualHeader.startsWith('Token ');
        console.error(`[Auth]   - Header verification: ${headerStartsWithToken ? '✓ Correct format' : '✗ Wrong format'}`);
        
        // Log header metadata in debug mode (never actual token content)
        if (DEBUG_AUTH) {
          console.error(`[Auth]   - Header length: ${authHeaderValue.length} characters`);
          console.error(`[Auth]   - Header format: ${authHeaderValue.startsWith('Token ') ? 'Token ✓' : 'Unknown'}`);
        }
        
        console.error(`[Auth] ========================================`);
      }
    } else if (this.config.username && this.config.password) {
      // Never log password, only username
      const auth = Buffer.from(
        `${this.config.username}:${this.config.password}`
      ).toString("base64");
      config.headers[HEADERS.AUTHORIZATION] = `Basic ${auth}`;
      // Single log message with all auth info (only if not already set)
      if (!authHeaderAlreadySet) {
        console.error(`[Auth] Using Basic Auth: username=${this.config.username}, password=${this.config.password ? '***' : 'missing'}, header=${safeAuthHeaderLog(`Basic ${auth}`)}`);
      }
    } else {
      // Log only if auth header was not already set (to avoid duplicate logging)
      if (!authHeaderAlreadySet) {
        console.error(`[Auth] ⚠️  No authentication method configured!`);
        console.error(`[Auth]   personalAccessToken: ${!!this.config.personalAccessToken ? 'configured' : 'not configured'}`);
        console.error(`[Auth]   username: ${this.config.username || 'not set'}`);
        console.error(`[Auth]   password: ${this.config.password ? 'set' : 'not set'}`);
      }
    }

    // Mark this config as processed to prevent duplicate processing
    (config as any)._authHeadersAdded = true;

    return config;
  }

  /**
   * Get the current authentication method being used
   *
   * @returns Human-readable authentication method name
   */
  public getAuthMethod(): string {
    if (this.config.personalAccessToken) {
      return "Personal Access Token";
    } else if (this.config.username && this.config.password) {
      return "Basic Auth";
    } else if (this.config.username || this.config.password) {
      return "Incomplete Basic Auth";
    } else {
      return "No Auth";
    }
  }
}
