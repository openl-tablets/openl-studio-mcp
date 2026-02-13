/**
 * Unit tests for auth.ts
 * Tests authentication methods and token management
 */

import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import axios, { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";
import { AuthenticationManager } from "../src/auth.js";
import type { OpenLConfig } from "../src/types.js";

describe("AuthenticationManager", () => {
  let mockAxios: MockAdapter;
  let axiosInstance: AxiosInstance;

  beforeEach(() => {
    axiosInstance = axios.create();
    mockAxios = new MockAdapter(axiosInstance);
  });

  afterEach(() => {
    mockAxios.reset();
    mockAxios.restore();
  });

  describe("Basic Authentication", () => {
    it("should add Basic auth header when username/password provided", async () => {
      const config: OpenLConfig = {
        baseUrl: "http://localhost:8080",
        username: "admin",
        password: "admin",
      };

      const auth = new AuthenticationManager(config);
      auth.setupInterceptors(axiosInstance);

      mockAxios.onGet("/test").reply(200, { success: true });

      const response = await axiosInstance.get("/test");

      expect(response.config.headers?.Authorization).toMatch(/^Basic /);
    });

    it("should encode credentials correctly", async () => {
      const config: OpenLConfig = {
        baseUrl: "http://localhost:8080",
        username: "testuser",
        password: "testpass123",
      };

      const auth = new AuthenticationManager(config);
      auth.setupInterceptors(axiosInstance);

      mockAxios.onGet("/test").reply((config) => {
        const authHeader = config.headers?.Authorization as string;
        const expectedToken = Buffer.from("testuser:testpass123").toString("base64");
        expect(authHeader).toBe(`Basic ${expectedToken}`);
        return [200, {}];
      });

      await axiosInstance.get("/test");
    });

    it("should handle special characters in password", async () => {
      const config: OpenLConfig = {
        baseUrl: "http://localhost:8080",
        username: "admin",
        password: "p@ssw0rd!#$%",
      };

      const auth = new AuthenticationManager(config);
      auth.setupInterceptors(axiosInstance);

      mockAxios.onGet("/test").reply((config) => {
        const authHeader = config.headers?.Authorization as string;
        expect(authHeader).toMatch(/^Basic /);
        expect(authHeader.length).toBeGreaterThan(10);
        return [200, {}];
      });

      await axiosInstance.get("/test");
    });
  });


  describe("Error Handling", () => {
    it("should handle network errors", async () => {
      const config: OpenLConfig = {
        baseUrl: "http://localhost:8080",
        username: "admin",
        password: "admin",
      };

      const auth = new AuthenticationManager(config);
      auth.setupInterceptors(axiosInstance);

      mockAxios.onGet("/test").networkError();

      await expect(axiosInstance.get("/test")).rejects.toThrow();
    });
  });

  describe("No Authentication", () => {
    it("should work without any auth configuration", async () => {
      const config: OpenLConfig = {
        baseUrl: "http://localhost:8080",
      };

      const auth = new AuthenticationManager(config);
      auth.setupInterceptors(axiosInstance);

      mockAxios.onGet("/test").reply((config) => {
        expect(config.headers?.Authorization).toBeUndefined();
        return [200, { success: true }];
      });

      const response = await axiosInstance.get("/test");
      expect(response.data.success).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty username/password", async () => {
      const config: OpenLConfig = {
        baseUrl: "http://localhost:8080",
        username: "",
        password: "",
      };

      const auth = new AuthenticationManager(config);
      auth.setupInterceptors(axiosInstance);

      // Empty strings are falsy, so Basic Auth won't be added
      // This is expected behavior - empty credentials are treated as no auth
      mockAxios.onGet("/test").reply((config) => {
        const authHeader = config.headers?.Authorization;
        expect(authHeader).toBeUndefined();
        return [200, {}];
      });

      await axiosInstance.get("/test");
    });

  });
});
