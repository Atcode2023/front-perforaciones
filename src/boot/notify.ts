// Este archivo boot registra Notify globalmente para Quasar
import { Notify } from 'quasar';
import { boot } from 'quasar/wrappers';

export default boot(({ app }) => {
  app.config.globalProperties.$notify = Notify;
});
