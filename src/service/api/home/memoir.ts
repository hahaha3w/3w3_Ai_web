import { AxiosResponse } from "axios";
import BaseApi from "../shared";
import { MemoirData, MemoirDeleteRes, MemoirResData, MemoirResListData } from "./types";

class MemoirApi extends BaseApi {
  urls = {
    memoirList: "/memoir/list",
    memoir: "/memoir"
  }
  tag = "MemoirApi"

  async getMemoirList(pageParam: number, size: number) {
    const responseData = await this.http.get<MemoirResListData>(this.urls.memoirList + `?page=${pageParam}&page_size=${size}`)
    return responseData.data
  }

  async getMemoirDetail(id: number) {
    const responseData = await this.http.get<MemoirResData>(`${this.urls.memoir}/${id}`)
    return responseData.data
  }

  async deleteResponseData(id: number): Promise<AxiosResponse<MemoirDeleteRes>> {
    console.log("delete memoir data, id: ", id)
    const responseData = await this.http.delete<MemoirDeleteRes>(`${this.urls.memoir}/${id}`)
    return responseData
  }
}

export const memoirApi = new MemoirApi()