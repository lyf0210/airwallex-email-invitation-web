<template>
  <div class="invitation-container">
    <header>{{ headerBrand }}</header>
    <main class="main">
      <div class="first-tip">
        <div class="first-row">A better way</div>
        <div class="first-row">to enjoy every day.</div>
      </div>
      <div class="second-tip">Be the first to know when we launch.</div>
      <div class="request-btn">
        <el-button
          type="primary"
          style=""
          id="requestBtn"
          @click.native.prevent="doRequestAnInvite"
        >
          {{ label_RequestAnInvite }}
        </el-button>
      </div>
    </main>
    <footer>
      <div>Made with &hearts; with Melbourne.</div>
      <div>&copy; 2016 Broccoli & Co. All rights reserved.</div>
    </footer>
    <el-dialog
      :visible.sync="isVisible"
      :show-close="true"
      :close-on-click-modal="false"
      width="29%"
      top="50vh"
      center
    >
      <div class="modal-body">
        <div class="modal-title">
          {{ headerTitle }}
          <div class="line" />
        </div>
        <div class="modal-form">
          <transition name="slide-fade">
            <div v-if="response.type !== 'success'" key="form-1">
              <el-form
                ref="form"
                :model="invitationFormData"
                :rules="formRules"
                :disabled="isSendingRequest"
              >
                <el-form-item prop="fullName">
                  <el-input
                    ref="fullName"
                    placeholder="Full Name"
                    v-model="invitationFormData.fullName"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="email">
                  <el-input
                    ref="email"
                    placeholder="Email"
                    v-model="invitationFormData.email"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="confirmedEmail">
                  <el-input
                    ref="confirmedEmail"
                    placeholder="Confirm Email"
                    v-model="invitationFormData.confirmedEmail"
                  ></el-input>
                </el-form-item>
              </el-form>
              <el-button
                type="primary"
                style="width: 100%; margin: 16px 0"
                id="sendBtn"
                :loading="isSendingRequest"
                @click.native.prevent="doSendRequest"
              >
                {{ sendRequestButtonLabel }}
              </el-button>
              <div v-if="response.message" class="error-message">
                {{ response.message }}
              </div>
            </div>
            <div v-else key="form-2">
              <div class="success-message">
                {{ response.message }}
              </div>
              <el-button
                type="primary"
                style="width: 100%; margin: 40px 0 16px 0"
                @click.native.prevent="doConfirm"
              >
                {{ label_OK }}
              </el-button>
            </div>
          </transition>
        </div>
      </div>
      <div slot="footer" class="dialog-footer"></div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { isValidFullName, isValidEmail } from "@/utils/validate";
import { Form as ElForm } from "element-ui";
import { requestInvite } from "@/api/index";
@Component({
  name: "EmailInvitation",
  components: {},
})
export default class extends Vue {
  // data
  private headerBrand = `BROCCOLI & CO.`;
  private isVisible = false;
  private label_RequestAnInvite = `Request an invite`;
  private label_SendRequest = `Send`;
  private label_OK = `OK`;
  private isSendingRequest = false;
  private invitationFormData = {
    fullName: ``,
    email: ``,
    confirmedEmail: ``,
  };
  private response = {
    type: ``, // [success, failed]
    message: ``,
  };

  get headerTitle(): string {
    return this.response.type === "success" ? "All done!" : "Request an invite";
  }

  get sendRequestButtonLabel(): string {
    return this.isSendingRequest ? "Sending, please wait..." : "Send";
  }

