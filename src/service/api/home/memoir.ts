import HomeBaseApi from "./BaseApi";
import { MemoirDeleteRes, MemoirResData, MemoirResListData } from "./data";

export class memoirApi extends HomeBaseApi {
  urls = {
    memoir: "/memoirs"
  }
  tag = "MemoirApi"

  async getMemoirList() {
    const responseData = await this.http.get<MemoirResListData>(this.urls.memoir)
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