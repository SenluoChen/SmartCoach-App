export interface User {
  email: string;
  birthdate: string;
  firstName: string;
  lastName: string;
  country: string;
  licenseNumber: string;
  imageUrl: string;
}

export interface PostUser {
  email: string;
  birthdate: string;
  firstName: string;
  lastName: string;
  country: string;
  licenseNumber: string;
  filename: string;
}

export interface PutUser {
  email: string;
  birthdate: string;
  firstName: string;
  lastName: string;
  country: string;
  licenseNumber: string;
  filename: string;
}

export interface PostUserResponse {
  message: string;
  uploadUrl: string;
}

export interface PutUserResponse {
  message: string;
  uploadUrl?: string;
}
