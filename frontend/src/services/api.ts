import axios from "axios";
import { BACKEND_API } from "../constant";
import { CreateTokenType, GenerateParamType } from "../types/generate";

export const generateContract = (data: GenerateParamType) => {
  return axios.post(`${BACKEND_API}/generate`, data);
};

export const createContract = (data: CreateTokenType) => {
  return axios.post(`${BACKEND_API}/create`, data);
};
export const getTokens = (creatorAddress: string) => {
  return axios.get(`${BACKEND_API}/get/${creatorAddress}`);
};
export const getCounts = () => {
  return axios.get(`${BACKEND_API}/get_count`);
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