  private validateFullName = (rule: any, value: string, callback: any) => {
    if (!value) {
      return callback(new Error(`Full name can't be blank.`));
    } else {
      if (!isValidFullName(value)) {
        return callback(
          new Error(`Full name needs to be at least 3 characters long.`)
        );
      }
    }
    return callback();
  };
  private validateEmail = (rule: any, value: string, callback: any) => {
    const { field } = rule;
    // require validation
    if (!value) {
      return callback(
        new Error(
          `${field === "email" ? "Email" : "Confirm email"} can't be blank.`
        )
      );
    } else {
      // format validation
      const isValidEmailFlag = isValidEmail(value);
      if (!isValidEmailFlag) {
        return callback(
          new Error(`Email needs to be in validation email format.`)
        );
      } else if (field === "confirmedEmail") {
        // make sure confirmedEmail is equal to email
        if (!this.isConfirmedEmailEqualtoEmail()) {
          return callback(new Error(`Email doesn't match.`));
        }
      }
      return callback();
    }
  };
  private formRules = {
    fullName: [{ validator: this.validateFullName, trigger: "blur" }],
    email: [{ validator: this.validateEmail, trigger: "blur" }],
    confirmedEmail: [{ validator: this.validateEmail, trigger: "blur" }],
  };
  // call request method
  private doRequestAnInvite() {
    // if need reset form before open dialog
    // if (this.$refs.form) {
    //   (this.$refs.form as ElForm).resetFields();
    // }
    this.isVisible = true;
  }
  // call send request method
  private async doSendRequest() {
    this.resetResponse();
    this.isSendingRequest = true;
    // validate full form
    (this.$refs.form as ElForm).validate(async (valid: boolean) => {
      if (valid) {
        try {
          // hardcode => specified error message
          if (
            this.invitationFormData.confirmedEmail === "usedemail@airwallex.com"
          ) {
            this.response = {
              type: "failed",
              message: "This email has been used.",
            };
          } else {
            const res = await requestInvite({
              name: this.invitationFormData.fullName,
              email: this.invitationFormData.confirmedEmail,
            });
            if (res.status && res.status === 200) {
              this.response = {
                type: "success",
                message:
                  "You will be one of the first to experience Broccoli & Co. when we lauch.",
              };
            }
          }
        } catch (e) {
          this.response = {
            type: "failed",
            message: e.message,
          };
        } finally {
          this.isSendingRequest = false;
        }
      } else {
        this.isSendingRequest = false;
      }
    });
  }
  private doConfirm() {
    this.isVisible = false;
    this.resetResponse();
    this.resetFormData();
  }
  private resetResponse() {
    this.response = {
      type: ``,
      message: ``,
    };
  }
  private resetFormData() {
    this.invitationFormData = {
      fullName: ``,
      email: ``,
      confirmedEmail: ``,
    };
  }
  private isConfirmedEmailEqualtoEmail() {
    return (
      this.invitationFormData.email === this.invitationFormData.confirmedEmail
    );
  }
}
</script>
<style lang="scss" scoped>
@mixin centerFlex() {
  display: flex;
  align-items: center;
  justify-content: center;
}
$grey: #767571;
$white: white;
$warningRed: #ef776e;
.invitation-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  background-image: url("../assets/home.jpg");
  header {
    height: 80px;
    display: flex;
    align-items: center;
    padding-left: 80px;
    color: $grey;
    font-weight: bold;
    background-color: #fff;
  }
  footer {
    font-style: oblique;
    font-size: 14px;
    color: $grey;
    height: 80px;
    @include centerFlex;
    flex-direction: column;
    background-color: #fff;
  }
  main {
    flex: 1;
    @include centerFlex;
    flex-direction: column;
    filter: drop-shadow(2px 4px 6px black);
    .first-tip {
      @include centerFlex;
      flex-direction: column;
      font-size: 48px;
      line-height: 1;
      color: $white;
    }
    .second-tip {
      margin: 20px 0;
      color: $white;
    }
    .request-btn {
      .el-button {
        color: #333;
        background-color: $white;
        border-color: $white;
        &:hover {
          background: #5c5c5c;
          border-color: #5c5c5c;
          color: #ffffff;
        }
      }
    }
  }
  .el-dialog__wrapper {
    ::v-deep .el-dialog {
      transform: translate(0, -50%);
      .el-dialog__body {
        padding: 0 24px;
      }
      .modal-body {
        .modal-title {
          font-style: oblique;
          font-weight: bold;
          color: $grey;
          margin-bottom: 32px;
          @include centerFlex;
          flex-direction: column;
          .line {
            width: 40px;
            height: 1px;
            border-top: solid $grey 1px;
            margin-top: 16px;
          }
        }
        .modal-form {
          .error-message {
            text-align: center;
            margin: 8px 0;
            color: $warningRed;
            font-style: oblique;
            font-weight: bold;
            font-size: 12px;
          }
          .success-message {
            word-break: break-word;
            text-align: center;
          }
        }
      }
    }
  }
}
@media only screen and (min-device-width: 320px) and (max-device-width: 568px) {
  .el-dialog__wrapper {
    ::v-deep .el-dialog {
      width: 250px !important;
    }
  }
}
@media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-device-pixel-ratio: 2) {
  .el-dialog__wrapper {
    ::v-deep .el-dialog {
      width: 300px !important;
    }
  }
}
@media only screen and (min-device-width: 414px) and (max-device-width: 736px) and (-webkit-device-pixel-ratio: 3) {
  .el-dialog__wrapper {
    ::v-deep .el-dialog {
      width: 300px !important;
    }
  }
}
@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-device-pixel-ratio: 3) {
  .el-dialog__wrapper {
    ::v-deep .el-dialog {
      width: 300px !important;
    }
  }
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
  .el-dialog__wrapper {
    ::v-deep .el-dialog {
      width: 400px !important;
    }
  }
}
@media only screen and (min-device-width: 1366px) and (max-device-width: 1024px) {
  .el-dialog__wrapper {
    ::v-deep .el-dialog {
      width: 400px !important;
    }
  }
}
</style>
