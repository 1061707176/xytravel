<template>
  <div class="hotelMap">
    <el-row :gutter="5">
      <el-col :span="16">
        <div id="container"></div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-tabs @tab-click="handleClick">
            <el-tab-pane label="风景">
              <div class="traffic">
                <ul>
                  <li
                    v-for="(item,index) in sceneryMapdata"
                    :key="index"
                    style="cursor:pointer;"
                    @mousemove="choose(item)"
                  >
                    <span>{{item.name}}</span>
                    <span v-if="item.biz_ext.rating.length!==0" class="journey">{{item.biz_ext.rating}}公里</span>
                    <span v-if="item.biz_ext.rating.length===0" class="journey">0公里</span>
                  </li>
                </ul>
              </div>
            </el-tab-pane>
            <el-tab-pane label="交通">
               <div class="traffic">
                <ul>
                  <li>
                    <span>大桥(地铁站)</span>
                    <span class="journey">0.13公里</span>
                  </li>
                  <li>
                    <span>弘阳广场(地铁站)</span>
                    <span class="journey">0.92公里</span>
                  </li>
                  <li>
                    <span>南浦路(地铁站)</span>
                    <span class="journey">1.05公里</span>
                  </li>
                  <li>
                    <span>桥北客运站(公交站)</span>
                    <span class="journey">0.41公里</span>
                  </li>
                  <li>
                    <span>南京长途汽车客运北站(地铁站)</span>
                    <span class="journey">0.52公里</span>
                  </li>
                  <li>
                    <span>长江大桥北(公交站)</span>
                    <span class="journey">0.17公里</span>
                  </li>
                  <li>
                    <span>江山路大桥北路(公交站)</span>
                    <span class="journey">0.15公里</span>
                  </li>
                  <li>
                    <span>桥荫路·浦珠北路(公交站)</span>
                    <span class="journey">0.19公里</span>
                  </li>
                  <li>
                    <span>桥荫路北(公交站)</span>
                    <span class="journey">0.36公里</span>
                  </li>
                  <li>
                    <span>柳州路(地铁站)</span>
                    <span class="journey">1.62公里</span>
                  </li>
                </ul>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <!-- {{data}} -->
    </el-row>
  </div>
</template>

<script>
export default {
  // props:{
  //     // data表示组件可以接收的属性
  // data: {
  //   // type不能修改，用于声明属性的类型
  //   type: Array,
  //   // 如果调用组件不传值，采用default的默认值
  //   default: []
  // }
  // },
  data() {
    return {
      sceneryMapdata: [],
      center: [118.922375, 32.101576],
      tableData: [],
      locations:"",
      map:null,
      marker1:null,
      infoWindow: null,
      contents: "高级酒店",
    };
  },
  methods: {
    // 鼠标移入事件
    choose(datas){
      // console.log(datas,0987)
      // console.log(datas)
      let locations = datas.location.split(',')
        // console.log(str,321654)
        // 重新设置中心点
      // this.center = [locations[0]-0,locations[1]-0];
      // this.map = new AMap.Map("container", {
      //   zoom: 12, //级别
      //   center: this.center, //中心点坐标
      //   viewMode: "3D" //使用3D视图
      // });
      this.center=[locations[0]-0,locations[1]-0]
        let temp = [locations[0]-0,locations[1]-0]
         this.infoWindow = new AMap.InfoWindow({
          offset: new AMap.Pixel(2, -17),
          content:datas.name //传入 dom 对象，或者 html 字符串
        });
        // this.map.add([this.marker1]);
        this.infoWindow.open(this.map,temp)
    },
    // tab栏
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    // 请求数据
    getMapData() {
      this.$axios({
        url: "https://restapi.amap.com/v3/place/text",
        params: {
          keyword:'',
          city: "南京",
          location: "118.922375,32.101576",
          types: "风景名胜",
          output: "json",
          page: 1,
          offset: 10,
          key: "79041dfa1c752f49599e2b507c64da42"
        }
      }).then(res => {
        this.sceneryMapdata = res.data.pois;
        // console.log(this.sceneryMapdata, 13465);
      });
    },
    // 设置中心店
    setMapInfo() {
      // window.onLoad = () => {
      // console.log(this.sceneryMapdata,123456498)
      const { location } = this.sceneryMapdata[3];
      //重新设置地图中心点
      const temp = location.split(",");
      this.center = [temp[0] - 0, temp[1] - 0];
      this.map = new AMap.Map("container", {
        zoom: 15, //级别
        center: this.center, //中心点坐标
        viewMode: "3D" //使用3D视图
      });
      // 循环遍历名称和地址数组
      this.sceneryMapdata.forEach((v, i) => {
        // 创建一个 Marker 实例：
        // 把经纬度字符串分成数字
        // console.log(132)
        // console.log(v)
        let str = v.location.split(",");
        let positions=[str[0] - 0, str[1] - 0]
        // console.log(str,321654)
         this.marker1 = new AMap.Marker({
          // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          position: new AMap.LngLat(str[0] - 0, str[1] - 0),
          title: `${v.name}`,
          // content: `<div style="width:30px;height:45px;text-align:center;color:#00a4ff;font-size:21px;" class="el-icon-location"></div>`
        });
        this.map.add([this.marker1]);
        // this.contents = v.name
        this.infoWindow = new AMap.InfoWindow({
          offset: new AMap.Pixel(2, -17),
          // content: this.contents //传入 dom 对象，或者 html 字符串
        });
        this.infoWindow.open(this.map,positions)
      });
    }
  },
  mounted() {
    // 请求数据
    this.getMapData();
    // 引入地图
    window.init = () => {
      setTimeout(() => {
        this.setMapInfo();
        //  this.setMarker()
      }, 500);
    };

  }
};
</script>

<style lang="less" scoped>
#container {
  width: 650px;
  height: 360px;
}
.traffic{
  overflow-y: auto;
  height: 300px;
  li{
    font-size: 14px;
    margin: 0 20px 20px 10px;
    .journey{
      float: right;
    }
  }
  /deep/.el-icon-location {
    color: #00a4ff;
    background-color: #00a4ff;
    &::before {
      display: block;
      color: #ff3366;
      transform: scale(3);
    }
  }
}
</style>