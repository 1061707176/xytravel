<template>
  <div class="post">
    <el-row type="flex" class="main" justify="space-between" interval="2000">
      <div class="main_left">
        <div class="dv" style="width:260px">
          <div v-for="(item,i) in form" :key="i" class="hotCity">
            <a @mouseenter="getIndex(i)" @mouseleave="hiddenHotCity">
              {{item.type}}
              <i class="el-icon-arrow-right" style="float:right;line-height:41px"></i>
            </a>
          </div>
          <div
            class="hotCity_menu"
            v-if="ifGetCities"
            @mouseenter="enterHotCities"
            @mouseleave="hiddenHotCity"
          >
            <input v-model="setI" hidden />
            <ul>
              <li v-for="(data,index) in form[setI].children" :key="index">
                <i>{{index+1}}</i>
                <strong>{{data.city}}</strong>
                <span @click="getHotCities(data)">{{data.desc}}</span>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <p style="width:260px;font-size:16px;padding:20px 0;">推荐城市</p>
          <hr />
          <div class="cc"></div>
        </div>
      </div>

      <el-row class="left">
        <!-- -------------搜索框---------------- -->
        <div class="searchBox">
          <input
            type="text"
            class="search"
            placeholder="请输入想去的地方，比如：'广州'"
            v-model="wantGo"
            @change="searchCity()"
          />
          <i class="el-icon-search iconSearch" @click="wantGoCity"></i>
        </div>
        <!-- -------------搜索框end---------------- -->

        <!-- --------------关键字----------------------- -->
        <div class="Keyword">
          <span>推荐：</span>
          <a
            @click="getNewContent(item)"
            v-for="(item,index) in city"
            :key="index"
          >&nbsp;{{item}}&nbsp;</a>
        </div>
        <!-- --------------关键字end----------------------- -->

        <!-- -------------------推荐攻略----------------------- -->
        <div class="suggest">
          <h3>推荐攻略</h3>
          <el-button type="success" icon="el-icon-edit" @click="addArticle">写游记</el-button>
        </div>
        <!-- -------------------推荐攻略End----------------------- -->

        <!-- ------------------文章内容----------------- -->
        <div class="article">
          <ul>
            <li v-for="(item,index) in content" :key="index">
              <div v-if="item.images.length>=3">
                <div>
                  <h4>
                    <a @click="test(item)">{{item.title}}</a>
                  </h4>
                  <p>
                    <a @click="test(item)" style="cursor:pointer">{{item.summary}}</a>
                  </p>
                </div>
                <div class="imgs">
                  <a href="#" v-for="(img,index) in item.images" :key="index">
                    <img :src="img" alt />
                  </a>
                </div>

                <div class="information">
                  <i class="el-icon-location-outline"></i>
                  <span>{{item.cityName}}</span>
                  <span>by</span>
                  <span>
                    <img :src="`${$axios.defaults.baseURL}${item.account.defaultAvatar}`" alt />
                    <a href="#">{{item.account.nickname}}</a>
                  </span>
                  <i class="el-icon-view"></i>
                  <span>{{item.watch}}</span>
                </div>
              </div>
              <div v-else class="imgMin3">
                <div class="imgs">
                  <a href="#" v-for="(img,index) in item.images" :key="index">
                    <img :src="img" alt />
                  </a>
                </div>
                <div class="titleAndContent">
                  <h4>
                    <a @click="test(item)">{{item.title}}</a>
                  </h4>
                  <p>
                    <a href=":javascript">{{item.summary}}</a>
                  </p>
                  <div class="information">
                  <i class="el-icon-location-outline"></i>                    
                    <span>{{item.cityName}}</span>
                    <span>by</span>
                    <span>
                      <img :src="`${$axios.defaults.baseURL}${item.account.defaultAvatar}`" alt />
                      <a href="#">{{item.account.nickname}}</a>
                    </span>
                  <i class="el-icon-view"></i>                  
                    <span>{{item.watch}}</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!-- ------------------文章内容End----------------- -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[3, 5, 10, 15]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </el-row>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      setI: 0, //鼠标移动事件的默认索引为0
      ifGetCities: false,
      isCollapse: true,
      form: [{ type: "", chirdren: [] }], //防止获取不到数据报错
      content: [],
      newContent: [],
      city: ["北京", "上海", "广州"],
      wantGo: "",
      // 分页
      total: 0,
      pageNum: 1, //当前页数
      pageSize: 3, //每页显示条目个数
       _limit: 3, //分页的条数
      _start: 0, //分页开始数据
      cities:null
    };
  },
  methods: {
    setImages(res) {
      //处理图片数据
      for (var i = 0; i < this.content.length; i++) {
        if (this.content[i].images.length > 3) {
          this.content[i].images.splice(3, this.content[i].images.length + 1);
        }
        if (this.content[i].images.length === 2) {
          this.content[i].images.splice(-1);
        }
      }
    },
    //热门城市的显示隐藏
    getIndex(v) {
      this.setI = v;
      this.ifGetCities = true;
    },
    hiddenHotCity() {
      this.ifGetCities = false;
    },
    enterHotCities() {
      this.ifGetCities = true;
    },
    //热门城市列表的点击事件
    async getHotCities(v) {
      this.cities=v.city
      let res = await this.$axios({
        url: "/posts",
        params: {
          _start: this._start,
          _limit: this.pageSize,
          city: this.cities
        }
      });
      this.total = res.data.total;
      this.content = res.data.data;
      this.setImages(this.content);
    },
    // ----------测试------
    test(item) {
      let id = { id: item.id };
      this.$router.push({ path: "/post/detail", query: id });
    },
    //--------测试end----------
    async init() {
      let res = await this.$axios({
        url: "/posts",
        params: {
          _start: this._start,
          _limit: this.pageSize,
          city: this.cities
        }
      });
      this.content = res.data.data;
      this.newContent = this.content;
      //设置分页的总页数
      this.total = res.data.total;
      //处理图片数据
      this.setImages(this.content);
    },
    //推荐城市的文章
    async getNewContent(value) {
      console.log(value);
      this.cities=value
      let res = await this.$axios({
        url: "/posts",
        params: {
          _start: this._start,
          _limit: this.pageSize,
          city: this.cities
        }
      });
      this.total = res.data.total;
      this.content = res.data.data;
      //处理图片
      this.setImages(this.content);
    },
    //搜索城市
    async wantGoCity() {
      this.cities=this.wantGo
      let res = await this.$axios({
        url: "/posts",
        params: {
          _start: (this.pageNum - 1) * this.pageSize,
          _limit: this.pageSize,
          city: this.cities
        }
      });
      this.total = res.data.total;
      this.content = res.data.data;
      //处理图片
      this.setImages(this.content);
    },
    //搜索框为空的时候文章内容初始化
    searchCity() {
      if (this.wantGo == "") {
        this.content = this.newContent;
      }
    },

    //第几页
    handleCurrentChange(v) {
      console.log(v);
      this._start = (v-1)*this.pageSize;
      console.log(this._start);
      this.init();
    },
    // 每页几条
    handleSizeChange(v) {
      this.pageSize = v;
      this.init();
    },
    //跳转到添加文章
    addArticle(){
      this.$router.push({path:'/post/create'})
    }
  },

  mounted() {
    //获取热门城市数据
    this.$axios({
      url: "/posts/cities"
    }).then(res => {
      this.form = res.data.data;
    });
    //获取文章数据
    this.init();
  },
};
</script>
<style lang='less' scoped>
// css3动画
.cc {
  width: 260px;
  height: 173px;
  margin: 0;
  margin-top: 10px;
  /* 线性渐变语法 background: linear-gradient(direction, color-stop1, color-stop2, ...); 
                                    方向，颜色1，颜色2，颜色3*/
  background: linear-gradient(
    125deg,
    #2c3e50,
    #27ae60,
    #e74c3c,
    #2980b9,
    #8e44ad
  );
  background-size: 400%;
  animation: bganimation 15s infinite;
}
/* @keyframes <identifier> '{' <keyframes-blocks> '}';  
        identifier定义一个动画名称 
        <keyframes-blocks>：定义动画在每个阶段的样式，即帧动画。*/
