# react_hands-on_project
Reactの復習もかねてハンズオン用のプロジェクトを作成してみました。プロジェクトはvue-cliで作成しているのでwebpackのconfig周りでは使用していないvue周りの設定が残っていると思います。

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# React事始め
## 最初のコンポーネントを追加する
### まずは表示だけしてみる
vue-cliで作成したプロジェクトをreact化した続きから進めていきたいと思います。まず最初のコンポーネントを追加してみたいと思います。
'src/components/first-component.js'を追加して以下の内容にしてください。
```
import React, { Component } from 'react';

export default class FirstComponent extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        <h1>Hello, React!</h1>
      </div>
    );
  }
}
```
特に値を受け取って表示するわけでもない上記コンポーネントをまずは表示できるようにしてみたいと思います。'main.js'を以下の内容にして'npm run dev'で動作が確認できます。
```
import React from 'react'
import { render } from 'react-dom'

import FirstComponent from './components/first-component'

render(
  <FirstComponent />
  , document.getElementById('app')
);
```

###　stateの値を表示してみる
今度はstateの値を表示できるようにしてみたいと思います。Reactではstateに似た概念としてpropsがありますがこれは親から受け取るプロパティはpropsにセットされ自分自身のコンポーネントで使う値はstateにセットするというもので、コンポーネント初期化時に呼び出されるconstructor(props)の中身を見たらどんな動きをしているのかわかると思います。

```
import React, { Component } from 'react';

export default class FirstComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      copyText: '',
    };
  }

  textFromInput(e) {
     this.setState({ copyText: e.target.value });
  }

  render() {
    return (
      <div>
        <h1>Hello, React!</h1>
        <input name="a" type="text" placeholder="from text" onChange = { this.textFromInput.bind(this) } /><br />
        <input name="a" type="text"  hintText="to text" value = { this.state.copyText } readOnly="readonly" /><br />
      </div>
    );
  }
}
```
### propsで引き継いだ値を子コンポーネントで利用する
まずpropTypesの宣言周りで必要になるのでbabelにpresetプラグインを有効化します。現在0から1,2,3と機能が異なるpresetが用意されていて具体的にどれを使えばよくわかっていないのですが、vue-cliでプロジェクトを作成した時に入っていたpreset-2を指定しておきたいと思います。.babelrcを以下のように修正します。
```
{
  "presets": [ "es2015", "react", "stage-2"]
}
```
それから、親からの値を受け取る側のコンポーネントを準備します。以下の"src/components/child-component.js"を作成します。
```
import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class ChildComponent extends Component {
  static propTypes = {
    copyText: PropTypes.string.isRequired
  }
  static defaultProps = {
    copyText: 'init val'
  }
  constructor(props) {
    super(props);
  }

  render() {
    const { copyText } = this.props;
    return (
      <div>
        <label>{ copyText }</label>
      </div>
    );
  }
}
```
次に値を受け渡す側"src/components/first-componet.js"を以下のように修正します。
```
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ChildComponent from './child-component';

export default class FirstComponent extends Component {
  static propTypes = {
    copyText: PropTypes.string.isRequired
  }
  static defaultProps = {
    copyText: 'copy text'
  }
  constructor(props) {
    super(props);
    this.state = {
      copyText: 'copy text',
    };
  }

  textFromInput(e) {
     this.setState({ copyText: e.target.value });
  }

  render() {
    const { copyText } = this.state;


    return (
      <div>
        <h1>Hello, React!</h1>
        <input name="a" type="text" placeholder="from text" onChange = { this.textFromInput.bind(this) } /><br />
        <input name="a" type="text"  placeholder="to text" value = { this.state.copyText } readOnly="readonly" /><br />
        <ChildComponent copyText={ copyText }/>
      </div>
    );
  }
}
```
renderの呼び出しで新しく作成したChildComponentコンポーネントのプロパティ'copyText'にテキスト入力した値が入るようになっています。ChildComponenは受け取ったプロパティをラベルでそのまま出すようにしておりまして動かしてみるとそれが確認できるかと思います。

