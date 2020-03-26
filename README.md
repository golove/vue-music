# vue-music-js

## Todo

- [ ] can login by netEaseMusic
- [x] Movable

## Befor install

you shoud install axios at first if your project no axios
```bash
npm install --save axios

# or yarn
yarn add axios

```
```js
// In main.js
import axios from 'axios'
vue.prototype.$axios = axios;

```



## Installation

```bash
npm install --save vue-music-js

# or Yarn
yarn add vue-music-js
```

## Usage

```js
// In main.js
// ...
import Music from 'vue-music-js'

Vue.use(Music)
// ...
```

```js
// In component
// ...
import { Music } from 'vue-music-js'

export default {
  components: {
    Music,
  }
}
// ...
```

```Vue
 <music 
 :musicserve="'http://39.105.168.171:3000/'"
 :playlistapi="'playlist/detail?id=2801005211'"
 :color="'cyan'" 
 :bgcolor="'teal'" 
 :mColor="'red'"
 />

```

---

```js
// on Nuxt.js

// in nuxt.config.js
plugins: [
  {
    src: '~/plugins/vue-music.js', ssr: false
  }
],

// in ~/plugins/vue-music.js
import Vue from 'vue'
import Music from 'vue-music-js'

Vue.use(Music)

// in your page
<music />

```
![](http://yanxuan.nosdn.127.net/5294c0d51645eae55ff5effdfd76be49.png)


### props:
- musicserve:string; webserve providing music services
- playlistapi:string; playlist id
- bgColor:sting; change icon backgroundColor
- color:sting; change icon color
- mColor:sting; change musicIcon color
- size:string ; change icon size

## How to Contribute?

1. fork this project.
2. edit code.
3. PR

_OR_

1. Just submit a issue!

## Contributors

- [golove Park](https://github.com/golove)
- [laughte Park](https://github.com/laughte)

