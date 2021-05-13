import Vue from "vue";
import { mount, createLocalVue } from "@vue/test-utils";
import EmailInvitation from "@/views/EmailInvitation.vue";
import ElementUI from "element-ui";
import mockAxios from "../__mocks__/axios";

const localVue = createLocalVue();
localVue.use(ElementUI);

describe("EmailInvitation.vue", () => {
  const wrapper = mount(EmailInvitation, {
    localVue,
  });
  it("open dialog", () => {
    wrapper.find("#requestBtn").trigger("click");
    expect((wrapper.vm as any).isVisible).toBe(true);
  });
  it("send request", async () => {
    wrapper.setData({
      invitationFormData: {
        fullName: `test`,
        email: `usedemail@airwallex.com`,
        confirmedEmail: `usedemail@airwallex.com`,
      },
    });
    wrapper.find("#sendBtn").trigger("click");
    expect((wrapper.vm as any).isSendingRequest).toBe(false);
    expect((wrapper.vm as any).response.type).toBe("failed");

    wrapper.setData({
      invitationFormData: {
        fullName: `test`,
        email: `usedemail@airwall3ex.com`,
        confirmedEmail: `usedemail@airwall3ex.com`,
      },
    });
    mockAxios.post.mockImplementationOnce(() => {
      return Promise.resolve({
        data: {
          status: 200,
          data: "ok",
        },
      });
    });
    wrapper.find("#sendBtn").trigger("click");
    Vue.nextTick(() => {
      expect((wrapper.vm as any).response.type).toBe("");
    });
  });
});
