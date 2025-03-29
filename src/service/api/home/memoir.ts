import BaseApi from "../shared";
import { MemoirDeleteRes, MemoirResData, MemoirResListData } from "./data";

export class MemoirApi extends BaseApi {
  urls = {
    memoirList: "/memoir/list",
    memoir: "/memoir"
  }
  tag = "MemoirApi"

  async getMemoirList() {
    const responseData = await this.http.get<MemoirResListData>(this.urls.memoirList)
    console.log(responseData)
    return responseData.data
  }

  async getMemoirDetail(id: number) {
    const responseData = await this.http.get<MemoirResData>(`${this.urls.memoir}/${id}`)
    return responseData.data
  }

  async deleteResponseData(id: number): Promise<MemoirDeleteRes> {
    const responseData = await this.http.delete<MemoirDeleteRes>(`${this.urls.memoir}/${id}`)
    return responseData.data
  }
}