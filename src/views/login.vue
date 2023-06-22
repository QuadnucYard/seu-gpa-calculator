<template>
  <q-card class="q-pa-md absolute-center" style="width: 300px; margin: auto">
    <q-card-section>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-input
          filled
          v-model="form.username"
          label="一卡通号"
          mask="#########"
          :rules="usernameRules"
        />
        <q-input
          filled
          v-model="form.password"
          label="密码"
          type="password"
          hint="我们承诺不会泄露账号信息"
          :rules="passwordRules"
        />
        <div>
          <q-btn label="登录" type="submit" color="primary" />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { login, visit } from "@/api/login";
import { useQuasar } from "quasar";
import { reactive } from "vue";
import { encryptAES } from "@/utils/ids-encrypt";

const $router = useRouter();
const $store = useStore();
const $q = useQuasar();

const form = reactive({ username: "", password: "" });

const usernameRules = [(val: string) => val?.length > 0 || "请输入一卡通号"];
const passwordRules = [(val: string) => val?.length > 0 || "请输入密码d"];

async function onSubmit() {
  $q.notify({ type: "info", message: "提交登录信息" });
  const { access_token, token_type, encrypt_salt } = await visit(form.username);
  console.log("encrypt", form.password, encrypt_salt);
  const token = `${token_type} ${access_token}`;
  $store.commit("login", { token });
  const userData = await login(form.username, encryptAES(form.password, encrypt_salt));
  if (!userData) {
    $q.notify({ type: "negative", message: "认证失败" });
    return;
  }
  $store.commit("login", { token, data: userData });
  $q.notify({
    // color: "green-4",
    // textColor: "white",
    // icon: "cloud_done",
    type: "positive",
    message: `登录成功！欢迎 ${userData.userName[0] + "*".repeat(userData.userName.length - 1)}`,
  });
  $router.push({ name: "display" });
}
</script>

<style lang="scss"></style>
