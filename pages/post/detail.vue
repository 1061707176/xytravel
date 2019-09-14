<template>
  <div class="detail">
    <div class="main">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="padding-bottom:15px">
          <el-breadcrumb-item :to="{ path: '/' }">旅游攻略</el-breadcrumb-item>
          <el-breadcrumb-item>攻略详情</el-breadcrumb-item>
        </el-breadcrumb>
        <h1>{{content.title}}</h1>
        <div class="ready">
          <span>攻略： {{content.created_at | getTime}} 阅读：{{content.watch}}</span>
        </div>
      </div>

      <!-- 文章详情 -->
      <div class="content" v-html="content.content" id="content"></div>
      <!-- 文章详情 End-->

      <!-- 点赞评论 -->
      <el-row
        style="display:flex;padding:50px 0 30px;justify-content:center;width:700px;"
      >
        <div class="comment">
          <i class="el-icon-edit-outline"></i>
          <span>评论({{comments.length}})</span>
        </div>
        <div class="comment" @click="Collection">
          <i class="el-icon-star-off" v-if="isCollection"></i>
          <i class="iconfont icon-Star-copy" v-else></i>
          <span>收藏</span>
        </div>
        <div class="comment">
          <i class="iconfont icon-fenxiang"></i>
          <span>分享</span>
        </div>
        <div class="comment" @click="likes">
          <i class="iconfont icon-dianzan" v-if="islike"></i>
          <i class="iconfont icon-zansel" v-else></i>
          <span v-if="islike">点赞({{like}})</span>
          <span v-else>已点赞</span>
        </div>
      </el-row>
      <!-- 点赞评论 End-->

      <!-- 评论模块 -->
      <div class="detail_bottom">
        <el-form :model="docomments" status-icon ref="docomments" class="demo-ruleForm">
          <el-form-item>
            <p>评论</p>
            <el-tag
              closable
              :disable-transitions="false"
              @close="handleClose"
              v-show="isTagReply"
            >回复 @{{$store.state.post.nickName}}</el-tag>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="说点什么吧..."
              v-model="docomments.content"
              resize="none"
            ></el-input>
          </el-form-item>

          <!-- 文件上传 -->
          <div class="upload">
            <el-upload
              action="http://127.0.0.1:1337/upload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :on-success="successUpload"
              name="files"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <!-- <el-button @click="setToken" type="success">测试</el-button> -->
            <el-dialog :visible.sync="dialogVisible" size="tiny">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>

            <el-form-item style="text-align:end">
              <el-button type="primary" @click="submitForm()">提交</el-button>
            </el-form-item>
          </div>
        </el-form>
        <Comment :data="discuss" @isShowTag="isShowTag" />
        <!-- 讨论区 -->
      </div>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[2, 4, 6, 8]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <!-- //相关攻略 -->
    <div class="aside">
      <asideRaiders />
    </div>
  </div>
</template>

<script>
import {bus} from '@/plugins/bus.js'
import Moment from "moment";
import Comment from "@/components/post/comment.vue";
import asideRaiders from '@/components/post/asideRaiders.vue'

