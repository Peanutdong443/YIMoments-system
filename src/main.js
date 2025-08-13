import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js'
import { Form, Field, CellGroup, Toast, RadioGroup,
    Radio,NumberKeyboard,Dialog,PasswordInput,Overlay} from 'vant';
import { Tabbar, TabbarItem,Collapse, CollapseItem } from 'vant';
import { CouponCell, CouponList } from 'vant';
import { Image as VanImage } from 'vant';
import { showImagePreview } from 'vant';
import { Uploader } from 'vant';
import 'vant/lib/index.css'; //样式全局引入，否则效果无法展示
import store from '../src/store/index.js'

const app=createApp(App)
app.use(router)
app.use(Form);
app.use(Field);
app.use(CellGroup);
app.use(Toast);
app.use(Radio);
app.use(RadioGroup);
app.use(NumberKeyboard);
app.use(Dialog);
app.use(PasswordInput);
app.use(Overlay);
app.use(Tabbar);
app.use(TabbarItem);
app.use(Collapse);
app.use(CollapseItem);
app.use(CouponCell);
app.use(CouponList);
app.use(store)
app.use(VanImage);
app.use(Uploader);
app.config.globalProperties.$preview = showImagePreview;
app.mount('#app')