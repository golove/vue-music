<template>
  <div
    @mouseenter.stop="mucmouseenterfunc"
    @mouseleave.stop="mucmouseleavefunc"
    @mousedown="mousedown"
    id="music"
    class="musicstyle"
    :class="mucflag?'':playListFlag||barflag?'showlist':''"
  >
    <div v-if="musicdata.playlist" class="barstyle" :class="barflag?'barstyle1':'barstyle2'">
        <img  height="85px" width="auto" :src="musicdata.playlist.coverImgUrl" alt />
        <div style="color:rgba(255,255,255,.6)">
          
          <div style="display:flex;paddingLeft:0">
          <h2>{{musicdata.playlist.name}}</h2>
            <img
              height="30px"
              width="30px"
              style="borderRadius:50%;"
              :src="musicdata.playlist.creator.avatarUrl"
              alt
            />
            <p style="marginLeft:4px">{{musicdata.playlist.creator.nickname}}</p>
          </div>
          <p style="marginLeft:4px">标签:{{musicdata.playlist.tags.join('/')}}</p>
          <p style="marginLeft:4px">简介:{{musicdata.playlist.description}}</p>
        
        </div>
      </div>
      
      <div v-show="playListFlag||barflag" ref="progress" style="width:100%;height:3px;background:rgba(255, 255, 255, 0.8)">
        <div :style="{width:barWidth}" style="height:3px;background:rgba(250, 30, 30, 0.8)"></div>
        
        </div>

    <div v-if="audio" class="musictool" :class="!mucflag?'musictool1':'musictool2'" >
   
      <music-item :style="{animationDuration:audio.duration+'s',zIndex:3}"
      :class="mucflag?isTimerPlaying?'cyclingstyle':'abstyle':'restyle'" :size="size" :color="!mucflag?color:mColor" :bgcolor="bgcolor" @clickfunc="barflag=!barflag">
        <use  slot="icon" xlink:href="../../assets/icon/myicon.svg#music3" />
      </music-item>
      
      <music-item  :class="mucflag?'abstyle':'restyle'" :size="size" :color="color" :bgcolor="bgcolor" @clickfunc="prevTrack">
        <use slot="icon" xlink:href="../../assets/icon/myicon.svg#prev2" />
      </music-item>

      <music-item
      :class="mucflag?'abstyle':'restyle'"
        v-if="isTimerPlaying"
        :size="size"
        :color="color"
        :bgcolor="bgcolor"
        @clickfunc="play"
      >
        <use slot="icon" xlink:href="../../assets/icon/myicon.svg#pause2" />
      </music-item>

      <music-item  :class="mucflag?'abstyle':'restyle'" v-else :size="size" :color="color" :bgcolor="bgcolor" @clickfunc="play">
        <use slot="icon" xlink:href="../../assets/icon/myicon.svg#play2" />
      </music-item>

      <music-item :class="mucflag?'abstyle':'restyle'" :size="size" :color="color" :bgcolor="bgcolor" @clickfunc="nextTrack">
        <use slot="icon" xlink:href="../../assets/icon/myicon.svg#next2" />
      </music-item>
      
      <music-item :class="mucflag?'abstyle':'restyle'" :size="size" :color="color" :bgcolor="bgcolor" @clickfunc="openlist">
        <use slot="icon" xlink:href="../../assets/icon/myicon.svg#playlist" />
      </music-item>
    </div>


    <div :class="playListFlag?'liststyle1':'liststyle2'" class="liststyle">
      
      <table width="100%" border="0" cellspacing="0" cellpadding="4" class="tabtop1" align="center">
        <tr>
          <td colspan="2" rowspan="2"></td>
          <td>music name</td>
          <td>artist</td>
        </tr>
      </table>
      <table width="100%" border="0" cellspacing="0" cellpadding="4" class="tabtop" align="center">
        <!-- -->
        <tr
          :class="currentTrack.id==item.id?'isactive':index%2==0?'otdstyle':'etdstyle'"
          @dblclick="selectplay(item,index)"
          v-for="(item,index) in tracks"
          :key="item.id"
        >
          <td>
            <svg  @click="selectplay(item,index)" class="inseticon">
              <use
                v-if="currentTrack.id==item.id&&isTimerPlaying"
                xlink:href="../../assets/icon/myicon.svg#pause"
              />
              <use xlink:href="../../assets/icon/myicon.svg#play" v-else />
            </svg>
          </td>
          <td>{{item.name}}</td>
          <td>{{item.ar[0].name}}</td>
          
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import musicItem from "./musicItem.vue";
export default {
  components: { musicItem },
  data() {
    return {
      musicserve: "http://39.105.168.171:3000",
      barflag:true,
      bgcolor: "rgba(221,214,223,1)",
      color: "#1b2947",
      mColor:'#f44336',
      size: "35",
      timeout: Function,
      timeout1:Function,
      timeout2:Function,
      playListFlag: false,
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
      transitionName: null
    };
  },
  methods: {
    mucmouseleavefunc() {
      this.timeout = setTimeout(() => {
        this.mucflag = true
        this.bgcolor= "rgba(221,214,223,1)"
      }, 4000)
        this.timeout1 = setTimeout(() => {
        this.barflag = false
      }, 3000);
      
      this.timeout2 = setTimeout(() => {
        this.playListFlag = false;
      }, 2000);
    
    },
    mucmouseenterfunc() {
      clearTimeout(this.timeout);
      clearTimeout(this.timeout1);
      clearTimeout(this.timeout2);
      this.mucflag = false;
      this.bgcolor= "rgba(221,214,223,0.6)"
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
      let flag = await this.reqSong({ api: `/check/music?id=${id}` });
      if (flag.success) {
        let m = await this.reqSong({
          api: `/song/url?id=${id}`
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
        api: "/playlist/detail?id=2801005211"
      });
      
      this.musicdata = res;
      let idlists = [];

      res.playlist.trackIds.forEach(e => {
        idlists.push(e.id);
      });

      let req = await this.reqSong({
        api: "/song/detail?ids=" + idlists.join(",")
      });

      this.tracks = req.songs;
      let m = await this.reqSong({
        api: `/song/url?id=${req.songs[0].id}`
      });

      this.currentTrack = m.data[0];
    },

    async reqSong(json) {
      let res = await this.$axios.get(this.musicserve + json.api);
      return res.data;
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
  },

  // http://39.105.168.171:3000/playlist/detail?id=2801005211
  created() {
    this.getlist();
  }
};
</script>

<style scoped>


.cyclingstyle{
margin:0px;
transition:all .8s ease;
position:fixed;
overflow: hidden;
animation-name:cycle;
animation-iteration-count:1;
}
@keyframes cycle{
from{transform:rotate(0deg)}
to{transform:rotate(26000deg)}
}
.inseticon {
cursor:pointer;
  margin-top: 6px;
  text-align: center;
  width: 1.2em;
  height: 1.2em;
  fill: rgba(255, 255, 255, 0.6);
}

.abstyle {
margin:0px;
transition:all .8s ease;
position:fixed;

overflow: hidden;
  
}

.restyle {
  width: 300px;
  transition:all .8s;
 
}
  .restyle:nth-child(1){
    margin-left:0px ;
  }
  .restyle:nth-child(2){
    margin-left:70px ;
  }
  .restyle:nth-child(3){
    margin-left:140px ;
  }
  .restyle:nth-child(4){
    margin-left:210px ;

  }
  .restyle:nth-child(5){
    margin-left:290px ;

  }


.musictool {
padding:8px;
position:relative;

}
.musictool1 {

display:flex;
justify:start;
height:50px;
width:100%;

}
.musictool2 {

width:0%;

}

.musicstyle {
  position: absolute;
  height: auto;
  transition: background 1s;
  
  background-attachment: fixed;
  overflow: hidden;
  
}
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
.active {
  color: red;
}


.isactive {
  background: red;
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

.barstyle{
overflow:hidden;
transition:all 0.9s ease;
display:flex;
}
.barstyle1{
padding:4px;
height:90px;
width:100%
}
.barstyle2{
height:0px;
}


.liststyle {

 width: 100%;
transition:height 0.9s ease;
 
}
.liststyle1 {
  height: 560px;
  overflow: scroll;
}
.liststyle2 {  
  height:0;
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

</style>
