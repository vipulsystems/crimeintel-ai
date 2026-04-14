import * as authService from "./auth.service.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";

// REGISTER
export const registerUser = asyncHandler(async (req, res) => {
  const data = await authService.registerUser(req.body);
  res.json(data);
});

// LOGIN
export const loginUser = asyncHandler(async (req, res) => {
  const data = await authService.loginUser(req);
  res.json(data);
});

// GET ME
export const getMe = asyncHandler(async (req, res) => {
  const data = await authService.getMe(req.user.id);
  res.json(data);
});

// UPDATE USER
export const updateUser = asyncHandler(async (req, res) => {
  const data = await authService.updateUser(req.user.id, req.body);
  res.json(data);
});