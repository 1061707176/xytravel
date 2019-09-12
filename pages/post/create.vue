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
          <h4>草稿箱 (0)</h4>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from 'moment'
import "quill/dist/quill.snow.css"
let VueEditor;
if (process.browser) {
    VueEditor = require('vue-word-editor').default
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
        name: "",
        type: "",
        departCity: "",
        departCode: ""
      },
      arr: [],
      timer: "",
      currentTime: new Date()
    };
  },
  methods: {
    caogao() {
      let textcont = this.$refs.vueEditor.editor.root.innerHTML;
      this.timer = moment(this.currentTime).format(`YYYY-MM-DD`);
      this.arr.push({
        title: this.form.name,
        content: textcont,
        cityName: this.form.departCity,
        time:this.timer
      });
      let loc=JSON.stringify(this.arr)
      console.log(loc);
      localStorage.setItem('posts',loc)
    },
    submit() {
      console.log(this.$refs.vueEditor.editor.root.innerHTML);
    },
    handleDepartBlur() {
      this.form.departCity = this.departData[0] ? this.departData[0].value : "";
      this.form.departCode = this.departData[0] ? this.departData[0].sort : "";
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

  components: {
    VueEditor
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
      h4 {
        margin-bottom: 10px;
        font-weight: 400;
        color: #666;
      }
    }
  }
}
</style>