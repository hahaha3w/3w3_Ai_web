export interface SendCodeReq {
  email: string;
}

export interface RegisterReq {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

export interface LoginReq {
  email: string;
  password: string;
}

export interface ChangePasswordReq {
  oldPassword: string;
  newPassword: string;
}

export interface DeleteAccountReq {
  password: string;
}

export interface LoginResData {
  avatar: string;
  bio: string;
  chatCount: number;
  email: string;
  memoirCount: number;
  theme: string;
  token: string;
  useDay: number;
  userId: number;
  username: string;
  [property: string]: any;
}


export interface RegisterResData {
  avatar: string;
  bio: string;
  email: string;
  theme: string;
  token: string;
  useDay: number;
  userId: number;
  username: string;
  [property: string]: any;
}

export interface SendCodeResData {
  message: string;
  success: boolean;
  [property: string]: any;
}

export interface ChangePasswordResData {
  message: string;
  success: boolean;
  [property: string]: any;
}

export interface DeleteAccountResData {
  message: string;
  success: boolean;
  [property: string]: any;
}

export interface UserInfoResData {
  avatar: string;
  bio: string;
  chatCount: number;
  email: string;
  memoirCount: number;
  theme: string;
  useDay: number;
  userId: number;
  username: string;
}