ちなみに今回新しく追加したChildComponentは親コンポーネントのrenderメソッドで直接タグを記入していましたが、以下のようなコンポーネントを返すメソッドを用意しておいてrender内で呼び出すようにすることでも同様の動きになります。
```
renderItem(copyText){
  return (
    <ChildComponent copyText={ copyText }/>
  )
}
```
```
呼び出しサンプル
render() {
  const { copyText } = this.state;
  return (
    <div>
      <h1>Hello, React!</h1>
      <input name="a" type="text" placeholder="from text" onChange = { this.textFromInput.bind(this) } /><br />
      <input name="a" type="text"  placeholder="to text" value = { this.state.copyText } readOnly="readonly" /><br />
      {this.renderItem(copyText)}
    </div>
  );
}
```
表示する内容を条件によって切り替える必要があるけどコンポーネントを分けるまでもない場合で、renderメソッド内をごちゃごちゃさせたくないという場合があるのでしたらこの方が良い場合もあるかもしれませんが、ルールを決めておかないと逆にわかりづらくなりそうなので注意が必要です。この辺りが柔軟そうなのは助かりそうではあります。

## react-eduxを利用する
### Reduxでコンポーネンの値を変更してみる
先ほどは親コンポーネントのプロパティを直接子コンポーネントに渡して連携していました。今度はReduxのフレームワークを使用してコンポーネント間の連携を行っていきたいと思いまして、reactであれば[react-redux](https://github.com/reactjs/react-redux)というモジュールが公式から出ているのでこちらを利用したいと思います。    
まずReduxについての簡単な概要ですが、single-page-applicationの誕生により以前よりも多くの状態を管理する必要が出てきていましてFluxというフレームワーク
ではデータの流れを一方通行にしてしまうことで、例えばコンポーネント間でのデータのやりとりでそれぞれのコンポーネントが実データを更新する処理を行っているのであれば管理しづらくなるので
それを打開するため状態を更新する場合は共通のアクションを呼び出すなどしてデータを一方通行にするといった方法が出てきています。ReduxというのはFluexの実装の一つという位置づけのようなもので
厳密なFluxよりかはReactから扱いやすいように変更が加えられたものとなっています。

必要なモジュールがインストールし忘れていたのでインストール
> npm install --save react-redux
> npm install --save redux-thunk
> npm install babel-plugin-transform-decorators-legacy --save-dev

react-redux, redux-thunkについてはreact-redux関連のモジュールと想像がつくと思います。babel-plugin-transform-decorators-legacyについてはreduxが生成するstateをコンポーネントに関連付けるのに使用する@connetアノテーションで必要になります。    
まず.babelrcを修正してbabel-plugin-transform-decorators-legacyを有効にするようにしたいと思います。
```
{
  "presets": [ "es2015", "react", "stage-2"],
  "plugins": ["transform-decorators-legacy"]
}
```
次に"src/define/action/sample-action-define.js"に今回追加するアクションの定数定義を追加します。
```
export const CHANGE_TEXT = 'CHANGE_TEXT'
```

"src/reducers/sample-reducer.js"にstate更新に使用するreducerを追加します。これはコンポーネント側がアクションを呼び出して来た場合にここでstateの更新を行います。
```
import { CHANGE_TEXT } from '../define/action/sample-action-define'

const initialState = {
    text : 'init text'
  };

export default function sampleReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_TEXT:
      return Object.assign({}, state, { text: action.text})

    default:
      return state
  }
}
```

それから"src/reducers/index.js"にreducerをマージするためのメソッドを追加します。今回使用するReducerは一つだけなのであまり恩恵を感じないですが、複数のReducerが必要になる場合はこういったようにマージするメソッドがあった方が良さそうです。
```
import { combineReducers } from 'redux'
import sampleReducer from './sample-reducer'

const rootReducer = combineReducers({
  sampleReducer
})
export default rootReducer
```

Reducerを呼び出すアクションを"src/actions/sample-action.js"に追加します。アクション自体はコンポーネントがディスパッチという関数を使うことで呼び出すことができます。
```
import * as types from '../define/action/sample-action-define'

export function change_text(text) {
  return { type: types.CHANGE_TEXT, text: text }
}
```

stateを管理する大元であるstoreを"src/store/store-config.js"に作成します。applyMiddleware後にfinalCreateStoreやっているところでstoreを生成しています。applyMiddlewareについてはreactにおけるミドルウェアの機能を使う時に必要になるもので例えばログ出力や他サーバにリクエストを投げる場合などに利用されます。今回はミドルウェアを使用することもないのでapplyMiddlewareを使わずにcreateStoreだけでも良いはずですが、後からミドルウェアを使うことを想定し先にこの書き方にしておきます。module.hotの判定式の内部ではreduxを使う場合にホットリロードを行うための設定となっておりまして、これがない場合は開発車モードで起動中にファイルを保存するたびにstateが初期化されるのを防ぐためにあった方が良さそうなものです。
```
import { createStore, applyMiddleware  } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'

export default function StoreConfig(preloadedState) {
  const finalCreateStore = applyMiddleware(thunk)(createStore);
  const store = finalCreateStore(rootReducer, preloadedState);
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default
      store.replaceReducer(nextReducer)
    })
  }
  return store
}
```

Reactにreduxのstateを私て扱えるようにする。"src/main.js"が以下になるようにします。ここではreact-reduxモジュールのProviderコンポーネントにstoreを渡しています。
```
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import FirstComponent from './components/first-component'
import StoreConfig from './store/store-config'

const store = StoreConfig()
render(
  <Provider store={store}>
    <FirstComponent />
  </Provider >
  , document.getElementById('app')
);
```

それではReduxのstateを利用する側である"src/components/first-component.js"を以下のように修正します。mapStateToPropsにはstateの値が、mapDispatchToPropsにはディスパッチするために必要となるメソッドが格納されています。@connect(mapStateToProps, mapDispatchToProps)のアノテーションでreduxのstoreを渡しています。propTypesのプロパティと、textに変更があった時に呼び出すメソッドの情報が入っていてRenderメソッドではこれを使用して描画を行っています。またテキスト入力を行った際に呼び出されるtextFromInput内で"this.props.change_text(e.target.value)"でアクションを呼び出した上でディスパッチしてReducerにより新しいstateが発行されます。
```
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ChildComponent from './child-component';

import * as SampleAction from '../actions/sample-action';

function mapStateToProps(state) {
  const { text } = state.sampleReducer
  return {
    text: text
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators( Object.assign({}, SampleAction), dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class FirstComponent extends Component {
  static propTypes = {
    change_text: PropTypes.func.isRequired,
    text: PropTypes.string
  }
  constructor(props) {
    super(props);
  }

  textFromInput(e) {
    this.props.change_text(e.target.value)
  }

  renderItem(text){
    return (
      <ChildComponent copyText={ text }/>
    )
  }

  render() {
    const { text } = this.props;
    return (
      <div>
        <h1>Hello, React!</h1>
        <input name="a" type="text" placeholder="from text" onChange = { this.textFromInput.bind(this) } /><br />
        <input name="a" type="text"  placeholder="to text" value = { text } readOnly="readonly" /><br />
        <ChildComponent copyText={ text }/>
      </div>
    );
  }
}
```

これで動かしてみるとeslintにno-undefとか怒られるはずなので、.eslintrc.jsを以下のように修正し再度"npm run dev"で動画確認できるはずです。
```
'rules': {
  // allow paren-less arrow functions
  'arrow-parens': 0,
  // allow async-await
  'generator-star-spacing': 0,
  'react/jsx-uses-vars': 1,
  // allow debugger during development
  'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
  'no-undef': 0,
  'no-console': 0,
}
```

### 子のコンンポーネントからアクションを呼び出してみる
子のコンポーネントにも直接storeで管理しているstateを関連付けて利用することができる。以下の修正を加えることでテキストのstateを空白にするアクションを呼び出すようにすることができる。
```
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as SampleAction from '../actions/sample-action';

function mapStateToProps() {
  return {}
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators( Object.assign({}, SampleAction), dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ChildComponent extends Component {
  static propTypes = {
    change_text: PropTypes.func.isRequired,
    copyText: PropTypes.string.isRequired
  }
  static defaultProps = {
    copyText: 'init val'
  }
  constructor(props) {
    super(props);
  }

  clearText() {
    this.props.change_text("")
  }

  render() {
    const { copyText } = this.props;
    return (
      <div>
        <label>{ copyText }</label><br />
        <button onClick = { this.clearText.bind(this) }>クリア</button>
      </div>
    );
  }
}
```
今回は直接storeの値を関連付けるようにしているが、親コンポーネント側で呼び出すアクションなりを変更できるようにしたいのであればpropsとして親のコンポーネントから子のコンポーネントに直接渡せるようにしたら良さそうに思います。

## 表示について
### リストを表示してみる
リストのデータを表示する場合は以下のようになります。
```
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ListComponent extends Component {
  static propTypes = {
    listData: PropTypes.array
  }
  static defaultProps = {
    listData: [{}
    ]
  }
  constructor(props) {
    super(props);
    this.state = {
      listData: [
        {id: 1, name: "山田一郎"},
        {id: 2, name: "田中二郎"},
        {id: 3, name: "佐藤三郎"}
      ]
    }
  }

  render() {
    const listData = this.state.listData
    return (
      <ul className="user-list">
        {listData.map((user, i) =>
          <div key={i}><li>{ user.name } </li></div>
        )}
      </ul>
    );
  }
}
```

renderの部分は以下のように書き換えることもできる
```
userRender(userList){
  return (
    <ul className="user-list">
      {userList.map((user, i) =>
        <div key={i}><li>{ user.name } </li></div>
      )}
    </ul>
  )
}

render() {
  const listData = this.state.listData
  return (
    <div>
      { this.userRender(listData) }
    </div>
  );
```
または以下のような書き方もできる
```
userRender(userList){
  const userListView = []
  userList.map((user, i) =>
    userListView.push(<div key={i}><li>{ user.name } </li></div>)
  )
  return (
    <ul className="user-list">
      { userListView }
    </ul>
  )
}

render() {
  const listData = this.state.listData
  return (
    <div>
      { this.userRender(listData) }
    </div>
  );
}
```

### webpackのcss-loaderを使ってみる
react,webpackでの環境でスタイルを適用する方法は複数あるのですが、まずはhtmlのheadタグの中にstyleを書き込んですべてのコンポーネントが適用対象にするのがなじみ深いと思いますのでそれから試してみたいと思います。webpackのcss-loaderを使ってbootstrapを読み込むようにしたいと思います。適用するのは簡単でbootstrapからファイル一式をダウンロードしてきて'src/assets/bootstrap'にダウンロードしたすべてのファイルを写した上で"src/main.js"に以下のimportを追加するだけになっております。
```
import './assets/bootstrap/css/bootstrap.min.css'
```
これで動きを見てみるとheadタグの中にstyleが書き込まれているのが分かります。今回はcssで試しましたがsassやstylusもwebpack側で読み込んで使うことができます(別途loader用のプラグインインストールが必要になるかもしれないです)。

### CSS-in-JSを試してみる
Reactではcssをstyle属性として扱っていましてCSS-in-JSはCSSの記法で書いたスクリプトをを直接style属性として扱えるようにするものとなっております。例えば"src/style/sample.css.js"が以下の内容だったとする場合
```
export default {
  ul: {
    listStyle: 'none',
    marginTop: '20px',
    padding: '0px',
    fontSize: '18px',
  },
  span: {
    paddingLeft: '20px',
  }
}
```
コンポーネント側では以下のようにインポートしてstyle属性を設定することができます。
```
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from '../style/sample.css.js';

export default class ListComponent extends Component {
  static propTypes = {
    listData: PropTypes.array
  }
  static defaultProps = {
    listData: [{}
    ]
  }
  constructor(props) {
    super(props);
    this.state = {
      listData: [
        {id: 1, name: "山田一郎"},
        {id: 2, name: "田中二郎"},
        {id: 3, name: "佐藤三郎"}
      ]
    }
  }

  render() {
    const listData = this.state.listData
    return (
      <ul style={styles.ul}>
        {listData.map((user, i) =>
          <li key={i}><span>{ user.id }</span><span style={styles.span}>{ user.name } </span></li>
        )}
      </ul>
    );
  }
}
```
またjsのプロパティとして扱っているだけなのでcss用にファイルを分ける必要もなく、以下のようにスタイルを設定することもできます。
```
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ListComponent extends Component {
  static propTypes = {
    listData: PropTypes.array
  }
  static defaultProps = {
    listData: [{}
    ]
  }
  constructor(props) {
    super(props);
    this.state = {
      listData: [
        {id: 1, name: "山田一郎"},
        {id: 2, name: "田中二郎"},
        {id: 3, name: "佐藤三郎"}
      ],
      style: {
        ul: {
          listStyle: 'none',
          marginTop: '20px',
          padding: '0px',
          fontSize: '18px',
        },
        span: {
          paddingLeft: '20px',
        }
      }
    }
  }

  render() {
    const listData = this.state.listData
    const style = this.state.style
    return (
      <ul style={style.ul}>
        {listData.map((user, i) =>
          <li key={i}><span>{ user.id }</span><span style={style.span}>{ user.name } </span></li>
        )}
      </ul>
    );
  }
}
```
デザイナーではないので良くわからないのですが、基本的にはcss-loaderの機能だけでスタイルを調整して動的に変更したい場合とかがあったらCSS-in-JSを使うとかの方がシンプルで良さそうな気がしました。


## routerを使ってみる
react-routerのバージョン変更による影響が大きいので実施しるタイミングによって設定が結構変わってきそうです。自分が試した時はv4がリリースされていたので以下のコマンドでモジュールをインストールしたところv4.1.1が入りました。
> npm install --save react-router-dom    

"src/main.js"を以下のように修正することで利用できます。
```
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import StoreConfig from './store/store-config'

import './assets/bootstrap/css/bootstrap.min.css'
import './assets/css/main.css'

import {  BrowserRouter, Route, Switch } from 'react-router-dom';
import FirstConponent from './components/first-component';
import ListComponent from './components/list-component';


const store = StoreConfig()

render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={FirstConponent} />
        <Route exact path="/first" component={FirstConponent} />
        <Route exact path="/list" component={ListComponent} />
      </Switch>
    </BrowserRouter>
  </Provider >
  , document.getElementById('app')
);
```
ここでは"http://localhost:8888/"及び"http://localhost:8888/first"でアクセスした時にFirstConmponentを表示し"http://localhost:8888/list"でアクセスした時にListConponentを表示する動きになります。urlからパラメータを受け取ったりテスト方法であったりは公式の方から確認いただければと思います。

## ミドルウェアを使ってみる
それではReactを使う上で結構肝になりそうなミドルウェアを試してみたいと思います。まず簡単なログ出力を行ってみます。

### ログを出力する
アクションが実行されるタイミングでミドルウェア側でconsole出力できるようにしたいと思います。まず"src/midleware/logger.js"を以下の内容で作成します。
```
const logger = function actionDebugMiddleware() {
  return next => action => {
    console.info(action.type, action);
    next(action);
  };
};

export default logger
```
次に"src/store/store-config.js"側でミドルウェアを使うように修正を加えます。
```
import { createStore, applyMiddleware  } from 'redux'
import thunk from 'redux-thunk'
import logger from '../midleware/logger'
import rootReducer from '../reducers'

export default function StoreConfig(preloadedState) {
  const finalCreateStore = applyMiddleware(thunk, logger )(createStore);
  const store = finalCreateStore(rootReducer, preloadedState);
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default
      store.replaceReducer(nextReducer)
    })
  }
  return store
}
```
これで動きを確認してみるとアクションがディスパッチして新しいstateを出力する直前でログ出力のミドルウェアがコンソール出力を行っているのが確認できます。ミドルウェア側ではnext(action)で次のアクションを呼び出すようにchainしているのですがここでactionの内容を修正したりすることで限定的ではありますがaopのように横断的な処理が行えるようです。

### apiを呼び出してみる
次にミドルウェアを利用してapiを呼び出せるようにしてみましょう。今回はwebpackの静的コンテンツとしてjsonを作成しそれに対してgetのリクエストを投げて表示に反映したいと思います。まず以下のダミーデータを"static/dummy.json"のファイル名で追加します。
```
{"user_list":[
    {
        "id":1,
        "name":"藤岡弘"
    },
    {
        "id":2,
        "name":"佐々木剛"
    },
    {
        "id":3,
        "name":"宮内洋"
    },
    {
        "id":4,
        "name":"速水亮"
    },
    {
        "id":5,
        "name":"岡崎徹"
    }
]}
```

次にapiを呼び出すミドルウェアを"src/midleware/api_caller.js"に追加します。今回はjqueryを使ってリクエストを投げます。
```
import {CALL_API} from '../define/action/sample-action-define'
import $      from 'jquery'


const api_caller = function actionApiCall() {

  function remoteService(next, remote){
    $.ajax({
        url: remote.url,
        dataType: remote.dataType,
        type: remote.type,
        data: remote.data,
        cache: false,
        scriptCharset: 'utf-8',
        success: data => {
          const new_action = remote.response_action(data)
          if(new_action.type == CALL_API){
            remoteService(next, new_action.remote)
          }else{
            next(new_action)
          }
        },
        error: data => {
          console.info(data)
        }
    });
  }

  return next => action => {
    if(action.type == CALL_API){
      remoteService(next, action.remote)
    }else{
      next(action)
    }
  };
};


export default api_caller
```
jqueryを使えるようにするため以下のコマンドを実行しておいてください。
> npm install --save jquery  

ここではアクションをディスパッチしてきた時のtypeがCALL_APIであったらajaxでリクエストを投げるようにしています。レスポンスが帰ってきた時に何をするかはディスパッチに受け取ったactionのremote属性に設定されているremote_responseを呼び出すようにしています。ここで使っている定数は"src/define/action/sample-action-define"で以下のように定義しています。
```
export const CHANGE_TEXT = 'CHANGE_TEXT'


export const CALL_API = 'CALL_API'
export const INIT_USER_LIST = 'INIT_USER_LIST'
```

次にミドルウェアとして呼び出せるように"src/store/store-config.js"を以下のように修正します。
```
const finalCreateStore = applyMiddleware(thunk, logger )(createStore);
 ↓
const finalCreateStore = applyMiddleware(thunk, logger, api_caller )(createStore);
```

また、今回api呼び出しで取得するユーザリストの情報はreduxのstateで管理するので以下のリデューサーを"src/reducers/userlist-reducer.js"に追加します。
```
import { INIT_USER_LIST } from '../define/action/sample-action-define';

const initialState = {
    user_list :[{id: '0', name: 'john doh'}]
  };

export default function userListReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_USER_LIST:
      return Object.assign({}, state, action.data)

    default:
      return state
  }
}
```
それから作成したreducerをcombineReducersで既存のものとマージして使えるようにします。
```
import { combineReducers } from 'redux'
import sampleReducer from './sample-reducer'
import userListReducer from './userlist-reducer'

const rootReducer = combineReducers({
  sampleReducer,
  userListReducer
})
export default rootReducer
```

api呼び出しとapi受け取り後に新しいstateをディスパッチするためのアクションを"src/action/api/sample-api-action.js"に追加します。
```
import * as types from '../../define/action/sample-action-define'

export function callApi(remote) {
  return { type: types.CALL_API, remote:remote}
}


export function  user_list_init() {
  const response_action = function(data){
    return {type: types.INIT_USER_LIST, data: data}
  }

  const data = {}
  return createRequestData( process.env.REQUEST_URL.USER_LIST_INIT, 'JSON', 'GET',  data,  response_action);
}

function createRequestData(url, dataType, type, data, response_action){
    return { url: url,
             dataType:dataType,
             type:type,
             data:  data,
             response_action: response_action,
             contentType: 'application/x-www-form-urlencoded; charset=UTF-8' }
}
```
ここではリクエストを呼び出すのに使用するURLをwebpackの環境変数から取得しているのですが、apiのURLを環境変数から取得できるようにするため、"config/request.url.dev.json"を以下の内容で作成します。
```
{
  "USER_LIST_INIT": "/static/dummy.json"
}
```
これは開発時に使うapiのURLになりますので、実運用用のものは"config/request.url.dev.json"に記入しておいてください。それから"config/dev.env.js"でprodEnvにマージさせておいてください。prod.env.jsonも同様です。
```
var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

var devUrl = require('./request.url.dev.json')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  REQUEST_URL: JSON.stringify(devUrl)
})
```
ここのprodEnvは"build/webpack.dev.conf.js"で以下のように環境変数に追加しているので確認できます。
```
new webpack.DefinePlugin({
  'process.env': config.dev.env
}),
```
これでURLを利用するときはprocess.env.REQUEST_URL.xxxxといった感じになるのがわかります。

あとapiを呼び出して利用する側のコンポーネントにも修正が必要なので"src/components/list-component.js"を以下のように修正します。apiの呼び出しはcomponentWillMountのタイミングで行っています。
```
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from '../style/sample.css.js';
import * as SampleApiAction from '../actions/api/sample-api-action'

function mapStateToProps(state) {
  const { user_list } = state.userListReducer
  return {
    user_list: user_list
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators( Object.assign({}, SampleApiAction), dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ListComponent extends Component {
  static propTypes = {
    user_list: PropTypes.array,
    callApi: PropTypes.func.isRequired,
  }
  static defaultProps = {
    user_list: [{}]
  }
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentWillMount() {
    this.props.callApi(SampleApiAction.user_list_init());
  }

  render() {
    const user_list = this.props.user_list
    console.info(user_list)
    return (
      <ul style={styles.ul}>
        {user_list.map((user, i) =>
          <li key={i}><span>{ user.id }</span><span style={styles.span}>{ user.name } </span></li>
        )}
      </ul>
    );
  }
}
```
これで"npm run dev"で起動してみるとapi呼び出しによる初期化が確認できるかと思います。

最後にこれまでの作業を行ってpackage.jsonは最終的に以下のようになりましたので、参考のため載せときます。
```
{
  "name": "react_hands-on_project",
  "version": "1.0.0",
  "description": "A Vue.js project",
  "author": "arimuraterutoshiMac <arimuraterutoshi@192.168.11.6>",
  "private": true,
  "scripts": {
    "dev": "node build/dev-server.js",
    "start": "node build/dev-server.js",
    "build": "node build/build.js",
    "unit": "cross-env BABEL_ENV=test karma start test/unit/karma.conf.js --single-run",
    "e2e": "node test/e2e/runner.js",
    "test": "npm run unit && npm run e2e",
    "lint": "eslint --ext .js,.vue src test/unit/specs test/e2e/specs"
  },
  "dependencies": {
    "jquery": "^3.2.1",
    "react": "^15.5.4",
    "react-dom": "^15.5.4",
    "react-redux": "^5.0.4",
    "react-router-dom": "^4.1.1",
    "redux": "^3.6.0",
    "redux-thunk": "^2.2.0",
    "vue": "^2.2.6",
    "vue-router": "^2.3.1",
    "webpack": "^2.4.1",
    "webpack-dev-server": "^2.4.5"
  },
  "devDependencies": {
    "autoprefixer": "^6.7.2",
    "babel-core": "^6.24.1",
    "babel-eslint": "^6.1.2",
    "babel-loader": "^6.4.1",
    "babel-plugin-istanbul": "^4.1.1",
    "babel-plugin-transform-decorators-legacy": "^1.3.4",
    "babel-plugin-transform-runtime": "^6.22.0",
    "babel-preset-env": "^1.3.2",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-react": "^6.24.1",
    "babel-preset-stage-2": "^6.24.1",
    "babel-register": "^6.22.0",
    "chai": "^3.5.0",
    "chalk": "^1.1.3",
    "chromedriver": "^2.27.2",
    "connect-history-api-fallback": "^1.3.0",
    "copy-webpack-plugin": "^4.0.1",
    "cross-env": "^4.0.0",
    "cross-spawn": "^5.0.1",
    "css-loader": "^0.28.0",
    "eslint": "^3.19.0",
    "eslint-config-standard": "^6.2.1",
    "eslint-friendly-formatter": "^2.0.7",
    "eslint-loader": "^1.7.1",
    "eslint-plugin-html": "^2.0.0",
    "eslint-plugin-promise": "^3.4.0",
    "eslint-plugin-react": "^6.10.3",
    "eslint-plugin-standard": "^2.0.1",
    "eventsource-polyfill": "^0.9.6",
    "express": "^4.14.1",
    "extract-text-webpack-plugin": "^2.0.0",
    "file-loader": "^0.11.1",
    "friendly-errors-webpack-plugin": "^1.1.3",
    "glob-loader": "^0.3.0",
    "html-webpack-plugin": "^2.28.0",
    "http-proxy-middleware": "^0.17.3",
    "inject-loader": "^3.0.0",
    "karma": "^1.4.1",
    "karma-coverage": "^1.1.1",
    "karma-mocha": "^1.3.0",
    "karma-phantomjs-launcher": "^1.0.2",
    "karma-phantomjs-shim": "^1.4.0",
    "karma-sinon-chai": "^1.3.1",
    "karma-sourcemap-loader": "^0.3.7",
    "karma-spec-reporter": "0.0.30",
    "karma-webpack": "^2.0.2",
    "lolex": "^1.5.2",
    "mocha": "^3.2.0",
    "nightwatch": "^0.9.12",
    "opn": "^4.0.2",
    "optimize-css-assets-webpack-plugin": "^1.3.0",
    "ora": "^1.2.0",
    "phantomjs-prebuilt": "^2.1.14",
    "react-hot-loader": "^1.3.1",
    "react-redux": "^5.0.4",
    "rimraf": "^2.6.0",
    "selenium-server": "^3.0.1",
    "semver": "^5.3.0",
    "shelljs": "^0.7.6",
    "sinon": "^2.1.0",
    "sinon-chai": "^2.8.0",
    "url-loader": "^0.5.8",
    "vue-loader": "^11.3.4",
    "vue-style-loader": "^2.0.5",
    "vue-template-compiler": "^2.2.6",
    "webpack": "^2.3.3",
    "webpack-bundle-analyzer": "^2.2.1",
    "webpack-dev-middleware": "^1.10.0",
    "webpack-hot-middleware": "^2.18.0",
    "webpack-merge": "^4.1.0"
  },
  "engines": {
    "node": ">= 4.0.0",
    "npm": ">= 3.0.0"
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ]
}
```
