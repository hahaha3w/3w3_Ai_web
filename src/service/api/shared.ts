import { AxiosInstance } from "axios";
import { http } from "../utils/axios";
import { camelToSnake, snakeToCamel } from "@/service/utils/snakeCaseHelper";


export default abstract class BaseApi {
  protected http: AxiosInstance = http
  constructor() {
    //http驼峰式命名转换， post camel To snake
    this.http.defaults.transformRequest = [(data: Record<string, string>) => {
      const snakeData: Record<string, string> = camelToSnake(data)
      return JSON.stringify(snakeData)
    }]

    this.http.defaults.transformResponse = [(data: Record<string, string>) => {
      const camelData: Record<string, string> = snakeToCamel(data)
      return camelData
    }]
  }
  abstract urls: {[key: string]: string}
  abstract tag: string //后续Log用
}

export interface ApiRes<T = any> {
  code: number;
  data: T;
  msg: string;
  [property: string]: any;
}