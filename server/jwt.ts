import jwt from "jsonwebtoken";
import { User } from "@shared/schema";

// Secret key for JWT signing and verification
// In a production environment, this should be stored in an environment variable
const JWT_SECRET = process.env.JWT_SECRET || "buildclub-jwt-secret-key";
// Ensure JWT_SECRET is always a string
const SECRET_KEY: string = JWT_SECRET as string;
const TOKEN_EXPIRATION = "7d"; // Token expires in 7 days

export interface JwtPayload {
  userId: string;
  username: string;
  email?: string;
  role: "admin" | "ambassador" | "member";
}

/**
 * Generate a JWT token for the given user
 */
export function generateToken(user: User): string {
  const payload: JwtPayload = {
    userId: user.id,
    username: user.username,
    email: user.email ?? undefined,
    role: user.role ?? "member",
  };

  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: TOKEN_EXPIRATION,
  });
}

/**
 * Verify a JWT token and return the decoded payload
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error("Error verifying JWT token:", error);
    return null;
  }
}

/**
 * Extract the JWT token from the request headers or cookies
 */
export function extractTokenFromRequest(req: any): string | null {
  // Check for token in Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Check for token in cookies
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  return null;
}
