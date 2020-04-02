<template>
  <div
    @mouseenter.stop="mucmouseenterfunc"
    @mouseleave.stop="mucmouseleavefunc"
    @mousedown="mousedown"
    id="music"
    class="musicstyle"
    :class="mucflag?'':playListFlag||barflag?'showlist':''"
  >
    <div
      v-if="musicdata&&musicdata.playlist"
      class="barstyle"
      :class="barflag?'barstyle1':'barstyle2'"
    >
      <img height="85px" width="auto" :src="musicdata.playlist.coverImgUrl" alt />
      <div class="titlestyle">
        <p v-if="tracks.length>0">{{tracks[currentTrackIndex].name}}</p>
        <p>标签:{{musicdata.playlist.tags.join('/')}}</p>
        <p>简介:{{musicdata.playlist.description}}</p>
      </div>
    </div>

    <div
      v-show="playListFlag||barflag"
      ref="progress"
      style="width:100%;height:3px;background:rgba(255, 255, 255, 0.8)"
    >
      <div :style="{width:barWidth}" style="height:3px;background:rgba(250, 30, 30, 0.8)"></div>
    </div>

    <div v-if="audio" :class="!mucflag?'musictool1':'musictool2'">
      <music-item
        :style="{animationDuration:audio.duration+'s',zIndex:3}"
        :class="mucflag?isTimerPlaying?'cyclingstyle':'abstyle':'restyle'"
        :size="size"
        :color="!mucflag?color:mColor"
        :bgColor="bgColor"
        @clickfunc="barflag=!barflag"
      >
        <use slot="icon" xlink:href="#music3" />
      </music-item>

      <template v-for="(item, i) in musicitems">
        <music-item
          :key="i"
          :class="mucflag?'abstyle':'restyle'"
          :size="size"
          :color="color"
          :bgColor="bgColor"
          @clickfunc="item.act"
        >
          <use slot="icon" v-if="item.title" :xlink:href="isTimerPlaying ? '#pause2' : '#play2'" />
          <use slot="icon" v-else :xlink:href="item.icon" />
        </music-item>
      </template>
    </div>

    <div :class="playListFlag?'liststyle1':'liststyle2'" class="liststyle">
      <table width="100%" border="0" cellspacing="0" cellpadding="4" class="tabtop" align="center">
        <tr class="etdstyle">
          <td></td>
          <td>music name</td>
          <td>artist</td>
        </tr>
        <tr
          :class="currentTrack.id==item.id?'isactive':index%2==0?'otdstyle':'etdstyle'"
          @dblclick="selectplay(item,index)"
          v-for="(item,index) in tracks"
          :key="item.id"
        >
          <td>
            <svg @click="selectplay(item,index)" class="inseticon">
              <use v-if="currentTrack.id==item.id&&isTimerPlaying" xlink:href="#pause" />
              <use xlink:href="#play" v-else />
            </svg>
          </td>
          <td>{{item.name}}</td>
          <td>{{item.ar[0].name}}</td>
        </tr>
      </table>
    </div>

    <svg
      style="display:none"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <symbol viewBox="0 0 1024 1024" id="playlist">
        <title>playlist</title>
        <path
          d="M716.8 333.1072V757.76a143.36 143.36 0 1 1-81.92-129.55648V163.84a40.96 40.96 0 0 1 53.37088-39.03488l86.016 24.576A182.0672 182.0672 0 0 1 901.12 322.84672v62.23872a20.48 20.48 0 0 1-27.89376 19.08736L716.8 333.1072zM163.84 245.76h327.68a40.96 40.96 0 1 1 0 81.92H163.84a40.96 40.96 0 1 1 0-81.92z m0 143.36h327.68a40.96 40.96 0 1 1 0 81.92H163.84a40.96 40.96 0 1 1 0-81.92z m0 143.36h225.28a40.96 40.96 0 1 1 0 81.92H163.84a40.96 40.96 0 1 1 0-81.92z"
        />
      </symbol>
      <symbol id="pause" viewBox="0 0 32 32">
        <title>pause</title>
        <path
          d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM10 10h4v12h-4zM18 10h4v12h-4z"
        />
      </symbol>

      <symbol id="pause2" viewBox="0 0 1024 1024">
        <title>pause2</title>
        <path
          d="M341.332992 142.222336c47.128576 0 85.334016 38.20544 85.334016 85.332992v568.889344c0 47.128576-38.20544 85.332992-85.334016 85.332992-47.127552 0-85.332992-38.20544-85.332992-85.332992V227.555328c0-47.128576 38.20544-85.332992 85.332992-85.332992z m341.334016 0c47.127552 0 85.332992 38.20544 85.332992 85.332992v568.889344c0 47.128576-38.20544 85.332992-85.332992 85.332992-47.128576 0-85.334016-38.20544-85.334016-85.332992V227.555328c0-47.128576 38.20544-85.332992 85.334016-85.332992z"
        />
      </symbol>
      <symbol id="play" viewBox="0 0 32 32">
        <title>play</title>
        <path
          d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM12 9l12 7-12 7z"
        />
      </symbol>
      <symbol id="play2" viewBox="0 0 1024 1024">
        <title>play</title>
        <path
          d="M256 252.245333c0-6.613333 1.578667-13.098667 4.565333-18.901333 9.813333-18.773333 32-25.557333 49.621334-15.104l439.04 259.754667c5.973333 3.541333 10.88 8.789333 14.165333 15.146666 9.813333 18.773333 3.413333 42.453333-14.165333 52.864L310.186667 805.76a34.730667 34.730667 0 0 1-17.706667 4.906667C272.341333 810.666667 256 793.258667 256 771.797333V252.245333z"
        />
      </symbol>

      <symbol id="next2" viewBox="0 0 1024 1024">
        <title>next</title>
        <path
          d="M768 277.333333v469.333334a21.333333 21.333333 0 0 1-21.333333 21.333333h-42.666667a21.333333 21.333333 0 0 1-21.333333-21.333333v-469.333334a21.333333 21.333333 0 0 1 21.333333-21.333333h42.666667a21.333333 21.333333 0 0 1 21.333333 21.333333zM311.04 251.733333a31.146667 31.146667 0 0 0-34.133333 0l-5.12 2.56a32.426667 32.426667 0 0 0-15.786667 26.026667v462.933333a32.853333 32.853333 0 0 0 15.786667 27.733334l5.12 2.56a32 32 0 0 0 34.133333 0l314.453333-221.013334a32 32 0 0 0 13.653334-26.026666v-26.453334a32 32 0 0 0-13.653334-26.026666z"
        />
      </symbol>

      <symbol id="prev2" viewBox="0 0 1024 1024">
        <title>prev</title>
        <path
          d="M341.333333 746.666667a21.333333 21.333333 0 0 1-21.333333 21.333333h-42.666667a21.333333 21.333333 0 0 1-21.333333-21.333333v-469.333334a21.333333 21.333333 0 0 1 21.333333-21.333333h42.666667a21.333333 21.333333 0 0 1 21.333333 21.333333zM768 280.32a32.853333 32.853333 0 0 0-15.786667-27.733333l-5.12-2.56a31.146667 31.146667 0 0 0-34.133333 0l-314.453333 222.293333a32 32 0 0 0-13.653334 26.026667v26.453333a32 32 0 0 0 13.653334 26.026667l314.453333 221.013333a31.146667 31.146667 0 0 0 34.133333 0l5.12-2.56a32.426667 32.426667 0 0 0 15.786667-27.733333z"
        />
      </symbol>

      <symbol id="music3" viewBox="0 0 1024 1024">
        <title>music3</title>

        <path
          d="M274.869627 824.415556c1.355668-8.162251 2.57012-16.352744 4.076418-24.486752 6.881898-37.167896 23.714774-69.64744 48.305084-98.163538 40.688866-47.184775 92.844424-75.183084 153.717679-87.082835 40.990126-8.011621 81.989666-6.618295 122.311373 5.328528 2.080574 0.611933 4.227048 0.979094 7.635046 1.751071-9.696791-13.650823-18.612191-26.218994-27.555833-38.777751-84.484472-118.649186-168.959529-237.307787-253.500487-355.919316-6.025191-8.454096-8.190494-16.992921-5.460329-27.480519 6.863069-26.322552 23.422929-45.480776 44.539339-61.24983 33.552781-25.061028 71.991615-39.935718 112.247422-50.140884 22.60388-5.723931 45.960908-8.46351 68.621274-14.008569 19.28061-4.716595 38.49532-10.38404 56.928638-17.642511C637.021249 44.624069 664.642983 28.403126 684.422555 0c3.191468 16.070314 7.2114 32.027655 9.320217 48.229769 1.703999 13.057718 2.089988 26.463768 1.355668 39.625044-2.984352 53.172309-24.477338 97.193859-67.002005 130.624253-28.450198 22.368521-61.475775 33.006748-96.798455 37.233796-21.088168 2.523049-42.374037 3.332684-64.111796 4.942539 0.310674 0.781392 0.753149 2.457148 1.581613 3.916374a482585.489381 482585.489381 0 0 0 122.254886 214.280261c40.058104 70.174644 80.153866 140.321044 120.155485 210.514517 8.46351 14.846447 18.197959 29.241004 24.618552 44.944158 19.205296 47.024731 17.143551 94.360136-3.08791 140.575232-27.791192 63.490448-76.92474 104.913634-140.772934 130.22885-37.111409 14.72406-75.926818 21.031682-115.702491 18.207373-61.005057-4.330606-114.544525-25.823591-155.967712-72.095173C288.680494 915.951384 274.869627 870.574166 274.869627 824.415556c1.355668-8.171665 0 6.119334 0 0z"
        />
      </symbol>
    </svg>
  </div>
