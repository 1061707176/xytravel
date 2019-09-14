<template>
  <div class="container">
    <el-row type="flex">
      <el-col class="main" :span="18">
        <h2>发表新攻略</h2>
        <p>分享你的个人游记，让更多人看到哦！</p>
        <el-form :model="form">
          <el-form-item>
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item>
            <div>
              <VueEditor :config="config" ref="vueEditor" class="futext" />
            </div>
          </el-form-item>
          <el-form-item label="选择城市">
            <el-autocomplete
              :fetch-suggestions="queryDepartSearch"
              placeholder="请搜索出发城市"
              @select="handleDepartSelect"
              @blur="handleDepartBlur"
              class="el-autocomplete"
              v-model="form.departCity"
            ></el-autocomplete>
          </el-form-item>
          <div style="margin-bottom:15px">
            <el-button type="primary" @click="submit" size="mini">发布</el-button>
            <span style="margin-left:10px;font-size:14px">
              或者
              <nuxt-link to="#" style="color:orange" @click.native="caogao">保存到草稿</nuxt-link>
            </span>
          </div>
        </el-form>
      </el-col>
      <el-col class="aside" :span="6">
        <div class="caogao">
          <h4>草稿箱 ({{this.arr.length}})</h4>
          <div v-for="(item,index) in arr" :key="index">
            <div class="bi">
              <span>{{item.title}}</span>
              <span class="iconfont el-icon-edit bi" @click="bianji(item)"></span>
            </div>
            <div>{{item.time}}</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from "moment";
import "quill/dist/quill.snow.css";
let VueEditor;
if (process.browser) {
  VueEditor = require("vue-word-editor").default;
}
export default {
  data() {
    return {
      config: {
        modules: {
          // 工具栏
          toolbar: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            ["blockquote", "code-block"],
            ["image", "video"],

            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }], // superscript/subscript
            [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
            [{ direction: "rtl" }] // text direction
          ]
        },
        // 主题
        theme: "snow",
        uploadImage: {
          url: "http://localhost:1337/upload",
          name: "files",
          uploadBefore(file) {
            return true;
          },
          uploadProgress(res) {},
          uploadSuccess(res, insert) {
            insert("http://localhost:1337" + res.data[0].url);
          },
          uploadError() {},
          showProgress: false
        },

        uploadVideo: {
          //url: "http://157.122.54.189:9095/upload",
          url: "http://localhost:1337/upload",
          name: "files",
          uploadBefore(file) {
            return true;
          },
          uploadProgress(res) {},
          uploadSuccess(res, insert) {
            insert("http://localhost:1337" + res.data[0].url);
          },
          uploadError() {}
        }
      },
      form: {
        name: "",//用户撰写的标题
        departCity: "",//城市的名字
        departCode: "",//城市编码
        textcont:''//富文本框内容
      },
      arr: [],//定义空数组用来存储接收或者返回的草稿内容,使用mouted钩子函数在页面加载完成的时候对数组添加了本地存储里的草稿数据
      timer: "",//获取当前时间的变量
      currentTime: new Date()//获取当前时间的变量
    };
  },
  methods: {
    bianji(val) {//这个函数是用来将草稿内容动态渲染到用户所编写的文本框中的事件
      console.log(val);
      this.form.name=val.title,
      this.$refs.vueEditor.editor.root.innerHTML=val.content,
      this.form.departCity=val.cityName,
      this.timer=val.time
    },
    caogao() {//这个函数是用来将用户编写的内容保存到草稿中的事件
      let textcont = this.$refs.vueEditor.editor.root.innerHTML;//这条数据是用来获取富文本框的内容的,并将其赋予了变量textcont以便上传本地存储
      this.timer = moment(this.currentTime).format(`YYYY-MM-DD`);//将原始时间格式转换为对应格式
      this.arr = JSON.parse(localStorage.getItem("posts"));//获取本地存储的内容,再对其进行增加,然后在覆盖回本地存储
      this.arr.push({//将一条数据添加到草稿数组中
        title: this.form.name,
        content: textcont,
        cityName: this.form.departCity,
        time: this.timer
      });
      let loc = JSON.stringify(this.arr);//将修改完的数据转换为JSON格式,以便上传本地存储
      console.log(loc)//打印确定数据内容是否真确;
      localStorage.setItem("posts", loc);//上传至本地存储
    },
    submit() {
      // console.log(this.$refs.vueEditor.editor.root.innerHTML);
    },
    handleDepartBlur() {
      this.form.departCity = this.departData[0] ? this.departData[0].value : "";//给城市选择添加失焦事件,但焦点不在城市文本框中的时候默认选择第一个城市
      this.form.departCode = this.departData[0] ? this.departData[0].sort : "";//给城市选择添加失焦事件,但焦点不在城市文本框中的时候,默认选择第一个城市的城市代码
    },
    queryDepartSearch(value, cb) {
      if (!value) {
        // 传递空数组不会出现下拉框
        cb([]);
        return;
      }

      // 根据用户的输入请求建议城市
      this.$axios({
        url: "/airs/city",
        // get参数
        params: {
          // 输入框的关键字
          name: value
        }
      }).then(res => {
        // 数组
        const { data } = res.data;

        // 给数组中每个对象添加value属性
        const newData = [];
        data.forEach(v => {
          // 添加value属性
          v.value = v.name.replace("市", "");
          // 把带有value属性的对象添加到新数组中
          newData.push(v);
        });

        // 把转换后的数组赋值给data
        this.departData = newData;

        //显示到下拉列表中
        cb(newData);
      });
    },
    handleDepartSelect() {}
  },
  mounted() {
    if ((this.arr = JSON.parse(localStorage.getItem("posts")))) {//在页面加载完的时候获取本地存储内容并判断其是否为空,如果有数据则获取数据并添加进草稿箱的数组中
      this.arr = JSON.parse(localStorage.getItem("posts"));//
    } else {
      localStorage.setItem("posts", "[]");//如果为空则赋予一个空数组
    }
  },
  components: {
    VueEditor//富文本框插件引入
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 1000px;
  margin: 0 auto;
  padding-top: 20px;
  .main {
    el-form-item {
      margin-bottom: 10px;
    }
    .futext {
      height: 330px;
      margin-bottom: 50px;
    }
    h2 {
      font-weight: 400;
      font-size: 22px;
      margin-bottom: 10px;
    }
    p {
      font-size: 12px;
      color: #ccc;
      margin-bottom: 10px;
    }
  }
  .aside {
    padding: 0 0px 0 50px;
    .caogao {
      border: 1px solid #ddd;
      padding: 10px;
      .bi {
        &:hover {
          color: orange;
        }
        cursor: pointer;
      }
      h4 {
        margin-bottom: 10px;
        font-weight: 400;
        color: #666;
      }
    }
  }
}
</style>