// import icon from '@/assets/font_rag6czyto8p'
export default {
  components: {
    Comment,
    asideRaiders
  },
  data() {
    return {
      tt:'123',
      // url带过来的id
      id: 0, //文章id
      //   文章详细内容
      content: {},
      comments: [],
      docomments: {
        content: "", //评论内容
        // score: {}, //评分对象
        // location: "", //位置评分float
        // service: "",
        // fancility: "",
        // all: "",
        pics: [],
        // hotel: 0, //酒店id
        post: 0, //文章id
        follow:''
        // flollw: 0 //回复id
      },
      textarea: "",
      // 文件上传
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      _limit: 2, //分页的条数
      _start: 0, //分页开始数据
      discuss: [], //评论列表
      //分页
      pageSize: 4, //分页的条数
      pageNum: 0, //分页开始的数据
      total: 0,
      //回复显示对应的昵称
      dynamicTags: ["测试"],
      isTagReply:false,
      like:0,
      islike:true,
      getlike:'已点赞',
      isCollection:true
    };
  },
  created(){
    bus.$on('isShowTag',(v)=>{
      this.docomments.follow=v
      this.isTagReply=true
    })
  },
  mounted() {
      // this.dynamicTags[0]=this.$store.state.post.nickName

    // 获取url带过来的id并发送axios请求
    if (location.search) {
      this.id = location.search.slice(-1) - 0;
      let id = this.id;
      this.$axios({
        url: "posts",
        params: { id }
      })
        .then(res => {
          this.content = res.data.data[0];
          if(this.content.like){
            this.like=this.content.like
          }
          for(var i=0;i<this.content.likeIds.length;i++){
            if(this.content.likeIds[i]===this.$store.state.user.userInfo.user.id){
              this.islike=false
            }
          }
          this.comments = this.content.comments;
        })
        .catch(err => {
          console.log(err);
        });
    }
    this.getDiscuss();
  },
  //处理时间
  filters: {
    getTime(value) {
      let time = Moment(value).format("YYYY-MM-MM hh:mm");
      return time;
    }
  },
  methods: {
 
    // 提交评论/重置
    submitForm() {
      this.docomments.post = this.id;
      let data = this.docomments;
      if (
        this.docomments.content.length === 0 &&
        this.docomments.content == ""
      ) {
        this.$message.warning("还没有输入评论内容");
        return;
      }
      this.$axios({
        url: "/comments",
        method: "post",
        data,
        headers: {
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
        }
      })
        .then(res => {
          if (res.data.status === 0) {
            this.getDiscuss();
            this.$message.success(res.data.message);
            this.docomments.content = '';
            this.docomments.pics=[];
            this.docomments.follow=''
            this.isTagReply=false
          }
        })
        .catch(err => {
        });
    },
    // 文件上传
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //上传成功的函数
    successUpload(res, file, fileList) {
      this.docomments.pics.push(res[0]);
    },

    //获取文章评论
    getDiscuss() {
      this.$axios({
        url: "/posts/comments",
        params: {
          post: this.id,
          _start: this._start,
          _limit: this.pageSize
        }
      })
        .then(res => {
          this.total = res.data.total;
          this.discuss = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //分页
    // 当前页
    handleCurrentChange(v) {
      this._start = (v-1)*this.pageSize;
      this.getDiscuss();
    },
    //每页的条数
    handleSizeChange(v) {
      this.pageSize = v;
      this.getDiscuss();
    },
    handleClose(tag) {
      this.isTagReply=false
    },
    //子组件调用父组件事件
    isShowTag(id){
      this.isTagReply=true;
      this.docomments.follow=id
    },
    //点赞
    likes(){
      this.$axios({
        url:'/posts/like',
        params:{id:this.id},
        headers:{Authorization:`Bearer ${this.$store.state.user.userInfo.token}`
}
      }).then((res)=>{
        if(res.status===200){
          this.like=this.like+1
          this.$message.success(res.data.message)
          this.islike=false
        }
      }).catch((err)=>{
        console.log(err)
      })
    },
    // 收藏 /posts/star
     Collection(){
       this.$axios({
        url:'/posts/star',
        params:{id:this.id},
        headers:{Authorization:`Bearer ${this.$store.state.user.userInfo.token}`}
      }).then((res)=>{
        if(res.status===200){
          this.$message.success(res.data.message)
        }
      }).catch((err)=>{
        console.log(err)
      })
      
    }
    
  }
  //生命周期函数中js动态配置样式
  // updated() {
  //   console.log(this.id);
  //   //   获取html结构
  //   let obj = document.getElementById("content");
  //   //   console.log(obj);
  //   let imgs = obj.getElementsByTagName("img");
  //   //   console.log(imgs);
  //   for (var i = 0; i < imgs.length; i++) {
  //     // 给全部图片设置margin
  //     imgs[i].style.margin = "10px 0";
  //     console.log(imgs[i]);
  //     //   给大于700宽度的图片设置样式
  //     if (imgs[i].width > 700) {
  //       imgs[i].style.width = "100%";
  //       imgs[i].style.height = "100%";
  //     }
  //   }
  // }
};
</script>
<style lang="less" scoped>
.detail {
  margin: 0 auto;
  width: 1000px;
  display: flex;
  padding-top: 20px;
  justify-content: space-between;
  //   height: 900px;
  // border: 1px solid blueviolet;
  .main {
    width: 700px;
  }
}
.content {
  max-width: 700px !important;

  // width: 700px;
  line-height: 1.5;
}

.title {
  width: 700px;
  h1 {
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
  }
  .ready {
    text-align: right;
    padding: 20px;
    span {
      color: #777;
    }
  }
}
/deep/.content img {
  max-width: 100%;
}
.comment {
  display: flex;
  flex-direction: column;
  margin: 0 20px;
  font-size: 20px;
  cursor: pointer;
  text-align: center;
  /deep/i {
    font-size: 40px;
    color: #ffa500;
  }
  span {
    font-size: 14px;
    color: #777;
  }
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.detail_bottom {
  // height: 700px;
  width: 700px;
  border: 1px solid #ccc;
  border-bottom: 0;
}
.upload {
  display: flex;
  justify-content: space-between;
}
/deep/.el-upload {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
.aside {
  width: 280px;
}
</style>