</template>

<script>
import musicItem from "./music/musicItem.vue";
import axios from "axios";
//respone拦截器==>对响应做处理
axios.interceptors.response.use(
  response => {
    //成功请求到数据
    if (response.status == 200) {
      return response.data;
    } else {
      return "请求错误";
    }
  },
  error => {
    //响应错误处理
    if (
      error.code === "ECONNABORTED" &&
      error.message.indexOf("timeout") !== -1
    ) {
      let originalRequest = error.config;
      return "error";
    }
  }
);
export default {
  components: {
    musicItem
  },
  props: {
    musicserve: {
      type: String,
      default: () => " http://39.105.168.171:3000/",
      required: false
    },
    playlistapi: {
      type: String,
      default: () => "playlist/detail?id=2801005211",
      required: false
    },

    mColor: {
      type: String,
      default: () => "#f44336",
      required: false
    },
    color: {
      type: String,
      default: () => "#1b2947",
      required: false
    },
    size: {
      type: Number,
      default: () => 35,
      required: false
    }
  },
  data() {
    return {
      barflag: true,
      timeout: Function,
      timeout1: Function,
      timeout2: Function,
      playListFlag: false,
      bgColor: "rgba(221,214,223,1)",
      mucflag: false,
      selectElement: "",
      audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: false,
      musicdata: {},
      tracks: [],
      currentTrack: {},
      currentTrackIndex: 0,
      transitionName: null,
      musicitems: [
        { icon: "#prev2", act: this.prevTrack },
        {
          title: "play",
          act: this.play
        },
        { icon: "#next2", act: this.nextTrack },
        { icon: "#playlist", act: this.openlist }
      ]
    };
  },
  methods: {
    mucmouseleavefunc() {
      this.timeout = setTimeout(() => {
        this.mucflag = true;
        this.bgColor = "rgba(221,214,223,1)";
      }, 9000);
      this.timeout1 = setTimeout(() => {
        this.barflag = false;
      }, 7000);

      this.timeout2 = setTimeout(() => {
        this.playListFlag = false;
      }, 4000);
    },
    mucmouseenterfunc() {
      clearTimeout(this.timeout);
      clearTimeout(this.timeout1);
      clearTimeout(this.timeout2);
      this.mucflag = false;
      this.bgColor = "rgba(221,214,223,0.6)";
    },

    openlist() {
      this.playListFlag = !this.playListFlag;
    },

    play() {
      if (this.audio.paused) {
        this.audio.src = this.currentTrack.url;
        this.audio.play();
        this.isTimerPlaying = true;
      } else {
        this.audio.pause();
        this.isTimerPlaying = false;
      }
    },
    generateTime() {
      let width = (100 / this.audio.duration) * this.audio.currentTime;
      this.barWidth = width + "%";
      this.circleLeft = width + "%";
      let durmin = Math.floor(this.audio.duration / 60);
      let dursec = Math.floor(this.audio.duration - durmin * 60);
      let curmin = Math.floor(this.audio.currentTime / 60);
      let cursec = Math.floor(this.audio.currentTime - curmin * 60);
      if (durmin < 10) {
        durmin = "0" + durmin;
      }
      if (dursec < 10) {
        dursec = "0" + dursec;
      }
      if (curmin < 10) {
        curmin = "0" + curmin;
      }
      if (cursec < 10) {
        cursec = "0" + cursec;
      }
      this.duration = durmin + ":" + dursec;
      this.currentTime = curmin + ":" + cursec;
    },
    updateBar(x) {
      let progress = this.$refs.progress;
      let maxduration = this.audio.duration;
      let position = x - progress.offsetLeft;
      let percentage = (100 * position) / progress.offsetWidth;
      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }
      this.barWidth = percentage + "%";
      this.circleLeft = percentage + "%";
      this.audio.currentTime = (maxduration * percentage) / 100;
      this.audio.play();
    },
    clickProgress(e) {
      this.isTimerPlaying = true;
      this.audio.pause();
      this.updateBar(e.pageX);
    },
    prevTrack() {
      this.transitionName = "scale-in";
      this.isShowCover = false;
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
      } else {
        this.currentTrackIndex = this.tracks.length - 1;
      }
      this.gettrack(this.tracks[this.currentTrackIndex].id);
    },
    selectplay(item, index) {
      this.currentTrackIndex = index;
      this.gettrack(item.id);
    },
    nextTrack() {
      this.transitionName = "scale-out";
      this.isShowCover = false;
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++;
      } else {
        this.currentTrackIndex = 0;
      }
      this.gettrack(this.tracks[this.currentTrackIndex].id);
    },

    async gettrack(id) {
      let flag = await this.reqSong({
        api: `check/music?id=${id}`
      });
      if (flag.success) {
        let m = await this.reqSong({
          api: `song/url?id=${id}`
        });
        this.currentTrack = m.data[0];
        this.resetPlayer();
        this.audio.play();
        this.isTimerPlaying = true;
      } else {
        alert(flag.message);
      }
    },

    favorite() {
      this.tracks[this.currentTrackIndex].favorited = !this.tracks[
        this.currentTrackIndex
      ].favorited;
    },
    resetPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      this.audio.currentTime = 0;
      this.audio.src = this.currentTrack.url;
      setTimeout(() => {
        if (this.isTimerPlaying) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }, 300);
    },

    // let zhe dom can move by move zhe mouse
    mousedown(event) {
      this.selectElement = document.getElementById("music");
      let div1 = this.selectElement;
      this.selectElement.style.cursor = "move";
      this.isDowm = true;
      let distanceX = event.clientX - this.selectElement.offsetLeft;
      let distanceY = event.clientY - this.selectElement.offsetTop;
      document.onmousemove = function(ev) {
        let oevent = ev || event;
        div1.style.left = oevent.clientX - distanceX + "px";
        div1.style.top = oevent.clientY - distanceY + "px";
      };
      document.onmouseup = function() {
        document.onmousemove = null;
        document.onmouseup = null;
        div1.style.cursor = "default";
      };
    },

    async getlist() {
      let res = await this.reqSong({
        api: this.playlistapi
      });
      this.musicdata = res;
      let idlists = [];

      res.playlist.trackIds.forEach(e => {
        idlists.push(e.id);
      });
      if (idlists.length > 0) {
        let req = await this.reqSong({
          api: "song/detail?ids=" + idlists.join(",")
        });

        this.tracks = req.songs;

        let m = await this.reqSong({
          api: `song/url?id=${req.songs[0].id}`
        });

        this.currentTrack = m.data[0];
      }
    },

    async reqSong(json) {
      let res = await axios.get(this.musicserve + json.api);
      return res;
    }
  },
  mounted() {
    // setTimeout(this.mucmouseleavefunc, 6000);

    let vm = this;

    this.audio = new Audio();
    // this.audio.src = this.currentTrack.source;
    this.audio.ontimeupdate = function() {
      vm.generateTime();
    };
    this.audio.onloadedmetadata = function() {
      vm.generateTime();
    };
    this.audio.onended = function() {
      vm.nextTrack();
      this.isTimerPlaying = true;
    };

    // this is optional (for preload covers)
    for (let index = 0; index < this.tracks.length; index++) {
      const element = this.tracks[index];
      let link = document.createElement("link");
      link.rel = "prefetch";
      link.href = element.cover;
      link.as = "image";
      document.head.appendChild(link);
    }

    this.mucmouseleavefunc();
  },

  // http://39.105.168.171:3000/playlist/detail?id=2801005211
  created() {
    this.getlist();
  }
};
</script>