@keyframes bganimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.left {
  width: 700px;
}
.main_left {
  position: relative;
  width: 260px;
}
.post {
  padding-top: 20px;
  width: 1000px;
  margin: 0 auto;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-menu-vertical-demo {
  color: #fff;
  position: relative;
  width: 260px;
  height: 227px;
  border: 1px solid #ccc;
  li {
    border-bottom: 1px solid #ccc;
    &:nth-child(4) {
      border: none;
    }
  }
}
.hotCity {
  height: 41px;
  line-height: 41px;
  border: 1px solid #ccc;
  border-bottom: 0;
  box-sizing: border-box;
  &:hover{
    border-right:0;
  }
  a {
    padding: 0 20px;
    cursor: pointer;
    display: block;
    font-size: 14px;
    &:hover {
      color: #ffa552;
    }
  }
}
.hotCity:nth-child(4) {
  border-bottom: 1px solid #ccc;
}
.hotCity_menu {
  background-color: #fff;
  z-index: 1;
  position: absolute;
  left: 259px;
  top: 0;
  padding: 10px 20px;
  width: 350px;
  height: 202px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  // border-left: 0;
  
  li {
    cursor: pointer;
    height: 30px;
    line-height: 20px;
    /deep/i {
      vertical-align: middle;
      font-size: 24px;
      display: inline-block;
      margin: 0 10px;
      // margin-bottom: -5px;

      color: #ffa500;
    }
    strong {
      color: #ffa552;
      font-size: 14px;
      vertical-align: middle;
      &:hover {
        text-decoration: underline;
      }
    }
    span {
      vertical-align: middle;

      font-size: 14px;
      color: #777;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.searchBox {
  position: relative;
  i {
    cursor: pointer;
  }
}
.el-input__inner,
.search {
  width: 700px;
  height: 40px;
  outline: none !important;
  box-sizing: border-box;
  line-height: 40px;
  padding-left: 20px;
  border-radius: 5px;
  // outline-color: #ffa500;
  border: 2px solid #ffa500;
}
input:focus {
  outline: none;
}
.iconSearch {
  position: absolute;
  right: 10px;
  top: 8px;
  display: inline-block;
  width: 24px;
  height: 24px;
  font-size: 24px;
  color: #ffa552;
  font-weight: 700px !important;
}
.Keyword {
  margin: 10px 0;
  color: #777;
  font-size: 14px;
  a {
    cursor: pointer;
    color: #777;
    text-align: center;
  }
  a:hover {
    color: #ffa552;
    text-decoration: underline;
  }
}
.suggest {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  border-bottom: 1px solid #eeeeee;
  h3 {
    display: inline-block;
    color: #ffa552;
    padding-bottom: 15px;
    border-bottom: 2px solid #ffa552;
    font-weight: normal;
  }
}
.article {
  // border: 1px solid black;
  margin-top: 25px;
  ul {
    li {
      padding-bottom: 15px;
      h4 {
        padding: 15px 0;
        a:hover {
          cursor: pointer;
          color: #99cccc;
        }
      }
      p {
        height: 63px;
        font-size: 14px;
        line-height: 20px;
        overflow: hidden;
        a {
          color: #777;
        }
      }
      .imgs {
        display: flex;
        justify-content: space-between;
        height: 150px;
        // overflow: hidden;
        a {
          display: inline-block;

          img {
            width: 220px;
            height: 150px;
          }
        }
        a:nth-child(2) {
          padding: 0 0px;
        }
      }
    }
  }
}
.information {
  padding-top: 10px;
  padding-left: 10px;
  font-size: 12px;
  color: #777;
  i {
    cursor: default;
  }
  span:nth-child(4) a {
    color: #ffa500;
  }
  span:nth-child(4) img {
    width: 16px;
    height: 16px;
    vertical-align: middle;
  }
}
/deep/.titleAndContent {
  padding-left: 10px;
}
/deep/.block {
  display: flex;
  justify-content: space-evenly;
}
.imgMax3 {
  display: flex;
  flex-direction: column;
}
.imgMin3 {
  display: flex;
}
// 热门城市列表框的border。。。。
.activeHotCities {

}
// .test{
//   // position: absolute;

//   margin-left: -4px;
//   background-color: aquamarine
// }
// .el-menu--vertical{
// top:62px;
//   left:722px;
// }
</style>