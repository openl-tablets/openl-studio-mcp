/**
 * Utility functions for the OpenL Tablets MCP Server
 */

import { createHash } from "crypto";
import { exec } from "child_process";
import { promisify } from "util";
import type { ExtractedErrorInfo } from "./types.js";

/**
 * Compute a SHA-256 hash fingerprint of a sensitive value for debugging
 * 
 * @param value - Sensitive value to hash
 * @returns Hex string of SHA-256 hash (first 16 characters for brevity)
 */
export function hashFingerprint(value: string): string {
  return createHash('sha256').update(value).digest('hex').substring(0, 16);
}

/**
 * Sanitize error messages to prevent sensitive data exposure
 *
 * @param error - Error object to sanitize
 * @returns Sanitized error message
 */
export function sanitizeError(error: unknown): string {
  if (error instanceof Error) {
    // Remove potential sensitive patterns from error messages
    let message = error.message;

    // Redact potential tokens (Bearer tokens, API keys, PAT tokens)
    message = message.replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, "Bearer [REDACTED]");
    message = message.replace(/Token\s+[A-Za-z0-9\-._~+/]+=*/gi, "Token [REDACTED]");
    message = message.replace(/openl_pat_[A-Za-z0-9\-._~+/]+/gi, "openl_pat_[REDACTED]");
    message = message.replace(/api[_-]?key["\s:=]+[A-Za-z0-9\-._~+/]+/gi, "api_key=[REDACTED]");

    // Redact potential credentials in URLs
    message = message.replace(/(:\/\/)[^:@]+:[^@]+@/g, "$1[REDACTED]:[REDACTED]@");

    // Redact potential client secrets and authorization codes
    message = message.replace(/client[_-]?secret["\s:=]+[A-Za-z0-9\-._~+/]+/gi, "client_secret=[REDACTED]");
    message = message.replace(/authorization[_-]?code["\s:=]+[A-Za-z0-9\-._~+/]+/gi, "authorization_code=[REDACTED]");
    message = message.replace(/refresh[_-]?token["\s:=]+[A-Za-z0-9\-._~+/]+/gi, "refresh_token=[REDACTED]");
    message = message.replace(/code[_-]?verifier["\s:=]+[A-Za-z0-9\-._~+/]+/gi, "code_verifier=[REDACTED]");

    return message;
  }

  return "Unknown error";
}

/**
 * Type guard to check if an error is an Axios error
 *
 * @param error - Error to check
 * @returns True if error is an Axios error
 */
export function isAxiosError(error: unknown): error is import("axios").AxiosError {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as { isAxiosError?: boolean }).isAxiosError === true
  );
}

/**
 * Validate timeout value
 *
 * @param timeout - Timeout value to validate
 * @param defaultTimeout - Default timeout to use if invalid
 * @returns Valid timeout value
 */
export function validateTimeout(timeout: number | undefined, defaultTimeout: number): number {
  if (timeout === undefined) {
    return defaultTimeout;
  }

  if (typeof timeout !== "number" || isNaN(timeout) || timeout <= 0) {
    return defaultTimeout;
  }

  // Cap at 10 minutes
  const MAX_TIMEOUT = 600000;
  return Math.min(timeout, MAX_TIMEOUT);
}

/**
 * Safe JSON stringify that handles circular references
 *
 * @param obj - Object to stringify
 * @param space - Number of spaces for indentation
 * @returns JSON string
 */
export function safeStringify(obj: unknown, space?: number): string {
  const seen = new WeakSet();

  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return "[Circular]";
        }
        seen.add(value);
      }
      return value;
    },
    space
  );
}

/**
 * Extract error details for logging without exposing sensitive data
 *
 * @param error - Error to extract details from
 * @returns Safe error details object
 */
export function extractErrorDetails(error: unknown): {
  type: string;
  message: string;
  code?: string;
  status?: number;
} {
  if (isAxiosError(error)) {
    return {
      type: "AxiosError",
      message: sanitizeError(error),
      code: error.code,
      status: error.response && error.response.status,
    };
  }

  if (error instanceof Error) {
    return {
      type: error.constructor.name,
      message: sanitizeError(error),
    };
  }

  return {
    type: "Unknown",
    message: "An unknown error occurred",
  };
}

/**
 * Extract structured error information from API response data
 *
 * Handles different error response formats:
 * - 400: {code, errors[], fields[], message}
 * - 401-500: {code, message}
 * - Unknown formats: returns raw response
 *
 * @param responseData - Response data from axios error
 * @param status - HTTP status code
 * @returns Extracted error information
 */
export function extractApiErrorInfo(
  responseData: unknown,
  status?: number
): ExtractedErrorInfo {
  if (!responseData || typeof responseData !== "object") {
    return {
      rawResponse: responseData,
    };
  }

  const data = responseData as Record<string, unknown>;

  // Handle 400 Bad Request format
  if (status === 400) {
    const result: ExtractedErrorInfo = {};

    if (typeof data.code === "string") {
      result.code = data.code;
    }
    if (typeof data.message === "string") {
      result.message = data.message;
    }

    // Extract errors array if present
    if (Array.isArray(data.errors)) {
      result.errors = data.errors
        .filter((err): err is Record<string, unknown> => typeof err === "object" && err !== null)
        .map((err) => ({
          code: typeof err.code === "string" ? err.code : undefined,
          message: typeof err.message === "string" ? err.message : undefined,
        }));
    }

    // Extract fields array if present
    if (Array.isArray(data.fields)) {
      result.fields = data.fields
        .filter((field): field is Record<string, unknown> => typeof field === "object" && field !== null)
        .map((field) => ({
          code: typeof field.code === "string" ? field.code : undefined,
          field: typeof field.field === "string" ? field.field : undefined,
          message: typeof field.message === "string" ? field.message : undefined,
          rejectedValue: field.rejectedValue,
        }));
    }

    // If we extracted at least some structured data, return it
    if (result.code || result.message || result.errors || result.fields) {
      return result;
    }
  }

  // Handle 401-500 format (or any other status)
  if (status && status >= 401 && status <= 500) {
    const result: ExtractedErrorInfo = {};

    if (typeof data.code === "string") {
      result.code = data.code;
    }
    if (typeof data.message === "string") {
      result.message = data.message;
    }

    // If we extracted structured data, return it
    if (result.code || result.message) {
      return result;
    }
  }

  // Unknown format - return raw response
  return {
    rawResponse: responseData,
  };
}

/**
 * Parse project ID from OpenL API response
 *
 * OpenL Tablets API 6.0.0+ returns project IDs as base64-encoded strings in the format:
 * "repository:projectName" (e.g., "design:Example 1 - Bank Rating")
 *
 * Older versions may return project IDs as objects with {repository, projectName} structure.
 *
 * This function handles both formats and returns a consistent structure.
 *
 * @param id - Project ID from API (string or object)
 * @returns Parsed project ID with repository and projectName
 * @throws Error if the ID format is invalid
 */
export function parseProjectId(id: string | { repository: string; projectName: string }): {
  repository: string;
  projectName: string;
} {
  // Handle object format (older API versions or test mocks)
  if (typeof id === "object" && id !== null && "repository" in id && "projectName" in id) {
    return {
      repository: id.repository,
      projectName: id.projectName,
    };
  }

  // Handle string format (OpenL Tablets 6.0.0+)
  if (typeof id === "string") {
    try {
      // Decode base64
      const decoded = Buffer.from(id, "base64").toString("utf-8");

      // Parse "repository:projectName:hashCode" format
      const parts = decoded.split(":");
      if (parts.length === 3) {
        // Format: repository:projectName:hashCode
        const repository = parts[0];
        const projectName = parts[1];
        const hashCode = parts[2];

        if (!repository || !projectName || !hashCode) {
          throw new Error(`Invalid project ID format: empty repository, projectName, or hashCode in "${decoded}"`);
        }

        return { repository, projectName };
      } else if (parts.length === 2) {
        // Fallback: support old format "repository:projectName" for backward compatibility
        const repository = parts[0];
        const projectName = parts[1];

        if (!repository || !projectName) {
          throw new Error(`Invalid project ID format: empty repository or project name in "${decoded}"`);
        }

        return { repository, projectName };
      } else {
        throw new Error(`Invalid project ID format: expected "repository:projectName:hashCode" or "repository:projectName", got "${decoded}"`);
      }
    } catch (error) {
      // If base64 decode fails, it might be a plain string already
      // Try parsing as "repository:projectName" or "repository:projectName:hashCode" format
      const colonIndex = id.indexOf(":");
      if (colonIndex > 0 && colonIndex < id.length - 1) {
        const repository = id.substring(0, colonIndex);
        // Take everything after first colon as projectName
        // This handles cases like "repository:projectName", "repository:projectName:hashCode", 
        // or "repository:Project:With:Colons" (all colons after first are part of projectName)
        const projectName = id.substring(colonIndex + 1);

        if (repository && projectName) {
          return { repository, projectName };
        }
      }

      throw new Error(
        `Invalid project ID format: "${id}". Expected base64-encoded "repository:projectName:hashCode" or object {repository, projectName}`
      );
    }
  }

  throw new Error(
    `Invalid project ID type: ${typeof id}. Expected string or object with {repository, projectName}`
  );
}

/**
 * Create a user-friendly project ID string from repository and project name
 *
 * Format: "repository-projectName" (e.g., "design-Example 1 - Bank Rating")
 * This format is for backward compatibility. The default format is base64-encoded.
 * Note: This function creates a legacy format - prefer using base64 format from API responses.
 *
 * @param repository - Repository name
 * @param projectName - Project name
 * @returns User-friendly project ID string (legacy format, not base64)
 */
export function createProjectId(repository: string, projectName: string): string {
  return `${repository}-${projectName}`;
}


/**
 * Open URL in default browser (cross-platform)
 * Works on macOS, Linux, and Windows
 *
 * @param url - URL to open
 * @returns Promise that resolves when browser is opened
 */
export async function openBrowser(url: string): Promise<void> {
  const execAsync = promisify(exec);

  const platform = process.platform;
  let command: string;

  if (platform === "darwin") {
    // macOS
    command = `open "${url}"`;
  } else if (platform === "linux") {
    // Linux - try xdg-open first, then gnome-open
    command = `xdg-open "${url}" 2>/dev/null || gnome-open "${url}" 2>/dev/null || echo "Browser not available"`;
  } else if (platform === "win32") {
    // Windows
    command = `start "" "${url}"`;
  } else {
    console.error(`[Browser] Platform ${platform} not supported for automatic browser opening`);
    return;
  }

  try {
    await execAsync(command);
    console.error(`[Browser] ✅ Opened browser with URL: ${url.substring(0, 80)}...`);
  } catch (error) {
    // Silently fail - browser opening is optional
    console.error(`[Browser] ⚠️  Could not automatically open browser. Please open manually: ${url}`);
  }
}