<style scoped>
/* 按钮样式 */
.cyclingstyle {
  margin: 0px;
  transition: all 0.8s ease;
  position: fixed;
  overflow: hidden;
  animation-name: cycle;
  animation-iteration-count: 1;
}

@keyframes cycle {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(26000deg);
  }
}

.musictool1 {
  display: flex;
  padding: 16px;
}
.musictool2 {
  display: block;
}
.abstyle {
  margin: 0px;
  width: 0;
  position: absolute;
  transition: all 0.8s;
  overflow: hidden;
}

.restyle {
  transition: all 0.8s;
  position: relative;
}

.restyle:nth-child(1) {
  margin-left: 0px;
}

.restyle:nth-child(2) {
  margin-left: 30px;
}

.restyle:nth-child(3) {
  margin-left: 30px;
}

.restyle:nth-child(4) {
  margin-left: 30px;
}

.restyle:nth-child(5) {
  margin-left: 30px;
}

/* 背景样式 */
.closelist {
  background: rgba(255, 255, 255, 0);
}

.showlist {
  background: radial-gradient(
    200% 100% at bottom center,
    #f7f7b6,
    #e96f92,
    #75517d,
    #1b2947
  );
  background: radial-gradient(
    220% 105% at top center,
    #1b2947 10%,
    #75517d 40%,
    #e96f92 65%,
    #f7f7b6
  );
}

