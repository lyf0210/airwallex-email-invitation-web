import Vue from "vue";
import VueI18n from "vue-i18n";

// element-ui built-in lang
import elementEnLocale from "element-ui/lib/locale/lang/en";

// User defined lang
import enLocale from "./en";

Vue.use(VueI18n);

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale,
  },
};

export const getLocale = (): string => {
  return "en";
};

const i18n = new VueI18n({
  locale: getLocale(),
  messages,
  silentFallbackWarn: true,
});

export default i18n;
