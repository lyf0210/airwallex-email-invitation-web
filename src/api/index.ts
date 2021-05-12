import request from "@/utils/request";

export interface IRequestBody {
  name: string;
  email: string;
}

export const requestInvite = (data: IRequestBody): any =>
  request({
    url: "/fake-auth",
    method: "post",
    data,
  });
