// src/authService.js

import { UserManager } from 'oidc-client-ts';
import { authConfig } from './authConfig';


export const userManager = new UserManager(authConfig);

export function removeUser() {
  return userManager.removeUser();
}

export function revokeTokens() {
  return userManager.revokeTokens();
}

export function signinRedirect() {
  return userManager.signinRedirect();
}

export function signinRedirectCallback() {
  return userManager.signinRedirectCallback();
}

export function signoutRedirect() {
  return userManager.signoutRedirect();
}

export function getUser() {
  return userManager.getUser();
}

export function signinSilent() {
  return userManager.signinSilent();
}

export function clearStaleState() {
  return userManager.clearStaleState();
}