/* 表格相关样式 */
.isactive {
  background: red;
}
.inseticon {
  cursor: pointer;
  margin-top: 6px;
  text-align: center;
  width: 1.2em;
  height: 1.2em;
  fill: rgba(255, 255, 255, 0.6);
}
.tabtop td {
  height: 25px;
  line-height: 150%;
}

.tabtop1 td {
  height: 25px;
  line-height: 150%;
  background-color: rgba(255, 255, 255, 0.7);
}

.otdstyle {
  background-color: rgba(255, 255, 255, 0.5);
}

.etdstyle {
  background-color: rgba(255, 255, 255, 0.7);
}

h2,
p {
  margin: 0;
  padding: 0;
}

.barstyle {
  overflow: hidden;
  transition: all 0.9s ease;
  display: flex;
}

.barstyle1 {
  padding: 4px;
  height: 90px;
  width: 100%;
}

.barstyle2 {
  height: 0px;
}

.liststyle {
  width: 100%;
  transition: height 0.9s ease;
}

.liststyle1 {
  height: 660px;
  overflow: scroll;
}

.liststyle2 {
  height: 0;
  overflow: hidden;
}

/*滚动条样式*/
.liststyle::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 0px;
}

.liststyle::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  box-shadow: inset 0 0 5px rgba(230, 203, 233, 0.2);
  background: rgba(255, 255, 255, 0.3);
}

.liststyle::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(223, 206, 235, 0.2);
  border-radius: 5px;
  background: rgba(234, 204, 235, 0.1);
}

.titlestyle {
  margin-left: 8px;
  text-align: start;
  position: relative;
  width: 300px;
  color: rgba(240, 248, 255, 0.6);
}
</style>
